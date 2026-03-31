export interface PriceRange {
    id: string;
    min: number;
    max: number;
}

export const PRODUCT_PRICE_RANGES: PriceRange[] = [
    { id: 'range-1', min: 0, max: 5000000 },
    { id: 'range-2', min: 5000000, max: 20000000 },
    { id: 'range-3', min: 20000000, max: 40000000 },
    { id: 'range-4', min: 40000000, max: 999999999 },
];
