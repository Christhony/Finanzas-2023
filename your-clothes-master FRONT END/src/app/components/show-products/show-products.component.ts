import { Shop } from 'src/app/models/Shop';
import { HttpClient } from '@angular/common/http';
import { User } from './../../models/User';
import {
  Product,
  ProductImage,
  Condition,
  Gender,
  Material,
  Pricetype,
  Season,
  Size,
  Type,
} from './../../models/Product';
import { ProductsService } from './../../services/products.service';
import { Component, Input, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-show-products',
  templateUrl: './show-products.component.html',
  styleUrls: ['./show-products.component.css'],
})
export class ShowProductsComponent implements OnInit {
  @Input() productslist!: Product[];
  @Input() iduser?: number;
  @Input() quantity?: number;
  @Input() filters?: boolean;
  @Input() shoppage?: boolean;

  constructor(
    private productServices: ProductsService,
    private http: HttpClient) {}

  ngOnInit(): void {
    this.getProducts();
    this.myImage();
    this.getFilters();
    this.productsfilter();
  }




  allproducts!: Product[];
  getproducts!: Product[];
  products: Product[] = [];
  getProducts() {
    this.productServices.getProducts().subscribe((data: Product[]) => {
      this.allproducts = data;
      if (this.quantity != undefined) {
        while (this.products.length < this.quantity) {
          let random = Math.floor(Math.random() * this.productslist.length);

          if (!this.products.includes(this.productslist[random])) {
            this.products.push(this.productslist[random]);
          }
        }
      }
      this.allproducts = this.products;
      this.getproducts = this.products;
      this.paginator();
    });
  }

  max:number = 12;
  pagenow: number = 1;
  pages: number = 1;
  pagesarray:number[] = [];
  paginator()
  {
    console.log(this.products.length);
    this.pages = Math.ceil(this.allproducts.length/this.max);
    console.log("pages + " + this.pages);
    console.log(this.products);
    this.products = this.allproducts.slice((this.pagenow-1)*this.max, (this.pagenow)*this.max);
    console.log(this.products);
  }

  next()
  {
    this.pagenow = this.pagenow+ 1;
    this.paginator();
    console.log(this.pagenow);
  }
  previous()
  {
    this.pagenow = this.pagenow- 1;
    this.paginator();
    console.log(this.pagenow);
  }

  imgs: ProductImage[] = [];
  myImage() {
    this.productServices.getImages().subscribe((data: ProductImage[]) => {
      this.imgs = data;
    });
  }

  seasonschecked: string[] = [];
  seasonfilter(e: MatCheckboxChange) {
    if (e.checked) {
      this.seasonschecked.push(e.source.value);
    } else {
      if (this.seasonschecked.includes(e.source.value)) {
        this.seasonschecked = this.seasonschecked.filter(
          (season) => season != e.source.value
        );
      }
    }
    this.createList();
  }
  genderchecked: string[] = [];
  genderFilter(e: MatCheckboxChange) {
    if (e.checked) {
      this.genderchecked.push(e.source.value);
    } else {
      if (this.genderchecked.includes(e.source.value)) {
        this.genderchecked = this.genderchecked.filter(
          (gender) => gender != e.source.value
        );
      }
    }
    console.log(this.genderchecked);
    this.createList();
  }
  sizechecked: string[] = [];
  sizefilter(e: MatCheckboxChange) {
    if (e.checked) {
      this.sizechecked.push(e.source.value);
    } else {
      if (this.sizechecked.includes(e.source.value)) {
        this.sizechecked = this.sizechecked.filter(
          (size) => size != e.source.value
        );
      }
    }
    console.log(this.sizechecked);
    this.createList();
  }
  pricetypechecked: string[] = [];
  pricetypefilter(e: MatCheckboxChange) {
    if (e.checked) {
      this.pricetypechecked.push(e.source.value);
    } else {
      if (this.pricetypechecked.includes(e.source.value)) {
        this.pricetypechecked = this.pricetypechecked.filter(
          (pricetype) => pricetype != e.source.value
        );
      }
    }
    console.log(this.pricetypechecked);
    this.createList();
  }

  createList() {
    if (this.seasonschecked.length == 0 && this.genderchecked.length == 0 && this.sizechecked.length == 0 && this.pricetypechecked.length == 0) 
    {
      this.allproducts = this.getproducts;
      this.products = this.allproducts;
      this.paginator();
    } 
    else 
    { 
      this.productsshow = [];
      if (this.pricetypechecked.length > 0) 
      {
        if(this.productsshow.length == 0)
        {
          this.productsshow = this.productsall;
        }
        let prodtemp: Product[] = [];
        for (let pricetype of this.pricetypechecked) 
        {
          this.productsshow.forEach((prod) => 
          {
            if (prod.pricetype == pricetype) 
            {
              prodtemp.push(prod);
            }
          });
        }
        this.productsshow = prodtemp;
      }
      if (this.seasonschecked.length > 0) 
      {
        if(this.productsshow.length == 0)
        {
          this.productsshow = this.productsall;
        }
        let prodtemp: Product[] = [];
        for (let season of this.seasonschecked) 
        {
          this.productsshow.forEach((prod) => 
          {
            if (prod.season == season) 
            {
              prodtemp.push(prod);
            }
          });
        }
        this.productsshow = prodtemp;
      }

      if (this.genderchecked.length > 0) 
      {
        if(this.productsshow.length == 0)
        {
          this.productsshow = this.productsall;
        }
        let prodtemp: Product[] = [];
        for (let gender of this.genderchecked) 
        {
          this.productsshow.forEach((prod) => 
          {
            if (prod.gender == gender) 
            {
              prodtemp.push(prod);
            }
          });
        }
        this.productsshow = prodtemp;
      }
      if (this.sizechecked.length > 0) 
      {
        if(this.productsshow.length == 0)
        {
          this.productsshow = this.productsall;
        }
        let prodtemp: Product[] = [];
        for (let size of this.sizechecked) 
        {
          this.productsshow.forEach((prod) => 
          {
            if (prod.size == size) 
            {
              prodtemp.push(prod);
            }
          });
        }
        this.productsshow = prodtemp;
      }
      this.products = this.productsshow;
      this.allproducts = this.products;
      this.paginator();
    }
  }

  productsall: Product[] = [];
  productsshow: Product[] = [];
  productsfilter() {
    this.productServices.getProducts().subscribe((data: Product[]) => {
      this.productsall = data;
      this.productsshow = data;
    });
  }

  condition!: Condition[];
  genders!: Gender[];
  materials!: Material[];
  pricetypes!: Pricetype[];
  seasons!: Season[];
  sizes!: Size[];
  types!: Type[];

  getFilters() {
    this.productServices.getConditions().subscribe((data: Season[]) => {
      this.condition = data;
    });
    this.productServices.getGender().subscribe((data: Gender[]) => {
      this.genders = data;
    });
    this.productServices.getMaterials().subscribe((data: Material[]) => {
      this.materials = data;
    });
    this.productServices.getPricetype().subscribe((data: Pricetype[]) => {
      this.pricetypes = data;
    });
    this.productServices.getSeasons().subscribe((data: Season[]) => {
      this.seasons = data;
    });
    this.productServices.getSizes().subscribe((data: Season[]) => {
      this.sizes = data;
    });
    this.productServices.getTypes().subscribe((data: Season[]) => {
      this.types = data;
    });
  }
}
