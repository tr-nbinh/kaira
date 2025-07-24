import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-features',
    imports: [TranslatePipe],
    templateUrl: './features.component.html',
    styleUrl: './features.component.scss',
})
export class FeaturesComponent {}
