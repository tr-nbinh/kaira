import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { DialogService } from '../../../../services/dialog.service';
import { LoadingService } from '../../../../services/loading.service';
import { ToastService } from '../../../../services/toast.service';
import { UserService } from '../../../../services/user.service';
import { LoadingToggleDirective } from '../../../../shared/directives/loading-toggle.directive';

type pwInputType = 'text' | 'password';

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
    inputType: pwInputType = 'password';
    @ViewChild('verificationNoti') noti!: TemplateRef<any>;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute,
        private loading: LoadingService,
        private toast: ToastService,
    ) {}

    ngOnInit() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required]],
            rememberMe: [false],
        });
    }

    togglePassword() {
        this.inputType = this.inputType === 'password' ? 'text' : 'password';
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
                    this.userService.setTokens(res.accessToken);
                    this.userService.setAuthenticated(true);
                    const returnUrl =
                        this.route.snapshot.queryParamMap.get('returnUrl') ||
                        '/';
                    this.router.navigateByUrl(returnUrl);
                },
                error: (error) => {
                    this.toast.error(error.message);
                },
            });
    }
}
