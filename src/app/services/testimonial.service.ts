import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';
import { Quote } from '../models/quote.interface';

@Injectable({
    providedIn: 'root',
})
export class TestimonialService extends BaseService {
    private readonly _endpoint = 'testimonials';

    getTestimonials(): Observable<Quote[]> {
        return this.get(this._endpoint);
    }
}
