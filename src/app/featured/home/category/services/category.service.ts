import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCacheService } from '../../../../base/base-cache.service';
import { BaseService } from '../../../../base/base.service';
import { Category } from '../models/category.model';

@Injectable({
    providedIn: 'root',
})
export class CategoryService extends BaseService {
    private readonly _endpoint = 'categories';
    private cacheKey = 'category';

    constructor(
        http: HttpClient,
        private cacheService: BaseCacheService,
    ) {
        super(http);
    }

    getCategories(): Observable<Category[]> {
        const category$: Observable<Category[]> = this.get(this._endpoint);
        return this.cacheService.cacheRequest(this.cacheKey, category$);
    }
}
