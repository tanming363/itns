import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

import { AccordionModule } from 'primeng/accordion';
import { NavComponent } from './shared/nav/nav.component';
import { ProductsModule } from '@itns/products';
import { UiModule } from '@itns/ui';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OrdersModule } from '@itns/orders';
import { JwtInterceptor, UsersModule } from '@itns/users';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NgxStripeModule } from 'ngx-stripe';


const routes: Routes = [{ path: '', component: HomePageComponent }];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    ProductsModule,
    AccordionModule,
    BrowserAnimationsModule,
    UiModule,
    OrdersModule,
    UsersModule,
    NgxStripeModule.forRoot('pk_test_ciUDKbrhSVnZn6rxx5jncdsR00tXRXFkUO'),
  ],
  providers: [
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'INR',
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
