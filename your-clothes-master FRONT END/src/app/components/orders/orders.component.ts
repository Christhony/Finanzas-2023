import { DataSource } from '@angular/cdk/collections';
import { UsersService } from './../../services/users.service';
import { User } from './../../models/User';
import { Product } from './../../models/Product';
import { HttpClient } from '@angular/common/http';
import { ShoppingCartService } from './../../services/shopping-cart.service';
import { CartxProduct, ShoppingCart } from './../../models/Shopping-Cart';
import { PaymentsService } from './../../services/payments.service';
import { Order, OrderProduct } from './../../models/Payment';
import { ProductsService } from './../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  idorder!:number;
  iduser!:number;
  constructor(private activatedRouter:ActivatedRoute,
              private http:HttpClient,
              private route:Router,
              private productServices:ProductsService,
              private paymentsServices:PaymentsService,
              private cartServices:ShoppingCartService,
              private userservice:UsersService) { }

  ngOnInit(): void {
    this.idorder = this.activatedRouter.snapshot.params['idorder'];
    this.iduser = this.activatedRouter.snapshot.params['iduser'];
    this.myorder();
    this.getUser();
    this.getorder();
  }

  user!:User;
  getUser()
  {
    this.userservice.getUserId(this.iduser).subscribe(
      (data:User)=>{
        this.user = data;
      }
    );
  }

  my_order!:Order;
  date!:string;
  getorder()
  {
    this.paymentsServices.getorderid(this.idorder).subscribe(
      (data:Order)=>
      {
        this.my_order = data;
        this.date = data.orderdate.toString();
      }
    );
  }


  myallorder:OrderProduct[] = [];
  myorder(){
    this.paymentsServices.getorderproducts().subscribe(
      (data:OrderProduct[])=>
      {
        data.forEach(order=>
          {
            if(order.id_order == this.idorder)
            {
              this.myallorder.push(order);
              
            }
          });
      }
    );

  }




  


}
