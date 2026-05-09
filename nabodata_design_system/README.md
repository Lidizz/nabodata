# Nabodata Design System

> Norway from above — clean, cold air, vast clarity.

Nabodata is a Norwegian neighbourhood-intelligence platform. Users explore demographic, geographic, and social data for any area in Norway by drilling from **fylke → kommune → grunnkrets**, on a **map-first** experience that runs on the web (Next.js) and on native mobile (Expo / React Native).

This repo is the **design system**: foundations, tokens, components, and recreated screens that any designer or engineer can build against.

---

## Sources used

This design system was authored from the written brief (no codebase or Figma was attached). Design decisions are flagged where they should be reviewed by a real product owner.

- ✗ No codebase imported — please attach via the **Import** menu when ready.
- ✗ No Figma file shared.
- ✗ No real product screenshots.
- ✓ Brand voice and component scope inferred from brief.

If you have any of the above, share them and we'll re-anchor the system to ground truth.

---

## Index

```
.
├── README.md                  ← you are here
├── SKILL.md                   ← agent skill manifest (use as Claude Code skill)
├── colors_and_type.css        ← all CSS variables: color, type, space, motion
├── assets/
│   ├── logo-wordmark.svg      ← primary lockup
│   ├── logo-mark.svg          ← square mark (favicon-ready)
│   ├── favicon-32.svg
│   └── icons/                 ← Lucide subset, see ICONOGRAPHY
├── preview/                   ← cards rendered into the Design System tab
│   ├── type-*.html
│   ├── color-*.html
│   ├── choropleth-*.html
│   ├── viz-palette.html
│   ├── spacing.html
│   ├── radii.html
│   ├── elevation.html
│   ├── motion.html
│   ├── brand-*.html
│   └── component-*.html
└── ui_kits/
    ├── web/                   ← desktop & responsive web (Next.js feel)
    │   ├── README.md
    │   ├── index.html
    │   └── *.jsx
    └── mobile/                ← native mobile (Expo / RN feel) in iOS frame
        ├── README.md
        ├── index.html
        └── *.jsx
```

---

## Content fundamentals

**Voice:** plain-spoken, factual, quietly confident. Like a good map legend — every word earns its place.

**Norwegian first, English close behind.** Strings live in `nb-NO` and `en` side by side; copy is written for Norwegian and lightly adapted for international visitors. We use `bokmål`. Place names always use the Norwegian spelling (Bergen, not "Bergen, Norway").

**Person.** "Du" in Norwegian; "you" in English. Never "we" in product UI; the system never refers to itself.

**Casing.** Sentence case for everything — buttons, headings, menu items, table headers. Never Title Case. Never UPPERCASE except short eyebrow labels (≤ 12 chars, letterspaced).

**Numbers.** Norwegian formatting by default — non-breaking thin space as thousands separator (`12 480`), comma as decimal (`12,4 %`). Tabular numerals always.

**Tone examples**

| Don't | Do |
|---|---|
| 🚀 Discover your perfect neighborhood! | Se hvem som bor her. |
| Loading awesome data... | Laster data |
| Oops! Something went wrong. | Kunne ikke laste området. Prøv igjen. |
| Welcome back, explorer! | Tilbake der du var: Bergen |
| Click here to learn more | Mer om KOSTRA |

**Emoji:** never in product UI. Acceptable in marketing only when it's a Norwegian-specific symbol (🇳🇴 only with editorial intent, never decorative).

**Headlines.** Short. Often a place name + a number: `Bergen — 285 911 innbyggere`. The data does the talking.

**Microcopy.** Verbs are imperative and gentle: `Søk`, `Sammenlign`, `Last ned`. Errors describe what happened, then what to do.

---

## Visual foundations

### The map is the hero
Every screen starts as a full-bleed map. Chrome floats on top in **floating cards** with hairline borders and faint shadows — never edge-to-edge bars that crowd the cartography. When the data panel opens, the map *pushes* aside, it does not get covered.

### Color
- A **paper-cool light theme**, a **near-black dark theme**, and a distinctive **Color theme** with birch-paper warmth — three modes, all first-class.
- One **fjord teal** accent across all themes (lifted in dark) — used for selected area outlines, active filters, and the single primary CTA per surface.
- **No bluish-purple gradients. No flag red-white-blue. No emoji color cards.** Norwegian feeling comes from *fjord, lichen, lingonberry, copper, birch, granite* — not from the flag.
- See `colors_and_type.css` for full token tables; `preview/color-*.html` for swatches.

### Type
- **IBM Plex Sans** for everything UI, **IBM Plex Mono** for tabular data and code-like values.
- Plex was chosen for: distinctive personality (slight slab terminals), strong Norwegian charset (æ ø å), proper tabular numerals, and the family's Mono pairing for data labels.
- ⚠️ **Substitution flag:** the brief asks for "non-generic." Plex is well-known but reads professional and cartographic; if the team prefers something more bespoke (e.g. *GT Walsheim*, *Söhne*, *National 2*), we can swap the `--font-sans` token and re-host. Tell us and ship the .woff2 files into `fonts/`.

### Spacing
4px base. Cards use `12 / 16 / 20px` internal padding. Map chrome floats `16px` from the viewport edge on desktop, `12px` on mobile. Vertical rhythm in the data panel is 16/24/32 — no looser, the panel is dense by design.

### Backgrounds & textures
- **No hand-drawn illustrations.** The map is the illustration.
- **No repeating patterns.** No gradients on chrome (only inside choropleth scales and chart fills).
- The "Color" theme's birch-paper background is the *one* warm note in the system. It earns its place by being grounded in the Norwegian landscape.

### Motion
- **Scandinavian restraint.** Most transitions are 120–320ms with `cubic-bezier(0.22, 1, 0.36, 1)` (a gentle ease-out).
- Panel slide: 360ms ease-out. Map zoom: 600ms ease-in-out. Theme switch: 200ms cross-fade on tile layers and choropleth fills, simultaneously.
- **No bounces. No spring overshoot.** Maps don't bounce; data doesn't wiggle.
- Skeletons pulse with a 1.4s linear opacity loop, not a shimmer.

### Hover & press
- Hover: background lifts to `--surface-2` (light) or to `--surface-3` (dark). No color tinting on text.
- Press: surface darkens to `--surface-3` and shrinks 1% (scale 0.99) for 80ms.
- Map polygons hover-outline at `--accent` 1.5px stroke; selected polygons get a 2px stroke + 12% accent fill.

### Borders & shadows
- Borders are 1px hairlines in `--border-1` for resting state, `--border-2` for emphasis. The system rarely uses thick or colored borders.
- Shadows are layered low: a 1–2px crisp shadow plus a soft 6–24px ambient. Never a single big blur — feels theatrical and un-Nordic. See `--shadow-1/2/3` and `--shadow-panel`.
- **No "rounded corners with a colored left border accent" cards.** Ever.

### Transparency & blur
- Map chrome (search bar, theme switcher, breadcrumb) sits on a 92% opaque surface with a 12px backdrop-blur. This keeps cartography visible at the edges of overlays.
- The data panel is fully opaque — once you're reading data, the map is no longer the foreground.

### Corner radii
- Chips, buttons, inputs: **2–4px**. Crisp, cartographic.
- Cards inside panels: **8px**.
- The data panel itself: **12px** (desktop, top-left + bottom-left corners).
- Mobile bottom sheet: **16px** top corners only.

### Cards
- 1px hairline border in `--border-1`, no shadow at rest. On hover, gain `--shadow-1`. Internal padding `16px`. Title in `var(--fs-h3) / fw-semibold`, body in `var(--fs-body)`. **Stat cards** add a tabular display number in `var(--fs-display)` and a trend indicator (▲ / ▼ + percent) in the appropriate semantic color.

### Layout rules
- Desktop: data panel is **400px** wide, slides in from the right, full-height. Map fills remaining viewport.
- Tablet (< 1024px): panel becomes **44%** wide; map shrinks but never goes below **480px**.
- Mobile: bottom sheet, three snap heights — **peek (88px), half (50vh), full (calc(100vh - 56px))**. Sheet handle is centered top, 36×4px, color `--border-strong`.

---

## Iconography

See [ICONOGRAPHY.md](#iconography-detail-below) for full reasoning. TL;DR:

- **Lucide** (`lucide-react` / SVG sprite) — chosen as the closest match to a clean, cartographic 1.5px-stroke style.
- ⚠️ **Substitution flag:** Lucide is a CDN substitute because no icon set was provided. If the team has a custom icon set, drop SVGs into `assets/icons/` and we'll swap.
- Sized at **20px** in chrome, **16px** inline with body text, **24px** as buttons in mobile bottom sheet.
- 1.5px stroke at 20px; 1.25px at 16px (Lucide auto-scales). Color always inherits `currentColor`.
- **No emoji. No unicode glyphs as icons.** Custom SVGs only for: choropleth legend swatches, the wordmark, and POI category markers.

POI category markers use a small **square chip** (16×16, radius 2px) filled with category color, not pictograms. This keeps the map readable at every zoom.

---

## Themes

Three map themes are first-class. Switch by setting `data-theme` on `<html>`:

```html
<html data-theme="light">  <!-- default -->
<html data-theme="dark">
<html data-theme="color">
```

Every component reads from CSS variables and re-themes instantly. The theme switcher (top-right of map) cross-fades base map tiles and choropleth fills together over 200ms.

---

## Recommended reconsiderations

A few things worth a second look — flagged honestly:

1. **"Non-generic typeface" + IBM Plex.** Plex is widely used (it's IBM's house face). If "non-generic" is non-negotiable, license **Söhne**, **GT America**, or **National 2** — but expect a real cost. If the team is fine with widely-used-but-distinctive, Plex is the best free option for this product. *Decide before we lock down.*
2. **"Warm amber → teal" choropleth in dark mode** is technically a diverging palette being asked to do sequential work. We've made it monotonically increase in luminance, but it will visually read as "two zones connected." Consider either: (a) sequential teal-only for dark mode, or (b) embrace the diverging quality and use it where two-direction comparisons matter (e.g. "growth vs. decline").
3. **Three themes in one switcher.** This is delightful but expensive: every map style needs its own raster/vector tileset, and choropleth scales need re-validation per theme for AA contrast. Worth doing — but budget the tile work.
4. **Fjord-teal accent** sits close to the dark-theme choropleth's high end. We've separated them with luminance, but on a **dark** map the selected-area outline can blend with very-high-density polygons. The selected outline gets a thin white halo to compensate; consider switching the dark-mode accent to a slightly more saturated cyan if this still reads soft.
5. **Tagline.** The brief offers `"Kjenn området før du ankommer"` ("Know the area before you arrive"). It's good. An alt that fits the brand even better is below — see `preview/brand-tagline.html`.

---

## Iconography (detail)

- **System:** Lucide v0.460+, used as a CDN substitute (no icon set was provided).
- **Stroke:** 1.5px (default).
- **Color:** always `currentColor`. Never tinted brand color unless the icon is *the* CTA glyph.
- **Sizing tokens:** `--icon-sm: 16px`, `--icon-md: 20px`, `--icon-lg: 24px`.
- **Used commonly:** `Search`, `Map`, `Layers`, `ChevronRight`, `ChevronDown`, `Globe`, `Sun`, `Moon`, `Palette`, `X`, `Filter`, `Compass`, `MapPin`, `Users`, `Building2`, `GraduationCap`, `Cross` (healthcare), `UtensilsCrossed`, `Church`.
- **POI markers** are square chips, not pictograms. Color tokens come from `--viz-*`.
- **Emoji / unicode-as-icon:** never.

---

## Tagline candidates

- *Norwegian:* **«Norge, sett ovenfra.»** — Norway, seen from above.
- *Norwegian alt:* **«Kjenn nabolaget før du flytter inn.»** — Know the neighbourhood before you move in.
- *English primary:* **Norway, from above.**
- *English alt:* **A clearer view of every kommune.**

---

## How to use this system

1. Drop `colors_and_type.css` into your app's global stylesheet.
2. Set `data-theme="light|dark|color"` on `<html>` and the system re-themes.
3. Pull components from `ui_kits/web/` (desktop) or `ui_kits/mobile/` (native).
4. For prototypes/mocks, see `SKILL.md` — this whole folder doubles as a Claude Code skill.
