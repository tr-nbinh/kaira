import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../base/base.service';
import { PaginationResponse } from '../../../models/paginatedResponse.interface';
import { Product, ProductFilter } from '../models/product.model';

@Injectable({
    providedIn: 'root',
})
export class ProductService extends BaseService {
    private _endpoint = 'products';

    constructor(http: HttpClient) {
        super(http);
    }

    getProducts(
        filter?: ProductFilter,
    ): Observable<PaginationResponse<Product>> {
        return this.get(this._endpoint, filter);
    }

    getProductById(id: string): Observable<Product> {
        return this.get(`${this._endpoint}/${id}`);
    }
}
