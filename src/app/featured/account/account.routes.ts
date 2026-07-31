import { Routes } from '@angular/router';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';

export const ACCOUNT_ROUTES: Routes = [
    {
        path: '',
        component: ProfileInfoComponent,
        title: 'PAGES.PROFILE',
    },
    {
        path: 'order-history',
        component: OrderHistoryComponent,
        title: 'PAGES.ORDER_HISTORY',
    },
    {
        path: 'order-history/:id', // URL xem chi tiết đơn: /account/order-history/7b2a9e14...
        component: OrderDetailComponent,
        title: 'Chi tiết đơn hàng',
    },
];
