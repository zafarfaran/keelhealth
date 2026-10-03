'use client';

import { useViz, dashPath } from './useViz';

/** Seven ways in, one place they all lead. Replaces the section lede. */
const LANES = [
  'M6,14 C160,14 200,84 330,84',
  'M6,37 C160,37 210,84 330,84',
  'M6,60 C170,60 220,84 330,84',
  'M6,84 L330,84',
  'M6,108 C170,108 220,84 330,84',
  'M6,131 C160,131 210,84 330,84',
  'M6,154 C160,154 200,84 330,84',
];

export default function DoorSorterViz() {
  const ref = useViz((root, g) => {
    const lanes = root.querySelectorAll('.ds-lane');
    const dots = root.querySelectorAll('.ds-dot');
    const target = root.querySelector('.ds-target');
    const label = root.querySelector('.ds-label');

    lanes.forEach((l) => dashPath(l as SVGPathElement));
    g.set(dots, { opacity: 0, scale: 0, transformOrigin: 'center' });
    g.set([target, label], { opacity: 0, scale: 0.8, transformOrigin: 'center' });

    const tl = g.timeline({
      scrollTrigger: { trigger: root, start: 'top 85%', end: 'bottom 70%', scrub: 0.5 },
    });

    tl.to(dots, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.06 })
      .to(lanes, { strokeDashoffset: 0, duration: 1.1, stagger: 0.07, ease: 'none' }, 0.2)
      .to(target, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.8)' }, '>-0.25')
      .to(label, { opacity: 1, scale: 1, duration: 0.3 }, '<0.15');
  });

  return (
    <div className="viz viz-sorter" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 400 168">
        {LANES.map((d, i) => (
          <g key={d}>
            <path className="ds-lane" d={d} />
            <circle className="ds-dot" cx="6" cy={14 + i * 23.33} r="4" />
          </g>
        ))}
        <circle className="ds-target" cx="344" cy="84" r="13" />
        <text className="ds-label" x="368" y="88">stronger</text>
      </svg>
    </div>
  );
}
