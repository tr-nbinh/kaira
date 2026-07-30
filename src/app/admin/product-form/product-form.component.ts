import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { BrandService } from '../../../shared/services/brand.service';
import { AttributeService } from '../../featured/shop/services/attribute.service';
import { ProductService } from '../../../shared/services/product.service';
import { AttributeValue } from '../../../shared/models/attribute.model';

export interface AttributeOption {
    id: string;
    name: string;
    value: string;
}

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './product-form.component.html',
})
export class ProductFormComponent {
    private fb = inject(FormBuilder);
    private brandService = inject(BrandService);
    private attributeService = inject(AttributeService);
    private productService = inject(ProductService);

    activeLang = signal<'en' | 'vi'>('en');

    brands = toSignal(this.brandService.getBrands(), { initialValue: [] });
    colors = toSignal(this.attributeService.getColors(), { initialValue: [] });
    sizes = toSignal(this.attributeService.getSizes(), { initialValue: [] });
    shoesSizes = signal<AttributeValue[]>([
        {
            id: '0bf5c7ce-0446-4f56-9ec7-56517056d58a',
            name: '39',
            value_code: '39',
        },
        {
            id: '1c32b5b4-b334-4f71-8837-6e74a3276dc9',
            name: '40',
            value_code: '40',
        },
        {
            id: 'a27b5030-9aa5-4af1-bf2f-61db04dd17c0',
            name: '41',
            value_code: '41',
        },
        {
            id: '7c1dc733-fce1-43cf-b3bc-c12e0251185d',
            name: '42',
            value_code: '42',
        },
        {
            id: '5f81b85c-04c1-4c8d-bf0e-0333fb67d4d6',
            name: '43',
            value_code: '43',
        },
        {
            id: '9f783ba9-250d-418f-b873-327cacc754a0',
            name: '44',
            value_code: '44',
        },
        {
            id: 'fc653cad-f550-4493-a558-b40f750d2a34',
            name: '45',
            value_code: '45',
        },
    ]);

    allSizes = computed(() => {
        const sizes = this.sizes();
        if (!sizes) return this.shoesSizes();

        return [...sizes, ...this.shoesSizes()];
    });

    productForm: FormGroup = this.fb.group({
        brand_id: ['', Validators.required],
        category_id: ['', Validators.required],
        status: ['active', Validators.required],
        is_best_seller: [false],
        product_translations: this.fb.array([
            this.createTranslationGroup('en'),
            this.createTranslationGroup('vi'),
        ]),
        product_variants: this.fb.array([
            this.createVariantGroup(true), // Variant đầu tiên mặc định là true
        ]),
    });

    private formState = toSignal(this.productForm.valueChanges, {
        initialValue: this.productForm.value,
    });

    translationsArray = computed(
        () => this.productForm.get('product_translations') as FormArray,
    );
    variantsArray = computed(
        () => this.productForm.get('product_variants') as FormArray,
    );

    getTranslationGroup(lang: 'en' | 'vi'): FormGroup {
        const array = this.translationsArray();
        const index = array.controls.findIndex(
            (control) => control.get('language_code')?.value === lang,
        );
        return array.at(index) as FormGroup;
    }

    private createTranslationGroup(langCode: 'en' | 'vi'): FormGroup {
        return this.fb.group({
            language_code: [langCode],
            name: ['', Validators.required],
            slug: ['', Validators.required],
            description: [''],
            content: [''],
        });
    }

    generateSlug(lang: 'en' | 'vi'): void {
        const group = this.getTranslationGroup(lang);
        const nameVal = group.get('name')?.value || '';
        const slugVal = nameVal
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        group.get('slug')?.setValue(slugVal);
    }

    // Thêm field is_default (boolean)
    createVariantGroup(isDefault: boolean = false): FormGroup {
        return this.fb.group({
            sku: ['', Validators.required],
            status: ['active'],
            price: [0, [Validators.required, Validators.min(0)]],
            stock: [0, [Validators.required, Validators.min(0)]],
            color: ['', Validators.required],
            size: [''],
            is_default: [isDefault],
        });
    }

    // Đảm bảo chỉ có 1 variant làm is_default = true
    setDefaultVariant(selectedIndex: number): void {
        this.variantsArray().controls.forEach((control, index) => {
            control.get('is_default')?.setValue(index === selectedIndex);
        });
    }

    addVariant(): void {
        // Nếu là variant duy nhất thì cho làm default, ngược lại là false
        const isFirst = this.variantsArray().length === 0;
        this.variantsArray().push(this.createVariantGroup(isFirst));
        this.productForm.updateValueAndValidity();
    }

    removeVariant(index: number): void {
        if (this.variantsArray().length > 1) {
            const wasDefault = this.variantsArray()
                .at(index)
                .get('is_default')?.value;
            this.variantsArray().removeAt(index);

            // Nếu vừa xóa variant mặc định, tự động chuyển mặc định cho variant đầu tiên
            if (wasDefault && this.variantsArray().length > 0) {
                this.setDefaultVariant(0);
            }

            this.productForm.updateValueAndValidity();
        }
    }

    private findInvalidControls(): void {
        const invalidControls: string[] = [];
        const controls = this.productForm.controls;

        for (const name in controls) {
            if (controls[name].invalid)
                invalidControls.push(`Cấp cha: ${name}`);
        }

        this.translationsArray().controls.forEach((group, index) => {
            if (group.invalid)
                invalidControls.push(
                    `Translation [${group.value.language_code}]`,
                );
        });

        this.variantsArray().controls.forEach((group, index) => {
            if (group.invalid)
                invalidControls.push(`Variant Hàng ${index + 1}`);
        });

        console.warn('⚠️ Dữ liệu chưa hợp lệ tại:', invalidControls);
    }

    onSubmit(): void {
        if (this.productForm.invalid) {
            this.productForm.markAllAsTouched();
            this.translationsArray().controls.forEach((c) =>
                c.markAllAsTouched(),
            );
            this.variantsArray().controls.forEach((c) => c.markAllAsTouched());

            this.findInvalidControls();
            return;
        }

        const rawValue = this.productForm.value;

        const formattedVariants = rawValue.product_variants.map((v: any) => {
            const { color, size, ...rest } = v;
            return {
                ...rest,
                option_value_ids: [color, size].filter(Boolean),
            };
        });

        const prismaPayload = {
            brand_id: rawValue.brand_id,
            status: rawValue.status,
            is_best_seller: rawValue.is_best_seller,
            categoryId: rawValue.category_id,
            product_translations: {
                create: rawValue.product_translations,
            },
            product_variants: {
                create: formattedVariants,
            },
        };

        console.log('Prisma Create Payload Ready:', prismaPayload);
        this.productService.addProduct(prismaPayload).subscribe(console.log);
    }
}
