import { UsersService } from './../../services/users.service';
import { User } from './../../models/User';
import { ProductsService } from 'src/app/services/products.service';
import { Product, ProductImage } from './../../models/Product';
import { ShopsService } from './../../services/shops.service';
import { HttpClient } from '@angular/common/http';
import { Shop } from './../../models/Shop';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  id?:number;
  constructor(private activatedRouter:ActivatedRoute,
              private http:HttpClient,
              private shopServices:ShopsService,
              private productServices:ProductsService,
              private userService:UsersService,
              private router:Router) {}

  ngOnInit(): void {
    this.id= this.activatedRouter.snapshot.params["id"];
    this.loadUser();
    this.getShops();
    this.getMyShop();
    this.getProducts();
    this.myImage();
  }

  usernow?:User;
  loadUser()
  {
    if(this.id!= undefined && this.id!= 0)
    {
      this.userService.getUserId(this.id).subscribe(
        (data:User)=>{
          this.usernow = data;
        }
      );
      console.log("log");
    }
    else
    {
      this.router.navigate(["/login"]);
    }
  }
  
  shops: Shop[] = [];
  getShops()
  {
    this.shopServices.getShops().subscribe(
      (data:Shop[]) => {
        this.shops = data;
        console.log("shops");
        
      }
    );
  }


  
  products: Product[] = [];
  allproducts: Product[] = [];
  winterProd: Product[] = [];
  offersprod: Product[] = [];
  secondary: Product[] = [];
  getProducts()
  {
    this.productServices.getProducts().subscribe(
      (data:Product[]) => {

        console.log("entry");
        this.allproducts = data;
        this.products = this.allproducts;
        this.allproducts.forEach(winter => {
          if(winter.season == "Invierno") this.winterProd.push(winter);
        })
        this.allproducts.forEach(offers => {
          if(offers.pricetype == "Oferta") this.offersprod.push(offers);
        })
        let random:Product[] = [];
        let amount = 3;
        if(this.offersprod.length < amount)
        {
          amount = this.offersprod.length;
        }
        while(random.length < amount)
        {
          let rand = Math.floor(Math.random() * this.offersprod.length);

          if (!random.includes(this.offersprod[rand])) {
            random.push(this.offersprod[rand]);
          }
        }

        this.offersprod = random;
      }
    );
  }
  amountProducts(list: Product[]):number
  {
    if(list.length <5)
    {
      return list.length;
    }else return 5;
  }

  shop!: Shop;
  getMyShop()
  {
    this.shopServices.getShopsAsAny().subscribe(
      res=>{
        const shop = res.find((a:Shop)=>{
          return a.idUser == this.id;
        });
        if(shop){
          this.shop= shop;
        }else{
          console.log("No tiene tienda");
        }
    });
  }

  images: ProductImage[] = [];
  myImage() {
    this.productServices.getImages().subscribe((data: ProductImage[]) => {
      this.images = data;
    });
  }
}
