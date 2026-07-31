import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-cart-skeleton',
    templateUrl: './cart-skeleton.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSkeletonComponent {}
