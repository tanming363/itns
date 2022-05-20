import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService } from '@itns/orders';
import { ORDER_STATUS } from '../order.constant';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-orders-details',
  templateUrl: './orders-details.component.html'
})

export class OrdersDetailsComponent implements OnInit, OnDestroy {
  order!: Order;
  orderItems: any = [];
  orderStatuses: any = [];
  selectedStatus: any | undefined;
  subscription!: Subscription;

  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this._getOrder();
    this._mapOrderStatus();
  }

  private _getOrder() {
    this.subscription = this.route.params.subscribe(params => {
      if (params['id']) {
        this.ordersService.getOrder(params['id']).subscribe(order => {
          this.order = order;
          this.selectedStatus = order.status;
          if (order.orderItems) {
            this.orderItems = order.orderItems;
          }
        })
      }
    })
  }

  private _mapOrderStatus() {
    this.orderStatuses = Object.keys(ORDER_STATUS).map(key => {
      return {
        id: key,
        name: ORDER_STATUS[key].label
      }
    })
  }

  onStatusChange(event: any) {
    this.ordersService.updateOrder({ status: event.value }, this.order.id as string)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success', summary: 'Success', detail: `Order is updated`
          })
        },
        error: () => this.messageService.add({
          severity: 'error', summary: 'Error', detail: `Order is not updated`
        }),
        complete: () => console.info('complete')
      });
  }


  goBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
