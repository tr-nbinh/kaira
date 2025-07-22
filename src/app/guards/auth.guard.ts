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

    if (!userService.isLoggedIn()) {
        return router.createUrlTree(['/auth/login'], {
            queryParams: { returnUrl: state.url },
        });
    }

    if (userService.isLoggedIn() && userService.isAccessTokenValid()) {
        return true;
    }

    return userService.refreshAccessToken().pipe(
        map(() => true),
        catchError(() => {
            return of(
                router.createUrlTree(['/auth/login'], {
                    queryParams: { returnUrl: state.url },
                })
            );
        })
    );
};
