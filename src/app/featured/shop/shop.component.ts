import { Component, effect, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    finalize,
    map,
    of,
    shareReplay,
    switchMap,
    tap,
} from 'rxjs';
import { ProductListComponent } from '../../shared/components/product-list/product-list.component';
import { ProductFilter } from './models/product.model';
import { ProductService } from './services/product.service';
import { SideBarComponent } from './side-bar/side-bar.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
    selector: 'app-shop',
    imports: [
        ProductListComponent,
        TranslatePipe,
        SideBarComponent,
        PaginationComponent,
    ],
    templateUrl: './shop.component.html',
    styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
    isLoading = signal(true);

    currentFilter = signal<ProductFilter>({
        limit: 9,
        page: 1,
    });

    private response$ = toObservable(this.currentFilter).pipe(
        debounceTime(500),
        distinctUntilChanged((p, c) => JSON.stringify(p) === JSON.stringify(c)),
        tap(() => this.isLoading.set(true)),
        switchMap((f) =>
            this.productService.getProducts(f!).pipe(
                catchError(() => of({ data: [], meta: null })),
                finalize(() => this.isLoading.set(false)),
            ),
        ),
        // Rất quan trọng: Chia sẻ kết quả để không gọi API 2 lần
        shareReplay(1),
    );

    products = toSignal(this.response$.pipe(map((res) => res.data ?? [])), {
        initialValue: [],
    });

    metadata = toSignal(this.response$.pipe(map((res) => res.meta)));

    constructor(
        private productService: ProductService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        effect(() => {
            const state = this.currentFilter();
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {
                    colors: state?.colors?.length
                        ? state.colors.join(',')
                        : null,
                    minPrice: state?.minPrice,
                    maxPrice: state?.maxPrice,
                    limit: state.limit,
                    page: state.page,
                },
                queryParamsHandling: 'merge',
                replaceUrl: true,
            });
        });
    }

    ngOnInit(): void {
        const params = this.route.snapshot.queryParams;
        this.currentFilter.set({
            colors: params['colors'] ? params['colors'].split(',') : [],
            limit: Number(params['limit']) || 9,
            page: Number(params['page']) || 1,
            minPrice: params['minPrice']
                ? Number(params['minPrice'])
                : undefined,
            maxPrice: params['maxPrice']
                ? Number(params['maxPrice'])
                : undefined,
        });
    }

    handleFilter(filter: ProductFilter) {
        console.log(filter);
        this.currentFilter.set(filter);
    }

    onPageChange(page: number) {
        this.currentFilter.update((state) => ({ ...state, page }));
    }
}
