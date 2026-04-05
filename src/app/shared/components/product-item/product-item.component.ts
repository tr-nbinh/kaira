import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../base/base.component';
import { CartService } from '../../../featured/cart/services/cart.service';
import { Product, Variant } from '../../../featured/shop/models/product.model';
import { WishlistService } from '../../../featured/wishlist/services/wishlist.service';
import { LoadingService } from '../../../services/loading.service';
import { ToastService } from '../../../services/toast.service';
import { LoadingToggleDirective } from '../../directives/loading-toggle.directive';
import { ProductUrlPipe } from '../../pipes/product-url.pipe';

declare var bootstrap: any;

@Component({
    selector: 'app-product-item',
    imports: [
        RouterModule,
        LoadingToggleDirective,
        TranslatePipe,
        CurrencyPipe,
        ProductUrlPipe,
    ],
    templateUrl: './product-item.component.html',
    styleUrl: './product-item.component.scss',
})
export class ProductItemComponent extends BaseComponent {
    @Input() product: Product | undefined = undefined;
    @ViewChild('productCarousel') carouselRef!: ElementRef;

    selectedColor: string | null = null;
    selectedVariant: Variant | undefined = undefined;

    constructor(
        private wishlistService: WishlistService,
        private cartService: CartService,
        private toast: ToastService,
        protected loading: LoadingService,
    ) {
        super();
    }

    ngOnInit() {
        if (this.product) {
            this.selectColor(this.product.availableColors[0]?.id);
        }
    }

    selectColor(colorId: string) {
        this.selectedColor = colorId;
        this.selectedVariant = this.product?.variants.find(
            (v) => colorId == v.colorId,
        );
        if (this.carouselRef) {
            const element = this.carouselRef.nativeElement;

            // Lấy instance hiện tại của Carousel từ DOM
            const carouselInstance =
                bootstrap.Carousel.getInstance(element) ||
                new bootstrap.Carousel(element);

            if (carouselInstance) {
                // Ép nhảy về slide đầu tiên (index 0)
                carouselInstance.to(0);
            }
        }
    }

    toggleWishlist(variantId: string) {
        const key = `wishlist-${variantId}`;
        this.loading.show(key);
        this.wishlistService
            .toggleWishlist(variantId)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => this.loading.hide(key)),
            )
            .subscribe({
                next: (res) => {
                    if (this.selectedVariant) {
                        this.selectedVariant.isFavorite = res.isWishlisted;
                    }
                },
                error: (err) => {
                    console.log(err);
                    this.toast.info(err.message);
                },
            });
    }

    addToCart(variantId: string) {
        const quantity = 1;
        const key = `cart-${variantId}`;
        this.loading.show(key);
        this.cartService
            .addToCart(variantId, quantity)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => this.loading.hide(key)),
            )
            .subscribe({
                error: (err) => {
                    this.toast.info(err.message);
                },
            });
    }
}
