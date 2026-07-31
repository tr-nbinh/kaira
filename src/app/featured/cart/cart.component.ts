import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
    CartItem,
    UpdateCartItemQuantity,
} from '../../../core/models/cart.model';
import { CartService } from '../../../core/sevices/cart.service';
import { QuantitySelectorComponent } from '../../../shared/components/quantity-selector/quantity-selector.component';
import { PaginatedRequest } from '../../../shared/models/pagination.model';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { ProductUrlPipe } from '../../../shared/pipes/product-url.pipe';
import { CartSkeletonComponent } from './components/cart-skeleton/cart-skeleton.component';
import {
    debounceTime,
    distinctUntilChanged,
    finalize,
    Subject,
    switchMap,
} from 'rxjs';
import { CartStore } from '../../../core/stores/cart.store';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [
        RouterLink,
        TranslatePipe,
        PricePipe,
        CartSkeletonComponent,
        QuantitySelectorComponent,
        ProductUrlPipe,
    ],
    templateUrl: './cart.component.html',
})
export class CartComponent {
    private cartService = inject(CartService);
    private cartStore = inject(CartStore);

    paginatedRequest = signal<PaginatedRequest>({ limit: 10, page: 1 });
    isUpdating = signal<boolean>(false);
    private localOverride = signal<CartItem[] | null>(null);

    cartResource = rxResource({
        request: () => this.paginatedRequest(),
        loader: ({ request }) => this.cartService.getCartItems(request),
    });

    readonly cartItems = computed(() => {
        const override = this.localOverride();
        if (override !== null) return override;
        return this.cartResource.value()?.data || [];
    });

    readonly meta = computed(
        () =>
            this.cartResource.value()?.meta ?? {
                limit: 10,
                page: 1,
                totalCount: 0,
                totalPages: 0,
            },
    );

    // Tự động tính toán tổng số tiền (Subtotal, Tax, Final Total) độc lập ngay tại client
    readonly orderSummary = computed(() => {
        const items = this.cartItems();
        const subtotal = items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
        );
        const currency = items[0]?.currency || 'VND';
        const shipping = subtotal > 2000000 || subtotal === 0 ? 0 : 35000; // Freeship cho đơn hàng > 2M

        return {
            subtotal,
            shipping,
            total: subtotal + shipping,
            currency,
        };
    });

    private quantitySubjects = new Map<string, Subject<number>>();

    async handleUpdateQuantity(cartItemId: string, nextQuantity: number) {
        const currentList = this.cartItems();
        const targetItem = currentList.find((i) => i.id === cartItemId);
        if (!targetItem || nextQuantity < 1 || nextQuantity > targetItem.stock)
            return;
        const optimisticList = currentList.map((item) =>
            item.id === cartItemId ? { ...item, quantity: nextQuantity } : item,
        );
        this.localOverride.set(optimisticList);

        let subject = this.quantitySubjects.get(cartItemId);
        if (!subject) {
            subject = new Subject<number>();
            subject
                .pipe(
                    debounceTime(400),
                    distinctUntilChanged(),
                    switchMap((finalQuantity) =>
                        this.cartService
                            .updateQuantity({
                                cartItemId,
                                quantity: finalQuantity,
                            })
                            .pipe(finalize(() => this.localOverride.set(null))),
                    ),
                )
                .subscribe({
                    next: (res) => {
                        console.log(res);
                        this.cartResource.update((currentCache) => {
                            if (!currentCache) return currentCache;
                            return {
                                ...currentCache,
                                data: currentCache.data.map((item) =>
                                    item.id === cartItemId
                                        ? { ...item, quantity: res.quantity }
                                        : item,
                                ),
                            };
                        });
                    },
                    error(err) {
                        console.error(
                            'Đồng bộ số lượng lỗi, khôi phục trạng thái cũ',
                            err,
                        );
                    },
                });

            this.quantitySubjects.set(cartItemId, subject);
        }

        subject.next(nextQuantity);
    }

    async handleRemoveItem(itemId: string) {
        const currentList = this.cartItems();
        const optimisticList = currentList.filter((item) => item.id !== itemId);
        this.localOverride.set(optimisticList);
        try {
            this.isUpdating.set(true);
            await this.cartStore.deleteItem(itemId);
            // B. Cập nhật bộ đệm sạch của hệ thống, hạ tổng số lượng (meta.total) xuống 1 đơn vị
            this.cartResource.update((currentCache) => {
                if (!currentCache) return currentCache;
                return {
                    meta: {
                        ...currentCache.meta,
                        total:
                            currentCache.meta.totalCount > 0
                                ? currentCache.meta.totalCount - 1
                                : 0,
                    },
                    data: currentCache.data.filter(
                        (item) => item.id !== itemId,
                    ),
                };
            });
        } catch (error) {
            console.error('Xóa sản phẩm lỗi, khôi phục dòng sản phẩm', error);
        } finally {
            this.localOverride.set(null);
            this.isUpdating.set(false);
        }
    }
}
