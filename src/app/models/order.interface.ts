import { CartItem } from '../featured/cart/models/cart.model';

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
