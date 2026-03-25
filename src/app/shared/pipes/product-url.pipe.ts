// src/app/shared/pipes/product-url.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { generateProductUrl } from '../utils/product-url.helper';

@Pipe({
    name: 'productUrl',
    standalone: true, // Nếu bạn dùng Angular 14+
})
export class ProductUrlPipe implements PipeTransform {
    // Nhận vào object product và trả về chuỗi URL
    transform(productId: string, slug: string): string {
        if (!productId || !slug) return '';
        return generateProductUrl(slug, productId);
    }
}
