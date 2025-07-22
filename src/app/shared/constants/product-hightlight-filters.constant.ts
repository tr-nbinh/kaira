import { BaseSelectableItem } from '../../models/baseSelectableItem.interface';
import { ProductHighlightFilterValue } from '../enums/product-highlight-filter-value.enum';

export const PRODUCT_HIGHLIGHT_FILTERS: BaseSelectableItem[] = [
    {
        id: 1,
        text: 'COMMON.BEST_SELLERS',
        checked: true,
        value: ProductHighlightFilterValue.best_seller,
    },
    {
        id: 2,
        text: 'COMMON.NEW_ARRIVALS',
        checked: false,
        value: ProductHighlightFilterValue.new_arrivals,
    },
    {
        id: 3,
        text: 'COMMON.BEST_REVIEWED',
        checked: false,
        value: ProductHighlightFilterValue.best_reviewed,
    },
];
