import { Pipe, PipeTransform } from '@angular/core';
import { buildProductUrl } from '../utils/product-url.helper';

@Pipe({
    name: 'productUrl',
})
export class ProductUrlPipe implements PipeTransform {
    transform(product: { id: string; slug: string } | null): string {
        if (!product) return '';
        return buildProductUrl(product.slug, product.id);
    }
}
