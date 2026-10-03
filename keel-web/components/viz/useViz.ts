'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Build = (root: HTMLElement, g: typeof gsap) => void;

/**
 * Shared plumbing for the scroll-scrubbed SVG visuals.
 *
 * Same rule as SiteMotion: the markup is the finished state. From-states are
 * applied only when a timeline actually runs, so every viz reads correctly with
 * JavaScript off and with motion reduced.
 */
export function useViz<T extends HTMLElement = HTMLDivElement>(build: Build) {
  const ref = useRef<T>(null);
  const latest = useRef(build);
  latest.current = build;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    /* Motion is always on; only the reader's OS reduced-motion setting stops it. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => latest.current(root, gsap), root);
    return () => ctx.revert();
  }, []);

  return ref;
}

/** Prepare a path for a scrubbed draw-on. Returns the length. */
export function dashPath(p: SVGPathElement | SVGPolylineElement) {
  const len = (p as SVGPathElement).getTotalLength();
  p.style.strokeDasharray = String(len);
  p.style.strokeDashoffset = String(len);
  return len;
}

/** Count an element's text from a to b, integer or fixed-decimal. */
export function countText(el: Element | null, v: number, dec = 0) {
  if (el) el.textContent = dec ? v.toFixed(dec) : String(Math.round(v));
}
