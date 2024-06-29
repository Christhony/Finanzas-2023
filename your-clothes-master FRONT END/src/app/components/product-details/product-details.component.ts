import { ProductImage } from 'src/app/models/Product';
import { CartxProduct, ShoppingCart } from './../../models/Shopping-Cart';
import { ShoppingCartService } from './../../services/shopping-cart.service';
import { ShopsService } from 'src/app/services/shops.service';
import { Shop } from './../../models/Shop';
import { Product } from './../../models/Product';
import { ProductsService } from 'src/app/services/products.service';
import { User } from './../../models/User';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from './../../services/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NotExpr } from '@angular/compiler';
import {Location} from '@angular/common';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  idproduct!: number;
  iduser?: number;
  shopname!: string;

  constructor(private router:Router,
              private activatedRouter:ActivatedRoute,
              private userService:UsersService,
              private dialog:MatDialog,
              private http:HttpClient,
              private snackBar:MatSnackBar,
              private productService:ProductsService,
              private shopService:ShopsService,
              private shoppingService:ShoppingCartService,
              private location: Location) { }

  ngOnInit(): void {
    this.iduser= this.activatedRouter.snapshot.params["id"];
    this.idproduct= this.activatedRouter.snapshot.params["idproduct"];
    this.shopname= this.activatedRouter.snapshot.params["shop"];
    this.loadProduct();
    this.findShop();
    this.loadUser();
  }

  back()
  {
    this.location.back();
  }

  usernow!:User;
  loadUser()
  {
    if(this.iduser != undefined && this.iduser!= 0){
      this.userService.getUserId(this.iduser).subscribe(
        (data:User)=>{
          this.usernow = data;
          this.getMycart();
        }
      );
    }
  }

  product!: Product;
  img!: string;
  loadProduct()
  {
    this.productService.getProductId(this.idproduct).subscribe(
      {
        next: (data:Product) =>{
          this.product = data;

          this.productService.getImages().subscribe(
            (data: ProductImage[]) =>{
              data.forEach(image =>{
                if(image.id_product == this.product.id)
                {
                  this.img = image.img;
                }
              });
            }
          );
          this.getMyProducts();
        },
        error: (err) =>{
          this.router.navigate([""]);
          console.log(err);
        }
      }
    );
  }

  shop!:Shop;
  shopiduser?:number;
  findShop()
  {
    this.shopService.getShopsAsAny().subscribe(
      res=>{
        const shopfound = res.find((a:Shop)=>{
          return a.name == this.shopname;
        });
        if(shopfound){
          this.shop = shopfound;
          this.shopiduser = this.shop.idUser;
          console.log("Tienda");
        }else{
          this.snackBar.open("Usuario no encontrado", "coninuar");
        }
    });
  }

  userVerification():boolean
  {
    if(this.shop)
    {
      if(this.shop.idUser != this.iduser)
      {
        return false;
      }
      else return true;
    }
    else return false;
  }

  soldoout():boolean
  {
    if(this.product.condition == "Agotado")
    {
      return true;
    }
    else return false;
  }


  mycart!: ShoppingCart;
  getMycart(){
    this.shoppingService.getShoppingcart().subscribe(
      (data:ShoppingCart[])=>{
        data.forEach(cart => {
          if(cart.id_user == this.usernow.id)
          {
            this.mycart = cart;
          }
        })
      }
    );
  }

  added:boolean = false;
  myproducts: CartxProduct[] = [];
  getMyProducts()
  {
    this.shoppingService.getcartproduct().subscribe(
      (data:CartxProduct[])=>
      {
        data.forEach(prod => {
          if(prod.product_id == this.product.id && prod.shopcart_id == this.mycart.id)
          {
            this.added = true;
          }
        });
      }
    );
  }


  addtoCart(id:number)
  {
    const cartproduct:CartxProduct = {
      id: 0,
      product_id: this.product.id,
      shopcart_id: this.mycart.id,
      quantity: 1,
    }

    this.shoppingService.addcartproduct(cartproduct).subscribe(
      next=>{
        this.router.navigate(["/shopping-cart/", this.usernow.name, this.usernow.id]);
      }
    );
  }

  deletecart()
  {
    this.shoppingService.getcartproduct().subscribe(
      (data:CartxProduct[])=>
      {
        data.forEach(prod=>
          {
            if(prod.product_id == this.product.id && prod.shopcart_id == this.mycart.id)
            {
              this.shoppingService.deletecartproduct(prod.id).subscribe(
                next=>{
                  this.router.navigate(["/shopping-cart/", this.usernow.name, this.usernow.id]);
                }
              );
              
            }
          })
      }
    );
  }

  workingdelete()
  {
    this.shoppingService.getcartproduct().subscribe(
      (data:CartxProduct[])=>
      {
        data.forEach(prod=>
          {
            if(prod.product_id == this.product.id)
            {
              this.shoppingService.deletecartproduct(prod.id).subscribe();
            }
          });
      }
    );
    this.productService.deleteProduct(this.product.id).subscribe(
      next=>{
        this.snackBar.open("El producto se elimino correctamente", "continuar",{duration:2000});
        this.location.back();
      }
    );
  }


}
