import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterLink, TranslateModule],
    templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
    // Gợi ý danh mục nhanh để giữ chân khách hàng
    readonly quickLinks = [
        { label: 'PAGES.SHOP', routerLink: '/shop' },
        { label: 'PAGES.COLLECTIONS', routerLink: '/collections' },
        { label: 'PAGES.EDITORIAL', routerLink: '/editorial' },
    ];
}
