import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { SHOW_TOAST } from '../../../../core/token';
import { BaseService } from '../../../base/base.service';
import { ApiResponse } from '../../../models/api-response.interface';
import { UserService } from '../../../services/user.service';
import {
    AddToCartResponse,
    CartCountResponse,
    CartItem,
    CartResponse,
    DeleteCartItemResponse,
    UpdateCartQuantityResponse,
} from '../models/cart.model';

@Injectable({
    providedIn: 'root',
})
export class CartService extends BaseService {
    private readonly _endpoint = 'cart';
    private cartItemCountSubject = new BehaviorSubject<number>(0);
    readonly cartItemCount$ = this.cartItemCountSubject.asObservable();
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
                this.getCartCount();
            } else {
                this.updateCartCounts(0);
            }
        });
    }

    getCartItems(): Observable<CartResponse> {
        return this.get(this._endpoint);
    }

    addToCart(
        variantId: string,
        quantity: number = 1,
    ): Observable<AddToCartResponse> {
        if (!this._isLoggedIn) {
            console.log(this._isLoggedIn);
            return throwError(
                () => new Error(this.translate.instant('COMMON.UNAUTHORIZED')),
            );
        }

        return this.post<AddToCartResponse>(
            this._endpoint,
            {
                variantId,
                quantity,
            },
            { context: new HttpContext().set(SHOW_TOAST, true) },
        ).pipe(
            tap((res) => {
                if (res) {
                    this.updateCartCounts(res.cartCount);
                }
            }),
        );
    }

    removeFromCart(variantId: string): Observable<DeleteCartItemResponse> {
        return this.delete<DeleteCartItemResponse>(
            `${this._endpoint}/${variantId}`,
        ).pipe(
            tap((res) => {
                if (res) {
                    this.updateCartCounts(res.cartCount);
                }
            }),
        );
    }

    updateQuantityInCart(
        variantId: string,
        quantity: number,
    ): Observable<UpdateCartQuantityResponse> {
        return this.patch(
            `${this._endpoint}/${variantId}`,
            { quantity },
            { context: new HttpContext().set(SHOW_TOAST, true) },
        );
    }

    getCartCount() {
        this.get<CartCountResponse>(`${this._endpoint}/item-count`)
            .pipe(
                tap((res) => {
                    if (res) {
                        this.updateCartCounts(res.cartCount);
                    }
                }),
                catchError((error) => {
                    this.updateCartCounts(0);
                    throw error;
                }),
            )
            .subscribe();
    }

    updateCartCounts(itemCount: number) {
        this.cartItemCountSubject.next(itemCount);
    }
}
