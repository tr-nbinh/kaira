import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { createHttpParamsFromObject } from '../../utils/http-params.helper';
import { ApiError, ApiResponse } from '../models/api-response.interface';
export interface HttpOptions {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    params?: HttpParams | { [param: string]: string | number | string[] };
    responseType?: 'json';
    observe?: 'body';
    repostProgress?: boolean;
    withCredentials?: boolean;
}

@Injectable()
export class BaseService {
    protected readonly apiUrl: string = environment.apiUrl;

    constructor(protected http: HttpClient) {}

    protected get<T>(
        path: string,
        param: any = {},
        options?: HttpOptions
    ): Observable<T> {
        return this.http
            .get<T>(`${this.apiUrl}/${path}`, {
                ...options,
                params: createHttpParamsFromObject(param),
            })
            .pipe(catchError(this.handleError));
    }

    protected post<T>(
        path: string,
        body: any | null,
        options?: HttpOptions
    ): Observable<T> {
        return this.http
            .post<T>(`${this.apiUrl}/${path}`, body, options)
            .pipe(catchError(this.handleError));
    }

    protected put<T>(
        path: string,
        body: any | null,
        options?: HttpOptions
    ): Observable<T> {
        return this.http
            .put<T>(`${this.apiUrl}/${path}`, body, options)
            .pipe(catchError(this.handleError));
    }

    protected patch<T>(
        path: string,
        body?: any,
        options?: HttpOptions
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

        if (error instanceof HttpErrorResponse) {
            status = error.status;
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
            raw: error,
        };

        return throwError(() => apiError);
    }
}
