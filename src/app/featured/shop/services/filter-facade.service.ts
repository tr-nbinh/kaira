import { Injectable, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductFilter } from '../../../../shared/models/product.model';
import { FilterChip } from '../components/filter-drawer/models/filter-option.model';
import { Location } from '@angular/common';

const DEFAULT_FILTER: ProductFilter = {
    colors: [],
    sizes: [],
};

@Injectable({ providedIn: 'root' })
export class FilterFacade {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly location = inject(Location);

    private readonly _filters = signal<ProductFilter>(DEFAULT_FILTER);
    readonly draftFilter = signal<ProductFilter>(DEFAULT_FILTER);

    readonly filters = this._filters.asReadonly();

    initFromQueryParams() {
        const params = this.route.snapshot.queryParamMap;
        const colors = (params.get('colors') ?? '').split(',').filter(Boolean);
        const sizes = (params.get('sizes') ?? '').split(',').filter(Boolean);
        const minPrice = this.toNumber(params.get('minPrice'));
        const maxPrice = this.toNumber(params.get('maxPrice'));
        this._filters.set({
            colors,
            sizes,
            minPrice,
            maxPrice,
            page: 1,
            limit: 25,
        });
    }

    startEditing() {
        this.draftFilter.set(structuredClone(this._filters()));
    }

    toggleColor(colorId: string) {
        const colors = this.draftFilter().colors ?? [];
        const updated = colors.includes(colorId)
            ? colors.filter((c) => c !== colorId)
            : [...colors, colorId];

        this.updateFilters({ colors: updated });
    }

    toggleSize(sizeId: string) {
        const sizes = this.draftFilter().sizes ?? [];
        const updated = sizes.includes(sizeId)
            ? sizes.filter((s) => s !== sizeId)
            : [...sizes, sizeId];

        this.updateFilters({ sizes: updated });
    }

    updateFilters(filters: Partial<ProductFilter>) {
        this.draftFilter.update((state) => ({
            ...state,
            ...filters,
        }));
    }

    removeFilter(chip: FilterChip) {
        this.draftFilter.update((f) => {
            switch (chip.attributeType) {
                case 'color':
                    return {
                        ...f,
                        colors: (f.colors ?? []).filter((c) => c !== chip.id),
                    };
                case 'size':
                    return {
                        ...f,
                        sizes: (f.sizes ?? []).filter((s) => s !== chip.id),
                    };
                case 'price':
                    return {
                        ...f,
                        minPrice: undefined,
                        maxPrice: undefined,
                    };
            }
        });
    }

    reset() {
        this.draftFilter.set({
            colors: [],
            sizes: [],
            limit: 25,
            page: 1,
        });
    }

    cancel() {
        this.draftFilter.set(structuredClone(this.filters()));
    }

    apply() {
        this._filters.set(structuredClone(this.draftFilter()));
    }

    syncToUrl() {
        const f = this.draftFilter();
        // Stopping scroll to top
        const tree = this.router.createUrlTree([], {
            relativeTo: this.route,
            queryParams: {
                colors: f.colors?.join(',') || null,
                sizes: f.sizes?.join(',') || null,
                minPrice: f.minPrice ?? null,
                maxPrice: f.maxPrice ?? null,
            },
            queryParamsHandling: 'merge',
        });
        this.location.replaceState(this.router.serializeUrl(tree));
    }

    private toNumber(value: string | null): number | undefined {
        if (value == null) return undefined;

        const n = Number(value);
        return Number.isNaN(n) ? undefined : n;
    }
}
