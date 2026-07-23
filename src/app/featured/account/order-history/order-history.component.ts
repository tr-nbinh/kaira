import { Component, inject } from '@angular/core';
import { OrderService } from '../services/order.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-order-history',
    imports: [CurrencyPipe, RouterLink, DatePipe], // Cập nhật module router tại đây
    templateUrl: './order-history.component.html',
})
export class OrderHistoryComponent {
    private orderService = inject(OrderService);

    tabs = [
        { key: 'all', label: 'Tất cả đơn' },
        { key: 'pending', label: 'Chờ xử lý' },
        { key: 'shipping', label: 'Đang giao' },
        { key: 'delivered', label: 'Đã giao' },
        { key: 'cancelled', label: 'Đã hủy' },
    ];

    activeTab: string = 'all';

    // Giữ nguyên dữ liệu Mock để bạn test layout lên màu chuẩn chỉnh
    mockOrders = [
        {
            id: '7b2a9e14-d53c-4b82-9a01-f2bc34da5e61',
            status: 'pending',
            totalAmount: 705000,
            createdAt: new Date('2026-07-18T10:30:00'),
            items: [
                {
                    id: 'it-1',
                    productName: 'Áo Khoác Minimalist Bomber Jacket',
                    variantName: 'Size M / Đen',
                    imageUrl:
                        'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
                    quantity: 3,
                    price: 450000,
                },
                {
                    id: 'it-2',
                    productName: 'Áo Thun Cotton Premium Pima',
                    variantName: 'Size L / Trắng',
                    imageUrl:
                        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
                    quantity: 1,
                    price: 270000,
                },
            ],
        },
        {
            id: 'c491b29a-019e-4c38-8fa1-e23456abcdef',
            status: 'shipping',
            totalAmount: 320000,
            createdAt: new Date('2026-07-15T15:45:00'),
            items: [
                {
                    id: 'it-3',
                    productName: 'Quần Khaki Slim-fit Charcoal',
                    variantName: 'Size 31',
                    imageUrl:
                        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop',
                    quantity: 1,
                    price: 320000,
                },
            ],
        },
    ];

    ngOnInit() {
        this.orderService.getOrders({}).subscribe(console.log);
    }

    filteredOrders() {
        if (this.activeTab === 'all') {
            return this.mockOrders;
        }
        return this.mockOrders.filter(
            (order) => order.status === this.activeTab,
        );
    }

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
