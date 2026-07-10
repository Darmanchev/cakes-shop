export interface CreateOrderInput {
  name: string;
  phone: string;
  productId: string;
  date: string;
  comment?: string;
}

export type OrderFormStatus = 'idle' | 'sending' | 'success' | 'error';
