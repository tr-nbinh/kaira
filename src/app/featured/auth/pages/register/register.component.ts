import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../../../../services/loading.service';
import { ToastService } from '../../../../services/toast.service';
import { UserService } from '../../../../services/user.service';
import { FormControlErrorDirective } from '../../../../shared/directives/form-control-error.directive';
import { LoadingToggleDirective } from '../../../../shared/directives/loading-toggle.directive';
import { passwordMatchValidator } from '../../validators/password-match.validator';

type InputType = 'text' | 'password';

@Component({
    selector: 'app-register',
    imports: [
        ReactiveFormsModule,
        RouterLink,
        FormControlErrorDirective,
        TranslatePipe,
        LoadingToggleDirective,
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
})
export class RegisterComponent {
    registrationForm!: FormGroup;
    pwInputType: InputType = 'password';
    confirmInputType: InputType = 'password';

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private loading: LoadingService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.registrationForm = this.fb.nonNullable.group(
            {
                username: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(15),
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
                ],
                password: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(6),
                        Validators.pattern(
                            /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/,
                        ), // At least one number, one uppercase letter and one special character
                    ],
                ],
                confirmPassword: ['', Validators.required],
            },
            {
                validators: passwordMatchValidator(
                    'password',
                    'confirmPassword',
                ),
            },
        );
    }

    onSubmit(): void {
        if (this.registrationForm.valid) {
            const loadingKey = 'submitBtn';
            this.loading.show(loadingKey);
            this.userService
                .register(this.registrationForm.getRawValue())
                .pipe(finalize(() => this.loading.hide(loadingKey)))
                .subscribe({
                    next: (res) => {
                        this.router.navigate(['/auth/verify-email'], {
                            queryParams: { email: res.email },
                        });
                    },
                    error: (error) => {
                        if (error.status == 409) {
                            this.registrationForm.get('email')?.setErrors({
                                alreadyExists: error.message,
                            });
                            this.registrationForm
                                .get('email')
                                ?.markAllAsTouched();
                        }
                    },
                });
        } else {
            this.registrationForm.markAllAsTouched();
        }
    }

    togglePassword() {
        this.pwInputType =
            this.pwInputType === 'password' ? 'text' : 'password';
    }

    toggleConfirmPassword() {
        this.confirmInputType =
            this.confirmInputType === 'password' ? 'text' : 'password';
    }
}
