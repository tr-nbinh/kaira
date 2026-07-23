import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { SectionHeaderComponent } from '../section-header/section-header.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-newsletter',
    templateUrl: './newsletter.component.html',
    imports: [ReactiveFormsModule, SectionHeaderComponent, TranslatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterComponent {
    readonly newsletterForm = new FormGroup({
        email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        }),
    });

    get emailControl(): FormControl<string> {
        return this.newsletterForm.controls.email;
    }

    onSubmit(): void {
        if (this.newsletterForm.invalid) {
            this.newsletterForm.markAllAsTouched();
            return;
        }

        const email = this.emailControl.value;

        console.log('Subscribe:', email);

        this.newsletterForm.reset();
    }
}
