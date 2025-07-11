import {
    Directive,
    effect,
    EffectRef,
    Injector,
    Input,
    OnDestroy,
    runInInjectionContext,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { SpinnerComponent } from '../components/spinner/spinner.component';

@Directive({
    selector: '[appLoadingToggle]',
})
export class LoadingToggleDirective implements OnDestroy {
    private _loadingKey: string = '';
    private spinnerRef: any;
    private loadingEffectRef?: EffectRef;

    @Input('appLoadingToggle')
    set loadingKey(key: string) {
        if (key !== this._loadingKey) {
            this._loadingKey = key;
            this.showSpinner();
        }
    }

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private loadingService: LoadingService,
        private injector: Injector
    ) {}

    showSpinner() {
        this.loadingEffectRef = runInInjectionContext(this.injector, () => {
            return effect(() => {
                this.viewContainer.clear();
                const isLoading = this.loadingService.isLoading(
                    this._loadingKey
                );
                if (isLoading()) {
                    this.spinnerRef =
                        this.viewContainer.createComponent(SpinnerComponent);
                } else {
                    if (this.spinnerRef) {
                        this.spinnerRef.destroy();
                    }
                    this.viewContainer.createEmbeddedView(this.templateRef);
                }
            });
        });
    }

    ngOnDestroy(): void {
        if (this.loadingEffectRef) {
            this.loadingEffectRef.destroy();
        }
    }
}
