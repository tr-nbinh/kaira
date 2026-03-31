import { CurrencyPipe, LowerCasePipe } from '@angular/common';
import {
    Component,
    ElementRef,
    OnInit,
    signal,
    ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize, takeUntil, tap } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { LoadingToggleDirective } from '../../shared/directives/loading-toggle.directive';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { praseProductIdFromSlug } from '../../shared/utils/product-url.helper';
import { CartService } from '../cart/services/cart.service';
import {
    Product,
    ProductAttribute,
    Variant,
} from '../shop/models/product.model';
import { ProductService } from '../shop/services/product.service';
import { WishlistService } from '../wishlist/services/wishlist.service';
import { ProductDetailSkeletonComponent } from './product-detail-skeleton/product-detail-skeleton.component';

@Component({
    selector: 'app-product-detail',
    imports: [
        TranslatePipe,
        FormsModule,
        LoadingToggleDirective,
        ProductDetailSkeletonComponent,
        CurrencyPipe,
        SafeHtmlPipe,
        LowerCasePipe,
    ],
    templateUrl: './product-detail.component.html',
    styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent extends BaseComponent implements OnInit {
    @ViewChild('thumbSlider') thumbSlider!: ElementRef<any>;
    @ViewChild('swiperPagination') pagination!: ElementRef<any>;
    @ViewChild('largeSlider') largeSlider!: ElementRef<any>;

    variantId: string | null = null;
    product: Product | null = null;
    selectedVariant: Variant | undefined = undefined;
    selectedColor: ProductAttribute | undefined = undefined;
    selectedQuantity: number = 1;
    private _swiperInitialized = false;
    isLoading = signal(true);

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService,
        private wishlistService: WishlistService,
        private toast: ToastService,
        private loading: LoadingService,
    ) {
        super();
    }

    ngOnInit() {
        const slug = this.route.snapshot.paramMap.get('slug');
        const productId = praseProductIdFromSlug(slug);
        this.route.queryParamMap
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((queryParams) => {
                this.variantId = queryParams.get('variant');
                if (productId) {
                    this.getProductById(productId);
                }
            });
    }

    ngAfterViewChecked() {
        if (this.product && this.thumbSlider && !this._swiperInitialized) {
            this.initSwiper();
            this._swiperInitialized = true;
        }
    }

    getProductById(productId: string) {
        this.productService
            .getProductById(productId)
            .pipe(
                tap(() => this.isLoading.set(true)),
                finalize(() => this.isLoading.set(false)),
                takeUntil(this.ngUnsubscribe),
            )
            .subscribe((res) => {
                this.product = res;
                this.initVariantAndColor(this.variantId);
                this._swiperInitialized = false;
            });
    }

    initVariantAndColor(variantId: string | null) {
        if (!this.product) return;

        this.selectedVariant =
            this.product.variants.find((v) => v.id === variantId) ||
            this.product.variants[0];

        this.selectedColor = this.product.availableColors.find(
            (c) => c.id === this.selectedVariant!.colorId,
        );
    }

    selectColor(color: ProductAttribute) {
        this.selectedColor = color;
        this.selectedVariant = this.product?.variants.find(
            (v) => v.colorId == color.id,
        );
    }

    addToCart(variantId: string) {
        const key = `cart-${variantId}`;
        this.loading.show(key);
        this.cartService
            .addToCart(variantId, this.selectedQuantity)
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

    toggleWishlist(variantId: string) {
        const key = `wishlist-${variantId}`;
        this.loading.show(key);
        this.wishlistService
            .addToWishlist(variantId)
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
                    this.toast.info(err.message);
                },
            });
    }

    increaseQuantity() {
        if (this.selectedQuantity >= this.selectedVariant!.stock) return;
        this.selectedQuantity += 1;
    }

    decreaseQuantity() {
        if (this.selectedQuantity === 1) return;
        this.selectedQuantity -= 1;
    }

    initSwiper() {
        const thumbSlider = this.initializeSwiper(
            this.thumbSlider.nativeElement,
            {
                slidesPerView: 3,
                spaceBetween: 20,
                direction: 'vertical',
                breakpoints: {
                    0: {
                        direction: 'horizontal',
                    },
                    768: {
                        direction: 'vertical',
                    },
                },
            },
        );

        this.initializeSwiper(this.largeSlider.nativeElement, {
            slidesPerView: 1,
            spaceBetween: 0,
            effect: 'fade',
            thumbs: {
                swiper: thumbSlider,
            },
            pagination: {
                el: this.pagination.nativeElement,
                clickable: true,
            },
        });
    }
}
