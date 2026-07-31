import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-wishlist-skeleton',
    templateUrl: './wishlist-skeleton.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistSkeletonComponent {}
