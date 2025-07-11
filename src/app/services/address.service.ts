import { Injectable } from '@angular/core';
import { Address } from '../models/address.interface';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';

@Injectable({
    providedIn: 'root',
})
export class AddressService extends BaseService {
    private readonly _endpoint: string = 'addresses';

    getAddressesForCurrentUser(): Observable<Address[]> {
        return this.get(this._endpoint);
    }

    saveAddress(addressData: Address): Observable<Address> {
        return this.post(this._endpoint, addressData);
    }

    updateAddress(
        addressData: Partial<Address>,
        addressId: number
    ): Observable<Address> {
        return this.patch(`${this._endpoint}/${addressId}`, addressData);
    }

    // Hàm này sẽ được sử dụng để xóa địa chỉ
    deleteAddress(addressId: number): void {
        // Logic để xóa địa chỉ
        console.log('Địa chỉ đã được xóa:', addressId);
    }
}
