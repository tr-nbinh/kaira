import {
    Component,
    inject,
    signal,
    input,
    output,
    OnInit,
    computed,
} from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { AddressService } from '../../../../../shared/services/address.service';
import {
    CreateAddress,
    UserAddress,
} from '../../../../../shared/models/address.model';
import { DrawerRef } from '../../../../../shared/components/drawer/drawer-ref';
import { LocationService } from '../../../../../shared/services/location.service';
import { Ward } from '../../../../../shared/models/location.model';
import { HttpCacheService } from '../../../../../core/cache/http-cache.service';
import { CACHE_KEYS } from '../../../../../core/cache/cache-keys';
import {
    DRAWER_DATA,
    DrawerConfig,
} from '../../../../../shared/components/drawer/models/drawer.model';

export interface SavedAddress {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    street: string;
    ward: string;
    district: string;
    province: string;
    isDefault: boolean;
}

@Component({
    selector: 'app-address-drawer',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './address-drawer.component.html',
})
export class AddressDrawerComponent implements OnInit {
    private fb = inject(FormBuilder);
    private locationService = inject(LocationService);
    private addressService = inject(AddressService);
    private cacheService = inject(HttpCacheService);
    private drawerRef = inject(DrawerRef);
    private config = inject(DRAWER_DATA) as DrawerConfig<UserAddress>;

    isAddingNewAddress = signal<boolean>(false);
    newAddressForm!: FormGroup;

    userAddressesResource = rxResource({
        loader: () => {
            return this.addressService.getAddressesForCurrentUser();
        },
        defaultValue: [],
    });

    selectedAddress = signal<UserAddress | null>(this.config.data || null);

    readonly provinces = toSignal(this.locationService.getProvinces(), {
        initialValue: [],
    });
    wards = signal<Ward[]>([]);

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.newAddressForm = this.fb.group({
            fullName: ['', Validators.required],
            phone: ['', Validators.pattern(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/)],
            provinceCode: ['', Validators.required],
            wardCode: [{ value: '', disabled: true }, Validators.required],
            addressLine: ['', Validators.required],
            addressExtra: [''],
            isDefault: [false],
        });
    }

    selectAddress(addr: UserAddress) {
        this.selectedAddress.set(addr);
        this.drawerRef.close(addr);
    }

    onProvinceChange(event: any) {
        const selectedProvinceCode = Number(
            (event.target as HTMLSelectElement).value,
        );
        this.wards.set([]);
        this.newAddressForm.get('wardCode')?.setValue('');
        this.newAddressForm.get('wardCode')?.disable();

        if (selectedProvinceCode) {
            this.locationService
                .getWardsByProvinceCode(selectedProvinceCode)
                .subscribe((res) => {
                    this.wards.set(res);
                    this.newAddressForm.get('wardCode')?.enable();
                });
        } else {
            this.newAddressForm.get('wardCode')?.disable();
        }
    }

    onSaveNewAddress() {
        if (this.newAddressForm.invalid) return;
        const {
            fullName,
            phone,
            addressLine,
            provinceCode,
            wardCode,
            addressExtra,
            isDefault,
        } = this.newAddressForm.getRawValue();
        const provinceObj = this.provinces().find(
            (p) => p.code == Number(provinceCode),
        )!;
        const wardObj = this.wards().find((w) => w.code == Number(wardCode))!;

        const body: CreateAddress = {
            fullName,
            phone,
            addressLine,
            provinceCode: provinceObj.code,
            provinceName: provinceObj.name,
            wardCode: wardObj.code,
            wardName: wardObj.name,
            addressExtra,
            isDefault,
        };

        this.addressService.saveAddress(body).subscribe({
            next: (res) => {
                this.newAddressForm.reset({ wardCode: '', provinceCode: '' });
                this.cacheService.clearCache(CACHE_KEYS.user.ADDRESSES);
                this.userAddressesResource.reload();
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
}
