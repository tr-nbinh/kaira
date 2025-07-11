import { CommonModule } from '@angular/common';
import { Component, HostBinding, inject } from '@angular/core';
import { ToastPosition } from '../../../models/toast.interface';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-toast',
    imports: [CommonModule],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.scss',
})
export class ToastComponent {
    readonly toastService = inject(ToastService);

    @HostBinding('class') get hostClasses(): string {
        return `toast-container position-fixed p-3 top-0 end-0`;
    }

    @HostBinding('style.z-index') zIndex = 1200;

    getPositionClass(pos: ToastPosition): string {
        switch (pos) {
            case 'top-left':
                return 'top-0 start-0';
            case 'top-center':
                return 'top-0 start-50 translate-middle-x';
            case 'bottom-left':
                return 'bottom-0 start-0';
            case 'bottom-center':
                return 'bottom-0 start-50 translate-middle-x';
            case 'bottom-right':
                return 'bottom-0 end-0';
            default:
                return 'top-0 end-0'; // top-right
        }
    }
}
