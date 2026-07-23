import { Component, computed, input, output } from '@angular/core';
import { Option } from '../../models/option.model';

@Component({
    selector: 'app-size-selector',
    templateUrl: './size-selector.component.html',
})
export class SizeSelectorComponent {
    options = input.required<Option[]>();
    selectedValue = input<Option | null>(null);
    size = input<'sm' | 'md' | 'lg'>('md');

    protected btnClasses = computed(() => {
        switch (this.size()) {
            case 'sm':
                return 'h-9 px-3 text-[10px] min-w-[55px]';
            case 'lg':
                return 'h-14 px-8 text-[12px] min-w-[90px]';
            case 'md':
            default:
                return 'h-12 px-6 text-[11px] min-w-[80px]';
        }
    });

    select = output<Option>();
}
