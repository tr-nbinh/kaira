import {
    ChangeDetectionStrategy,
    Component,
    inject,
    output,
    signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SUPPORTED_LANGUAGES } from '../../../../../core/configs/language.config';
import { LanguageOption } from '../../../../../core/models/language.model';
import { DRAWER_DATA } from '../../../../../shared/components/drawer/models/drawer.model';
import { MobileMenuData } from '../../models/mobile-menu.model';
import { InitialsPipe } from '../../../../../shared/pipes/initials.pipe';
import { AuthService } from '../../../../auth/auth.service';
import { DrawerRef } from '../../../../../shared/components/drawer/drawer-ref';

@Component({
    selector: 'app-mobile-menu',
    templateUrl: './mobile-menu.component.html',
    imports: [RouterLink, RouterLinkActive, TranslatePipe, InitialsPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent {
    private readonly config = inject(DRAWER_DATA);
    private readonly drawerRef = inject(
        DrawerRef<any, { type: string; value: any }>,
    );

    readonly data = this.config.data as MobileMenuData;
    readonly menus = this.data.menus || [];
    readonly user = this.data.user || null;
    readonly languages = this.data.languages || SUPPORTED_LANGUAGES;
    readonly activeLang = this.data.activeLang || SUPPORTED_LANGUAGES[0];
    readonly accountMenu = this.data.accountMenu || [];

    isLangOpen = signal(false);
    isAccountOpen = signal(false);

    logout() {
        console.log('logout');
        this.drawerRef.emit({ type: 'logout', value: true });
    }

    changeLang(lang: LanguageOption) {
        this.drawerRef.emit({ type: 'changeLang', value: lang });
    }
}
