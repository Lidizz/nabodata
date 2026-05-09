'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { search } from '@nabodata/api-client';
import type { KommuneSummary } from '@nabodata/types';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3002';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<KommuneSummary[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await search(API_URL, query.trim(), 'nb');
        setResults(data.results);
        setOpen(data.results.length > 0);
      } catch {
        setResults([]);
      }
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function handleSelect(k: KommuneSummary) {
    setQuery('');
    setOpen(false);
    router.push(`/nb/kommune/${k.slug}`);
  }

  return (
    <div className="relative w-full">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Søk etter kommune eller fylke"
        className="w-full rounded-3 px-4 py-2.5 text-body shadow-2 outline-none focus:ring-2"
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border-1)',
          color: 'var(--fg-1)',
          backdropFilter: 'blur(12px)',
          // @ts-expect-error custom property
          '--tw-ring-color': 'var(--accent-ring)',
        }}
        aria-label="Søk etter kommune eller fylke"
        aria-autocomplete="list"
        aria-expanded={open}
      />
      {open && (
        <ul
          className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-3 shadow-3"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border-1)' }}
          role="listbox"
        >
          {results.map((k) => (
            <li key={k.id} role="option" aria-selected={false}>
              <button
                className="w-full px-4 py-2.5 text-left text-body transition-colors hover:bg-surface-2"
                style={{ color: 'var(--fg-1)' }}
                onClick={() => handleSelect(k)}
              >
                {k.name.nb}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
