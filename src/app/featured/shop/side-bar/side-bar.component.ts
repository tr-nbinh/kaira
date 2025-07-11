import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, forkJoin, of, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../base/base.component';
import {
    Brand,
    Category,
    Color,
    Price,
    Size,
} from '../../../models/product-filter.interface';
import { ProductRequest } from '../../../models/product.interface';
import { CategoryService } from '../../../services/category.service';
import { ProductFilterService } from '../../../services/product-filter.service';

@Component({
    selector: 'app-side-bar',
    imports: [TranslateModule, FormsModule],
    templateUrl: './side-bar.component.html',
    styleUrl: './side-bar.component.scss',
})
export class SideBarComponent extends BaseComponent implements OnInit {
    categories: Category[] = [];
    colors: Color[] = [];
    sizes: Size[] = [];
    brands: Brand[] = [];
    priceRanges: Price[] = [];
    allCategoriesChecked = true;

    selectedCategoryIds: number[] = [];
    selectedColorIds: number[] = [];
    selectedSizeIds: number[] = [];
    selectedBrandIds: number[] = [];
    selectedPriceRange: string[] = [];

    params: ProductRequest = {
        lang: 'en',
        limit: 6,
        page: 1,
        categoryIds: this.selectedCategoryIds,
        colorIds: this.selectedColorIds,
        sizeIds: this.selectedSizeIds,
        brandIds: this.selectedBrandIds,
        prices: this.selectedPriceRange,
    };

    @Output() onFilterChange = new EventEmitter<ProductRequest>();

    constructor(
        private productFilterService: ProductFilterService,
        private categoryService: CategoryService,
        private translate: TranslateService
    ) {
        super();
    }

    ngOnInit(): void {
        forkJoin([
            this.categoryService
                .getCategories()
                .pipe(catchError((err) => of([]))),
            this.productFilterService
                .getColors()
                .pipe(catchError((err) => of([]))),
            this.productFilterService
                .getSizes()
                .pipe(catchError((err) => of([]))),
            this.productFilterService
                .getBrands()
                .pipe(catchError((err) => of([]))),
        ])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(([categories, colors, sizes, brands]) => {
                this.categories = categories;
                this.colors = colors;
                this.sizes = sizes;
                this.brands = brands;
            });

        this.loadPriceRanges();
    }

    loadPriceRanges(): void {
        // Định dạng giá trị tiền tệ cho hiển thị trong text
        // Bạn cần dùng CurrencyPipe hoặc một hàm định dạng tùy chỉnh
        const currentLocale =
            this.translate.currentLang === 'en' ? 'en-US' : 'vi-VN';
        const currentCurrencyCode =
            this.translate.currentLang === 'en' ? 'USD' : 'VND';
        const currencyPipe = new CurrencyPipe(currentLocale); // Tạo một instance của CurrencyPipe

        const formatPrice = (value: number) => {
            // Định dạng số không có dấu thập phân
            return currencyPipe.transform(
                value,
                currentCurrencyCode,
                'symbol',
                '1.0-0'
            );
        };

        this.priceRanges = [
            {
                id: 1,
                maxPrice: 20,
                text: this.translate.instant('PRICE.LESS_THAN', {
                    price: formatPrice(20),
                }),
                filterParam: '<20',
            },
            {
                id: 2,
                minPrice: 20,
                maxPrice: 40,
                text: this.translate.instant('PRICE.FROM_TO', {
                    minPrice: formatPrice(20),
                    maxPrice: formatPrice(40),
                }),
                filterParam: '20-40',
            },
            {
                id: 3,
                minPrice: 40,
                maxPrice: 60,
                text: this.translate.instant('PRICE.FROM_TO', {
                    minPrice: formatPrice(40),
                    maxPrice: formatPrice(60),
                }),
                filterParam: '40-60',
            },
            {
                id: 4,
                minPrice: 60,
                text: this.translate.instant('PRICE.MORE_THAN', {
                    price: formatPrice(60),
                }),
                filterParam: '>60',
            },
        ];
    }

    toggleSelection<T extends { id: number; checked?: boolean }>(
        item: T | undefined,
        selectedIds: number[],
        allItems?: T[],
        allCheckedFlag?: keyof this
    ) {
        if (!item) {
            selectedIds.length = 0;
            if (allItems) allItems.forEach((i) => (i.checked = false));
            if (allCheckedFlag) (this as any)[allCheckedFlag] = true;
        } else {
            item.checked = !item.checked;
            if (item.checked) {
                if (!selectedIds.includes(item.id)) {
                    selectedIds.push(item.id);
                }
            } else {
                const idx = selectedIds.indexOf(item.id);
                if (idx > -1) selectedIds.splice(idx, 1);
            }
            if (allCheckedFlag)
                (this as any)[allCheckedFlag] = !selectedIds.length;
        }
        this.changeFilter();
    }

    toggleCategorySelection(category?: Category) {
        this.toggleSelection(
            category,
            this.selectedCategoryIds,
            this.categories,
            'allCategoriesChecked'
        );
    }

    toggleColorSelection(color: Color) {
        this.toggleSelection(color, this.selectedColorIds, this.colors);
    }

    toggleSizeSelection(size: Size) {
        this.toggleSelection(size, this.selectedSizeIds, this.sizes);
    }

    toggleBrandSelection(brand: Brand) {
        this.toggleSelection(brand, this.selectedBrandIds, this.brands);
    }

    togglePriceSelection(price: Price) {
        price.checked = !price.checked;
        if (price.checked) {
            if (!this.selectedPriceRange.includes(price.filterParam))
                this.selectedPriceRange.push(price.filterParam);
        } else {
            const idx = this.selectedPriceRange.indexOf(price.filterParam);
            if (idx > -1) this.selectedPriceRange.splice(idx, 1);
        }

        this.changeFilter();
    }

    changeFilter() {
        this.onFilterChange.emit(this.params);
    }
}
