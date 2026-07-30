import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-contact',
    imports: [TranslatePipe],
    templateUrl: './contact.component.html',
})
export class ContactComponent {
    // Đối tượng lưu trữ dữ liệu form đầu vào
    contactData = {
        fullName: '',
        email: '',
        phone: '',
        message: '',
    };

    // Các biến quản lý trạng thái UI
    isSending: boolean = false;
    formError: string | null = null;
    formSuccess: boolean = false;

    constructor() {}

    // Hàm xử lý sự kiện submit form liên hệ
    onSubmitContact(): void {
        this.formError = null;
        this.formSuccess = false;

        // 1. Kiểm tra dữ liệu hợp lệ cơ bản (Client-side validation)
        if (
            !this.contactData.fullName.trim() ||
            !this.contactData.email.trim() ||
            !this.contactData.message.trim()
        ) {
            this.formError = 'Vui lòng điền đầy đủ các thông tin bắt buộc (*).';
            return;
        }

        // Kiểm tra định dạng Email đơn giản
        const emailRegex = /^[^\s&#64;]+&#64;[^\s&#64;]+\.[^\s&#64;]+$/;
        if (!emailRegex.test(this.contactData.email)) {
            this.formError =
                'Định dạng email không hợp lệ. Vui lòng kiểm tra lại.';
            return;
        }

        this.isSending = true;

        // 2. Giả lập gọi API gửi email/lưu database trong vòng 1 giây
        setTimeout(() => {
            this.formSuccess = true;
            this.isSending = false;

            // Xóa trắng toàn bộ form sau khi gửi thành công
            this.contactData = {
                fullName: '',
                email: '',
                phone: '',
                message: '',
            };
        }, 1000);
    }
}
