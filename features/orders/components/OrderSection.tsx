import { getProducts } from '@/features/products/product.service';
import { OrderContent } from './OrderContent';

export async function OrderSection() {
    const products = await  getProducts();
    const turnstileSiteKey = process.env.TURNSTILE_SITE_KEY?.trim();

    return <OrderContent products={products} turnstileSiteKey={turnstileSiteKey} />;
}
