import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root',
})
export class SvgIconService {
    constructor(
        private matIconRegistry: MatIconRegistry,
        private domSantizer: DomSanitizer
    ) {}

    public registerIcons(icons: string[], path: string = ''): void {
        const iconPath = `assets/icons/${path ? path + '/' : ''}`;
        icons.forEach((icon) => {
            this.matIconRegistry.addSvgIcon(
                icon,
                this.domSantizer.bypassSecurityTrustResourceUrl(
                    `${iconPath}${icon}.svg`
                )
            );
        });
    }
}
