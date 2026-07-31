import {
    Component,
    inject,
    signal,
    input,
    output,
    OnInit,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { AttributeService } from '../../featured/shop/services/attribute.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../../shared/services/product.service';

export interface ProductImagePayload {
    attributeValueId?: string;
    publicId: string;
    url: string;
    width: number;
    height: number;
    format: string;
    is_main: boolean;
    is_hover: boolean;
    displayOrder: number;
}

export interface AttributeOption {
    id: string;
    name: string;
    value: string;
}

@Component({
    selector: 'app-product-image-form',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './product-image-form.component.html',
})
export class ProductImageFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private attributeService = inject(AttributeService);
    private productService = inject(ProductService);

    productId = '91d69e07-c85a-4775-874f-1d1141a5908a';

    // Input nhận danh sách thuộc tính màu sắc từ trang cha
    colorOptions = toSignal(this.attributeService.getColors(), {
        initialValue: [],
    });

    // Form Array chứa danh sách hình ảnh
    imageForm: FormGroup = this.fb.group({
        images: this.fb.array([]),
    });

    get imagesArray(): FormArray {
        return this.imageForm.get('images') as FormArray;
    }

    ngOnInit(): void {
        // Thêm mặc định 1 dòng ảnh ban đầu
        if (this.imagesArray.length === 0) {
            this.addImageRow();
        }
    }

    // Tạo một FormGroup cho từng Image Item
    createImageGroup(orderIndex: number): FormGroup {
        return this.fb.group({
            productId: [this.productId],
            attributeValueId: [''], // ID màu từ DB (ví dụ: yellow.id)
            url: [
                '',
                [Validators.required, Validators.pattern(/https?:\/\/.+/)],
            ],
            publicId: ['', Validators.required],
            width: [800, [Validators.required, Validators.min(1)]],
            height: [1000, [Validators.required, Validators.min(1)]],
            format: ['jpg', Validators.required],
            is_main: [orderIndex === 1], // Ảnh đầu tiên mặc định là main
            is_hover: [orderIndex === 2], // Ảnh thứ 2 mặc định là hover
            displayOrder: [
                orderIndex,
                [Validators.required, Validators.min(1)],
            ],
        });
    }

    addImageRow(): void {
        const nextOrder = this.imagesArray.length + 1;
        this.imagesArray.push(this.createImageGroup(nextOrder));
    }

    removeImageRow(index: number): void {
        if (this.imagesArray.length > 1) {
            this.imagesArray.removeAt(index);
            this.reorderImages();
        }
    }

    // Đảm bảo chỉ có DUY NHẤT 1 ảnh được chọn làm Main
    setMainImage(selectedIndex: number): void {
        this.imagesArray.controls.forEach((control, index) => {
            const isMain = index === selectedIndex;
            control.get('is_main')?.setValue(isMain);
            if (isMain) {
                control.get('is_hover')?.setValue(false); // Đã là main thì không thể là hover
            }
        });
    }

    // Đảm bảo chỉ có DUY NHẤT 1 ảnh được chọn làm Hover
    setHoverImage(selectedIndex: number): void {
        this.imagesArray.controls.forEach((control, index) => {
            const isHover = index === selectedIndex;
            control.get('is_hover')?.setValue(isHover);
            if (isHover) {
                control.get('is_main')?.setValue(false); // Đã là hover thì không thể là main
            }
        });
    }

    // Tự động đánh lại displayOrder từ 1 -> N sau khi xóa
    private reorderImages(): void {
        this.imagesArray.controls.forEach((control, index) => {
            control.get('displayOrder')?.setValue(index + 1);
        });
    }

    // Tự động trích xuất publicId, format từ URL Cloudinary (Nếu dán thẳng link Cloudinary)
    onUrlBlur(index: number): void {
        const control = this.imagesArray.at(index);
        const urlValue = control.get('url')?.value || '';

        if (urlValue && !control.get('publicId')?.value) {
            try {
                // Ví dụ: https://res.cloudinary.com/.../v1785303382/women_bag_107_ngxgwu.jpg
                const filename = urlValue.substring(
                    urlValue.lastIndexOf('/') + 1,
                );
                const parts = filename.split('.');
                if (parts.length > 1) {
                    const format = parts.pop();
                    const publicId = parts.join('.');
                    control.patchValue({
                        publicId: publicId,
                        format: format,
                    });
                }
            } catch (e) {
                console.warn('Không tự tách được publicId từ URL', e);
            }
        }
    }

    onSubmit(): void {
        if (this.imageForm.invalid) {
            this.imageForm.markAllAsTouched();
            return;
        }

        const payload: ProductImagePayload[] = this.imagesArray.value;
        console.log('Product Image CreateMany Payload:', payload);

        this.productService.createProductImages(payload).subscribe(console.log);
    }
}
