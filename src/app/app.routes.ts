import { Routes } from '@angular/router';
import { authGuard } from '../core/auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./featured/home/home.component').then(
                (m) => m.HomeComponent,
            ),
    },
    {
        path: 'shop',
        loadComponent: () =>
            import('./featured/shop/shop.component').then(
                (m) => m.ShopComponent,
            ),
    },
    {
        path: 'contact',
        loadComponent: () =>
            import('./featured/contact/contact.component').then(
                (m) => m.ContactComponent,
            ),
    },
    {
        path: 'cart',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./featured/cart/cart.component').then(
                (m) => m.CartComponent,
            ),
    },
    {
        path: 'wishlist',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./featured/wishlist/wishlist.component').then(
                (m) => m.WishlistComponent,
            ),
    },
    {
        path: 'checkout',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./featured/checkout/checkout.component').then(
                (m) => m.CheckoutComponent,
            ),
    },
    {
        path: 'products/:slug',
        loadComponent: () =>
            import('./featured/product-detail/product-detail.component').then(
                (m) => m.ProductDetailComponent,
            ),
    },
    {
        path: 'auth',
        children: [
            {
                path: 'register',
                loadComponent: () =>
                    import('./featured/auth/register/register.component').then(
                        (m) => m.RegisterComponent,
                    ),
            },
            {
                path: 'login',
                loadComponent: () =>
                    import('./featured/auth/login/login.component').then(
                        (m) => m.LoginComponent,
                    ),
            },
            {
                path: 'verify-email',
                loadComponent: () =>
                    import('./featured/auth/verify-email/verify-email.component').then(
                        (m) => m.VerifyEmailComponent,
                    ),
            },
            {
                path: 'forgot-password',
                loadComponent: () =>
                    import('./featured/auth/forgot-password/forgot-password.component').then(
                        (m) => m.ForgotPasswordComponent,
                    ),
            },
            {
                path: 'reset-password',
                loadComponent: () =>
                    import('./featured/auth/reset-password/reset-password.component').then(
                        (m) => m.ResetPasswordComponent,
                    ),
            },
        ],
    },
    {
        path: 'account',
        canActivate: [authGuard],
        loadChildren: () =>
            import('./featured/account/account.routes').then(
                (m) => m.ACCOUNT_ROUTES,
            ),
    },
    {
        path: 'not-found',
        loadComponent: () =>
            import('./nolayout/nolayout.component').then(
                (m) => m.NolayoutComponent,
            ),
        data: { title: 'COMMON.ERROR_404', desc: 'COMMON.ERROR_PAGE_DESC' },
    },
    {
        path: '**',
        redirectTo: '/not-found',
        pathMatch: 'full',
    },
];
