import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
    BehaviorSubject,
    map,
    skip,
    switchMap,
    take,
    takeUntil,
    tap
} from 'rxjs';
import {
    parseNumberArray,
    parseNumberOrDefault,
    parseStringArray,
    parseStringOrDefault,
} from '../../../utils/param-parser.util';
import { BaseComponent } from '../../base/base.component';
import { ListDisplayState } from '../../models/pagination.interface';
import { Product, ProductRequest } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ProductListComponent } from '../../shared/components/product-list/product-list.component';
import { SideBarComponent } from './side-bar/side-bar.component';

@Component({
    selector: 'app-shop',
    imports: [
        ProductListComponent,
        PaginationComponent,
        TranslatePipe,
        SideBarComponent,
    ],
    templateUrl: './shop.component.html',
    styleUrl: './shop.component.scss',
})
export class ShopComponent extends BaseComponent implements OnInit {
    products: Product[] = [];
    listDisplayState: ListDisplayState = {
        totalItems: 0,
        endIndex: 0,
        startIndex: 0,
    };
    params!: ProductRequest;
    private paramsSubject = new BehaviorSubject<ProductRequest>(this.params);

    constructor(
        private productService: ProductService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        super();
    }

    ngOnInit(): void {
        this.paramsSubject
            .pipe(
                skip(1),
                tap((params) => {
                    (this.params = params), this.updateFilter();
                }),
                switchMap((params) => this.productService.getProducts(params)),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(({ data, totalCount, page }) => {
                this.products = data;
                this.listDisplayState.totalItems = totalCount;
                this.listDisplayState.startIndex =
                    (page - 1) * this.params.limit + 1;
                this.listDisplayState.endIndex = Math.min(
                    page * this.params.limit,
                    totalCount
                );
            });

        this.route.queryParamMap
            .pipe(
                map((paramsMap) => this._parseParams(paramsMap)),
                take(1)
            )
            .subscribe((res) => {
                this.params = res;
                this.paramsSubject.next(res);
            });
    }

    private _parseParams(paramMap: ParamMap): ProductRequest {
        return {
            lang: parseStringOrDefault(paramMap.get('lang'), 'en'),
            limit: parseNumberOrDefault(paramMap.get('limit'), 10),
            page: parseNumberOrDefault(paramMap.get('page'), 1),
            categoryIds: parseNumberArray(paramMap.get('categoryIds')),
            colorIds: parseNumberArray(paramMap.get('colorIds')),
            sizeIds: parseNumberArray(paramMap.get('sizeIds')),
            brandIds: parseNumberArray(paramMap.get('brandIds')),
            prices: parseStringArray(paramMap.get('prices')),
        };
    }

    private convertToQueryParams(): Record<string, any> {
        const queryParams: Record<string, any> = {};

        for (const key in this.params) {
            const value = this.params[key as keyof ProductRequest];

            if (
                value === null ||
                value === undefined ||
                (typeof value === 'string' && value.trim() === '') ||
                (Array.isArray(value) && value.length === 0)
            ) {
                continue; // ❌ Không thêm vào queryParams nếu không có giá trị
            }

            if (Array.isArray(value)) {
                queryParams[key] = value.join(',');
            } else {
                queryParams[key] = value;
            }
        }
        return queryParams;
    }

    updateFilter() {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: this.convertToQueryParams(),
        });
    }

    onPageChange(newPage: number) {
        this.paramsSubject.next({
            ...this.paramsSubject.getValue(),
            page: newPage,
        });
    }

    filterProduct(filterParams: ProductRequest) {
        this.paramsSubject.next(filterParams);
    }

    resetFilter() {
        this.paramsSubject.next({ lang: 'en', page: 1, limit: 10 });
    }
}
