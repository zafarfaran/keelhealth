'use client';

import { useViz, dashPath } from './useViz';

/**
 * Muscle mass over the years: the quiet decline, and the path that asks it to
 * stay. Deliberately unlabelled by age — the shape is the same story whenever
 * you start. Replaces the manifesto paragraph.
 */
const DECLINE = 'M40,64 C140,84 240,124 350,164 S500,206 536,216';
const KEEL = 'M40,64 C120,74 176,66 240,50 S392,34 536,26';
/* The area between the two curves, closed along the Keel path reversed. */
const GAP_AREA =
  'M40,64 C140,84 240,124 350,164 S500,206 536,216 L536,26 C392,34 304,42 240,50 S120,74 40,64 Z';

export default function MuscleCurveViz() {
  const ref = useViz((root, g) => {
    const decline = root.querySelector('.mc-decline') as SVGPathElement;
    const keel = root.querySelector('.mc-keel') as SVGPathElement;
    const area = root.querySelector('.mc-area') as SVGPathElement;
    const dots = root.querySelectorAll('.mc-dot');
    const tags = root.querySelectorAll('.mc-tag');
    const ticks = root.querySelectorAll('.mc-tick');

    dashPath(decline);
    dashPath(keel);
    g.set(area, { opacity: 0 });
    g.set([dots, tags], { opacity: 0 });
    g.set(ticks, { opacity: 0, y: 6 });

    const tl = g.timeline({
      scrollTrigger: { trigger: root, start: 'top 78%', end: 'bottom 62%', scrub: 0.6 },
    });

    tl.to(ticks, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 })
      .to(decline, { strokeDashoffset: 0, duration: 1.6, ease: 'none' }, 0.2)
      .to(tags[0], { opacity: 1, duration: 0.3 }, 1.4)
      .to(keel, { strokeDashoffset: 0, duration: 1.6, ease: 'none' }, 1.6)
      .to(area, { opacity: 1, duration: 0.8 }, 2.2)
      .to(tags[1], { opacity: 1, duration: 0.3 }, 3.0)
      .to(dots, { opacity: 1, duration: 0.3, stagger: 0.08 }, 3.1);
  });

  return (
    <div className="viz viz-curve" ref={ref}>
      <svg viewBox="0 0 576 260" role="img" aria-labelledby="mc-title">
        <title id="mc-title">
          Muscle mass falls steadily without strength training, and holds or rises with
          two to three sessions a week.
        </title>

        <g className="mc-grid" aria-hidden="true">
          <line x1="40" y1="30" x2="536" y2="30" />
          <line x1="40" y1="105" x2="536" y2="105" />
          <line x1="40" y1="180" x2="536" y2="180" />
          <line x1="40" y1="220" x2="536" y2="220" />
        </g>

        <path className="mc-area" d={GAP_AREA} />
        <path className="mc-decline" d={DECLINE} />
        <path className="mc-keel" d={KEEL} />

        <circle className="mc-dot mc-dot-keel" cx="536" cy="26" r="5" />
        <circle className="mc-dot mc-dot-decline" cx="536" cy="216" r="5" />

        <text className="mc-tag mc-tag-decline" x="528" y="240" textAnchor="end">
          Without strength work
        </text>
        <text className="mc-tag mc-tag-keel" x="528" y="16" textAnchor="end">
          With Keel
        </text>

        <g className="mc-axis" aria-hidden="true">
          <text className="mc-tick" x="40" y="256">today</text>
          <text className="mc-tick" x="205" y="256">+5 yrs</text>
          <text className="mc-tick" x="370" y="256">+10</text>
          <text className="mc-tick" x="528" y="256" textAnchor="end">+15</text>
        </g>
      </svg>
      <p className="viz-cap">Muscle mass over the next fifteen years</p>
    </div>
  );
}
