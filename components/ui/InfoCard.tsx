import type { ReactNode } from "react";

export function InfoCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="border-t border-[#c9a899] py-5 sm:px-2">
      <div className="mb-4 text-[#7c1028]">{icon}</div>
      <h3 className="font-display text-xl font-medium">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-700">{text}</p>
    </div>
  );
}
