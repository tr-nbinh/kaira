import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    catchError,
    filter,
    finalize,
    Observable,
    switchMap,
    take,
    throwError,
} from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private isRefreshingToken = false;
    private refreshTokenSubject: BehaviorSubject<any> =
        new BehaviorSubject<any>(null);
    private readonly AUTH_URLS_TO_LOGOUT_ON_401 = ['/api/auth/refresh-token'];
    private readonly LOGIN_ENDPOINT = '/api/auth/login';
    private readonly NO_REFRESH_URLS = ['/api/wishlist'];

    constructor(private userService: UserService) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const accessToken = this.userService.getAccessToken();
        if (accessToken) {
            req = this.addToken(req, accessToken);
        }

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    console.log(req.url);
                    if (req.url.includes(this.LOGIN_ENDPOINT)) {
                        return throwError(() => error);
                    }

                    if (this.shouldLogoutOn401(req.url)) {
                        this.userService.logout();
                        return throwError(() => error);
                    }

                    return this.handle401Error(req, next);
                }
                return throwError(() => error);
            })
        );
    }

    private addToken(
        request: HttpRequest<unknown>,
        token: string
    ): HttpRequest<unknown> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    private handle401Error(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            this.refreshTokenSubject.next(null);

            return this.userService.refreshAccessToken().pipe(
                switchMap((response) => {
                    this.isRefreshingToken = false;
                    if (response && response.data) {
                        this.refreshTokenSubject.next(response.data);
                        return next.handle(
                            this.addToken(request, response.data)
                        ); // Retry the original request with new token
                    } else {
                        // If refresh successful but no new access token returned (shouldn't happen with current backend)
                        this.userService.logout();
                        return throwError(
                            () =>
                                new Error(
                                    'refresh successful but no new access token returned'
                                )
                        );
                    }
                }),
                catchError((refreshError) => {
                    this.userService.logout();
                    return throwError(() => refreshError);
                }),
                finalize(() => {
                    this.isRefreshingToken = false;
                })
            );
        } else {
            // If a refresh token request is already in progress,
            // queue the current request until a new access token is available.
            return this.refreshTokenSubject.pipe(
                filter((token) => token !== null), // Wait until a new token is emitted
                take(1), // Take only the first emitted token
                switchMap((accessToken: string) =>
                    // retry original request when new token is returned
                    next.handle(this.addToken(request, accessToken))
                )
            );
        }
    }

    private shouldLogoutOn401(url: string): boolean {
        return this.AUTH_URLS_TO_LOGOUT_ON_401.some((u) => url.includes(u));
    }

    private shouldSkipRefresh(url: string): boolean {
        return this.NO_REFRESH_URLS.some((u) => url.includes(u));
    }
}
