"use client";

import { useEffect } from "react";
import { useStill } from "./MotionProvider";

/**
 * Headings marked `.slam` land line by line, and stroke emoji pop in, when they scroll into
 * the lower part of the viewport. The motion itself is CSS (see `.slam.in` / `.emo.in`);
 * this only adds `.in` once, with one shared IntersectionObserver.
 */
export function Slams() {
  const still = useStill();
  useEffect(() => {
    if (still) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    document.querySelectorAll("#page .slam, #page .emo").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [still]);
  return null;
}
