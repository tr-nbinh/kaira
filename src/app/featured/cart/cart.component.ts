import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
    debounceTime,
    distinctUntilChanged,
    finalize,
    Subject,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { CartItem } from '../../models/cart.interface';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { LoadingToggleDirective } from '../../shared/directives/loading-toggle.directive';
import { FullPageLoadingComponent } from '../../shared/components/full-page-loading/full-page-loading.component';
import { CartEmptyComponent } from './cart-empty/cart-empty.component';

@Component({
    selector: 'app-cart',
    imports: [
        TranslatePipe,
        CurrencyPipe,
        LoadingToggleDirective,
        FormsModule,
        RouterLink,
        FullPageLoadingComponent,
        CartEmptyComponent
    ],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss',
})
export class CartComponent extends BaseComponent {
    cartItems: CartItem[] = [];
    subTotal: number = 0;
    private _quantityMap = new Map<number, Subject<number>>();

    isLoading = false;

    constructor(
        private cartService: CartService,
        private toast: ToastService,
        private loading: LoadingService,
        private router: Router,
        private checkoutService: CheckoutService
    ) {
        super();
    }

    ngOnInit() {
        this.getCartItems();
    }

    getCartItems() {
        this.cartService
            .getCartItems()
            .pipe(
                tap(() => (this.isLoading = true)),
                finalize(() => (this.isLoading = false)),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((cartItems) => {
                this.cartItems = cartItems;
                this.subTotal = this.calculateTotalAmount();
            });
    }

    removeFromCart(variantId: number) {
        const key = `cart-remove-${variantId}`;
        this.loading.show(key);
        this.cartService
            .removeFromCart(variantId)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => this.loading.hide(key))
            )
            .subscribe({
                next: (res) => {
                    const subject = this._quantityMap.get(variantId);
                    if (subject) {
                        subject.complete();
                        this._quantityMap.delete(variantId);
                    }
                    this.cartItems = this.cartItems.filter(
                        (item) => item.variantId !== variantId
                    );
                    this.subTotal = this.calculateTotalAmount();
                    this.toast.success(res.message);
                },
                error: (err) => {
                    this.toast.error(err.message);
                },
            });
    }

    increaseQuantity(cartItem: CartItem) {
        if (cartItem.quantity >= cartItem.quantityInStock) {
            this.toast.warning('không thể vượt quá số lượng trong kho');
            return;
        }

        cartItem.quantity++;
        this.updateVariantQuantity(cartItem.variantId, cartItem.quantity);
    }

    decreaseQuantity(cartItem: CartItem) {
        if (cartItem.quantity <= 1) return;
        cartItem.quantity--;
        this.updateVariantQuantity(cartItem.variantId, cartItem.quantity);
    }

    updateVariantQuantity(variantId: number, quantity: number) {
        if (!this._quantityMap.has(variantId)) {
            const subject = new Subject<number>();
            subject
                .pipe(
                    debounceTime(500),
                    distinctUntilChanged(),
                    switchMap((qty) =>
                        this.cartService.updateQuantityInCart(variantId, qty)
                    )
                )
                .subscribe({
                    next: (res) => {
                        this.subTotal = this.calculateTotalAmount();
                        this.toast.success(res.message);
                    },
                    error: (err) => {
                        this.toast.error(err.message);
                    },
                });
            this._quantityMap.set(variantId, subject);
        }
        this._quantityMap.get(variantId)?.next(quantity);
    }

    calculateTotalAmount(): number {
        return this.cartItems.reduce(
            (acc, curr) => acc + curr.finalPrice * curr.quantity,
            0
        );
    }

    goToCheckout() {
        this.checkoutService.setSelectedCartItems(this.cartItems);
        this.router.navigate(['/checkout']);
    }
}
