'use client';

import { useViz, dashPath, countText } from './useViz';

/* Geometry. The core sits at (CX, CY); petals radiate from it, the stem drops
   below it and the leaves alternate down the stem. */
const CX = 450;
const CY = 232;
const PETAL_D = 120;

/** What the quiz works out — one per leaf, down the stem. */
const LEAVES = [
  { y: 402, side: -1 as const, label: 'Your protein requirement' },
  { y: 452, side: 1 as const, label: 'Your training starting point' },
  { y: 502, side: -1 as const, label: 'Your sleep and energy' },
  { y: 552, side: 1 as const, label: 'Your cycle and symptoms' },
];

/** What comes out — one per petal. */
const PETALS = [
  { a: 315, label: 'Protein', to: 110, unit: 'g' },
  { a: 45, label: 'Strength', to: 3, unit: '× a week' },
  { a: 135, label: 'Fibre', to: 30, unit: 'g' },
  { a: 225, label: 'Steps', to: 8000, unit: '', fmt: true },
];

const pos = (a: number, d: number) => {
  const r = (a * Math.PI) / 180;
  return { x: CX + d * Math.sin(r), y: CY - d * Math.cos(r) };
};

/**
 * The plan, as a thing that grows.
 *
 * The stem draws, four leaves unfurl carrying what the quiz works out, then
 * four petals open carrying the targets that come back. Same information the
 * old checklist-and-card held, in a shape that rewards scrolling.
 */
export default function PlanBloomViz() {
  const ref = useViz((root, g) => {
    const stem = root.querySelector('.pb-stem') as SVGPathElement;
    const leaves = root.querySelectorAll('.pb-leaf');
    const leafLabels = root.querySelectorAll('.pb-leaf-label');
    const petals = root.querySelectorAll('.pb-petal');
    const petalLabels = root.querySelectorAll('.pb-petal-label');
    const core = root.querySelector('.pb-core');
    const coreText = root.querySelectorAll('.pb-core-text');
    const bar = root.querySelector('.pb-bar-fill');
    const now = root.querySelector('.pb-now');

    dashPath(stem);
    leaves.forEach((l, i) => {
      const d = LEAVES[i];
      g.set(l, { scale: 0, transformOrigin: `${CX}px ${d.y}px` });
    });
    g.set(leafLabels, { opacity: 0, x: (i: number) => LEAVES[i].side * 14 });
    petals.forEach((p, i) => {
      g.set(p, { scale: 0.12, opacity: 0, transformOrigin: `${CX}px ${CY}px` });
      void i;
    });
    g.set(petalLabels, { opacity: 0, scale: 0.8, transformOrigin: 'center' });
    g.set(core, { scale: 0, transformOrigin: `${CX}px ${CY}px` });
    g.set(coreText, { opacity: 0 });
    g.set(bar, { scaleX: 0, transformOrigin: 'left center' });
    g.set(now, { opacity: 0, y: 10 });

    PETALS.forEach((p) => {
      countText(root.querySelector(`.pb-num-${p.label.toLowerCase()}`), 0);
    });

    const tl = g.timeline({
      scrollTrigger: { trigger: root, start: 'top 82%', end: 'bottom 55%', scrub: 0.6 },
    });

    tl.to(stem, { strokeDashoffset: 0, duration: 1.3, ease: 'none' }, 0);

    leaves.forEach((l, i) => {
      tl.to(l, { scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, 0.25 + i * 0.22)
        .to(leafLabels[i], { opacity: 1, x: 0, duration: 0.4 }, 0.4 + i * 0.22);
    });

    petals.forEach((p, i) => {
      tl.to(p, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.6)' }, 1.5 + i * 0.18)
        .to(petalLabels[i], { opacity: 1, scale: 1, duration: 0.45 }, 1.75 + i * 0.18);
      const d = PETALS[i];
      const v = { n: 0 };
      tl.to(
        v,
        {
          n: d.to,
          duration: 0.6,
          ease: 'none',
          onUpdate: () => {
            const el = root.querySelector(`.pb-num-${d.label.toLowerCase()}`);
            if (!el) return;
            el.textContent = d.fmt
              ? Math.round(v.n).toLocaleString('en-GB')
              : String(Math.round(v.n));
          },
        },
        1.75 + i * 0.18
      );
    });

    tl.to(core, { scale: 1, duration: 0.6, ease: 'back.out(2)' }, 2.5)
      .to(coreText, { opacity: 1, duration: 0.4 }, 2.7)
      .to(bar, { scaleX: 1, duration: 0.8, ease: 'power2.out' }, 2.9)
      .to(now, { opacity: 1, y: 0, duration: 0.5 }, 3.0);
  });

  return (
    <div className="viz viz-bloom" ref={ref}>
      <svg viewBox="0 0 900 640" role="img" aria-labelledby="pb-title">
        <title id="pb-title">
          The quiz works out your protein requirement, your training starting point, your
          sleep and energy and your cycle and symptoms, and returns four daily targets:
          110g protein, strength three times a week, 30g fibre and 8,000 steps.
        </title>

        <path className="pb-stem" d={`M${CX},632 C${CX - 6},540 ${CX + 6},400 ${CX},292`} />

        {LEAVES.map((l) => (
          <g key={l.label}>
            <path
              className="pb-leaf"
              d={`M${CX},${l.y} C${CX + l.side * 46},${l.y - 30} ${CX + l.side * 96},${
                l.y - 24
              } ${CX + l.side * 112},${l.y + 4} C${CX + l.side * 84},${l.y + 30} ${
                CX + l.side * 34
              },${l.y + 24} ${CX},${l.y} Z`}
            />
            <text
              className="pb-leaf-label"
              x={CX + l.side * 128}
              y={l.y + 5}
              textAnchor={l.side === -1 ? 'end' : 'start'}
            >
              {l.label}
            </text>
          </g>
        ))}

        {PETALS.map((p) => (
          <ellipse
            key={`petal-${p.a}`}
            className="pb-petal"
            cx={CX}
            cy={CY - PETAL_D}
            rx="74"
            ry="112"
            transform={`rotate(${p.a} ${CX} ${CY})`}
          />
        ))}

        <circle className="pb-core" cx={CX} cy={CY} r="54" />
        <text className="pb-core-text pb-core-1" x={CX} y={CY - 4} textAnchor="middle">
          YOUR
        </text>
        <text className="pb-core-text pb-core-2" x={CX} y={CY + 16} textAnchor="middle">
          PLAN
        </text>

        {PETALS.map((p) => {
          const c = pos(p.a, PETAL_D + 26);
          return (
            <g className="pb-petal-label" key={`label-${p.a}`}>
              <text className="pb-petal-cap" x={c.x} y={c.y - 20} textAnchor="middle">
                {p.label}
              </text>
              <text className="pb-petal-val" x={c.x} y={c.y + 14} textAnchor="middle">
                <tspan className={`pb-num-${p.label.toLowerCase()}`}>
                  {p.fmt ? p.to.toLocaleString('en-GB') : p.to}
                </tspan>
                <tspan className="pb-petal-unit">{p.unit}</tspan>
              </text>
            </g>
          );
        })}
      </svg>

      <div className="pb-now-strip">
        <div className="pb-now-head">
          <span className="stat-label">Where you are now</span>
          <span className="stat-delta">about 62g a day</span>
        </div>
        <div className="pb-bar">
          <span className="pb-bar-fill" />
        </div>
        <p className="pb-now">
          56% of your protein target. This is the gap your first week is built around.
        </p>
      </div>
    </div>
  );
}
