import { ProductsService } from './../../services/products.service';
import { Product } from './../../models/Product';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShopsService } from './../../services/shops.service';
import { Shop } from './../../models/Shop';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop-form',
  templateUrl: './shop-form.component.html',
  styleUrls: ['./shop-form.component.css']
})
export class ShopFormComponent implements OnInit {

  id!:number;
  shopid!:number;
  myForm!:FormGroup;
  constructor(private formBuilder:FormBuilder,
              private activatedrouter:ActivatedRoute,
              private router:Router,
              private shopService:ShopsService,
              private snackBar:MatSnackBar,
              private http:HttpClient,
              private productService:ProductsService) { }

  ngOnInit(): void {
    this.id= this.activatedrouter.snapshot.params["id"];
    this.shopid= this.activatedrouter.snapshot.params["shopid"];
    this.formShop();
  }
    f(campo:string){
    return this.myForm.get("campo")
  }

  formShop()
  {
    this.myForm = this.formBuilder.group(
      {
        name: ["", [Validators.required, Validators.maxLength(40), Validators.pattern('^[a-zA-Z .]*$')]],
        phone: ["", [Validators.required, Validators.maxLength(9), Validators.minLength(9), Validators.pattern('^[0-9]+$')]],
        adress: ["", [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 .]+$')]],
        description: ["", [Validators.required, Validators.maxLength(200), Validators.pattern('^[a-zA-Z .]*$')]],
      }
    )

    if((this.shopid != undefined && this.shopid != 0)){
      this.shopService.getShopId(this.shopid).subscribe(
        (data:Shop) =>{
          console.log("shopid: " + this.shopid);
          this.id = data.idUser;
          this.myForm.get("name")!.setValue(data.name);
          this.myForm.get("phone")!.setValue(data.phone);
          this.myForm.get("adress")!.setValue(data.adress);
          this.myForm.get("description")!.setValue(data.descripción);
        }
      );
    }
    else{
      this.shopid = 0;
    }
  }


  saveShop()
  {
    const shop:Shop = {
      id: this.shopid,
      idUser: Number(this.id),
      name: this.myForm.get("name")!.value,
      phone: this.myForm.get("phone")!.value,
      adress: this.myForm.get("adress")!.value,
      descripción: this.myForm.get("description")!.value,
      amountProducts: 0,
      aceptación: 0
    }


    if(this.myForm.valid){



    
    if(shop.id != 0)
    {
      this.shopService.editShop(shop).subscribe({
        next: (data) =>{

          this.productService.getProducts().subscribe(
            (data:Product[]) => {
              data.forEach(product => {
                if(product.idShop == shop.id){
                  product.shopname = shop.name;
                  this.productService.editProduct(product).subscribe();
                }
              });
            }
          );
          this.snackBar.open("La tienda se editó correctamente", "continuar", {duration:2000});
          this.router.navigate(["/shop-page/", shop.name, shop.idUser]);
        },
        error:(err)=>{
          console.log(err);
        }
      })
    }
    else{
      this.shopService.addShopUser(shop).subscribe(
        {
          next:(data) =>{
            this.snackBar.open("La tienda se registro correctamente", "continuar",{duration:2000});
            this.router.navigate(["/shop-page", shop.name, shop.idUser]);
          },
          error:(err)=>{
            //alert("Error para registrar tienda")

            this.snackBar.open("La tienda se registro correctamente", "ok",{duration:2000});
            this.router.navigate(["/shop-page", shop.name, shop.idUser]);
            //this.router.navigate(["/user:id"]);
          }
        }
      );
      
    }

  }
  else{
    this.snackBar.open("Debe completar los campos requridos", "continuar",{duration:2000});
  }



  }


}
