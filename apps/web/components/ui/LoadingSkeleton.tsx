export function LoadingSkeleton() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'var(--bg)' }}
      aria-busy="true"
      aria-label="Laster data"
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--fs-label)',
          color: 'var(--fg-4)',
          letterSpacing: 'var(--tr-wide)',
        }}
      >
        LASTER DATA
      </div>
    </div>
  );
}
