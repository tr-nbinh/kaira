import { AsyncPipe } from '@angular/common';
import {
    Component,
    ElementRef,
    OnInit,
    signal,
    ViewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    finalize,
    map,
    Observable,
    of,
    shareReplay,
    switchMap,
    tap,
} from 'rxjs';
import { BaseComponent } from '../../../base/base.component';
import { ProductItemComponent } from '../../../shared/components/product-item/product-item.component';
import { PRODUCT_HIGHLIGHT_FILTERS } from '../../../shared/constants/product-hightlight-filters.constant';
import { Product, ProductFilter } from '../../shop/models/product.model';
import { ProductService } from '../../shop/services/product.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BaseSelectableItem } from '../../../models/baseSelectableItem.interface';

@Component({
    selector: 'app-product',
    imports: [TranslatePipe, ProductItemComponent, AsyncPipe],
    templateUrl: './product.component.html',
    styleUrl: './product.component.scss',
})
export class ProductComponent extends BaseComponent implements OnInit {
    products$: Observable<Product[]> = of([]);
    productHightlightFilter = PRODUCT_HIGHLIGHT_FILTERS;

    currentFilter = signal<ProductFilter>({
        limit: 4,
        page: 1,
        bestSeller: true,
    });

    response$ = toObservable(this.currentFilter).pipe(
        debounceTime(500),
        distinctUntilChanged((p, c) => JSON.stringify(p) === JSON.stringify(c)),
        // tap(() => this.isLoading.set(true)),
        switchMap((f) =>
            this.productService.getProducts(f!).pipe(
                catchError(() => of({ data: [], meta: null })),
                // finalize(() => this.isLoading.set(false)),
            ),
        ),
        // Rất quan trọng: Chia sẻ kết quả để không gọi API 2 lần
        shareReplay(1),
    );

    products = toSignal(this.response$.pipe(map((res) => res.data ?? [])), {
        initialValue: [],
    });

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

    filter(item: BaseSelectableItem) {
        this.productHightlightFilter.forEach((f) => (f.checked = false));
        item.checked = true;
        this.currentFilter.set({
            limit: 4,
            page: 1,
            [item.key]: true,
        });
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
