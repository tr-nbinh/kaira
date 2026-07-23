import { ValidatorFn, Validators } from '@angular/forms';

export const VALIDATOR_MAP: Record<string, (arg?: any) => ValidatorFn> = {
    required: () => Validators.required,
    minLength: (min: string) => Validators.minLength(parseInt(min, 10)),
    email: () => Validators.email,
    pattern: (reg: string) => Validators.pattern(reg),
    // Senior Level: Custom Regex cho Biển số xe VN (Ví dụ: 51G-123.45)
    vnLicensePlate: () =>
        Validators.pattern(/^[0-9]{2}[A-Z]-[0-9]{3}\.[0-9]{2}$/),
    // Validate số điện thoại VN
    vnPhone: () => Validators.pattern(/^(0|84)(3|5|7|8|9)[0-9]{8}$/),
};
