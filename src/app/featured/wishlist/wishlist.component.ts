import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize, takeUntil, tap } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { CartService } from '../cart/services/cart.service';
import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { LoadingToggleDirective } from '../../shared/directives/loading-toggle.directive';
import { WishlistEmptyComponent } from './components/wishlist-empty/wishlist-empty.component';
import { WishlistItem } from './models/wishlist.model';
import { WishlistService } from './services/wishlist.service';
import { WishlistSkeletonComponent } from './components/wishlist-skeleton/wishlist-skeleton.component';
import { ProductUrlPipe } from '../../shared/pipes/product-url.pipe';

@Component({
    selector: 'app-wishlist',
    imports: [
        TranslatePipe,
        RouterModule,
        LoadingToggleDirective,
        WishlistEmptyComponent,
        WishlistSkeletonComponent,
        ProductUrlPipe,
    ],
    templateUrl: './wishlist.component.html',
    styleUrl: './wishlist.component.scss',
})
export class WishlistComponent extends BaseComponent {
    wishlistItems: WishlistItem[] = [];
    isLoading = true;

    constructor(
        private wishlistService: WishlistService,
        private cartService: CartService,
        private toast: ToastService,
        private loading: LoadingService,
    ) {
        super();
    }

    ngOnInit() {
        this.wishlistService
            .getWishlistItems()
            .pipe(
                tap(() => (this.isLoading = true)),
                finalize(() => (this.isLoading = false)),
                takeUntil(this.ngUnsubscribe),
            )
            .subscribe((wishListItems) => {
                this.wishlistItems = wishListItems;
            });
    }

    addToCart(variantId: number) {
        const key = `cart-add-${variantId}`;
        this.loading.show(key);
        this.cartService
            .addToCart('123', 1)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => this.loading.hide(key)),
            )
            .subscribe({
                error: (err) => {
                    this.toast.error(err.message);
                },
            });
    }

    removeFromWishlist(variantId: string) {
        const key = `wishlist-remove-${variantId}`;
        this.loading.show(key);
        this.wishlistService
            .toggleWishlist(variantId)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => this.loading.hide(key)),
            )
            .subscribe({
                next: (res) => {
                    this.wishlistItems = this.wishlistItems.filter(
                        (item) => item.variantId !== variantId,
                    );
                },
                error: (err) => {
                    this.toast.info(err.message);
                },
            });
    }
}
