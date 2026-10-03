# Keel — Design Language ("Almond Warm")

Visual system for the Keel app and marketing site. Design only — no product logic. Values are exact; do not approximate.

---

## 1. Principles

- **Warm neutral, never clinical, never pink.** Ivory and almond grounds; colour lives inside components, never on the page.
- **Type does the personality.** One sans, one italic serif phrase per headline. No decorative type, no uppercase headlines.
- **Show, don't describe.** Prefer a live UI element or a number over a paragraph.
- **Nothing alarms.** No red anywhere. Warnings are ink text with no colour and no icon.
- **Same colour, same meaning.** Each chromatic colour owns one metric across the whole product.

---

## 2. Colour

### Core (page + text)
| Token | Hex | Use |
|---|---|---|
| `ink` | `#3B322C` | Primary text, primary buttons, dark surfaces |
| `ivory` | `#FBF8F4` | Page background |
| `almond` | `#EDE3D6` | Secondary background, tinted sections, icon tile |
| `cream` | `#F6F1E9` | Tertiary background (alternating sections) |
| `white` | `#FFFFFF` | Cards on ivory/almond |
| `taupe` | `#A8968A` | Disabled, decorative only — **not for text** |

### Text
| Token | Hex | Use |
|---|---|---|
| `text` | `#3B322C` | Body, headings |
| `text-2` | `#5D534B` | Secondary body |
| `text-3` | `#6D6157` | Captions, helper text (min size 13px) |
| `label` | `#7D7167` | Mono labels, ≥ 11px only |
| `text-on-ink` | `#FBF8F4` | Text on ink surfaces |
| `text-2-on-ink` | `#D8CCBF` | Secondary text on ink |
| `label-on-ink` | `#C2A894` | Labels on ink |

### Borders
| Token | Hex |
|---|---|
| `border` | `#E6DCCE` |
| `border-soft` | `#EDE3D6` |
| `border-warm` | `#E9DFD0` |
| `border-on-ink` | `#574C44` |

### Chromatic (component-only, one metric each)
| Token | Hex | Owns |
|---|---|---|
| `rose-clay` | `#C08E82` | Protein, progress bars, the wordmark dot |
| `terracotta` | `#C2714F` | Strength, primary accent, emphasis rule |
| `terracotta-deep` | `#A85A3C` | Accent on white when text-sized (AA-safe), links |
| `apricot` | `#F0C9A8` | Tints, the dot on ink surfaces |
| `honey` | `#E8C05F` | Habits, streaks, completion |
| `plum-rose` | `#A9647A` | Symptoms, cycle |
| `olive` | `#9AA88F` | Logged / complete / "fits" state |

### Card tints (backgrounds only, always with ink text)
| Token | Hex |
|---|---|
| `tint-rose` | `#F9F2EC` |
| `tint-peach` | `#FBF3EA` |
| `tint-olive` | `#F4F6F1` |
| `tint-lilac` | `#E3DAEF` |
| `tint-sky` | `#D5E2EE` |
| `tint-mint` | `#D3E6D9` |

### Dark surfaces
| Token | Hex |
|---|---|
| `ink` | `#3B322C` | 
| `ink-raised` | `#463C34` |
| `ink-track` | `#574C44` |

### Rules
- Backgrounds are only `ivory`, `almond`, `cream`, `white`, or a tint. A chromatic colour is never a page or section ground (exception: the final CTA band in `rose-clay` with ivory text).
- Max three tints on one screen. Tints never sit on tints.
- One chromatic colour per component.
- Filled buttons are `ink` or `terracotta-deep` only. White text on `terracotta` `#C2714F` is **not** AA — use `#A85A3C`.
- Never: red, gradients, dark mode, drop shadows heavier than the one below.

---

## 3. Typography

Fonts (Google Fonts):
- **Outfit** — everything. 400 body, 500 numerals/buttons, 600 headings.
- **Newsreader** italic 400 — one emphasised phrase per headline only.
- **IBM Plex Mono** 400/500 — data labels and eyebrows only (optional in product UI).

```css
font-family: 'Outfit', sans-serif;
font-family: 'Newsreader', serif;  /* italic emphasis only */
font-family: 'IBM Plex Mono', monospace;
```

### Scale
| Role | Size | Weight | Line | Tracking |
|---|---|---|---|---|
| Display (marketing H1) | 62–68px | 600 | 1.04 | -0.035em |
| H2 | 42px | 600 | 1.08 | -0.03em |
| H3 | 26–34px | 600 | 1.12 | -0.025em |
| Card title | 20px | 600 | 1.25 | -0.02em |
| Body large | 17–19px | 400 | 1.6 | 0 |
| Body | 15px | 400 | 1.6 | 0 |
| Small | 13.5px | 400 | 1.5 | 0 |
| Caption (min) | 13px | 400 | 1.5 | 0 |
| Mono label | 10.5–11.5px | 400 | 1 | 0.14–0.18em, uppercase |
| Big numeral | 42–56px | 600 | 1 | -0.03em, `tabular-nums` |
| Card numeral | 24–30px | 500/600 | 1 | -0.02em, `tabular-nums` |

### Emphasis device
One phrase per headline, wrapped as:
```html
<span style="display:inline-flex;flex-direction:column;align-items:stretch">
  <span style="font-family:'Newsreader',serif;font-weight:400;font-style:italic;letter-spacing:0">decision</span>
  <span style="height:3px;border-radius:999px;background:#C08E82;margin-top:2px"></span>
</span>
```
Rule sits under the italic only. Never under upright text. Never two per headline.

### Rules
- Sentence case everywhere. No uppercase headings, no tracked-out display type.
- Body text never below 15px in product; 13px absolute minimum anywhere.
- Numerals always `font-variant-numeric: tabular-nums`.
- No text set in `taupe`.

---

## 4. Shape & space

### Radius
| Element | Radius |
|---|---|
| Page section / hero panel | 28–30px |
| Card | 22–24px |
| Inner card / tile | 16–20px |
| Chip / badge / tag | 999px |
| Button | 999px |
| Progress bar | 999px |
| Icon tile | 22.4% of side (e.g. 10px on 44px, 26px on 104px, 40px on 180px) |
| App icon | 22.4% of side |
| Avatar | 50% |

### Spacing (8px base)
`4 · 8 · 12 · 16 · 20 · 24 · 28 · 32 · 40 · 56 · 72 · 90`
- Card padding: 24–30px.
- Grid gap between cards: 14–16px.
- Section vertical padding (marketing): 90px. Product screens: 20px horizontal gutter.
- Max content width: 1280px.

### Shadow
One shadow only, used on floating elements over grounds (never on cards in a grid):
```css
box-shadow: 0 18px 40px -28px rgba(59,50,44,0.40);
```
Phone/device mock: `0 60px 90px -60px rgba(59,50,44,0.50)`.

### Borders
1px `border` `#E6DCCE` on white cards over ivory. No border on tinted cards. 2px `ink` border marks the selected/recommended option.

---

## 5. Components

### Buttons
| Variant | Style |
|---|---|
| Primary | bg `ink`, text `ivory`, 500, 15–16px, padding 15–17px 26–30px, radius 999 |
| Primary on ink | bg `ivory`, text `ink` |
| Accent | bg `terracotta-deep` `#A85A3C`, text white |
| Secondary | 1px `border` `#DED2C1`, text `ink`, transparent |
| Text link | `terracotta-deep`, 500, no underline; hover → `ink` |
- Min height 44px. Hover: primary → `#2E2723`; secondary → bg `almond`.

### Progress bar
Track `#EFE2DA` (on tint) or `#EDE3D6` (on white). Fill = metric's chromatic colour. Height 9–10px, radius 999. Never red when short.

### Habit dots
9–11px circles, gap 5–6px. Filled `honey`, empty `#E6DCCE` (light) / `#D8CBB8` (on almond).

### Stat card
bg tint · label 12.5–13.5px `text-3` · numeral 24–30px 500/600 `tabular-nums` · optional delta 14px `text-3`. Numeral may take the metric's chromatic colour.

### Coach message
bg `ink`, radius 20, padding 16. Eyebrow 12.5px `label-on-ink`; body 14.5–15px `#F3ECE2`, line-height 1.45.

### Chat bubbles
User: bg `ink`, text `#F3ECE2`, radius `18px 18px 4px 18px`. Coach: bg `cream`, text `ink`, radius `18px 18px 18px 4px`. Padding 14px 16px. Max width 82–86%.

### Chip / tag
Mono 10–10.5px uppercase, tracking 0.08–0.1em, bg `almond`, text `text-2`, padding 5px 9px, radius 999.

### Selected option (pricing, choices)
2px `ink` border; badge top-left `-13px` offset, bg `terracotta-deep`, white 12.5px 500, radius 999.

### Photo placeholder
`repeating-linear-gradient(135deg, #ECE2D4 0 9px, #F4EDE3 9px 18px)` with 1px `border`. Caption mono 11px `text-3`, bottom-left.

### Navigation (marketing)
Fixed, `rgba(251,248,244,0.90)` + `backdrop-filter: blur(8px)`, 1px bottom `border-warm`. Links 14.5px `text-2`. Wordmark 24px.

### Phone frame (marketing)
322×648, radius 46, bg `ink`, padding 11; screen radius 36, bg `ivory`.

---

## 6. Identity

### Wordmark
`keel` — Outfit 600, lowercase always, `letter-spacing: -0.05em`, followed by a dot.
- Dot: circle, diameter ≈ 1/6 cap height, `rose-clay` on light (`apricot` on ink), baseline-aligned to x-height, gap = half the dot.
- Min width 88px screen / 22mm print; below that drop the dot.
- Clear space = height of the "k" on all sides.
- "Health" appears only in the legal footer lockup (`Keel Health Ltd · keelhealth.com`), never in the mark.

### Approved colourways
ink on ivory · ink on almond · ink on apricot · ivory on rose-clay · ivory on ink · one-colour (dot dropped).

### Mark
Keel section: two strokes meeting at the bottom (a V / checkmark). Stroke = 1/5 mark height. Never rotated, never pointing up, never in a circle.
```svg
<svg viewBox="0 0 96 96"><polyline points="22,38 48,66 74,38" fill="none" stroke="#3B322C" stroke-width="11"/></svg>
```

### App icon
Almond `#EDE3D6` tile, ink `k` (Outfit 600, -0.06em) centred, `terracotta` dot bottom-right. Radius 22.4%. Drop the dot below 87px. Favicon inverts: ink tile, ivory `k`.

### Misuse
No uppercase, no tracking-out, no serif wordmark, no skew/outline, no gradient, no red dot, "health" never attached.

---

## 7. Motion

Library: GSAP + ScrollTrigger. Ease `power3.out` for entrances, `power2.out` for bars/counters, `sine.inOut` for loops, `back.out(1.6)` for plates/pop-ins.

- **Resting state in markup is the finished state.** From-states are applied only when an animation actually runs. If JS fails, the page is fully visible.
- Reveal: `y: 28px → 0, opacity 0 → 1, 0.7s`, trigger at `top 90%`, once.
- Stagger between siblings: 0.07–0.14s.
- Bars grow from 0 to authored height, 0.8–0.9s. Counters count from previous to current value, 1.3s.
- Each feature demo plays its own mechanism once on enter — scan line, waveform, laser, plates stacking, chat bubbles. No generic parallax, no floating blobs, no hover-lift on cards.
- Respect `prefers-reduced-motion`: skip all motion, show finished state.
- Provide a Full / Subtle / Off switch; Subtle halves distances.

---

## 8. Voice (for UI copy)

Plain, specific, unhurried. Sentence case. Contractions fine. Numbers in the sentence ("48g short today").

**Never:** reset · detox · anti-ageing · before/after · guilt-free · journey · "just" · exclamation marks · countdown timers · goal weight · body-shape adjectives · red for a missed target · comparing her to other women.

---

## 9. Quick CSS variables

```css
:root {
  --ink:#3B322C; --ink-raised:#463C34; --ink-track:#574C44;
  --ivory:#FBF8F4; --almond:#EDE3D6; --cream:#F6F1E9; --white:#FFFFFF;
  --text:#3B322C; --text-2:#5D534B; --text-3:#6D6157; --label:#7D7167;
  --text-on-ink:#FBF8F4; --text-2-on-ink:#D8CCBF; --label-on-ink:#C2A894;
  --border:#E6DCCE; --border-soft:#EDE3D6; --border-warm:#E9DFD0; --border-on-ink:#574C44;
  --rose-clay:#C08E82; --terracotta:#C2714F; --terracotta-deep:#A85A3C;
  --apricot:#F0C9A8; --honey:#E8C05F; --plum-rose:#A9647A; --olive:#9AA88F;
  --tint-rose:#F9F2EC; --tint-peach:#FBF3EA; --tint-olive:#F4F6F1;
  --tint-lilac:#E3DAEF; --tint-sky:#D5E2EE; --tint-mint:#D3E6D9;
  --track-light:#EDE3D6; --track-tint:#EFE2DA;
  --r-section:28px; --r-card:22px; --r-inner:16px; --r-pill:999px;
  --shadow:0 18px 40px -28px rgba(59,50,44,.4);
  --font:'Outfit',sans-serif; --font-serif:'Newsreader',serif; --font-mono:'IBM Plex Mono',monospace;
}
```
