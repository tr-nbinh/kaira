import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RequireAuthService {
    private authService = inject(AuthService);
    private router = inject(Router);

    async execute<T>(action: () => Promise<T>): Promise<boolean> {
        if (!this.authService.currentUser()) {
            await this.router.navigate(['/auth/login'], {
                queryParams: {
                    returnUrl: this.router.url,
                },
            });

            return false;
        }

        action();
        return true;
    }
}
