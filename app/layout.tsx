import type { Metadata } from 'next';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/constants';
import './globals.css';

export const metadata: Metadata = {
  title: `${SITE_NAME} | Торты и синнабоны`,
  description: SITE_DESCRIPTION,
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
