import { Component } from '@angular/core';
import { BannerComponent } from './banner/banner.component';
import { BlogComponent } from './blog/blog.component';
import { CategoryComponent } from './category/category.component';
import { ClientComponent } from './client/client.component';
import { FeaturesComponent } from './features/features.component';
import { ProductComponent } from './product/product.component';
import { TestimonialComponent } from './testimonial/testimonial.component';

@Component({
  selector: 'app-home',
  imports: [BannerComponent, FeaturesComponent, CategoryComponent, ProductComponent, TestimonialComponent, BlogComponent, ClientComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
}
