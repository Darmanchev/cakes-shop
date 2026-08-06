export interface CartItem {
  productId: string;
  quantity: number;
  comment: string;
}

export interface Cart {
  items: CartItem[];
}
