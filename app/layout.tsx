import type { Metadata } from 'next';
import { LanguageProvider } from '@/components/language/LanguageProvider';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/constants';
import './globals.css';

// A request-specific CSP nonce is injected by proxy.ts. Static HTML cannot
// carry that nonce, so all pages must render per request.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `${SITE_NAME} | Торти и синнабони`,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
