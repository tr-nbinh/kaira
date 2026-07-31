import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../../core/sevices/base.service';
import { TestimonialItem } from '../models/testimonial.interface';

@Injectable({
    providedIn: 'root',
})
export class TestimonialService extends BaseService {
    private readonly _endpoint = 'testimonials';

    getTestimonials(): Observable<TestimonialItem[]> {
        return this.get(this._endpoint, {}, { cacheKey: 'testimonials:list' });
    }
}
