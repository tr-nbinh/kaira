import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MonoTypeOperatorFunction } from 'rxjs';

/**
 * Toán tử tự chế giúp hủy subscribe tự động mà không cần truyền DestroyRef thủ công
 */
export function untilDestroyed<T>(): MonoTypeOperatorFunction<T> {
    try {
        const destroyRef = inject(DestroyRef);
        return takeUntilDestroyed(destroyRef);
    } catch (error) {
        // Phòng hờ nếu gọi ở nơi hoàn toàn không có Injection Context
        throw new Error(
            'untilDestroyed() chỉ có thể được sử dụng bên trong một Injection Context (như constructor hoặc vùng khai báo thuộc tính).',
        );
    }
}
