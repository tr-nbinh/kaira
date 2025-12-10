import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { LoadingToggleDirective } from '../../../../shared/directives/loading-toggle.directive';
import { BaseComponent } from '../../../../base/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../../../services/loading.service';
import { ToastService } from '../../../../services/toast.service';
import { UserService } from '../../../../services/user.service';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { FormControlErrorDirective } from '../../../../shared/directives/form-control-error.directive';
import { finalize, takeUntil, tap } from 'rxjs';

type PassWordType = 'text' | 'password';
@Component({
    selector: 'app-reset-password',
    imports: [
        ReactiveFormsModule,
        TranslatePipe,
        LoadingToggleDirective,
        FormControlErrorDirective,
    ],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent extends BaseComponent {
    resetPasswordForm!: FormGroup;
    token: string | null = '';
    pwInputType: PassWordType = 'password';
    confirmInputType: PassWordType = 'password';

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private toast: ToastService,
        private route: ActivatedRoute,
        private loading: LoadingService
    ) {
        super();
    }

    ngOnInit() {
        this.resetPasswordForm = this.fb.nonNullable.group(
            {
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

        this.token = this.route.snapshot.queryParamMap.get('token');
    }

    resetPassword() {
        if (!this.token || this.resetPasswordForm.invalid) return;
        this.userService
            .resetPassword(
                this.token,
                this.resetPasswordForm.get('password')?.value
            )
            .pipe(
                tap(() => this.loading.show('reset-password-btn')),
                finalize(() => this.loading.hide('reset-password-btn')),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe({
                next: (res) => {
                    this.toast.success(res.message);
                },
                error: (err) => {
                    this.toast.error(err.message);
                },
            });
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
