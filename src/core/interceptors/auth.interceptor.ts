import {
    HttpErrorResponse,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
    BehaviorSubject,
    catchError,
    filter,
    switchMap,
    take,
    throwError,
} from 'rxjs';
import { AuthService } from '../auth/auth.service';

// Đánh dấu đang trong quá trình refresh token
let isRefreshing = false;

// Hàng đợi các request gặp 401 trong lúc đang refresh
const refreshTokenSubject = new BehaviorSubject<boolean | null>(null);

// Không refresh khi các API này trả về 401
const skipRefreshPaths = ['/auth/login', '/auth/logout'];

// Nếu chính API refresh trả về 401 => logout
const refreshPaths = ['/auth/refresh-token'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error) => {
            if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
                return throwError(() => error);
            }

            // Login sai mật khẩu thì trả lỗi luôn
            if (skipRefreshPaths.some((path) => req.url.includes(path))) {
                return throwError(() => error);
            }

            // Refresh token cũng hết hạn -> logout
            if (refreshPaths.some((path) => req.url.includes(path))) {
                authService.logout().subscribe();
                return throwError(() => error);
            }

            return handle401Error(req, next, authService);
        }),
    );
};

function handle401Error(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
    authService: AuthService,
) {
    // Nếu chưa có request nào refresh
    if (!isRefreshing) {
        isRefreshing = true;

        // Khóa hàng đợi
        refreshTokenSubject.next(null);

        return authService.refreshToken().pipe(
            switchMap(() => {
                isRefreshing = false;

                // Báo cho toàn bộ request đang chờ tiếp tục
                refreshTokenSubject.next(true);

                // Clone lại request ban đầu (lúc bị 401) và thực thi lại
                return next(req);
            }),
            catchError((refreshError) => {
                isRefreshing = false;

                // Giải phóng toàn bộ request đang chờ
                refreshTokenSubject.error(refreshError);
                return throwError(() => refreshError);
            }),
        );
    } else {
        // ⏳ KHU VỰC XẾP HÀNG: Nếu đang có một request khác đi refresh rồi...
        return refreshTokenSubject.pipe(
            filter((isTokenRefreshed) => isTokenRefreshed === true), // Đợi cho đến khi subject phát ra 'true'
            take(1), // Chỉ lấy 1 lần kích hoạt duy nhất
            switchMap(() => next(req)), // Chạy lại request cũ với cookie mới đã được cập nhật ngầm
        );
    }
}
