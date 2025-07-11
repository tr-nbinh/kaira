import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { Observable } from 'rxjs';

interface ColorCreation {
    hexCode: string;
    translations: { languageCode: string; name: string }[];
}

@Injectable({
    providedIn: 'root',
})
export class ColorService extends BaseService {
    private readonly _endpoint = 'colors';

    createColor(color: ColorCreation): Observable<any> {
        return this.post(this._endpoint, color);
    }
}
