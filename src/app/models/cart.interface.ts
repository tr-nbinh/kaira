import { BaseSelectableItem } from "./baseSelectableItem.interface";

export interface CartItem {
    id: number;
    name: string;
    color: string;
    hexColor: string;
    price: number;
    size: string;
    imageUrl: string;
    quantity: number;
    quantityInStock: number;
    finalPrice: number;
    subTotal: number;
    productId: number;
    slug: string;
    variantId: number;
    selected?: boolean;
}
