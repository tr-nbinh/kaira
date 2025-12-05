import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { delay, finalize, takeUntil, tap } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { CartItem } from '../../models/cart.interface';
import { CartService } from '../../services/cart.service';
import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { WishlistService } from '../../services/wishlist.service';
import { LoadingToggleDirective } from '../../shared/directives/loading-toggle.directive';
import { FullPageLoadingComponent } from '../../shared/components/full-page-loading/full-page-loading.component';
import { WishlistEmptyComponent } from './wishlist-empty/wishlist-empty.component';

@Component({
    selector: 'app-wishlist',
    imports: [
        TranslatePipe,
        RouterModule,
        LoadingToggleDirective,
        FullPageLoadingComponent,
        WishlistEmptyComponent
    ],
    templateUrl: './wishlist.component.html',
    styleUrl: './wishlist.component.scss',
})
export class WishlistComponent extends BaseComponent {
    wishlistItems: CartItem[] = [];
    isLoading = false;

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
            .pipe(
                tap(() => (this.isLoading = true)),
                finalize(() => (this.isLoading = false)),
                takeUntil(this.ngUnsubscribe)
            )
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
                next: (res) => {
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
                next: (res) => {
                    console.log(res);
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
