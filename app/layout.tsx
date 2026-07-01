import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Stas Cakes | Торты и синнабоны',
  description: 'MVP сайта для заказа домашних тортов, синнабонов и наборов.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}
