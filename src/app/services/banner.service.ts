import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { Banner } from '../models/banner.interface';
import { Observable, of } from 'rxjs';
import { BaseCacheService } from '../base/base-cache.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class BannerService extends BaseService {
    private readonly _endpoint = 'banners';
    private cacheKey = 'banner';

    constructor(http: HttpClient, private cacheService: BaseCacheService) {
        super(http);
    }

    getBanners(): Observable<Banner[]> {
        const banner$: Observable<Banner[]> = this.get(this._endpoint);
        return this.cacheService.cacheRequest(this.cacheKey, banner$);
    }
}
