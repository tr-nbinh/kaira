import { User } from './user.interface';

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterResponse {
    email: string;
    isVerified: boolean;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface ResendEmailErrorResponse {
    retryAfter: number;
}

export interface RefreshTokenResponse {
    accessToken: string;
}

export interface LoginResponse {
    accessToken: string;
}
