import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { BaseService } from '../../core/sevices/base.service';
import {
    ToggleWishlistResponse,
    WishlistCountResponse,
    WishlistItem,
} from '../models/wishlist.model';
import { ListResponse } from '../../shared/models/list-repsonse.model';
import { PaginatedRequest } from '../../shared/models/pagination.model';

@Injectable({
    providedIn: 'root',
})
export class WishlistService extends BaseService {
    private readonly _endpoint = 'wishlist';

    getWishlistCount(): Observable<WishlistCountResponse> {
        return this.get(`${this._endpoint}/item-count`);
    }

    toggle(variantId: string): Observable<ToggleWishlistResponse> {
        return this.post(this._endpoint, { variantId });
    }

    getWishlistItems(
        paging: PaginatedRequest,
    ): Observable<ListResponse<WishlistItem>> {
        return this.get(this._endpoint, paging);
    }
}
