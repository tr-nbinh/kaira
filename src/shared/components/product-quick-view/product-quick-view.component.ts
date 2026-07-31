import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { RequireAuthService } from '../../../core/auth/require-auth.service';
import { AddCartItem } from '../../../core/models/cart.model';
import { CartStore } from '../../../core/stores/cart.store';
import { WishlistStore } from '../../../core/stores/wishlist.store';
import { ColorOption, Option } from '../../models/option.model';
import { PricePipe } from '../../pipes/price.pipe';
import { ProductService } from '../../services/product.service';
import { buildProductUrl } from '../../utils/product-url.helper';
import { ColorSwatchComponent } from '../color-swatch/color-swatch.component';
import { ModalRef } from '../modal/modal-ref';
import { MODAL_DATA, ModalConfig } from '../modal/modal.interface';
import { QuantitySelectorComponent } from '../quantity-selector/quantity-selector.component';
import { SizeSelectorComponent } from '../size-selector/size-selector.component';
import { ProductQuickViewSkeletonComponent } from './skeleton/product-quick-view-skeleton.component';
import { FlyAnimationService } from '../../services/fly-animation.service';

@Component({
    selector: 'app-product-quick-view',
    templateUrl: './product-quick-view.component.html',
    imports: [
        ProductQuickViewSkeletonComponent,
        PricePipe,
        TranslatePipe,
        ColorSwatchComponent,
        QuantitySelectorComponent,
        SizeSelectorComponent,
    ],
})
export class ProductQuickViewComponent {
    private config = inject(MODAL_DATA, { optional: true }) as ModalConfig<{
        productId: string;
        variantId: string;
    }>;
    private modalRef = inject(ModalRef);
    private productService = inject(ProductService);
    private wishlistStore = inject(WishlistStore);
    private cartStore = inject(CartStore);
    private router = inject(Router);
    private requireAuth = inject(RequireAuthService);
    private flyService = inject(FlyAnimationService);

    productResource = rxResource({
        request: () => this.config.data!.productId,
        loader: ({ request }) => {
            return this.productService.getProductQuickView(request);
        },
    });

    // --- State Signals ---
    readonly selectedImageIndex = signal(0);
    readonly quantity = signal(1);
    readonly selectedColorOption = signal<ColorOption | null>(null);
    readonly selectedSizeOption = signal<Option | null>(null);

    // --- Computed Signals ---

    readonly colorOptions = computed(() => {
        const prod = this.productResource.value();
        if (!prod) return [];

        const availableColorIds = new Set(
            prod.variants
                .filter((variant) => variant.stock > 0)
                .map((variant) => variant.color.id),
        );

        return prod.colors.map((color) => ({
            label: color.name,
            value: color.id,
            hex: color.value_code,
            disabled: !availableColorIds.has(color.id),
        }));
    });

    readonly sizeOptions = computed(() => {
        const prod = this.productResource.value();
        const selectedColor = this.selectedColorOption();

        if (!prod || !prod.sizes) return [];

        const availableSizeIds = new Set(
            prod.variants
                .filter((variant) => {
                    if (variant.stock <= 0) return false;

                    // Nếu đã chọn màu,
                    // chỉ lấy size thuộc màu đó
                    if (selectedColor) {
                        return variant.color.id === selectedColor.value;
                    }

                    return true;
                })
                .filter((variant) => variant.size)
                .map((variant) => variant.size!.id),
        );

        return prod.sizes.map((size) => ({
            label: size.name,
            value: size.id,
            disabled: !availableSizeIds.has(size.id),
        }));
    });

    readonly selectedVariant = computed(() => {
        const prod = this.productResource.value();
        const color = this.selectedColorOption();
        const size = this.selectedSizeOption();
        if (!prod || !color) return null;

        return (
            prod.variants.find(
                (v) => v.color.id === color.value && v.size?.id === size?.value,
            ) ?? null
        );
    });

    readonly imagesByColor = computed(() => {
        const prod = this.productResource.value();
        const color = this.selectedColorOption();
        if (!prod || !color) return [];

        return prod.images.filter(
            (img) => img.attributeValueId === color.value,
        );
    });

    constructor() {
        effect(() => {
            const product = this.productResource.value();
            if (!product) return;

            const defaultVariant =
                product.variants.find((v) => v.isDefault && v.stock > 0) ??
                product.variants.find((v) => v.stock > 0) ??
                product.variants[0];
            if (!defaultVariant) return;

            this.selectedColorOption.set({
                label: defaultVariant.color.name,
                value: defaultVariant.color.id,
                hex: defaultVariant.color.value_code,
            });
            if (defaultVariant.size) {
                this.selectedSizeOption.set({
                    label: defaultVariant.size.name,
                    value: defaultVariant.size.id,
                });
            }
        });
    }

    changeColor(colorOption: ColorOption): void {
        const product = this.productResource.value();

        if (!product) return;

        const availableVariants = product.variants.filter(
            (variant) =>
                variant.stock > 0 && variant.color.id === colorOption.value,
        );

        if (!availableVariants.length) return;

        const currentSize = this.selectedSizeOption();

        // Tìm variant cùng màu + size hiện tại
        const currentVariant = availableVariants.find(
            (variant) => variant.size?.id === currentSize?.value,
        );

        // Nếu size hiện tại vẫn hợp lệ thì giữ nguyên size
        // Nếu không thì lấy variant đầu tiên còn hàng
        const nextVariant = currentVariant ?? availableVariants[0];

        this.selectedColorOption.set(colorOption);

        if (nextVariant.size) {
            this.selectedSizeOption.set({
                label: nextVariant.size.name,
                value: nextVariant.size.id,
            });
        } else {
            this.selectedSizeOption.set(null);
        }

        this.selectedImageIndex.set(0);
        this.quantity.set(1);
    }

    changeSize(sizeOption: Option): void {
        this.selectedSizeOption.set(sizeOption);
        this.quantity.set(1);
    }

    async toggleWishlist(event: MouseEvent) {
        const variant = this.selectedVariant();
        if (!variant) return;
        const isWishlisted = this.selectedVariant()!.isWishlisted;
        try {
            const authenticated = await this.requireAuth.execute(async () => {
                variant.isWishlisted = !isWishlisted;
                this.flyService.triggerFly(
                    event,
                    this.imagesByColor()[0].url,
                    'target-wishlist-icon',
                );
                await this.wishlistStore.toggle(variant.id);
            });
            if (!authenticated) {
                this.modalRef.close();
            }
        } catch (error) {
            console.log(error);
            variant.isWishlisted = isWishlisted;
        }
    }

    async addToCart(event: MouseEvent) {
        const variant = this.selectedVariant();
        if (!variant) return;

        try {
            const authenticated = await this.requireAuth.execute(async () => {
                const body: AddCartItem = {
                    variantId: variant.id,
                    quantity: this.quantity(),
                };
                this.flyService.triggerFly(
                    event,
                    this.imagesByColor()[0].url,
                    'target-cart-icon',
                );
                await this.cartStore.addToCart(body);
            });
            if (!authenticated) {
                this.modalRef.close();
            }
        } catch (error) {
            console.log(error);
        }
    }

    goToPdp() {
        const product = this.productResource.value();
        if (!product) return;
        const url = buildProductUrl(product.slug, product.id);
        this.router.navigateByUrl(url);
        this.modalRef.close();
    }
}
