import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
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
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> =
        new BehaviorSubject<any>(null);

    constructor(private userService: UserService, private router: Router) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const accessToken = this.userService.getAccessToken();
        if (accessToken) {
            req = this.addToken(req, accessToken);
        }

        return next.handle(req).pipe(
            catchError((error) => {
                if (
                    error instanceof HttpErrorResponse &&
                    error.status === 401
                ) {
                    // Check if the request is for login or refresh-token endpoint itself.
                    // If so, it's a genuine authentication failure, not an expired access token
                    // that can be refreshed.
                    if (
                        req.url.includes('/api/login') ||
                        req.url.includes('/api/refresh-token')
                    ) {
                        console.error(
                            'Lỗi đăng nhập hoặc lỗi làm mới token trực tiếp:',
                            error
                        );
                        this.userService.logout(); // Force logout if login/refresh fails
                        this.router.navigate(['/auth/login']);
                        return throwError(() => error);
                    }

                    // If 401 and not a login/refresh request, attempt to refresh token
                    return this.handle401Error(req, next);
                }
                // For any other error, re-throw it
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
        // If a refresh token request is already in progress,
        // queue the current request until a new access token is available.
        if (this.isRefreshing) {
            return this.refreshTokenSubject.pipe(
                filter((token) => token !== null), // Wait until a new token is emitted
                take(1), // Take only the first emitted token
                switchMap((accessToken: string) =>
                    next.handle(this.addToken(request, accessToken))
                )
            );
        } else {
            // Start the refresh process
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null); // Clear the token in the BehaviorSubject

            const refreshToken = this.userService.getRefreshToken();
            
            if (refreshToken) {
                // Call the UserService to refresh the access token
                return this.userService.refreshAccessToken(refreshToken).pipe(
                    switchMap((response: any) => {
                        // If refresh successful, update token subject and retry original request
                        if (response && response.accessToken) {
                            this.refreshTokenSubject.next(response.accessToken); // Emit the new access token
                            return next.handle(
                                this.addToken(request, response.accessToken)
                            ); // Retry the original request
                        } else {
                            // If refresh successful but no new access token returned (shouldn't happen with current backend)
                            console.error(
                                'Refresh token thành công nhưng không có access token mới.'
                            );
                            this.userService.logout();
                            this.router.navigate(['/login']);
                            return throwError(
                                () =>
                                    new Error(
                                        'Refresh token thành công nhưng không có access token mới.'
                                    )
                            );
                        }
                    }),
                    finalize(() => {
                        this.isRefreshing = false; // Reset the refreshing flag
                    })
                );
            } else {
                // No refresh token available, force logout
                console.error('Không có refresh token, đăng xuất.');
                this.userService.logout();
                this.router.navigate(['/auth/login']);
                return throwError(() => new Error('Không có refresh token.'));
            }
        }
    }
}
