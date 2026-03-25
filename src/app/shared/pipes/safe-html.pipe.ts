import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

@Pipe({
    name: 'safeHtml',
    standalone: true, // Nếu bạn dùng Angular 14+, nếu cũ hơn thì bỏ dòng này và khai báo trong Module
})
export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    transform(value: string | null | undefined): SafeHtml {
        if (!value) return '';

        // 1. Cấu hình DOMPurify (Tùy chọn)
        // Bạn có thể cho phép các thẻ hoặc thuộc tính cụ thể ở đây
        const config = {
            ADD_TAGS: ['iframe'], // Cho phép nhúng video Youtube nếu cần
            ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
        };

        // 2. Làm sạch HTML bằng DOMPurify
        const cleanHtml = DOMPurify.sanitize(value, config);

        // 3. Đánh dấu chuỗi đã sạch là "An toàn" để Angular không quét lại (mất Warning)
        return this.sanitizer.bypassSecurityTrustHtml(cleanHtml);
    }
}
