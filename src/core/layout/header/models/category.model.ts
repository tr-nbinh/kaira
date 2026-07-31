export interface CategoryResponse {
    categories: Category[];
    paths: string[];
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    path?: string;
    children?: Category[];
}
