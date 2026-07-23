import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductFilterMetadata } from '../../app/featured/shop/components/filter-drawer/models/filter-metadata.model';
import { BaseService } from '../../core/sevices/base.service';
import { ListResponse } from '../models/list-repsonse.model';
import {
    Product,
    ProductDetail,
    ProductFilter,
    ProductQuickView,
} from '../models/product.model';

@Injectable({
    providedIn: 'root',
})
export class ProductService extends BaseService {
    private _endpoint = 'products';

    getProducts(filter?: ProductFilter): Observable<ListResponse<Product>> {
        return this.get(this._endpoint, filter);
    }

    getProductById(id: string): Observable<ProductDetail> {
        return this.get(`${this._endpoint}/${id}`);
    }

    getProductQuickView(id: string): Observable<ProductQuickView> {
        return this.get(`${this._endpoint}/${id}/quick-view`);
    }

    getProductFilterMetadata(): Observable<ProductFilterMetadata> {
        return this.get(
            `${this._endpoint}/filter-metadata`,
            {},
            { cacheKey: 'products:filter-metadata' },
        );
    }
}
