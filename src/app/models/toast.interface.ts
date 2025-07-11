export type ToastType =
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'primary'
    | 'secondary'
    | 'light'
    | 'dark'
    | 'error';

export type ToastPosition =
    | 'top-right'
    | 'top-left'
    | 'top-center'
    | 'bottom-right'
    | 'bottom-left'
    | 'bottom-center';

export interface Toast {
    id: string;
    message: string;
    title?: string;
    type?: ToastType;
    classname?: string;
    position?: ToastPosition;
    delay?: number; // Thời gian hiển thị toast bằng mili giây
}
