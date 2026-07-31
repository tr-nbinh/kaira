import { Injectable } from '@angular/core';
import { CacheItem } from './models/cache-item.model';
import { Observable, of, shareReplay, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HttpCacheService {
    // 1. Nơi lưu dữ liệu đã nhận về thành công
    private cache = new Map<string, CacheItem>();

    // 2. Nơi giữ các request đang chạy ngầm (In-Flight Requests) để tránh bắn trùng API
    private inFlightRequests = new Map<string, Observable<any>>();

    /**
     * Thực hiện Cache Request với thời gian sống tùy chọn (mặc định 5 phút)
     * @param key Khóa định danh cache
     * @param request$ Luồng Observable gốc từ HttpClient
     * @param ttlInMinutes Thời gian sống của cache (tính bằng phút)
     */
    cacheRequest<T>(
        key: string,
        request$: Observable<T>,
        ttlInMinutes = 5,
    ): Observable<T> {
        // BƯỚC 1: Kiểm tra xem có dữ liệu hợp lệ trong bộ nhớ cache chưa
        if (this.hasValidCache(key)) {
            return of(this.cache.get(key)!.data as T);
        }

        // BƯỚC 2: Nếu không có cache, kiểm tra xem có request nào GIỐNG HỆT đang chạy ngầm không
        if (this.inFlightRequests.has(key)) {
            return this.inFlightRequests.get(key) as Observable<T>;
        }

        // BƯỚC 3: Nếu là request đầu tiên, tiến hành kích hoạt luồng bắn API
        const ttlInMs = ttlInMinutes * 60 * 1000;

        const serverRequest$ = request$.pipe(
            tap((data) => {
                this.cache.set(key, { data, expiry: Date.now() + ttlInMs });
                this.inFlightRequests.delete(key);
            }),
            // Sử dụng shareReplay để nếu có lỗi hoặc tính toán lại, nó ko bị hủy luồng giữa chừng
            shareReplay(1),
        );

        // Đưa request này vào danh sách "đang chạy ngầm" để chặn các ông đến sau
        this.inFlightRequests.set(key, serverRequest$);
        return serverRequest$;
    }

    /**
     * Kiểm tra xem cache có tồn tại và còn hạn sử dụng hay không
     */
    private hasValidCache(key: string): boolean {
        const item = this.cache.get(key);
        if (!item) return false;

        const isExpired = Date.now() > item.expiry;
        if (isExpired) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    /**
     * Xóa chủ động một hoặc toàn bộ cache
     */
    clearCache(key?: string) {
        if (key) {
            this.cache.delete(key);
            this.inFlightRequests.delete(key);
        } else {
            this.cache.clear();
            this.inFlightRequests.clear();
        }
    }
}
