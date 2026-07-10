import { CakeSlice, MessageCircle, Truck } from 'lucide-react';
import { InfoCard } from '@/components/ui/InfoCard';

export function OrderStepsSection() {
  return (
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
  );
}
