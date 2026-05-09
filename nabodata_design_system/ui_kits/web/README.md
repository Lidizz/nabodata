# Web UI kit — Nabodata desktop

A click-thru recreation of the desktop / wide-browser experience.

## What it shows

- Full-bleed stylized Norway map (the cartography is **abstract** — placeholder for real vector tiles).
- Floating chrome: search top-center, breadcrumb top-left, theme + language switcher top-right.
- Right-side data panel that slides in (360 ms) when a fylke is selected, expands deeper when a kommune is clicked.
- Three live themes — light / dark / color — via the top-right switcher. Choropleth and chrome retheme together.
- Stat cards, age pyramid (SVG), horizontal bar charts, KOSTRA score ring, POI cluster chips.

## Files

```
ui_kits/web/
├── index.html      ← entry point
├── App.jsx         ← state, layout
├── Map.jsx         ← Norway SVG with selectable fylker
├── TopBar.jsx      ← search · breadcrumb · theme · lang
├── DataPanel.jsx   ← right-rail panel + all charts
└── data.js         ← fake fylke / kommune data
```

## ⚠ Caveats

- The map is a stylised abstraction, **not** real Norwegian geography. Replace with Mapbox GL / MapLibre + custom raster styles when wiring to production.
- Search is non-functional; results are mocked.
- All numbers are plausible but invented; replace with SSB API data.
