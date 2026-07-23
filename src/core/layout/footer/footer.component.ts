import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FooterLink {
    label: string;
    url: string;
}

@Component({
    selector: 'app-footer',
    imports: [RouterLink],
    templateUrl: './footer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
    readonly shopLinks: FooterLink[] = [
        {
            label: 'New Arrivals',
            url: '/collections/new-arrivals',
        },
        {
            label: 'Best Sellers',
            url: '/collections/best-sellers',
        },
        {
            label: 'Men',
            url: '/collections/men',
        },
        {
            label: 'Women',
            url: '/collections/women',
        },
    ];

    readonly companyLinks: FooterLink[] = [
        {
            label: 'About Us',
            url: '/about',
        },
        {
            label: 'Contact',
            url: '/contact',
        },
        {
            label: 'FAQs',
            url: '/faq',
        },
        {
            label: 'Shipping & Returns',
            url: '/shipping-returns',
        },
    ];

    readonly legalLinks: FooterLink[] = [
        {
            label: 'Privacy Policy',
            url: '/privacy-policy',
        },
        {
            label: 'Terms of Service',
            url: '/terms',
        },
    ];

    readonly socialLinks = [
        {
            label: 'Instagram',
            url: '#',
        },
        {
            label: 'Facebook',
            url: '#',
        },
        {
            label: 'TikTok',
            url: '#',
        },
    ];

    readonly currentYear = new Date().getFullYear();
}
