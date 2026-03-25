import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html.pipe';
import { Blog } from '../../models/blog.model';
import { BlogService } from '../../services/blog.service';

@Component({
    selector: 'app-blog-detail',
    imports: [AsyncPipe, DatePipe, SafeHtmlPipe],
    templateUrl: './blog-detail.component.html',
    styleUrl: './blog-detail.component.scss',
})
export class BlogDetailComponent implements OnInit {
    blog$!: Observable<Blog>;

    constructor(
        private route: ActivatedRoute,
        private blogService: BlogService,
    ) {}

    ngOnInit(): void {
        const slug = this.route.snapshot.paramMap.get('slug');
        if (slug) {
            this.blog$ = this.blogService.getBlogBySlug(slug);
        }
    }
}
