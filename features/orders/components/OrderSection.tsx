import { MapPin } from 'lucide-react';
import { getProducts } from '@/features/products/product.service';
import { OrderForm } from './OrderForm';



export async function OrderSection() {
    const products = await  getProducts();
    return (
        <section id="order" className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Оставить заявку</h2>
            <p className="mt-3 leading-7 text-stone-700">
              Напишите, что хотите заказать и на какую дату. Мы свяжемся с вами, уточним детали и подтвердим стоимость.
            </p>
            <p className="mt-6 flex items-center gap-2 text-sm text-stone-700">
              <MapPin size={17} aria-hidden="true" />
              Доставка и самовывоз обсуждаются после заявки
            </p>
          </div>

          <OrderForm products={products} />
        </section>
    );
}
