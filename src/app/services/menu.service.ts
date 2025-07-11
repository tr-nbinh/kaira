import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';
import { MenuItem } from '../models/menu.interface';

@Injectable({
    providedIn: 'root',
})
export class MenuService extends BaseService {
    private readonly _endpoint = 'menus';

    getMenu(): Observable<MenuItem[]> {
        return this.get(this._endpoint);
    }
}
