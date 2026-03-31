import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { SHOW_TOAST } from '../../core/token';
import { BaseService } from '../base/base.service';
import {
    LoginResponse,
    RefreshTokenResponse,
    RegisterResponse,
    ResetPasswordRequest,
} from '../featured/auth/models/authResponse.interface';
import { User } from '../featured/auth/models/user.interface';
import { Login } from '../models/auth/login.interface';
import { RegisterRequest } from '../models/auth/register.interface';

const ACCESSTOKEN_KEY = 'accessToken';
const PENDING_VERIFY_EMAIL = 'pendingVerifyEmail';
const PROTECTED_ROUTES = ['/cart', '/wishlist', '/checkout'];

@Injectable({
    providedIn: 'root',
})
export class UserService extends BaseService {
    private readonly _endpoint = 'auth';
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(
        !!localStorage.getItem(ACCESSTOKEN_KEY),
    );
    isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(
        http: HttpClient,
        private router: Router,
    ) {
        super(http);
    }

    register(data: RegisterRequest): Observable<RegisterResponse> {
        return this.post(`${this._endpoint}/register`, data);
    }

    login(data: Login): Observable<LoginResponse> {
        return this.post(`${this._endpoint}/login`, data, {
            withCredentials: true,
        });
    }

    verifyEmail(token: string): Observable<any> {
        return this.post(`${this._endpoint}/verify`, { token });
    }

    logout() {
        this.post(
            `${this._endpoint}/logout`,
            {},
            {
                withCredentials: true,
            },
        ).subscribe({
            complete: () => {
                this.handleLogout();
            },
            error: () => {
                this.handleLogout();
            },
        });
    }

    private handleLogout() {
        this.clearTokens();
        const currentUrl = this.router.url;
        const isProtected = PROTECTED_ROUTES.some((route) =>
            currentUrl.startsWith(route),
        );
        if (isProtected) {
            this.router.navigate(['/auth/login'], {
                queryParams: { returnUrl: currentUrl },
            });
        }
        this.isAuthenticatedSubject.next(false);
    }

    refreshToken(): Observable<RefreshTokenResponse> {
        return this.post<RefreshTokenResponse>(
            `${this._endpoint}/refresh-token`,
            {},
            {
                withCredentials: true,
            },
        );
    }

    resendEmail(email: string): Observable<any> {
        return this.post(
            `${this._endpoint}/resend-verification`,
            { email },
            { context: new HttpContext().set(SHOW_TOAST, true) },
        );
    }

    forgotPassword(email: string): Observable<any> {
        return this.post(
            `${this._endpoint}/forgot-password`,
            { email },
            { context: new HttpContext().set(SHOW_TOAST, true) },
        );
    }

    resetPassword(payload: ResetPasswordRequest): Observable<any> {
        return this.post(`${this._endpoint}/reset-password`, payload);
    }

    setTokens(accessToken: string) {
        localStorage.setItem(ACCESSTOKEN_KEY, accessToken);
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem(ACCESSTOKEN_KEY);
    }

    getAccessToken(): string | null {
        return localStorage.getItem(ACCESSTOKEN_KEY);
    }

    clearTokens(): void {
        localStorage.removeItem(ACCESSTOKEN_KEY);
        localStorage.removeItem('user');
    }

    isAccessTokenExpired(token: string): boolean {
        if (!token) return true;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000); // Thời gian hiện tại (giây)
        return payload.exp < now;
    }

    isAccessTokenValid(): boolean {
        const token = this.getAccessToken();
        return token !== null && !this.isAccessTokenExpired(token);
    }

    setAuthenticated(value: boolean) {
        this.isAuthenticatedSubject.next(value);
    }
}
