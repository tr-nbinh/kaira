import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
    provideRouter,
    withComponentInputBinding,
    withInMemoryScrolling,
} from '@angular/router';
import { coreProviders } from '../core/core.provider';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(
            routes,
            withInMemoryScrolling({
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
            }),
            withComponentInputBinding(),
        ),
        ...coreProviders,
    ],
};
