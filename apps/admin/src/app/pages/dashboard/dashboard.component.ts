import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '@itns/orders';
import { ProductsService } from '@itns/products';
import { UsersService } from '@itns/users';
import { combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  statistics: any[] = [];
  subscription!: Subscription;

  constructor(
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private userSservice: UsersService,
  ) { }

  ngOnInit(): void {
    this.subscription = combineLatest([
      this.ordersService.getOrdersCount(),
      this.productsService.getProductsCount(),
      this.userSservice.getUsersCount(),
      this.ordersService.getTotalSales(),
    ]).subscribe(values => {
      this.statistics = values;
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
