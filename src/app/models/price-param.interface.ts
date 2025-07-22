import { BaseSelectableItem } from "./baseSelectableItem.interface";

export interface PriceFilterParam extends BaseSelectableItem {
    id: number;
    minPrice?: number;
    maxPrice?: number;
}