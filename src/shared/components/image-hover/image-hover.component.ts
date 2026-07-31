import {
    ChangeDetectionStrategy,
    Component,
    input,
    signal,
} from '@angular/core';

@Component({
    selector: 'app-image-hover',
    templateUrl: './image-hover.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageHoverComponent {
    primary = input.required<string>();
    secondary = input.required<string>();
    alt = input.required<string>();

    readonly secondaryLoaded = signal(false);

    onMouseEnter() {
        if (!this.secondaryLoaded()) {
            this.secondaryLoaded.set(true);
        }
    }
}
