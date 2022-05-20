import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  apiURLCategories = environment.url + 'categories';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiURLCategories);
  }

  getCategory(categoryId: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiURLCategories}/${categoryId}`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiURLCategories, category);
  }

  updateCategory(category: Category): Observable<object> {
    return this.http.put<object>(`${this.apiURLCategories}/${category.id}`, category);
  }

  deleteCategory(categoryId: string): Observable<object> {
    return this.http.delete<object>(`${this.apiURLCategories}/${categoryId}`);
  }

}
