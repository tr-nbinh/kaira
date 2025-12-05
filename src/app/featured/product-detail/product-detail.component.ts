import {
    Component,
    ElementRef,
    OnInit,
    Resource,
    resource,
    ResourceStatus,
    signal,
    ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize, firstValueFrom, map, takeUntil, tap } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { ColorSelectItem } from '../../models/product-filter.interface';
import { ProductDetail, ProductVariant } from '../../models/product.interface';
import { CartService } from '../../services/cart.service';
import { LoadingService } from '../../services/loading.service';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';
import { WishlistService } from '../../services/wishlist.service';
import { LoadingToggleDirective } from '../../shared/directives/loading-toggle.directive';
import { ProductDetailSkeletonComponent } from './product-detail-skeleton/product-detail-skeleton.component';

@Component({
    selector: 'app-product-detail',
    imports: [
        TranslatePipe,
        FormsModule,
        LoadingToggleDirective,
        ProductDetailSkeletonComponent,
    ],
    templateUrl: './product-detail.component.html',
    styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent extends BaseComponent implements OnInit {
    @ViewChild('thumbSlider') thumbSlider!: ElementRef<any>;
    @ViewChild('swiperPagination') pagination!: ElementRef<any>;
    @ViewChild('largeSlider') largeSlider!: ElementRef<any>;
    product!: ProductDetail;
    private _swiperInitialized = false;
    currentVariant!: ProductVariant;
    selectedColor: ColorSelectItem | undefined;
    selectedQuantity: number = 1;
    variantId!: number;
    isLoading = signal(true);

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService,
        private wishlistService: WishlistService,
        private toast: ToastService,
        private loading: LoadingService
    ) {
        super();
    }

    ngOnInit() {
        this.route.paramMap
            .pipe(
                map((params) => ({
                    productId: params.get('productId'),
                    variantId: params.get('variantId'),
                })),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(({ productId, variantId }) => {
                this.getProductById(+productId!);
                this.variantId = +variantId!;
            });
    }

    ngAfterViewChecked() {
        if (this.product && this.thumbSlider && !this._swiperInitialized) {
            this.initSwiper();
            this._swiperInitialized = true;
        }
    }

    getProductById(productId: number) {
        this.productService
            .getProductById(productId)
            .pipe(
                tap(() => this.isLoading.set(true)),
                finalize(() => this.isLoading.set(false)),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((res) => {
                this.product = res;
                this.setCurrentVariant();
                this._swiperInitialized = false;
            });
    }

    setCurrentVariant() {
        this.currentVariant = this.product.variants.find(
            (v) => v.id === this.variantId
        )!;
        const currentColor = this.product.colors.find(
            (c) => c.id === this.currentVariant?.colorId
        );
        if (currentColor) {
            currentColor.checked = true;
            this.selectedColor = currentColor;
        }
    }

    onColorChange(color: ColorSelectItem) {
        color.checked = true;
        this.selectedColor = color;
        this.currentVariant = this.product.variants.find(
            (variant) => variant.colorId === this.selectedColor?.id
        )!;
    }

    addToCart() {
        const key = `cart-${this.currentVariant.id}`;
        this.loading.show(key);
        this.cartService
            .addToCart(this.currentVariant.id, this.selectedQuantity)
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

    addToWishlist() {
        const key = `wishlist-${this.currentVariant.id}`;
        this.loading.show(key);
        this.wishlistService
            .addToWishlist(this.currentVariant.id)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => this.loading.hide(key))
            )
            .subscribe({
                next: (res) => {
                    this.toast.success(res.message);
                },
                error: (err) => {
                    this.toast.warning(err.message);
                },
            });
    }

    increaseQuantity() {
        if (this.selectedQuantity >= this.currentVariant.quantity) return;
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
                    992: {
                        direction: 'vertical',
                    },
                },
            }
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
