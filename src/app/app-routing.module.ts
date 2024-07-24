import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { HomeComponent } from './modules/home/home.component';
import { FullwidthComponent } from './layouts/fullwidth/fullwidth.component';
import { RegisterComponent } from './modules/register/register.component';
import { LoginComponent } from './modules/login/login.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { ManageUserComponent } from './modules/manageUser/manageUser.component';
import { ManageProductComponent } from './modules/manageProduct/manageProduct.component';
import { ProductComponent } from './modules/product/product.component';
import { UpdateProductComponent } from './modules/updateProduct/updateProduct.component';
import { ReportComponent } from './modules/report/report.component';
import { ProducyHomeComponent } from './modules/producyHome/producyHome.component';
import { UserprofileComponent } from './modules/userprofile/userprofile.component';
import { ProductDetailsComponent } from './modules/productDetails/productDetails.component';
import { CartComponent } from './modules/cart/cart.component';
import { PaymentComponent } from './modules/payment/payment.component';
import { OrderComponent } from './modules/order/order.component';
import { UpdateOrderComponent } from './modules/updateOrder/updateOrder.component';
import { UserproductComponent } from './modules/userproduct/userproduct.component';
import { UserhomeComponent } from './modules/userhome/userhome.component';


const routes: Routes = [
  {
    path: '',
    component: FullwidthComponent,
    children: [{
      path: 'home',
      component: HomeComponent
    },{
      path: 'register',
      component: RegisterComponent
    },{
      path: 'login',
      component: LoginComponent
    },{
      path: 'profile',
      component: ProfileComponent
    },{
      path: 'manage-user',
      component: ManageUserComponent
    },{
      path: 'profile/:userId',
      component: ProfileComponent
    },{
      path: 'manage-product',
      component: ManageProductComponent
    },{
      path: 'product',
      component: ProductComponent
    },{
      path: 'product/:productId',
      component: UpdateProductComponent
    },{
      path: 'report',
      component: ReportComponent
    },{
      path: 'product-home',
      component: ProducyHomeComponent
    },{
      path: 'user-profile',
      component: UserprofileComponent
    
    },{
      path: 'product-details',
      component: ProductDetailsComponent
    },{
      path: 'cart',
      component: CartComponent
    },{
      path: 'payment',
      component: PaymentComponent
    },{
      path: 'order',
      component: OrderComponent
    },{
      path: 'update-order/:orderId',
      component: UpdateOrderComponent
    },{
      path: 'user-product',
      component: UserproductComponent
    },{
      path: '',
      component: UserhomeComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
