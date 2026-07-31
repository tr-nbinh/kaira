import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-button',
    imports: [RouterLink],
    templateUrl: './button.component.html',
})
export class ButtonComponent {
    routerLink = input<string>();
}
