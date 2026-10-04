/** Reveal an element left to right as `t` goes 0 → 1 (scroll-driven, so it reverses too). */
export function wipe(el: Element | null | undefined, t: number) {
  if (el) (el as HTMLElement).style.clipPath = t >= 1 ? "none" : `inset(-10% ${100 - t * 100}% -10% -10%)`;
}

/** Reveal an element bottom to top as `t` goes 0 → 1. */
export function rise(el: Element | null | undefined, t: number) {
  if (el) (el as HTMLElement).style.clipPath = `inset(${100 - t * 100}% 0 0 0)`;
}
