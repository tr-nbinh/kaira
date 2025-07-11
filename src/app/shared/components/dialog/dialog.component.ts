import { CommonModule } from '@angular/common';
import {
    Component,
    ContentChild,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
} from '@angular/core';

@Component({
    selector: 'app-dialog',
    imports: [CommonModule],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
})
export class DialogComponent {
    @Input() title: string = '';
    @Output() cancel = new EventEmitter<void>();
    @Output() confirm = new EventEmitter<void>();
    @ContentChild('body', { static: true }) body!: TemplateRef<any>;

    // click ra ngoài = cancel
    onBackdropClick() {
        this.cancel.emit();
    }
}
