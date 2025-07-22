import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BaseCacheService {
    private cacheMap = new Map<string, any>();

    cacheRequest<T>(
        key: string,
        request$: Observable<T>
    ): Observable<T> {
        if (this.cacheMap.has(key)) {
            return of(this.cacheMap.get(key));
        }

        return request$.pipe(tap((data) => this.cacheMap.set(key, data)));
    }

    clearCache(key?: string): void {
        if (key) {
            this.cacheMap.delete(key);
        } else {
            this.cacheMap.clear();
        }
    }
}
