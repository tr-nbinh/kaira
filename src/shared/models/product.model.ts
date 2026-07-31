import { CategoryType } from '../components/size-guide/size-guide.component';
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

interface ProductDetailBase extends ProductBase {
    brandName: string;
    categoryName: string;
    description: string;
    isBestSeller: boolean;
    colors: AttributeValue[];
    sizes: AttributeValue[] | null;
    images: ProductImage[];
    variants: Variant[];
}

export interface ProductQuickView extends ProductDetailBase {}

export interface ProductDetail extends ProductDetailBase {
    content: string;
    gender: string;
    categoryType: CategoryType;
    specifications: ProductSpecification[];
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

export interface ProductSpecification {
    title: string;
    values: string[];
    displayValue: string;
}

export interface ProductImage {
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
    categorySlug?: string;
    // bestReviewed?: boolean;
    // newArrival?: boolean;
    // brands: number[];
    // searchTerm?: string;
}
