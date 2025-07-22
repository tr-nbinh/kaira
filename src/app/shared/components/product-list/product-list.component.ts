import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Product } from '../../../models/product.interface';
import { ProductItemComponent } from '../product-item/product-item.component';


@Component({
    selector: 'app-product-list',
    imports: [TranslateModule, ProductItemComponent],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnChanges {
    @Input() totalColumns: number = 3;
    @Input() products: Product[] = [];
    gridClassColumns: string = `col-md-${12 / this.totalColumns}`;
    currentVariant!: Product;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['totalColumns']) {
            if (
                changes['totalColumns'].currentValue < 1 ||
                changes['totalColumns'].currentValue > 12
            ) {
                this.totalColumns = 3;
                this.gridClassColumns = `col-md-${12 / this.totalColumns}`;
                console.warn(
                    'Total columns must be between 1 and 12. Defaulting to 3.'
                );
            } else {
                this.gridClassColumns = `col-md-${
                    12 / changes['totalColumns'].currentValue
                }`;
            }
        }
    }

    toggleWishlist(product: Product) {
        product.isFavorite = !product.isFavorite;
        
    }
}
