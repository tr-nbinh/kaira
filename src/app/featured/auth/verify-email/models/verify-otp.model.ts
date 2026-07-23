export interface VerifyOtpInput {
    verificationId: string;
    otp: string;
    otpType: string;
}

export interface VerifyOtpResponse {}

export enum otpType {
    verifyemail = 'verifyemail',
    resetpassword = 'resetpassword',
    twofactor = 'twofactor',
}
