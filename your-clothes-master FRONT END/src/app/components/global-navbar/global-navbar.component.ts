import { UsersService } from './../../services/users.service';
import { User } from './../../models/User';
import { HttpClient } from '@angular/common/http';
import { Shop } from './../../models/Shop';
import { Component, Input, OnInit } from '@angular/core';
import { ShopsService } from 'src/app/services/shops.service';

@Component({
  selector: 'app-global-navbar',
  templateUrl: './global-navbar.component.html',
  styleUrls: ['./global-navbar.component.css']
})
export class GlobalNavbarComponent implements OnInit {

  @Input() userID?: number;
  constructor(private shopService:ShopsService,
              private http:HttpClient,
              private userService:UsersService) { }

  ngOnInit(): void {
    this.getuser();
    this.HaveAShop();
  }


  user?:User;
  getuser()
  {
    if(this.userID != undefined && this.userID != 0)
    {
      this.userService.getUserId(this.userID).subscribe(
        (data:User)=>{
          this.user = data;
        }
      );
    }
  }

  shopUser?:Shop;
  HaveAShop()
  {
    this.shopService.getShopsAsAny().subscribe(
      res=>{
        const shop = res.find((a:Shop)=>{
          return a.idUser == this.userID;
        });
        if(shop){
          this.shopUser= shop;
        }else{
          console.log("No tiene tienda");
        }
    });
  }

}
