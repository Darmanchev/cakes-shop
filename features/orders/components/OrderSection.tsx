import { getProducts } from '@/features/products/product.service';
import { OrderContent } from './OrderContent';

export async function OrderSection() {
    const products = await  getProducts();

    return <OrderContent products={products} />;
}
