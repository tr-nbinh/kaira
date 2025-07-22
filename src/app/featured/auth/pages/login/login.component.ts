import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LoadingToggleDirective } from '../../../../shared/directives/loading-toggle.directive';
import { LoadingService } from '../../../../services/loading.service';
import { ToastService } from '../../../../services/toast.service';
import { finalize } from 'rxjs';
import { ApiError } from '../../../../models/api-response.interface';
import { User } from '../../models/user.interface';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        RouterLink,
        TranslatePipe,
        LoadingToggleDirective,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    loginForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute,
        private loading: LoadingService,
        private toast: ToastService
    ) {}

    ngOnInit() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required]],
            rememberMe: [false],
        });
    }

    onSubmit() {
        if (this.loginForm.invalid) return;
        const loadingKey = 'submitBtn';
        this.loading.show(loadingKey);
        this.userService
            .login(this.loginForm.getRawValue())
            .pipe(finalize(() => this.loading.hide(loadingKey)))
            .subscribe({
                next: (res) => {
                    if (res.data) {
                        this.userService.setTokens(res.data.accessToken);
                        this.userService.setUser(res.data.user);
                        this.userService.setAuthenticated(true);
                        const returnUrl =
                            this.route.snapshot.queryParamMap.get(
                                'returnUrl'
                            ) || '/';
                        this.router.navigateByUrl(returnUrl);
                    }
                },
                error: (error: ApiError<User>) => {
                    this.toast.warning(error.message);
                    const user = error.data;
                    if (user && !user.isVerified) {
                        this.userService.setPendingVerifyEmail(user.email);
                        this.router.navigateByUrl('/auth/pending-verify');
                    }
                },
            });
    }
}
