import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../base/base.component';
import { Banner } from '../../../models/banner.interface';
import { BannerService } from '../../../services/banner.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-banner',
    imports: [TranslateModule, AsyncPipe, RouterLink],
    templateUrl: './banner.component.html',
    styleUrl: './banner.component.scss',
})
export class BannerComponent extends BaseComponent {
    banners$: Observable<Banner[]> = of([]);
    @ViewChild('swiper') swiperEl!: ElementRef<any>;
    @ViewChild('arrowLeft') arrowLeft!: ElementRef<any>;
    @ViewChild('arrowRight') arrowRight!: ElementRef<any>;

    constructor(private bannerService: BannerService) {
        super();
    }

    ngOnInit() {
        this.banners$ = this.bannerService.getBanners();
    }

    ngAfterViewInit() {
        this.initializeSwiper(this.swiperEl.nativeElement, {
            // loop: true, // error: not enough slide to loop
            speed: 900,
            navigation: {
                nextEl: this.arrowRight.nativeElement,
                prevEl: this.arrowLeft.nativeElement,
            },
        });
    }
}
