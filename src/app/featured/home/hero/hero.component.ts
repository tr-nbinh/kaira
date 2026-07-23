import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionLinkComponent } from '../../../../shared/components/section-link/section-link.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-hero',
    standalone: true,
    imports: [RouterLink, TranslatePipe, SectionLinkComponent],
    templateUrl: './hero.component.html',
})
export class HeroComponent {
    readonly hero = {
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c',

        eyebrow: 'New Season 2026',

        title: 'Timeless Pieces For Modern Living',

        subtitle:
            'Discover carefully crafted essentials designed for everyday elegance.',

        ctaLabel: 'Shop Collection',

        ctaLink: '/collections/new-season',
    };
}
