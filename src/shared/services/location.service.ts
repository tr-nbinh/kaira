import { Injectable } from '@angular/core';
import { BaseService } from '../../core/sevices/base.service';
import { delay, map, Observable, of } from 'rxjs';
import { District, Province, Ward } from '../models/location.model';

@Injectable({
    providedIn: 'root',
})
export class LocationService extends BaseService {
    private readonly endpoint = 'locations';

    getProvinces(): Observable<Province[]> {
        return this.get(
            `${this.endpoint}/provinces`,
            {},
            { cacheKey: 'provinces:list' },
        );
    }

    getWardsByProvinceCode(provinceCode: number): Observable<Ward[]> {
        return this.get(`${this.endpoint}/wards/${provinceCode}`);
    }
}
