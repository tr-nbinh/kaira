import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VariantImage } from '../../../models/product.interface';
import { VarianImagesService } from '../../../services/variant-images.service';

@Component({
    selector: 'app-image-uploader',
    imports: [FormsModule],
    templateUrl: './image-uploader.component.html',
    styleUrl: './image-uploader.component.scss',
})
export class ImageUploaderComponent {
    selectedFile: File | null = null;
    currentVariantId: number = 1; // ID biến thể mặc định để test
    variantImages: VariantImage[] = [];

    // URL gốc của Next.js API Routes của bạn
    // Nếu Next.js chạy trên cùng một domain nhưng khác port, bạn cần thêm port
    // Hoặc nếu bạn deploy Next.js ra một domain/subdomain riêng, hãy dùng URL đầy đủ
    private readonly NEXTJS_API_BASE_URL = 'http://localhost:3000/api';

    constructor(
        private http: HttpClient,
        private imageUploaderService: VarianImagesService
    ) {}

    ngOnInit(): void {
        // Tải ảnh cho ID biến thể mặc định khi component khởi tạo
        this.fetchImagesForVariant(this.currentVariantId);
    }

    // Lắng nghe sự kiện thay đổi của input Variant ID
    onVariantIdChange() {
        if (this.currentVariantId) {
            this.fetchImagesForVariant(this.currentVariantId);
        } else {
            this.variantImages = []; // Xóa danh sách nếu không có ID biến thể
        }
    }

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0] as File;
    }

    onUpload() {
        if (!this.selectedFile || !this.currentVariantId) {
            alert('Vui lòng chọn một tệp và nhập ID biến thể.');
            return;
        }

        const formData = new FormData();
        formData.append('image', this.selectedFile, this.selectedFile.name);
        formData.append('variant_id', this.currentVariantId.toString()); // Gửi ID biến thể

        this.imageUploaderService.uploadImagesForVariant(formData).subscribe({
            next: (response) => {
                console.log('Tải lên thành công', response);
                alert('Ảnh đã tải lên thành công!');
                this.selectedFile = null; // Reset input file
                // Cập nhật danh sách ảnh cho biến thể hiện tại
                this.fetchImagesForVariant(this.currentVariantId);
            },
            error: (error) => {
                console.error('Tải lên thất bại', error);
                alert(
                    `Tải ảnh lên thất bại! Lỗi: ${
                        error.message || error.statusText
                    }`
                );
            },
        });
    }

    fetchImagesForVariant(variantId: number) {
        this.imageUploaderService
            .getImagesForVariant(variantId)
            .subscribe((res) => {
                this.variantImages = res;
            });
    }

    deleteImage(imageId: number) {
        if (confirm('Bạn có chắc chắn muốn xóa ảnh này không?')) {
            this.http
                .delete(
                    `${this.NEXTJS_API_BASE_URL}/variant-images/delete/${imageId}`
                )
                .subscribe({
                    next: (response) => {
                        console.log('Ảnh đã xóa', response);
                        alert('Ảnh đã xóa thành công!');
                        this.fetchImagesForVariant(this.currentVariantId); // Cập nhật danh sách ảnh
                    },
                    error: (error) => {
                        console.error('Lỗi khi xóa ảnh:', error);
                        alert(
                            `Xóa ảnh thất bại! Lỗi: ${
                                error.message || error.statusText
                            }`
                        );
                    },
                });
        }
    }
}
