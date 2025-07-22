import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core'; // Nếu bạn dùng ngx-translate

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
    constructor(private translateService: TranslateService) {} // Hoặc service quản lý ngôn ngữ của bạn

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        const lang = this.translateService.currentLang || 'en'; // Lấy ngôn ngữ hiện tại, mặc định là 'en'

        const modifiedRequest = request.clone({
            setHeaders: {
                'Accept-Language': lang, // Thêm header Accept-Language
            },
        });
        return next.handle(modifiedRequest);
    }
}
