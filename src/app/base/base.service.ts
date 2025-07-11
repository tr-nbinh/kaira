import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { createHttpParamsFromObject } from '../../utils/http-params.helper';
import { ApiResponse } from '../models/api-response.interface';

export interface HttpOptions {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    params?: HttpParams | { [param: string]: string | number | string[] };
    responseType?: 'json';
    observe?: 'body';
    repostProgress?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class BaseService {
    protected readonly apiUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) {}

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
        if (error.error instanceof ErrorEvent) {
            // Lỗi phía client (rất hiếm)
            message = error.error.message;
        } else if (error.error && typeof error.error === 'object') {
            const apiRes: ApiResponse = error.error;
            message = apiRes.message || `Lỗi hệ thống: ${JSON.stringify(error.error)} (status ${error.status})`;
        } else {
            message =
                error.message || `Lỗi không xác định (status ${error.status})`;
        }

        return throwError(() => new Error(message));
    }
}
