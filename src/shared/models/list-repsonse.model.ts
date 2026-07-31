export interface ListResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
}
