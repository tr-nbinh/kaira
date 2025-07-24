import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-contact',
    imports: [TranslatePipe],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss',
})
export class ContactComponent {}
