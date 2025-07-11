import {
    Directive,
    EventEmitter,
    HostListener,
    Input,
    Output,
    OnDestroy,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../base/base.component';

@Directive({
    selector: '[appDebounceClick]',
})
export class DebounceClickDirective extends BaseComponent implements OnDestroy {
    @Input() debounceTimeMs: number = 500;
    @Input('appDebounceClick') debounceValue: any;
    @Output() debouncedClick = new EventEmitter<any>();

    private clickSubject = new Subject<any>();

    constructor() {
        super();
        this.clickSubject
            .pipe(
                debounceTime(this.debounceTimeMs),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((value) => {
                this.debouncedClick.emit(value);
            });
    }

    @HostListener('click')
    handleClick(): void {
        if (this.debounceValue) {
            this.clickSubject.next(this.debounceValue);
        }
    }
}
