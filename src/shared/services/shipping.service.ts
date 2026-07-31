import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../core/sevices/base.service';

@Injectable({ providedIn: 'root' })
export class ShippingService extends BaseService {
    private readonly _endpoint = 'shipping';

    calculateShippingFee(provinceCode: number): Observable<{ fee: number }> {
        return this.post<{ fee: number }>(`${this._endpoint}/fee`, {
            provinceCode,
        });
    }
}
