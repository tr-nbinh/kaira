import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { PaginatedRequest } from '../../models/paginatedRequest.interface';
import { PaginationMeta } from '../../models/paginatedResponse.interface';
import { BlogListComponent } from '../../shared/components/blog/blog-list/blog-list.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { Blog } from './models/blog.model';
import { BlogService } from './services/blog.service';

@Component({
    selector: 'app-blog',
    imports: [BlogListComponent, PaginationComponent],
    templateUrl: './blog.component.html',
    styleUrl: './blog.component.scss',
})
export class BlogComponent extends BaseComponent implements OnInit {
    blogs: Blog[] = new Array(4);
    pagination: PaginationMeta = {
        page: 0,
        limit: 0,
        totalPages: 0,
        totalCount: 0,
    };
    paging: PaginatedRequest = {
        page: 1,
        limit: 10,
    };

    constructor(private blogService: BlogService) {
        super();
    }

    ngOnInit(): void {
        this.getBlogs(this.paging);
    }

    getBlogs(paging: PaginatedRequest) {
        this.blogService
            .getBlogs(paging)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((res) => {
                this.blogs = res.data;
                this.pagination = res.meta;
            });
    }

    onPageChange(page: number) {
        this.paging.page = page;
        this.getBlogs(this.paging);
    }
}
