import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types';

@Injectable()
export abstract class BaseComponent implements OnDestroy {
    protected readonly ngUnsubscribe = new Subject<void>();
    protected swiperInstances: Swiper[] = [];

    protected initializeSwiper(
        selector: any,
        options?: SwiperOptions
    ): Swiper {
        const newSwiper = new Swiper(selector, options);
        this.swiperInstances.push(newSwiper);
        return newSwiper;
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.swiperInstances.forEach((swiper) => swiper?.destroy(true, true));
        this.swiperInstances = [];
    }
}
