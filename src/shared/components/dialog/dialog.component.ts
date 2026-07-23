import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
    Component,
    ComponentRef,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
    Type,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IDialogContent } from './dialog-content.interface';

@Component({
    selector: 'app-dialog',
    imports: [TranslatePipe],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
})
export class DialogComponent {
    @Input() title: string = '';
    @Input() confirmText?: string;
    @Input() cancelText?: string;
    @Input() bodyComponent!: any; // Nhận class của Component con từ Service truyền sang

    @Output() cancel = new EventEmitter<void>();
    @Output() confirm = new EventEmitter<any>();

    @ViewChild('dynamicContent', { read: ViewContainerRef, static: true })
    dynamicVcr!: ViewContainerRef;

    private childComponentRef!: ComponentRef<IDialogContent>;

    // click ra ngoài = cancel
    onBackdropClick() {
        this.cancel.emit();
    }

    ngOnInit() {
        this.dynamicVcr.clear();
        // Tự tay vẽ component con vào đúng điểm neo
        this.childComponentRef = this.dynamicVcr.createComponent(
            this.bodyComponent,
        );
    }

    handleConfirm() {
        const childInstance = this.childComponentRef.instance;
        // Nếu thằng con có triển khai IDialogContent và có hàm xử lý submit
        if (
            childInstance &&
            typeof childInstance.onDialogSubmit === 'function'
        ) {
            const result = childInstance.onDialogSubmit();
            // Nếu con trả về false (nghĩa là Form invalid), chặn đứng không đóng Dialog
            if (result === false) {
                return;
            }

            // Nếu hợp lệ, lấy kết quả (Data Form, String, Array...) bắn thẳng ra ngoài
            this.confirm.emit(result);
        } else {
            // Trường hợp Dialog tĩnh, không có form/dữ liệu gì (Ví dụ Dialog alert thông báo thuần)
            this.confirm.emit(true);
        }
    }
}
