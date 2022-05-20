import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '@itns/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';


@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-list.component.html'
})
export class CategoriesListComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  show = false;
  subscription!: Subscription;

  constructor(
    private categoryService: CategoriesService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this._getCategoriesList();
  }

  private _getCategoriesList() {
    this.subscription = this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    })
  }

  onEditCategory(categoryId: string) {
    this.router.navigateByUrl(`categories/form/${categoryId}`);
  }

  timer() {
    this.show = true;
    setTimeout(() => {
      this._getCategoriesList();
      this.show = false;
    }, 2000);
  }

  onDeleteCategory(categoryId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this category?',
      header: 'Delete category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoryService.deleteCategory(categoryId)
          .subscribe({
            next: () => this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category is deleted' }),
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category is not deleted' }),
            complete: () => console.info('complete', this.timer())
          })
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
