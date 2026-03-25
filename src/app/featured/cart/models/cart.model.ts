export interface AddToCartResponse {
    cartCount: number;
}

export interface CartCountResponse {
    cartCount: number;
}

export interface UpdateCartQuantityResponse {
    updatedQuantity: number;
    cartItemFinalPrice: number;
    subTotal: number;
}

export interface CartResponse {
    cartItems: CartItem[];
    subTotal: number;
}

export interface DeleteCartItemResponse {
    variantId: number;
    cartCount: number;
    subTotal: number;
}

export interface CartItem {
    variantId: string;
    productId: string;
    slug: string;
    name: string;
    color: string;
    size: null;
    price: number;
    stock: number;
    quantity: number;
    imageUrl: string;
    displayPrice: number;
    displayFinalPrice: number;
    currency: string;
}
