import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-section-link',
    imports: [RouterLink],
    templateUrl: './section-link.component.html',
})
export class SectionLinkComponent {
    routerLink = input.required<string>();
}
