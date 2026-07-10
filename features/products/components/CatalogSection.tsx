import { ProductCard } from './ProductCard';
import { getProductsByCategory } from '../product.service';
import type { Product } from '../product.types';



export async function CatalogSection() {
    const cakes = await getProductsByCategory('cakes');
    const cinnabons = await getProductsByCategory('cinnabons');
    const combos = await getProductsByCategory('combos');
    return (
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
