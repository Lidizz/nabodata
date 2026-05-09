'use client';

import Link from 'next/link';

interface BreadcrumbOverlayProps {
  fylkeName?: string;
  kommuneName?: string;
}

export function BreadcrumbOverlay({ fylkeName, kommuneName }: BreadcrumbOverlayProps) {
  if (!fylkeName && !kommuneName) return null;

  return (
    <div
      className="absolute bottom-4 left-4 flex items-center gap-1 rounded-3 px-3 py-1.5 shadow-2"
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border-1)',
        fontSize: 'var(--fs-body-sm)',
        color: 'var(--fg-2)',
      }}
    >
      <Link href="/nb" className="hover:text-accent transition-colors duration-fast">
        Norge
      </Link>
      {fylkeName && (
        <>
          <span style={{ color: 'var(--fg-4)' }}>/</span>
          <span style={{ color: kommuneName ? 'var(--fg-2)' : 'var(--fg-1)', fontWeight: 500 }}>
            {fylkeName}
          </span>
        </>
      )}
      {kommuneName && (
        <>
          <span style={{ color: 'var(--fg-4)' }}>/</span>
          <span style={{ color: 'var(--fg-1)', fontWeight: 500 }}>{kommuneName}</span>
        </>
      )}
    </div>
  );
}
