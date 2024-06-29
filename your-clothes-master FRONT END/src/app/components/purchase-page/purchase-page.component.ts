import { Product } from './../../models/Product';
import { UsersService } from './../../services/users.service';
import { User } from './../../models/User';
import { ProductsService } from 'src/app/services/products.service';
import { ShoppingCartService } from './../../services/shopping-cart.service';
import { CartxProduct, ShoppingCart } from './../../models/Shopping-Cart';
import { PaymentsService } from './../../services/payments.service';
import { Payment, Shipping, OrderProduct, Order } from './../../models/Payment';
import { FormBuilder, FormsModule, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-purchase-page',
  templateUrl: './purchase-page.component.html',
  styleUrls: ['./purchase-page.component.css'],
})
export class PurchasePageComponent implements OnInit {
  user_id!: number;
  user_name!: string;
  cart_id!: number;
  spinner:boolean = false;
  buttonSelected = false;
  canSave = false;
  verificarSeleccion() {
    this.canSave = this.buttonSelected !== undefined;
  }
  buttonSelected2 = false;

  firstFormGroup = this._formBuilder.group({});
  secondFormGroup = this._formBuilder.group({});
  isLinear = true;

  
  myForm!:FormGroup;

  constructor( 
    private activatedRouter: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private paymentsServices: PaymentsService,
    private cartServices: ShoppingCartService,
    private productServices: ProductsService,
    private route:Router,
    private userservices:UsersService,
    private formbuilder:FormBuilder
  ) {}

  ngOnInit(): void {
    this.user_id = this.activatedRouter.snapshot.params['id'];
    this.user_name = this.activatedRouter.snapshot.params['name'];
    this.cart_id = this.activatedRouter.snapshot.params['idcarrito'];
    this.getshippings();
    this.getpayments();
    this.getmycart();
    this.finduser();
    this.formAdress();
  }

  myuser!:User;
  user_adress!:string;
  finduser()
  {
    this.userservices.getUserId(this.user_id).subscribe(
      (data:User)=>{

        this.myuser = data;
        this.user_adress = this.myuser.adress;
        if(this.user_adress != undefined)
        {
          this.myForm.get("adress")!.setValue(this.myuser.adress);
        }
      }
    );
  }

  formAdress()
  {
    this.myForm = this.formbuilder.group(
      {
        adress:["", [Validators.required]],
      }
    )
  }
  save_adress()
  {
    let adress: string;
    adress = this.myForm.get("adress")?.value;

    this.user_adress = adress;
    this.myuser.adress = adress;
    
    if(this.myForm.valid ){
    this.userservices.editUser(this.myuser).subscribe();    
  }  }


  value(e: MatRadioChange, radio: number) {
    if (radio == 1) {
      this.shipping = e.source.value;
    } else this.payment = e.source.value;

    if(this.shipping.name == "Recojo en tienda")
    {
      this.user_adress = "No se seleccionó delivery";
    }
  }

  shipmethods!: Shipping[];
  shipping!: Shipping;
  getshippings() {
    this.paymentsServices.getshippings().subscribe((data: Shipping[]) => {
      this.shipmethods = data;
      console.log(data);
      });
  }
  paymentsmethod!: Payment[];
  payment!: Payment;
  getpayments() {
    this.paymentsServices.getpayments().subscribe((data: Payment[]) => {
      this.paymentsmethod = data;
      console.log(data);
    });
  }

  generateToken() {
    let length = 8,
      charset =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  ordersave!: Order;
  paymentorder() {
    this.spinner = true;
    let date: Date = new Date();
    const order: Order = {
      id: 0,
      id_user: this.user_id,
      user_name: this.user_name,
      shippingmethod: this.shipping.name,
      adress_shipping: this.user_adress,
      paymentmethod: this.payment.name,
      quantityproducts: this.mycart.quantity_products,
      orderdate: date,
      totalpaid: this.mycart.total_purchase,
    };

    this.paymentsServices.addorder(order).subscribe(
      (data: Order) => {
        this.ordersave = data;
        this.saveproduct(data.id);
      }
    );
  }

  update_quantities()
  {
    for(let prod of this.myproducts)
    {
      for(let i =0; i<this.productcart.length; i++)
      {
        if(prod.id == this.productcart[i].product_id)
        {
          prod.quantity = Number(prod.quantity)-this.productcart[i].quantity;
          if(prod.quantity <=0)
          {
            prod.condition = "Agotado";
          }
          setTimeout(next => {
            this.productServices.editProduct(prod).subscribe(
              (data:Product)=>{
                console.log(data);
              }
            );
            if(i==this.productcart.length-1){
              setTimeout(() => {
                this.spinner = false;
                this.route.navigate(["/orders", this.ordersave.id, this.user_id]);
              }, 5000);
            }
          }, 5000*i);
        }
      }
      
    }
  }


  neworder: OrderProduct[] = [];
  saveproduct(idorder:number){

    for(let prod of this.myproducts)
    {
      console.log(prod);
      const orderprod: OrderProduct = {
        id: 0,
        id_order: idorder,
        id_product: prod.id,
        id_shop: prod.idShop,
        product:prod.name + ' ' + prod.size + ' ' + prod.brand + ' ' + prod.gender,
        quantity: 0,
        totalprice: 0,
      };
      this.productcart.forEach(cart => {
        if(cart.product_id == prod.id)
        {
          orderprod.quantity = cart.quantity;
          orderprod.totalprice = cart.quantity*prod.price;
        }
      });
      this.neworder.push(orderprod);
    }
    console.log(this.neworder);
    setTimeout(next => {
      this.save();
    }, 3000);
  }
  save()
  {
    console.log("Proceso de pago");
    for(let i= 0; i<this.neworder.length; i++)
    {
      setTimeout(next=>
      {
        this.paymentsServices.addorderproduct(this.neworder[i]).subscribe();
        console.log(this.neworder[i]);
        if(i== this.neworder.length-1)
        {
          setTimeout(() => {
            this.update_quantities();
          }, 5000);
        }
      },5000*i);
    }
  }

  productcart: CartxProduct[] = [];
  mycart!: ShoppingCart;
  getmycart() {
    this.cartServices
      .getShoppingcartID(this.cart_id)
      .subscribe((data: ShoppingCart) => {
        this.mycart = data;
        console.log(this.mycart.id);
        this.cartproducts();
      });
  }
  cartproducts() {
    this.cartServices.getcartproduct().subscribe((data: CartxProduct[]) => {
      data.forEach((prod) => {
        if (prod.shopcart_id == this.mycart.id) {
          this.productcart.push(prod);
        }
      });
      this.findProducts();
    });
  }
  allproducts: Product[] = [];
  myproducts: Product[] = [];
  findProducts() {
    this.productServices.getProducts().subscribe((data: Product[]) => {
      this.allproducts = data;
      data.forEach((prod) => {
        this.productcart.forEach((cart) => {
          if (prod.id == cart.product_id) {
            if(prod.condition == "Disponible")
            {
              this.myproducts.push(prod);
            }
          }
        });
      });
    });
  }

}
