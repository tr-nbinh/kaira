import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Category } from '../layout/header/models/category.model';
import { CACHE_KEYS } from '../cache/cache-keys';

@Injectable({
    providedIn: 'root',
})
export class CategoryService extends BaseService {
    private readonly _endpoint = 'categories';

    getCategories(): Observable<Category[]> {
        return this.get(
            this._endpoint,
            {},
            { cacheKey: CACHE_KEYS.category.LIST },
        );
    }
}
