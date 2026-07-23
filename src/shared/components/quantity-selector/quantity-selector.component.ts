import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
    signal,
} from '@angular/core';

export type QuantitySelectorSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-quantity-selector',
    templateUrl: './quantity-selector.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantitySelectorComponent {
    value = input.required<number>();
    disabled = input<boolean>(false);
    min = input<number>(1);
    max = input<number>(99);
    size = input<QuantitySelectorSize>('md');

    valueChange = output<number>();

    isShaking = signal<boolean>(false);

    // 1. Độ cao tổng thể của thanh chọn
    protected wrapperClasses = computed(() => {
        switch (this.size()) {
            case 'sm':
                return 'h-9'; // Nhỏ gọn cho Giỏ hàng / Mini-cart
            case 'lg':
                return 'h-14'; // To bản, nhấn mạnh
            case 'md':
            default:
                return 'h-12'; // Tiêu chuẩn cho trang Chi tiết sản phẩm (PDP)
        }
    });

    // 2. Độ rộng của các nút bấm + / -
    protected btnClasses = computed(() => {
        switch (this.size()) {
            case 'sm':
                return 'w-9 text-base';
            case 'lg':
                return 'w-14 text-xl';
            case 'md':
            default:
                return 'w-12 text-lg';
        }
    });

    // 3. Độ rộng và size chữ của phần hiển thị số chính giữa
    protected textClasses = computed(() => {
        switch (this.size()) {
            case 'sm':
                return 'w-8 text-[12px]';
            case 'lg':
                return 'w-14 text-[14px]';
            case 'md':
            default:
                return 'w-12 text-[13px]';
        }
    });

    increment() {
        if (this.value() >= this.max()) {
            this.triggerShake();
            return;
        }
        this.valueChange.emit(this.value() + 1);
    }

    decrement() {
        if (this.value() > this.min()) {
            this.valueChange.emit(this.value() - 1);
        }
    }

    private triggerShake() {
        this.isShaking.set(true);
        // Tắt hiệu ứng sau khi kết thúc animation để lần sau bấm tiếp vẫn lắc được
        setTimeout(() => {
            this.isShaking.set(false);
        }, 400);
    }
}
