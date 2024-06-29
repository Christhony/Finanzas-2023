import { ShoppingCartService } from './../../services/shopping-cart.service';
import { CartxProduct, ShoppingCart } from './../../models/Shopping-Cart';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from './../../services/users.service';
import { User } from './../../models/User';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {


  myForm!: FormGroup;
  constructor(private formBuilder:FormBuilder,
              private userService:UsersService,
              private snackBar:MatSnackBar,
              private route:Router,
              private activatedRoute:ActivatedRoute,
              
              private shoppingcartService:ShoppingCartService) { }

  ngOnInit(): void {
    this.formSignUp();
  }
  f(campo:string){
    return this.myForm.get("campo")
  }
  
  formSignUp()
  {
    this.myForm = this.formBuilder.group(
      {
         id:[""],
        name:["",[Validators.required,Validators.maxLength(20),Validators.pattern('^[a-zA-Z ]*$')]],
        lastname:["",[Validators.required,Validators.maxLength(20),Validators.pattern('^[a-zA-Z ]*$')]],
        email:["",[Validators.required,Validators.email,Validators.maxLength(20)]],
        password:["",[Validators.required,Validators.minLength(5),Validators.maxLength(8)]],
      }
    )
    this.myForm.markAllAsTouched();
    this.myForm.updateValueAndValidity();
  }
  /* validateForm():void {
    password = this.myForm.get("password")?.value;
    confirm_password = this.myForm.get("confirmpassword")?.value;
    if (password !== confirmpassword) {
      alert("Las contraseñas no coinciden");
      return false;
    }
  }*/

  saveUser():void
  {
    const user:User = {
      id:0,
      name: this.myForm.get("name")!.value,
      lastname: this.myForm.get("lastname")!.value,
      email: this.myForm.get("email")!.value,
      password: this.myForm.get("password")!.value,
      dni: 0,
      phone: 0,
      adress: "",
    };

    
    if( this.myForm.valid ){

      this.userService.addUser(user).subscribe({
          
        next: (data)=>{
          const cart:ShoppingCart ={
            id:0,
            id_user: data.id,
            total_purchase: 0,
            quantity_products: 0,
          }
          //alert("La cuenta se creó correctamente")
          setTimeout(() => {
  
            this.shoppingcartService.createShoppingCart(cart).subscribe()
            this.snackBar.open("La cuenta se creó correctamente.", '', {
              duration: 2000,
                      });
            this.route.navigate(["/login"]);
          }, 2000)
        },
        error: (err) => {
          //alert("Error para registrar usuario")
          this.snackBar.open('Debe completar los campos', '', {
            duration: 2000,
                    });
          this.route.navigate(["/login"]);
        }
      });


    }else{
      this.snackBar.open("Debe completar los campos requeridos", '',{
        duration: 3000,
                });
    }


    

  }

}
