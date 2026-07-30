import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { A11yModule } from '@angular/cdk/a11y';
import {
    ComponentPortal,
    Portal,
    PortalModule,
    TemplatePortal,
} from '@angular/cdk/portal';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DrawerRef } from './drawer-ref';
import { DRAWER_DATA, DrawerConfig } from './models/drawer.model';

@Component({
    selector: 'app-drawer',
    templateUrl: './drawer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PortalModule, A11yModule],
    host: {
        class: 'block h-full w-full',
    },
    animations: [
        trigger('slideInOut', [
            state('void', style({ transform: '{{transformStart}}' }), {
                params: { transformStart: 'translateX(100%)' },
            }),
            state('open', style({ transform: 'translate(0)' })),
            state('close', style({ transform: '{{transformStart}}' }), {
                params: { transformStart: 'translateX(100%)' },
            }),
            transition(
                'void => open',
                animate('250ms cubic-bezier(0.25, 0.8, 0.25, 1)'),
            ),
            transition(
                'open => close',
                animate('200ms cubic-bezier(0.25, 0.8, 0.25, 1)'),
            ),
        ]),
    ],
})
export class DrawerComponent {
    protected readonly drawerRef = inject(DrawerRef);
    protected readonly config = inject<DrawerConfig>(DRAWER_DATA);
    private readonly viewContainerRef = inject(ViewContainerRef);

    readonly position = signal(this.config.position || 'right');
    readonly animationState = signal<'void' | 'open' | 'close'>('void');

    private sub = new Subscription();

    readonly animationParams = computed(() => {
        const pos = this.position();
        let transformStart = 'translateX(100%)';

        if (pos === 'left') transformStart = 'translateX(-100%)';
        if (pos === 'top') transformStart = 'translateY(-100%)';
        if (pos === 'bottom') transformStart = 'translateY(100%)';

        return { value: this.animationState(), params: { transformStart } };
    });

    selectedPortal!: Portal<any>;

    ngOnInit() {
        // Kích hoạt trạng thái 'open' ngay khi component được render
        setTimeout(() => this.animationState.set('open'));

        // Lắng nghe tín hiệu đóng từ Service để chuyển đổi trạng thái Animation sang 'close' trước khi biến mất
        this.sub.add(
            this.drawerRef.afterClosed().subscribe(() => {
                this.animationState.set('close');
            }),
        );

        if (!this.config) return;
        const content = this.config.content;
        if (content instanceof TemplateRef) {
            this.selectedPortal = new TemplatePortal(
                content,
                this.viewContainerRef,
                {
                    $implicit: this.config.data,
                    drawerRef: this.drawerRef,
                },
            );
        } else {
            // 👉 NẾU NGƯỜI DÙNG TRUYỀN VÀO CLASS COMPONENT
            this.selectedPortal = new ComponentPortal(
                content,
                null,
                (this.drawerRef as any).customInjector,
            );
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
