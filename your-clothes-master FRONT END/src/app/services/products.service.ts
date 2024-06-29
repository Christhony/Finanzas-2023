import { environment } from 'src/environments/environment.prod';
import { Product, Condition, Size, Material, Type, Season, ProductImage, Pricetype, Gender } from './../models/Product';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http:HttpClient) { }

  exportProducts(id: number)
  {
    return this.http.get(environment.serverJSON+environment.resourceProducts + "/export/excel/" + id.toString(), {responseType: "blob"});
  }


  addProduct(product:Product)
  {
    return this.http.post<Product>(environment.serverJSON+environment.resourceProducts + "/" + product.idShop, product);
  }
  getProducts(){
    return this.http.get<Product[]>(environment.serverJSON+environment.resourceProducts);
  }
  getProductId(id:number){
    return this.http.get<Product>(environment.serverJSON+environment.resourceProducts+"/"+id.toString());
  }
  editProduct(product:Product)
  {
    return this.http.put<Product>(environment.serverJSON+environment.resourceProducts+"/"+product.id.toString(), product);
  }
  deleteProduct(id:number)
  {
    return this.http.delete(environment.serverJSON+environment.resourceProducts+"/"+id.toString());
  }
  addImage(productimg:ProductImage)
  {
    return this.http.post<ProductImage>(environment.serverJSON+environment.resImages+ "/" + productimg.id_product.toString(), productimg);
  }
  getImage(id:number){
    return this.http.get<ProductImage>(environment.serverJSON+environment.resImages+ "/" + id.toString());
  }
  getImages(){
    return this.http.get<ProductImage[]>(environment.serverJSON+environment.resImages);
  }
  getImagesAsAny(){
    return this.http.get<any>(environment.serverJSON+environment.resImages);
  }
  editImage(productimg:ProductImage)
  {
    return this.http.put<ProductImage>(environment.serverJSON+environment.resImages + "/"+ productimg.id.toString(), productimg);
  }
  deleteImg(id:number)
  {
    return this.http.delete(environment.serverJSON+environment.resImages + "/" + id.toString());
  }
  getGender()
  {
    //return this.http.get<Gender[]>("http://localhost:3000/genders")
    return this.http.get<Gender[]>(environment.serverJSON + "/api/genders");
  }
  getConditions()
  {
    //return this.http.get<Condition[]>("http://localhost:3000/conditions")
    return this.http.get<Condition[]>(environment.serverJSON + "/api/conditions");
  }
  getSizes()
  {
    //return this.http.get<Size[]>(" http://localhost:3000/sizes")
    return this.http.get<Size[]>(environment.serverJSON + "/api/sizes");
  }
  getMaterials()
  {
    //return this.http.get<Material[]>("http://localhost:3000/materials")
    return this.http.get<Material[]>(environment.serverJSON + "/api/materials");
  }
  getTypes()
  {
    //return this.http.get<Type[]>("http://localhost:3000/types")
    return this.http.get<Type[]>(environment.serverJSON + "/api/types");
  }
  getSeasons()
  {
    //return this.http.get<Season[]>("http://localhost:3000/seasons")
    return this.http.get<Season[]>(environment.serverJSON + "/api/seasons");
  }
  getPricetype()
  {
    //return this.http.get<Pricetype[]>("http://localhost:3000/pricetype")
    return this.http.get<Pricetype[]>(environment.serverJSON + "/api/pricetypes");
  }
}
