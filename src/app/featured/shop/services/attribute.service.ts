import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../base/base.service';
import { ProductAttribute } from '../models/product.model';
import { BaseCacheService } from '../../../base/base-cache.service';

@Injectable({
    providedIn: 'root',
})
export class AttributeService extends BaseService {
    private _endpoint = 'attributes';
    private _endpointColor = 'colors';

    constructor(
        http: HttpClient,
        private cacheService: BaseCacheService,
    ) {
        super(http);
    }

    getColors(): Observable<ProductAttribute[]> {
        const color$: Observable<ProductAttribute[]> = this.get(
            `${this._endpoint}/${this._endpointColor}`,
        );
        return this.cacheService.cacheRequest('colors', color$);
    }
}
