import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCacheService } from '../../base/base-cache.service';
import { BaseService } from '../../base/base.service';
import { ExchangeRate } from '../models/exchangeRate.model';

@Injectable({
    providedIn: 'root',
})
export class ExchangeRateService extends BaseService {
    private readonly _endpoint = 'exchange-rate';
    constructor(
        http: HttpClient,
        private cacheService: BaseCacheService,
    ) {
        super(http);
    }

    getUsdRate(): Observable<ExchangeRate> {
        const rate$ = this.get<ExchangeRate>(this._endpoint);
        return this.cacheService.cacheRequest('exchange-rate', rate$);
    }
}
