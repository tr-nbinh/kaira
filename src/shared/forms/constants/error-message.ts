export interface TranslationErrorResult {
    key: string;
    params?: Record<string, any>;
}

export const ERROR_MESSAGES: Record<
    string,
    (args?: any) => TranslationErrorResult
> = {
    required: () => ({ key: 'VALIDATION.REQUIRED' }),
    email: () => ({ key: 'VALIDATION.EMAIL_INVALID' }),
    minlength: (args) => ({
        key: 'VALIDATION.MIN_LENGTH',
        params: { requiredLength: args.requiredLength },
    }),

    maxlength: (args) => ({
        key: 'VALIDATION.MAX_LENGTH',
        params: { requiredLength: args.requiredLength },
    }),
    pattern: () => ({ key: 'VALIDATION.PATTERN_INVALID' }),
    passwordMismatch: () => ({ key: 'VALIDATION.PASSWORD_MISMATCH' }),
    emailExists: () => ({ key: 'VALIDATION.EMAIL_EXISTS' }),

    // Login
    invalidCredentials: () => ({ key: 'SERVER_ERROR.INVALID_CREDENTIALS' }),
    emailNotVerified: (args) => ({
        key: 'SERVER_ERROR.EMAIL_NOT_VERIFIED',
        params: { email: args.email },
    }),

    // otp
    otpIncorrect: (args) => ({
        key: 'SERVER_ERROR.OTP_INCORRECT',
        params: { remainingAttempts: args.remainingAttempts },
    }),
};

export const ERROR_CODE_MAP = {
    EMAIL_EXISTS: 'emailExists',
    PASSWORD_WEAK: 'passwordWeak',
    EMAIL_NOT_VERIFIED: 'emailNotVerified',
    INVALID_CREDENTIALS: 'invalidCredentials',
    OTP_INCORRECT: 'otpIncorrect',
};
