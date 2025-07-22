import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';
import { MenuItem } from '../models/menu.interface';
import { HttpClient } from '@angular/common/http';
import { BaseCacheService } from '../base/base-cache.service';

@Injectable({
    providedIn: 'root',
})
export class MenuService extends BaseService {
    private readonly _endpoint = 'menus';
    private cacheKey = 'menu';

    constructor(http: HttpClient, private cacheService: BaseCacheService) {
        super(http);
    }

    getMenu(): Observable<MenuItem[]> {
        const menu$: Observable<MenuItem[]> = this.get(this._endpoint);
        return this.cacheService.cacheRequest(this.cacheKey, menu$);
    }
}
