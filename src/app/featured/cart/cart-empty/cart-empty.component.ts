import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cart-empty',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './cart-empty.component.html',
  styleUrl: './cart-empty.component.scss'
})
export class CartEmptyComponent {

}
