# Keel marketing site

Static site: `index.html`, `styles.css`, `main.js`. No build step.

Run locally:

    python -m http.server 8765
    # then open http://localhost:8765/

Design tokens follow `keel-design-language.md` exactly (Almond Warm). Motion uses GSAP 3.12 + ScrollTrigger from cdnjs.
The markup is always the finished state, so the page reads fully without JavaScript.

Motion levels: the footer switch (Full / Subtle / Off) is remembered per browser. `?motion=off` in the URL forces the static version, which is also what `prefers-reduced-motion` gets.

Custom media (generated on Higgsfield, all women 45 to 65, no before/after) lives in `img/`:
hero, squat, wall2, chair, somatic, plate, kitchen, grip, walk as JPEG, with matching MP4 loops for hero, squat, wall, chair, somatic, kitchen and walk. Videos only play while on screen.

Buttons currently link to `#pricing`. Point them at the quiz funnel URL when it exists.
