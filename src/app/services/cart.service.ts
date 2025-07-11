import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, take, tap } from 'rxjs';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { CartItem } from '../models/cart.interface';

@Injectable({
    providedIn: 'root',
})
export class CartService extends BaseService {
    private readonly _endpoint = 'cart';
    private cartItemCountSubject = new BehaviorSubject<number>(0);
    readonly cartItemCount$ = this.cartItemCountSubject.asObservable();

    constructor(http: HttpClient, private userService: UserService) {
        super(http);
        this.userService.isAuthenticated$.subscribe((isAuth) => {
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

    addToCart(variantId: number, quantity: number = 1): Observable<any> {
        return this.post(this._endpoint, { variantId, quantity }).pipe(
            tap((res: any) => {
                if (res && res.totalItems) {
                    this.updateCartCounts(res.totalItems);
                }
            })
        );
    }

    removeFromCart(variantId: number): Observable<any> {
        return this.delete(`${this._endpoint}/${variantId}`).pipe(
            tap((res: any) => {
                if (res && res.totalItems !== null) {
                    this.updateCartCounts(res.totalItems);
                }
            })
        );
    }

    updateQuantityInCart(
        variantId: number,
        quantity: number
    ): Observable<any> {
        return this.patch(`${this._endpoint}/${variantId}`, { quantity });
    }

    getCartCounts() {
        if (!this.userService.isLoggedIn()) {
            this.updateCartCounts(0);
            return;
        }
        this.get(`${this._endpoint}/item-count`)
            .pipe(
                tap((res: any) => {
                    if (res && res.cartItemCount) {
                        this.updateCartCounts(res.cartItemCount);
                    }
                }),
                catchError((error) => {
                    console.error('Failed to fetch cart counts:', error);
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
