import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';
import { VariantImage } from '../models/product.interface';

@Injectable({
    providedIn: 'root',
})
export class VarianImagesService extends BaseService {
    getImagesForVariant(variantId: number): Observable<VariantImage[]> {
        return this.get(`variant-image/${variantId}`);
    }

    uploadImagesForVariant(data: FormData): Observable<any> {
        return this.post('upload-variant-image', data);
    }

    uploadImagesToCloudinary(data: FormData): Observable<{message: string, images: any[]}> {
        return this.post('variant-images', data);
    }
}
