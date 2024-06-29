import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/Product';
import { Condition, Gender, Material, Pricetype, Season, Size, Type } from './../../models/Product';
import { ProductsService } from 'src/app/services/products.service';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products-filters',
  templateUrl: './products-filters.component.html',
  styleUrls: ['./products-filters.component.css']
})
export class ProductsFiltersComponent implements OnInit {

  id?:number;

  constructor(private formBuilder:FormBuilder,
              private productServices:ProductsService,
              private activatedrouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.activatedrouter.snapshot.params["id"]
    this.getFilters();
    this.productsfilter();
  }

  seasonschecked:string[] = [];
  seasonfilter(e:any)
  {
    if(e.target.checked)
    {
      this.seasonschecked.push(e.target.value);
    }
    else
    {
      if(this.seasonschecked.includes(e.target.value))
      {
        this.seasonschecked = this.seasonschecked.filter(season => season != e.target.value);
      }
    }

    console.log(this.seasonschecked);

    if(this.seasonschecked.length > 0)
    {
      this.productsshow = [];
      for(let season of this.seasonschecked)
      {
        this.allproducts.forEach(prod=>{
          if(prod.season == season)
          {
            this.productsshow.push(prod);
          }
        })
      }
      console.log(this.productsshow);
    }
    else
    {
      this.productsshow = this.allproducts;
    }
  }

  allproducts: Product[] = [];
  productsshow: Product[] = [];
  productsfilter()
  {
    this.productServices.getProducts().subscribe(
      (data:Product[])=>
      {
        this.allproducts = data;
        this.productsshow = data;
      }
    );
  }

  condition!:Condition[];
  genders!: Gender[];
  materials!: Material[];
  pricetypes!: Pricetype[];
  seasons!:Season[];
  sizes!:Size[];
  types!:Type[];

  getFilters()
  {
    this.productServices.getConditions().subscribe(
      (data:Season[])=>{
        this.condition = data;
      }
    );
    this.productServices.getGender().subscribe(
      (data:Gender[])=>{
        this.genders = data;
      }
    );
    this.productServices.getMaterials().subscribe(
      (data:Material[])=>{
        this.materials = data;
      }
    );
    this.productServices.getPricetype().subscribe(
      (data:Pricetype[])=>{
        this.pricetypes = data;
      }
    );
    this.productServices.getSeasons().subscribe(
      (data:Season[])=>{
        this.seasons = data;
      }
    );
    this.productServices.getSizes().subscribe();
    this.productServices.getTypes().subscribe();
  }


}
