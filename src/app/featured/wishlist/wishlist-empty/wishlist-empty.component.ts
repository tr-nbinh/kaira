import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-wishlist-empty',
    imports: [RouterLink, TranslatePipe],
    templateUrl: './wishlist-empty.component.html',
    styleUrl: './wishlist-empty.component.scss',
})
export class WishlistEmptyComponent {}
