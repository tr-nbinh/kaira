import {
    HttpClient,
    provideHttpClient,
    withInterceptors,
} from '@angular/common/http';
import { inject, provideAppInitializer } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { authInterceptor } from './interceptors/auth.interceptor';
import { requestConfigInterceptor } from './interceptors/request-config.interceptor';
import { responseInterceptor } from './interceptors/response.interceptor';
import { CartStore } from './stores/cart.store';
import { WishlistStore } from './stores/wishlist.store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app/translate-loader';
import { TitleStrategy } from '@angular/router';
import { CustomTitleStrategy } from './strategies/custom-title.strategy';

export const coreProviders = [
    provideAppInitializer(async () => {
        const authService = inject(AuthService);
        const wislistStore = inject(WishlistStore);
        const cartStore = inject(CartStore);
        await firstValueFrom(authService.checkAuthStatus());
        if (authService.currentUser()) {
            cartStore.loadCount();
            wislistStore.loadCount();
        }
    }),
    provideHttpClient(
        withInterceptors([
            requestConfigInterceptor,
            responseInterceptor,
            authInterceptor,
        ]),
    ),
    // provideCloudinaryLoader('https://res.cloudinary.com/dt9djaztc'),
    provideAnimations(),
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
        },
    }).providers!,
    {
        provide: TitleStrategy,
        useClass: CustomTitleStrategy,
    },
];
