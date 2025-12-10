import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseComponent } from '../../../../base/base.component';
import { LoadingToggleDirective } from '../../../../shared/directives/loading-toggle.directive';
import { DialogService } from '../../../../services/dialog.service';
import { UserService } from '../../../../services/user.service';
import { finalize, takeUntil, takeWhile, tap } from 'rxjs';
import { ApiError } from '../../../../models/api-response.interface';
import { ToastService } from '../../../../services/toast.service';
import { LoadingService } from '../../../../services/loading.service';

@Component({
    selector: 'app-forgot-password',
    imports: [TranslatePipe, FormsModule, LoadingToggleDirective],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent extends BaseComponent {
    email: string = '';
    message: string = '';
    @ViewChild('notifyTpl') notifyTpl!: TemplateRef<HTMLElement>;

    constructor(
        private dialog: DialogService,
        private userService: UserService,
        private toast: ToastService,
        private loading: LoadingService
    ) {
        super();
    }

    requestNewResetEmail() {
        this.userService
            .requestNewResetEmail(this.email)
            .pipe(
                tap(() => this.loading.show('forgot-password-btn')),
                finalize(() => this.loading.hide('forgot-password-btn')),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe({
                next: (res) => {
                    this.message = res.message;
                    this.dialog.open({
                        title: 'Quên mật khẩu',
                        body: this.notifyTpl,
                    });
                },
                error: (error: ApiError) => {
                    this.toast.error(error.message);
                },
            });
    }
}
