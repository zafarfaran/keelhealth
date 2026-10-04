export type Pt = [number, number];
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const PHONE_BREAKPOINT = 860;
export const isPhone = () => innerWidth < PHONE_BREAKPOINT;

const page = () => document.getElementById("page") as HTMLElement;
const el = (selector: string) => {
  const found = document.querySelector(selector);
  if (!found) throw new Error(`Line route: no element for ${selector}`);
  return found as HTMLElement;
};

/** An element's box in page coordinates (relative to #page). */
export function box(selector: string): Box {
  const r = el(selector).getBoundingClientRect();
  const p = page().getBoundingClientRect();
  return { x: r.left - p.left, y: r.top - p.top, w: r.width, h: r.height };
}

/** A point at fractions (fx, fy) of an element's box, plus pixel offsets. */
export function at(selector: string, fx: number, fy: number, dx = 0, dy = 0): Pt {
  const b = box(selector);
  return [b.x + b.w * fx + dx, b.y + b.h * fy + dy];
}

export const pageWidth = () => page().clientWidth;

// ---- hand-off points between the page line and the pinned sections' own lines ----

/** The hero film is object-fit: cover; its line leaves the bottom at x=1030 of 1920 (wide) or 120 of 1080 (tall). */
export const heroIsTall = () => innerWidth / innerHeight < 0.9;
export function heroExitX(): number {
  const vw = pageWidth();
  const vh = innerHeight;
  if (heroIsTall()) {
    const k = Math.max(vw / 1080, vh / 1920);
    return vw / 2 + (120 - 540) * k;
  }
  const k = Math.max(vw / 1920, vh / 1080);
  return vw / 2 + (1030 - 960) * k;
}

/** Where the facts section's line starts (top) — the left margin beside its columns. */
export function factsGx(): number {
  if (isPhone()) return 6;
  return Math.max(10, el("#facts .fcols").getBoundingClientRect().left - 44);
}

/** The day section's line enters at the top and leaves at the bottom of this left margin. */
export function dayGx(): number {
  if (isPhone()) return 6;
  return Math.max(10, el("#day .dcols").getBoundingClientRect().left - 44);
}

/** Where the facts section's line leaves the bottom of the screen. */
export function factsExitX(): number {
  if (isPhone()) return pageWidth() - 8;
  const r = el("#cb2").getBoundingClientRect();
  return Math.min(pageWidth() - 12, r.right + 28);
}
