import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { Language } from '../../models/language.interface';
import { MenuItem } from '../../models/menu.interface';
import { CartService } from '../../services/cart.service';
import { MenuService } from '../../services/menu.service';
import { UserService } from '../../services/user.service';
import { WishlistService } from '../../services/wishlist.service';
import { LANGUAGES } from '../../shared/constants/languages.constant';

@Component({
    selector: 'app-header',
    imports: [
        TranslatePipe,
        MatIconModule,
        RouterLink,
        RouterLinkActive,
        AsyncPipe,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent extends BaseComponent implements OnInit {
    @ViewChild('headerElement') headerRef!: ElementRef<HTMLElement>;
    private resize$!: ResizeObserver;
    headerHeight: number = 0;
    menu$: Observable<MenuItem[]> = of([]);
    languages = LANGUAGES;
    activeCurrentLanguage!: Language;
    isAuthenticated$: Observable<boolean> = of(false);
    cartItemCount$: Observable<number> = of(0);
    wishlistItemCount$: Observable<number> = of(0);
    isScrolled: boolean = false;

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
        this.menu$ = this.menuService.getMenu();
        this.cartItemCount$ = this.cartService.cartItemCount$;
        this.wishlistItemCount$ = this.wishlishService.wishlistItemCount$;
        this.isAuthenticated$ = this.userService.isAuthenticated$;
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.headerHeight = this.headerRef.nativeElement.offsetHeight;
        });
        this.resize$ = new ResizeObserver(() => {
            if (
                this.headerHeight != this.headerRef.nativeElement.offsetHeight
            ) {
                this.headerHeight = this.headerRef.nativeElement.offsetHeight;
            }
        });

        this.resize$.observe(this.headerRef.nativeElement);
    }

    switchLanguage(code: string) {
        if (code == this.translate.currentLang) return;
        this.translate.use(code);
        localStorage.setItem('userLanguage', code);
        window.location.reload();
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

    override ngOnDestroy(): void {
        this.resize$.disconnect();
        super.ngOnDestroy();
    }
}
