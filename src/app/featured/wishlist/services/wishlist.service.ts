import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { SHOW_TOAST } from '../../../../core/token';
import { BaseService } from '../../../base/base.service';
import { ApiResponse } from '../../../models/api-response.interface';
import { UserService } from '../../../services/user.service';
import {
    WishlistCountResponse,
    WishlistItem,
    WishlistToggleResponse,
} from '../models/wishlist.model';

@Injectable({
    providedIn: 'root',
})
export class WishlistService extends BaseService {
    private readonly _endpoint = 'wishlist';
    private wishlistCountSubject = new BehaviorSubject<number>(0);
    readonly wishlistItemCount$ = this.wishlistCountSubject.asObservable();
    private _isLoggedIn = false;

    constructor(
        http: HttpClient,
        private userService: UserService,
        private translate: TranslateService,
    ) {
        super(http);
        this.userService.isAuthenticated$.subscribe((isAuth) => {
            this._isLoggedIn = isAuth;
            if (isAuth) {
                this.getWishlistCount();
            } else {
                this.updateWishlistCounts(0);
            }
        });
    }

    getWishlistItems(): Observable<WishlistItem[]> {
        return this.get(this._endpoint);
    }

    addToWishlist(variantId: string): Observable<WishlistToggleResponse> {
        if (!this._isLoggedIn) {
            return throwError(
                () => new Error(this.translate.instant('COMMON.UNAUTHORIZED')),
            );
        }

        return this.post<WishlistToggleResponse>(
            this._endpoint,
            {
                variantId,
            },
            { context: new HttpContext().set(SHOW_TOAST, true) },
        ).pipe(
            tap((res) => {
                if (res) {
                    this.updateWishlistCounts(res.wishlistCount);
                }
            }),
        );
    }

    removeFromWishlist(variantId: string): Observable<ApiResponse<number>> {
        return this.delete<ApiResponse<number>>(
            `${this._endpoint}/${variantId}`,
        ).pipe(
            tap((res) => {
                if (res && (res.data || res.data == 0)) {
                    this.updateWishlistCounts(res.data || 0);
                }
            }),
        );
    }

    getWishlistCount() {
        this.get<WishlistCountResponse>(`${this._endpoint}/item-count`)
            .pipe(
                tap((res) => {
                    if (res) {
                        this.updateWishlistCounts(res.wishlistCount);
                    }
                }),
                catchError((error) => {
                    this.updateWishlistCounts(0);
                    throw error;
                }),
            )
            .subscribe();
    }

    updateWishlistCounts(itemCount: number) {
        this.wishlistCountSubject.next(itemCount);
    }
}
