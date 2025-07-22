import { BaseSelectableItem } from './baseSelectableItem.interface';
import { Category } from './category.interface';
import { Color } from './color.interface';

export interface CategorySelectItem extends Category, BaseSelectableItem {}

export interface ColorSelectItem extends Color,BaseSelectableItem {}

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
}
