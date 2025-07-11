import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';
import { Category } from '../models/product-filter.interface';

@Injectable({
    providedIn: 'root',
})
export class CategoryService extends BaseService {
    private readonly _endpoint = 'categories';

    getCategories(): Observable<Category[]> {
        return this.get(this._endpoint);
    }
}
