
import { Product } from './../../models/Product';
import { ProductsService } from 'src/app/services/products.service';
import { ShopsService } from 'src/app/services/shops.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Shop } from './../../models/Shop';
import { HttpClient } from '@angular/common/http';
import { DialogdeleteComponent } from './../dialogdelete/dialogdelete.component';
import { User } from './../../models/User';
import { UsersService } from './../../services/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {  MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  id?:number;
  constructor(private router:Router,
              private activatedRouter:ActivatedRoute,
              private userService:UsersService,
              private shopService:ShopsService,
              private dialog:MatDialog,
              private http:HttpClient,
              private snackBar:MatSnackBar,
              private productService:ProductsService) { }

  ngOnInit(): void {
    this.id= this.activatedRouter.snapshot.params["id"];
    this.loadDetails();
    this.findShop();
  }

  user!: User;
  loadDetails()
  {
    if(this.id!=undefined && this.id!= 0)
    {
      this.userService.getUserId(this.id).subscribe(
        {
          next: (data:User) =>{
            this.user = data;
          },
          error: (err) =>{
            this.router.navigate([""]);
            console.log(err);
          }
        }
      );
    }
    else
    {
      this.router.navigate(["/login"]);
    }
  }




  shops?:Shop[];
  shopfound?: Shop;
  findShop()
  {
    this.shopService.getShops().subscribe(
      (data:Shop[])=>{
        this.shops = data;
        this.shops.forEach(shop =>{
          if(shop.idUser == this.id)
          {
            this.shopfound = shop;
          }
        })
      }
    );
  }

  openDialog(): void {
    const dialogREF = this.dialog.open(DialogdeleteComponent,{
      width: '350px',
    });
    
    dialogREF.afterClosed().subscribe(
      res=>{
        console.log(res);
        if(res)
        {
          if(this.user!= undefined)
          {
            this.userService.deleteUser(this.user.id).subscribe({
              next: (data) =>
              {
                if(this.shopfound){
                  this.shopService.deleteShop(this.shopfound.id).subscribe(
                    next=>{
                      this.productService.getProducts().subscribe(
                        (data:Product[])=>{
      
                          if(data.length > 0)
                          {
                            data.forEach(product => {
                              if(product.idShop == this.shopfound?.id){
                                this.productService.deleteProduct(product.id).subscribe();
                              }
                            })
                          }
                          
                        }
                      )
                    }
                  );
                }
                this.snackBar.open("El usuario se eliminó correctamente.", "continuar");
                this.router.navigate(["/login"]);
              },
              error: (err)=>{
                console.log(err);
              }
            }
            );
          }
        }
      }
    );
  }


}