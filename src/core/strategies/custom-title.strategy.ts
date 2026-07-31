import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class CustomTitleStrategy extends TitleStrategy {
    private readonly title = inject(Title);
    private readonly translate = inject(TranslateService);

    private lastSnapshot: RouterStateSnapshot | null = null;

    constructor() {
        super();
        // Tự động cập nhật lại Title khi người dùng bấm nút chuyển ngôn ngữ (VI <-> EN)
        this.translate.onLangChange.subscribe(() => {
            if (this.lastSnapshot) {
                this.updateTitle(this.lastSnapshot);
            }
        });
    }

    override updateTitle(snapshot: RouterStateSnapshot): void {
        this.lastSnapshot = snapshot;
        const titleKey = this.buildTitle(snapshot);

        if (titleKey) {
            // Dịch titleKey và tên thương hiệu từ file i18n
            this.translate
                .get([titleKey, 'BRAND_NAME'])
                .subscribe((translations) => {
                    const pageTitle = translations[titleKey];
                    const brandName = translations['BRAND_NAME'];

                    // Cấu trúc: "Tên Trang - BRAND"
                    this.title.setTitle(`${pageTitle} - ${brandName}`);
                });
        } else {
            // Mặc định cho Trang Chủ (khi không khai báo titleKey)
            this.translate
                .get(['PAGES.HOME_TITLE', 'BRAND_NAME'])
                .subscribe((translations) => {
                    this.title.setTitle(
                        `${translations['BRAND_NAME']} | ${translations['PAGES.HOME_TITLE']}`,
                    );
                });
        }
    }
}
