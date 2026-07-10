import type { ReactNode } from 'react';

export function InfoCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-white p-5">
      <div className="mb-4 flex size-11 items-center justify-center rounded-md bg-emerald-100 text-emerald-900">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-700">{text}</p>
    </div>
  );
}
