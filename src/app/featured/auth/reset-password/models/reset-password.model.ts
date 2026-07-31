export interface ResetPasswordInput {
    verificationId: string;
    otp: string;
    password: string;
    confirmPassword: string;
}
