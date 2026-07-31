import { Component, inject, signal } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { InputComponent } from '../../../../shared/form-controls/inputs/input.component';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    imports: [ReactiveFormsModule, TranslatePipe, InputComponent],
})
export class ForgotPasswordComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    isLoading = signal(false);
    showAlert = signal(false);

    forgotPasswordForm: FormGroup = this.fb.group({
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
        if (this.forgotPasswordForm.invalid) return;
        this.showAlert.set(false);
        this.isLoading.set(true);
        const email = this.forgotPasswordForm.get('email')?.value;
        this.authService
            .forgotPassword(email)
            .pipe(
                finalize(() => {
                    this.isLoading.set(false);
                    this.showAlert.set(true);
                }),
            )
            .subscribe();
    }
}
