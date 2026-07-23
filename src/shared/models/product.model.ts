import { AttributeValue } from './attribute.model';

export type CurrencyType = 'VND' | 'USD';

interface ProductBase {
    id: string;
    name: string;
    slug: string;
    currency: CurrencyType;
}

export interface Product extends ProductBase {
    variantId: string;
    isBestSeller: boolean;
    price: number;
    compareAtPrice?: number;
    discountPercent?: number;
    primaryImageUrl: string;
    secondImageUrl: string;
    isWishlisted: boolean;
}

export interface ProductQuickView extends ProductBase {
    brandName: string;
    categoryName: string;
    description: string;
    isBestSeller: boolean;
    colors: AttributeValue[];
    sizes: AttributeValue[] | null;
    variants: Variant[];
    images: VariantImage[];
}

export interface ProductDetail extends ProductBase {
    brandName: string;
    description: null;
    isBestSeller: boolean;
    colors: AttributeValue[];
    sizes: AttributeValue[] | null;
    variants: VariantDetail[];
    images: VariantImage[];
}

export interface Variant {
    id: string;
    sku: string;
    price: number;
    salePrice: number | null;
    color: AttributeValue;
    size: AttributeValue | null;
    stock: number;
    isDefault: boolean;
    isWishlisted: boolean;
}

export interface VariantDetail extends Variant {
    specifications: VariantSpecification[];
}

export interface VariantSpecification {
    id: string;
    hasLabel: boolean;
    title: string;
    items: VariantSpecificationItem[];
}

export interface VariantSpecificationItem {
    id: string;
    label?: string;
    value: string;
}

export interface VariantImage {
    id: string;
    url: string;
    is_main: boolean;
    attributeValueId: string;
}

export interface ProductFilter {
    colors?: string[];
    sizes?: string[];
    minPrice?: number;
    maxPrice?: number;
    bestSeller?: boolean;
    limit?: number;
    page?: number;
    // bestReviewed?: boolean;
    // newArrival?: boolean;
    // brands: number[];
    // searchTerm?: string;
}
