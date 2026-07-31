import { Component, computed, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ControlErrorPipe } from '../../pipes/control-error.pipe';
import { BaseControlValueAccessor } from '../base-control-value-accessor';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    imports: [TranslatePipe, ControlErrorPipe],
})
export class InputComponent extends BaseControlValueAccessor<string> {
    type = input<'text' | 'password' | 'email'>('text');
    placeholder = input<string>('');
    autocomplete = input<string>('');
    id = input<string>('');

    protected readonly showPassword = signal(false);
    protected readonly inputType = computed(() => {
        if (this.type() !== 'password') {
            return this.type();
        }

        return this.showPassword() ? 'text' : 'password';
    });

    onInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.value.set(value);
        this.onChange(value);
    }

    togglePassword(): void {
        this.showPassword.update((value) => !value);
    }
}
