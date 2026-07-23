import { Injectable } from '@angular/core';
import { BaseService } from '../../core/sevices/base.service';
import { Observable } from 'rxjs';
import { MenuItem } from '../../core/layout/header/models/menu.interface';

@Injectable({
    providedIn: 'root',
})
export class MenuService extends BaseService {
    private readonly _endpoint = 'menus';

    getMenu(): Observable<MenuItem[]> {
        return this.get(this._endpoint, {}, { cacheKey: 'menus:list' });
    }
}
