---
name: keel-design
description: Use when designing, building, restyling, animating, generating imagery for, or writing copy for the Keel site in keel-web/, and before adding any section, heading, label, icon, character, photo, video, or motion to it.
---

# Keel Design Rules

## Overview

Standing design law for the Keel marketing site. Every rule here was set by the site's owner, usually after rejecting the opposite. Treat each as a hard constraint, not a preference.

The site's own design-language doc (`keel-design-language (1).md`) is **out of date** and contradicts several rules below. This file wins.

## Quick reference

| Area | Rule |
|---|---|
| People | Avoid human imagery. Prefer objects, characters, diagrams |
| Video | Only `squat.mp4` and `walk.mp4` are approved. No new human motion video |
| Explaining | Draw it in SVG + GSAP. Never generate a picture of an explanation |
| Age | Never reference age, decade, or menopause as the frame |
| Text | Cut hard. The visual carries the argument |
| Headings | Serif, one typeface per line, no rule underneath |
| Labels | Sentence case. Never uppercase. Mono only for numbers |
| Motion | Always on, scroll-driven. Never cursor-driven |
| Emphasis | Carried by animation, never by styling |

## Imagery and media

**Never generate human motion video.** Image-to-video on a person morphs limbs and faces. If motion over a person is unavoidable, prompt camera movement only ("slow dolly in, subject holds the pose, no limb movement") and keep the still as a poster fallback.

**Prefer non-human subjects.** Programme cards, feature tiles and section ornaments use objects, characters or diagrams. Real photography is right only when the photo *is* the product (a plate of food, a real interface).

**Two generated styles, and they are not interchangeable:**

| Asset kind | Style |
|---|---|
| Object icons | Soft matte clay 3D, single centred object, flat almond background, isometric three-quarter view |
| Characters | Pixar-style 3D cartoon, glossy, big symmetrical eyes with catchlights, full body with margin |

Matte clay was explicitly rejected for characters. It reads as an object, not a personality.

**Lock the palette into generation prompts** (`#EDE3D6 #C08E82 #C2714F #A85A3C #F0C9A8 #A8968A`) so a set stays coherent.

**Cut out generated subjects locally** when the background is flat: flood-fill inward from the border with a colour tolerance, so similar tones inside the subject survive. Faster and more reliable than waiting on a queued background remover.

**Working files never live in `public/`.** Generation candidates, rejects and originals go outside the app, or they ship.

## Explaining things

Anything that explains a mechanism is **drawn in SVG and scrubbed by GSAP**, never generated and never written as a paragraph. Code-drawn visuals cannot hallucinate, stay sharp, restyle with the tokens and cost nothing to load.

**Make the diagram thematic to its content.** A plan that gets built becomes a flower that grows: the inputs are leaves, the outputs are petals, the result is the core. A generic bar chart next to the same copy is a miss.

## Audience and copy

**No age framing. Anywhere.** No `40+`, `after 40`, `over 40`, `women 40 to 65`, `perimenopause` as the section frame, and no "in her fifties" in alt text. The audience is women, at any stage. Age-bound features (cycle, symptoms, medication logging) are framed so they work at any age.

**Cut text hard.** Show the thing instead of describing it. One eyebrow, one headline, one short line per section is the target. Pricing, FAQ and legal copy are exempt.

**Copy gate, run before shipping.** Grep the site for:
- Em dashes. Use commas, periods or a middot.
- `leverage seamless empower unlock robust actionable data-driven solutions testament landscape delve elevate`
- "it's not just X, it's Y", vague attributions, generic big-finish conclusions.

**Never contradict the Honest section.** Read it before writing marketing copy, because it is a public promise and it changes. It currently rules out fasting, before-and-after photos, countdown timers, red alerts and comparing one user to another.

**Goal weight, fasting windows and progress photos are all in the product** as of this revision, so nothing on the site may claim otherwise. Three separate copy claims were removed for being false; do not reintroduce them from memory or from the older spec.

What is still true, and still worth saying:

- The plan leads with the protein gap, not a weight number.
- Targets have a hard safe floor, and a goal below a safe minimum is refused.
- Fasting and progress photos are off unless she turns them on, and the coach never suggests either.
- Progress photos stay private and are never used in advertising.
- Anyone who screens positive on disordered eating at quiz Q24 never sees goal weight, projections, fasting or photos at all.

**Check the live Honest section before writing any "we won't do X" claim.** It is a public promise, it has already changed once, and stale claims there are the most damaging copy errors on the site.

## Typography

Serif is the section voice. Sans is the interface voice. The split is **by role, never within a line**.

| Element | Treatment |
|---|---|
| `.display`, `.h2`, `.h3` | Newsreader serif, 400 |
| Section marker (eyebrow) | Outfit sans, 13px, sentence case, with a 26px hairline rule. Sits in the left margin beside the headline above 1040px |
| Body, cards, chips, labels | Outfit sans, sentence case |
| Numbers, axis ticks, weights | IBM Plex Mono |

**Forbidden, each rejected explicitly:**
- A rule, swash or highlight under an emphasised word.
- A second typeface, italic or colour switch inside a headline or paragraph.
- `text-transform: uppercase` anywhere on the site.
- Mono with wide tracking on anything that is not a number. It reads techy.
- Italicising a preposition or article. That is a display treatment, not emphasis.
- **Serif italic anywhere.** Not eyebrows, not figure captions, not pull quotes.
  A serif italic phrase dropped into a sans page is one of the most recognised
  generated-design tells, and next to a serif headline it is the same voice
  twice. Diagram labels and captions are interface: they take the sans.
- **A label stacked directly above every headline.** Repeated across a dozen
  sections it stops being structure and becomes a template. Give a section a
  marker only when the marker says something the headline does not, and place
  it in the margin where there is room.

## Motion

**Always on.** There is no user-facing motion setting. The only thing that disables motion is the reader's OS `prefers-reduced-motion`, which is an accessibility requirement and stays.

**Markup is the finished state.** Apply from-states only when an animation actually runs, so every section reads correctly with JavaScript off and under reduced motion. A transient state (a typing indicator) rests hidden in CSS and is only brought in by GSAP.

**Emphasis is an animation difference, not a styling difference.** Accented words are visually identical at rest and arrive by a different means: ordinary words rise vertically, the accented phrase wipes in horizontally. Different axis, so the eye catches it.

**Motion must explain something** — state, causality, hierarchy or spatial change.

**Forbidden:**
- Cursor or hover-driven parallax. It tells the visitor nothing and does nothing at all on touch.
- Perpetual idle float on cards. Same trope, other half.
- **The uniform fade-up.** `opacity: 0` plus a `y` offset on every block in the
  page is the single most recognisable generated-site motion. Text wipes up out
  of its own line box, cards uncover from their own bottom edge, and a section
  marker draws its rule before the label arrives. Different gestures for
  different kinds of thing, and copy is never left half-transparent.
- Buttons that fade on hover. They change ground colour instead.

**Never build a ScrollTrigger inside a `fromTo` in a loop.** Each new trigger
refreshes the ones before it and ScrollTrigger throws part-way through, taking
the whole page down with a client-side exception. Create the trigger on its own
and start the tween from `onEnter`.

Use scroll instead: layered elements leave at their own rate via a depth value, which explains distance and works identically on a phone.

## Structure

- **Hero:** cutout subject on an organic colour field, with floating UI cards **built in HTML and CSS**, never generated as pictures of UI. Real markup stays sharp, restyles with tokens and can animate its own contents.
- **The AI coach appears near the top**, with the character, and again in the hero.
- Full-viewport pinned sections that only reveal text are not worth their scroll cost.

## Common mistakes

| Mistake | Fix |
|---|---|
| Reaching for a generated image to explain a concept | Draw it in SVG and scrub it |
| Adding a highlight to replace a removed underline | Remove and add nothing. Compensating with a new effect is the same defect |
| An italic phrase in every single headline | The repetition is the templated feel, not just the styling |
| Leaving generated candidates in `public/img/gen/` | Move outside the app before they ship |
| A purple-to-blue gradient, gradient headline text, emoji in headings, Inter, Space Grotesk, untouched shadcn, Lucide icon tiles, glassmorphism cards, grain over a gradient | None of these have ever been on this site. Keep it that way |
| Running `next build` while `next dev` is live | Corrupts the HMR module graph. Use `tsc --noEmit` to check types |
