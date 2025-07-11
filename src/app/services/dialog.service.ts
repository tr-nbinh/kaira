import {
    Injectable,
    ViewContainerRef,
    TemplateRef,
    ComponentRef,
    inject,
} from '@angular/core';
import { DialogComponent } from '../shared/components/dialog/dialog.component';

@Injectable({ providedIn: 'root' })
export class DialogService {
    private viewContainerRef!: ViewContainerRef;
    private dialogStack: ComponentRef<any>[] = [];

    // cần gọi init() từ AppComponent hoặc root container
    init(vcRef: ViewContainerRef) {
        this.viewContainerRef = vcRef;
    }

    open(options: {
        title: string;
        body: TemplateRef<any>;
        onConfirm?: () => boolean | void;
        onCancel?: () => void;
    }) {
        const ref: ComponentRef<DialogComponent> =
            this.viewContainerRef.createComponent(DialogComponent);

        ref.instance.title = options.title;
        ref.instance.body = options.body;

        ref.instance.confirm.subscribe(() => {
            const isClose = options.onConfirm?.();
            if (isClose || isClose === undefined) {
                this.closeCurrent();
            }
        });

        ref.instance.cancel.subscribe(() => {
            options.onCancel?.();
            this.closeCurrent();
        });

        this.dialogStack.push(ref);
    }

    closeCurrent() {
        const current = this.dialogStack.pop();
        current?.destroy();
    }
}
