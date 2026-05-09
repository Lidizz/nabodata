import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Nabodata',
  description: 'Utforsk demografiske og geografiske data for alle kommuner og fylker i Norge.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body>{children}</body>
    </html>
  );
}
