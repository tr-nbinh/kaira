import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FlyAnimationService {
    /**
     * Kích hoạt hiệu ứng bay từ vị trí click đến một mục tiêu chỉ định
     * @param event Sự kiện click chuột để lấy tọa độ bắt đầu
     * @param imageSrc Đường dẫn ảnh sản phẩm
     * @param targetId ID của phần tử đích (ví dụ: 'target-cart-icon' hoặc 'target-wishlist-icon')
     */
    triggerFly(
        event: MouseEvent,
        imageSrc: string,
        targetId: string = 'target-cart-icon',
    ): void {
        const clickedElement = event.currentTarget as HTMLElement;
        if (!clickedElement) return;

        const startRect = clickedElement.getBoundingClientRect();

        const targetElement = document.getElementById(targetId);
        if (!targetElement) {
            console.warn(`Không tìm thấy phần tử đích với ID: ${targetId}`);
            return;
        }
        const endRect = targetElement.getBoundingClientRect();

        // 1. Tạo "viên ngọc" ảnh ảo thu nhỏ (ép kích thước đều để bo tròn đẹp)
        const flyer = document.createElement('img');
        flyer.src = imageSrc;
        flyer.style.position = 'fixed';
        flyer.style.zIndex = '9999';
        flyer.style.pointerEvents = 'none';
        flyer.style.objectFit = 'cover';
        flyer.style.borderRadius = '50%';

        // Đặt kích thước bắt đầu vừa phải (ví dụ tối đa 60px để không bị thô)
        const initialSize = Math.min(startRect.width, startRect.height, 100);
        flyer.style.width = `${initialSize}px`;
        flyer.style.height = `${initialSize}px`;

        // Căn giữa ảnh ảo vào đúng tâm của nút bấm vừa click
        const startX = startRect.left + startRect.width / 2 - initialSize / 2;
        const startY = startRect.top + startRect.height / 2 - initialSize / 2;
        flyer.style.left = `${startX}px`;
        flyer.style.top = `${startY}px`;

        // Cấu hình transition mượt mà
        flyer.style.transition =
            'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease';

        document.body.appendChild(flyer);

        // 2. Kích hoạt luồng dịch chuyển sang tọa độ đích
        setTimeout(() => {
            const endX = endRect.left + endRect.width / 2 - initialSize / 2;
            const endY = endRect.top + endRect.height / 2 - initialSize / 2;

            const translateX = endX - startX;
            const translateY = endY - startY;

            flyer.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.1)`;
            flyer.style.opacity = '0.1';
        }, 20);

        // 3. Dọn dẹp và làm nảy biểu tượng đích khi chạm tới
        setTimeout(() => {
            flyer.remove();
            targetElement.classList.add('bump-animation');
            setTimeout(
                () => targetElement.classList.remove('bump-animation'),
                300,
            );
        }, 820);
    }
}
