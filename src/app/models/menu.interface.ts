export interface MenuItem {
    id: number;
    name: string;
    path: string;
    icon: string;
    order_index: number;
    submenus: SubmenuItem[];
}

export interface SubmenuItem {
    id: number;
    name: string;
    path: string;
    icon: string;
    order_index: number;
}
