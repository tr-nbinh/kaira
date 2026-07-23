import { InjectionToken } from '@angular/core';
import { BaseOverlayConfig } from '../../overlay/base-overlay.model';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalConfig<TData = any> extends BaseOverlayConfig<TData> {
    size?: ModalSize;
    width?: string;
    height?: string;
    maxWidth?: string;
    maxHeight?: string;
}

export const MODAL_DATA = new InjectionToken<any>('MODAL_DATA');
