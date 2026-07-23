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

// Biến cờ để kiểm tra xem hệ thống có đang trong quá trình gọi API refresh hay không
let isRefreshing = false;
// Cổng trung gian để giữ chân các request bị 401 sau đó chạy lại khi có token mới
const refreshTokenSubject = new BehaviorSubject<boolean>(false);
const skipRefreshPaths = ['/auth/login'];
const logoutPaths = ['/auth/refresh-token'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                if (skipRefreshPaths.some((p) => req.url.includes(p))) {
                    return throwError(() => error);
                }

                if (logoutPaths.some((p) => req.url.includes(p))) {
                    authService.logout().subscribe();
                    return throwError(() => error);
                }

                return handle401Error(req, next, authService);
            }

            return throwError(() => error);
        }),
    );
};

function handle401Error(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
    authService: AuthService,
) {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(false); // Khóa cổng, bắt các request sau phải chờ

        // Gọi API Refresh Token lên Server (Server tự đọc Refresh Cookie để cấp Access Cookie mới)
        return authService.refreshToken().pipe(
            switchMap(() => {
                isRefreshing = false;
                refreshTokenSubject.next(true); // Mở cổng, báo hiệu cho các request đang xếp hàng chạy tiếp

                // Clone lại request ban đầu (lúc bị 401) và thực thi lại
                return next(req);
            }),
            catchError((refreshError) => {
                isRefreshing = false;
                // Nếu API Refresh cũng lỗi (hết hạn hoàn toàn), đăng xuất người dùng ngay lập tức
                // authService.logout().subscribe();
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
