// src/app/core/matchers/category.matcher.ts
import { UrlMatcher, UrlSegment } from '@angular/router';

const RESERVED_PATHS = [
    'cart',
    'checkout',
    'account',
    'auth',
    'search',
    'wishlist',
    'shop',
    '404',
];

export const categoryMatcher: UrlMatcher = (segments: UrlSegment[]) => {
    if (segments.length === 0) return null;

    const firstSegment = segments[0].path.toLowerCase();
    if (RESERVED_PATHS.includes(firstSegment)) return null;

    const fullCategoryPath = segments.map((s) => s.path).join('/');

    return {
        consumed: segments,
        posParams: {
            categoryPath: new UrlSegment(fullCategoryPath, {}),
        },
    };
};
