// Shared runtime for Premo sketch films: one paused timeline, a storyboard
// world the camera whips across, pen-drawn strokes, squash-in words.
// Needs gsap and lineart.js loaded first. Everything is seek-safe.
(function () {
  function init({ duration, cell = [1320, 2160] }) {
    const LA = window.LineArt;
    LA.ensureBoil(document.getElementById('root'));
    const S = {};
    document.querySelectorAll('.sketch').forEach((el) => (S[el.id] = LA.sketch(el)));
    const tl = gsap.timeline({ paused: true });
    LA.boil(tl, duration);
    const [CW, CH] = cell;

    const dash = (el) => {
      const l = el.getTotalLength();
      el.style.strokeDasharray = `${l}`;
      el.style.strokeDashoffset = `${l}`;
      return l;
    };
    // Pen-draw every path inside sel (or sel itself if it is a path).
    const draw = (sel, at, d, ease = 'power2.out') => {
      const el = typeof sel === 'string' ? document.querySelector(sel) : sel;
      if (!el) throw new Error(`draw: nothing matches ${sel}`);
      const paths = el.tagName === 'path' ? [el] : [...el.querySelectorAll('path')];
      paths.forEach(dash);
      tl.to(paths, { strokeDashoffset: 0, duration: d, ease }, at);
    };
    const reveal = (id, at, d = 0.45) => LA.reveal(tl, document.getElementById(id), d, at);
    const show = (id, at) => tl.set(S[id], { strokeDashoffset: 0 }, at);
    const words = (sel, at, step = 0.1) =>
      tl.fromTo(`${sel} .w`, { y: 80, opacity: 0, scaleY: 1.6, scaleX: 0.7 }, { y: 0, opacity: 1, scaleY: 1, scaleX: 1, duration: 0.4, ease: 'back.out(2.2)', stagger: step }, at);
    const pop = (sel, at, from = {}) =>
      tl.fromTo(sel, { opacity: 0, scale: 0.3, rotation: -10, ...from }, { opacity: 1, scale: 1, rotation: 0, x: 0, y: 0, duration: 0.35, ease: 'back.out(2.6)' }, at);
    const count = (el, to, at, dur, dp = 0, suffix = '') => {
      const o = { v: 0 };
      tl.to(o, { v: to, duration: dur, ease: 'expo.out', onUpdate: () => (el.textContent = o.v.toFixed(dp) + suffix) }, at);
    };
    const typeText = (el, text, at, dur) => {
      const o = { n: 0 };
      tl.to(o, { n: text.length, duration: dur, ease: 'none', onUpdate: () => (el.textContent = text.slice(0, Math.round(o.n))) }, at);
    };
    const stamp = (sel, at, color) => {
      tl.to(sel, { fill: color, duration: 0.05 }, at);
      tl.fromTo(sel, { scale: 2, rotation: -40, transformOrigin: '50% 50%' }, { scale: 1, rotation: 0, duration: 0.22, ease: 'back.out(3)', immediateRender: false }, at);
    };

    // Camera: whip along an arrow to panel (c, r), speed lines for the move.
    let cam = { c: 0, r: 0 };
    tl.set('#world', { x: 0, y: 0, scale: 1 }, 0);
    const whip = (c, r, at, dur = 0.38) => {
      const vertical = r !== cam.r;
      tl.to('#world', { x: -c * CW, y: -r * CH, scale: 1, duration: dur, ease: 'expo.inOut' }, at);
      const sp = vertical ? '#speed-v' : '#speed-h';
      tl.fromTo(sp, { opacity: 0, x: 0, y: 0 }, { opacity: 0.9, x: vertical ? 0 : c > cam.c ? -120 : 120, y: vertical ? -140 : 0, duration: dur / 2, ease: 'power2.in', immediateRender: false }, at);
      tl.to(sp, { opacity: 0, duration: dur / 2, ease: 'power2.out' }, at + dur / 2);
      cam = { c, r };
    };
    const jump = (c, r, at) => {
      tl.set('#world', { x: -c * CW, y: -r * CH, scale: 1 }, at);
      cam = { c, r };
    };

    return { tl, S, dash, draw, reveal, show, words, pop, count, typeText, stamp, whip, jump, CW, CH };
  }
  window.Film = { init };
})();
