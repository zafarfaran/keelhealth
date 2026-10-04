import type { Pt } from "./geometry";

export interface Step {
  d: string;
  /** Where the pen is when this step starts, so each step can be measured on its own. */
  from: Pt;
  /** Selector that reacts when the pen reaches the end of this step. */
  hit?: string;
}

type Tangent = [number, number];

export interface FrameOptions {
  /** 'c' curves in using t0/t1; 'l' runs straight along an edge. */
  enter?: "c" | "l";
  t0?: Tangent;
  t1?: Tangent;
  /** 'tl'/'tr' stop back at the start corner; 'bl' redraws the left edge and leaves from the bottom. */
  end?: "tl" | "tr" | "bl";
  /** Trace clockwise from the top-left, or anticlockwise from the top-right (for a line arriving down the right margin). */
  start?: "tl" | "tr";
}

/** Builds one SVG path as a list of steps, tracking the pen position. */
export class PathBuilder {
  steps: Step[] = [];
  cur: Pt = [0, 0];

  private push(d: string, to: Pt, hit?: string) {
    this.steps.push({ d, from: this.cur, hit });
    this.cur = to;
  }

  M(p: Pt) {
    this.cur = p;
    this.steps.push({ d: `M ${p[0]} ${p[1]}`, from: p });
  }

  L(p: Pt) {
    this.push(`L ${p[0]} ${p[1]}`, p);
  }

  /** Cubic curve with tangent directions at each end; k scales the handle length. */
  C(p: Pt, t0: Tangent = [0, 1], t1: Tangent = [0, 1], k = 0.55) {
    const [cx, cy] = this.cur;
    const len = Math.hypot(p[0] - cx, p[1] - cy) * k;
    this.push(`C ${cx + t0[0] * len} ${cy + t0[1] * len} ${p[0] - t1[0] * len} ${p[1] - t1[1] * len} ${p[0]} ${p[1]}`, p);
  }

  raw(d: string, to: Pt, hit?: string) {
    this.push(d, to, hit);
  }

  hit(selector: string) {
    this.steps.push({ d: "", from: this.cur, hit: selector });
  }

  /** A rounded rectangle traced round a box (x0,y0)-(x1,y1). */
  frame(
    b: { x: number; y: number; w: number; h: number },
    hitSel: string,
    r = 22,
    o = 16,
    { enter = "c", t0 = [0, 1], t1 = [1, 0], end = "bl", start = "tl" }: FrameOptions = {},
  ) {
    const x0 = b.x - o, y0 = b.y - o, x1 = b.x + b.w + o, y1 = b.y + b.h + o;
    r = Math.min(r, (y1 - y0) / 2);
    if (start === "tr") {
      if (enter === "l") this.L([x1 - r, y0]);
      else this.C([x1 - r, y0], t0, [-1, 0]);
      this.raw(
        `L ${x0 + r} ${y0} A ${r} ${r} 0 0 0 ${x0} ${y0 + r} L ${x0} ${y1 - r} A ${r} ${r} 0 0 0 ${x0 + r} ${y1} L ${x1 - r} ${y1} A ${r} ${r} 0 0 0 ${x1} ${y1 - r} L ${x1} ${y0 + r} A ${r} ${r} 0 0 0 ${x1 - r} ${y0}`,
        [x1 - r, y0],
        hitSel,
      );
      if (end === "bl") this.raw(`L ${x0 + r} ${y0} A ${r} ${r} 0 0 0 ${x0} ${y0 + r} L ${x0} ${y1 - r}`, [x0, y1 - r]);
      return { x0, y0, x1, y1 };
    }
    if (enter === "l") this.L([x0 + r, y0]);
    else this.C([x0 + r, y0], t0, t1);
    this.raw(
      `L ${x1 - r} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y0 + r} L ${x1} ${y1 - r} A ${r} ${r} 0 0 1 ${x1 - r} ${y1} L ${x0 + r} ${y1} A ${r} ${r} 0 0 1 ${x0} ${y1 - r} L ${x0} ${y0 + r} A ${r} ${r} 0 0 1 ${x0 + r} ${y0}`,
      [x0 + r, y0],
      hitSel,
    );
    if (end === "bl") this.raw(`A ${r} ${r} 0 0 0 ${x0} ${y0 + r} L ${x0} ${y1 - r}`, [x0, y1 - r]);
    return { x0, y0, x1, y1 };
  }
}
