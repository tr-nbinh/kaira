import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-newsletter',
  imports: [TranslatePipe],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss'
})
export class NewsletterComponent {

}
