import { ProductFilter } from '../../../../shared/models/product.model';

function unorderedArrayEqual(a?: string[], b?: string[]): boolean {
    if (a === b) return true;
    if (!a || !b) return a === b;
    if (a.length !== b.length) return false;

    const setA = new Set(a);
    for (const value of b) {
        if (!setA.has(value)) {
            return false;
        }
    }

    return true;
}

export function equalProductFilters(
    previous: ProductFilter,
    current: ProductFilter,
): boolean {
    return (
        previous.minPrice === current.minPrice &&
        previous.maxPrice === current.maxPrice &&
        unorderedArrayEqual(previous.colors, current.colors) &&
        unorderedArrayEqual(previous.sizes, current.sizes)
    );
}
