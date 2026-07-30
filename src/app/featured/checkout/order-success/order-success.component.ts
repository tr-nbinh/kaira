import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-order-success',
    templateUrl: './order-success.component.html',
    imports: [RouterLink, TranslatePipe],
})
export class OrderSuccessComponent implements OnInit {
    private route = inject(ActivatedRoute);

    orderCode = signal('');

    ngOnInit() {
        // 2. Dự phòng lấy từ queryParams khi F5 lại trang (ví dụ: /order-success?code=ORD-12345)
        this.route.queryParams.subscribe((params) => {
            if (params['code']) {
                this.orderCode.set(params['code']);
            } else {
                this.orderCode.set('N/A');
            }
        });
    }
}
