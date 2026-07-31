import { Injectable } from '@angular/core';
import { BaseService } from '../../../../core/sevices/base.service';
import { Observable } from 'rxjs';
import { Collection } from '../models/collection.model';
import { CACHE_KEYS } from '../../../../core/cache/cache-keys';

@Injectable({
    providedIn: 'root',
})
export class CollectionService extends BaseService {
    private readonly _endpoint = 'collections';

    getCollections(): Observable<Collection[]> {
        return this.get(
            this._endpoint,
            {},
            { cacheKey: CACHE_KEYS.collection.LIST },
        );
    }
}
