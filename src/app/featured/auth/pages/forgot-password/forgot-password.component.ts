import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { BaseComponent } from '../../../../base/base.component';
import { FormControlErrorDirective } from '../../../../shared/directives/form-control-error.directive';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-forgot-password',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        FormControlErrorDirective,
        RouterLink,
        TranslatePipe,
    ],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent extends BaseComponent {
    private fb = inject(FormBuilder);
    private userService = inject(UserService);

    isSubmitting = signal(false);
    isSent = signal(false);
    userEmail = signal('');

    forgotForm: FormGroup = this.fb.group({
        email: [
            '',
            [
                Validators.required,
                Validators.pattern(
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                ),
            ],
        ],
    });

    onSubmit() {
        if (this.forgotForm.invalid) {
            this.forgotForm.markAllAsTouched();
            return;
        }
        const email = this.forgotForm.value.email;
        this.userService
            .forgotPassword(email)
            .pipe(finalize(() => this.isSubmitting.set(false)))
            .subscribe({
                next: () => {
                    this.userEmail.set(email);
                    this.isSent.set(true);
                },
                error: (err) => {
                    if (err.status === 404) {
                        this.forgotForm
                            .get('email')
                            ?.setErrors({ notFound: true });
                    }
                },
            });
    }
}
