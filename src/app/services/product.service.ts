import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';
import { PaginatedResponse } from '../models/paginatedResponse.interface';
import {
    Product,
    ProductDetail,
    ProductRequest,
} from '../models/product.interface';

@Injectable({
    providedIn: 'root',
})
export class ProductService extends BaseService {
    private _endpoint = 'products';

    constructor(http: HttpClient) {
        super(http);
    }

    getProducts(
        params: ProductRequest
    ): Observable<PaginatedResponse<Product>> {
        return this.get(this._endpoint, params);
    }

    getProductById(id: number): Observable<ProductDetail> {
        return this.get(`${this._endpoint}/${id}`);
    }

    searchProducts(query: string, page: number = 1, limit: number = 10) {
        // return this.get<PaginatedResponse<any>>(`/search?q=${query}&page=${page}&limit=${limit}`);
    }

    createProduct(product: any): Observable<any> {
        return this.post(this._endpoint, product);
    }
}
