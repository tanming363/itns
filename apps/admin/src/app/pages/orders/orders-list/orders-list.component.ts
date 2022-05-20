import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrdersService } from '@itns/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ORDER_STATUS } from '../order.constant';

@Component({
  selector: 'admin-orders-list',
  templateUrl: './orders-list.component.html'
})
export class OrdersListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  show = false;
  orderStatus = ORDER_STATUS;
  subscription!: Subscription;

  constructor(
    private ordersService: OrdersService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getOrdersList();
  }

  getOrdersList() {
    this.subscription = this.ordersService.getOrders().subscribe(data => {
      this.orders = data;
    })
  }

  onShowOrder(orderId: string) {
    this.router.navigateByUrl(`orders/${orderId}`);
  }

  timer() {
    this.show = true;
    setTimeout(() => {
      this.getOrdersList();
      this.show = false;
    }, 2000);
  }

  onDeleteOrder(orderId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this Order?',
      header: 'Delete Order',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersService.deleteOrder(orderId)
          .subscribe({
            next: () => this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order is deleted' }),
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Order is not deleted' }),
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
