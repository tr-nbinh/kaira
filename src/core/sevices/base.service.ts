import {
    HttpClient,
    HttpContext,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { createHttpParamsFromObject } from '../../utils/http-params.helper';
import { HttpCacheService } from '../cache/http-cache.service';
import { ApiError } from '../../shared/models/api-response.model';
export interface HttpOptions {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    params?: HttpParams | { [param: string]: string | number | string[] };
    responseType?: 'json';
    observe?: 'body';
    reportProgress?: boolean;
    withCredentials?: boolean;
    context?: HttpContext;
}

@Injectable()
export abstract class BaseService {
    protected readonly http = inject(HttpClient);
    private cacheService = inject(HttpCacheService);

    protected readonly apiUrl: string = environment.apiUrl;

    protected get<T>(
        path: string = '',
        param: any = {},
        options?: HttpOptions & { cacheKey?: string; ttl?: number },
    ): Observable<T> {
        const request$ = this.http
            .get<T>(`${this.apiUrl}/${path}`, {
                ...options,
                params: createHttpParamsFromObject(param),
            })
            .pipe(catchError(this.handleError));

        // 🔥 NẾU CÓ TRUYỀN CACHE KEY -> Đẩy qua máy lọc của Cache Service
        if (options?.cacheKey) {
            return this.cacheService.cacheRequest(
                options.cacheKey,
                request$,
                options.ttl,
            );
        }

        return request$;
    }

    protected post<T>(
        path: string = '',
        body: any | null = null,
        options?: HttpOptions,
    ): Observable<T> {
        return this.http
            .post<T>(`${this.apiUrl}/${path}`, body, options)
            .pipe(catchError(this.handleError));
    }

    protected put<T>(
        path: string,
        body: any | null,
        options?: HttpOptions,
    ): Observable<T> {
        return this.http
            .put<T>(`${this.apiUrl}/${path}`, body, options)
            .pipe(catchError(this.handleError));
    }

    protected patch<T>(
        path: string = '',
        body?: any,
        options?: HttpOptions,
    ): Observable<T> {
        return this.http
            .patch<T>(`${this.apiUrl}/${path}`, body, options)
            .pipe(catchError(this.handleError));
    }

    protected delete<T>(path: string, options?: HttpOptions): Observable<T> {
        return this.http
            .delete<T>(`${this.apiUrl}/${path}`, options)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: any): Observable<never> {
        let message = 'Đã có lỗi xảy ra.';
        let data: any = null;
        let status: number | undefined = undefined;
        let code: string | undefined = undefined;

        if (error instanceof HttpErrorResponse) {
            status = error.status;
            code = error.error?.code;
            // Lỗi mạng (không kết nối được server)
            if (error.status === 0) {
                message = 'Không thể kết nối đến máy chủ.';
            }
            // Lỗi chuẩn từ API (có success: false, message, data)
            else if (error.error && typeof error.error === 'object') {
                const errRes = error.error;
                message = errRes.message || message;
                data = errRes.data ?? null;
            }
            // Lỗi trả về string
            else if (typeof error.error === 'string') {
                message = error.error;
            }
        }
        // Lỗi phía client (lập trình, JS, lỗi local)
        else if (error.error instanceof ErrorEvent) {
            message = error.error.message;
        }
        // Các lỗi không xác định
        else {
            message = error?.message || message;
        }
        const apiError: ApiError<any> = {
            message,
            status,
            data,
            code,
            raw: error,
        };

        return throwError(() => apiError);
    }
}
