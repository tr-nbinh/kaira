import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { UserService } from '../../../../services/user.service';

@Component({
    selector: 'app-register',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
})
export class RegisterComponent {
    registrationForm!: FormGroup;

    constructor(private fb: FormBuilder, private userService: UserService) {}

    ngOnInit() {
        this.registrationForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]], // Username field: required, min 3 characters
            email: ['', [Validators.required, Validators.email]], // Email field: required, valid email format
            password: ['', [Validators.required, Validators.minLength(6)]], // Password field: required, min 6 characters
        });
    }

    onSubmit(): void {
        if (this.registrationForm.valid) {
            // Check if the form is valid
            // Call the register method from the user service
            this.userService
                .register(this.registrationForm.getRawValue())
                .subscribe({
                    next: (response) => {
                        // Handle successful registration
                    },
                    error: (error) => {
                        // Handle registration errors
                    },
                });
        } else {
            this.registrationForm.markAllAsTouched();
        }
    }
}
