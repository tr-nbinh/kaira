import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { CartItem } from '../models/cart.interface';
import { ApiResponse } from '../models/api-response.interface';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root',
})
export class WishlistService extends BaseService {
    private readonly _endpoint = 'wishlist';
    private wishlistItemCountSubject = new BehaviorSubject<number>(0);
    readonly wishlistItemCount$ = this.wishlistItemCountSubject.asObservable();
    private _isLoggedIn = false;

    constructor(http: HttpClient, private userService: UserService) {
        super(http);
        this.userService.isAuthenticated$.subscribe((isAuth) => {
            this._isLoggedIn = isAuth;
            if (isAuth) {
                this.getWishlistCounts();
            } else {
                this.updateWishlistCounts(0);
            }
        });
    }

    getWishlistItems(): Observable<CartItem[]> {
        return this.get(this._endpoint);
    }

    addToWishlist(variantId: number): Observable<ApiResponse<number>> {
        if (!this._isLoggedIn) {
            console.log(this._isLoggedIn)
            return throwError(() => new Error('Đăng nhập để sử dụng tính năng này'));
        }

        return this.post<ApiResponse<number>>(this._endpoint, {
            variantId,
        }).pipe(
            tap((res) => {
                if (res && res.data) {
                    this.updateWishlistCounts(res.data);
                }
            })
        );
    }

    removeFromWishlist(variantId: number): Observable<ApiResponse<number>> {
        return this.delete<ApiResponse<number>>(
            `${this._endpoint}/${variantId}`
        ).pipe(
            tap((res) => {
                if (res && (res.data || res.data == 0)) {
                    this.updateWishlistCounts(res.data || 0);
                }
            })
        );
    }

    getWishlistCounts() {
        if (!this.userService.isLoggedIn()) {
            this.updateWishlistCounts(0);
            return;
        }
        this.get<ApiResponse<number>>(`${this._endpoint}/item-count`)
            .pipe(
                tap((res) => {
                    if (res && res.data) {
                        this.updateWishlistCounts(res.data || 0);
                    }
                }),
                catchError((error) => {
                    console.error('Failed to fetch cart counts:', error);
                    this.updateWishlistCounts(0);
                    throw error;
                })
            )
            .subscribe();
    }

    updateWishlistCounts(itemCount: number) {
        this.wishlistItemCountSubject.next(itemCount);
    }
}
