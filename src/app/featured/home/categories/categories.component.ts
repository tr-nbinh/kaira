import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HomeCategory } from './home-category.interface';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { CategoryCardComponent } from '../../../../shared/components/category-card/category-card.component';

interface Category {
    id: number;
    nameKey: string;
    descriptionKey: string;

    url: string;
    cardClass?: string;
}

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    imports: [TranslatePipe, SectionHeaderComponent, CategoryCardComponent],
})
export class CategoriesComponent {
    categories = input<HomeCategory[]>([]);
}
