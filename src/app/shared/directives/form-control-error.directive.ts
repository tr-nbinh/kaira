import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Renderer2,
} from '@angular/core';
import { AbstractControl, FormGroupDirective, NgControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, merge, takeUntil } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { FORM_ERROR_MESSAGES } from '../constants/form-error-message.constant';

@Directive({
    selector: '[formControlError]',
})
export class FormControlErrorDirective
    extends BaseComponent
    implements OnInit, OnDestroy
{
    @Input() formControlError?: AbstractControl | undefined = undefined;
    @Input() errorMessages: { [key: string]: string } = {};

    private control!: AbstractControl;
    private errorElement: HTMLElement | null = null;
    private errorMessageOrigin = FORM_ERROR_MESSAGES;
    private hasBlurredOccurred = false;

    constructor(
        private el: ElementRef<HTMLElement>, // Tham chiếu đến element gốc (input)
        private renderer: Renderer2, // Dùng để thao tác DOM
        private ngControl: NgControl, // Inject NgControl để lấy FormControl tự động
        private translate: TranslateService,
        private host: FormGroupDirective,
    ) {
        super();
    }

    ngOnInit(): void {
        this.control = this.formControlError || this.ngControl.control!;
        merge(this.control.statusChanges, this.control.valueChanges)
            .pipe(debounceTime(100), takeUntil(this.ngUnsubscribe))
            .subscribe(() => {
                console.log(this.control);
                this.updateErrorState();
            });

        if (this.host) {
            this.host.ngSubmit
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe(() => {
                    // Đảm bảo chạy updateErrorState sau khi form đã được mark touched
                    this.updateErrorState();
                });
        }
    }

    override ngOnDestroy(): void {
        if (this.errorElement) {
            this.renderer.removeChild(
                this.el.nativeElement.parentNode,
                this.errorElement,
            );
        }
        super.ngOnDestroy();
    }

    @HostListener('blur') onBlur() {
        if (!this.hasBlurredOccurred) {
            this.updateErrorState();
            this.hasBlurredOccurred = true;
        }
    }

    private updateErrorState(): void {
        console.log(this.control);
        if (
            this.control.invalid &&
            (this.control.touched || this.control.dirty)
        ) {
            this.renderer.addClass(this.el.nativeElement, 'is-invalid');
            this.displayError();
        } else {
            this.renderer.removeClass(this.el.nativeElement, 'is-invalid');
        }
    }

    private displayError(): void {
        // Tìm lỗi đầu tiên trong danh sách lỗi của control
        const errors = this.control.errors;
        if (errors) {
            const firstErrorKey = Object.keys(errors)[0];
            const errorValue = errors[firstErrorKey];
            let translationKey =
                this.errorMessages[firstErrorKey] ||
                this.errorMessageOrigin[firstErrorKey];

            if (!translationKey) {
                if (typeof errorValue === 'string') {
                    this.renderError(errorValue); // Hàm helper bên dưới
                    return;
                }
                translationKey = firstErrorKey;
            }

            const params: { [key: string]: any } =
                typeof errorValue === 'object' ? errorValue : {};

            this.translate
                .get(translationKey, params)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe((translatedMessage: string) => {
                    this.renderError(translatedMessage);
                });
        }
    }

    private renderError(message: string): void {
        if (!this.errorElement) {
            this.errorElement = this.renderer.createElement('div');
            this.renderer.addClass(this.errorElement, 'invalid-feedback');
            this.renderer.insertBefore(
                this.el.nativeElement.parentNode,
                this.errorElement,
                this.el.nativeElement.nextSibling,
            );
        }
        this.renderer.setProperty(this.errorElement, 'innerText', message);
    }
}
