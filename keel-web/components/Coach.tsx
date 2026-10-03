'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Em from './Em';

const ITEMS = [
  { name: 'Chicken thigh', g: 38 },
  { name: 'Sweet potato', g: 4 },
  { name: 'Green beans', g: 2 },
  { name: 'Greek yoghurt', g: 9 },
];

/**
 * The AI coach, introduced near the top rather than buried in the feature grid.
 *
 * Two beats in one scrubbed timeline: a photo is scanned and resolves into
 * per-item protein, then the coach reacts to the number it just found. The
 * mascot is deliberately not a person — no age, no gender, and consistent
 * everywhere it appears.
 */
export default function Coach() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    /* Motion is always on; only the reader's OS reduced-motion setting stops it. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const scan = root.querySelector('.co-scanline');
      const chips = root.querySelectorAll('.co-chip');
      const total = root.querySelector('.co-total-num');
      const verdict = root.querySelector('.co-verdict');
      const bubbles = root.querySelectorAll('.co-bubble');
      const dots = root.querySelector('.co-typing');
      const avatar = root.querySelector('.co-avatar');

      gsap.set(chips, { opacity: 0, y: 12, scale: 0.9 });
      gsap.set([verdict, dots], { opacity: 0 });
      gsap.set(bubbles, { opacity: 0, y: 14 });
      gsap.set(scan, { yPercent: -100, opacity: 0 });

      const v = { n: 0 };
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 78%', end: 'bottom 62%', scrub: 0.6 },
      });

      /* Beat one: the photo resolves into food. */
      tl.to(scan, { opacity: 1, duration: 0.15 }, 0)
        .to(scan, { yPercent: 100, duration: 1.0, ease: 'none' }, 0.1)
        .to(scan, { opacity: 0, duration: 0.2 }, 1.0);

      chips.forEach((c, i) => {
        tl.to(c, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.6)' },
          0.45 + i * 0.16);
      });
      tl.to(
        v,
        {
          n: 53,
          duration: 0.9,
          ease: 'none',
          onUpdate: () => {
            if (total) total.textContent = String(Math.round(v.n));
          },
        },
        0.5
      ).to(verdict, { opacity: 1, duration: 0.3 }, 1.3);

      /* Beat two: the coach reacts to what it found. */
      tl.to(dots, { opacity: 1, duration: 0.25 }, 1.5)
        .to(dots, { opacity: 0, duration: 0.2 }, 2.1)
        .to(bubbles[0], { opacity: 1, y: 0, duration: 0.4 }, 2.15)
        .to(bubbles[1], { opacity: 1, y: 0, duration: 0.4 }, 2.6);

      /* The mascot keeps breathing the whole time. */
      if (avatar) {
        gsap.to(avatar, {
          y: -8,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="coach" id="coach" ref={ref}>
      <div className="wrap">
        <div className="co-head">
          <p className="eyebrow">Your AI coach</p>
          <h2 className="h2">
            Photograph the plate. Get the <Em>real number</Em>
          </h2>
          <p className="lede">
            No weighing, no database hunting. One photo and Keel names every item, counts
            the protein and tells you what to do next.
          </p>
        </div>

        <div className="co-stage">
          {/* The scan */}
          <div className="co-scan">
            <figure className="co-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/plate.jpg"
                alt="Grilled chicken, sweet potato and green beans on a ceramic plate"
                loading="lazy"
              />
              <span className="co-scanline" aria-hidden="true" />
            </figure>
            <ul className="co-chips" aria-label="Items Keel found">
              {ITEMS.map((it) => (
                <li className="co-chip" key={it.name}>
                  {it.name} <b>{it.g}g</b>
                </li>
              ))}
            </ul>
            <p className="co-total">
              <span className="co-total-num">53</span>g protein in this meal
            </p>
            <p className="co-verdict">
              <i className="tick" aria-hidden="true" />
              Fits your day. 124g so far.
            </p>
          </div>

          {/* The coach */}
          <div className="co-talk">
            <div className="co-avatar-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="co-avatar"
                src="/img/coach.png"
                alt="Keel's coach character"
                width={420}
                height={420}
              />
            </div>
            <div className="co-thread">
              <span className="co-typing" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <p className="co-bubble">
                Good one. That puts you 14g ahead of where you were this time last week.
              </p>
              <p className="co-bubble">
                You&apos;ve got 3 sets of goblet squats tonight. Eat the yoghurt after, not
                before.
              </p>
            </div>
            <p className="co-note">
              It sees your food, your lifts and your sleep. It never diagnoses, and it sends
              you to your GP for anything clinical.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
