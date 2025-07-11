import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '../../../base/base.component';
import { CategoryService } from '../../../services/category.service';
import { takeUntil } from 'rxjs';
import { Category } from '../../../models/product-filter.interface';

@Component({
    selector: 'app-category',
    imports: [TranslateModule],
    templateUrl: './category.component.html',
    styleUrl: './category.component.scss',
})
export class CategoryComponent extends BaseComponent {
    categories: Category[] = [];

    constructor(private categoryService: CategoryService) {
        super();
    }

    ngOnInit() {
        this.categoryService
            .getCategories()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((res) => {
                this.categories = res;
            });
    }
}
