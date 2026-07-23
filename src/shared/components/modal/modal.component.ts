import {
    Component,
    inject,
    OnInit,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';
import {
    ComponentPortal,
    PortalModule,
    TemplatePortal,
    Portal,
} from '@angular/cdk/portal';
import { A11yModule } from '@angular/cdk/a11y';
import { ModalRef } from './modal-ref';
import { MODAL_DATA, ModalConfig } from './modal.interface';

@Component({
    selector: 'app-modal-container',
    imports: [PortalModule, A11yModule],
    templateUrl: './modal.component.html',
    styles: [
        `
            :host {
                display: block;
                width: 100%;
                height: 100%;
                animation: modalFadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)
                    forwards;
            }

            @keyframes modalFadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px) scale(0.98);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `,
    ],
})
export class ModalComponent implements OnInit {
    readonly modalRef = inject(ModalRef) as ModalRef<any>;
    readonly config = inject(MODAL_DATA) as ModalConfig;
    private readonly viewContainerRef = inject(ViewContainerRef);

    selectedPortal!: Portal<any>;
    readonly modalTitleId = `modal-title-${Math.random().toString(36).substring(2, 9)}`;

    ngOnInit() {
        const content = this.config.content;

        if (content instanceof TemplateRef) {
            this.selectedPortal = new TemplatePortal(
                content,
                this.viewContainerRef,
                {
                    $implicit: this.config.data,
                    modalRef: this.modalRef,
                },
            );
        } else {
            this.selectedPortal = new ComponentPortal(
                content,
                null,
                this.modalRef.customInjector,
            );
        }
    }
}
