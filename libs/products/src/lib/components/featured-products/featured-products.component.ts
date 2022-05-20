import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'products-featured-products',
  templateUrl: './featured-products.component.html'
})
export class FeaturedProductsComponent implements OnInit, OnDestroy {
  featuredProducts: Product[] = [];
  subscription!: Subscription;

  constructor(private productService: ProductsService) { }

  ngOnInit(): void {
    this._getFeaturedProducts()
  }

  private _getFeaturedProducts() {
    this.subscription = this.productService.getFeaturedProducts(4).subscribe(products => {
      this.featuredProducts = products;
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


}
