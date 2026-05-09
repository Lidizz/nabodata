'use client';

import { useRouter, usePathname } from 'next/navigation';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(locale: 'nb' | 'en') {
    const newPath = pathname.replace(/^\/(nb|en)/, `/${locale}`);
    router.push(newPath);
  }

  const currentLocale = pathname.startsWith('/en') ? 'en' : 'nb';

  return (
    <div className="flex gap-1">
      {(['nb', 'en'] as const).map((locale) => (
        <button
          key={locale}
          onClick={() => switchTo(locale)}
          className="rounded-2 px-2 py-1 text-label font-medium transition-colors duration-fast"
          style={{
            background: currentLocale === locale ? 'var(--surface-3)' : 'transparent',
            color: currentLocale === locale ? 'var(--fg-1)' : 'var(--fg-3)',
          }}
          aria-current={currentLocale === locale ? 'true' : undefined}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
