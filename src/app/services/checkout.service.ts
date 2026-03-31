import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BaseService } from '../base/base.service';
import { CartService } from '../featured/cart/services/cart.service';
import {
    CheckoutRequest,
    CheckoutResponse,
} from '../featured/checkout/models/checkout.model';

@Injectable({
    providedIn: 'root',
})
export class CheckoutService extends BaseService {
    private readonly _endpoint = 'checkout';
    private cartService = inject(CartService);

    checkout(data: CheckoutRequest): Observable<CheckoutResponse> {
        return this.post<CheckoutResponse>(this._endpoint, data).pipe(
            tap((res) => {
                if (res) {
                    this.cartService.updateCartCounts(0);
                }
            }),
        );
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
