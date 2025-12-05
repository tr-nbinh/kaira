import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { Observable } from 'rxjs';
import { Order } from '../models/order.interface';

@Injectable({
    providedIn: 'root',
})
export class OrderService extends BaseService {
    private readonly _endpoint = 'orders';

    getOrderById(orderId: number): Observable<Order> {
        return this.get(`${this._endpoint}/${orderId}`);
    }
}
