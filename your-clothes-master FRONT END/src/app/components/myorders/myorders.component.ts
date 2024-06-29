import { User } from './../../models/User';
import { UsersService } from './../../services/users.service';
import { Order } from './../../models/Payment';
import { PaymentsService } from './../../services/payments.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.css']
})
export class MyordersComponent implements OnInit {


  iduser!:number;

  constructor(private activatedrouter:ActivatedRoute,
              private paymentservices:PaymentsService,
              private userservices:UsersService) { }

  ngOnInit(): void {
    this.iduser = this.activatedrouter.snapshot.params["id"];
    this.getmyorders();
    this.getuser();
  }

  myuser!:User;
  getuser()
  {
    this.userservices.getUserId(this.iduser).subscribe(
      (data:User)=>
      {
        this.myuser = data;
      }
    );
  }


  myorders:Order[] = [];
  getmyorders(){

    this.paymentservices.getorders().subscribe(
      (data:Order[])=>{
        data.forEach(order=>
          {
            if(order.id_user == this.iduser)
            {
              order.orderdate = new Date(order.orderdate);
              this.myorders.push(order);
            }
          });
      }
    );

  }


}
