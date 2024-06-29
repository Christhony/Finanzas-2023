import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductsService } from 'src/app/services/products.service';
import { CartxProduct, ShoppingCart } from './../../models/Shopping-Cart';
import { ShoppingCartService } from './../../services/shopping-cart.service';
import { UsersService } from './../../services/users.service';
import { User } from './../../models/User';
import { ActivatedRoute, ActivationStart, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Product, ProductImage } from 'src/app/models/Product';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {


  user_id!: number;
  user_name!:string;
  constructor(private activatedRouter:ActivatedRoute,
              private router:Router,
              private userService:UsersService,
              private shoppingcartService: ShoppingCartService,
              private productService: ProductsService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.user_id= this.activatedRouter.snapshot.params["id"];
    this.user_name= this.activatedRouter.snapshot.params["name"];
    this.getimages();
    this.getUser();
  }

  user!: User;
  getUser()
  { 
    this.userService.getUserId(this.user_id).subscribe(
      (userfound:User)=>{
        this.user = userfound;
        this.getMycart();
      }
    );
  }

  mycart!: ShoppingCart;
  getMycart(){
    this.shoppingcartService.getShoppingcart().subscribe(
      (data:ShoppingCart[])=>{
        data.forEach(cart => {
          if(cart.id_user == this.user_id)
          {
            this.mycart = cart;
          }
        })
        this.allcart();
      }
    );
  }

  products_cart:CartxProduct[] = [];
  allcart()
  {
    this.shoppingcartService.getcartproduct().subscribe(
      (data:CartxProduct[])=>{
        data.forEach(prodcart => {
          if(prodcart.shopcart_id == this.mycart.id)
          {
            this.products_cart.push(prodcart);
          }
        });
        this.getProducts(); 
      }
    );
  }


  total:number = 0;
  quantity: number = 0;
  products: Product[] =[];
  soldout: Product[] = [];
  getProducts()
  {
    this.productService.getProducts().subscribe(
      (data:Product[])=>
      {
        this.products_cart.forEach(cart =>{
          data.forEach(prod=>
            {
              if(cart.product_id == prod.id)
              {
                if(prod.condition == "Disponible")
                {
                  this.products.push(prod);
                  this.quantity = this.quantity + Number(cart.quantity);
                  this.total = this.total + Number(prod.price)*Number(cart.quantity);
                }
                else
                {
                  this.soldout.push(prod);
                }
              }
            })
        })
        this.mycart.quantity_products = this.quantity;
        this.mycart.total_purchase = this.total;
        this.shoppingcartService.updateShoppingcart(this.mycart).subscribe();
      }
    );
  }

  images: ProductImage[]=[];
  getimages()
  {
    this.productService.getImages().subscribe(
      (data:ProductImage[]) =>
      {
        this.images = data;
      }
    );
  }

  deleteprod(prodid:number)
  {
    this.shoppingcartService.getcartproduct().subscribe(
      (data:CartxProduct[])=>
      {
        data.forEach(prod=>
          {
            if(prod.product_id == prodid && prod.shopcart_id == this.mycart.id)
            {
              this.mycart.quantity_products = this.mycart.quantity_products - prod.quantity;
              
              this.productService.getProductId(prodid).subscribe(
                (data:Product)=>{
                  this.mycart.total_purchase = Number(this.mycart.total_purchase) - Number(prod.quantity*data.price);
                  console.log(this.mycart.total_purchase);
                  this.shoppingcartService.updateShoppingcart(this.mycart).subscribe(
                    next=>{
                      console.log("Se actualizó el carrito");
                    }
                  );
                  }
              );
              this.shoppingcartService.deletecartproduct(prod.id).subscribe(
                next=>{
                  this.products = this.products.filter(filter => filter.id != prod.product_id);
                  this.soldout = this.soldout.filter(filter => filter.id != prod.product_id);
                  this.snackBar.open("Se eliminó el producto", "ok", {duration: 500});
                }
              );
              
            }
          })
      }
    );
  }

  Decrease(idprod:number)
  {
    this.products_cart.forEach(cart =>
      {
        if(cart.id == idprod)
        {
          cart.quantity -= 1;
          console.log(cart);
          console.log(this.products_cart);
          this.shoppingcartService.updatecartProduct(cart).subscribe(
            next=>{
              this.products.forEach(prod => {
                if(prod.id == cart.product_id){
                  console.log(this.mycart.total_purchase);
                  console.log(prod.price);
                  this.mycart.total_purchase = this.mycart.total_purchase - Number(prod.price);
                  console.log(this.mycart.total_purchase);
                  setTimeout(() => {
                    this.shoppingcartService.updateShoppingcart(this.mycart).subscribe();
                  }, 2000);
                }
              })
            }
          );
        }
      });
      this.mycart.quantity_products -=1;
  }

  Increase(idprod:number)
  {
    this.products_cart.forEach(cart =>
      {
        if(cart.id == idprod)
        {
          cart.quantity += 1;
          console.log(cart);
          console.log(this.products_cart);
          this.shoppingcartService.updatecartProduct(cart).subscribe(
            next=>{
              this.products.forEach(prod => {
                if(prod.id == cart.product_id){
                  console.log(this.mycart.total_purchase);
                  console.log(prod.price);
                  this.mycart.total_purchase = this.mycart.total_purchase + Number(prod.price);
                  console.log(this.mycart.total_purchase);
                  setTimeout(() => {
                    this.shoppingcartService.updateShoppingcart(this.mycart).subscribe();
                  }, 2000);
                }
              })
            }
          );
        }
      });
      this.mycart.quantity_products +=1;
  }
}
