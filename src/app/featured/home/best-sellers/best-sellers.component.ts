import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { SectionLinkComponent } from '../../../../shared/components/section-link/section-link.component';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { Product } from '../../../../shared/models/product.model';

@Component({
    selector: 'app-best-sellers',
    templateUrl: './best-sellers.component.html',
    imports: [
        RouterLink,
        TranslatePipe,
        SectionHeaderComponent,
        SectionLinkComponent,
        ProductCardComponent,
    ],
})
export class BestSellersComponent {
    products = input<Product[]>([]);
}
