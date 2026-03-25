import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { delay, Observable, of } from 'rxjs';
import { BaseComponent } from '../../../base/base.component';
import { CategoryService } from './services/category.service';
import { Category } from './models/category.model';

@Component({
    selector: 'app-category',
    imports: [TranslatePipe, AsyncPipe, RouterLink],
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
