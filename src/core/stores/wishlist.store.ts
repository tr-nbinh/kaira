import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { WishlistService } from '../sevices/wishlist.service';

type WishlistState = {
    count: number;
};

const initialState: WishlistState = {
    count: 0,
};

export const WishlistStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, wishlistService = inject(WishlistService)) => ({
        async loadCount() {
            const res = await firstValueFrom(
                wishlistService.getWishlistCount(),
            );
            patchState(store, { count: res.wishlistCount });
        },

        async toggle(variantId: string) {
            const res = await firstValueFrom(wishlistService.toggle(variantId));
            patchState(store, { count: res.wishlistCount });
        },

        setCount(count: number) {
            patchState(store, { count });
        },

        clear() {
            patchState(store, { count: 0 });
        },
    })),
);
