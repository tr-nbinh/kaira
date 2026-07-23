import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyType } from '../models/product.model';

@Pipe({
    name: 'price',
})
export class PricePipe implements PipeTransform {
    transform(value: number, currency: CurrencyType): string {
        const targetCurrency = currency || 'VND';
        const locale = targetCurrency === 'USD' ? 'en-US' : 'vi-VN';

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: targetCurrency,
            maximumFractionDigits: targetCurrency === 'VND' ? 0 : 2,
        }).format(value);
    }
}
