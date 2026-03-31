import { AsyncPipe } from '@angular/common';
import {
    Component,
    computed,
    effect,
    input,
    OnInit,
    output,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Observable, of, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../base/base.component';

import { ProductAttribute, ProductFilter } from '../models/product.model';
import { AttributeService } from '../services/attribute.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ExchangeRateService } from '../../../shared/services/exchange-rate.service';
import {
    PriceRange,
    PRODUCT_PRICE_RANGES,
} from '../constants/product.constants';

@Component({
    selector: 'app-side-bar',
    imports: [FormsModule, TranslatePipe, AsyncPipe],
    templateUrl: './side-bar.component.html',
    styleUrl: './side-bar.component.scss',
})
export class SideBarComponent extends BaseComponent implements OnInit {
    colors$: Observable<ProductAttribute[]> = of([]);

    filterState = input.required<ProductFilter>({
        alias: 'initialFilterState',
    });
    selectedColorIdsMap = computed(() => new Set(this.filterState().colors));
    selectedColorIdCount = computed(
        () => this.filterState().colors?.length || 0,
    );

    selectedPriceRangeId = computed(() => {
        const filter = this.filterState();
        const matchedRange = PRODUCT_PRICE_RANGES.find(
            (range) =>
                filter.maxPrice == range.max && filter.minPrice == range.min,
        );
        return matchedRange ? matchedRange.id : 'all';
    });
    selectedPriceIdCount = computed(() => this.selectedPriceRangeId().length);

    priceRanges: any[] = [];

    onFilterChange = output<ProductFilter>();

    constructor(
        private attributeService: AttributeService,
        private exchangeRateService: ExchangeRateService,
        private translate: TranslateService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.colors$ = this.attributeService.getColors();
        const currentLang = this.translate.currentLang;
        const currency = currentLang == 'vi' ? 'VND' : 'USD';
        this.exchangeRateService
            .getUsdRate()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((res) => {
                this.priceRanges = this.displayPriceRanges(
                    res.usd,
                    currency,
                    currentLang,
                );
            });
    }

    displayPriceRanges(usdRate: number, currency: string, currentLang: string) {
        const isVi = currentLang === 'vi';

        return PRODUCT_PRICE_RANGES.map((range) => {
            let label = '';
            // Hàm format tiền tệ nhanh
            const format = (val: number) => {
                if (currency === 'VND') {
                    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
                } else {
                    return '$' + Number((val * usdRate).toFixed(2));
                }
            };

            switch (range.id) {
                case 'range-1':
                    label = isVi
                        ? `Dưới ${format(range.max!)}`
                        : `Under ${format(range.max!)}`;
                    break;
                case 'range-2':
                case 'range-3':
                    label = isVi
                        ? `Từ ${format(range.min!)} - Đến ${format(range.max!)}`
                        : `From ${format(range.min!)} - To ${format(range.max!)}`;
                    break;
                case 'range-4':
                    label = isVi
                        ? `Trên ${format(range.min!)}`
                        : `Above ${format(range.min!)}`;
                    break;
                default:
                    break;
            }
            return { ...range, displayLabel: label };
        });
    }

    togglePrice(price: any) {
        const currentFilter = { ...this.filterState() };
        currentFilter.minPrice =
            this.selectedPriceRangeId() == price.id ? null : price.min;
        currentFilter.maxPrice =
            this.selectedPriceRangeId() == price.id ? null : price.max;

        this.onFilterChange.emit(currentFilter);
    }

    toggleColor(colorId: string) {
        const currentFilter = { ...this.filterState() };
        currentFilter.colors = currentFilter.colors?.includes(colorId)
            ? currentFilter.colors.filter((i) => i !== colorId)
            : [...(currentFilter.colors || []), colorId];

        this.onFilterChange.emit(currentFilter);
    }
}
