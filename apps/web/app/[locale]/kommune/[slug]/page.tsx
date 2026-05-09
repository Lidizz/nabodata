import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getKommune } from '@nabodata/api-client';
import { MapCanvas } from '../../../../components/map/MapCanvas';
import { DataPanel } from '../../../../components/panel/DataPanel';
import { ThemeSwitcher } from '../../../../components/map/ThemeSwitcher';
import { SearchBar } from '../../../../components/search/SearchBar';
import { BreadcrumbOverlay } from '../../../../components/map/BreadcrumbOverlay';
import { KommuneInit } from '../../../../components/map/KommuneInit';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3002';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  try {
    const { data: kommune } = await getKommune(API_URL, slug);
    const name = locale === 'nb' ? kommune.name.nb : kommune.name.en;
    return { title: `${name} — Nabodata` };
  } catch {
    return { title: 'Nabodata' };
  }
}

export default async function KommunePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  let kommuneData;
  try {
    const { data } = await getKommune(API_URL, slug);
    kommuneData = data;
  } catch {
    notFound();
  }

  const name = locale === 'nb' ? kommuneData.name.nb : kommuneData.name.en;

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <MapCanvas initialBbox={kommuneData.bbox} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 'var(--z-overlay)' }}
      >
        <div className="pointer-events-auto absolute left-4 right-4 top-4 flex items-start justify-between gap-3 md:left-4 md:right-auto md:w-96">
          <SearchBar />
        </div>
        <div className="pointer-events-auto absolute right-4 top-4">
          <ThemeSwitcher />
        </div>
        <BreadcrumbOverlay kommuneName={name} />
      </div>
      <KommuneInit slug={slug} />
      <DataPanel />
    </main>
  );
}
