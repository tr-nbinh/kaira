import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';
import {
    Brand,
    Color,
    Size
} from '../models/product-filter.interface';

@Injectable({
    providedIn: 'root',
})
export class ProductFilterService extends BaseService {
    getColors(): Observable<Color[]> {
        return this.get('colors');
    }

    getSizes(): Observable<Size[]> {
        return this.get('sizes');
    }

    getBrands(): Observable<Brand[]> {
        return this.get('brands');
    }

    // getPriceRange(): Observable<PriceRange> {
    //     return this.http.get<PriceRange>(`${this.API_BASE_URL}/price-range`);
    // }
}
