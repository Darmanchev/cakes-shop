import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { LanguageProvider } from "@/components/language/LanguageProvider";
import { CartProvider } from "@/features/cart/CartProvider";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// A request-specific CSP nonce is injected by proxy.ts. Static HTML cannot
// carry that nonce, so all pages must render per request.
export const dynamic = "force-dynamic";

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
    <html lang="bg" data-scroll-behavior="smooth" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased text-[#4a3a35] bg-[#f7e9de]">
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
