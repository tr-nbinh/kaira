/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import Swiper from 'swiper';
import {
    A11y,
    EffectFade,
    Navigation,
    Pagination,
    Scrollbar,
    Thumbs,
} from 'swiper/modules';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';

Swiper.use([Navigation, Pagination, Scrollbar, A11y, Thumbs, EffectFade]);
registerLocaleData(localeVi);

bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err)
);
