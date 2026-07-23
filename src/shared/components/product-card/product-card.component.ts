import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { WishlistStore } from '../../../core/stores/wishlist.store';
import { Product } from '../../models/product.model';
import { PricePipe } from '../../pipes/price.pipe';
import { ProductUrlPipe } from '../../pipes/product-url.pipe';
import { ImageHoverComponent } from '../image-hover/image-hover.component';
import { ModalService } from '../modal/modal.service';
import { ProductQuickViewComponent } from '../product-quick-view/product-quick-view.component';
import { RequireAuthService } from '../../../core/auth/require-auth.service';
import { FlyAnimationService } from '../../services/fly-animation.service';

@Component({
    selector: 'app-product-card',
    imports: [
        RouterLink,
        ImageHoverComponent,
        TranslatePipe,
        PricePipe,
        ProductUrlPipe,
    ],
    templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
    private modal = inject(ModalService);
    private wishlistStore = inject(WishlistStore);
    private requireAuthService = inject(RequireAuthService);
    private flyService = inject(FlyAnimationService);

    product = input.required<Product>();

    openQuickView(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.modal.open<{ productId: string; variantId: string }>({
            content: ProductQuickViewComponent,
            title: 'Quick View',
            size: 'xl',
            data: {
                productId: this.product().id,
                variantId: this.product().variantId,
            },
        });
    }

    async toggleWishlist(event: MouseEvent) {
        const isWishlisted = this.product().isWishlisted;
        try {
            await this.requireAuthService.execute(async () => {
                this.product().isWishlisted = !isWishlisted;
                this.flyService.triggerFly(
                    event,
                    this.product().primaryImageUrl,
                    'target-wishlist-icon',
                );
                await this.wishlistStore.toggle(this.product().variantId);
            });
        } catch (error) {
            console.log(error);
            this.product().isWishlisted = isWishlisted;
        }
    }
}
