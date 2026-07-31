import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
} from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { BlogService } from '../blog.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-blog-post',
    templateUrl: './blog-post.component.html',
    imports: [CommonModule, NgOptimizedImage, RouterLink, TranslatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPostComponent {
    private route = inject(ActivatedRoute);
    private translate = inject(TranslateService);
    private titleService = inject(Title);
    protected blogService = inject(BlogService);

    slug = toSignal(
        this.route.paramMap.pipe(map((params) => params.get('slug'))),
        { initialValue: null },
    );

    postResource = rxResource({
        request: () => this.slug(),
        loader: ({ request }) => this.blogService.getBlogBySlug(request!),
    });

    post = computed(() => this.postResource.value());

    constructor() {
        effect(() => {
            const currentPost = this.post();
            if (currentPost) {
                this.updatePageTitle(currentPost.title);
            }
        });
    }

    private updatePageTitle(postTitle: string) {
        const brandName = this.translate.instant('BRAND_NAME') || 'TNB.Studio';
        this.titleService.setTitle(`${postTitle} | Editorial - ${brandName}`);
    }

    // Computed signal tạo JSON-LD Schema.org cho SEO
    // jsonLdSchema = computed(() => {
    //     const data = this.post();
    //     if (!data) return '';
    //     const schema = {
    //         '@context': 'https://schema.org',
    //         '@type': 'BlogPosting',
    //         headline: data.title,
    //         description: data.description,
    //         image: [data.coverImage.url],
    //         datePublished: data.publishedAt,
    //         dateModified: data.updatedAt || data.publishedAt,
    //         author: {
    //             '@type': 'Person',
    //             name: data.author.name,
    //         },
    //         publisher: {
    //             '@type': 'Organization',
    //             name: 'KAIRA LUXURY FASHION',
    //             logo: {
    //                 '@type': 'ImageObject',
    //                 url: 'https://yourdomain.com/logo.png',
    //             },
    //         },
    //         mainEntityOfPage: {
    //             '@type': 'WebPage',
    //             '@id': `https://yourdomain.com/editorial/${data.slug}`,
    //         },
    //     };
    //     return JSON.stringify(schema);
    // });
}
