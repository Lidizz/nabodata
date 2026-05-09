---
name: nabodata-design
description: Use this skill to generate well-branded interfaces and assets for Nabodata, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quickstart for designers

Nabodata is a Norwegian neighbourhood-intelligence platform. Map-first. The map is always the hero — UI chrome exists only to serve it. Three themes (Light / Dark / Color), all switchable as a first-class control.

**Files in this design system:**
- `README.md` — full brand voice, content fundamentals, visual foundations, iconography, motion, layout rules
- `colors_and_type.css` — CSS variables (drop-in: `<link rel="stylesheet" href="colors_and_type.css">`)
- `assets/` — wordmark SVGs (light/dark), favicon, Lucide icon CDN reference
- `ui_kits/web/` — desktop click-thru recreation (Next.js feel)
- `ui_kits/mobile/` — native mobile click-thru recreation (Expo / RN feel) inside an iOS frame
- `preview/` — design-system specimen cards (type, colors, scales, components, brand)

**Always:**
- Map is the hero. Chrome floats over it on a translucent surface, never blocks more than ~30% of viewport unless drilled.
- Use Söhne / Söhne Mono if licensed; otherwise the system substitutes Manrope (sans) and JetBrains Mono — flag the substitution. Tabular numerals are mandatory for any rendered number.
- Norwegian first, English second. Use `nb-NO` number formatting (space thousands separator).
- Accent is Fjord Aurora `#3DBFB0` — never red-white-blue flag clichés.
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` for entrances, ~280ms panels, ~140ms hovers.
