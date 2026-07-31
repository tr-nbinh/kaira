import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export type GridViewType = 2 | 3 | 4;

@Component({
    selector: 'app-shop-toolbar',
    templateUrl: './shop-toolbar.component.html',
    imports: [TranslatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopToolbarComponent {
    readonly totalProducts = input(0);
    readonly gridView = input<GridViewType>(4);

    readonly filterClick = output<void>();
    readonly searchClick = output<void>();
    readonly sortClick = output<void>();
    readonly gridViewChange = output<GridViewType>();
}
