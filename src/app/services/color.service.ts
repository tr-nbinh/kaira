import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { Observable } from 'rxjs';
import { Color } from '../models/color.interface';
import { HttpClient } from '@angular/common/http';
import { BaseCacheService } from '../base/base-cache.service';

interface ColorCreation {
    hexCode: string;
    translations: { languageCode: string; name: string }[];
}

@Injectable({
    providedIn: 'root',
})
export class ColorService extends BaseService {
    private readonly _endpoint = 'colors';

    constructor(http: HttpClient, private cacheService: BaseCacheService) {
        super(http);
    }

    getColors(): Observable<Color[]> {
        const color$: Observable<Color[]> = this.get('colors');
        return this.cacheService.cacheRequest('color', color$);
    }

    createColor(color: ColorCreation): Observable<any> {
        return this.post(this._endpoint, color);
    }
}
