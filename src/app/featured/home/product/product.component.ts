import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { map, Observable, of } from 'rxjs';
import { BaseComponent } from '../../../base/base.component';
import { ProductItemComponent } from '../../../shared/components/product-item/product-item.component';
import { PRODUCT_HIGHLIGHT_FILTERS } from '../../../shared/constants/product-hightlight-filters.constant';
import { Product } from '../../shop/models/product.model';
import { ProductService } from '../../shop/services/product.service';

@Component({
    selector: 'app-product',
    imports: [TranslatePipe, ProductItemComponent, AsyncPipe],
    templateUrl: './product.component.html',
    styleUrl: './product.component.scss',
})
export class ProductComponent extends BaseComponent implements OnInit {
    products$: Observable<Product[]> = of([]);
    productHightlightFilter = PRODUCT_HIGHLIGHT_FILTERS;

    @ViewChild('swiper') swiper!: ElementRef<HTMLElement>;
    @ViewChild('arrowLeft') arrowLeft!: ElementRef<HTMLElement>;
    @ViewChild('arrowRight') arrowRight!: ElementRef<HTMLElement>;

    constructor(private productService: ProductService) {
        super();
    }

    ngOnInit(): void {
        this.getProducts();
    }

    getProducts() {
        this.products$ = this.productService
            .getProducts()
            .pipe(map((res) => res.data));
    }

    ngAfterViewInit() {
        this.initializeSwiper(this.swiper.nativeElement, {
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
            slidesPerView: 4,
            spaceBetween: 20,
            navigation: {
                nextEl: this.arrowRight.nativeElement,
                prevEl: this.arrowLeft.nativeElement,
            },
            breakpoints: {
                0: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                },
                999: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                },
                1366: {
                    slidesPerView: 4,
                    spaceBetween: 40,
                },
            },
        });
    }
}
