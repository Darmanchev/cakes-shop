import { NAVIGATION_LINKS, SITE_NAME } from '@/lib/constants';

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <a href="#" className="text-xl font-semibold">
          {SITE_NAME}
        </a>
        <nav className="hidden items-center gap-6 text-sm text-stone-700 sm:flex">
          {NAVIGATION_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-rose-700">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
