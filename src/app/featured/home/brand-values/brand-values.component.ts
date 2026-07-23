import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { TranslatePipe } from '@ngx-translate/core';

interface BrandValue {
    icon: string;
    title: string;
    description: string;
}

@Component({
    selector: 'app-brand-values',
    standalone: true,
    imports: [SectionHeaderComponent, TranslatePipe],
    templateUrl: './brand-values.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandValuesComponent {
    readonly values: BrandValue[] = [
        {
            icon: 'ti-truck-delivery',
            title: 'Free Shipping',
            description: 'Complimentary shipping on qualifying orders.',
        },
        {
            icon: 'ti-award',
            title: 'Premium Quality',
            description:
                'Carefully selected materials and timeless craftsmanship.',
        },
        {
            icon: 'ti-shield-check',
            title: 'Secure Payment',
            description: 'Safe and encrypted checkout experience.',
        },
    ];
}
