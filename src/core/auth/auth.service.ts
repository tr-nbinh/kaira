import { computed, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { ResetPasswordInput } from '../../app/featured/auth/reset-password/models/reset-password.model';
import { VerifyOtpInput } from '../../app/featured/auth/verify-email/models/verify-otp.model';
import { BaseService } from '../sevices/base.service';
import { LoginInput, RegisterInput } from './models/auth-request.model';
import { UserProfile } from './models/user-profile.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService extends BaseService {
    private readonly _endpoint = 'auth';
    private readonly _currentUser = signal<UserProfile | null>(null);

    readonly currentUser = this._currentUser.asReadonly();
    readonly isLoggedIn = computed(() => this.currentUser() !== null);

    /**
     * Hàm này sẽ được gọi THỨC TỈNH khi App vừa bật lên (App Initializer)
     * Server nhận request này sẽ tự đọc Cookie đi kèm để xác thực
     */
    checkAuthStatus(): Observable<boolean> {
        return this.get<UserProfile>(`${this._endpoint}/me`).pipe(
            map((user) => {
                this._currentUser.set(user);
                return true;
            }),
            catchError(() => {
                this._currentUser.set(null);
                return of(false);
            }),
        );
    }

    login(credentials: LoginInput): Observable<UserProfile> {
        return this.post<UserProfile>(
            `${this._endpoint}/login`,
            credentials,
        ).pipe(
            tap((user) => {
                if (user) {
                    this._currentUser.set(user);
                }
            }),
        );
    }

    logout() {
        return this.post(`${this._endpoint}/logout`, {}).pipe(
            finalize(() => this._currentUser.set(null)),
        );
    }

    register(payload: RegisterInput): Observable<{ verificationId: string }> {
        return this.post(`${this._endpoint}/register`, payload);
    }

    refreshToken() {
        return this.post(`${this._endpoint}/refresh-token`, {});
    }

    checkEmailExists(email: string): Observable<{ isExists: boolean }> {
        return this.post(`${this._endpoint}/check-email-exists`, { email });
    }

    getVerificationInfo(verificationId: string): Observable<{ email: string }> {
        return this.get(`${this._endpoint}/otp-session`, {
            id: verificationId,
        });
    }

    verifyOtp(payload: VerifyOtpInput) {
        return this.post(`${this._endpoint}/verify-otp`, payload);
    }

    resendOtp(verificationId: string): Observable<{ verificationId: string }> {
        return this.post(`${this._endpoint}/resend-otp`, { verificationId });
    }

    forgotPassword(email: string) {
        return this.post(`${this._endpoint}/forgot-password`, { email });
    }

    resetPassword(payload: ResetPasswordInput) {
        return this.post(`${this._endpoint}/reset-password`, payload);
    }
}
