import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCacheService } from '../base/base-cache.service';
import { BaseService } from '../base/base.service';
import { Brand, Size } from '../models/product-filter.interface';

@Injectable({
    providedIn: 'root',
})
export class ProductFilterService extends BaseService {
    constructor(http: HttpClient, private cacheService: BaseCacheService) {
        super(http);
    }

    getSizes(): Observable<Size[]> {
        const size$: Observable<Size[]> = this.get('sizes');
        return this.cacheService.cacheRequest('size', size$);
    }

    getBrands(): Observable<Brand[]> {
        const brand$: Observable<Brand[]> = this.get('brands');
        return this.cacheService.cacheRequest('brand', brand$);
    }
}
