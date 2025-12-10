import { PaginatedRequest } from './paginatedRequest.interface';
import { ColorSelectItem } from './product-filter.interface';

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    variants: ProductVariant[];
    colors: ColorSelectItem[];
    sizes: Size[];
    categories: string[];
    quantity: number;
    isFavorite: boolean;
    imageUrl: string;
    hexColor: string;
    brand: string;
    color: string;
    size: string;
    slug: string;
    category: string;
}

export interface ProductDetail extends Product {
    variants: ProductVariant[];
    colors: ColorSelectItem[];
    sizes: Size[];
    categories: string[];
}

export interface ProductRequest extends PaginatedRequest {
    bestSeller?: boolean;
    isNewArrival?: boolean;
    bestReviewed?: boolean;
    categoryIds?: number[];
    colorIds?: number[];
    sizeIds?: number[];
    brandIds?: number[];
    prices?: string[];
}

export interface VariantImage {
    id: number;
    variantId: number;
    publicId: string;
    imageUrl: string;
}

export interface ProductVariant {
    id: number;
    sku: string;
    sizeId: number;
    colorId: number;
    quantity: number;
    price: number;
    discount: number | null;
    order: number;
    images: string[];
    isFavorite: boolean;
}

interface Size {
    id: number;
    name: string;
}
