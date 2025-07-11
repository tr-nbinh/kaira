import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { RegisterRequest } from '../models/auth/register.interface';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Login } from '../models/auth/login.interface';
import { AuthResponse } from '../featured/auth/models/authResponse.interface';
import { User } from '../featured/auth/models/user.interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

const ACCESSTOKEN_KEY = 'accessToken';
const REFRESHTOKEN_KEY = 'refreshToken';
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

    register(data: RegisterRequest): Observable<any> {
        return this.post(`${this._endpoint}/register`, data);
    }

    login(data: Login): Observable<AuthResponse> {
        return this.post(`${this._endpoint}/login`, data).pipe(
            tap((res: any) => {
                if (res && res.accessToken && res.refreshToken) {
                    this.setTokens(res.accessToken, res.refreshToken);
                    this.setUser(res.user);
                    this.isAuthenticatedSubject.next(true);
                }
            })
        );
    }

    logout() {
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
    }

    refreshAccessToken(refreshToken: string): Observable<any> {
        return this.post(`${this._endpoint}/refresh-token`, {
            refreshToken,
        }).pipe(
            tap((res: any) => {
                if (res && res.accessToken && res.refreshToken) {
                    this.setTokens(res.accessToken, res.refreshToken);
                    this.isAuthenticatedSubject.next(true);
                } else {
                    console.error(
                        'Refresh token response missing tokens. Logging out.'
                    );
                    this.logout();
                }
            }),
            catchError((error) => {
                console.error('Refresh token failed:', error);
                this.logout();
                return throwError(
                    () => new Error('Refresh token failed:', error)
                );
            })
        );
    }

    setTokens(accessToken: string, refreshToken: string) {
        localStorage.setItem(ACCESSTOKEN_KEY, accessToken);
        localStorage.setItem(REFRESHTOKEN_KEY, refreshToken);
    }

    setUser(user: User) {
        if (!user) return;
        localStorage.setItem('user', JSON.stringify(user));
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem(ACCESSTOKEN_KEY);
    }

    getAccessToken(): string | null {
        return localStorage.getItem(ACCESSTOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESHTOKEN_KEY);
    }

    getUser(): any | null {
        const userString = localStorage.getItem('user');
        return userString ? JSON.parse(userString) : null;
    }

    clearTokens(): void {
        localStorage.removeItem(ACCESSTOKEN_KEY);
        localStorage.removeItem(REFRESHTOKEN_KEY);
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
}
