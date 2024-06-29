import { ProductsService } from './../../services/products.service';
import { Component, OnInit, Input} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductImage } from 'src/app/models/Product';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {

  @Input() idproduct?: number;
  preview!:string;
  files:any = [];
  constructor(private sanitizer: DomSanitizer,
              private productServices: ProductsService) { }

  ngOnInit(): void {
  }

  capturefile(event: any):any{
    const filecaptured = event.target.files[0];
    this.base64(filecaptured).then((image:any)=>{
      this.preview = image.base;
      console.log(image);
    });

    this.files.push(filecaptured);
    console.log(event.target.files);
  }

  base64 =async($event: any) => new Promise((resolve) =>{
    const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () =>{
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error =>{
        resolve({
          base: null
        });
      };
  })

  saveImage()
  {
    if(this.idproduct != undefined && this.idproduct != 0)
    {
      const imgProduct: ProductImage = {
        id: 0,
        id_product: this.idproduct,
        img: this.preview,
      }

      this.productServices.addImage(imgProduct).subscribe();
    }
  }


}
