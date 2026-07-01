import Image from 'next/image';
import { CakeSlice, MapPin, MessageCircle, Truck } from 'lucide-react';
import type { ReactNode } from 'react';
import { OrderForm } from '@/components/OrderForm';
import { ProductCard } from '@/components/ProductCard';
import { products, type Product } from '@/data/products';

const cakes = products.filter((product) => product.category === 'cakes');
const cinnabons = products.filter((product) => product.category === 'cinnabons');
const combos = products.filter((product) => product.category === 'combos');

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff8f2] text-stone-950">
      <header className="border-b border-stone-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="#" className="text-xl font-semibold">
            Stas Cakes
          </a>
          <nav className="hidden items-center gap-6 text-sm text-stone-700 sm:flex">
            <a href="#catalog" className="hover:text-rose-700">
              Каталог
            </a>
            <a href="#how" className="hover:text-rose-700">
              Как заказать
            </a>
            <a href="#order" className="hover:text-rose-700">
              Заявка
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-16">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-md bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-900">
            <CakeSlice size={17} aria-hidden="true" />
            Торты и синнабоны на заказ
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
            Домашняя выпечка для праздников, встреч и уютных вечеров
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
            Выберите торт, синнабон или набор, оставьте заявку, а мы уточним детали и подтвердим заказ.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#catalog" className="inline-flex h-12 items-center justify-center rounded-md bg-rose-700 px-5 text-sm font-medium text-white hover:bg-rose-800">
              Смотреть каталог
            </a>
            <a href="#order" className="inline-flex h-12 items-center justify-center rounded-md border border-stone-300 bg-white px-5 text-sm font-medium text-stone-950 hover:border-stone-950">
              Оставить заявку
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-stone-100 shadow-sm">
          <Image
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=85"
            alt="Шоколадный торт с кремом"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
      </section>

      <section id="catalog" className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">Каталог</h2>
            <p className="mt-3 text-stone-700">
              Небольшая подборка тортов, синнабонов и наборов, которые можно адаптировать под ваш повод.
            </p>
          </div>

          <ProductSection title="Торты" products={cakes} />
          <ProductSection title="Синнабоны" products={cinnabons} />
          <ProductSection title="Наборы" products={combos} />
        </div>
      </section>

      <section id="how" className="bg-[#eef6ee] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">Как работает заказ</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <InfoCard icon={<MessageCircle size={22} aria-hidden="true" />} title="1. Заявка" text="Клиент выбирает товар и оставляет контакты." />
            <InfoCard icon={<CakeSlice size={22} aria-hidden="true" />} title="2. Уточнение" text="Вы согласуете начинку, вес, дату и предоплату." />
            <InfoCard icon={<Truck size={22} aria-hidden="true" />} title="3. Получение" text="Самовывоз или доставка в согласованное время." />
          </div>
        </div>
      </section>

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
    </main>
  );
}

function ProductSection({ title, products }: { title: string; products: Product[] }) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <h3 className="mb-4 text-2xl font-semibold">{title}</h3>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function InfoCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-white p-5">
      <div className="mb-4 flex size-11 items-center justify-center rounded-md bg-emerald-100 text-emerald-900">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-700">{text}</p>
    </div>
  );
}
