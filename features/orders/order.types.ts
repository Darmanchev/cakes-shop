export type OrderFormStatus =
    | 'idle'
    | 'sending'
    | 'success'
    | 'error';

export type OrderFormField =
    | 'name'
    | 'phone'
    | 'email'
    | 'productId'
    | 'quantity'
    | 'date'
    | 'deliveryType'
    | 'deliveryAddress'
    | 'comment';

export type OrderFieldErrors = Partial<Record<OrderFormField, string[]>>;

export interface OrderApiErrorResponse {
    error: string;
    fieldErrors?: OrderFieldErrors;
}
