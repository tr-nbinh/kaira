import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntil } from 'rxjs';
import Swiper from 'swiper';
import { BaseComponent } from '../../../base/base.component';
import { Quote } from '../../../models/quote.interface';
import { TestimonialService } from '../../../services/testimonial.service';

@Component({
    selector: 'app-testimonial',
    imports: [TranslateModule],
    templateUrl: './testimonial.component.html',
    styleUrl: './testimonial.component.scss',
})
export class TestimonialComponent extends BaseComponent {
    quotes: Quote[] = [];
    @ViewChild('swiperEle') swiperEle!: ElementRef<any>;

    constructor(private testimonialService: TestimonialService) {
        super();
    }

    ngOnInit() {
        this.testimonialService
            .getTestimonials()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((res) => {
                this.quotes = res;
                this.initializeSwiper(this.swiperEle.nativeElement, {
                    effect: 'coverflow',
                    grabCursor: true,
                    centeredSlides: true,
                    // loop: true, //error: not enough slide to loop
                    slidesPerView: 'auto',
                });
            });
    }
}
