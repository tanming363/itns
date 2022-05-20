import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsSerachComponent } from './components/products-serach/products-serach.component';
import { CategoriesBannerComponent } from './components/categories-banner/categories-banner.component';
import { RouterModule, Routes } from '@angular/router';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { InputNumberModule } from 'primeng/inputnumber';
import { UiModule } from '@itns/ui';

const routes: Routes = [
  {
    path: 'products',
    component: ProductsListComponent,
  },
  {
    path: 'category/:categoryId',
    component: ProductsListComponent,
  },
  {
    path: 'products/:productId',
    component: ProductPageComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    ButtonModule,
    CheckboxModule,
    FormsModule,
    RatingModule,
    InputNumberModule,
    UiModule,
  ],
  declarations: [
    ProductsSerachComponent,
    CategoriesBannerComponent,
    ProductItemComponent,
    FeaturedProductsComponent,
    ProductsListComponent,
    ProductPageComponent,
  ],
  exports: [
    ProductsSerachComponent,
    CategoriesBannerComponent,
    ProductItemComponent,
    FeaturedProductsComponent,
    ProductsListComponent,
    ProductPageComponent,
  ],
})
export class ProductsModule { }
