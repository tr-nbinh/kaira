import {
    Component,
    ElementRef,
    inject,
    signal,
    viewChildren,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { InputComponent } from '../../../../shared/form-controls/inputs/input.component';
import { passwordMatchValidator } from '../validators/password-match.validator';
import { ResetPasswordInput } from './models/reset-password.model';
import { ERROR_CODE_MAP } from '../../../../shared/forms/constants/error-message';
import { ControlErrorPipe } from '../../../../shared/pipes/control-error.pipe';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    imports: [
        ReactiveFormsModule,
        InputComponent,
        TranslatePipe,
        RouterLink,
        ControlErrorPipe,
    ],
})
export class ResetPasswordComponent {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private authService = inject(AuthService);

    isSubmitting = signal(false);
    verificationId = signal('');
    isLoading = signal(false);
    isVerificationIdInvalid = signal(false);
    showAlert = signal(false);
    serverError = signal<ValidationErrors | null>(null);

    otpInputs = viewChildren<ElementRef<HTMLInputElement>>('otpInput');

    otpLength = 6;
    readonly otpArray = this.fb.array(
        Array.from({ length: 6 }, () =>
            this.fb.nonNullable.control('', [Validators.required]),
        ),
    );
    resetPasswordForm: FormGroup = this.fb.group(
        {
            otp: this.otpArray,
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
                ],
            ],
            confirmPassword: [''],
        },
        {
            validators: passwordMatchValidator('password', 'confirmPassword'),
        },
    );

    ngOnInit() {
        const verificationId = this.route.snapshot.queryParamMap.get('id');
        if (verificationId) {
            this.verificationId.set(verificationId);
            this.isLoading.set(true);
            this.authService
                .getVerificationInfo(verificationId)
                .pipe(finalize(() => this.isLoading.set(false)))
                .subscribe({
                    next: (res) => {},
                    error: (error) => {
                        this.isVerificationIdInvalid.set(true);
                    },
                });
        } else {
            this.isVerificationIdInvalid.set(true);
        }
    }

    onInput(event: Event, index: number) {
        const input = event.target as HTMLInputElement;
        const value = input.value.replace(/\D/g, '');
        this.otpArray.at(index).setValue(value);
        if (value && index < this.otpLength - 1) {
            const next = this.otpInputs()[index + 1].nativeElement;
            next?.focus();
        }
    }

    onKeyDown(event: KeyboardEvent, index: number) {
        if (
            event.key === 'Backspace' &&
            !this.otpArray.controls[index].value &&
            index > 0
        ) {
            const prev = this.otpInputs()[index - 1].nativeElement;
            prev?.focus();
        }
    }

    onPaste(event: ClipboardEvent) {
        event.preventDefault();
        const paste = event.clipboardData?.getData('text') || '';
        const digits = paste.replace(/\D/g, '').split('');

        digits.forEach((d, i) => {
            if (i < this.otpLength) {
                this.otpArray.controls[i].setValue(d);
            }
        });
    }

    onSubmit(): void {
        if (this.resetPasswordForm.invalid) return;

        this.isSubmitting.set(true);
        this.serverError.set(null);
        const payload: ResetPasswordInput = {
            ...this.resetPasswordForm.getRawValue(),
            otp: this.otpArray.getRawValue().join(''),
            verificationId: this.verificationId(),
        };
        this.authService
            .resetPassword(payload)
            .pipe(finalize(() => this.isSubmitting.set(false)))
            .subscribe({
                next: (res) => {
                    this.showAlert.set(true);
                    setTimeout(() => {
                        this.router.navigate(['/auth/login']);
                    }, 3000);
                },
                error: (err) => {
                    if (err.code) {
                        const errorKey =
                            ERROR_CODE_MAP[
                                err.code as keyof typeof ERROR_CODE_MAP
                            ];
                        this.serverError.set({
                            [errorKey]: {
                                remainingAttempts: err.data.remainingAttempts,
                            },
                        });
                    }
                },
            });
    }
}
