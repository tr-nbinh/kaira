import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, forkJoin, Observable, of, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../base/base.component';
import {
    Brand,
    CategorySelectItem,
    Price,
    Size,
} from '../../../models/product-filter.interface';
import { ProductRequest } from '../../../models/product.interface';
import { CategoryService } from '../../../services/category.service';
import { ProductFilterService } from '../../../services/product-filter.service';
import { BaseSelectableItem } from '../../../models/baseSelectableItem.interface';
import { PriceFilterParam } from '../../../models/price-param.interface';
import { ColorService } from '../../../services/color.service';
import { Color } from '../../../models/color.interface';

@Component({
    selector: 'app-side-bar',
    imports: [TranslateModule, FormsModule],
    templateUrl: './side-bar.component.html',
    styleUrl: './side-bar.component.scss',
})
export class SideBarComponent extends BaseComponent implements OnInit {
    @Input() params: ProductRequest = { lang: 'en', limit: 10, page: 1 };
    categories: CategorySelectItem[] = [];
    colors: (Color & BaseSelectableItem)[] = [];
    sizes: Size[] = [];
    brands: Brand[] = [];
    priceRanges: PriceFilterParam[] = [];

    allCategoriesChecked = true;

    selectedCategoryIds: number[] = [];
    selectedColorIds: number[] = [];
    selectedSizeIds: number[] = [];
    selectedBrandIds: number[] = [];
    selectedPriceRange: string[] = [];

    @Output() onFilterChange = new EventEmitter<ProductRequest>();
    @Output() onResetFilter = new EventEmitter();

    // Inject CurrencyPipe directly into the constructor
    constructor(
        private productFilterService: ProductFilterService,
        private colorService: ColorService,
        private categoryService: CategoryService,
        private translate: TranslateService
    ) {
        super();
    }

    ngOnInit(): void {
        forkJoin([
            this.handleApiError(this.categoryService.getCategories()),
            this.handleApiError(this.colorService.getColors()),
            this.handleApiError(this.productFilterService.getSizes()),
            this.handleApiError(this.productFilterService.getBrands()),
        ])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: ([categories, colors, sizes, brands]) => {
                    this.categories = categories;
                    this.colors = colors;
                    this.sizes = sizes;
                    this.brands = brands;

                    this.updateTextForPriceRange();

                    this.checkSelectedItems(
                        this.categories,
                        this.params.categoryIds,
                        this.selectedCategoryIds
                    );
                    this.checkSelectedItems(
                        this.colors,
                        this.params.colorIds,
                        this.selectedColorIds
                    );
                    this.checkSelectedItems(
                        this.sizes,
                        this.params.sizeIds,
                        this.selectedSizeIds
                    );
                    this.checkSelectedItems(
                        this.brands,
                        this.params.brandIds,
                        this.selectedBrandIds
                    );
                    this.checkSelectedItems(
                        this.priceRanges,
                        this.params.prices,
                        this.selectedPriceRange
                    );

                    this.allCategoriesChecked =
                        !this.selectedCategoryIds.length;
                },
                error: (err) => {
                    console.error('Error loading filter options:', err);
                    // Optionally, show a user-friendly message
                },
            });
    }

    updateTextForPriceRange(): void {
        const lang = this.translate.currentLang;
        const isEnglish = lang === 'en';
        const locale = isEnglish ? 'en-US' : 'vi-VN';
        const currency = isEnglish ? 'USD' : 'VND';
        const exchangeRate = 2500; // Ví dụ: 1 USD = 2500 VND (bạn có thể lấy từ API)

        const currencyPipe = new CurrencyPipe(locale);

        const convertAndFormat = (usdValue: number): string | null => {
            const value = isEnglish ? usdValue : usdValue * exchangeRate;
            return currencyPipe.transform(
                value,
                currency,
                'symbol',
                '1.0-0',
                locale
            );
        };

        this.priceRanges = [
            {
                id: 1,
                maxPrice: 20,
                text: this.translate.instant('PRICE.LESS_THAN', {
                    price: convertAndFormat(200),
                }),
                value: '<20',
            },
            {
                id: 2,
                minPrice: 20,
                maxPrice: 40,
                text: this.translate.instant('PRICE.FROM_TO', {
                    minPrice: convertAndFormat(200),
                    maxPrice: convertAndFormat(400),
                }),
                value: '20-40',
            },
            {
                id: 3,
                minPrice: 40,
                maxPrice: 60,
                text: this.translate.instant('PRICE.FROM_TO', {
                    minPrice: convertAndFormat(400),
                    maxPrice: convertAndFormat(600),
                }),
                value: '40-60',
            },
            {
                id: 4,
                minPrice: 60,
                text: this.translate.instant('PRICE.MORE_THAN', {
                    price: convertAndFormat(600),
                }),
                value: '>60',
            },
        ];
    }

    private checkSelectedItems<
        T extends BaseSelectableItem,
        K extends (string | number)[]
    >(
        items: T[],
        paramIds: (string | number)[] | undefined,
        componentSelectedIds: K // This array will be populated
    ): void {
        if (paramIds && paramIds.length) {
            const selectedIdSet = new Set(paramIds);
            items.forEach((item) => {
                if (
                    selectedIdSet.has(item.id) ||
                    (item.value && selectedIdSet.has(item.value))
                ) {
                    item.checked = true;
                    if (!componentSelectedIds.includes(item.id as K[number])) {
                        componentSelectedIds.push(item.id as K[number]);
                    }
                } else {
                    item.checked = false;
                }
            });
        } else {
            items.forEach((item) => (item.checked = false));
            componentSelectedIds.length = 0;
        }
    }

    private toggleItemSelection<T extends BaseSelectableItem>(
        item: T,
        selectedIdsArray: (number | string)[], // Can hold numbers or strings (for price ranges)
        isValueBased: boolean = false
    ): void {
        item.checked = !item.checked; // Toggle the checked state

        const idToToggle = isValueBased ? item.value : item.id;

        if (item.checked) {
            if (!selectedIdsArray.includes(idToToggle)) {
                selectedIdsArray.push(idToToggle);
            }
        } else {
            const index = selectedIdsArray.indexOf(idToToggle);
            if (index > -1) {
                selectedIdsArray.splice(index, 1);
            }
        }
    }

    private handleApiError<T>(observable: Observable<T[]>): Observable<T[]> {
        return observable.pipe(
            catchError((error) => {
                console.error('API Error caught:', error);
                return of([]); // Return an empty array of the expected type
            })
        );
    }

    // --- Specific Toggle Methods ---

    toggleCategorySelection(category?: CategorySelectItem): void {
        if (!category) {
            // Select/Deselect All Categories
            this.selectedCategoryIds.length = 0; // Clear all selected IDs
            this.categories.forEach((cat) => (cat.checked = false)); // Uncheck all
            this.allCategoriesChecked = true; // Set "All" checkbox to checked
        } else {
            this.toggleItemSelection(category, this.selectedCategoryIds);
            // Update "All Categories" checkbox state based on current selections
            this.allCategoriesChecked = !this.selectedCategoryIds.length;
        }
        this.params.categoryIds = this.selectedCategoryIds;
        this.changeFilter();
    }

    toggleColorSelection(color: Color): void {
        this.toggleItemSelection(color, this.selectedColorIds);
        this.params.colorIds = this.selectedColorIds;
        this.changeFilter();
    }

    toggleSizeSelection(size: Size): void {
        this.toggleItemSelection(size, this.selectedSizeIds);
        this.params.sizeIds = this.selectedSizeIds;
        this.changeFilter();
    }

    toggleBrandSelection(brand: Brand): void {
        this.toggleItemSelection(brand, this.selectedBrandIds);
        this.params.brandIds = this.selectedBrandIds;
        this.changeFilter();
    }

    togglePriceSelection(price: Price): void {
        // Price selection uses 'value' (string) instead of 'id' (number)
        this.toggleItemSelection(price, this.selectedPriceRange, true);
        this.params.prices = this.selectedPriceRange;
        this.changeFilter();
    }

    changeFilter(): void {
        this.onFilterChange.emit(this.params);
    }

    resetFilter(): void {
        this.params = { lang: 'en', limit: 10, page: 1 };

        this.selectedCategoryIds = [];
        this.selectedColorIds = [];
        this.selectedSizeIds = [];
        this.selectedBrandIds = [];
        this.selectedPriceRange = [];

        this.categories.forEach((item) => (item.checked = false));
        this.colors.forEach((item) => (item.checked = false));
        this.sizes.forEach((item) => (item.checked = false));
        this.brands.forEach((item) => (item.checked = false));
        this.priceRanges.forEach((item) => (item.checked = false));

        this.allCategoriesChecked = true;

        this.onResetFilter.emit(this.params);
    }
}
