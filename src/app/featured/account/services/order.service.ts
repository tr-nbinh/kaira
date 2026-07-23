import { Injectable } from '@angular/core';
import { BaseService } from '../../../../core/sevices/base.service';
import { Observable } from 'rxjs';
import { Order, OrderRequest } from '../models/order.model';

@Injectable({
    providedIn: 'root',
})
export class OrderService extends BaseService {
    private readonly _endpoint = 'orders';

    getOrders(params: OrderRequest): Observable<Order> {
        return this.get(this._endpoint, params);
    }
}
