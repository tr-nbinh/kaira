import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MapService extends BaseService {
    protected override readonly apiUrl = 'api-nominatim';

    getCoordinates(address: string): Observable<any[]> {
        return this.get<any[]>(
            `search?q=${encodeURIComponent(address)}&format=json`
        );
    }
}
