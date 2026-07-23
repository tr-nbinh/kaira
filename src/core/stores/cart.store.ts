import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { CartService } from '../sevices/cart.service';
import { AddCartItem, UpdateCartItemQuantity } from '../models/cart.model';

type CartState = {
    count: number;
};

const initialState: CartState = {
    count: 0,
};

export const CartStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, cartService = inject(CartService)) => ({
        async loadCount() {
            const res = await firstValueFrom(cartService.getCartCount());
            patchState(store, { count: res.cartCount });
        },

        async addToCart(body: AddCartItem) {
            const res = await firstValueFrom(cartService.addToCart(body));
            patchState(store, { count: res.count });
        },

        async deleteItem(cartItemId: string) {
            const res = await firstValueFrom(
                cartService.deleteCartItem(cartItemId),
            );
            patchState(store, { count: res.cartCount });
        },

        setCount(count: number) {
            patchState(store, { count });
        },

        clear() {
            patchState(store, { count: 0 });
        },
    })),
);
