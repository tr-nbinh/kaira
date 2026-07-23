import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.componet';
import { BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.model';
import { ColorSwatchComponent } from '../../../shared/components/color-swatch/color-swatch.component';
import { QuantitySelectorComponent } from '../../../shared/components/quantity-selector/quantity-selector.component';
import { SizeSelectorComponent } from '../../../shared/components/size-selector/size-selector.component';
import { ColorOption, Option } from '../../../shared/models/option.model';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { ProductService } from '../../../shared/services/product.service';
import { parseProductUrl } from '../../../shared/utils/product-url.helper';
import { TranslatePipe } from '@ngx-translate/core';
import { AccordionComponent } from '../../../shared/components/accordion/accordion.component';
import { CdkAccordion } from '@angular/cdk/accordion';
import { ProductDetailSkeletonComponent } from './product-detail-skeleton/product-detail-skeleton.component';
import { AddCartItem } from '../../../core/models/cart.model';
import { CartStore } from '../../../core/stores/cart.store';
import { RequireAuthService } from '../../../core/auth/require-auth.service';
import { FlyAnimationService } from '../../../shared/services/fly-animation.service';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    imports: [
        BreadcrumbComponent,
        ColorSwatchComponent,
        QuantitySelectorComponent,
        SizeSelectorComponent,
        PricePipe,
        TranslatePipe,
        AccordionComponent,
        CdkAccordion,
        ProductDetailSkeletonComponent,
    ],
})
export class ProductDetailComponent {
    private route = inject(ActivatedRoute);
    private productService = inject(ProductService);
    private cartStore = inject(CartStore);
    private requireAuth = inject(RequireAuthService);
    private flyService = inject(FlyAnimationService);

    productId = toSignal(
        this.route.paramMap.pipe(
            map((params) => parseProductUrl(params.get('slug'))),
        ),
        { initialValue: null },
    );
    quantity = signal<number>(1);
    selectedColorOption = signal<ColorOption | null>(null);
    selectedSizeOption = signal<Option | null>(null);

    breadcrumbs: BreadcrumbItem[] = [
        {
            label: 'Bags',
            url: '/bags',
        },
        {
            label: 'Iconic Baguette',
            url: '/iconic-baguette',
        },
        {
            label: 'Baguette Mid',
        },
    ];

    productResource = rxResource({
        request: () => this.productId(),
        loader: ({ request }) => {
            return this.productService.getProductById(request!.id);
        },
    });

    colorOptions = computed(() => {
        const prod = this.productResource.value();
        if (!prod) return [];

        return prod.colors.map((c) => {
            const availableColorIds = prod.variants
                .filter((v) => v.stock > 0)
                .map((v) => v.color.id);
            const availableColorValues = new Set<string>(availableColorIds);

            const result: ColorOption = {
                label: c.name,
                value: c.id,
                hex: c.value_code,
                disabled: !availableColorValues.has(c.id),
            };
            return result;
        });
    });

    readonly sizeOptions = computed(() => {
        const prod = this.productResource.value();
        if (!prod || !prod.sizes) return [];

        return prod.sizes.map((s) => {
            const availableSizeIds = prod.variants
                .filter((v) => v.stock > 0)
                .map((v) => v.size!.id);
            const availableSizeValues = new Set<string>(availableSizeIds);

            const result: ColorOption = {
                label: s.name,
                value: s.id,
                hex: s.value_code,
                disabled: !availableSizeValues.has(s.id),
            };
            return result;
        });
    });

    selectedVariant = computed(() => {
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

    imagesByColor = computed(() => {
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

    async onAddToBag(event: MouseEvent) {
        const variant = this.selectedVariant();
        if (!variant) return;

        try {
            await this.requireAuth.execute(async () => {
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
        } catch (error) {
            console.log(error);
        }
    }
}
