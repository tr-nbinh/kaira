import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
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
import { CheckoutService } from '../../services/checkout.service';
import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { LoadingToggleDirective } from '../../shared/directives/loading-toggle.directive';
import { ProductUrlPipe } from '../../shared/pipes/product-url.pipe';
import { CartEmptyComponent } from './components/cart-empty/cart-empty.component';
import { CartSkeletonComponent } from './components/cart-skeleton/cart-skeleton.component';
import { CartItem } from './models/cart.model';
import { CartService } from './services/cart.service';

@Component({
    selector: 'app-cart',
    imports: [
        TranslatePipe,
        CurrencyPipe,
        LoadingToggleDirective,
        FormsModule,
        RouterLink,
        CartEmptyComponent,
        CartSkeletonComponent,
        ProductUrlPipe,
    ],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss',
})
export class CartComponent extends BaseComponent {
    cartItems: CartItem[] = [];
    subTotal: number = 0;
    private _quantityMap = new Map<string, Subject<number>>();

    isLoading = true;
    currency: string = 'VND';

    constructor(
        private cartService: CartService,
        private toast: ToastService,
        private loading: LoadingService,
        private router: Router,
        private checkoutService: CheckoutService,
        private translate: TranslateService,
    ) {
        super();
    }

    ngOnInit() {
        this.currency = this.translate.currentLang == 'en' ? 'USD' : 'VND';
        this.getCartItems();
    }

    getCartItems() {
        this.cartService
            .getCartItems()
            .pipe(
                tap(() => (this.isLoading = true)),
                finalize(() => (this.isLoading = false)),
                takeUntil(this.ngUnsubscribe),
            )
            .subscribe((res) => {
                this.cartItems = res.cartItems;
                this.subTotal = res.subTotal;
            });
    }

    removeFromCart(variantId: string) {
        const key = `cart-remove-${variantId}`;
        this.loading.show(key);
        this.cartService
            .removeFromCart(variantId)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => this.loading.hide(key)),
            )
            .subscribe({
                next: (res) => {
                    this.subTotal = res.subTotal;
                    this.cartItems = this.cartItems.filter(
                        (item) => item.variantId !== variantId,
                    );

                    const subject = this._quantityMap.get(variantId);
                    if (subject) {
                        subject.complete();
                        this._quantityMap.delete(variantId);
                    }
                },
            });
    }

    increaseQuantity(cartItem: CartItem) {
        if (cartItem.quantity >= cartItem.stock) {
            return this.toast.warning(
                this.translate.instant('CART.MAX_QUATITY', {
                    stock: cartItem.stock,
                }),
            );
        }

        cartItem.quantity++;
        this.updateVariantQuantity(cartItem, cartItem.quantity);
    }

    decreaseQuantity(cartItem: CartItem) {
        if (cartItem.quantity <= 1) return;
        cartItem.quantity--;
        this.updateVariantQuantity(cartItem, cartItem.quantity);
    }

    updateVariantQuantity(cartItem: CartItem, quantity: number) {
        if (!this._quantityMap.has(cartItem.variantId)) {
            const subject = new Subject<number>();
            subject
                .pipe(
                    debounceTime(500),
                    distinctUntilChanged(),
                    switchMap((qty) =>
                        this.cartService.updateQuantityInCart(
                            cartItem.variantId,
                            qty,
                        ),
                    ),
                )
                .subscribe((res) => {
                    cartItem.displayFinalPrice = res.cartItemFinalPrice;
                    this.subTotal = res.subTotal;
                });
            this._quantityMap.set(cartItem.variantId, subject);
        }
        this._quantityMap.get(cartItem.variantId)?.next(quantity);
    }

    goToCheckout() {
        // this.checkoutService.setSelectedCartItems(this.cartItems);
        // this.router.navigate(['/checkout']);
    }
}
