import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BestSellersComponent } from './best-sellers/best-sellers.component';
import { BrandValuesComponent } from './brand-values/brand-values.component';
import { CategoriesComponent } from './categories/categories.component';
import { HomepageCategoryService } from './categories/homepage-category.service';
import { CollectionsComponent } from './collections/collections.component';
import { HeroComponent } from './hero/hero.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { NewsletterComponent } from '../../../shared/components/newsletter/newsletter.component';
import { TestimonialService } from './services/testimonial.service';
import { ProductService } from '../../../shared/services/product.service';
import { Product } from '../../../shared/models/product.model';
import { map } from 'rxjs';

@Component({
    selector: 'app-home',
    imports: [
        HeroComponent,
        CategoriesComponent,
        BestSellersComponent,
        CollectionsComponent,
        BrandValuesComponent,
        TestimonialsComponent,
        NewsletterComponent,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {
    private homeCategoryService = inject(HomepageCategoryService);
    private testimonialService = inject(TestimonialService);
    private productService = inject(ProductService);

    categories = toSignal(this.homeCategoryService.getHomeCategories(), {
        initialValue: [],
    });
    testimonials = toSignal(this.testimonialService.getTestimonials(), {
        initialValue: [],
    });
    // bestSellers = toSignal(
    //     this.productService
    //         .getProducts({
    //             limit: 4,
    //             page: 1,
    //             bestSeller: true,
    //         })
    //         .pipe(map((res) => res.data)),
    //     { initialValue: [] },
    // );
}
