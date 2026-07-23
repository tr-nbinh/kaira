import {
    PaymentMethodType,
    PaymentStatusType,
} from '../../../../shared/constants/payment.constant';

export type OrderStatusType =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipping'
    | 'delivered'
    | 'cancel';

export interface Order {
    id: string;
    status: OrderStatusType;
    paymentStatus: PaymentStatusType;
    paymentMethod: PaymentMethodType;
    totalAmount: number;
    createdAt: Date;
    firstItem: OrderItem;
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

export interface OrderItem {
    name: string;
    imageUrl: string;
}

export interface OrderRequest {
    status?: OrderStatusType;
}
