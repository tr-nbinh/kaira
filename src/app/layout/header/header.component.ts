import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { fromEvent, map, Observable, take, takeUntil } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { MenuItem } from '../../models/menu.interface';
import { MenuService } from '../../services/menu.service';
import { UserService } from '../../services/user.service';
import { CartService } from '../../services/cart.service';
import { WishlistComponent } from '../../featured/wishlist/wishlist.component';
import { WishlistService } from '../../services/wishlist.service';

interface Language {
    code: string;
    name: string;
    flagIcon: string;
    flagIconSm: string;
}

@Component({
    selector: 'app-header',
    imports: [CommonModule, TranslateModule, MatIconModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent extends BaseComponent implements OnInit {
    menu: Observable<MenuItem[]> | undefined;
    languages: Language[] = [
        {
            code: 'en',
            name: 'LANGUAGE.ENGLISH',
            flagIcon: 'flag-usa',
            flagIconSm: 'flag-usa-sm',
        },
        {
            code: 'vi',
            name: 'LANGUAGE.VIETNAMESE',
            flagIcon: 'flag-vietnam',
            flagIconSm: 'flag-vietnam-sm',
        },
    ];
    activeCurrentLanguage!: Language;
    isScrolled: boolean = false;
    isAuthenticated: boolean = false;
    cartItemCount: number = 0;
    wishlistItemCount: number = 0;

    constructor(
        private translate: TranslateService,
        private menuService: MenuService,
        private userService: UserService,
        private cartService: CartService,
        private wishlishService: WishlistService,
        private router: Router
    ) {
        super();
    }

    ngOnInit() {
        this.activeCurrentLanguage = this.languages.find(
            (item) => item.code === this.translate.currentLang
        )!;
        this.getCartItemCount();
        this.getWishlistItemCount();
        this.menu = this.menuService
            .getMenu()
            .pipe(takeUntil(this.ngUnsubscribe));

        this.userService.isAuthenticated$
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((res) => {
                this.isAuthenticated = res;
            });
    }

    switchLanguage(code: string) {
        this.translate.use(code);
        this.activeCurrentLanguage = this.languages.find(
            (item) => item.code === code
        )!;
    }

    goToRegisterPage() {
        this.router.navigate(['/auth/register']);
    }

    login() {
        this.router.navigate(['/auth/login']);
    }

    logout() {
        this.userService.logout();
    }

    getCartItemCount() {
        this.cartService.cartItemCount$
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((itemCount) => {
                this.cartItemCount = itemCount;
            });
    }

    getWishlistItemCount() {
        this.wishlishService.wishlistItemCount$
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((itemCount) => {
                this.wishlistItemCount = itemCount;
            });
    }

    checkScroll() {
        // fromEvent(window, 'scroll')
        //     .pipe(
        //         map(() => window.scrollY > 0),
        //         takeUntil(this.ngUnsubscribe)
        //     )
        //     .subscribe((isScrolled) => {
        //         this.isScrolled = isScrolled;
        //     });
    }
}
