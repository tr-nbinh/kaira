import {
    Component,
    ElementRef,
    inject,
    signal,
    viewChildren,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, timer } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { otpType, VerifyOtpInput } from './models/verify-otp.model';
import { TranslatePipe } from '@ngx-translate/core';
import { NgTemplateOutlet } from '@angular/common';

type VerifyOtpStatus = 'idle' | 'verifying' | 'success' | 'error';
type SendOtpStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
    selector: 'app-verify-email',
    templateUrl: './verfiy-email.component.html',
    imports: [ReactiveFormsModule, RouterLink, TranslatePipe, NgTemplateOutlet],
})
export class VerifyEmailComponent {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private authService = inject(AuthService);

    otpInputs = viewChildren<ElementRef<HTMLInputElement>>('otpInput');

    isLoading = signal(false);
    verificationId = signal('');
    isVerificationIdInvalid = signal(false);
    email = signal('');
    verifyOtpStatus = signal<VerifyOtpStatus>('idle');
    sendOtpStatus = signal<SendOtpStatus>('idle');

    otpLength = 6;
    readonly otpArray = this.fb.array(
        Array.from({ length: 6 }, () => this.fb.nonNullable.control('')),
    );
    readonly otpForm = this.fb.group({
        otp: this.otpArray,
    });
    resendCooldown = 0;
    timer: any;

    ngOnInit() {
        const verificationId = this.route.snapshot.queryParamMap.get('id');
        if (verificationId) {
            this.verificationId.set(verificationId);
            this.isLoading.set(true);
            this.authService
                .getVerificationInfo(verificationId)
                .pipe(finalize(() => this.isLoading.set(false)))
                .subscribe({
                    next: (res) => {
                        this.email.set(res.email);
                    },
                    error: (error) => {
                        this.isVerificationIdInvalid.set(true);
                    },
                });
        } else {
            this.isVerificationIdInvalid.set(true);
        }
    }

    onInput(event: Event, index: number) {
        this.resetOtpStatus();
        const input = event.target as HTMLInputElement;
        const value = input.value.replace(/\D/g, '');
        this.otpArray.at(index).setValue(value);
        if (value && index < this.otpLength - 1) {
            const next = this.otpInputs()[index + 1].nativeElement;
            next?.focus();
        }

        this.tryVerify();
    }

    onKeyDown(event: KeyboardEvent, index: number) {
        this.resetOtpStatus();
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
        this.resetOtpStatus();
        event.preventDefault();
        const paste = event.clipboardData?.getData('text') || '';
        const digits = paste.replace(/\D/g, '').split('');

        digits.forEach((d, i) => {
            if (i < this.otpLength) {
                this.otpArray.controls[i].setValue(d);
            }
        });

        this.tryVerify();
    }

    verify(otp: string) {
        this.verifyOtpStatus.set('verifying');
        this.otpArray.disable();
        const payload: VerifyOtpInput = {
            verificationId: this.verificationId(),
            otp,
            otpType: otpType.verifyemail,
        };
        this.authService.verifyOtp(payload).subscribe({
            next: (value) => {
                this.verifyOtpStatus.set('success');
                timer(3000).subscribe(() =>
                    this.router.navigate(['/auth/login']),
                );
            },
            error: (err) => {
                this.verifyOtpStatus.set('error');
                this.otpArray.enable();
            },
        });
    }

    private tryVerify() {
        const otp = this.otpArray.controls
            .map((control) => control.value)
            .join('');
        if (otp.length !== 6) return;
        if (this.verifyOtpStatus() === 'verifying') return;

        this.verify(otp);
    }

    resend() {
        if (this.resendCooldown > 0) return;
        this.resendCooldown = 60;
        this.startTimer();

        this.sendOtpStatus.set('sending');
        this.authService.resendOtp(this.verificationId()).subscribe({
            next: (res) => {
                this.verificationId.set(res.verificationId);
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: { id: res.verificationId },
                    queryParamsHandling: 'merge',
                });
                this.sendOtpStatus.set('success');
            },
            error: (error) => {
                if (error.data) {
                    this.resendCooldown = error.data.remainingSeconds;
                    this.startTimer();
                }
                this.sendOtpStatus.set('error');
            },
        });
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.resendCooldown--;
            if (this.resendCooldown === 0) {
                clearInterval(this.timer);
            }
        }, 1000);
    }

    resetOtpStatus() {
        this.verifyOtpStatus.set('idle');
        this.sendOtpStatus.set('idle');
    }
}
