import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { Product, ProductRequest } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ProductListComponent } from '../../shared/components/product-list/product-list.component';
import { SideBarComponent } from './side-bar/side-bar.component';

@Component({
    selector: 'app-shop',
    imports: [
        HeroComponent,
        ProductListComponent,
        PaginationComponent,
        TranslateModule,
        SideBarComponent,
    ],
    templateUrl: './shop.component.html',
    styleUrl: './shop.component.scss',
})
export class ShopComponent extends BaseComponent implements OnInit {
    products: Product[] = [];
    totalItems = 0;
    startIndex = 0;
    endIndex = 0;

    params: ProductRequest = {
        limit: 6,
        page: 1,
        lang: 'en',
    };

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
                this.totalItems = res.totalCount;
                this.startIndex = (res.page - 1) * this.params.limit + 1;
                this.endIndex = Math.min(
                    res.page * this.params.limit,
                    this.totalItems
                );
            });
    }

    onPageChange(newPage: number) {
        this.params.page = newPage;
        this.getProducts();
    }

    filterProduct(filterParams: ProductRequest) {
        this.params = filterParams;
        this.getProducts();
    }
}
