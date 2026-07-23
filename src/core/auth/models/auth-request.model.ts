export interface LoginInput {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface RegisterInput {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
}
