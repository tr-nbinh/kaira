// loading.service.ts
import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
    private _loadingMap = signal(new Map<string, boolean>());

    isLoading(key: string) {
        return computed(() => this._loadingMap().get(key) || false);
    }

    show(key: string) {
        this._loadingMap.update((map) => new Map(map).set(key, true));
    }

    hide(key: string) {
        this._loadingMap.update((map) => new Map(map).set(key, false));
    }

    toggle(key: string, loading: boolean) {
        this._loadingMap.update((map) => new Map(map).set(key, loading));
    }

    clear() {
        this._loadingMap.set(new Map());
    }
}
