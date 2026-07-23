import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize, map, startWith } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { CartStore } from '../../../../core/stores/cart.store';
import { InputComponent } from '../../../../shared/form-controls/inputs/input.component';
import { ControlErrorPipe } from '../../../../shared/pipes/control-error.pipe';
import { ERROR_CODE_MAP } from '../../../../shared/forms/constants/error-message';
import { WishlistStore } from '../../../../core/stores/wishlist.store';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [
        ReactiveFormsModule,
        InputComponent,
        RouterLink,
        TranslatePipe,
        ControlErrorPipe,
    ],
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private wishlistStore = inject(WishlistStore);
    private cartStore = inject(CartStore);

    isLoading = signal(false);

    loginForm: FormGroup = this.fb.group({
        email: [
            '',
            [
                Validators.required,
                Validators.pattern(
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                ),
            ],
        ],
        password: ['', [Validators.required]],
    });

    private formState = toSignal(
        this.loginForm.statusChanges.pipe(
            startWith(this.loginForm.status),
            map(() => ({
                errors: this.loginForm.errors,
                invalid: this.loginForm.invalid,
                touched: this.loginForm.touched,
                dirty: this.loginForm.dirty,
            })),
        ),
        {
            initialValue: {
                errors: this.loginForm.errors,
                invalid: this.loginForm.invalid,
                touched: this.loginForm.touched,
                dirty: this.loginForm.dirty,
            },
        },
    );

    readonly formErrors = computed(() => this.formState().errors);
    readonly showFormError = computed<boolean>(() => {
        const s = this.formState();
        return !!(s.invalid && s.errors && (s.touched || s.dirty));
    });

    onSubmit(): void {
        if (this.loginForm.invalid) return;
        this.isLoading.set(true);
        this.authService
            .login(this.loginForm.getRawValue())
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (res) => {
                    this.wishlistStore.loadCount();
                    this.cartStore.loadCount();

                    const returnUrl =
                        this.route.snapshot.queryParamMap.get('returnUrl') ||
                        '/';
                    this.router.navigateByUrl(returnUrl);
                },
                error: (error) => {
                    const errorCode = error.code;
                    if (errorCode) {
                        if (errorCode == 'EMAIL_NOT_VERIFIED') {
                            this.loginForm.setErrors({
                                emailNotVerified: { email: error.data.email },
                            });
                            return;
                        }
                        const errorKey =
                            ERROR_CODE_MAP[
                                error.code as keyof typeof ERROR_CODE_MAP
                            ];
                        this.loginForm.setErrors({ [errorKey]: true });
                    }
                },
            });
    }
}
