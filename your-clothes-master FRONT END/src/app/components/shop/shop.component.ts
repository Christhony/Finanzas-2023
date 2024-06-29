import { ShopsService } from 'src/app/services/shops.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Shop } from './../../models/Shop';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  @Input() UseriD!: number;

  constructor(private http:HttpClient,
              private formBuilder:FormBuilder,
              private shopService:ShopsService) {}
       
  ngOnInit(): void {
    this.HaveAShop();
  }

  shopUser?:Shop;
  HaveAShop()
  {
     this.shopService.getShopsAsAny().subscribe(
      res=>{
        const shop = res.find((a:Shop)=>{
          return a.idUser == this.UseriD;
        });
        if(shop){
          this.shopUser= shop;
        }else{
          console.log("No tiene tienda");
        }
    });
  }
}
