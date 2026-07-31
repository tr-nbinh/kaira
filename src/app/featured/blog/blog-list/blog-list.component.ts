import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal,
} from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { BlogService } from '../blog.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-blog-list',
    imports: [NgOptimizedImage, RouterLink, TranslatePipe, DatePipe],
    templateUrl: './blog-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogListComponent {
    private blogService = inject(BlogService);

    allPostsResouce = rxResource({
        loader: () => this.blogService.getBlogs(),
    });

    posts = computed(() => this.allPostsResouce.value()?.data || []);
    selectedCategory = signal<string>('all');

    // Danh mục filter
    categories = [
        { label: 'EDITORIAL.CATEGORIES.ALL', value: 'all' },
        { label: 'EDITORIAL.CATEGORIES.EDITORIAL', value: 'editorial' },
        { label: 'EDITORIAL.CATEGORIES.STYLING_GUIDE', value: 'styling-guide' },
        { label: 'EDITORIAL.CATEGORIES.TRENDS', value: 'trends' },
        { label: 'EDITORIAL.CATEGORIES.CRAFTSMANSHIP', value: 'craftsmanship' },
    ];

    featuredPost = computed(() => {
        return this.posts().find((p) => p.isFeatured) || this.posts()[0];
    });

    // Computed signal lọc danh sách bài viết theo Category chọn
    filteredPosts = computed(() => {
        const category = this.selectedCategory();
        const featuredId = this.featuredPost()?.id;

        // Loại bỏ bài featured ở danh sách thường nếu đang ở tab 'All Stories'
        if (category === 'all') {
            return this.posts().filter((p) => p.id !== featuredId);
        }

        return this.posts().filter((p) => p.category.code === category);
    });

    setCategory(slug: string) {
        this.selectedCategory.set(slug);
    }
}
