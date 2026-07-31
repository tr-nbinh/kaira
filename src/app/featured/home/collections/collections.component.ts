import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { CollectionService } from '../services/collection.service';

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
    private collectionService = inject(CollectionService);

    collections = rxResource({
        loader: () => this.collectionService.getCollections(),
    });

    featuredCollection = computed(() => {
        const collections = this.collections.value();
        if (collections && collections.length) {
            return collections.find((c) => c.featured);
        }

        return null;
    });

    secondaryCollections = computed(
        () => this.collections.value()?.filter((c) => !c.featured) || [],
    );
}
