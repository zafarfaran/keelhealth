'use client';

import { useViz } from './useViz';

/** Eight weeks of a dumbbell getting heavier. Replaces the bullet list. */
const WEEKS = [
  { w: 1, kg: 5, h: 30 },
  { w: 2, kg: 5, h: 30 },
  { w: 3, kg: 6, h: 44 },
  { w: 4, kg: 7.5, h: 60 },
  { w: 5, kg: 7.5, h: 60 },
  { w: 6, kg: 9, h: 78 },
  { w: 7, kg: 6, h: 44, light: true },
  { w: 8, kg: 12, h: 104 },
];

const BW = 44;
const GAP = 22;
const BASE = 140;

export default function OverloadLadderViz() {
  const ref = useViz((root, g) => {
    const bars = root.querySelectorAll('.ol-bar');
    const caps = root.querySelectorAll('.ol-kg');
    const weeks = root.querySelectorAll('.ol-wk');
    const note = root.querySelector('.ol-note');

    g.set(bars, { scaleY: 0, transformOrigin: 'bottom center' });
    g.set([caps, note], { opacity: 0, y: 6 });
    g.set(weeks, { opacity: 0.25 });

    const tl = g.timeline({
      scrollTrigger: { trigger: root, start: 'top 82%', end: 'bottom 68%', scrub: 0.5 },
    });

    bars.forEach((b, i) => {
      tl.to(b, { scaleY: 1, duration: 0.5, ease: 'power2.out' }, i * 0.28)
        .to(caps[i], { opacity: 1, y: 0, duration: 0.3 }, i * 0.28 + 0.18)
        .to(weeks[i], { opacity: 1, duration: 0.3 }, i * 0.28 + 0.18);
    });
    tl.to(note, { opacity: 1, y: 0, duration: 0.4 }, '>-0.1');
  });

  return (
    <div className="viz viz-ladder" ref={ref}>
      <svg viewBox="0 0 540 190" role="img" aria-labelledby="ol-title">
        <title id="ol-title">
          The working weight rises from 5kg in week one to 12kg by week eight, with a
          planned lighter week at week seven.
        </title>
        <line className="ol-base" x1="8" y1={BASE + 1} x2="532" y2={BASE + 1} />
        {WEEKS.map((d, i) => {
          const x = 12 + i * (BW + GAP);
          return (
            <g key={d.w}>
              <rect
                className={d.light ? 'ol-bar is-light' : 'ol-bar'}
                x={x}
                y={BASE - d.h}
                width={BW}
                height={d.h}
                rx="6"
              />
              <text className="ol-kg" x={x + BW / 2} y={BASE - d.h - 10} textAnchor="middle">
                {d.kg}kg
              </text>
              <text className="ol-wk" x={x + BW / 2} y={BASE + 20} textAnchor="middle">
                {d.w}
              </text>
            </g>
          );
        })}
        <text className="ol-note" x="12" y={BASE + 44}>
          week 7 is lighter on purpose
        </text>
      </svg>
    </div>
  );
}
