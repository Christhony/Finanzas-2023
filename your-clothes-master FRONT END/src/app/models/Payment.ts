export interface Order {
  id: number;
  id_user: number;
  user_name: string;
  shippingmethod: string;
  adress_shipping: string;
  paymentmethod: string;
  quantityproducts: number;
  orderdate: Date;
  totalpaid: number;
}
export interface OrderProduct {
  id: number;
  id_order:number;
  id_product:number;
  id_shop: number;
  product: string;
  quantity: number;
  totalprice: number;
}
export interface Shipping {
  id: number;
  name: string;
}
export interface Payment {
  id: number;
  name: string;
}
