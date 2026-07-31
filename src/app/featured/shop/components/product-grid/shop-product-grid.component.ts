import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
} from '@angular/core';

import { ProductCardComponent } from '../../../../../shared/components/product-card/product-card.component';
import { Product } from '../../../../../shared/models/product.model';
import { GridViewType } from '../toolbar/shop-toolbar.component';
import { ProductCardSkeletonComponent } from '../../../../../shared/components/product-card-skeleton/product-card-skeleton.component';

@Component({
    selector: 'app-shop-product-grid',
    imports: [ProductCardComponent, ProductCardSkeletonComponent],
    templateUrl: './shop-product-grid.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopProductGridComponent {
    readonly products = input.required<Product[]>();
    readonly loading = input(true);
    readonly gridView = input<GridViewType>(4);
    readonly gridClass = computed(() => {
        const columns = this.gridView();
        switch (columns) {
            case 2:
                return 'grid-cols-2 md:grid-cols-2';
            case 3:
                return 'grid-cols-2 md:grid-cols-3';
            case 4:
                return 'grid-cols-2 md:grid-cols-4';
            default:
                return '';
        }
    });

    readonly skeletonItems = Array.from({ length: 24 });
}
