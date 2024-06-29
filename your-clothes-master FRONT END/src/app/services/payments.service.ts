import { environment } from 'src/environments/environment.prod';
import { Shipping, Payment, OrderProduct, Order } from './../models/Payment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private http:HttpClient) { }

  getshippings()
  {
    return this.http.get<Shipping[]>( environment.serverJSON +"/api/shippings");
  }
  getpayments()
  {
    return this.http.get<Payment[]>(environment.serverJSON +"/api/payments");
  }


  addorderproduct(orderprod:OrderProduct)
  {
    return this.http.post<OrderProduct>(environment.serverJSON+environment.resOrderProduct + "/order_id/" + 
     orderprod.id_order.toString() + "/product_id/" + orderprod.id_product.toString(), orderprod);
  }
  getorderproducts(){
    return this.http.get<OrderProduct[]>(  environment.serverJSON+environment.resOrderProduct);
  }



  getorders()
  {
    return this.http.get<Order[]>(  environment.serverJSON + environment.resOrder);
  }
  addorder(order:Order)
  {
    return this.http.post<Order>(environment.serverJSON +  environment.resOrder + "/user_id/" + order.id_user, order);
  }
  getorderid(id:number){
    return this.http.get<Order>( environment.serverJSON +  environment.resOrder + "/" + id.toString());
  }
  
}
