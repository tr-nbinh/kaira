import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

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
        path: 'blog',
        loadComponent: () =>
            import('./featured/blog/blog.component').then(
                (m) => m.BlogComponent,
            ),
    },
    {
        path: 'blog/:slug',
        loadComponent: () =>
            import('./featured/blog/pages/blog-detail/blog-detail.component').then(
                (m) => m.BlogDetailComponent,
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
                    import('./featured/auth/pages/register/register.component').then(
                        (m) => m.RegisterComponent,
                    ),
            },
            {
                path: 'login',
                loadComponent: () =>
                    import('./featured/auth/pages/login/login.component').then(
                        (m) => m.LoginComponent,
                    ),
            },
            {
                path: 'verify-email',
                loadComponent: () =>
                    import('./featured/auth/pages/verify-email/verify-email.component').then(
                        (m) => m.VerifyEmailComponent,
                    ),
            },
            {
                path: 'confirm-email',
                loadComponent: () =>
                    import('./featured/auth/pages/confirm-email/confirm-email.component').then(
                        (m) => m.ConfirmEmailComponent,
                    ),
            },
            {
                path: 'forgot-password',
                loadComponent: () =>
                    import('./featured/auth/pages/forgot-password/forgot-password.component').then(
                        (m) => m.ForgotPasswordComponent,
                    ),
            },
            {
                path: 'reset-password',
                loadComponent: () =>
                    import('./featured/auth/pages/reset-password/reset-password.component').then(
                        (m) => m.ResetPasswordComponent,
                    ),
            },
        ],
    },
    {
        path: 'order-success',
        async loadComponent() {
            const m =
                await import('./featured/checkout/order-success/order-success.component');
            return m.OrderSuccessComponent;
        },
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
