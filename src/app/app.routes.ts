import { Routes } from '@angular/router';
import { authGuard } from '../core/auth/auth.guard';
import { categoryExistsGuard } from '../core/layout/header/guards/category-exist.guard';
import { categoryMatcher } from '../core/layout/header/matchers/category.matcher';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    // {
    //     path: 'add-product',
    //     loadComponent: () =>
    //         import('./admin/product-form/product-form.component').then(
    //             (m) => m.ProductFormComponent,
    //         ),
    // },
    // {
    //     path: 'add-product-image',
    //     loadComponent: () =>
    //         import('./admin/product-image-form/product-image-form.component').then(
    //             (m) => m.ProductImageFormComponent,
    //         ),
    // },
    {
        path: 'home',
        loadComponent: () =>
            import('./featured/home/home.component').then(
                (m) => m.HomeComponent,
            ),
    },
    {
        path: 'shop',
        data: { isCategoryPage: false },
        loadComponent: () =>
            import('./featured/shop/shop.component').then(
                (m) => m.ShopComponent,
            ),
        title: 'PAGES.SHOP',
    },
    {
        path: 'editorial',
        loadComponent: () =>
            import('./featured/blog/blog-list/blog-list.component').then(
                (m) => m.BlogListComponent,
            ),
        title: 'PAGES.EDITORIAL',
    },
    {
        path: 'editorial/:slug',
        loadComponent: () =>
            import('./featured/blog/blog-post/blog-post.component').then(
                (m) => m.BlogPostComponent,
            ),
    },
    {
        path: 'contact',
        loadComponent: () =>
            import('./featured/contact/contact.component').then(
                (m) => m.ContactComponent,
            ),
        title: 'PAGES.CONTACT',
    },
    {
        path: 'cart',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./featured/cart/cart.component').then(
                (m) => m.CartComponent,
            ),
        title: 'PAGES.CART',
    },
    {
        path: 'wishlist',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./featured/wishlist/wishlist.component').then(
                (m) => m.WishlistComponent,
            ),
        title: 'PAGES.WISHLIST',
    },
    {
        path: 'checkout',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./featured/checkout/checkout.component').then(
                (m) => m.CheckoutComponent,
            ),
        title: 'PAGES.CHECKOUT',
    },
    {
        path: 'order-success',
        loadComponent: () =>
            import('./featured/checkout/order-success/order-success.component').then(
                (m) => m.OrderSuccessComponent,
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
                title: 'PAGES.REGISTER',
            },
            {
                path: 'login',
                loadComponent: () =>
                    import('./featured/auth/login/login.component').then(
                        (m) => m.LoginComponent,
                    ),
                title: 'PAGES.LOGIN',
            },
            {
                path: 'verify-email',
                loadComponent: () =>
                    import('./featured/auth/verify-email/verify-email.component').then(
                        (m) => m.VerifyEmailComponent,
                    ),
                title: 'PAGES.VERIFY_EMAIL',
            },
            {
                path: 'forgot-password',
                loadComponent: () =>
                    import('./featured/auth/forgot-password/forgot-password.component').then(
                        (m) => m.ForgotPasswordComponent,
                    ),
                title: 'PAGES.FORGOT_PASSWORD',
            },
            {
                path: 'reset-password',
                loadComponent: () =>
                    import('./featured/auth/reset-password/reset-password.component').then(
                        (m) => m.ResetPasswordComponent,
                    ),
                title: 'PAGES.RESET_PASSWORD',
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
        path: '404',
        loadComponent: () =>
            import('./featured/not-found/not-found.component').then(
                (m) => m.NotFoundComponent,
            ),
        title: 'PAGES.NOT_FOUND',
    },
    {
        matcher: categoryMatcher,
        canMatch: [categoryExistsGuard],
        data: { isCategoryPage: true },
        loadComponent: () =>
            import('./featured/shop/shop.component').then(
                (m) => m.ShopComponent,
            ),
    },
    {
        path: '**',
        redirectTo: '/not-found',
        pathMatch: 'full',
    },
];
