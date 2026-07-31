import { OverlayRef } from '@angular/cdk/overlay';
import { Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export abstract class BaseOverlayRef<TResult = any> {
    protected readonly _afterClosed = new Subject<TResult | undefined>();
    customInjector?: Injector;

    constructor(protected readonly overlayRef: OverlayRef) {
        this.overlayRef.detachments().subscribe(() => {
            this._afterClosed.next(undefined);
            this._afterClosed.complete();
        });
    }

    close(result?: TResult): void {
        this._afterClosed.next(result);
        this._afterClosed.complete();
        this.overlayRef.dispose();
    }

    afterClosed(): Observable<TResult | undefined> {
        return this._afterClosed.asObservable();
    }
}
