type PAYMENT_METHOD = 'cod' | 'banking' | 'momo';

export interface CheckoutRequest {
    checkoutId: string;
    addressId: number;
    note: string;
    paymentMethod: PAYMENT_METHOD;
    shippingFee: number;
    items: CheckoutItem[];
}

export interface CheckoutItem {
    variantId: string;
    quantity: number;
}

export interface CheckoutResponse {
    id: number;
    userId: number;
    addressId: number;
    note: string;
    paymentMethod: string;
    shippingFee: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    checkout_id: string;
}
