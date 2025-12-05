import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-full-page-loading',
    imports: [],
    templateUrl: './full-page-loading.component.html',
    styleUrl: './full-page-loading.component.scss',
})
export class FullPageLoadingComponent {
    @Input() visible = false;
}
