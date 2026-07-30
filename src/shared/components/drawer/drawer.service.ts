import { inject, Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DrawerComponent } from './drawer.component';
import { DRAWER_DATA, DrawerConfig } from './models/drawer.model';
import { DrawerRef } from './drawer-ref';
import { DRAWER_HEIGHT_MAP, DRAWER_WIDTH_MAP } from './drawer.constant';

@Injectable({
    providedIn: 'root',
})
export class DrawerService {
    private readonly overlay = inject(Overlay);
    private readonly injector = inject(Injector);

    open<TData = any, TResult = any>(
        config: DrawerConfig<TData>,
    ): DrawerRef<TResult> {
        const size = config.size || 'full';
        const position = config.position || 'left';
        const positionStrategy = this.overlay.position().global();

        // 1. Xác định vị trí neo (anchor) của panel trên màn hình
        if (position === 'left')
            positionStrategy.left('0').top('0').bottom('0');
        if (position === 'right')
            positionStrategy.right('0').top('0').bottom('0');
        if (position === 'top') positionStrategy.top('0').left('0').right('0');
        if (position === 'bottom')
            positionStrategy.bottom('0').left('0').right('0');

        // Kích thước cho panel
        let height = '100%';
        let width = '100%';
        const isHorizontal = position === 'left' || position === 'right';
        if (isHorizontal) {
            width = DRAWER_WIDTH_MAP[size];
        } else {
            height = DRAWER_HEIGHT_MAP[size];
        }

        // 2. Tạo cấu hình cho CDK Overlay
        const overlayConfig = new OverlayConfig({
            hasBackdrop: config.hasBackdrop ?? true,
            scrollStrategy: this.overlay.scrollStrategies.block(),
            backdropClass: 'cdk-overlay-dark-backdrop', // Class nền đen mờ mặc định của CDK
            positionStrategy,
            height,
            width,
        });

        const overlayRef = this.overlay.create(overlayConfig);
        const drawerRef = new DrawerRef<TResult>(overlayRef);

        // 3. Tạo Injector tùy chỉnh để truyền DrawerRef và DRAWER_DATA vào DrawerComponent
        const customInjector = Injector.create({
            providers: [
                { provide: DrawerRef, useValue: drawerRef },
                { provide: DRAWER_DATA, useValue: config },
            ],
            parent: this.injector,
        });
        drawerRef.customInjector = customInjector;

        // Lắng nghe sự kiện click vào Backdrop để tự động đóng (nếu cấu hình cho phép)
        if (config.closeOnBackdropClick !== false) {
            overlayRef.backdropClick().subscribe(() => drawerRef.close());
        }

        // 4. Gắn DrawerComponent vào lớp Overlay vừa tạo
        const portal = new ComponentPortal(
            DrawerComponent,
            null,
            customInjector,
        );
        overlayRef.attach(portal);

        return drawerRef;
    }
}
