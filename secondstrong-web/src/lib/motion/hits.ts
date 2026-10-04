"use client";

import { useSyncExternalStore } from "react";

/**
 * Which moments the page line's pen has reached. The line marks a selector (e.g. "#brand")
 * as hit when the drawn length passes it; sections read that to fill a bar, light a dot, etc.
 */
let hits = new Set<string>();
const listeners = new Set<() => void>();

export function setHits(next: Set<string>) {
  if (next.size === hits.size && [...next].every((k) => hits.has(k))) return;
  hits = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** True once the pen has reached `selector`. */
export function useHit(selector: string): boolean {
  return useSyncExternalStore(
    subscribe,
    () => hits.has(selector),
    () => false,
  );
}
