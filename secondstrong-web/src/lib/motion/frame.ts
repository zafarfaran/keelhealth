"use client";

import { useEffect, useEffectEvent } from "react";

/** Runs `callback` every animation frame while `active`, always calling the latest version. */
export function useFrame(callback: () => void, active = true) {
  const onFrame = useEffectEvent(callback);
  useEffect(() => {
    if (!active) return;
    let id = 0;
    const loop = () => {
      onFrame();
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [active]);
}

/** How far the viewport has scrolled through a pinned (tall) section, 0 to 1. */
export function pinProgress(el: HTMLElement): number {
  const r = el.getBoundingClientRect();
  const span = r.height - innerHeight;
  return span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Where `v` sits between `a` and `b`, clamped to 0..1. */
export const span01 = (v: number, a: number, b: number) => clamp01((v - a) / (b - a || 1));

/**
 * Rebuild geometry after real layout changes: fonts loaded, width changed, page height changed.
 * Height-only window resizes are ignored on touch devices, because phones fire them whenever the
 * address bar shows or hides; the pinned sections use svh so their layout doesn't move then.
 */
export function useLayoutRebuild(build: () => void, deps: unknown[] = []) {
  const onBuild = useEffectEvent(build);
  useEffect(() => {
    let timer = 0;
    let last = { w: -1, h: -1, body: -1 };
    const coarse = matchMedia("(pointer: coarse)");
    const sizes = () => ({ w: innerWidth, h: innerHeight, body: document.body.scrollHeight });
    const rebuild = () => {
      last = sizes();
      onBuild();
    };
    const check = () => {
      const now = sizes();
      const changed = now.w !== last.w || now.body !== last.body || (!coarse.matches && now.h !== last.h);
      if (changed) rebuild();
    };
    const schedule = () => {
      clearTimeout(timer);
      timer = window.setTimeout(check, 150);
    };
    document.fonts.ready.then(rebuild);
    addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    return () => {
      clearTimeout(timer);
      removeEventListener("resize", schedule);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
