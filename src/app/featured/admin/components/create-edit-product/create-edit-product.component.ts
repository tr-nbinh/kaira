import { Component, NgModule } from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ProductService } from '../../../../services/product.service';
import { CategoryService } from '../../../../services/category.service';
import { BaseComponent } from '../../../../base/base.component';
import { takeUntil } from 'rxjs';
import { Category } from '../../../../models/product-filter.interface';
import { VarianImagesService } from '../../../../services/variant-images.service';

@Component({
    selector: 'app-create-edit-product',
    imports: [ReactiveFormsModule],
    templateUrl: './create-edit-product.component.html',
    styleUrl: './create-edit-product.component.scss',
})
export class CreateEditProductComponent extends BaseComponent {
    productForm: FormGroup;

    categories: Category[] = [];
    selectedCategoryIds: number[] = [];
    translationsArray: FormArray;
    variantsArray!: FormArray;

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private categoryService: CategoryService,
        private imageUploaderService: VarianImagesService
    ) {
        super();
        this.productForm = this.fb.group({
            brand_id: [null],
            is_favorite: [false],
            best_seller: [false],
            best_reviewed: [false],
            is_new_arrival: [false],
            categoryIds: this.fb.control([]),
            translations: this.fb.array([
                this.fb.group({
                    language_code: ['vi'],
                    name: [''],
                    description: [''],
                    slug: [''],
                }),
                this.fb.group({
                    language_code: ['en'],
                    name: [''],
                    description: [''],
                    slug: [''],
                }),
            ]),
            variants: this.fb.array([this.createVariantGroup()]),
        });
        this.translationsArray = this.productForm.get(
            'translations'
        ) as FormArray;
        this.variantsArray = this.productForm.get('variants') as FormArray;
    }

    ngOnInit() {
        this.categoryService
            .getCategories()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((res) => {
                this.categories = res;
            });
    }

    createVariantGroup(): FormGroup {
        return this.fb.group({
            sku: ['', Validators.required],
            color_id: [null, Validators.required],
            size_id: [null, Validators.required],
            price: [0, Validators.required],
            discount_percentage: [0],
            quantity_in_stock: [0, Validators.required],
            weight_kg: [null],
            dimensions_cm: [''],
            images: this.fb.array([]), // lưu các ảnh đã upload
        });
    }

    onImageChange(event: any, variantIndex: number) {
        const files = event.target.files;
        if (!files.length) return;

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]); // files[i] là một đối tượng File
        }
        this.imageUploaderService.uploadImagesToCloudinary(formData).subscribe({
            next: ({ message, images }) => {
                alert('Ảnh đã tải lên thành công!');
                images.forEach((img, i) => {
                    const imageGroup = this.fb.group({
                        image_url: [img.image_url],
                        public_id: [img.public_id],
                        is_main_image: [i === 0], // ảnh đầu tiên làm ảnh chính
                        display_order: [i],
                    });
                    const imagesArray = this.variantsArray
                        .at(variantIndex)
                        .get('images') as FormArray;
                    imagesArray.push(imageGroup);
                });
            },
            error: (error) => {
                alert(
                    `Tải ảnh lên thất bại! Lỗi: ${
                        error.message || error.statusText
                    }`
                );
            },
        });
    }

    getImageControls(variant: AbstractControl) {
        return (variant.get('images') as FormArray).controls;
    }

    addVariant() {
        this.variantsArray.push(this.createVariantGroup());
    }

    deleteVariant(variantIndex: number) {
        this.variantsArray.removeAt(variantIndex);
    }

    onCategoryChange(category: Category) {
        category.checked = !category.checked;
        const categoryId = category.id;
        const current = this.productForm.value.categoryIds as number[];

        if (category.checked) {
            this.productForm.patchValue({
                categoryIds: [...current, categoryId],
            });
        } else {
            this.productForm.patchValue({
                categoryIds: current.filter((id) => id !== categoryId),
            });
        }
    }

    onSubmit() {
        if (this.productForm.valid) {
            this.productService
                .createProduct(this.productForm.value)
                .subscribe({
                    next: (res) => {
                        this.productForm.reset();
                        this.categories.forEach(
                            (item) => (item.checked = false)
                        );
                    },
                    error: (err) => {
                        console.error('❌ Lỗi:', err);
                    },
                });
        }
    }
}
