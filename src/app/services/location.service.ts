import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { map, Observable, of } from 'rxjs';
import { District, Province, Ward } from '../models/location.interface';

@Injectable({
    providedIn: 'root',
})
export class LocationService extends BaseService {
    protected override readonly apiUrl: string = 'api-provinces';

    getProvinces(): Observable<Province[]> {
        return this.get('p/');
    }

    getDistrictsByProvinceCode(provinceCode: number): Observable<District[]> {
        return this.get<Province>(`p/${provinceCode}?depth=2`).pipe(
            map((province) => province.districts || [])
        );
    }

    getWardsByDistrictCode(districtCode: number): Observable<Ward[]> {
        return this.get<District>(`d/${districtCode}?depth=2`).pipe(
            map((district) => district.wards || [])
        );
    }

    getDistrict(districtCode: number): Observable<District> {
        return this.get(`d/${districtCode}?depth=2`);
    }
}
