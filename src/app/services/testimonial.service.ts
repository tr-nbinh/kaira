import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';
import { BaseCacheService } from '../base/base-cache.service';
import { HttpClient } from '@angular/common/http';
import { Testimonial } from '../models/testimonial';

@Injectable({
    providedIn: 'root',
})
export class TestimonialService extends BaseService {
    private readonly _endpoint = 'testimonials';
    private cacheKey = 'testimonial';

    constructor(http: HttpClient, private cacheService: BaseCacheService) {
        super(http);
    }

    getTestimonials(): Observable<Testimonial[]> {
        const testimonial$: Observable<Testimonial[]> = this.get(
            this._endpoint
        );
        return this.cacheService.cacheRequest(this.cacheKey, testimonial$);
    }
}
