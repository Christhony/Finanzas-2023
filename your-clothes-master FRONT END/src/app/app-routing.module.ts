import { MyordersComponent } from './components/myorders/myorders.component';
import { OrdersComponent } from './components/orders/orders.component';
import { PurchasePageComponent } from './components/purchase-page/purchase-page.component';
import { ProductsFiltersComponent } from './components/products-filters/products-filters.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ShopFormComponent } from './components/shop-form/shop-form.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { NavbarLogsignComponent } from './components/navbar-logsign/navbar-logsign.component';
import { SignupPageComponent } from './components/signup-page/signup-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopPageComponent } from './components/shop-page/shop-page.component';

const routes: Routes = [
  {path: "", component:LoginPageComponent},
  {path: "login", component:LoginPageComponent},
  {path: "signup", component:SignupPageComponent},
  {path: "user/:id", component:UserDetailsComponent},
  {path: "edit/:id", component: EditUserComponent},
  {path: "shop-create/:id", component: ShopFormComponent},
  {path: "shop-edit/:shopid", component: ShopFormComponent},
  {path: "main-page/:id", component: MainPageComponent},
  {path: "products-page/:id", component: ProductsFiltersComponent},
  {path: "shop-page/:name/:id", component: ShopPageComponent},
  {path: "product-form/:shop", component: ProductFormComponent},
  {path: "product-edit/:shop/:id", component: ProductFormComponent},
  {path: "product-details/:shop/:idproduct/:id", component: ProductDetailsComponent},
  {path: "my-orders/:id", component:MyordersComponent},
  {path: "shopping-cart/:name/:id", component:ShoppingCartComponent},
  {path: "purchase/:name/:idcarrito/:id", component:PurchasePageComponent},
  {path: "orders/:idorder/:iduser", component:OrdersComponent},
  {path: "upload-images", component:UploadImageComponent},
  {path: "**", component:LoginPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
