import {
    PaymentMethodType,
    PaymentStatusType,
} from '../../../../shared/constants/payment.constant';
import { PaginatedRequest } from '../../../../shared/models/pagination.model';

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
    totalItems: number;
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
    productName: string;
    variantName?: string;
    imageUrl: string;
    quantity: number;
    price: number;
    totalPrice: number;
}

export interface OrderRequest extends PaginatedRequest {
    status?: OrderStatusType;
}
