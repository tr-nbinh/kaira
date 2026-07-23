import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../core/sevices/base.service';
import { CreateAddress, UserAddress } from '../models/address.model';
import { HttpContext } from '@angular/common/http';
import { SHOW_TOAST } from '../../core/token';
import { CACHE_KEYS } from '../../core/cache/cache-keys';

@Injectable({
    providedIn: 'root',
})
export class AddressService extends BaseService {
    private readonly _endpoint: string = 'addresses';

    getAddressesForCurrentUser(): Observable<UserAddress[]> {
        return this.get(
            this._endpoint,
            {},
            { cacheKey: CACHE_KEYS.user.ADDRESSES },
        );
    }

    getDefaultAddressForCurrentUser(): Observable<UserAddress | null> {
        return this.get(`${this._endpoint}/default`);
    }

    saveAddress(body: CreateAddress): Observable<UserAddress> {
        return this.post(this._endpoint, body, {
            context: new HttpContext().set(SHOW_TOAST, true),
        });
    }

    // updateAddress(
    //     addressData: Partial<Address>,
    //     addressId: number,
    // ): Observable<Address> {
    //     return this.patch(`${this._endpoint}/${addressId}`, addressData, {
    //         context: new HttpContext().set(SHOW_TOAST, true),
    //     });
    // }

    // // Hàm này sẽ được sử dụng để xóa địa chỉ
    // deleteAddress(addressId: number): void {
    //     // Logic để xóa địa chỉ
    //     console.log('Địa chỉ đã được xóa:', addressId);
    // }
}
