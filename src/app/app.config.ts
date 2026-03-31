import {
    HTTP_INTERCEPTORS,
    HttpClient,
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ResponseInterceptor } from '../core/interceptors/response.interceptor';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LanguageInterceptor } from './interceptors/language.interceptor';
import { HttpLoaderFactory } from './translate-loader';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(
            routes,
            withInMemoryScrolling({
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
            }),
        ),
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LanguageInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ResponseInterceptor,
            multi: true,
        },
        provideAnimations(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }).providers!,
    ],
};
