import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-order-summary',
  templateUrl: './order-summary.component.html',
  styles: [
  ]
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  totalPrice!: number;
  subscription!: Subscription;
  isCheckout = false;

  constructor(
    private router: Router,
    private cartService: CartService,
    private ordersService: OrdersService,
  ) {
    this.router.url.includes('checkout') ? this.isCheckout = true : this.isCheckout = false;

  }

  ngOnInit(): void {
    this._getOrderSummary();
  }

  private _getOrderSummary() {
    this.subscription = this.cartService.cart$.pipe().subscribe(cart => {
      this.totalPrice = 0;
      if (cart) {
        cart.items?.map((item: any) => {
          this.ordersService.getProduct(item.productId)
            .pipe(take(1))
            .subscribe(product => {
              this.totalPrice += product.price * item.quantity;
            })
        })
      }
    })
  }

  onCheckOut() {
    this.router.navigateByUrl('/checkout')
  }


  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
