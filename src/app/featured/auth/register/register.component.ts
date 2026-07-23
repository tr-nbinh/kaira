import { Component, inject, signal } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { InputComponent } from '../../../../shared/form-controls/inputs/input.component';
import { emailExistsValidator } from './validators/email-exists.validator';
import { passwordMatchValidator } from '../validators/password-match.validator';
import { AuthService } from '../../../../core/auth/auth.service';
import { finalize } from 'rxjs';
import { ApiError } from '../../../models/api-response.interface';
import { ERROR_CODE_MAP } from '../../../../shared/forms/constants/error-message';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    imports: [ReactiveFormsModule, RouterLink, TranslatePipe, InputComponent],
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private authService = inject(AuthService);

    errorMessage = signal('Đây là lỗi');
    showPassword = signal<boolean>(false);
    isLoading = signal<boolean>(false);

    registerForm: FormGroup = this.fb.group(
        {
            fullName: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                    Validators.pattern(
                        /^[\p{L}]+(?:[\p{L}\p{M}'’-]*(?:\s+[\p{L}\p{M}'’-]+)*)$/u,
                    ),
                ],
            ],
            email: [
                '',
                [
                    Validators.required,
                    Validators.pattern(
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    ),
                ],
                [emailExistsValidator()],
            ],
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
                ],
            ],
            confirmPassword: [''],
            agreeTerms: [false, Validators.requiredTrue],
        },
        {
            validators: passwordMatchValidator('password', 'confirmPassword'),
        },
    );

    onSubmit(): void {
        if (this.registerForm.invalid) return;
        this.isLoading.set(true);
        this.authService
            .register(this.registerForm.getRawValue())
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (res) => {
                    console.log(res);
                    this.router.navigate(['/auth/verify-email'], {
                        queryParams: { id: res.verificationId },
                    });
                },
                error: (error: ApiError) => {
                    if (error.data) {
                        Object.entries(
                            error.data as { [key: string]: string },
                        ).forEach(([key, value]) => {
                            const errorKey =
                                ERROR_CODE_MAP[
                                    value as keyof typeof ERROR_CODE_MAP
                                ];
                            this.registerForm
                                .get(key)
                                ?.setErrors({ [errorKey]: true });
                        });
                    }
                },
            });
    }
}
