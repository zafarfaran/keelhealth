"use client";

import type { ComponentProps } from "react";
import { useHit } from "@/lib/motion/hits";

/**
 * A <section> that gains the `hit` class once the page line's pen reaches `hit` (a selector).
 * Its children can stay server-rendered; only this wrapper runs on the client.
 */
export function HitSection({ hit, className = "", ...rest }: { hit: string } & ComponentProps<"section">) {
  const on = useHit(hit);
  return <section className={on ? `${className} hit` : className} {...rest} />;
}
