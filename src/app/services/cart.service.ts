import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    catchError,
    Observable,
    take,
    tap,
    throwError,
} from 'rxjs';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { CartItem } from '../models/cart.interface';
import { ApiResponse } from '../models/api-response.interface';

@Injectable({
    providedIn: 'root',
})
export class CartService extends BaseService {
    private readonly _endpoint = 'cart';
    private cartItemCountSubject = new BehaviorSubject<number>(0);
    readonly cartItemCount$ = this.cartItemCountSubject.asObservable();
    private _isLoggedIn = false;

    constructor(http: HttpClient, private userService: UserService) {
        super(http);
        this.userService.isAuthenticated$.subscribe((isAuth) => {
            this._isLoggedIn = isAuth;
            if (isAuth) {
                this.getCartCounts();
            } else {
                this.updateCartCounts(0);
            }
        });
    }

    getCartItems(): Observable<CartItem[]> {
        return this.get(this._endpoint);
    }

    addToCart(
        variantId: number,
        quantity: number = 1
    ): Observable<ApiResponse<number>> {
        if (!this._isLoggedIn) {
            console.log(this._isLoggedIn);
            return throwError(
                () => new Error('Đăng nhập để sử dụng tính năng này')
            );
        }
        return this.post<ApiResponse<number>>(this._endpoint, {
            variantId,
            quantity,
        }).pipe(
            tap((res) => {
                if (res && (res.data || res.data == 0)) {
                    this.updateCartCounts(res.data);
                }
            })
        );
    }

    removeFromCart(variantId: number): Observable<ApiResponse<number>> {
        return this.delete<ApiResponse<number>>(
            `${this._endpoint}/${variantId}`
        ).pipe(
            tap((res) => {
                if (res && (res.data || res.data == 0)) {
                    this.updateCartCounts(res.data);
                }
            })
        );
    }

    updateQuantityInCart(variantId: number, quantity: number): Observable<any> {
        return this.patch(`${this._endpoint}/${variantId}`, { quantity });
    }

    getCartCounts() {
        if (!this.userService.isLoggedIn()) {
            this.updateCartCounts(0);
            return;
        }
        this.get<ApiResponse<number>>(`${this._endpoint}/item-count`)
            .pipe(
                tap((res) => {
                    if (res && (res.data || res.data == 0)) {
                        this.updateCartCounts(res.data);
                    }
                }),
                catchError((error) => {
                    this.updateCartCounts(0);
                    throw error;
                })
            )
            .subscribe();
    }

    updateCartCounts(itemCount: number) {
        this.cartItemCountSubject.next(itemCount);
    }
}
