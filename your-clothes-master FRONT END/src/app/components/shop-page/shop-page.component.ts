import { ShopsService } from 'src/app/services/shops.service';
import { User } from './../../models/User';
import { UsersService } from './../../services/users.service';
import { Product } from './../../models/Product';
import { ProductsService } from './../../services/products.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Shop } from 'src/app/models/Shop';


@Component({
  selector: 'app-shop-page',
  templateUrl: './shop-page.component.html',
  styleUrls: ['./shop-page.component.css']
})
export class ShopPageComponent implements OnInit {

  shopname!:string;
  id!:number;
  constructor(private activatedRouter:ActivatedRoute, 
              private http: HttpClient,
              private snackBar:MatSnackBar,
              private productService:ProductsService,
              private router:Router,
              private userService: UsersService,
              private shopService:ShopsService,
              ) { }

  ngOnInit(): void {
    this.shopname= this.activatedRouter.snapshot.params["name"];
    this.id= this.activatedRouter.snapshot.params["id"];
    this.loadShop();
    this.getOwner();
    this.getProducts();
    this.userVerification();
  }

  shopfound!:Shop;
  loadShop()
  {
    this.shopService.getShopsAsAny().subscribe(
      res=>{
        const shop = res.find((a:Shop)=>{
          return a.name == this.shopname;
        });
        if(shop)
        {
          this.shopfound = shop;
        }
    });
  }

  userVerification():boolean
  {
    if(this.shopfound)
    {
      if(this.shopfound.idUser != this.id)
      {
        return false;
      }
      else return true;
    }
    else
    {
      return false;
    }
  }


  userfound!: User;
  getOwner(){
    this.userService.getUserId(this.id).subscribe(
      {
        next: (data:User) =>{
          this.userfound = data;
        },
        error: (err) =>{
          this.router.navigate([""]);
          console.log(err);
        }
      }
    );
  }
  products:Product[] = [];
  available:Product[] = [];
  soldout:Product[] = [];
  getProducts()
  {
    this.productService.getProducts().subscribe(
      (data:Product[]) => {
        data.forEach( product => {
          if(this.shopfound!= undefined)
          {
            if(product.idShop == this.shopfound.id){
              this.products.push(product);
              if(product.condition == "Disponible")
              {
                this.available.push(product);
              }
              else
              {
                this.soldout.push(product);
              }
            }
          }
        })
      }
    );
  }

  deleteProduct(id:number)
  {
    this.productService.deleteProduct(id).subscribe(
      next=>{
        if(this.shopfound!= undefined)
        {
          this.router.navigate(["/shop-page/", this.shopfound.name, this.userfound.id]);
        }
      }
    );
  }

  deleteStore(){
    if(this.shopfound != undefined)
    {
      this.shopService.deleteShop(this.shopfound.id).subscribe(
        next=>{
          this.products.forEach(product => {
            console.log("eliminando producto...- " + product.id + " " + product.name + " " + product.shopname);
            this.productService.deleteProduct(product.id).subscribe();
          })
          this.snackBar.open("La tienda se elimino correctamente", "continuar",{duration:2000});
          this.router.navigate(["user/", this.userfound.id]);
        }
      );
    }
  }

  export()
  {
    this.productService.exportProducts(this.shopfound.id).subscribe({
      next:(data: any)=>{
        let file = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});

        let fileURL = URL.createObjectURL(file);

        var anchor = document.createElement("a");
        anchor.download = "product_report.xlsx";
        anchor.href = fileURL;
        anchor.click();

      }
    })
  }

}
