import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Bắt buộc để sài ngModel
import { AuthService } from '../../../../core/auth/auth.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-profile-info',
    standalone: true,
    imports: [TranslatePipe, FormsModule],
    templateUrl: './profile-info.component.html',
})
export class ProfileInfoComponent {
    private authService = inject(AuthService);

    user = this.authService.currentUser;

    // Dữ liệu rỗng chuẩn bị cho form đổi mật khẩu
    passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    };

    // Các biến kiểm soát trạng thái UI/UX
    isSavingProfile: boolean = false;
    isSavingPassword: boolean = false;

    passwordError: string | null = null;
    passwordSuccess: boolean = false;

    // Hành động xử lý khi bấm cập nhật Hồ sơ cơ bản
    onUpdateProfile(): void {
        this.isSavingProfile = true;

        // Giả lập gửi API Call lên Next.js Backend trong 800ms
        setTimeout(() => {
            alert('Cập nhật thông tin tài khoản thành công!');
            this.isSavingProfile = false;
        }, 800);
    }

    // Hành động xử lý khi bấm đổi mật khẩu
    onChangePassword(): void {
        this.passwordError = null;
        this.passwordSuccess = false;

        // Validate logic cơ bản nhanh trên client
        if (
            !this.passwordData.currentPassword ||
            !this.passwordData.newPassword
        ) {
            this.passwordError = 'Vui lòng điền đầy đủ các trường mật khẩu.';
            return;
        }

        if (this.passwordData.newPassword.length < 6) {
            this.passwordError =
                'Mật khẩu mới phải có độ dài từ 6 ký tự trở lên.';
            return;
        }

        if (
            this.passwordData.newPassword !== this.passwordData.confirmPassword
        ) {
            this.passwordError = 'Xác nhận mật khẩu mới không trùng khớp.';
            return;
        }

        this.isSavingPassword = true;

        // Giả lập gửi API đổi pass
        setTimeout(() => {
            this.passwordSuccess = true;
            this.isSavingPassword = false;

            // Reset sạch form mật khẩu sau khi đổi thành công
            this.passwordData = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            };
        }, 1000);
    }
}
