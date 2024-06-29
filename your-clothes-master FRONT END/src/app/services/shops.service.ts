import { Shop } from './../models/Shop';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {

  constructor(private http:HttpClient) { }

  addShopUser(shop:Shop)
  {
    return this.http.post<Shop>(environment.serverJSON + environment.resourceShops + "/"+shop.idUser, shop);
  }
  getShops()
  {
    return this.http.get<Shop[]>(environment.serverJSON + environment.resourceShops);
  }
  getShopsAsAny(){
    return this.http.get<any>(environment.serverJSON + environment.resourceShops);
  }
  getShopId(id:number){
    return this.http.get<Shop>(environment.serverJSON + environment.resourceShops+"/"+id.toString());
  }
  editShop(shop:Shop)
  {
    return this.http.put<Shop>(environment.serverJSON + environment.resourceShops +"/"+shop.id.toString(), shop);
  }
  deleteShop(id:number)
  {
    return this.http.delete(environment.serverJSON + environment.resourceShops + "/" + id.toString());
  }
}
