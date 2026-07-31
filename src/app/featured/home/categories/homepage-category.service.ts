import { Injectable } from '@angular/core';
import { BaseService } from '../../../../core/sevices/base.service';
import { Observable } from 'rxjs';
import { HomeCategory } from './home-category.interface';
import { CACHE_KEYS } from '../../../../core/cache/cache-keys';

@Injectable({ providedIn: 'root' })
export class HomepageCategoryService extends BaseService {
    private readonly _endpoint = 'homepage-categories';

    getHomeCategories(): Observable<HomeCategory[]> {
        return this.get(
            this._endpoint,
            {},
            { cacheKey: CACHE_KEYS.homepageCategory.LIST },
        );
    }
}
