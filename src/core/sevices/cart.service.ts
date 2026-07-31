import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponse } from '../../shared/models/list-repsonse.model';
import { PaginatedRequest } from '../../shared/models/pagination.model';
import {
    CartItem,
    AddCartItem,
    AddCartItemResponse,
    UpdateCartItemQuantity,
    UpdateCartItemQuantityReponse,
    CartCountResponse,
} from '../models/cart.model';
import { SHOW_TOAST } from '../token';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root',
})
export class CartService extends BaseService {
    private readonly _endpoint = 'cart';

    getCartItems(paging: PaginatedRequest): Observable<ListResponse<CartItem>> {
        return this.get(this._endpoint, paging);
    }

    addToCart(body: AddCartItem): Observable<AddCartItemResponse> {
        return this.post(this._endpoint, body);
    }

    updateQuantity(
        payload: UpdateCartItemQuantity,
    ): Observable<UpdateCartItemQuantityReponse> {
        return this.patch(
            `${this._endpoint}/${payload.cartItemId}`,
            { quantity: payload.quantity },
            { context: new HttpContext().set(SHOW_TOAST, true) },
        );
    }

    getCartCount(): Observable<CartCountResponse> {
        return this.get<CartCountResponse>(`${this._endpoint}/item-count`);
    }

    deleteCartItem(cartItemId: string): Observable<CartCountResponse> {
        return this.delete(`${this._endpoint}/${cartItemId}`);
    }
}
