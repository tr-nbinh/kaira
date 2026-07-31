import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AccordionComponent } from '../../../shared/components/accordion/accordion.component';
import { CdkAccordion } from '@angular/cdk/accordion';
import { ProductDetailSkeletonComponent } from './product-detail-skeleton/product-detail-skeleton.component';
import { AddCartItem } from '../../../core/models/cart.model';
import { CartStore } from '../../../core/stores/cart.store';
import { RequireAuthService } from '../../../core/auth/require-auth.service';
import { FlyAnimationService } from '../../../shared/services/fly-animation.service';
import { DrawerService } from '../../../shared/components/drawer/drawer.service';
import { SizeGuideComponent } from '../../../shared/components/size-guide/size-guide.component';
import { SafeHtmlPipe } from '../../../shared/pipes/safe-html.pipe';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    imports: [
        ColorSwatchComponent,
        QuantitySelectorComponent,
        SizeSelectorComponent,
        PricePipe,
        TranslatePipe,
        AccordionComponent,
        CdkAccordion,
        ProductDetailSkeletonComponent,
        SafeHtmlPipe,
        RouterLink,
    ],
})
export class ProductDetailComponent {
    private route = inject(ActivatedRoute);
    private productService = inject(ProductService);
    private cartStore = inject(CartStore);
    private requireAuth = inject(RequireAuthService);
    private drawerService = inject(DrawerService);
    private flyService = inject(FlyAnimationService);
    private titleService = inject(Title);
    private translate = inject(TranslateService);

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
            const brandName =
                this.translate.instant('BRAND_NAME') || 'TNB.Studio';

            if (!product) {
                this.titleService.setTitle(
                    `${this.translate.instant('PDP.NOT_FOUND_TITLE')} - ${brandName}`,
                );
                return;
            }

            this.titleService.setTitle(`${product.name} - ${brandName}`);

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

    changeColor(colorOption: ColorOption) {
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

        this.quantity.set(1);
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

    openSizeGuide() {
        const prod = this.productResource.value();
        this.drawerService.open({
            content: SizeGuideComponent,
            title: 'Size guide',
            position: 'right',
            size: 'xl',
            data: { categoryType: prod?.categoryType, gender: prod?.gender },
        });
    }
}
