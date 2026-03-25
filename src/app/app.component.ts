import {
    Component,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from './base/base.component';
import { FollowUsComponent } from './layout/follow-us/follow-us.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { NewsletterComponent } from './layout/newsletter/newsletter.component';
import { DialogService } from './services/dialog.service';
import { SvgIconService } from './services/svg-icon.service';
import { ToastService } from './services/toast.service';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
    selector: 'app-root',
    imports: [
        HeaderComponent,
        NewsletterComponent,
        FollowUsComponent,
        FooterComponent,
        RouterOutlet,
        ToastComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent extends BaseComponent {
    title = 'kaira';
    currentLang: string = '';
    showLayout = false;
    // Các route không dùng layout (coming soon, error, not found...)
    noLayoutRoutes = [
        '/about',
        '/coming-soon',
        '/error',
        '/not-found',
        '/404',
        '/admin',
    ];

    constructor(
        private translate: TranslateService,
        private svgIconService: SvgIconService,
        private route: Router,
        protected toast: ToastService,
        private dialogService: DialogService,
    ) {
        super();

        this.route.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this.ngUnsubscribe),
            )
            .subscribe((event: NavigationEnd) => {
                this.showLayout = !this.noLayoutRoutes.some((path) =>
                    event.urlAfterRedirects.startsWith(path),
                );
            });
        // Register SVG icons
        this.svgIconService.registerIcons([
            'flag-usa',
            'flag-usa-sm',
            'flag-vietnam-sm',
            'search',
            'list',
            'close',
        ]);

        // Register icons for mobile navigation
        this.svgIconService.registerIcons(
            ['home', 'bag-heart', 'subtask', 'envelope'],
            'nav-mobile',
        );

        // Configure language translation
        const savedLang = localStorage.getItem('userLanguage');
        if (savedLang) {
            this.translate.use(savedLang);
        } else {
            this.translate.addLangs(['en', 'vi']);
            this.translate.setDefaultLang('vi');

            const browserLang = translate.getBrowserLang();
            console.log(browserLang);
            this.currentLang =
                browserLang && browserLang.match(/en|vi/) ? browserLang : 'vi';
            this.translate.use(this.currentLang);
        }
        this.translate.onLangChange.subscribe((event) => {
            this.currentLang = event.lang;
        });
    }

    @ViewChild('dialogPlaceholder', { read: ViewContainerRef })
    dialogPlaceholder!: ViewContainerRef;

    ngAfterViewInit() {
        // Khởi tạo root container để dialog service tạo vào
        this.dialogService.init(this.dialogPlaceholder);
    }
}
