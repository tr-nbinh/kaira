import { inject } from '@angular/core';
import {
    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../../../../../core/auth/auth.service';
import { catchError, map, Observable, of, switchMap, take, timer } from 'rxjs';

export function emailExistsValidator(): AsyncValidatorFn {
    const authService = inject(AuthService);

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const email = control.value;
        if (!email) return of(null);

        return timer(500).pipe(
            switchMap(() => {
                return authService.checkEmailExists(control.value).pipe(
                    map((res) => {
                        return res.isExists ? { emailExists: true } : null;
                    }),
                    catchError((error) => {
                        return of(null);
                    }),
                );
            }),
        );

        authService.checkEmailExists(email).pipe(
            map((res) => (res.isExists ? { emailExists: true } : null)),
            catchError(() => of(null)),
        );
    };
}
