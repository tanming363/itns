import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService, Product } from '@itns/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-products-list',
  templateUrl: './products-list.component.html'
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  show = false;
  subscription!: Subscription;

  constructor(
    private productService: ProductsService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getProductsList();
  }

  getProductsList() {
    this.subscription = this.productService.getProducts().subscribe(data => {
      this.products = data;
    })
  }

  onEditProduct(productsId: string) {
    this.router.navigateByUrl(`products/form/${productsId}`);
  }

  timer() {
    this.show = true;
    setTimeout(() => {
      this.getProductsList();
      this.show = false;
    }, 1500);
  }

  onDeleteProduct(productsId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this product?',
      header: 'Delete product',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteProduct(productsId)
          .subscribe({
            next: () => this.messageService.add({ severity: 'success', summary: 'Success', detail: 'product is deleted' }),
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'product is not deleted' }),
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
