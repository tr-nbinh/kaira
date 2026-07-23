import {
    HttpInterceptorFn,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '../../app/services/toast.service';
import { SHOW_TOAST } from '../token';
import { map } from 'rxjs';
import { ApiResponse } from '../../app/models/api-response.interface';

export const responseInterceptor: HttpInterceptorFn = (req, next) => {
    const toast = inject(ToastService);
    const showToast = req.context.get(SHOW_TOAST);

    return next(req).pipe(
        map((event) => {
            if (event instanceof HttpResponse) {
                const body = event.body as ApiResponse;
                if (body && body.success) {
                    if (body.message && showToast) {
                        toast.success(body.message);
                    }

                    if (body.data !== undefined) {
                        return event.clone({ body: body.data });
                    }
                }
                if (body && !body.success && body.message && showToast) {
                    toast.error(body.message);
                }
            }
            return event;
        }),
    );
};
