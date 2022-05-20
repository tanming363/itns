import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'products-categories-banner',
  templateUrl: './categories-banner.component.html'
})
export class CategoriesBannerComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  subscription!: Subscription;

  constructor(private categoryService: CategoriesService) { }

  ngOnInit(): void {
    this.subscription = this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
