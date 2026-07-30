import { PaymentMethodType } from '../../../../shared/constants/payment.constant';
import { UserAddress } from '../../../../shared/models/address.model';

export interface CheckoutInput {
    email: string;
    note: string;
    shippingAddress: UserAddress;
    paymentMethod: PaymentMethodType;
}

export interface CheckoutResponse {
    orderId: string;
    cartCount: number;
}
