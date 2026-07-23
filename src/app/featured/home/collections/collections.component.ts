import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';

interface Collection {
    id: string;
    slug: string;
    name: string;
    description: string;
    image: string;

    featured?: boolean;

    overlayClass?: string;
}

@Component({
    selector: 'app-collections',
    imports: [RouterLink, SectionHeaderComponent, TranslatePipe],
    templateUrl: './collections.component.html',
})
export class CollectionsComponent {
    readonly collections: Collection[] = [
        {
            id: '1',
            slug: 'summer-collection',
            name: 'Summer Collection',
            description: 'Lightweight essentials for warmer days.',
            image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
            featured: true,
            overlayClass: 'bg-black/30',
        },

        {
            id: '2',
            slug: 'minimal-black',
            name: 'Minimal Black',
            description: 'Timeless monochrome pieces.',
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
            overlayClass: 'bg-black/35',
        },

        {
            id: '3',
            slug: 'office-essentials',
            name: 'Office Essentials',
            description: 'Refined looks for everyday work.',
            image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b',
            overlayClass: 'bg-black/35',
        },
    ];

    get featuredCollection(): Collection {
        return this.collections.find((c) => c.featured)!;
    }

    get secondaryCollections(): Collection[] {
        return this.collections.filter((c) => !c.featured);
    }
}
