import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RouterLink } from '@angular/router';
import { BreadcrumbItem } from './breadcrumb.model';

@Component({
    selector: 'app-breadcrumb',
    imports: [RouterLink],
    templateUrl: './breadcrumb.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
    items = input.required<BreadcrumbItem[]>();
}
