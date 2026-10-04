"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

/**
 * `still` is true when motion should show its end state instead of animating:
 * the OS reduced-motion setting, or `?motion=off` (handy for screenshots).
 * The inline boot script (lib/motion/boot.ts) puts `.still` on <html> before first paint;
 * that class is the source of truth, and it follows the OS setting if it changes later.
 */
const StillContext = createContext(false);

function subscribe(notify: () => void) {
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  const forced = new URLSearchParams(location.search).get("motion") === "off";
  const onChange = () => {
    document.documentElement.classList.toggle("still", forced || query.matches);
    notify();
  };
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const readStill = () => document.documentElement.classList.contains("still");

export function MotionProvider({ children }: { children: ReactNode }) {
  const still = useSyncExternalStore(subscribe, readStill, () => false);
  return <StillContext.Provider value={still}>{children}</StillContext.Provider>;
}

export const useStill = () => useContext(StillContext);

/** True on data-saver, 2G or very low-memory devices (set by the boot script): show stills, skip films. */
export const isLite = () => typeof document !== "undefined" && document.documentElement.classList.contains("lite");
