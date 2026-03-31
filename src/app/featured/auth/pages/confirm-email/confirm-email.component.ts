import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../base/base.component';
import { UserService } from '../../../../services/user.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-confirm-email',
    imports: [RouterLink, TranslatePipe],
    templateUrl: './confirm-email.component.html',
    styleUrl: './confirm-email.component.scss',
})
export class ConfirmEmailComponent extends BaseComponent {
    private route = inject(ActivatedRoute);
    private authService = inject(UserService);
    private translate = inject(TranslateService);

    status = signal<'loading' | 'success' | 'error'>('loading');
    errorMessage = signal<string>('');

    ngOnInit() {
        const token = this.route.snapshot.queryParamMap.get('token');

        if (!token) {
            this.status.set('error');
            this.errorMessage.set(
                this.translate.instant('AUTH.CONFIRM_EMAIL.ERROR.ALERT'),
            );
            return;
        }

        this.verifyEmail(token);
    }

    verifyEmail(token: string) {
        this.status.set('loading');
        this.authService
            .verifyEmail(token)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: () => {
                    this.status.set('success');
                },
                error: (err) => {
                    this.status.set('error');
                    this.errorMessage.set(
                        err.message || 'Xác thực thất bại. Vui lòng thử lại.',
                    );
                },
            });
    }
}
