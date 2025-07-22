import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { RegisterRequest } from '../models/auth/register.interface';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Login } from '../models/auth/login.interface';
import { AuthResponse } from '../featured/auth/models/authResponse.interface';
import { User } from '../featured/auth/models/user.interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/api-response.interface';

const ACCESSTOKEN_KEY = 'accessToken';
const PENDING_VERIFY_EMAIL = 'pendingVerifyEmail';
const PROTECTED_ROUTES = ['/cart', '/wishlist', '/checkout'];

@Injectable({
    providedIn: 'root',
})
export class UserService extends BaseService {
    private readonly _endpoint = 'auth';
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(
        !!localStorage.getItem(ACCESSTOKEN_KEY)
    );
    isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(http: HttpClient, private router: Router) {
        super(http);
    }

    register(data: RegisterRequest): Observable<ApiResponse> {
        return this.post(`${this._endpoint}/register`, data);
    }

    login(data: Login): Observable<ApiResponse<AuthResponse>> {
        return this.post(`${this._endpoint}/login`, data, {
            withCredentials: true,
        });
    }

    logout() {
        this.post(`${this._endpoint}/logout`, null, {
            withCredentials: true,
        }).subscribe((res) => {
            this.clearTokens();
            const currentUrl = this.router.url;
            const isProtected = PROTECTED_ROUTES.some((route) =>
                currentUrl.startsWith(route)
            );
            if (isProtected) {
                this.router.navigate(['/auth/login'], {
                    queryParams: { returnUrl: currentUrl },
                });
            }
            this.isAuthenticatedSubject.next(false);
        });
    }

    refreshAccessToken(): Observable<ApiResponse<string>> {
        // accessToken
        return this.post<ApiResponse<string>>(
            `${this._endpoint}/refresh-token`,
            null,
            {
                withCredentials: true,
            }
        ).pipe(
            tap((res: ApiResponse<string>) => {
                if (res && res.data) {
                    this.setTokens(res.data);
                } else {
                    this.logout();
                }
            }),
            catchError((error) => {
                this.logout();
                return throwError(
                    () => new Error('Refresh token failed:', error)
                );
            })
        );
    }

    requestNewVerificationEmail(toEmail: string): Observable<ApiResponse> {
        return this.post(`${this._endpoint}/resend-verification`, {
            email: toEmail,
        });
    }

    requestNewResetEmail(toEmail: string): Observable<ApiResponse> {
        return this.post(`${this._endpoint}/forgot-password`, {
            email: toEmail,
        });
    }

    resetPassword(token: string, newPassword: string): Observable<ApiResponse> {
        return this.post(`${this._endpoint}/reset-password`, {
            password: newPassword,
            token,
        });
    }

    setTokens(accessToken: string) {
        localStorage.setItem(ACCESSTOKEN_KEY, accessToken);
    }

    setUser(user: User) {
        if (!user) return;
        localStorage.setItem('user', JSON.stringify(user));
    }

    setPendingVerifyEmail(email: string) {
        localStorage.setItem(PENDING_VERIFY_EMAIL, email);
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem(ACCESSTOKEN_KEY);
    }

    getAccessToken(): string | null {
        return localStorage.getItem(ACCESSTOKEN_KEY);
    }

    getUser(): any | null {
        const userString = localStorage.getItem('user');
        return userString ? JSON.parse(userString) : null;
    }

    getPendingVerifyEmail(): string | null {
        return localStorage.getItem(PENDING_VERIFY_EMAIL);
    }

    clearTokens(): void {
        localStorage.removeItem(ACCESSTOKEN_KEY);
        localStorage.removeItem('user');
    }

    clearPendingVerifyEmail() {
        localStorage.removeItem(PENDING_VERIFY_EMAIL);
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
