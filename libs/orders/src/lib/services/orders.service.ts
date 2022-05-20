import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry } from 'rxjs'
import { switchMap, map } from 'rxjs/operators';;
import { environment } from "@env/environment";
import { Order } from '../models/order.model';
import { OrderItem } from '../models/order-item.model';
import { StripeService } from 'ngx-stripe';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  apiURLOrder = environment.url + 'orders';
  apiURLProducts = environment.url + 'products';

  constructor(private http: HttpClient, private stripeService: StripeService) { }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiURLOrder)
      .pipe(
        retry(5),
        map((data) => data)
      );
  }

  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiURLOrder}/${orderId}`)
      .pipe(
        retry(5),
        map((data) => data)
      );
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiURLOrder, order);
  }

  updateOrder(orderStaus: { status: string }, orderId: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiURLOrder}/${orderId}`, orderStaus);
  }

  deleteOrder(orderId: string): Observable<object> {
    return this.http.delete<object>(`${this.apiURLOrder}/${orderId}`);
  }

  getOrdersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiURLOrder}/get/count`)
      .pipe(
        map((orders: any) => orders.orderCount)
      );
  }

  getTotalSales(): Observable<number> {
    return this.http.get<number>(`${this.apiURLOrder}/get/totalsales`)
      .pipe(
        map((totalsales: any) => totalsales.totalsales)
      );
  }

  getProduct(productId: string): Observable<any> {
    return this.http.get<any>(`${this.apiURLProducts}/${productId}`);
  }

  createCheckOutSession(orderItem: OrderItem[]): Observable<any> {
    return this.http.post<any>(`${this.apiURLOrder}/create-checkout-session`, orderItem)
      .pipe(
        switchMap((session: { id: string }) => {
          return this.stripeService.redirectToCheckout({ sessionId: session.id })
        })
      );
  }

  cashOrderData(order: Order) {
    localStorage.setItem('orderData', JSON.stringify(order));
  }

  getCashedOrderData(): Order {
    return JSON.parse(localStorage.getItem('orderData') || '{}');
  }

  removeCashOrderData() {
    localStorage.removeItem('orderdata');
  }

}
