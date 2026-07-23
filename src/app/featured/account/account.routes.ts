import { Routes } from '@angular/router';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';

export const ACCOUNT_ROUTES: Routes = [
    {
        path: '',
        component: ProfileInfoComponent,
        title: 'Thông tin cá nhân',
    },
    {
        path: 'order-history',
        component: OrderHistoryComponent,
        title: 'Lịch sử đơn hàng',
    },
    {
        path: 'order-history/:id', // URL xem chi tiết đơn: /account/order-history/7b2a9e14...
        component: OrderDetailComponent,
        title: 'Chi tiết đơn hàng',
    },
    // {
    //     path: 'profile',
    //     component: ProfileInfoComponent,
    //     title: 'Thông tin cá nhân',
    // },
];
