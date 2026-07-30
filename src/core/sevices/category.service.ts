import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CACHE_KEYS } from '../cache/cache-keys';
import { CategoryResponse } from '../layout/header/models/category.model';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root',
})
export class CategoryService extends BaseService {
    private readonly _endpoint = 'categories';
    private paths = new Set<string>();

    getCategories(): Observable<CategoryResponse> {
        return this.get<CategoryResponse>(
            this._endpoint,
            {},
            { cacheKey: CACHE_KEYS.category.LIST },
        ).pipe(
            tap((res) => {
                if (res && res.paths) {
                    res.paths.forEach((path) => this.paths.add(path));
                }
            }),
        );
    }

    validateCategoryPath(path: string) {
        return this.get(`${this._endpoint}/validate-path`, { path });
    }

    hasCategoryInLocalTree(targetPath: string): boolean {
        if (!targetPath) return false;
        return this.paths.has(targetPath);
    }

    isLoadedTree() {
        return this.paths.size > 0;
    }
}
