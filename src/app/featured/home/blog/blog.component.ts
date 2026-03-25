import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../base/base.component';
import { Blog } from '../../blog/models/blog.model';
import { BlogService } from '../../blog/services/blog.service';
import { BlogListComponent } from '../../../shared/components/blog/blog-list/blog-list.component';

@Component({
    selector: 'app-blog',
    imports: [RouterLink, TranslatePipe, BlogListComponent],
    templateUrl: './blog.component.html',
    styleUrl: './blog.component.scss',
})
export class BlogComponent extends BaseComponent implements OnInit {
    blogs: Blog[] = new Array(3).fill(undefined);

    constructor(private blogService: BlogService) {
        super();
    }

    ngOnInit(): void {
        this.blogService
            .getBlogs({ limit: 3, page: 1 })
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((res) => {
                this.blogs = res.data;
            });
    }
}
