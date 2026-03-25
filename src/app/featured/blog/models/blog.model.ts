type BlogStatus = 'draft' | 'published';

export interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    thumbnail_url: string;
    author_id?: string;
    status: BlogStatus;
    view_count: number;
    created_at?: Date;
    updated_at?: Date;
    published_at?: Date;
}
