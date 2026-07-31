import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-product-detail-skeleton',
    templateUrl: './product-detail-skeleton.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailSkeletonComponent {}
