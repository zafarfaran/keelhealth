"use client";

import { useEffect, useRef } from "react";
import { useHit } from "@/lib/motion/hits";
import { useStill } from "@/lib/motion/MotionProvider";

interface CountUpProps {
  /** Starts counting when the page line's pen reaches this selector. */
  trigger: string;
  from: number;
  to: number;
  suffix?: string;
  id?: string;
  className?: string;
  /** Count length in ms. */
  duration?: number;
}

const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** A number that counts from `from` to `to` once the pen arrives. */
export function CountUp({ trigger, from, to, suffix = "g", id, className, duration = 1100 }: CountUpProps) {
  const still = useStill();
  const hit = useHit(trigger);
  const el = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const raf = useRef(0);

  // Stop a running count only when the component goes away, not when the pen scrolls back.
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    if (still) {
      node.textContent = `${to}${suffix}`;
      return;
    }
    if (!hit || started.current) return;
    started.current = true;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      node.textContent = `${Math.round(from + (to - from) * expoOut(t))}${suffix}`;
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, [hit, still, from, to, suffix, duration]);

  return (
    // One text child that never changes from React's side; the count writes textContent directly.
    <div id={id} className={className} ref={el}>
      {`${from}${suffix}`}
    </div>
  );
}
