import { Component, inject } from '@angular/core';
import { CategoryService } from '../../../../sevices/category.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Category } from '../../models/category.model';
import { CategorySkeletonComponent } from './category-skeleton/category-skeleton.component';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'app-category-drawer',
    templateUrl: './category-drawer.component.html',
    imports: [
        TranslatePipe,
        RouterLink,
        CategorySkeletonComponent,
        NgTemplateOutlet,
    ],
})
export class CategoryDrawerComponent {
    private categoryService = inject(CategoryService);

    categoriesResource = rxResource({
        loader: () => this.categoryService.getCategories(),
    });

    selectedCategoryId = null;
    expandedCategoryId: string | number | null = null;
    expandedCategories: Set<string | number> = new Set();

    toggleExpand(id: string | number, event: Event): void {
        event.stopPropagation();
        this.expandedCategoryId = this.expandedCategoryId === id ? null : id;
        if (this.isExpanded(id)) {
            this.expandedCategories.delete(id);
        } else {
            this.expandedCategories.add(id);
        }
    }

    onCategoryClick(category: Category): void {
        // this.selectCategory.emit(category);
        // this.close();
    }

    isExpanded(id: string | number): boolean {
        return this.expandedCategories.has(id);
    }
}
