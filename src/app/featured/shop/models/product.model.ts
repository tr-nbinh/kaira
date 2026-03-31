export interface Product {
    id: string;
    name: string;
    slug: string;
    availableColors: ProductAttribute[];
    description?: string;
    content: string;
    variants: Variant[];
}

export interface Variant {
    id: string;
    sku: string;
    isFavorite: boolean;
    price: number;
    compareAtPrice?: number;
    discountPercent?: number;
    displayPrice: number;
    displayCompareAtPrice?: number;
    currency: string;
    color: string;
    colorId: string;
    size?: string;
    stock: number;
    images: VariantImage[];
}

export interface VariantImage {
    id: string;
    url: string;
    is_main: boolean;
}

export interface ProductAttribute {
    id: string;
    value_code: string;
    name: string;
    slug?: string;
}

export interface ProductFilter {
    colors?: string[];
    minPrice?: number;
    maxPrice?: number;
    limit: number;
    page: number;
    bestSeller?: boolean;
    bestReviewed?: boolean;
    newArrival?: boolean;
    // sizes: number[];
    // brands: number[];
    // searchTerm?: string;
}
