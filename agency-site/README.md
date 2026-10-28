# DTA agency site (Next.js + Motion + Three.js)

3D, motion-driven agency landing page.

- **Next.js** (App Router, Tailwind v4) · **motion** (`motion/react`) for scroll/reveal/tilt animation
- **three + @react-three/fiber + drei** for the interactive 3D hero

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Content
All copy lives in `lib/content.ts` and comes from https://dtaonline.in (departments, offers, offices, contact, WhatsApp links). Brand colours (blue palette) are CSS variables in `app/globals.css`; fonts are Sora + Inter. The contact form opens WhatsApp with the enquiry prefilled (no backend).

## Structure
- `components/Scene3D.tsx` — 3D hero (distorted core, orbit rings, particles, mouse parallax)
- `components/Hero.tsx`, `Sections.tsx` — page sections
- `components/TiltCard.tsx`, `Reveal.tsx`, `Counter.tsx` — Motion primitives
