import { Component, computed, inject, signal } from '@angular/core';
import { OrderService } from '../services/order.service';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { OrderRequest, OrderStatusType } from '../models/order.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-order-history',
    imports: [CurrencyPipe, RouterLink, DatePipe, TranslatePipe, UpperCasePipe], // Cập nhật module router tại đây
    templateUrl: './order-history.component.html',
})
export class OrderHistoryComponent {
    private orderService = inject(OrderService);

    orderRequest = signal<OrderRequest>({ page: 1, limit: 10 });
    ordersResource = rxResource({
        request: () => this.orderRequest(),
        loader: ({ request }) => this.orderService.getOrders(request),
    });
    orders = computed(() => this.ordersResource.value() || []);

    activeTab = signal<OrderStatusType | 'all'>('all');
    filteredOrders = computed(() => {
        const activeTab = this.activeTab();
        if (this.activeTab() === 'all') {
            return this.orders();
        }

        return this.orders().filter(
            (order) => order.status === (activeTab as any),
        );
    });

    tabs: { key: OrderStatusType | 'all'; label: string }[] = [
        { key: 'all', label: 'ORDER_LIST.TABS.ALL' },
        { key: 'pending', label: 'ORDER_LIST.TABS.PENDING' },
        { key: 'shipping', label: 'ORDER_LIST.TABS.SHIPPING' },
        { key: 'delivered', label: 'ORDER_LIST.TABS.DELIVERED' },
        { key: 'cancel', label: 'ORDER_LIST.TABS.CANCELLED' },
    ];

    getStatusLabel(status: string): string {
        switch (status) {
            case 'pending':
                return 'Chờ xử lý';
            case 'shipping':
                return 'Đang giao';
            case 'delivered':
                return 'Đã giao';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    }
}
