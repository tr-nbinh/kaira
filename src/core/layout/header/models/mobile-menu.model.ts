import { Signal } from '@angular/core';
import { UserProfile } from '../../../auth/models/user-profile.model';
import { LanguageOption } from '../../../models/language.model';
import { MenuItem } from './menu.interface';

export interface MobileMenuData {
    menus: MenuItem[];
    languages: LanguageOption[];
    activeLang: LanguageOption;
    user: Signal<UserProfile | null>;
    accountMenu: Signal<MenuItem[]>;
}
