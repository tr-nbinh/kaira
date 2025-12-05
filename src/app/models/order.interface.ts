import { CartItem } from './cart.interface';

type OrderPaymentMethod = 'banking' | 'cod';

type OrderStatus = 'pending' | 'cancel' | 'complete';

export interface Order {
    id?: number;
    orderItems: CartItem[];
    addressId: number;
    note?: string;
    paymentMethod: OrderPaymentMethod;
    status?: OrderStatus;
}

