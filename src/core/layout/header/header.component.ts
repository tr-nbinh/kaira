import {
    Component,
    computed,
    DestroyRef,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import {
    rxResource,
    takeUntilDestroyed,
    toSignal,
} from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth/auth.service';
import { SUPPORTED_LANGUAGES } from '../../../core/configs/language.config';
import { LanguageOption } from '../../../core/models/language.model';
import { CartStore } from '../../../core/stores/cart.store';
import { DrawerService } from '../../../shared/components/drawer/drawer.service';
import { MenuService } from '../../sevices/menu.service';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { GUEST_ACCOUNT_MENU, USER_ACCOUNT_MENU } from './header.constant';
import { MobileMenuData } from './models/mobile-menu.model';
import { WishlistStore } from '../../stores/wishlist.store';
import { CategoryDrawerComponent } from './components/category-drawer/category-drawer.component';
import { InitialsPipe } from '../../../shared/pipes/initials.pipe';

@Component({
    selector: 'app-header',
    imports: [RouterLink, RouterLinkActive, TranslatePipe, InitialsPipe],
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
    private translate = inject(TranslateService);
    private menuService = inject(MenuService);
    private router = inject(Router);
    protected authService = inject(AuthService);
    protected wishlistStore = inject(WishlistStore);
    protected cartStore = inject(CartStore);
    private destroyRef = inject(DestroyRef);
    private drawerService = inject(DrawerService);

    menusResource = rxResource({
        loader: () => this.menuService.getMenu(),
        defaultValue: [],
    });
    menus = computed(() => this.menusResource.value());
    isSearchOpen = signal(false);
    currentUser = this.authService.currentUser;
    accountMenu = computed(() => {
        if (!this.authService.isLoggedIn()) return GUEST_ACCOUNT_MENU;
        return USER_ACCOUNT_MENU;
    });

    languages = SUPPORTED_LANGUAGES;
    activeCurrentLanguage!: LanguageOption;

    ngOnInit() {
        this.activeCurrentLanguage = this.languages.find(
            (item) => item.code === this.translate.currentLang,
        )!;
    }

    switchLanguage(lang: LanguageOption) {
        if (lang.code == this.translate.currentLang) return;
        localStorage.setItem('userLanguage', lang.code);
        window.location.reload();
    }

    onLogout() {
        this.authService
            .logout()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.cartStore.setCount(0);
                    this.wishlistStore.setCount(0);
                    this.router.navigate(['/auth/login']);
                },
                error: () => {
                    this.cartStore.setCount(0);
                    this.wishlistStore.setCount(0);
                    this.router.navigate(['/auth/login']);
                },
            });
    }

    openMobileMenu() {
        const ref = this.drawerService.open<MobileMenuData>({
            content: MobileMenuComponent,
            title: 'Menu',
            position: 'right',
            size: 'md',
            data: {
                menus: this.menus(),
                accountMenu: this.accountMenu,
                activeLang: this.activeCurrentLanguage,
                languages: this.languages,
                user: this.currentUser,
            },
        });

        ref.events().subscribe((data) => {
            switch (data.type) {
                case 'logout':
                    this.onLogout();
                    break;
                case 'changeLang':
                    this.switchLanguage(data.value);
                    break;
                default:
                    break;
            }
        });
    }

    openCategoryDrawer() {
        this.drawerService.open({
            content: CategoryDrawerComponent,
            title: this.translate.instant('CATEGORY_DRAWER.TITLE'),
            position: 'left',
            size: 'lg',
        });
    }
}
