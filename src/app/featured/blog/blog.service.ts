// services/blog.service.ts

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BaseService } from '../../../core/sevices/base.service';
import { BlogListParams, BlogPostDetail, BlogPostItem } from './blog.model';
import { ListResponse } from '../../../shared/models/list-repsonse.model';

@Injectable({
    providedIn: 'root',
})
export class BlogService extends BaseService {
    private readonly _endpoint = 'blogs';

    getBlogs(
        params: BlogListParams = {},
    ): Observable<ListResponse<BlogPostItem>> {
        return this.get(this._endpoint, params);
    }

    getBlogBySlug(slug: string): Observable<BlogPostDetail> {
        return this.get(`${this._endpoint}/${slug}`);
    }

    getFeaturedBlog(): Observable<ListResponse<BlogPostItem>> {
        return this.getBlogs({ featured: true, limit: 1 });
    }
}
