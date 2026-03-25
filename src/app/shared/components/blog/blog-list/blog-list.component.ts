import { Component, Input } from '@angular/core';
import { Blog } from '../../../../featured/blog/models/blog.model';
import { BlogCardComponent } from '../blog-card/blog-card.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-blog-list',
    imports: [BlogCardComponent, RouterLink],
    templateUrl: './blog-list.component.html',
    styleUrl: './blog-list.component.scss',
})
export class BlogListComponent {
    @Input() blogs: Blog[] = [];
    @Input() colClass: string = 'col-12 col-md-6 col-lg-4';
}
