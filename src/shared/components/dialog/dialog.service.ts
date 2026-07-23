import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { DialogComponent } from './dialog.component';

interface DialogOptions {
    title: string;
    body: any; // Truyền Class của Component con vào đây (Ví dụ: AddressFormComponent)
    confirmText?: string;
    cancelText?: string;
    onConfirm?: (data: any) => void; // Callback nhận dữ liệu sạch trả về
    onCancel?: () => void;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
    private viewContainerRef!: ViewContainerRef;
    private dialogStack: ComponentRef<DialogComponent>[] = [];

    // cần gọi init() từ AppComponent hoặc root container
    init(vcRef: ViewContainerRef) {
        this.viewContainerRef = vcRef;
    }

    open(options: DialogOptions) {
        const ref = this.viewContainerRef.createComponent(DialogComponent);

        ref.instance.title = options.title;
        ref.instance.bodyComponent = options.body;
        if (options.confirmText) ref.instance.confirmText = options.confirmText;
        if (options.cancelText) ref.instance.cancelText = options.cancelText;

        ref.instance.confirm.subscribe((dataClean) => {
            options.onConfirm?.(dataClean); // Trả data sạch về nơi gọi ban đầu
            this.closeCurrent(); // Dữ liệu chuẩn rồi thì tự động đóng Dialog
        });

        ref.instance.cancel.subscribe(() => {
            options.onCancel?.();
            this.closeCurrent();
        });

        this.dialogStack.push(ref);
        return ref;
    }

    closeCurrent() {
        const current = this.dialogStack.pop();
        current?.destroy();
    }
}
