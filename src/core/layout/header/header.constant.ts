import { MenuItem } from './models/menu.interface';

export const GUEST_ACCOUNT_MENU: MenuItem[] = [
    {
        name: 'AUTH.SIGN_IN',
        path: '/auth/login',
        id: 1,
        icon: '',
        order: 0,
        submenus: [],
    },
    {
        name: 'AUTH.CREATE_ACCOUNT',
        path: '/auth/register',
        id: 2,
        icon: '',
        order: 0,
        submenus: [],
    },
];

export const USER_ACCOUNT_MENU: MenuItem[] = [
    {
        name: 'USER.MY_ACCOUNT',
        path: '/account',
        id: 1,
        icon: '',
        order: 0,
        submenus: [],
    },
    {
        name: 'USER.MY_PURCHASE',
        path: '/account/order-history',
        id: 2,
        icon: '',
        order: 0,
        submenus: [],
    },
];
