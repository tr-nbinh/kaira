import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlSegment } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CategoryService } from '../../../sevices/category.service';

export const categoryExistsGuard: CanMatchFn = async (
    route,
    segments: UrlSegment[],
) => {
    const categoryService = inject(CategoryService);
    const router = inject(Router);

    // Lấy toàn bộ path: ví dụ "women/top/shirt"
    const fullPath = segments.map((s) => s.path).join('/');

    if (!categoryService.isLoadedTree()) {
        await firstValueFrom(categoryService.getCategories());
    }

    const normalizedPath = `/${fullPath}`;
    const exists = categoryService.hasCategoryInLocalTree(normalizedPath);
    if (exists) return true;

    return router.createUrlTree(['/404']); // 🟢 Dùng UrlTree chuẩn nhất cho Angular Guard
};
