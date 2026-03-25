import { HttpContextToken } from '@angular/common/http';

export const SHOW_TOAST = new HttpContextToken<boolean>(() => false); // Un-show is default
