import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullwidthComponent } from './fullwidth.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { HomeComponent } from 'src/app/modules/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxLoadingModule } from 'ngx-loading';
import { RegisterComponent } from 'src/app/modules/register/register.component';
import { LoginComponent } from 'src/app/modules/login/login.component';
import { ProfileComponent } from 'src/app/modules/profile/profile.component';
import { ManageUserComponent } from 'src/app/modules/manageUser/manageUser.component';
import { ManageProductComponent } from 'src/app/modules/manageProduct/manageProduct.component';
import { ProductComponent } from 'src/app/modules/product/product.component';
import { UpdateProductComponent } from 'src/app/modules/updateProduct/updateProduct.component';
import { ReportComponent } from 'src/app/modules/report/report.component';
import { UserprofileComponent } from 'src/app/modules/userprofile/userprofile.component';
import { ProducyHomeComponent } from 'src/app/modules/producyHome/producyHome.component';
import { ProductDetailsComponent } from 'src/app/modules/productDetails/productDetails.component';
import { CartComponent } from 'src/app/modules/cart/cart.component';
import { PaymentComponent } from 'src/app/modules/payment/payment.component';
import { OrderComponent } from 'src/app/modules/order/order.component';
import { UpdateOrderComponent } from 'src/app/modules/updateOrder/updateOrder.component';
import { UserproductComponent } from 'src/app/modules/userproduct/userproduct.component';
import { UserhomeComponent } from 'src/app/modules/userhome/userhome.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    NgxPermissionsModule.forRoot(),
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({})
  ],
  declarations: [
    FullwidthComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    ManageUserComponent,
    ManageProductComponent,
    ProductComponent,
    UpdateProductComponent,
    ReportComponent,
    UserprofileComponent,
    ProducyHomeComponent,
    ProductDetailsComponent,
    CartComponent,
    PaymentComponent,
    OrderComponent,
    UpdateOrderComponent,
    UserproductComponent,
    UserhomeComponent
  
  ]
})
export class FullwidthModule { }
