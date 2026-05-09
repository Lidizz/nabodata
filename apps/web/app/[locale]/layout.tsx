import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@nabodata/types';

const supportedLocales: Locale[] = ['nb', 'en'];

function isSupportedLocale(locale: string): locale is Locale {
  return (supportedLocales as string[]).includes(locale);
}

export async function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'nb' ? 'Nabodata — Norges nabolagsintelligens' : 'Nabodata — Norwegian neighbourhood intelligence',
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  return <>{children}</>;
}
