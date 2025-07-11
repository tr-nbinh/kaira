import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
    @Input() imageUrl: string = 'banner-large-4.jpg';
    @Input() title: string = 'Shop';
}
