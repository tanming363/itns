import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-thankyou-page',
  templateUrl: './thank-you.component.html'
})
export class ThankYouComponent implements OnInit {
  subscription!: Subscription;
  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private cartService: CartService,
  ) { }

  ngOnInit(): void {
    const orderData = this.ordersService.getCashedOrderData();
    this.subscription = this.ordersService.createOrder(orderData).subscribe(() => {
      this.cartService.emptyCart();
      this.ordersService.removeCashOrderData();
      this.router.navigate(['/success']);
    })
  }
}
