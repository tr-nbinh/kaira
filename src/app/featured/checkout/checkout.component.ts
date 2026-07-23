import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CartService } from '../../../core/sevices/cart.service';
import { DrawerService } from '../../../shared/components/drawer/drawer.service';
import { InputComponent } from '../../../shared/form-controls/inputs/input.component';
import { UserAddress } from '../../../shared/models/address.model';
import { AddressService } from '../../../shared/services/address.service';
import { ShippingService } from '../../../shared/services/shipping.service';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import {
    PAYMENT_METHODS,
    PaymentMethodType,
} from '../../../shared/constants/payment.constant';
import { AddressDrawerComponent } from './components/address-drawer/address-drawer.component';
import { CheckoutInput } from './models/checkout.model';
import { CheckoutService } from './checkout.service';
@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink,
        TranslatePipe,
        InputComponent,
        PricePipe,
    ],
    templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private cartService = inject(CartService);
    private drawerService = inject(DrawerService);
    private addressService = inject(AddressService);
    private shippingService = inject(ShippingService);
    private checkoutService = inject(CheckoutService);

    checkoutForm!: FormGroup;
    readonly paymentMethods = PAYMENT_METHODS;

    isSubmitting = signal<boolean>(false);
    cartItemsResource = rxResource({
        loader: () => {
            return this.cartService.getCartItems({ limit: 100, page: 1 });
        },
        defaultValue: {
            data: [],
            meta: { page: 1, limit: 100, totalPages: 0, totalCount: 0 },
        },
    });

    cartItems = computed(() => this.cartItemsResource.value());

    subtotal = computed(() => {
        const items = this.cartItems()?.data || [];
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });
    shippingFee = signal(0);

    total = computed(() => this.subtotal() + this.shippingFee());
    selectedAddress = signal<UserAddress | null>(null);

    ngOnInit() {
        this.initForm();
        this.addressService
            .getDefaultAddressForCurrentUser()
            .subscribe((res) => {
                this.selectedAddress.set(res);
                if (res) {
                    this.shippingService
                        .calculateShippingFee(
                            this.selectedAddress()!.provinceCode,
                        )
                        .subscribe((res) => {
                            this.shippingFee.set(res.fee);
                        });
                }
            });
    }

    private initForm() {
        this.checkoutForm = this.fb.group({
            email: [
                '',
                [
                    Validators.required,
                    Validators.pattern(
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    ),
                ],
            ],
            note: [''],
            paymentMethod: ['cod' as PaymentMethodType, Validators.required],
        });
    }

    onSubmit() {
        if (this.checkoutForm.invalid || !this.selectedAddress()) return;
        this.isSubmitting.set(true);
        const { email, note, paymentMethod } = this.checkoutForm.getRawValue();

        const orderPayload: CheckoutInput = {
            email,
            note,
            paymentMethod,
            shippingAddress: this.selectedAddress()!,
        };

        console.log('Đang gửi đơn hàng lên hệ thống:', orderPayload);

        this.checkoutService.placeOrder(orderPayload).subscribe(console.log);
    }

    openAddressModal() {
        const ref = this.drawerService.open<UserAddress | null, UserAddress>({
            title: 'Địa chỉ của tôi',
            position: 'right',
            size: 'md',
            content: AddressDrawerComponent,
            data: this.selectedAddress(),
        });

        ref.afterClosed().subscribe((res) => {
            if (res) {
                this.selectedAddress.set(res);

                const selectedAddress = this.selectedAddress();
                if (!selectedAddress) return;
                this.shippingService
                    .calculateShippingFee(selectedAddress.provinceCode)
                    .subscribe((res) => {
                        this.shippingFee.set(res.fee);
                    });
            }
        });
    }
}
