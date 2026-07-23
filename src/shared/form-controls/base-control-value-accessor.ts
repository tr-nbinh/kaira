import {
    ChangeDetectorRef,
    DestroyRef,
    Directive,
    inject,
    Injector,
    input,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    ControlValueAccessor,
    NgControl,
    ValidationErrors,
} from '@angular/forms';
import { ErrorMessageFactory } from '../pipes/control-error.pipe';

@Directive()
export abstract class BaseControlValueAccessor<
    T,
> implements ControlValueAccessor {
    private cdr = inject(ChangeDetectorRef);
    private destroyRef = inject(DestroyRef);
    private injector = inject(Injector);

    ngControl!: NgControl;
    value = signal<T | null>(null);
    disabled = signal(false);

    customErrorMessages = input<Record<string, ErrorMessageFactory>>({});
    externalErrors = input<ValidationErrors | null>(null);

    constructor() {
        this.ngControl = this.injector.get(NgControl, null, {
            self: true,
            optional: true,
        })!;
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
            this.ngControl.control?.statusChanges
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => {
                    this.cdr.markForCheck();
                });
        }
    }

    get errors(): ValidationErrors | null {
        const internal = this.ngControl?.errors || null;
        const external = this.externalErrors();

        if (!internal && !external) return null;
        return { ...internal, ...external };
    }

    get isInvalid(): boolean {
        return !!(
            (this.ngControl?.invalid || this.externalErrors()) &&
            (this.ngControl?.touched || this.ngControl?.dirty)
        );
    }

    get isPending(): boolean {
        return this.ngControl?.control?.pending ?? false;
    }

    onChange: (value: T) => void = () => {};
    onTouched: () => void = () => {};

    writeValue(value: T): void {
        this.value.set(value);
    }

    registerOnChange(fn: (value: T) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }
}
