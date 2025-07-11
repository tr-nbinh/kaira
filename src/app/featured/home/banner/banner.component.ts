import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import Swiper from 'swiper';
import { BaseComponent } from '../../../base/base.component';
import { BannerService } from '../../../services/banner.service';
import { Banner } from '../../../models/banner.interface';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-banner',
    imports: [TranslateModule],
    templateUrl: './banner.component.html',
    styleUrl: './banner.component.scss',
})
export class BannerComponent extends BaseComponent {
    banners: Banner[] = [];
    @ViewChild('swiper') swiperEl!: ElementRef<any>;
    @ViewChild('arrowLeft') arrowLeft!: ElementRef<any>;
    @ViewChild('arrowRight') arrowRight!: ElementRef<any>;

    constructor(private bannerService: BannerService) {
        super();
    }

    ngOnInit() {
        this.bannerService
            .getBanners()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((res) => {
                this.banners = res;
                this.initializeSwiper(this.swiperEl.nativeElement, {
                    // loop: true, // error: not enough slide to loop
                    speed: 900,
                    navigation: {
                        nextEl: this.arrowRight.nativeElement,
                        prevEl: this.arrowLeft.nativeElement,
                    },
                });
            });
    }
}
