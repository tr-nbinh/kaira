import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart.interface';
import { BaseService } from '../base/base.service';
import { Order } from '../models/order.interface';
import { ApiResponse } from '../models/api-response.interface';

@Injectable({
    providedIn: 'root',
})
export class CheckoutService extends BaseService {
    private readonly _endpoint = 'orders';
    private readonly selectedCartItemsSubject = new BehaviorSubject<CartItem[]>(
        []
    );
    selectedCartItems$ = this.selectedCartItemsSubject.asObservable();

    setSelectedCartItems(items: CartItem[]) {
        this.selectedCartItemsSubject.next(items);
    }

    getSelectedCartItems(): CartItem[] {
        return this.selectedCartItemsSubject.getValue();
    }

    clearSelectedCartItems() {
        this.selectedCartItemsSubject.next([]);
    }

    saveOrder(data: Order): Observable<ApiResponse<Order>> {
        return this.post(this._endpoint, data);
    }

    initSession(cartId: number, userId: number): Observable<any> {
        return this.post<{ uuid: string }>('/api/checkout/init', {
            cartId,
            userId,
        });
    }

    getSession(sessionId: string): Observable<any> {
        return this.get<any>(`/api/checkout/${sessionId}`);
    }
}
