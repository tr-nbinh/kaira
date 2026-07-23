import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { WishlistItem } from '../../../core/models/wishlist.model';
import { WishlistService } from '../../../core/sevices/wishlist.service';
import { WishlistStore } from '../../../core/stores/wishlist.store';
import { PaginatedRequest } from '../../../shared/models/pagination.model';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { WishlistSkeletonComponent } from './wishlist-skeleton/wishlist-skeleton.component';
import { CartStore } from '../../../core/stores/cart.store';
import { AddCartItem } from '../../../core/models/cart.model';
import { RequireAuthService } from '../../../core/auth/require-auth.service';
import { FlyAnimationService } from '../../../shared/services/fly-animation.service';

@Component({
    selector: 'app-wishlist',
    standalone: true,
    imports: [TranslatePipe, RouterLink, PricePipe, WishlistSkeletonComponent],
    templateUrl: './wishlist.component.html',
})
export class WishlistComponent {
    private wishlistService = inject(WishlistService);
    private wishlistStore = inject(WishlistStore);
    private cartStore = inject(CartStore);
    private requireAuth = inject(RequireAuthService);
    private flyService = inject(FlyAnimationService);

    paginatedRequest = signal<PaginatedRequest>({ limit: 10, page: 1 });
    private localOverride = signal<WishlistItem[] | null>(null);
    activeProductIndex = signal<number>(0);

    wishlistResource = rxResource({
        request: () => this.paginatedRequest(),
        loader: ({ request }) => {
            return this.wishlistService.getWishlistItems(request);
        },
    });

    readonly wishlistProducts = computed(() => {
        const value = this.wishlistResource.value();
        const override = this.localOverride();
        if (override !== null) return override; // Nếu FE đã bấm xóa, dùng mảng này ngay

        return value?.data || []; // Mặc định dùng từ API Resource
    });

    readonly meta = computed(
        () =>
            this.wishlistResource.value()?.meta ?? {
                limit: 10,
                page: 1,
                totalCount: 0,
                totalPages: 0,
            },
    );

    async handleWishlistToggle(variantId: string) {
        const currentList = this.wishlistProducts();
        const updatedList = currentList.filter(
            (item) => item.variantId !== variantId,
        );
        this.localOverride.set(updatedList);

        try {
            await this.wishlistStore.toggle(variantId);

            this.wishlistResource.update((currentResponse) => {
                if (!currentResponse) return currentResponse;
                return {
                    ...currentResponse,
                    data: currentResponse.data.filter(
                        (item) => item.variantId !== variantId,
                    ),

                    meta: currentResponse.meta
                        ? {
                              ...currentResponse.meta,
                              totalCount:
                                  currentResponse.meta.totalCount > 0
                                      ? currentResponse.meta.totalCount - 1
                                      : 0,
                          }
                        : currentResponse.meta,
                };
            });
        } catch (error) {
            console.error(
                'Gỡ sản phẩm thất bại, hệ thống đang khôi phục dòng này:',
                error,
            );
        } finally {
            this.localOverride.set(null);
        }
    }

    async addToCart(event: MouseEvent, item: WishlistItem) {
        try {
            await this.requireAuth.execute(async () => {
                const body: AddCartItem = {
                    variantId: item.variantId,
                    quantity: 1,
                };
                this.flyService.triggerFly(
                    event,
                    item.imageUrl,
                    'target-cart-icon',
                );
                await this.cartStore.addToCart(body);
            });
        } catch (error) {
            console.log(error);
        }
    }
}
