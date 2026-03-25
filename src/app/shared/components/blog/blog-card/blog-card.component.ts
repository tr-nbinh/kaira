import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Blog } from '../../../../featured/blog/models/blog.model';

@Component({
    selector: 'app-blog-card',
    imports: [DatePipe, RouterLink],
    templateUrl: './blog-card.component.html',
    styleUrl: './blog-card.component.scss',
})
export class BlogCardComponent {
    @Input() blog?: Blog;
}
