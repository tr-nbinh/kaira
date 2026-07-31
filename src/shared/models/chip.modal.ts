export interface Chip<T = string> {
    id: T;
    label: string;
    type?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    removable?: boolean;
    icon?: string;
}
