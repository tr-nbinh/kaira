import { TemplateRef, Type } from '@angular/core';

export interface BaseOverlayConfig<TData = unknown> {
    content: Type<unknown> | TemplateRef<unknown>;
    title?: string;
    data?: TData;
    hasBackdrop?: boolean;
    closeOnBackdropClick?: boolean;
    closeOnEsc?: boolean;
    backdropClass?: string;
}
