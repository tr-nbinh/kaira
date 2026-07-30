import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
} from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { DrawerRef } from '../../../../../shared/components/drawer/drawer-ref';
import { ProductService } from '../../../../../shared/services/product.service';
import { FilterFacade } from '../../services/filter-facade.service';
import { FilterChip } from './models/filter-option.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-filter-drawer',
    templateUrl: './shop-filter-drawer.component.html',
    imports: [TranslatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopFilterDrawerComponent {
    private readonly filterFacade = inject(FilterFacade);
    private readonly drawerRef = inject(DrawerRef);
    private readonly productService = inject(ProductService);

    readonly filterMetadataResource = rxResource({
        loader: () => this.productService.getProductFilterMetadata(),
    });

    readonly filterMetadata = computed(
        () =>
            this.filterMetadataResource.value() || {
                priceRange: { min: 0, max: 10000000 },
                colors: [],
                sizes: [],
            },
    );

    readonly activeColors = computed(
        () => new Set(this.filterFacade.draftFilter().colors),
    );
    readonly activeSizes = computed(
        () => new Set(this.filterFacade.draftFilter().sizes),
    );
    readonly minPrice = computed(
        () => this.filterFacade.draftFilter().minPrice ?? this.ABSOLUTE_MIN,
    );
    readonly maxPrice = computed(
        () =>
            this.filterFacade.draftFilter().maxPrice ??
            this.filterMetadata().priceRange.max,
    );
    readonly displayMinPrice = computed(() =>
        this.formatPrice(
            this.filterFacade.draftFilter().minPrice ?? this.ABSOLUTE_MIN,
        ),
    );
    readonly displaymaxPrice = computed(() =>
        this.formatPrice(
            this.filterFacade.draftFilter().maxPrice ??
                this.filterMetadata().priceRange.max,
        ),
    );

    readonly selectedFilters = computed<FilterChip[]>(() => {
        const f = this.filterFacade.draftFilter();
        const chips: FilterChip[] = [];

        const colors = this.filterMetadata().colors;
        const colorMap = new Map(colors.map((c) => [c.id, c.name]));
        (f.colors ?? []).forEach((colorId) => {
            chips.push({
                id: colorId,
                label: colorMap.get(colorId) ?? colorId,
                attributeType: 'color',
            });
        });

        const sizes = this.filterMetadata().sizes;
        const sizeMap = new Map(sizes.map((s) => [s.id, s.name]));
        (f.sizes ?? []).forEach((sizeId) => {
            chips.push({
                id: sizeId,
                label: sizeMap.get(sizeId) ?? sizeId,
                attributeType: 'size',
            });
        });

        if (
            this.minPrice() !== this.ABSOLUTE_MIN ||
            this.maxPrice() !== this.filterMetadata().priceRange.max
        ) {
            chips.push({
                id: 'price',
                label: `${this.displayMinPrice()} - ${this.displaymaxPrice()}`,
                attributeType: 'price',
            });
        }

        return chips;
    });

    readonly ABSOLUTE_MIN = 0;
    readonly ABSOLUTE_MAX = 10000000;
    readonly PRICE_GAP = 1000000;
    readonly STEP_VALUE = 100000;

    // Tự động tính toán phần trăm (%) tương ứng để đẩy lên style giao diện
    minPercent = computed(() => {
        const range = this.filterMetadata().priceRange.max - this.ABSOLUTE_MIN;
        return ((this.minPrice() - this.ABSOLUTE_MIN) / range) * 100;
    });

    maxPercent = computed(() => {
        const range = this.filterMetadata().priceRange.max - this.ABSOLUTE_MIN;
        return ((this.maxPrice() - this.ABSOLUTE_MIN) / range) * 100;
    });

    onMinSliderChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = +input.value;
        const min = Math.min(value, this.maxPrice() - this.PRICE_GAP);
        input.value = min.toString();
        this.filterFacade.updateFilters({
            minPrice: min,
        });
    }

    onMaxSliderChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = +input.value;
        const max = Math.max(value, this.minPrice() + this.PRICE_GAP);
        input.value = max.toString();
        this.filterFacade.updateFilters({
            maxPrice: max,
        });
    }

    updateMinPrice(event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = Number(input.value.replace(/\D/g, ''));
        let min = Math.max(value, this.ABSOLUTE_MIN);
        min = Math.min(min, this.maxPrice() - this.PRICE_GAP);

        this.filterFacade.updateFilters({ minPrice: min });
    }

    updateMaxPrice(event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = Number(input.value.replace(/\D/g, ''));
        let max = Math.min(value, this.filterMetadata().priceRange.max);
        max = Math.max(max, this.minPrice() + this.PRICE_GAP);

        this.filterFacade.updateFilters({ maxPrice: max });
    }

    validateMinOnBlur(event: Event): void {
        const input = event.target as HTMLInputElement;
        const cleanValue = input.value.replace(/\D/g, '');

        // Nếu bỏ trống, đưa về mặc định nhỏ nhất
        let value = cleanValue === '' ? this.ABSOLUTE_MIN : Number(cleanValue);

        // Làm tròn số theo Step gần nhất
        value = Math.round(value / this.STEP_VALUE) * this.STEP_VALUE;

        // Check điều kiện biên cơ bản
        if (value < this.ABSOLUTE_MIN) value = this.ABSOLUTE_MIN;

        // QUAN TRỌNG: Nếu vi phạm Price Gap (Min gần Max quá 5 triệu)
        if (value > this.maxPrice() - this.PRICE_GAP) {
            value = this.maxPrice() - this.PRICE_GAP;

            // Nếu sau khi trừ đi 5 triệu mà giá trị Min bị âm (dưới mức tuyệt đối)
            if (value < this.ABSOLUTE_MIN) {
                value = this.ABSOLUTE_MIN;
                // Đẩy giá Max lên để giữ khoảng cách 5 triệu hợp lệ
                this.filterFacade.updateFilters({
                    maxPrice: this.ABSOLUTE_MIN + this.PRICE_GAP,
                });
            }
        }

        this.filterFacade.updateFilters({ minPrice: value });
    }

    validateMaxOnBlur(event: Event): void {
        const input = event.target as HTMLInputElement;
        const cleanValue = input.value.replace(/\D/g, '');

        // Nếu bỏ trống, đưa về mặc định lớn nhất
        let value =
            cleanValue === ''
                ? this.filterMetadata().priceRange.max
                : Number(cleanValue);

        // Làm tròn số theo Step gần nhất
        value = Math.round(value / this.STEP_VALUE) * this.STEP_VALUE;

        // Check điều kiện biên cơ bản
        if (value > this.filterMetadata().priceRange.max)
            value = this.filterMetadata().priceRange.max;

        // QUAN TRỌNG: Nếu vi phạm Price Gap (Max gần Min quá 5 triệu)
        if (value < this.minPrice() + this.PRICE_GAP) {
            value = this.minPrice() + this.PRICE_GAP;

            // Nếu sau khi cộng 5 triệu mà giá Max vượt ngưỡng tối đa hệ thống
            if (value > this.filterMetadata().priceRange.max) {
                value = this.filterMetadata().priceRange.max;
                // Kéo giá Min xuống ngược lại để đảm bảo cách nhau 5 triệu hợp lệ
                // this.minPrice.set(this.filterMetadata().priceRange.max - this.PRICE_GAP);
            }
        }

        // this.maxPrice.set(value);
        input.value = this.formatPrice(value); // Đổ số chuẩn lại UI
    }

    formatPrice(value: number): string {
        if (value === 0) return '0';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    ngOnInit() {
        this.filterFacade.startEditing();
    }

    toggleColor(colorId: string) {
        this.filterFacade.toggleColor(colorId);
    }

    toggleSize(sizeId: string) {
        this.filterFacade.toggleSize(sizeId);
    }

    removeChip(chip: FilterChip) {
        this.filterFacade.removeFilter(chip);
    }

    clearFilters() {
        this.filterFacade.reset();
    }

    applyFilter() {
        this.filterFacade.syncToUrl();
        this.filterFacade.apply();
        this.drawerRef.close(true);
    }

    cancel() {
        this.filterFacade.cancel();
    }
}
