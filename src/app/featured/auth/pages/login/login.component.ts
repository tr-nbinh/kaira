import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    loginForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.loginForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]], // Username field: required, min 3 characters
            password: ['', [Validators.required, Validators.minLength(6)]], // Password field: required, min 6 characters
        });
    }

    onSubmit() {
        if (this.loginForm.invalid) return;
        this.userService.login(this.loginForm.getRawValue()).subscribe({
            next: (res) => {
                alert('đăng nhập thành công');
                const returnUrl =
                    this.route.snapshot.queryParamMap.get('returnUrl') || '/';
                this.router.navigateByUrl(returnUrl);
            },
            error: (err) => {
                alert('đăng nhập thất bại');
            },
        });
    }
}
