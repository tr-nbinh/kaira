import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { BaseComponent } from '../../../../base/base.component';
import { FormControlErrorDirective } from '../../../../shared/directives/form-control-error.directive';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { UserService } from '../../../../services/user.service';
import { ResetPasswordRequest } from '../../models/authResponse.interface';
import { ToastService } from '../../../../services/toast.service';
import { TranslatePipe } from '@ngx-translate/core';

type InputType = 'text' | 'password';
@Component({
    selector: 'app-reset-password',
    imports: [
        ReactiveFormsModule,
        FormControlErrorDirective,
        RouterLink,
        TranslatePipe,
    ],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent extends BaseComponent {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private userService = inject(UserService);
    private toast = inject(ToastService);

    pwInputType: InputType = 'password';
    confirmInputType: InputType = 'password';
    token = signal<string | null>(null);
    isSubmitting = signal(false);
    isSuccess = signal(false);

    resetForm: FormGroup = this.fb.group(
        {
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.pattern(
                        /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/,
                    ),
                ],
            ],
            confirmPassword: ['', Validators.required],
        },
        {
            validators: passwordMatchValidator('password', 'confirmPassword'),
        },
    );

    ngOnInit() {
        this.token.set(this.route.snapshot.queryParamMap.get('token'));

        if (!this.token()) {
            // Nếu không có token, có thể điều hướng về trang chủ hoặc hiện lỗi
            console.error('Không tìm thấy Token xác thực');
        }
    }

    onSubmit() {
        if (this.resetForm.invalid || !this.token()) {
            this.resetForm.markAllAsTouched();
            return;
        }
        this.isSubmitting.set(true);
        const payload: ResetPasswordRequest = {
            token: this.token()!,
            password: this.resetForm.value.password,
            confirmPassword: this.resetForm.value.confirmPassword,
        };

        this.userService
            .resetPassword(payload)
            .pipe(finalize(() => this.isSubmitting.set(false)))
            .subscribe({
                next: () => {
                    this.isSuccess.set(true);
                    setTimeout(
                        () => this.router.navigate(['/auth/login']),
                        3000,
                    );
                },
                error: (err: any) => {
                    this.toast.error(err.message || 'Server error');
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
