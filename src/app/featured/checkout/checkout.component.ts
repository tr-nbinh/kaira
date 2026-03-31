import { CurrencyPipe } from '@angular/common';
import { Component, signal, TemplateRef, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { finalize, forkJoin, of, takeUntil } from 'rxjs';
import { getChangedFields } from '../../../utils/object.util';
import { BaseComponent } from '../../base/base.component';
import { Address } from '../../models/address.interface';
import { District, Province, Ward } from '../../models/location.interface';
import { AddressService } from '../../services/address.service';
import { CheckoutService } from '../../services/checkout.service';
import { DialogService } from '../../services/dialog.service';
import { LocationService } from '../../services/location.service';
import { MapService } from '../../services/map.service';
import { ToastService } from '../../services/toast.service';
import { MapComponent } from '../../shared/components/map/map.component';
import { FormControlErrorDirective } from '../../shared/directives/form-control-error.directive';
import { ProductUrlPipe } from '../../shared/pipes/product-url.pipe';
import { CartItem } from '../cart/models/cart.model';
import { CartService } from '../cart/services/cart.service';
import { CheckoutRequest } from './models/checkout.model';
import { uuidv4 } from '../../../utils/uuid.util';

@Component({
    selector: 'app-checkout',
    imports: [
        CurrencyPipe,
        ReactiveFormsModule,
        FormsModule,
        FormControlErrorDirective,
        TranslatePipe,
        RouterLink,
        ProductUrlPipe,
    ],
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.scss',
})
export class CheckoutComponent extends BaseComponent {
    addresses: Address[] = [];
    selectedAddress: Address | undefined = undefined;
    selectedAddresId: number | undefined = undefined;
    provinces: Province[] = [];
    districts: District[] = [];
    wards: Ward[] = [];
    orderItems: CartItem[] = [];

    subTotal: number = 0;
    shippingFee: number = 0;
    provinceName: string = '';
    districtName: string = '';
    wardName: string = '';

    addressForm!: FormGroup;
    @ViewChild('addressList') addressList!: TemplateRef<any>;
    @ViewChild('addEditAddress') addEditAddress!: TemplateRef<any>;
    @ViewChild(MapComponent) mapComponent!: MapComponent; // Tham chiếu đến MapComponent

    private lastProvinceCode: number | null = null;
    private lastDistrictCode: number | null = null;
    order: CheckoutRequest = {
        checkoutId: uuidv4(),
        addressId: 0,
        note: '',
        paymentMethod: 'cod',
        shippingFee: 0,
        items: [],
    };
    isOrdering = signal(false);

    constructor(
        private locationService: LocationService,
        private checkoutService: CheckoutService,
        private toast: ToastService,
        private router: Router,
        private fb: FormBuilder,
        private dialog: DialogService,
        private map: MapService,
        private addressService: AddressService,
        private translate: TranslateService,
        private cartService: CartService,
    ) {
        super();
    }

    ngOnInit() {
        this.cartService
            .getCartItems()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((res) => {
                if (!res.cartItems.length) {
                    this.toast.error(
                        'Không có sản phẩm trong giỏ hàng, bạn sẽ được điều hướng qua trang sản phẩm',
                    );
                    setTimeout(() => {
                        this.router.navigate(['/shop']);
                    }, 3000);
                }
                this.orderItems = res.cartItems;
                this.subTotal = res.subTotal;
            });
        this.initForms();
        this.loadProvinces();
        this.getAddresses();
    }

    initForms() {
        this.addressForm = this.fb.group({
            receiverName: ['', Validators.required],
            provinceCode: ['', Validators.required],
            districtCode: ['', Validators.required],
            wardCode: ['', Validators.required],
            street: ['', Validators.required],
            addressExtra: [''],
            phone: [
                '',
                [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)],
            ],
            email: [
                '',
                [
                    Validators.required,
                    Validators.pattern(
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    ),
                ],
            ],
            isDefault: [false],
        });
    }

    getAddresses() {
        this.addressService
            .getAddressesForCurrentUser()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((addrs) => {
                this.addresses = addrs;
                const defaultAddress = addrs.find((a) => a.isDefault);
                this.setSelectedAddress(defaultAddress);
            });
    }

    loadProvinces() {
        this.locationService.getProvinces().subscribe({
            next: (data) => {
                this.provinces = data;
            },
            error: (error) => {
                console.error('Error loading provinces:', error);
            },
        });
    }

    onProvinceChange(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        if (!selectElement.value) {
            this.districts = [];
            this.wards = [];
            this.provinceName = '';
            return;
        }
        this.provinceName =
            selectElement.options[selectElement.selectedIndex].text;
        this.loadDisTricts(Number(selectElement.value));
    }

    loadDisTricts(provinceCode: number) {
        this.locationService
            .getDistrictsByProvinceCode(provinceCode)
            .subscribe({
                next: (data) => {
                    this.districts = data;
                },
                error: (error) => {
                    console.error('Error loading districts:', error);
                },
            });
    }

    onDisTrictChange(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        if (!selectElement.value) {
            this.wards = []; // Clear wards if no district is selected
            this.districtName = '';
            return;
        }
        this.districtName =
            selectElement.options[selectElement.selectedIndex].text;
        this.loadWards(Number(selectElement.value));
    }

    loadWards(districtCode: number) {
        this.locationService.getWardsByDistrictCode(districtCode).subscribe({
            next: (data) => {
                this.wards = data;
            },
            error: (error) => {
                console.error('Error loading wards:', error);
            },
        });
    }

    onWardChange(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        if (!selectElement.value) {
            this.wardName = '';
            return;
        }
        this.wardName = selectElement.options[selectElement.selectedIndex].text;
    }

    submitOrder() {
        if (!this.selectedAddresId) {
            return this.toast.warning(
                this.translate.instant('CHECKOUT.ADD_YOUR_ADDRESS'),
            );
        }
        this.order.addressId = this.selectedAddresId!;
        this.order.items = this.orderItems.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
        }));
        console.log(this.order);
        this.checkoutService
            .checkout(this.order)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: (res) => {
                    this.router.navigate(['/order-success'], {
                        queryParams: { orderId: res.id },
                    });
                },
                error: (err) => {
                    this.toast.error(err.message);
                },
            });
    }

    openAddressListDialog() {
        this.dialog.open({
            title: this.translate.instant('CHECKOUT.ADDRESS_DIALOG.TITLE'),
            body: this.addressList,
            onConfirm: () => {
                if (this.selectedAddresId !== this.selectedAddress?.id) {
                    this.updateAddress();
                }
            },
            onCancel: () => {
                this.selectedAddresId = this.selectedAddress?.id;
            },
        });
    }

    openAddEditLocationDialog(addr?: Address) {
        if (addr) {
            const currentProvinceCode = addr.provinceCode;
            const currentDistrictCode = addr.districtCode;
            const getDistricts$ =
                currentProvinceCode !== this.lastProvinceCode
                    ? this.locationService.getDistrictsByProvinceCode(
                          currentProvinceCode,
                      )
                    : of(this.districts);
            const getWards$ =
                currentDistrictCode !== this.lastDistrictCode
                    ? this.locationService.getWardsByDistrictCode(
                          currentDistrictCode,
                      )
                    : of(this.wards);

            forkJoin([getDistricts$, getWards$]).subscribe({
                next: ([districts, wards]) => {
                    this.districts = districts;
                    this.wards = wards;
                    this.lastProvinceCode = currentProvinceCode;
                    this.lastDistrictCode = currentDistrictCode;

                    this.addressForm.patchValue({
                        ...addr,
                    });

                    if (addr.isDefault) {
                        this.addressForm.get('isDefault')?.disable();
                    } else {
                        this.addressForm.get('isDefault')?.enable();
                    }

                    this.dialog.open({
                        title: this.translate.instant(
                            'CHECKOUT.UPDATE_ADDR_DIALOG.TITLE',
                        ),
                        body: this.addEditAddress,
                        onConfirm: () => {
                            const isSuccess = this.updateAddress(addr);
                            if (isSuccess) this.addressForm.reset();
                            return isSuccess;
                        },
                        onCancel: () => {
                            this.addressForm.reset();
                        },
                    });
                },
                error: () => {
                    this.toast.error('Không tải được dữ liệu địa lý');
                },
            });
        } else {
            if (this.addresses.length == 0) {
                this.addressForm.get('isDefault')?.setValue(true);
                this.addressForm.get('isDefault')?.disable();
            }
            this.dialog.open({
                title: this.translate.instant(
                    'CHECKOUT.CREATE_ADDR_DIALOG.TITLE',
                ),
                body: this.addEditAddress,
                onConfirm: () => {
                    const isSuccess = this.saveAddress();
                    if (isSuccess) this.addressForm.reset();
                    return isSuccess;
                    // this.geocodeAddress(); // Gọi geocodeAddress sau khi lưu địa chỉ
                },
                onCancel: () => {
                    this.addressForm.reset();
                },
            });
        }
    }

    saveAddress(): boolean {
        let isSuccess = true;
        if (this.addressForm.invalid) {
            this.addressForm.markAllAsTouched();
            Object.keys(this.addressForm.controls).forEach((key) => {
                const control = this.addressForm.get(key);
                control?.updateValueAndValidity({
                    emitEvent: true,
                    onlySelf: true,
                });
            });
            return false;
        }
        const addressData: Address = this.addressForm.getRawValue();
        addressData.address = this.getFullAddress();

        this.addressService
            .saveAddress(addressData)
            .pipe(
                finalize(() => (isSuccess = true)),
                takeUntil(this.ngUnsubscribe),
            )
            .subscribe({
                next: (newAddr: Address) => {
                    this.addresses.push(newAddr);
                    if (newAddr.isDefault) {
                        this.setSelectedAddress(newAddr);
                    }
                },
                error: (error) => {
                    this.toast.error(error.message || 'Lỗi khi lưu địa chỉ');
                },
            });

        return isSuccess;
    }

    updateAddress(oldAddressData?: Address): boolean {
        let isSuccess = true;
        let addressId = this.selectedAddresId!;
        let updatedAddressData: Partial<Address> = {};

        if (oldAddressData) {
            if (this.addressForm.invalid) {
                this.addressForm.markAllAsTouched();
                Object.keys(this.addressForm.controls).forEach((key) => {
                    const control = this.addressForm.get(key);
                    control?.updateValueAndValidity({
                        emitEvent: true,
                        onlySelf: true,
                    });
                });
                return false;
            }
            const newAddressData = this.addressForm.getRawValue();

            updatedAddressData = {
                ...getChangedFields(oldAddressData, newAddressData),
                isDefault: newAddressData.isDefault,
            };

            addressId = oldAddressData.id;
        } else {
            updatedAddressData = { isDefault: true };
        }

        if (
            updatedAddressData.hasOwnProperty('provinceCode') ||
            updatedAddressData.hasOwnProperty('districtCode') ||
            updatedAddressData.hasOwnProperty('wardCode')
        ) {
            updatedAddressData.address = this.getFullAddress();
        }

        this.addressService
            .updateAddress(updatedAddressData, addressId)
            .pipe(
                finalize(() => (isSuccess = true)),
                takeUntil(this.ngUnsubscribe),
            )
            .subscribe({
                next: (addr) => {
                    const indexToUpdate = this.addresses.findIndex(
                        (a) => a.id === addr.id,
                    );

                    if (addr.isDefault) {
                        this.addresses.forEach((a) => {
                            a.isDefault = false;
                        });
                        this.setSelectedAddress(addr);
                    }

                    if (indexToUpdate !== -1) {
                        this.addresses[indexToUpdate] = addr;
                    }
                },
                error: (err) => {
                    this.toast.error(err.message);
                },
            });

        return isSuccess;
    }

    geocodeAddress(): void {
        const address = `${this.wardName}, ${this.districtName}, ${this.provinceName}, Việt Nam`;
        if (address) {
            this.map.getCoordinates(address).subscribe({
                next: (data) => {
                    if (data && data.length > 0) {
                        const lat = parseFloat(data[0].lat);
                        const lon = parseFloat(data[0].lon);
                        // Gửi tọa độ đến MapComponent để thêm marker
                        this.mapComponent.addOrUpdateMarker(lat, lon, address);
                        this.mapComponent.setCenter(lat, lon); // Di chuyển bản đồ đến vị trí mới
                    } else {
                        console.warn(
                            'Không tìm thấy tọa độ cho địa chỉ:',
                            address,
                        );
                        this.mapComponent.clearMarkers(); // Xóa marker nếu không tìm thấy
                    }
                },
                error: (error) => {
                    console.error('Lỗi khi geocoding:', error);
                    this.mapComponent.clearMarkers(); // Xóa marker nếu có lỗi
                },
            });
        } else {
            // Nếu không có địa chỉ, xóa marker cũ
            this.mapComponent.clearMarkers();
        }
    }

    setSelectedAddress(addr: Address | undefined) {
        this.selectedAddress = addr;
        this.selectedAddresId = addr?.id;
    }

    getFullAddress(): string {
        return `${this.wardName}, ${this.districtName}, ${this.provinceName}`;
    }
}
