import { UpperCasePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';
import { PricePipe } from '../../../../shared/pipes/price.pipe';
import { OrderService } from '../services/order.service';

@Component({
    selector: 'app-order-detail',
    standalone: true,
    imports: [TranslatePipe, RouterLink, PricePipe, UpperCasePipe],
    templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent {
    private route = inject(ActivatedRoute);
    private orderService = inject(OrderService);

    orderId = toSignal(
        this.route.paramMap.pipe(map((params) => params.get('id'))),
        { initialValue: null },
    );

    orderResouce = rxResource({
        request: () => this.orderId(),
        loader: ({ request }) => this.orderService.getOrderDetail(request!),
    });
    order = computed(() => this.orderResouce.value() || null);

    // Hàm chuyển đổi nhãn trạng thái từ tiếng Anh sang tiếng Việt
    getStatusLabel(status: string): string {
        switch (status) {
            case 'pending':
                return 'Chờ xử lý';
            case 'shipping':
                return 'Đang giao hàng';
            case 'delivered':
                return 'Đã giao thành công';
            case 'cancelled':
                return 'Đã hủy đơn';
            default:
                return 'Đang cập nhật';
        }
    }
}
