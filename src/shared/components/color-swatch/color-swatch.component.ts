import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
} from '@angular/core';
import { ColorOption } from '../../models/option.model';

@Component({
    selector: 'app-color-swatch',
    templateUrl: './color-swatch.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorSwatchComponent {
    options = input.required<ColorOption[]>();
    selectedOptionValue = input<ColorOption | null>(null);
    size = input<'sm' | 'md' | 'lg'>('md');
    sizeClasses = computed(() => {
        const size = this.size();
        switch (size) {
            case 'sm':
                return 'w-5 h-5';
            case 'lg':
                return 'w-9 h-9';
            case 'md':
                return `w-7 h-7`;
            default:
                return '';
        }
    });

    select = output<ColorOption>();
}
