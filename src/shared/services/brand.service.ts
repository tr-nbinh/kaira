import { Injectable } from '@angular/core';
import { BaseService } from '../../core/sevices/base.service';
import { Observable } from 'rxjs';

export interface Brand {
    id: string;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class BrandService extends BaseService {
    private readonly _endpoint = 'brands';

    getBrands(): Observable<Brand[]> {
        return this.get(this._endpoint);
    }
}
