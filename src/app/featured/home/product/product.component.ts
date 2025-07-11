import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PaginatedRequest } from '../../../models/paginatedRequest.interface';
import { Product, ProductRequest } from '../../../models/product.interface';
import { ProductService } from '../../../services/product.service';
import { ProductListComponent } from '../../../shared/components/product-list/product-list.component';
import { BaseComponent } from '../../../base/base.component';
import { takeUntil } from 'rxjs';

enum FilterValue {
    best_seller = 'best_seller',
    new_arrivals = 'new_arrivals',
    best_reviewed = 'best_reviewed',
}

@Component({
    selector: 'app-product',
    imports: [TranslateModule, ProductListComponent],
    templateUrl: './product.component.html',
    styleUrl: './product.component.scss',
})
export class ProductComponent extends BaseComponent implements OnInit {
    products: Product[] = [];
    filterButtons = [
        {
            label: 'COMMON.BEST_SELLERS',
            isChecked: true,
            value: FilterValue.best_seller,
        },
        {
            label: 'COMMON.NEW_ARRIVALS',
            isChecked: false,
            value: FilterValue.new_arrivals,
        },
        {
            label: 'COMMON.BEST_REVIEWED',
            isChecked: false,
            value: FilterValue.best_reviewed,
        },
    ];
    params: ProductRequest = { page: 1, limit: 8, bestSeller: true, lang: 'en' };

    constructor(private productService: ProductService) {
        super();
    }

    ngOnInit(): void {
        this.getProducts();
    }

    getProducts() {
        this.productService
            .getProducts(this.params)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((res) => {
                this.products = res.data;
            });
    }

    onFilterChange(filter: string) {
        this.filterButtons.forEach((btn) => {
            btn.isChecked = btn.value === filter;
        });
        if (filter === FilterValue.best_seller) {
            this.params.bestSeller = true;
            this.params.isNewArrival = false;
            this.params.bestReviewed = false;
        }
        if (filter === FilterValue.new_arrivals) {
            this.params.bestSeller = false;
            this.params.isNewArrival = true;
            this.params.bestReviewed = false;
        }
        if (filter === FilterValue.best_reviewed) {
            this.params.bestSeller = false;
            this.params.isNewArrival = false;
            this.params.bestReviewed = true;
        }

        this.getProducts();
    }
}
