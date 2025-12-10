import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-order-success',
    imports: [RouterLink, TranslatePipe],
    templateUrl: './order-success.component.html',
    styleUrl: './order-success.component.scss',
})
export class OrderSuccessComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private orderService: OrderService
    ) {}

    ngOnInit() {
        const orderId = this.route.snapshot.queryParamMap.get('orderId');
        if (!orderId) {
            this.router.navigate(['/']);
            return;
        }

        this.orderService.getOrderById(+orderId).subscribe({
            error: () => {
                this.router.navigate(['/']);
            },
        });
    }
}
