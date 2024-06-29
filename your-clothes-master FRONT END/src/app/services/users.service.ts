import { User } from './../models/User';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }

  addUser(user:User)
  {
    return this.http.post<User>(environment.serverJSON + environment.resourceUsers, user);
  }

  getUsers(){
    return this.http.get<User[]>(environment.serverJSON + environment.resourceUsers);
  }
  getUserId(id:number){
    return this.http.get<User>(environment.serverJSON + environment.resourceUsers+"/"+id.toString());
  }
  getUserAsAny(){
    return this.http.get<any>(environment.serverJSON + environment.resourceUsers);
  }
  editUser(user:User)
  {
    return this.http.put<User>(environment.serverJSON + environment.resourceUsers + "/"+user.id.toString(), user);
  }
  deleteUser(id:number)
  {
    return this.http.delete(environment.serverJSON + environment.resourceUsers +"/"+id.toString());
  }
}
