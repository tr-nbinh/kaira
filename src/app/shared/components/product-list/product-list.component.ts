import { Component, Input } from '@angular/core';
import { Product } from '../../../featured/shop/models/product.model';
import { ProductItemComponent } from '../product-item/product-item.component';

@Component({
    selector: 'app-product-list',
    imports: [ProductItemComponent],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
    @Input() products: Product[] = [];
    fakeProducts = new Array(6).fill(undefined);
}
