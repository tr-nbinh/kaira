import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    interval,
    map,
    Observable,
    of,
    shareReplay,
    startWith,
    Subject,
    take,
    takeUntil,
    timer,
} from 'rxjs';
import { BaseComponent } from '../../../../base/base.component';
import { ToastService } from '../../../../services/toast.service';
import { UserService } from '../../../../services/user.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-pending-verify',
    imports: [NgTemplateOutlet, AsyncPipe, TranslatePipe],
    templateUrl: './pending-verify.component.html',
    styleUrl: './pending-verify.component.scss',
})
export class PendingVerifyComponent extends BaseComponent {
    email: string | null = '';
    verificationStatus: 'pending' | 'success' | 'error' = 'pending';
    resendDisabled: boolean = false;
    countdown$: Observable<number> = of(0);

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
        private toast: ToastService,
        private translate: TranslateService
    ) {
        super();
    }

    ngOnInit() {
        this.email = this.userService.getPendingVerifyEmail();
        this.route.queryParams.subscribe((params) => {
            const status = params['status'];

            if (status === 'success') {
                this.userService.clearPendingVerifyEmail();
                this.verificationStatus = 'success';
                timer(3000).subscribe({
                    complete: () => this.router.navigate(['/auth/login']),
                });
            } else if (status === 'error') {
                this.verificationStatus = 'error';
            } else {
                this.verificationStatus = 'pending';
            }
        });
        const waitUntil = Number(localStorage.getItem('resend_wait_until'));
        if (waitUntil && waitUntil > Date.now()) {
            const remaining = Math.ceil((waitUntil - Date.now()) / 1000);
            this.startCountdown(remaining);
        }
    }

    requestNewVerificationEmail(email?: string) {
        const finalEmail = email || this.email;
        if (!finalEmail) {
            this.toast.warning(this.translate.instant('AUTH.EMAIL_NOTI'));
            return;
        }

        this.userService
            .requestNewVerificationEmail(finalEmail)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: (res) => {
                    this.toast.show(res.message);
                    this.userService.setPendingVerifyEmail(finalEmail);
                    const waitUntil = Date.now() + 10_000;
                    localStorage.setItem(
                        'resend_wait_until',
                        waitUntil.toString()
                    );
                    this.startCountdown(60);
                },
                error: (err) => {
                    this.toast.error(err.message);
                },
            });
    }

    private startCountdown(seconds: number) {
        this.resendDisabled = true;
        this.countdown$ = interval(1000).pipe(
            startWith(0),
            take(seconds + 1),
            map((i) => seconds - i),
            takeUntil(this.ngUnsubscribe),
            shareReplay(1)
        );

        this.countdown$.subscribe({
            complete: () => {
                this.resendDisabled = false;
                localStorage.removeItem('resend_wait_until');
            },
        });
    }
}
