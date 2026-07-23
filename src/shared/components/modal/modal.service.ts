import { inject, Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ModalRef } from './modal-ref';
import { ModalComponent } from './modal.component';
import { ModalConfig, MODAL_DATA, ModalSize } from './modal.interface';

const MODAL_WIDTH: Record<ModalSize, string> = {
    sm: '28rem', // 448px
    md: '40rem', // 640px
    lg: '56rem', // 896px
    xl: '72rem', // 1152px
    full: 'calc(100vw - 2rem)',
};

@Injectable({ providedIn: 'root' })
export class ModalService {
    private readonly overlay = inject(Overlay);
    private readonly injector = inject(Injector);

    open<TData = any, TResult = any>(
        config: ModalConfig<TData>,
    ): ModalRef<TResult> {
        // Căn giữa màn hình toàn cục
        const positionStrategy = this.overlay
            .position()
            .global()
            .centerHorizontally()
            .centerVertically();

        const overlayConfig = new OverlayConfig({
            hasBackdrop: config.hasBackdrop ?? true,
            scrollStrategy: this.overlay.scrollStrategies.block(),
            backdropClass: 'cdk-overlay-dark-backdrop',
            positionStrategy,
            width: config.width ?? MODAL_WIDTH[config.size ?? 'md'],
            maxWidth: config.maxWidth ?? 'calc(100vw - 2rem)',
            maxHeight: config.maxHeight ?? 'calc(100vh - 2rem)',
        });

        const overlayRef = this.overlay.create(overlayConfig);
        const modalRef = new ModalRef<TResult>(overlayRef);

        // Tạo custom injector truyền cấu hình cho khung bọc và các component con
        const customInjector = Injector.create({
            providers: [
                { provide: ModalRef, useValue: modalRef },
                { provide: MODAL_DATA, useValue: config },
            ],
            parent: this.injector,
        });

        modalRef.customInjector = customInjector;

        // Xử lý sự kiện click backdrop để đóng
        if (config.closeOnBackdropClick !== false) {
            overlayRef.backdropClick().subscribe(() => modalRef.close());
        }

        // Xử lý sự kiện phím ESC để đóng
        overlayRef.keydownEvents().subscribe((event) => {
            if (event.key === 'Escape' && config.closeOnEsc !== false) {
                modalRef.close();
            }
        });

        // Gắn khung bọc ModalComponent lên màn hình
        const containerPortal = new ComponentPortal(
            ModalComponent,
            null,
            customInjector,
        );
        overlayRef.attach(containerPortal);

        return modalRef;
    }
}
