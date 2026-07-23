import {
    AfterViewInit,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
    viewChild,
} from '@angular/core';
import Splide, { Options } from '@splidejs/splide';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
})
export class SliderComponent implements AfterViewInit {
    private destroyRef = inject(DestroyRef);

    options = input<Options>({});
    rootEl = viewChild<ElementRef<HTMLElement>>('root');

    private splide!: Splide;

    ngAfterViewInit() {
        const element = this.rootEl()?.nativeElement;
        if (!element) return;

        this.splide = new Splide(element, {
            type: 'loop',
            speed: 800,
            arrows: true,
            pagination: true,
            ...this.options(),
        });

        this.splide.mount();

        this.destroyRef.onDestroy(() => {
            if (this.splide) {
                this.splide.destroy();
            }
        });
    }

    /**
     * Mẹo nâng cao: Hàm helper giúp các component cha có thể gọi để refresh slider nếu cần
     */
    public refreshSlider() {
        if (this.splide) {
            this.splide.refresh();
        }
    }
}
