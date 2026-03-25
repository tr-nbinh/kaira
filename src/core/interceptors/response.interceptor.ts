import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../app/models/api-response.interface';
import { SHOW_TOAST } from '../token';
import { ToastService } from '../../app/services/toast.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
    constructor(private toast: ToastService) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        const showToast = request.context.get(SHOW_TOAST);
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    const body = event.body as ApiResponse;

                    if (body && body.success) {
                        if (body.message && showToast) {
                            this.toast.success(body.message);
                        }

                        if (body.data !== undefined) {
                            return event.clone({ body: body.data });
                        }
                    }

                    if (body && !body.success && body.message && showToast) {
                        this.toast.error(body.message);
                    }
                }
                return event;
            }),
        );
    }
}
