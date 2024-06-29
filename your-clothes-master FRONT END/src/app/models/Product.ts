export interface Product{
    id: number;
    idShop: number;
    name: string;
    shopname: string;
    pubdate: Date;
    condition: string;
    quantity: number;
    price: number;
    gender: string;
    size: string;
    material: string;
    brand: string;
    type: string;
    season: string;
    year: string;
    pricetype: string;
}
export interface ProductImage{
    id: number;
    id_product: number;
    img:string;
}
export interface Condition{
    id: number;
    name: string;
}
export interface Gender{
    id: number;
    name: string;
}
export interface Size{
    id: number;
    name: string;
}
export interface Material{
    id: number;
    name: string;
}
export interface Type{
    id: number;
    name: string;
}
export interface Season{
    id: number;
    name: string;
}
export interface Pricetype{
    id: number;
    name: string;
}
