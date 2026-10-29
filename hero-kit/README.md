# Scroll-driven 3D map hero

A pinned, full-screen hero for a Next.js site. A 3D country map with glowing pins and an arc between
them. As the visitor scrolls, the camera flies from the whole map to each location in turn, shows a
card for it, then pulls back and the page fades from dark to light.

Built for DTA (offices in Tezpur and Bangalore). Everything specific to DTA lives in one config object
(`example/DtaMapHero.example.tsx`), so you can reuse it for any set of places.

## What moves

| Layer | Animation |
|---|---|
| Map | grows in on load, tilts with the mouse, breathes with a soft glow |
| Camera | scroll-driven: whole map → place 1 → place 2 → … → pull back (eased, so it glides) |
| Arc | draws itself, with light packets travelling along it |
| Routes | fainter arcs to other cities, each with its own packet |
| Pins | pulsing head, radar ripples, floating label that follows the pin on screen |
| Background | aurora glow drifting, scan line, sparkles, a perspective floor grid flowing toward you |
| Cards | one per stage, fade and slide in and out in step with the camera |
| Progress rail | dots on the right that stretch to show the current stage |
| End | headline-sized closing line, then the hero fades to your page colour |
| Page | optional inertia scrolling (`SmoothScroll`) |

Accessibility: with `prefers-reduced-motion` the hero is a single still screen (no pinned scroll, no
auto-animation, no smooth scrolling), the decorative 3D layer is hidden from screen readers, and the
buttons and text are real HTML.

## Requirements

- Next.js (App Router) with React 19 and Tailwind CSS v4
- If you are on **React 18**: use `@react-three/fiber@8` and `@react-three/drei@9` instead of the versions below
- **Tailwind v4 is required** (the hero uses colour variables with opacity such as `bg-[var(--mh-accent)]/30`, which Tailwind v3 does not support). Tailwind v3 is untested.
- Not on Next.js: see "Other frameworks"

```bash
npm install motion three @react-three/fiber @react-three/drei lenis
npm install -D @types/three
```

## Install in 4 steps

1. **Copy** the `map-hero/` folder into your project, e.g. `components/map-hero/`.
2. **Import the stylesheet** in your global CSS, after `@import "tailwindcss";`:
   ```css
   @import "../components/map-hero/map-hero.css";
   ```
   (adjust the path to where your global CSS is). See `example/global-styles.example.css`.
3. **Use it.** Copy `example/DtaMapHero.example.tsx`, replace the content with yours, and render it
   at the top of your home page. Mount `<SmoothScroll />` once if you want inertia scrolling.
   See `example/page.example.tsx`.
4. **Check the header.** The hero is dark, so a transparent header with dark text will be unreadable
   over it. See "Switching the header theme" below.

## The config

```tsx
<MapHero
  headline="…"                         // required
  description="…"                      // optional, hidden on phones to keep the map clear
  primaryCta={{ label, href }}         // optional
  secondaryCta={{ label, href }}       // optional
  footnote="…"                         // optional small line under the buttons
  pins={[{ lon, lat, label, sub }]}    // places to mark
  stages={[{ pin, eyebrow, title, lines, meta }]}  // one scroll stop per entry; `pin` is an index into `pins`
  arc={[0, 1]}                         // which two pins the bright arc joins
  cities={[{ lon, lat, from }]}        // faint extra routes; `from` is a pin index
  outline={INDIA_OUTLINE}              // [lon, lat][] outline of the country (default: India)
  finale="…"                           // closing line before the page turns light
  scrollHint="Scroll to explore"
  colors={{ background, light, surface, edge, glow, accent, gridCell, gridSection }}
  heightVh={420}                       // scroll length; default 160 + 130 × number of stages
  id="top"                             // section id (used by the header switch)
/>
```

- **Add or remove stages freely.** The timing of the whole story is recalculated from the number of
  stages (`timeline.ts`), and the page gets longer or shorter to match.
- **Another country:** pass your own `outline` as `[longitude, latitude]` points (clockwise). The map is
  scaled and centred from its bounding box automatically. The bundled India outline is a hand-simplified
  shape for decoration. Replace it with an exact outline if borders matter, and check disputed borders
  against the official maps for the region you publish in.
- **Colours:** pass only the ones you want to change. Defaults are the DTA dark-blue theme.
- **Fonts:** the hero uses `--mh-heading` and `--mh-body` (default: inherit your page font).

## Switching the header theme

The hero is dark and then fades to light in its last 6% of scroll. A header that changes with it:

```tsx
"use client";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

export function Header() {
  const [dark, setDark] = useState(true);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", () => {
    const hero = document.getElementById("top");
    if (!hero) return setDark(false);
    const r = hero.getBoundingClientRect();
    setDark(-r.top / Math.max(1, r.height - window.innerHeight) < 0.94);
  });
  return <header className={dark ? "text-white" : "text-black"}>…</header>;
}
```

## Other frameworks (Vite, Remix, plain React)

Only one line is Next-specific: `next/dynamic` in `MapHero.tsx`. Replace it with:

```tsx
import { lazy, Suspense } from "react";
const MapScene = lazy(() => import("./MapScene"));
// …and wrap the <MapScene … /> element in <Suspense fallback={null}> … </Suspense>
```

Remove the `"use client"` lines. Everything else is plain React.

## Performance notes

- The 3D scene is loaded on the client only, after the page (it is not part of the server HTML).
- Rendering is capped at 1.75× pixel density. For very old phones, lower `dpr` in `MapScene.tsx`.
- Fewer cities means fewer lines and lights; 6 is comfortable on a phone.
- With a single pin the bright arc is skipped automatically.
- The scene does no network requests: no textures, fonts or model files to download.

## Files

```
map-hero/
  MapHero.tsx        the section: layout, text, cards, scroll wiring
  MapScene.tsx       the 3D world (react-three-fiber)
  timeline.ts        where each thing happens along the scroll
  types.ts           props and colour defaults
  india-outline.ts   default map outline
  SmoothScroll.tsx   optional inertia scrolling
  map-hero.css       background animations, font hooks, smooth-scroll rules
  index.ts           exports
example/
  DtaMapHero.example.tsx   the DTA configuration
  page.example.tsx         where to mount it
  global-styles.example.css
```
