import type { Step } from "./path";

export interface Measured {
  /** The whole path, for the <path d>. */
  d: string;
  total: number;
  hits: { at: number; selector: string }[];
  /** Samples along the path: length, x, y, and the lowest y reached so far (for scroll mapping). */
  len: Float64Array;
  x: Float64Array;
  y: Float64Array;
  maxY: Float64Array;
}

const NS = "http://www.w3.org/2000/svg";

/**
 * Measures a route step by step. Each step is measured on its own short probe path, so the cost
 * is linear in the route's length. (Sampling one long path with getPointAtLength walks it from the
 * start every call, which took seconds on phones.)
 */
export function measure(steps: Step[], host: SVGSVGElement, spacing = 10): Measured {
  const probe = document.createElementNS(NS, "path");
  host.appendChild(probe);
  const len: number[] = [], xs: number[] = [], ys: number[] = [];
  const hits: Measured["hits"] = [];
  let d = "";
  let cum = 0;

  for (const st of steps) {
    if (st.d.startsWith("M")) {
      len.push(cum); xs.push(st.from[0]); ys.push(st.from[1]);
    } else if (st.d) {
      probe.setAttribute("d", `M ${st.from[0]} ${st.from[1]} ${st.d}`);
      const l = probe.getTotalLength();
      const n = Math.max(1, Math.ceil(l / spacing));
      for (let k = 1; k <= n; k++) {
        const p = probe.getPointAtLength((l * k) / n);
        len.push(cum + (l * k) / n); xs.push(p.x); ys.push(p.y);
      }
      cum += l;
    }
    if (st.d) d += " " + st.d;
    if (st.hit) hits.push({ at: cum, selector: st.hit });
  }
  probe.remove();

  const maxY = new Float64Array(ys.length);
  let m = -Infinity;
  ys.forEach((v, i) => (maxY[i] = m = Math.max(m, v)));
  return { d, total: cum, hits, len: Float64Array.from(len), x: Float64Array.from(xs), y: Float64Array.from(ys), maxY };
}

/** Index of the last sample whose value in `arr` (ascending) is <= v. */
function lastAtOrBelow(arr: Float64Array, v: number) {
  let lo = 0, hi = arr.length - 1;
  if (hi < 0 || arr[0] > v) return 0;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (arr[mid] <= v) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/** How much of the path should be drawn when the pen may go as low as page y. */
export function lengthForY(m: Measured, y: number) {
  return m.len[lastAtOrBelow(m.maxY, y)] ?? 0;
}

/** The pen's position at a drawn length, interpolated between samples (no path walking). */
export function pointAt(m: Measured, l: number): [number, number] {
  const i = lastAtOrBelow(m.len, l);
  const j = Math.min(i + 1, m.len.length - 1);
  const span = m.len[j] - m.len[i];
  const t = span > 0 ? Math.min(1, Math.max(0, (l - m.len[i]) / span)) : 0;
  return [m.x[i] + (m.x[j] - m.x[i]) * t, m.y[i] + (m.y[j] - m.y[i]) * t];
}
