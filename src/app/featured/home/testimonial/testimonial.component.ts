import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { BaseComponent } from '../../../base/base.component';
import { TestimonialService } from '../../../services/testimonial.service';
import { Testimonial } from '../../../models/testimonial';

@Component({
    selector: 'app-testimonial',
    imports: [TranslateModule, AsyncPipe],
    templateUrl: './testimonial.component.html',
    styleUrl: './testimonial.component.scss',
})
export class TestimonialComponent extends BaseComponent {
    testimonials: Observable<Testimonial[]> = of([]);
    @ViewChild('swiperEle') swiperEle!: ElementRef<any>;

    constructor(private testimonialService: TestimonialService) {
        super();
    }

    ngOnInit() {
        this.testimonials = this.testimonialService.getTestimonials();
    }

    ngAfterViewInit() {
        this.initializeSwiper(this.swiperEle.nativeElement, {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            // loop: true, //error: not enough slide to loop
            slidesPerView: 'auto',
        });
    }
}
