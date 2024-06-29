import { DialogdeleteComponent } from './../dialogdelete/dialogdelete.component';
import { User } from './../../models/User';
import { UsersService } from './../../services/users.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  myForm!:FormGroup;
  id!:number;
  password!:string;
  constructor(private userService:UsersService,
              private router:Router,
              private activatedRouter:ActivatedRoute,
              private formBuilder:FormBuilder,
              private http:HttpClient,
              private snackBar:MatSnackBar,
              private dialog:MatDialog) { }

  ngOnInit(): void {
    this.id= this.activatedRouter.snapshot.params["id"];
    this.editForm();
  }



  editForm(){

    this.myForm = this.formBuilder.group(
      {
        name:["",[Validators.required,Validators.maxLength(20)]],
        lastname:["",[Validators.required,Validators.maxLength(20)]],
        email:["",[Validators.required,Validators.email]],
        dni:["",[Validators.required,Validators.minLength(8),Validators.maxLength(8), Validators.pattern(/^\d{8}$/)]],
        phone:["",[Validators.required,Validators.minLength(9),Validators.maxLength(9), Validators.pattern(/^\d{9}$/)]],
        adress:["",[Validators.required]],
      }
    )
    this.userService.getUserId(this.id).subscribe(
      (data:User)=>{
        this.myForm.get("name")!.setValue(data.name);
        this.myForm.get("lastname")!.setValue(data.lastname);
        this.myForm.get("email")!.setValue(data.email);
        this.myForm.get("dni")!.setValue(data.dni);
        this.myForm.get("phone")!.setValue(data.phone);
        this.myForm.get("adress")!.setValue(data.adress);
        this.password = data.password;
      }
    );
  }
  
  editUser()
  {
    const user:User = {
      id:this.id,
      name:this.myForm.get("name")?.value,
      lastname:this.myForm.get("lastname")?.value,
      email:this.myForm.get("email")?.value,
      dni:this.myForm.get("dni")!.value,
      phone:this.myForm.get("phone")!.value,
      adress:this.myForm.get("adress")?.value,
      password: this.password
    }

    if(this.myForm.valid ){
      this.userService.editUser(user).subscribe(

        {
          next:(data) =>{
            this.snackBar.open("Los datos se actualizaron de manera satisfactoria", '', {
              duration: 3000,
            });
            this.router.navigate(["/user", user.id]);
          },
          error:err=>{
            alert("Debe completar los campos obligatorios!")
          }
        }
      );
    }else{
      this.snackBar.open("Debe completar los campos requeridos", '',{
        duration: 3000,
                });
    }
  }
}

