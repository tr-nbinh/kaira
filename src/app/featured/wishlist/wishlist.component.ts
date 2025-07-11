import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { finalize, takeUntil } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { CartItem } from '../../models/cart.interface';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { ApiResponse } from '../../models/api-response.interface';
import { ToastService } from '../../services/toast.service';
import { LoadingToggleDirective } from '../../shared/directives/loading-toggle.directive';
import { LoadingService } from '../../services/loading.service';

@Component({
    selector: 'app-wishlist',
    imports: [TranslateModule, RouterModule, LoadingToggleDirective],
    templateUrl: './wishlist.component.html',
    styleUrl: './wishlist.component.scss',
})
export class WishlistComponent extends BaseComponent {
    wishlistItems: CartItem[] = [];

    constructor(
        private wishlistService: WishlistService,
        private cartService: CartService,
        private toast: ToastService,
        private loading: LoadingService
    ) {
        super();
    }

    ngOnInit() {
        this.wishlistService
            .getWishlistItems()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((wishListItems) => {
                this.wishlistItems = wishListItems;
            });
    }

    addToCart(variantId: number) {
        const key = `cart-add-${variantId}`;
        this.loading.show(key);
        this.cartService
            .addToCart(variantId, 1)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => this.loading.hide(key))
            )
            .subscribe({
                next: (res: ApiResponse) => {
                    this.toast.success(res.message);
                },
                error: (err) => {
                    this.toast.error(err.message);
                },
            });
    }

    removeFromWishlist(variantId: number) {
        const key = `wishlist-remove-${variantId}`;
        this.loading.show(key);
        this.wishlistService
            .removeFromWishlist(variantId)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => this.loading.hide(key))
            )
            .subscribe({
                next: (res: ApiResponse) => {
                    this.wishlistItems = this.wishlistItems.filter(
                        (item) => item.variantId !== variantId
                    );
                    this.toast.success(res.message);
                },
                error: (err) => {
                    this.toast.error(err.message);
                },
            });
    }
}
