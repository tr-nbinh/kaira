import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { finalize, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../base/base.component';
import { ApiResponse } from '../../../../models/api-response.interface';
import { Color } from '../../../../models/product-filter.interface';
import { Product, ProductVariant } from '../../../../models/product.interface';
import { LoadingService } from '../../../../services/loading.service';
import { ToastService } from '../../../../services/toast.service';
import { WishlistService } from '../../../../services/wishlist.service';
import { LoadingToggleDirective } from '../../../directives/loading-toggle.directive';
import { CartService } from '../../../../services/cart.service';

@Component({
    selector: 'app-product-item',
    imports: [RouterModule, LoadingToggleDirective],
    templateUrl: './product-item.component.html',
    styleUrl: './product-item.component.scss',
})
export class ProductItemComponent extends BaseComponent {
    @Input() product!: Product;
    currentVariant!: ProductVariant;
    colors: Color[] = [];
    colorChecked: Color | undefined;

    constructor(
        private wishlistService: WishlistService,
        private cartService: CartService,
        private toast: ToastService,
        protected loading: LoadingService
    ) {
        super();
    }

    ngOnInit() {
        this.colors = this.product.colors;
        this.changeColor(this.colors[0]);
        this.setCurrentVariant();
    }

    changeColor(color: Color) {
        if (color.id === this.colorChecked?.id) return;
        if (this.colorChecked) this.colorChecked.checked = false;
        color.checked = true;
        this.colorChecked = color;
        this.setCurrentVariant();
    }

    setCurrentVariant() {
        this.currentVariant =
            this.product.variants.find(
                (v) => v.colorId === this.colorChecked?.id
            ) || this.product.variants[0];
    }

    addToWishlist(variantId: number) {
        const key = `wishlist-${variantId}`;
        this.loading.show(key);
        this.wishlistService
            .addToWishlist(variantId)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => this.loading.hide(key))
            )
            .subscribe({
                next: (res: ApiResponse) => {
                    this.toast.success(res.message);
                },
                error: (err) => {
                    this.toast.info(err.message);
                },
            });
    }

    addToCart(variantId: number) {
        const key = `cart-${variantId}`;
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
                    this.toast.info(err.message);
                },
            });
    }
}
