import { CurrencyType } from '../../shared/models/product.model';

export interface CartItem {
    id: string;
    productId: string;
    variantId: string;
    slug: string;
    name: string;
    variantSummary: string; // BLACK / M
    price: number;
    compareAtPrice?: number;
    quantity: number;
    imageUrl: string;
    stock: number;
    currency: CurrencyType;
}

export interface AddCartItem {
    variantId: string;
    quantity: number;
}

export interface AddCartItemResponse {
    count: number;
}

export interface UpdateCartItemQuantity {
    cartItemId: string;
    quantity: number;
}

export interface UpdateCartItemQuantityReponse {
    quantity: number;
}

export interface CartCountResponse {
    cartCount: number;
}
