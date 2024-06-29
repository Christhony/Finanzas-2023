export interface ShoppingCart{
    id:number;
    id_user: number;
    total_purchase: number;
    quantity_products: number;
}

export interface CartxProduct{
    id: number;
    product_id: number;
    shopcart_id:number;
    quantity: number;
}

