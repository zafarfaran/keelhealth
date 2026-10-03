# Keel — marketing site (Next.js)

Next.js 15 App Router, TypeScript, GSAP + ScrollTrigger. Same design as the static
version in `../site`, same copy, same media.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Layout

| Path | What's in it |
|---|---|
| `app/layout.tsx` | Fonts (Outfit, Newsreader italic, IBM Plex Mono via `next/font`), metadata, favicons |
| `app/globals.css` | The whole design system, ported from `keel-design-language.md`. Tokens live in `:root` |
| `app/page.tsx` | Section order |
| `components/*.tsx` | One component per section, plus `Em` for the italic-and-rule emphasis device |
| `components/SiteMotion.tsx` | All scroll choreography, in a single client effect |
| `public/img`, `public/assets` | Photography, video loops and identity assets |

Most sections are server components. Only `Nav`, `Pricing`, `Footer` and `SiteMotion`
are client components, because those are the only parts with state or animation.

## Motion

The markup is always the finished state. From-states are applied only when an animation
actually runs, so the page reads correctly with JavaScript off or if `SiteMotion` never
mounts.

- Footer switch: Full / Subtle / Off, remembered per browser in `localStorage`.
- `?motion=off` forces the static version, which is handy for screenshots and diffs.
- `prefers-reduced-motion` defaults to Off and stops the video loops.
- Videos only play while on screen, and fall back to their poster image on error.

Two sections pin on desktop: the manifesto word reveal and the protein-gap counter. Both
fall back to a scrubbed, unpinned pass below 900px.

## Fonts

`next/font` self-hosts the three families and exposes them as `--font-outfit`,
`--font-newsreader` and `--font-plex-mono`. The design tokens `--font`, `--font-serif`
and `--font-mono` in `globals.css` point at those variables.

## Before launch

- Buttons link to `#pricing`. Point them at the quiz funnel once it exists.
- Prices, the 7-day trial line and the renewal terms are set by the pricing spec. The
  renewal price, billing period and cancellation route must stay visible without
  scrolling or tapping.
- Design rules that are not negotiable: no goal weight, no before/after imagery, no
  fasting, no countdown timers, no red, and no human coaching mentioned anywhere.
