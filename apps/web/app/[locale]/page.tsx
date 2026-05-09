import { MapCanvas } from '../../components/map/MapCanvas';
import { SearchBar } from '../../components/search/SearchBar';
import { ThemeSwitcher } from '../../components/map/ThemeSwitcher';
import { DataPanel } from '../../components/panel/DataPanel';

export default function LocaleHomePage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <MapCanvas />
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
      </div>
      <DataPanel />
    </main>
  );
}
