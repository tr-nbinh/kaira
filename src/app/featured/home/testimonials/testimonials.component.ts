import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    input,
    OnDestroy,
    signal,
    viewChild,
} from '@angular/core';

import EmblaCarousel, { EmblaCarouselType } from 'embla-carousel';

import { TranslatePipe } from '@ngx-translate/core';
import Autoplay from 'embla-carousel-autoplay';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { TestimonialItem } from '../models/testimonial.interface';

interface Testimonial {
    id: number;
    quote: string;
    author: string;
}

@Component({
    selector: 'app-testimonials',
    templateUrl: './testimonials.component.html',
    imports: [SectionHeaderComponent, TranslatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsComponent implements AfterViewInit, OnDestroy {
    readonly testimonials = input<TestimonialItem[]>([]);
    emblaViewport =
        viewChild.required<ElementRef<HTMLDivElement>>('emblaViewport');
    currentIndex = signal(0);

    private embla?: EmblaCarouselType;

    ngAfterViewInit(): void {
        if (this.emblaViewport()) {
            this.embla = EmblaCarousel(
                this.emblaViewport().nativeElement,
                {
                    loop: true,
                    align: 'center',
                    dragFree: false,
                },
                [
                    Autoplay({
                        delay: 7000,
                        stopOnMouseEnter: true,
                        stopOnInteraction: false,
                    }),
                ],
            );

            this.embla.on('select', () => {
                this.currentIndex.set(this.embla?.selectedScrollSnap() ?? 0);
            });
        }
    }

    previous(): void {
        this.embla?.scrollPrev();
    }

    next(): void {
        this.embla?.scrollNext();
    }

    scrollTo(index: number): void {
        this.embla?.scrollTo(index);
    }

    ngOnDestroy(): void {
        this.embla?.destroy();
    }
}
