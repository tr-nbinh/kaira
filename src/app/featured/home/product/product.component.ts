import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject, delay, map, Observable, of, switchMap } from 'rxjs';
import { BaseComponent } from '../../../base/base.component';
import { ProductRequest } from '../../../models/product.interface';
import { ProductItemComponent } from '../../../shared/components/product-item/product-item.component';
import { PRODUCT_HIGHLIGHT_FILTERS } from '../../../shared/constants/product-hightlight-filters.constant';
import { ProductHighlightFilterValue } from '../../../shared/enums/product-highlight-filter-value.enum';
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
    params: ProductRequest = {
        page: 1,
        limit: 8,
        bestSeller: true,
    };
    private paramsSubject = new BehaviorSubject<ProductRequest>(this.params);
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
        // this.products$ = this.paramsSubject.pipe(
        //     switchMap((params) =>
        //         this.productService
        //             .getProducts(params)
        //             .pipe(map((res) => res.data))
        //     )
        // );
        this.products$ = this.productService.getProducts();
    }

    onFilterChange(filter: ProductHighlightFilterValue) {
        this.productHightlightFilter.forEach((btn) => {
            btn.checked = btn.value === filter;
        });
        if (filter === ProductHighlightFilterValue.best_seller) {
            this.params.bestSeller = true;
            this.params.isNewArrival = false;
            this.params.bestReviewed = false;
        }
        if (filter === ProductHighlightFilterValue.new_arrivals) {
            this.params.bestSeller = false;
            this.params.isNewArrival = true;
            this.params.bestReviewed = false;
        }
        if (filter === ProductHighlightFilterValue.best_reviewed) {
            this.params.bestSeller = false;
            this.params.isNewArrival = false;
            this.params.bestReviewed = true;
        }

        this.paramsSubject.next(this.params);
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
