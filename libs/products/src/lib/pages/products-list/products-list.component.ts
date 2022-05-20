import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html'
})
export class ProductsListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  categories: Category[] = [];
  categoryPage!: boolean;
  subscription!: Subscription;

  constructor(
    private productService: ProductsService,
    private categoriesService: CategoriesService,
    private activatedRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      params['categoryId'] ? this._getProducts([params['categoryId']]) : this._getProducts();
      params['categoryId'] ? (this.categoryPage = true) : (this.categoryPage = false);
    });
    this._getCategories()
  }

  private _getProducts(categoriesFilter?: string[]) {
    this.subscription = this.productService.getProducts(categoriesFilter).subscribe(restProducts => {
      this.products = restProducts;
    })
  }

  private _getCategories() {
    this.subscription = this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
    })
  }

  categoryFilter() {
    const selectedCategories = this.categories
      .filter(category => category.checked)
      .map(category => category.id)

    this._getProducts(selectedCategories as string[]);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
