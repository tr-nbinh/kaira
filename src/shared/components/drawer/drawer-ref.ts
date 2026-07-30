import { Observable, Subject } from 'rxjs';
import { BaseOverlayRef } from '../../overlay/base-overlay-ref';

export class DrawerRef<
    TResult = any,
    TEvent = any,
> extends BaseOverlayRef<TResult> {
    protected readonly _events = new Subject<TEvent>();

    emit(event: TEvent): void {
        this._events.next(event);
    }

    events(): Observable<TEvent> {
        return this._events.asObservable();
    }
}
