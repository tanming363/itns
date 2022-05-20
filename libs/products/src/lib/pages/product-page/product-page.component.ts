import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { Subscription } from 'rxjs';
import { CartItem, CartService } from '@itns/orders';

@Component({
  selector: 'products-paduct-page',
  templateUrl: './product-page.component.html',
  styles: [
  ]
})
export class ProductPageComponent implements OnInit, OnDestroy {
  product!: Product;
  subscription!: Subscription;
  priceBefore = 18;
  quantity = 1;

  constructor(
    private productService: ProductsService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['productId']) {
        this._getProduct(params['productId'])
      }
    })
  }

  addProductToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: this.quantity
    }
    this.cartService.setCartItem(cartItem);
  }

  private _getProduct(id?: string) {
    this.subscription = this.productService.getProduct(id as string).subscribe(restProducts => {
      this.product = restProducts;
    })
  }

  buyNow() {
    console.log("buy now");
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
