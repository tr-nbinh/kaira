import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { BaseComponent } from '../../../base/base.component';
import { Category } from '../../../models/category.interface';
import { CategoryService } from '../../../services/category.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-category',
    imports: [TranslateModule, AsyncPipe, RouterLink],
    templateUrl: './category.component.html',
    styleUrl: './category.component.scss',
})
export class CategoryComponent extends BaseComponent {
    categories$: Observable<Category[]> = of([]);

    constructor(private categoryService: CategoryService) {
        super();
    }

    ngOnInit() {
        this.categories$ = this.categoryService.getCategories();
    }
}
