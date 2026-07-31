import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExchangeRate } from '../models/exchangeRate.model';
import { BaseService } from '../../core/sevices/base.service';

@Injectable({
    providedIn: 'root',
})
export class ExchangeRateService extends BaseService {
    getUsdRate(): Observable<ExchangeRate> {
        return this.get('exchange-rate', {}, { cacheKey: 'usd-rate:global' });
    }
}
