import { CurrencyType } from '../../shared/models/product.model';

export interface WishlistCountResponse {
    wishlistCount: number;
}

export interface ToggleWishlistResponse {
    isWishlisted: boolean;
    wishlistCount: number;
}

export interface WishlistItem {
    id: string;
    productId: string;
    variantId: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    stock: number;
    currency: CurrencyType;
    variantSummary: string; // Black - M
    imageUrl: string;
}
