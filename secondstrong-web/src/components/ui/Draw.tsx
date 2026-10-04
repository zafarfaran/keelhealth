import type { DrawName } from "@/content/site";

interface DrawProps {
  name: DrawName;
  /** Accessible description; omit for decorative drawings. */
  label?: string;
  className?: string;
}

/** A line drawing. The image is a transparent mask, so it takes its colour from `color`. */
export function Draw({ name, label, className }: DrawProps) {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };
  return <span className={`draw d-${name}${className ? ` ${className}` : ""}`} {...a11y} />;
}
