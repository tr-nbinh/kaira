import { NgTemplateOutlet } from '@angular/common';
import {
    Component,
    ContentChild,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-dialog',
    imports: [NgTemplateOutlet, TranslatePipe],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
})
export class DialogComponent {
    @Input() title: string = '';
    @Input() confirmText?: string;
    @Input() cancelText?: string;
    @Output() cancel = new EventEmitter<void>();
    @Output() confirm = new EventEmitter<void>();
    @ContentChild('body', { static: true }) body!: TemplateRef<any>;

    // click ra ngoài = cancel
    onBackdropClick() {
        this.cancel.emit();
    }
}
