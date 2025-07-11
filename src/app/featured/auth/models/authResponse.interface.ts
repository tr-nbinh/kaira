import { User } from './user.interface';

export interface AuthResponse {
    message: string;
    accessToken: string;
    refreshToken: string;
    user: User;
}
