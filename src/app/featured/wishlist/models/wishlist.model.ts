export interface WishlistToggleResponse {
    isWishlisted: boolean;
    wishlistCount: number;
}

export interface WishlistCountResponse {
    wishlistCount: number;
}

export interface WishlistItem {
    id: string;
    name: string;
    slug: string;
    productId: string;
    variantId: string;
    stock: number;
    imageUrl: string;
    color: string;
    size: null;
}
