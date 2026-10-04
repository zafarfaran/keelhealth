"use client";

import { useRef } from "react";
import { useStill } from "@/lib/motion/MotionProvider";
import { useFrame, useLayoutRebuild } from "@/lib/motion/frame";
import { setHits } from "@/lib/motion/hits";
import { box, isPhone, pageWidth } from "@/lib/line/geometry";
import { buildRoute } from "@/lib/line/route";
import { lengthForY, measure, pointAt, type Measured } from "@/lib/line/measure";

interface Built extends Measured {
  /** The browser's own length for the whole path, which the dash offset is measured against. */
  pathTotal: number;
}

/**
 * The one line that runs the whole page. Ink where the section is light, ivory where it is
 * dark, drawn by scroll with the pen leading at 62% of the viewport.
 */
export function PageLine() {
  const still = useStill();
  const svg = useRef<SVGSVGElement>(null);
  const ink = useRef<SVGPathElement>(null);
  const ivory = useRef<SVGPathElement>(null);
  const nib = useRef<SVGCircleElement>(null);
  const clipDark = useRef<SVGClipPathElement>(null);
  const maskLight = useRef<SVGMaskElement>(null);
  const built = useRef<Built | null>(null);
  const drawn = useRef(0);
  const painted = useRef(-1);
  const hitCount = useRef(-1);

  const paint = () => {
    const b = built.current;
    if (!b || !ink.current || !ivory.current || !nib.current) return;
    const dr = drawn.current;
    if (Math.abs(dr - painted.current) < 0.25) return; // nothing visible changed
    painted.current = dr;
    const off = b.pathTotal - dr * (b.pathTotal / (b.total || 1));
    ink.current.style.strokeDashoffset = `${off}`;
    ivory.current.style.strokeDashoffset = `${off}`;
    const [x, y] = pointAt(b, dr);
    nib.current.setAttribute("cx", `${x}`);
    nib.current.setAttribute("cy", `${y}`);
    nib.current.style.opacity = dr > 2 && dr < b.total - 2 ? "1" : "0";
    const reached = b.hits.filter((h) => dr >= h.at - 2);
    if (reached.length !== hitCount.current) {
      hitCount.current = reached.length;
      setHits(new Set(reached.map((h) => h.selector)));
    }
  };

  const build = () => {
    const s = svg.current, a = ink.current, v = ivory.current;
    if (!s || !a || !v || !nib.current || !clipDark.current || !maskLight.current) return;
    const page = document.getElementById("page")!;
    const H = page.scrollHeight, W = pageWidth();
    s.setAttribute("viewBox", `0 0 ${W} ${H}`);
    s.style.height = `${H}px`;
    const sw = isPhone() ? 4.5 : 7;
    a.setAttribute("stroke-width", `${sw}`);
    v.setAttribute("stroke-width", `${sw}`);
    nib.current.setAttribute("r", `${sw + 2}`);

    // Ivory over dark fields, ink over light ones.
    const dark = [...document.querySelectorAll<HTMLElement>("#page section[data-tone=dark], #page footer")].map((el) => box(`#${el.id}`));
    clipDark.current.innerHTML = dark.map((d) => `<rect x="0" y="${d.y}" width="${W}" height="${d.h}"/>`).join("");
    maskLight.current.innerHTML =
      `<rect x="0" y="0" width="${W}" height="${H}" fill="#fff"/>` +
      dark.map((d) => `<rect x="0" y="${d.y}" width="${W}" height="${d.h}" fill="#000"/>`).join("");

    const m = measure(buildRoute(), s);
    a.setAttribute("d", m.d);
    v.setAttribute("d", m.d);
    const pathTotal = a.getTotalLength();
    [a, v].forEach((p) => (p.style.strokeDasharray = `${pathTotal} ${pathTotal + 10}`));
    built.current = { ...m, pathTotal };
    if (still) drawn.current = m.total;
    else drawn.current = Math.min(drawn.current, m.total);
    painted.current = -1;
    hitCount.current = -1;
    paint();
  };

  useLayoutRebuild(build, [still]);

  // Scroll sets a target length; the pen eases towards it so fast flicks still read as drawing.
  useFrame(() => {
    const b = built.current;
    if (!b) return;
    const atBottom = scrollY + innerHeight >= document.documentElement.scrollHeight - 4;
    const want = atBottom ? b.total : lengthForY(b, scrollY + innerHeight * 0.62);
    if (drawn.current === want) return;
    drawn.current += (want - drawn.current) * 0.14;
    if (Math.abs(want - drawn.current) < 0.5) drawn.current = want;
    paint();
  }, !still);

  return (
    <svg id="line" ref={svg} aria-hidden="true">
      <defs>
        <clipPath id="clipDark" ref={clipDark} />
        <mask id="maskLight" ref={maskLight} maskUnits="userSpaceOnUse" />
      </defs>
      <path ref={ink} stroke="#3B322C" mask="url(#maskLight)" />
      <path ref={ivory} stroke="#FBF8F4" clipPath="url(#clipDark)" />
      <circle id="nib" ref={nib} r="7" fill="#C08E82" />
    </svg>
  );
}
