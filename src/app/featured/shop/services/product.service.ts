import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../base/base.service';
import { Product } from '../models/product.model';

@Injectable({
    providedIn: 'root',
})
export class ProductService extends BaseService {
    private _endpoint = 'products';

    constructor(http: HttpClient) {
        super(http);
    }

    getProducts(): Observable<Product[]> {
        return this.get(this._endpoint);
    }
}
