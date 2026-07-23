import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import {
    ERROR_MESSAGES,
    TranslationErrorResult,
} from '../forms/constants/error-message';

export type ErrorMessageFactory =
    | string
    | ((errorContext: any) => TranslationErrorResult);

@Pipe({
    name: 'controlError',
})
export class ControlErrorPipe implements PipeTransform {
    transform(
        errors: ValidationErrors | null | undefined,
        customMessages: Record<string, ErrorMessageFactory> = {},
    ): TranslationErrorResult | null {
        if (!errors) return null;
        const firstKey = Object.keys(errors)[0];
        const errorContext = errors[firstKey];

        if (customMessages && customMessages[firstKey]) {
            const customValue = customMessages[firstKey];
            if (typeof customValue === 'function') {
                return customValue(errorContext);
            }
            return { key: customValue, params: errorContext };
        }

        const getMessage = ERROR_MESSAGES[firstKey];
        return getMessage
            ? getMessage(errors[firstKey])
            : { key: 'VALIDATION.INVALID' };
    }
}
