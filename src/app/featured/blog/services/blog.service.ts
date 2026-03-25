import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../base/base.service';
import { PaginatedRequest } from '../../../models/paginatedRequest.interface';
import { PaginationResponse } from '../../../models/paginatedResponse.interface';
import { Blog } from '../models/blog.model';

@Injectable({
    providedIn: 'root',
})
export class BlogService extends BaseService {
    private readonly _endpoint: string = 'blogs';

    constructor(http: HttpClient) {
        super(http);
    }

    getBlogs(paging: PaginatedRequest): Observable<PaginationResponse<Blog>> {
        return this.get(this._endpoint, paging);
    }

    getBlogBySlug(slug: string): Observable<Blog> {
        return this.get(`${this._endpoint}/${slug}`);
    }
}
