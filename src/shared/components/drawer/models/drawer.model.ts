import { InjectionToken, Type } from '@angular/core';
import { BaseOverlayConfig } from '../../../overlay/base-overlay.model';

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';

export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DrawerConfig<TData = any> extends BaseOverlayConfig<TData> {
    position?: DrawerPosition;
    size?: DrawerSize;
    panelClass?: string;
}

export const DRAWER_DATA = new InjectionToken<any>('DRAWER_DATA');
