'use client';

import { useViz, countText } from './useViz';

const TOTAL = 110;
const EATEN = 62;
const COLS = 22;
const W = 18;
const H = 16;
const GX = 7;
const GY = 10;

const CELLS = Array.from({ length: TOTAL }, (_, i) => ({
  i,
  x: 16 + (i % COLS) * (W + GX),
  y: 10 + Math.floor(i / COLS) * (H + GY),
  gap: i >= EATEN,
}));

/**
 * One gram of protein per block. Sixty-two of them are what most women actually
 * eat; the rest is the gap. Carries the section on its own so the copy can be a
 * single line.
 */
export default function ProteinGapViz() {
  const ref = useViz((root, g) => {
    const eaten = root.querySelectorAll('.pg-cell:not(.is-gap)');
    const gapCells = root.querySelectorAll('.pg-cell.is-gap');
    const num = root.querySelector('.pg-num');
    const label = root.querySelector('.pg-label');
    const bracket = root.querySelector('.pg-bracket');
    const v = { n: 0 };

    g.set([eaten, gapCells], { opacity: 0.12, scale: 0.7, transformOrigin: 'center' });
    g.set(bracket, { opacity: 0 });
    countText(num, 0);

    const tl = g.timeline({
      scrollTrigger: { trigger: root, start: 'top 80%', end: 'bottom 60%', scrub: 0.5 },
    });

    tl.to(eaten, { opacity: 1, scale: 1, duration: 0.9, stagger: { amount: 0.9 } }, 0)
      .to(
        v,
        {
          n: EATEN,
          duration: 0.9,
          ease: 'none',
          onUpdate: () => countText(num, v.n),
        },
        0
      )
      .to({}, { duration: 0.35 })
      .to(bracket, { opacity: 1, duration: 0.3 }, '>-0.2')
      .to(gapCells, { opacity: 1, scale: 1, duration: 0.9, stagger: { amount: 0.9 } }, '>')
      .to(
        v,
        {
          n: TOTAL,
          duration: 0.9,
          ease: 'none',
          onUpdate: () => countText(num, v.n),
        },
        '<'
      )
      .to(label, { opacity: 1, duration: 0.3 }, '<0.5');
  });

  return (
    <div className="viz viz-gap" ref={ref}>
      <div className="pg-head">
        <span className="display pg-readout">
          <span className="pg-num">110</span>
          <span className="unit">g</span>
        </span>
        <span className="pg-label mono">your target</span>
      </div>

      <svg viewBox="0 0 576 162" role="img" aria-labelledby="pg-title">
        <title id="pg-title">
          Most women eat about 62g of protein a day. The target for building and keeping
          muscle is closer to 110g.
        </title>
        {CELLS.map((c) => (
          <rect
            key={c.i}
            className={c.gap ? 'pg-cell is-gap' : 'pg-cell'}
            x={c.x}
            y={c.y}
            width={W}
            height={H}
            rx="4"
          />
        ))}
        <text className="pg-bracket" x="560" y="154" textAnchor="end">
          the gap · 48g
        </text>
      </svg>
    </div>
  );
}
