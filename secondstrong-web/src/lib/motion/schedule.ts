import { span01 } from "./frame";

/** One block of content the pen works through: it draws from `start` to `end` (path lengths). */
export interface Stop {
  start: number;
  end: number;
}

export interface ScheduleOptions {
  /** Scroll given to holding still on each stop so its text can be read (relative to drawing it). */
  hold: number;
  /** Scroll given to travelling between stops. */
  travel: number;
  /** Scroll before the first stop and after the last. */
  lead: number;
  exit: number;
}

export interface ScheduleState {
  /** How much of the path is drawn. */
  drawn: number;
  /** Which stop the view should be on; fractional while travelling (for the phone camera). */
  view: number;
  /** How far each stop's text has revealed, 0..1. It stays at 1 once revealed. */
  text: number[];
}

type Phase =
  | { kind: "move"; from: number; to: number; view0: number; view1: number; w: number }
  | { kind: "hold"; at: number; stop: number; w: number };

/**
 * Turns scroll progress into what a pinned line section shows. Each stop gets: the pen drawing it
 * (view stays put), a hold while its text reveals (view stays put), then travel to the next stop
 * (view pans). Readers on phones get time to read before the view moves on.
 */
export function makeSchedule(stops: Stop[], total: number, o: ScheduleOptions) {
  const phases: Phase[] = [];
  phases.push({ kind: "move", from: 0, to: stops[0].start, view0: 0, view1: 0, w: o.lead });
  stops.forEach((s, i) => {
    phases.push({ kind: "move", from: s.start, to: s.end, view0: i, view1: i, w: 1 });
    phases.push({ kind: "hold", at: s.end, stop: i, w: o.hold });
    const next = stops[i + 1];
    if (next) phases.push({ kind: "move", from: s.end, to: next.start, view0: i, view1: i + 1, w: o.travel });
  });
  const last = stops.length - 1;
  phases.push({ kind: "move", from: stops[last].end, to: total, view0: last, view1: last, w: o.exit });
  const sum = phases.reduce((a, p) => a + p.w, 0);

  return (p: number): ScheduleState => {
    const text = stops.map(() => 0);
    let u = p * sum;
    for (const ph of phases) {
      if (u > ph.w) {
        u -= ph.w;
        if (ph.kind === "hold") text[ph.stop] = 1;
        continue;
      }
      const t = ph.w ? u / ph.w : 1;
      if (ph.kind === "hold") {
        text[ph.stop] = span01(t, 0, 0.6);
        return { drawn: ph.at, view: ph.stop, text };
      }
      const e = t * t * (3 - 2 * t); // smoothstep, so the view eases between stops
      return { drawn: ph.from + (ph.to - ph.from) * t, view: ph.view0 + (ph.view1 - ph.view0) * e, text };
    }
    return { drawn: total, view: last, text: stops.map(() => 1) };
  };
}
