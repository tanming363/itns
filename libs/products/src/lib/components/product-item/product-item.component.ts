import { Component, Input } from '@angular/core';
import { CartService, CartItem } from '@itns/orders';
import { Product } from '../../models/product.model';

@Component({
  selector: 'products-product-item',
  templateUrl: './product-item.component.html',
  styles: [
  ]
})
export class ProductItemComponent {
  @Input() product!: Product;
  constructor(private cartservice: CartService) { }

  addProductToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: 1
    };
    this.cartservice.setCartItem(cartItem);
  }
}
