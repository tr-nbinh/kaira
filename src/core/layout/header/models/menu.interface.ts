export interface MenuItem {
    id: number;
    name: string;
    path: string;
    icon: string;
    order: number;
    submenus: MenuItem[];
}
