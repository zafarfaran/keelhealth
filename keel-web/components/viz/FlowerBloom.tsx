'use client';

import { useViz, dashPath } from './useViz';

const PETALS = [0, 45, 90, 135, 180, 225, 270, 315];
const INNER = [22, 67, 112, 157, 202, 247, 292, 337];

type Props = {
  /** Visual weight. 'soft' sits behind content, 'ink' reads on the dark band. */
  tone?: 'soft' | 'clay' | 'ink';
  /** Where the bloom sits, as a free-form class hook. */
  className?: string;
  /** Decorative by default; give it a label only if it carries meaning. */
  label?: string;
};

/**
 * A flower that draws its stem, unfurls two leaves and opens its petals as the
 * section scrolls past. Pure SVG so it stays sharp, costs nothing to load, and
 * cannot hallucinate — the same rule as the rest of components/viz.
 */
export default function FlowerBloom({ tone = 'soft', className = '', label }: Props) {
  const ref = useViz((root, g) => {
    const stem = root.querySelector('.fb-stem') as SVGPathElement;
    const leaves = root.querySelectorAll('.fb-leaf');
    const petals = root.querySelectorAll('.fb-petal');
    const inner = root.querySelectorAll('.fb-inner');
    const core = root.querySelector('.fb-core');

    dashPath(stem);
    g.set(leaves, { scale: 0, transformOrigin: '100px 190px' });
    g.set(petals, { scale: 0.15, opacity: 0, transformOrigin: '100px 100px' });
    g.set(inner, { scale: 0.15, opacity: 0, transformOrigin: '100px 100px' });
    g.set(core, { scale: 0, transformOrigin: '100px 100px' });

    const tl = g.timeline({
      scrollTrigger: { trigger: root, start: 'top 92%', end: 'bottom 45%', scrub: 0.7 },
    });

    tl.to(stem, { strokeDashoffset: 0, duration: 1.2, ease: 'none' }, 0)
      .to(leaves, { scale: 1, duration: 0.6, stagger: 0.18, ease: 'back.out(1.4)' }, 0.55)
      .to(
        petals,
        { scale: 1, opacity: 1, duration: 0.7, stagger: 0.07, ease: 'back.out(1.5)' },
        1.0
      )
      .to(
        inner,
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'back.out(1.5)' },
        1.35
      )
      .to(core, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, 1.7);
  });

  return (
    <div
      className={`viz fb fb-${tone} ${className}`.trim()}
      ref={ref}
      aria-hidden={label ? undefined : true}
    >
      <svg viewBox="0 0 200 280" role={label ? 'img' : undefined}>
        {label ? <title>{label}</title> : null}

        <path className="fb-stem" d="M100,278 C100,240 96,214 100,186 C104,158 100,132 100,116" />
        <path className="fb-leaf" d="M100,190 C74,186 56,168 54,146 C80,146 98,164 100,190 Z" />
        <path className="fb-leaf" d="M100,206 C126,204 146,188 150,166 C124,164 104,180 100,206 Z" />

        {PETALS.map((a) => (
          <ellipse
            key={`p${a}`}
            className="fb-petal"
            cx="100"
            cy="64"
            rx="15"
            ry="33"
            transform={`rotate(${a} 100 100)`}
          />
        ))}
        {INNER.map((a) => (
          <ellipse
            key={`i${a}`}
            className="fb-inner"
            cx="100"
            cy="78"
            rx="10"
            ry="21"
            transform={`rotate(${a} 100 100)`}
          />
        ))}
        <circle className="fb-core" cx="100" cy="100" r="13" />
      </svg>
    </div>
  );
}
