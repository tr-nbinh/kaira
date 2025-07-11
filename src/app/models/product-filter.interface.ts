import { BaseSelectableItem } from './baseSelectableItem.interface';

export interface Category extends BaseSelectableItem {
    id: number;
    name: string;
    imageUrl: string;
}

export interface Color extends BaseSelectableItem {
    id: number;
    name: string;
    hexCode: string;
}

export interface Size extends BaseSelectableItem {
    id: number;
    name: string;
}

export interface Brand extends BaseSelectableItem {
    id: number;
    name: string;
}

export interface Price extends BaseSelectableItem {
    minPrice?: number;
    maxPrice?: number;
    filterParam: string;
}
