import { Injectable, signal } from '@angular/core';
import { Toast, ToastPosition, ToastType } from '../models/toast.interface';
import { uuidv4 } from '../../utils/uuid.util';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private readonly _toasts = signal<Toast[]>([]);
    readonly toasts = this._toasts.asReadonly();

    show(
        message: string,
        title = '',
        type: ToastType = 'info',
        config: { delay?: number; position?: ToastPosition } = {}
    ) {
        const toast: Toast = {
            id: uuidv4(),
            message,
            title,
            type,
            delay: config.delay ?? 3000,
            position: config.position ?? 'top-right',
        };

        this._toasts.update((toasts) => [...toasts, toast]);

        // Auto remove after timeout
        setTimeout(() => this.remove(toast.id), toast.delay);
    }

    remove(id: string) {
        this._toasts.update((toasts) => toasts.filter((t) => t.id !== id));
    }

    clear() {
        this._toasts.set([]);
    }

    success(message: string, title = '', config?: Partial<Omit<Toast, 'id'>>) {
        this.show(message, title, 'success', config);
    }

    error(message: string, title = '', config?: Partial<Omit<Toast, 'id'>>) {
        this.show(message, title, 'error', config);
    }

    info(message: string, title = '', config?: Partial<Omit<Toast, 'id'>>) {
        this.show(message, title, 'info', config);
    }

    warning(message: string, title = '', config?: Partial<Omit<Toast, 'id'>>) {
        this.show(message, title, 'warning', config);
    }

    getToastsByPosition(position: ToastPosition): Toast[] {
        return this._toasts().filter((t) => t.position === position);
    }

    getAllPositions(): ToastPosition[] {
        return [
            'top-left',
            'top-center',
            'top-right',
            'bottom-left',
            'bottom-center',
            'bottom-right',
        ];
    }
}
