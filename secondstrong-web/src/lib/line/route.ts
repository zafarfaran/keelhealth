import { at, box, dayGx, factsExitX, factsGx, heroExitX, isPhone, pageWidth, type Pt } from "./geometry";
import { PathBuilder, type FrameOptions, type Step } from "./path";

/**
 * The page line's route, top to bottom. It is built from where the named elements sit,
 * so it adapts to any layout. Each moment frames, rings or underlines something, and
 * marks it as hit so that section can react when the pen arrives.
 *
 * On phones (< 860px) the line runs down the left gutter between moments so it never
 * crosses text.
 */
export function buildRoute(): Step[] {
  const W = pageWidth();
  const mob = isPhone();
  const pad = mob ? 10 : 16;
  const p = new PathBuilder();

  const gut = (y: number) => {
    if (!mob) return;
    if (p.cur[0] > 8) p.C([6, Math.min(p.cur[1] + 50, y - 40)], [-0.4, 1], [0, 1], 0.4);
    if (y - 40 > p.cur[1]) p.L([6, y - 40]);
  };
  const frame = (sel: string, r?: number, o?: number, opts?: FrameOptions) => p.frame(box(sel), sel, r, o, opts);

  // 01 hero: pick up the film's line where it leaves the bottom of the pinned screen
  const heroB = box("#hero");
  p.M([heroExitX(), heroB.y + heroB.h - 2]);
  if (mob) gut(box("#f-phone").y);

  // 02 apps: loop the phone drawing
  frame("#f-phone", 40, pad, mob ? {} : { start: "tr", t0: [0, 1] });

  // 02b facts: meet the section's own line at the top, hide behind the pin, come out where it leaves
  const fk = box("#facts");
  const fEx = factsExitX();
  if (mob) gut(fk.y);
  else p.C([factsGx(), fk.y - 2], [-0.3, 1], [0, 1]);
  p.L([p.cur[0], fk.y + fk.h - 60]);
  p.L([fEx, fk.y + fk.h - 60]);
  p.L([fEx, fk.y + fk.h]);

  // 03 protein: a ring round the number
  const n = box("#ring62");
  const rx = n.w / 2 + 10, ry = n.h / 2 + 10, cx = n.x + n.w / 2, cy = n.y + n.h / 2;
  if (mob) {
    gut(cy);
    p.C([cx - rx, cy], [0, 1], [0, 1]);
    p.raw(`A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 0 0 ${cx - rx} ${cy}`, [cx - rx, cy], "#ring62");
  } else {
    // in from the right, one and a half turns, out on the left
    p.C([cx + rx, cy], [0, 1], [0, 1]);
    p.raw(`A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy}`, [cx - rx, cy], "#ring62");
  }

  // 04 symptoms: down the margin, then frame each card, edge to edge
  gut(box("#card1").y);
  if (!mob) p.C(at("#card1", 0, 0, -pad, -pad - 60), [0, 1], [0, 1]);
  frame("#card1", 22, pad, { end: "tl" });
  frame("#card2", 22, pad, { enter: "l", end: "tl" });
  frame("#card3", 22, pad, { enter: "l" });
  gut(box("#wm-mid").y - 40);

  // 05 brand: drop in from above into the dot of the wordmark
  const wm = box("#wm-mid");
  const wd = box("#wm-mid .dot");
  const dot: Pt = [wd.x + wd.w / 2, wd.y + wd.h / 2];
  p.C([dot[0] + 40, wm.y - 50], [0, 1], [0, 1]);
  p.C(dot, [0, 1], [-0.3, 1], 0.5);
  p.hit("#brand");

  // 06 plate: frame the plate, then underline the chips
  gut(box("#f-plate").y);
  frame("#f-plate", 30, pad, { t0: [1, 0.6] });
  if (!mob) {
    p.C(at("#chips", 0, 1, 0, 16), [0, 1], [1, 0]);
    p.L(at("#chips", 1, 1, 0, 16));
  }
  p.hit("#plate");

  // 07 gap: trace the pill of the protein bar
  const g = box("#bar"), gr = g.h / 2, gx1 = g.x + g.w, gy1 = g.y + g.h, gm = g.y + gr;
  if (mob) {
    gut(gm);
    p.C([g.x, gm], [0, 1], [0, -1], 0.3);
    p.raw(`A ${gr} ${gr} 0 0 1 ${g.x + gr} ${g.y} L ${gx1 - gr} ${g.y} A ${gr} ${gr} 0 0 1 ${gx1 - gr} ${gy1} L ${g.x + gr} ${gy1} A ${gr} ${gr} 0 0 1 ${g.x} ${gm}`, [g.x, gm], "#gap");
  } else {
    p.C([gx1, gm], [1, 0], [0, 1]);
    p.raw(`A ${gr} ${gr} 0 0 1 ${gx1 - gr} ${gy1} L ${g.x + gr} ${gy1} A ${gr} ${gr} 0 0 1 ${g.x + gr} ${g.y} L ${gx1 - gr} ${g.y} A ${gr} ${gr} 0 0 1 ${gx1} ${gm}`, [gx1, gm], "#gap");
    p.raw(`A ${gr} ${gr} 0 0 1 ${gx1 - gr} ${gy1} L ${g.x + gr} ${gy1} A ${gr} ${gr} 0 0 1 ${g.x} ${gm}`, [g.x, gm]);
  }

  // 08 coach: the two messages
  gut(box("#b1").y);
  frame("#b1", 26, 0);
  frame("#b2", 26, 0);

  // 09 lift: the line climbs eight steps
  const s = box("#stairs");
  const x0 = s.x + s.w * (mob ? 0.42 : 0.38), x1 = s.x + s.w, y0 = s.y + s.h, y1 = s.y + 24;
  if (mob) {
    gut(y0 - 20);
    p.C([x0, y0], [0, 1], [1, 0]);
  } else p.C([x0, y0], [0, 1], [0, 1]);
  let stairs = "";
  for (let i = 1; i <= 8; i++) {
    const sx = x0 + ((x1 - x0) * i) / 8, sy = y0 - ((y0 - y1) * i) / 8;
    stairs += ` L ${sx - (x1 - x0) / 8} ${sy} L ${sx} ${sy}`;
  }
  p.raw(stairs, [x1, y1], "#lift");
  p.C([Math.min(x1 + 50, W - 10), y0 + 90], [1, 0], [0, 1]);

  // 10 fridge: frame the recipe card
  if (mob) p.L([W - 6, box("#recipe").y - 50]);
  frame("#recipe", 18, 0, mob ? { t0: [-1, 0.2], t1: [0, 1] } : { t1: [0.3, 1] });
  p.hit("#fridge");

  // 10a the day: meet the section's own line at the top-left margin, hide behind the pin,
  // and come out where it leaves at the bottom of the same margin
  const dy = box("#day");
  const dgx = dayGx();
  if (mob) {
    const rc = box("#recipe");
    p.C([6, rc.y + rc.h + 22], [0, 1], [-1, 0], 0.4);
    p.L([6, dy.y - 2]);
  } else p.C([dgx, dy.y - 2], [-0.3, 1], [0, 1]);
  p.L([dgx, dy.y + dy.h]);

  // 10b how it works: a ring round each step number
  const ring = (sel: string, endRight: boolean) => {
    const b = box(sel), r = b.w / 2 + 12, rcx = b.x + b.w / 2, rcy = b.y + b.h / 2;
    p.C([rcx - r, rcy], [0, 1], [0, -1], 0.4);
    p.raw(`A ${r} ${r} 0 0 1 ${rcx + r} ${rcy} A ${r} ${r} 0 0 1 ${rcx - r} ${rcy}` + (endRight ? ` A ${r} ${r} 0 0 1 ${rcx + r} ${rcy}` : ""), [endRight ? rcx + r : rcx - r, rcy], sel);
  };
  if (mob) {
    ["#n1", "#n2", "#n3"].forEach((sel) => {
      gut(box(sel).y);
      ring(sel, false);
    });
  } else {
    ring("#n1", true);
    ["#n2", "#n3"].forEach((sel) => {
      const b = box(sel), r = b.w / 2 + 12, my = b.y + b.h / 2, l = b.x - 12, rt = b.x + b.w + 12;
      p.C([l, my], [1, 0], [1, 0], 0.3);
      p.raw(`A ${r} ${r} 0 0 1 ${rt} ${my} A ${r} ${r} 0 0 1 ${l} ${my} A ${r} ${r} 0 0 1 ${rt} ${my}`, [rt, my], sel);
    });
  }

  // 10c more inside: frame the toolbox
  gut(box("#tiles").y);
  if (mob) frame("#tiles", 26, 6);
  else {
    p.L([W - 40, p.cur[1]]);
    frame("#tiles", 26, 6, { start: "tr", t0: [0, 1] });
  }

  // 10d strong for life: underline the habits, which fill as the pen passes
  const hb = box("#habits");
  const uy = hb.y + hb.h + 22;
  if (mob) {
    gut(hb.y + hb.h + 10);
    p.C([hb.x, uy], [0, 1], [1, 0], 0.4);
  } else p.C([hb.x - 10, uy], [0, 1], [1, 0]);
  p.L([hb.x + Math.min(hb.w, 330), uy]);
  p.hit("#strong");
  if (mob) p.L([6, uy]); // back along the same stroke to the gutter

  // 10e reports: frame both sheets
  if (mob) {
    gut(box("#sheet1").y);
    frame("#sheet1", 18, 10);
    gut(box("#sheet2").y);
    frame("#sheet2", 18, 10);
  } else {
    p.L([W - 40, p.cur[1]]);
    frame("#sheet2", 18, 10, { start: "tr", t0: [0, 1], end: "tr" });
    frame("#sheet1", 18, 10, { start: "tr", enter: "l", end: "bl" });
  }

  // 11 waiting list: the line frames the sign-up card, then slips down the margin past the FAQ
  gut(box("#wl-form").y);
  frame("#wl-form", 34, 12);
  const fq = box("#faq");
  const gx = mob ? 6 : Math.max(10, box("#faq .wrap").x - 44);
  p.C([gx, box("#wl-form").y + box("#wl-form").h + 120], [-0.5, 1], [0, 1]);
  p.L([gx, fq.y + fq.h - 60]);

  // 12 end: drop into the dot of the last wordmark
  const we = box("#wm-end");
  const ed = box("#wm-end .dot");
  const dot2: Pt = [ed.x + ed.w / 2, ed.y + ed.h / 2];
  p.C([dot2[0] + 40, we.y - 50], [0, 1], [0, 1]);
  p.C(dot2, [0, 1], [-0.3, 1], 0.5);
  p.hit("#end");

  return p.steps;
}
