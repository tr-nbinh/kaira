import { Component } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { BaseComponent } from '../../../../base/base.component';
import { ColorService } from '../../../../services/color.service';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-create-edit-color',
    imports: [ReactiveFormsModule],
    templateUrl: './create-edit-color.component.html',
    styleUrl: './create-edit-color.component.scss',
})
export class CreateEditColorComponent extends BaseComponent {
    colorForm: FormGroup;
    translationsArray: FormArray;

    constructor(private fb: FormBuilder, private colorService: ColorService) {
        super();
        this.colorForm = this.fb.group({
            hexCode: ['', Validators.required],
            translations: this.fb.array([
                this.fb.group({
                    languageCode: ['vi', Validators.required],
                    name: ['', Validators.required],
                }),
                this.fb.group({
                    languageCode: ['en', Validators.required],
                    name: ['', Validators.required],
                }),
            ]),
        });
        this.translationsArray = this.colorForm.get(
            'translations'
        ) as FormArray;
    }

    onSubmit() {
        this.colorService
            .createColor(this.colorForm.getRawValue())
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                (res) => {
                    alert('Thêm màu mới thành công');
                },
                (err) => {
                    alert('Thêm màu mới không thành công');
                }
            );
    }
}
