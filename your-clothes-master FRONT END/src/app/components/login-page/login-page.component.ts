import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsersService } from './../../services/users.service';
import { HttpClient } from '@angular/common/http';
import { User } from './../../models/User';
import { EmailValidator, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  myForm!:FormGroup;
  constructor(private formBuilder:FormBuilder,
              private http:HttpClient,
              private userService:UsersService,
              private snackBar:MatSnackBar,
              private route:Router) { }

  ngOnInit(): void {
    this.formLogin();
  }

  formLogin()
  {
    this.myForm = this.formBuilder.group(
      {
        email:[""],
        password:[""],
      }
    )
  }

  loginUser()
  {
    let email: string; let password: string;
    email = this.myForm.get("email")?.value;
    password = this.myForm.get("password")?.value;

    this.userService.getUserAsAny().subscribe(
      res=>{
        const user = res.find((a:User)=>{
          return a.email == email && a.password == password;
        });
        if(user){
          this.snackBar.open("Ingresó correctamente.",'', {
            duration: 3000,
                    });
          this.route.navigate(["/main-page", user.id]);
          //this.route.navigate(["/user", user.id]);
        }else{
          this.snackBar.open("El correo o la contraseña son incorrectos",'', {
            duration: 3000,
                    });
        }
    });
  }




}
