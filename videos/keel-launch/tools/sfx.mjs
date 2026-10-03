// The nine UI sounds from the motion guide, made in code: pop, tick, counter,
// chime, snap, star, switch, fill, success. Small clicks for the moments that
// matter; no whooshes. node sfx.mjs <outDir>

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const out = process.argv[2];
mkdirSync(out, { recursive: true });
const SR = 44100;

let seed = 99991;
const noise = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff) * 2 - 1;

function render(dur, fn) {
  const n = Math.floor(dur * SR);
  const buf = new Float32Array(n);
  for (let i = 0; i < n; i++) buf[i] = fn(i / SR, i);
  return buf;
}
const sine = (f, t) => Math.sin(2 * Math.PI * f * t);
const env = (t, a, d) => Math.min(1, t / a) * Math.exp(-t / d);

const sounds = {
  // A rounded bubble: pitch rises fast, dies fast.
  pop: render(0.16, (t) => sine(380 + 900 * (1 - Math.exp(-t * 60)), t) * env(t, 0.002, 0.035)),
  // A dry wooden tick.
  tick: render(0.06, (t) => (sine(2400, t) * 0.6 + sine(3900, t) * 0.4) * env(t, 0.0005, 0.008)),
  // A rolling ratchet for counters: 18 tiny ticks easing out over 1.2s.
  counter: (() => {
    const dur = 1.3;
    const buf = new Float32Array(Math.floor(dur * SR));
    const ticks = 18;
    for (let k = 0; k < ticks; k++) {
      const at = 1.2 * (1 - (1 - k / ticks) ** 2);
      const s0 = Math.floor(at * SR);
      const f = 2000 + k * 40;
      for (let i = 0; i < SR * 0.03; i++) {
        const t = i / SR;
        if (s0 + i < buf.length) buf[s0 + i] += sine(f, t) * env(t, 0.0005, 0.006) * 0.7;
      }
    }
    return buf;
  })(),
  // Two soft bell partials, a fifth apart, arriving a beat apart.
  chime: render(1.6, (t) => {
    const a = (sine(1046.5, t) + 0.3 * sine(2093, t)) * env(t, 0.003, 0.5);
    const t2 = Math.max(0, t - 0.09);
    const b = t > 0.09 ? (sine(1568, t2) + 0.3 * sine(3136, t2)) * env(t2, 0.003, 0.6) : 0;
    return (a + b) * 0.5;
  }),
  // A crisp snap: filtered noise burst on a low body.
  snap: render(0.09, (t) => (noise() * 0.6 + sine(220, t) * 0.5) * env(t, 0.0003, 0.012)),
  // A tiny sparkle: three high pings stepping up.
  star: render(0.7, (t) => {
    let v = 0;
    [0, 0.06, 0.12].forEach((o, i) => {
      if (t >= o) v += sine([2637, 3136, 3951][i], t - o) * env(t - o, 0.001, 0.12);
    });
    return v * 0.4;
  }),
  // A toggle: two clicks, low then high.
  switch: render(0.12, (t) => {
    const a = sine(900, t) * env(t, 0.0005, 0.006);
    const b = t > 0.05 ? sine(1500, t - 0.05) * env(t - 0.05, 0.0005, 0.006) : 0;
    return a + b;
  }),
  // A soft rising fill for progress bars.
  fill: render(0.8, (t) => {
    const f = 300 + 500 * (t / 0.8);
    return sine(f, t) * Math.min(1, t / 0.05) * Math.max(0, 1 - t / 0.8) * 0.35;
  }),
  // A happy three-note arpeggio, C E G.
  success: render(0.9, (t) => {
    let v = 0;
    [523.25, 659.25, 783.99].forEach((f, i) => {
      const o = i * 0.08;
      if (t >= o) v += (sine(f, t - o) + 0.25 * sine(f * 2, t - o)) * env(t - o, 0.002, 0.25);
    });
    return v * 0.35;
  }),
};

function wav(buf) {
  let peak = 0;
  for (const v of buf) peak = Math.max(peak, Math.abs(v));
  const g = 0.89 / (peak || 1);
  const b = Buffer.alloc(44 + buf.length * 2);
  b.write('RIFF', 0);
  b.writeUInt32LE(36 + buf.length * 2, 4);
  b.write('WAVEfmt ', 8);
  b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20);
  b.writeUInt16LE(1, 22);
  b.writeUInt32LE(SR, 24);
  b.writeUInt32LE(SR * 2, 28);
  b.writeUInt16LE(2, 32);
  b.writeUInt16LE(16, 34);
  b.write('data', 36);
  b.writeUInt32LE(buf.length * 2, 40);
  buf.forEach((v, i) => b.writeInt16LE(Math.round(v * g * 32767), 44 + i * 2));
  return b;
}

for (const [name, buf] of Object.entries(sounds)) writeFileSync(join(out, `${name}.wav`), wav(buf));
console.log(`wrote ${Object.keys(sounds).length} sounds to ${out}`);
