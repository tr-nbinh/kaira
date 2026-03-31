import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../../services/user.service';
import { BaseComponent } from '../../../../base/base.component';
import { takeUntil } from 'rxjs';
import { ToastService } from '../../../../services/toast.service';
import { ResendEmailErrorResponse } from '../../models/authResponse.interface';

@Component({
    selector: 'app-verify-email',
    imports: [RouterLink, TranslatePipe],
    templateUrl: './verify-email.component.html',
    styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent extends BaseComponent {
    private route = inject(ActivatedRoute);
    private userService = inject(UserService);
    private toast = inject(ToastService);
    private translate = inject(TranslateService);

    userEmail = signal<string | null>(null);
    isInvalidAccess = signal<boolean>(false);
    countdown = signal(0);
    isWaiting = signal(false);

    ngOnInit() {
        const email = this.route.snapshot.queryParamMap.get('email');
        if (email) {
            this.userEmail.set(email);
        } else {
            this.isInvalidAccess.set(true);
        }
    }

    resendEmail() {
        this.userService
            .resendEmail(this.userEmail()!)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: () => {
                    this.startTimer(60);
                },
                error: (err) => {
                    const data = err.data as ResendEmailErrorResponse;
                    if (err.status === 429) {
                        const seconds = data.retryAfter || 60;
                        this.startTimer(seconds);
                        this.toast.warning(err.message);
                    }
                },
            });
    }

    private startTimer(seconds: number) {
        this.countdown.set(seconds);
        this.isWaiting.set(true);

        const timer = setInterval(() => {
            this.countdown.update((v) => v - 1);
            if (this.countdown() <= 0) {
                this.isWaiting.set(false);
                clearInterval(timer);
            }
        }, 1000);
    }
}
