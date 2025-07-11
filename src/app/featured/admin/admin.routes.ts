import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

export const adminRoutes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'product',
                loadComponent: () =>
                    import(
                        './components/create-edit-product/create-edit-product.component'
                    ).then((m) => m.CreateEditProductComponent),
            },
            {
                path: 'color',
                loadComponent: () =>
                    import(
                        './components/create-edit-color/create-edit-color.component'
                    ).then((m) => m.CreateEditColorComponent),
            },
        ],
    },
];
