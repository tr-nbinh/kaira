import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export const requestConfigInterceptor: HttpInterceptorFn = (req, next) => {
    const translateService = inject(TranslateService);
    const currentLang = translateService.currentLang || 'vi';

    const modifiedReq = req.clone({
        withCredentials: true,
        setHeaders: {
            'Accept-Language': currentLang,
        },
    });

    return next(modifiedReq);
};
