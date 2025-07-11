import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    GuardResult,
    MaybeAsync,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../services/user.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): MaybeAsync<GuardResult> => {
    const userService = inject(UserService);
    const router = inject(Router);
    if (userService.isLoggedIn() && userService.isAccessTokenValid()) {
        return true;
    }

    const refreshToken = userService.getRefreshToken();

    if (refreshToken) {
        return userService.refreshAccessToken(refreshToken).pipe(
            map(() => true),
            catchError(() =>
                of(
                    router.createUrlTree(['/auth/login'], {
                        queryParams: { returnUrl: state.url },
                    })
                )
            )
        );
    }

    return router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url },
    });
};
