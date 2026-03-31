import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    catchError,
    throwError,
    switchMap,
    filter,
    take,
} from 'rxjs';
import { UserService } from '../services/user.service';

const EXCLUDED_URLS = [
    '/auth/login',
    '/auth/register',
    '/auth/logout',
    '/auth/refresh-token',
];

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject = new BehaviorSubject<string | null>(null);
    constructor(private userService: UserService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const accessToken = this.userService.getAccessToken();
        if (accessToken) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        }

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (
                    error.status !== 401 ||
                    EXCLUDED_URLS.some((url) => req.url.includes(url))
                ) {
                    return throwError(() => error);
                }

                // nếu đang refresh → chờ
                if (this.isRefreshing) {
                    return this.refreshTokenSubject.pipe(
                        filter((token) => token != null),
                        take(1),
                        switchMap((token) => {
                            const cloned = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                            return next.handle(cloned);
                        }),
                    );
                }

                this.isRefreshing = true;
                this.refreshTokenSubject.next(null);

                return this.userService.refreshToken().pipe(
                    switchMap((res) => {
                        this.isRefreshing = false;

                        this.userService.setTokens(res.accessToken);
                        this.refreshTokenSubject.next(res.accessToken);

                        // retry request cũ
                        const cloned = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${res.accessToken}`,
                            },
                        });

                        return next.handle(cloned);
                    }),
                    catchError((err) => {
                        this.isRefreshing = false;
                        this.userService.logout();
                        return throwError(() => err);
                    }),
                );
            }),
        );
    }
}
