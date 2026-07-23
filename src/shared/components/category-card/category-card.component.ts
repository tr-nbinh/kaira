import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-category-card',
    templateUrl: './category-card.component.html',
    imports: [RouterLink, TranslatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCardComponent {
    id = input.required<string>();
    name = input.required<string>();
    slug = input.required<string>();
    image = input.required<string>();
    headingId = computed(() => `category-${this.id()}`);
}
