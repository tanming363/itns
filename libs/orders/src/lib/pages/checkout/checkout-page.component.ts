import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@itns/users';
import { Subscription } from 'rxjs';
import { Cart } from '../../models/cart.model';
import { OrderItem } from '../../models/order-item.model';
import { Order } from '../../models/order.model';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  userId!: string;
  form!: FormGroup;
  isSubmitted = false;
  orderItems: OrderItem[] = [];
  countries: any[] = [];
  subscription!: Subscription;

  currentuserId!: string;

  @ViewChild('imageInput') imageInput!: ElementRef;

  constructor(
    private router: Router,
    private cartService: CartService,
    private usersService: UsersService,
    private fb: FormBuilder,
    private ordersService: OrdersService,
  ) { }

  ngOnInit(): void {
    this._initForm();
    this._getCartItems();
    this._getCountries();
    this._autoFillUserData();

  }

  private _autoFillUserData() {
    this.subscription = this.usersService.observeCurrentUser().subscribe((user) => {
      if (user) {
        this.userId = user.id as string;
        this.checkoutForm['name'].setValue(user.name);
        this.checkoutForm['email'].setValue(user.email);
        this.checkoutForm['phone'].setValue(user.phone);
        this.checkoutForm['city'].setValue(user.city);
        this.checkoutForm['country'].setValue(user.country);
        this.checkoutForm['zip'].setValue(user.zip);
        this.checkoutForm['apartment'].setValue(user.apartment);
        this.checkoutForm['street'].setValue(user.street);
      }
    });
  }

  private _initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      apartment: ['', Validators.required],
      street: ['', Validators.required],
    })
  }

  private _getCartItems() {
    const cart: Cart = this.cartService.getCart();
    this.orderItems = cart.items?.map((item) => {
      return {
        product: item.productId as string,
        quantity: item.quantity as number
      }
    }) as any;
  }

  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  goBack() {
    this.router.navigateByUrl('/cart');
  }

  placeOrder() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    const order: Order = {
      orderItems: this.orderItems,
      shippingAddress1: this.checkoutForm['street'].value,
      shippingAddress2: this.checkoutForm['apartment'].value,
      city: this.checkoutForm['city'].value,
      zip: this.checkoutForm['zip'].value,
      country: this.checkoutForm['country'].value,
      phone: this.checkoutForm['phone'].value,
      status: 0 as any,
      user: this.userId as any,
      dateOrdered: `${Date.now()}`
    };

    this.ordersService.cashOrderData(order);
    this.ordersService.createCheckOutSession(this.orderItems).subscribe(error => {
      if (error) {
        console.log("Error in redirect to payment");
      }
    })
  }

  get checkoutForm() {
    return this.form.controls;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
