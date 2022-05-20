import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartItemDetails } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-cart-page',
  templateUrl: './cart-page.component.html'
})
export class CartPageComponent implements OnInit, OnDestroy {
  cartItemsDetails: CartItemDetails[] = []
  cartCount = 0;
  subscription!: Subscription;

  constructor(
    private router: Router,
    private cartService: CartService,
    private ordersService: OrdersService,
  ) { }

  ngOnInit(): void {
    this._getCartDetails()
  }

  private _getCartDetails() {
    this.subscription = this.cartService.cart$.pipe().subscribe(resCart => {
      this.cartItemsDetails = [];
      this.cartCount = resCart.items?.length ?? 0;

      resCart.items?.forEach((cartItem) => {
        this.ordersService.getProduct(cartItem.productId as string).subscribe((resProduct) => {
          this.cartItemsDetails.push({
            product: resProduct,
            quantity: cartItem.quantity
          });
        })
      })
    })
  }

  backToShop() {
    this.router.navigateByUrl('/products');
  }

  onDeleteCartItem(cartItem: CartItemDetails) {
    this.cartService.deleteCartItem(cartItem.product.id);
  }

  updateCartItemQuantity(event: any, cartItem: CartItemDetails) {
    this.cartService.setCartItem({
      productId: cartItem.product.id,
      quantity: event.value
    }, true)
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
