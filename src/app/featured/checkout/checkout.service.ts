import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../core/sevices/base.service';
import { CheckoutInput } from './models/checkout.model';

@Injectable({
    providedIn: 'root',
})
export class CheckoutService extends BaseService {
    private readonly _endpoint = 'checkout';

    placeOrder(body: CheckoutInput): Observable<any> {
        return this.post(`${this._endpoint}/place-order`, body);
    }
}
