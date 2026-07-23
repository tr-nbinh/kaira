import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-order-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent implements OnInit {
    order: any = null;
    loading: boolean = true;
    error: string | null = null;

    constructor() {}

    ngOnInit(): void {
        // Giả lập thời gian delay mạng 600ms để xem hiệu ứng Loading
        setTimeout(() => {
            this.loadMockOrderDetail();
        }, 600);
    }

    loadMockOrderDetail(): void {
        try {
            // Dữ liệu mock chuẩn cấu trúc hóa đơn Snapshot đã chốt từ Database của bạn
            this.order = {
                id: '7b2a9e14-d53c-4b82-9a01-f2bc34da5e61',
                userId: 1,
                status: 'pending',
                note: 'Giao giờ hành chính, gọi trước khi đến giúp mình nhé.',
                paymentMethod: 'vnpay',
                paymentStatus: 'Đã thanh toán',
                subtotal: 720000,
                discount: 50000,
                shippingFee: 35000,
                totalAmount: 705000,
                createdAt: new Date(),

                address: {
                    id: 'a8e4123c-f53d-4c81-89a3-d2bc45ef61a3',
                    fullName: 'Nguyễn Văn A',
                    phone: '0901234567',
                    provinceCode: 29,
                    provinceName: 'Thành phố Hà Nội',
                    wardCode: 1005,
                    wardName: 'Phường Hàng Bạc',
                    addressLine: 'Số 123 Phố Hàng Bạc',
                    addressExtra: 'Tòa nhà TTC, Tầng 5',
                },

                items: [
                    {
                        id: 'item-1111',
                        productId: 'prod-001',
                        variantId: 'var-001',
                        productName: 'Áo Khoác Minimalist Bomber Jacket',
                        variantName: 'Size M / Màu Đen',
                        imageUrl:
                            'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
                        sku: 'JKT-BOMB-BLK-M',
                        price: 450000,
                        totalPrice: 450000, // Tương đương số lượng x1
                    },
                    {
                        id: 'item-2222',
                        productId: 'prod-002',
                        variantId: 'var-002',
                        productName: 'Áo Thun Cotton Premium Pima',
                        variantName: 'Size L / Màu Trắng',
                        imageUrl:
                            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
                        sku: 'TSH-PIMA-WHT-L',
                        price: 135000,
                        totalPrice: 270000, // Tương đương số lượng x2 để kiểm tra hiển thị "/ cái"
                    },
                ],
            };

            this.loading = false;
        } catch (err) {
            this.error =
                'Không thể tải thông tin đơn hàng này. Vui lòng thử lại sau.';
            this.loading = false;
        }
    }

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
