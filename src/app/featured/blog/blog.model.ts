// models/blog.model.ts

export interface Author {
    name: string;
    avatar: string;
}

export interface Category {
    code: string;
    name: string;
}

export interface RelatedProduct {
    id: string;
    productCode: string;
    name: string;
    description: string;
    sortOrder: number;
}

export interface BlogPostItem {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImage: string;
    coverAlt: string;
    readTime: string;
    isFeatured: boolean;
    publishedAt: string;
    author: Author;
    category: Category;
}

export interface BlogPostDetail extends BlogPostItem {
    contentHtml: string;
    relatedProducts: RelatedProduct[];
}

export interface BlogListParams {
    lang?: 'vi' | 'en';
    category?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
}
