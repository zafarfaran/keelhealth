'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * The floating UI cards that orbit the hero subject.
 *
 * Real markup rather than generated pictures of UI, so they stay sharp, restyle
 * with the tokens, and can actually animate their own contents.
 *
 * They enter in a stagger, their contents draw themselves, and they part at
 * different rates as the hero scrolls away. No cursor tracking and no perpetual
 * float: both were decoration that told the visitor nothing and did nothing at
 * all on a touch screen.
 *
 * Deliberately not weight or fasting cards, whatever the category does — the
 * Honest section promises neither exists in the product.
 */
export default function HeroCards() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    /* Motion is always on; only the reader's OS reduced-motion setting stops it. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const cards = gsap.utils.toArray<HTMLElement>('.hc', root);
    const ctx = gsap.context(() => {
      /* Entrance */
      gsap.from(cards, {
        y: 26,
        scale: 0.92,
        opacity: 0,
        duration: 0.8,
        stagger: 0.14,
        delay: 0.35,
        ease: 'power3.out',
        clearProps: 'opacity',
      });

      /* The protein ring fills and its number counts with it */
      const ring = root.querySelector('.hc-ring-fill') as SVGCircleElement | null;
      const num = root.querySelector('.hc-ring-num');
      if (ring) {
        const len = ring.getTotalLength();
        ring.style.strokeDasharray = String(len);
        const v = { n: 0 };
        gsap.fromTo(
          ring,
          { strokeDashoffset: len },
          { strokeDashoffset: len * 0.14, duration: 1.6, delay: 0.9, ease: 'power2.out' }
        );
        gsap.to(v, {
          n: 94,
          duration: 1.6,
          delay: 0.9,
          ease: 'power2.out',
          onUpdate: () => {
            if (num) num.textContent = String(Math.round(v.n));
          },
        });
      }

      /* The grip sparkline draws itself */
      const spark = root.querySelector('.hc-spark-line') as SVGPathElement | null;
      if (spark) {
        const len = spark.getTotalLength();
        gsap.fromTo(
          spark,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 1.2, delay: 1.1, ease: 'power2.out' }
        );
      }

      /* Depth, driven by the scroll rather than the cursor.
         Each card leaves at its own rate, so the cluster reads as layers at
         different distances instead of a flat sheet. Tied to an action every
         visitor performs, so it works the same on a phone. */
      cards.forEach((c) => {
        const depth = Number((c as HTMLElement).dataset.depth || 1);
        gsap.to(c, {
          yPercent: -16 * depth,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="hero-cards" ref={ref} aria-hidden="true">
      {/* Protein, not calories */}
      <div className="hc hc-ring" data-depth="1.4">
        <span className="hc-label">Protein today</span>
        <div className="hc-ring-body">
          <svg viewBox="0 0 72 72">
            <circle className="hc-ring-track" cx="36" cy="36" r="29" />
            <circle
              className="hc-ring-fill"
              cx="36"
              cy="36"
              r="29"
              transform="rotate(-90 36 36)"
            />
          </svg>
          <span className="hc-ring-read">
            <span className="hc-ring-num">94</span>
            <span className="hc-ring-of">/110g</span>
          </span>
        </div>
      </div>

      {/* Strength, not the scale */}
      <div className="hc hc-spark" data-depth="2.1">
        <span className="hc-label">Grip strength</span>
        <svg className="hc-spark-svg" viewBox="0 0 120 38" preserveAspectRatio="none">
          <path
            className="hc-spark-line"
            d="M4,32 L26,29 L48,24 L70,20 L92,13 L116,6"
            fill="none"
          />
        </svg>
        <span className="hc-spark-val">
          27<span className="hc-unit">kg</span>
          <em className="hc-delta">+3</em>
        </span>
      </div>

      {/* The coach, so the mascot lands above the fold */}
      <div className="hc hc-coach" data-depth="2.4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hc-coach-av" src="/img/coach.png" alt="" width={120} height={120} />
        <span className="hc-coach-text">
          <span className="hc-label">Coach</span>
          That&apos;s 38g. You&apos;re ahead of last week.
        </span>
      </div>

      {/* A meal, with the number that matters on it */}
      <div className="hc hc-meal" data-depth="1.7">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hc-meal-thumb" src="/img/salmon.jpg" alt="" width={80} height={80} />
        <span className="hc-meal-name">Salmon &amp; lentils</span>
        <span className="hc-meal-meta">38g protein · 12 min</span>
      </div>
    </div>
  );
}
