# secondstrong-web

The Second Strong marketing site in React + TypeScript (Next.js 16, App Router, static export).
It is a port of the static page in `../site/`, with the same design, copy, media and motion.

## Commands

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static site written to out/
npm run lint
```

`out/` is plain HTML/CSS/JS and can be served from any static host. Add `?motion=off` to the URL
to see every animation in its finished state. The OS reduced-motion setting does the same.

## Layout

```
src/
  app/                 layout (fonts, metadata), page, icons
  content/site.ts      all copy, plans, FAQ and lists — edit words here
  components/
    HomePage.tsx       section order (the line's route follows it)
    sections/          one component per section, grouped by part of the page
    line/PageLine.tsx  the line that runs the whole page
    ui/                Draw (line drawings), Emoji, Wordmark, CountUp
  lib/
    line/              geometry helpers, path builder, the route through the page
    motion/            still/reduced-motion flag, pen "hit" store, frame loop, video scrub, heading slams
  styles/              base tokens + section styles (class names match the components)
public/assets/         line drawings (transparent masks), scroll films, share image
```

## How the motion fits together

- **The page line** (`lib/line/route.ts`) is built from where named elements sit (`#f-phone`, `#ring62`,
  `#card1`, `#bar`, `#plan-annual`, `#wm-end`…). If you move or rename one, update its step there.
  As the pen passes a marked element, `useHit(selector)` turns true, and that section reacts: it fills a bar,
  counts a number or lights a dot.
- **Pinned scroll sections** (`Hero`, `Facts`, `Day`) stay on screen while scroll progress drives them.
  The page line runs behind them and hands off at their edges:
  - the hero film's line leaves at `heroExitX()`;
  - the facts section's own line starts at `factsGx()` and leaves at `factsExitX()`;
  - the day section's line starts and leaves at `dayGx()`.
  Facts and Day each build one path through their content from where the boxes sit. What the pen has passed
  stays drawn, and on phones the content sits in a row and the view pans with the pen.
- **Scroll films** live in `public/assets/video`. They come from the HyperFrames projects in `../videos/`
  (`secondstrong-site-hero-wide`, `secondstrong-site-hero-tall`). Every frame is a keyframe so they scrub smoothly.

## Performance and resizing

- **Mostly server components.** Static sections render to HTML with no JavaScript. Only the hero, facts, day,
  the page line, the counters, the pen-reactive sections (`HitSection`) and the heading slams hydrate.
  There is no animation library: slams are CSS animations triggered by one IntersectionObserver.
- **Boot script** (`lib/motion/boot.ts`, inlined in `<head>`). It runs before first paint and does three things:
  - sets `js` and `still`, so nothing is hidden without JavaScript and nothing flashes;
  - sets `lite` on data-saver, 2G or very low-memory devices, which get the hero as a still image and no film;
  - otherwise starts the hero film download (low priority, after fonts).
- **The line is measured step by step** (`lib/line/measure.ts`) into a lookup table, so building it is linear
  and each frame is a binary search. Frame loops do nothing when the scroll position hasn't changed.
- **Rebuilds** (`useLayoutRebuild`) run when fonts load, the width changes or the page height changes.
  Height-only resizes on touch devices are ignored, because phones fire them as the address bar shows and hides.
  The hero switches between the tall and wide film when a resize crosses the threshold.
- **Checks**:
  - `node scripts/resize-test.mjs <url>` loads at desktop size, resizes to a phone and back over the DevTools
    Protocol, and checks every line hand-off point against a fresh build.
  - Lighthouse against a compressing server (`npx serve out`) scored mobile 0.95–1.00 and desktop 1.00, with
    total blocking time under 100 ms. Plain `python -m http.server` doesn't compress, so it scores lower.

## Waiting list (pre-launch)

Pricing is hidden. Every call to action goes to `#waitlist`. To bring pricing back, render `<Pricing />` in
`HomePage.tsx` and point `CTA_HREF` at `#pricing`.

Sign-ups are POSTed as JSON (`{ email, stage, source, at }`) to the URL in `NEXT_PUBLIC_WAITLIST_ENDPOINT`,
which is read at build time:

```bash
NEXT_PUBLIC_WAITLIST_ENDPOINT=https://… npm run build
```

**Without that variable, sign-ups are not saved.** The form still plays its full animation so the flow can be
tested, and it logs a console warning. Set the variable before going live.

## Before launch

- Point the "Get started" buttons at the real sign-up funnel (`CTA_HREF` in `content/site.ts`).
- Add the Privacy and Terms pages; the footer links are placeholders.
- Confirm `metadataBase` (secondstrong.com) and the contact address.
