'use client';
import { useEffect } from 'react';
import { useMapStore } from '@nabodata/store';

export function KommuneInit({ slug }: { slug: string }) {
  const { setActiveKommuneSlug } = useMapStore();
  useEffect(() => {
    setActiveKommuneSlug(slug);
    return () => { setActiveKommuneSlug(null); };
  }, [slug, setActiveKommuneSlug]);
  return null;
}
