import { environment } from 'src/environments/environment.prod';
import { ShoppingCart, CartxProduct } from './../models/Shopping-Cart';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private http:HttpClient) { }


  createShoppingCart(shoppingcart:ShoppingCart)
  {
    return this.http.post<ShoppingCart>(environment.serverJSON + environment.resCart + "/user_id/"+shoppingcart.id_user, shoppingcart);
  }
  getShoppingcart(){
    return this.http.get<ShoppingCart[]>(environment.serverJSON + environment.resCart);
  }
  updateShoppingcart(shoppingcart:ShoppingCart){
    return this.http.put<ShoppingCart>(environment.serverJSON + environment.resCart + "/" + shoppingcart.id.toString(), shoppingcart);
  }
  getShoppingcartID(id:number){
    return this.http.get<ShoppingCart>(environment.serverJSON + environment.resCart + "/"+id.toString());
  }



  getcartproduct(){
    return this.http.get<CartxProduct[]>(environment.serverJSON + environment.resCartProduct);
  }
  addcartproduct(cartproduct: CartxProduct){
    return this.http.post<CartxProduct>(environment.serverJSON + environment.resCartProduct+ "/cart_id/" + cartproduct.shopcart_id + "/product_id/" + cartproduct.product_id, cartproduct);
  }
  
  deletecartproduct(id:number)
  {
    return this.http.delete(environment.serverJSON + environment.resCartProduct + "/"+id.toString());
  }
  updatecartProduct(cartproduct:CartxProduct){
    return this.http.put<CartxProduct>(environment.serverJSON + environment.resCartProduct + "/"+ cartproduct.id.toString(), cartproduct);
  }
}
