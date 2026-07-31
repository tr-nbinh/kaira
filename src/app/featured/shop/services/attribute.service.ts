import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../../core/sevices/base.service';
import { AttributeValue } from '../../../../shared/models/attribute.model';

@Injectable({
    providedIn: 'root',
})
export class AttributeService extends BaseService {
    private _endpoint = 'attributes';

    getColors(): Observable<AttributeValue[]> {
        return this.get(
            `${this._endpoint}/colors`,
            {},
            { cacheKey: 'colors:list' },
        );
    }

    getSizes(): Observable<AttributeValue[]> {
        return this.get(
            `${this._endpoint}/sizes`,
            {},
            { cacheKey: 'sizes:list' },
        );
    }
}
