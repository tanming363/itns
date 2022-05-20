import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from "@env/environment";
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  apiURLProducts = environment.url + 'products';

  constructor(private http: HttpClient) { }

  getProducts(categoriesFilter?: string[]): Observable<Product[]> {
    let params = new HttpParams();
    if (categoriesFilter) {
      params = params.append('categories', categoriesFilter.join(','));
    }
    return this.http.get<Product[]>(this.apiURLProducts, { params: params });
  }

  getProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiURLProducts}/${productId}`);
  }

  createProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiURLProducts, productData);
  }

  updateProduct(productData: FormData, productId: string): Observable<object> {
    return this.http.put<object>(`${this.apiURLProducts}/${productId}`, productData);
  }

  deleteProduct(productsId: string): Observable<object> {
    return this.http.delete<object>(`${this.apiURLProducts}/${productsId}`);
  }

  getProductsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiURLProducts}/get/count`)
      .pipe(
        map((totalproducts) => totalproducts)
      );
  }

  getFeaturedProducts(count: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiURLProducts}/get/featured/${count}`);
  }


}


