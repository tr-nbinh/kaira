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

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private loading: LoadingService,
        private toast: ToastService,
        private router: Router
    ) {}

    ngOnInit() {
        this.registrationForm = this.fb.nonNullable.group(
            {
                username: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(6),
                    ],
                ],
                email: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                        ),
                    ],
                ],
                password: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(6),
                        Validators.pattern(
                            /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/
                        ), // At least one number, one uppercase letter and one special character
                    ],
                ],
                confirmPassword: ['', Validators.required],
            },
            {
                validators: passwordMatchValidator(
                    'password',
                    'confirmPassword'
                ),
            }
        );
    }

    onSubmit(): void {
        const loadingKey = 'submitBtn';
        this.loading.show(loadingKey);
        if (this.registrationForm.valid) {
            this.userService
                .register(this.registrationForm.getRawValue())
                .pipe(finalize(() => this.loading.hide(loadingKey)))
                .subscribe({
                    next: (res) => {
                        this.toast.show(res.message);
                        this.userService.setPendingVerifyEmail(
                            this.registrationForm.get('email')?.value
                        );
                        this.router.navigateByUrl('/auth/pending-verify');
                    },
                    error: (error) => {
                        this.toast.show(error.message);
                    },
                });
        } else {
            this.registrationForm.markAllAsTouched();
        }
    }
}
