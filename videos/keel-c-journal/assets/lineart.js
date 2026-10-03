// Line-art helpers shared by the Premo films. Everything here builds DOM once
// at setup and hands back tweens for the one paused timeline, so every frame is
// a pure function of time.
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  let uid = 0;

  // One shared "boil" filter: a little displacement whose seed steps at 8fps,
  // so ink lines shimmer the way hand-drawn animation does.
  function ensureBoil(root) {
    if (document.getElementById('la-boil')) return;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.innerHTML =
      '<filter id="la-boil" x="-2%" y="-2%" width="104%" height="104%">' +
      '<feTurbulence id="la-boil-noise" type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="1"/>' +
      '<feDisplacementMap in="SourceGraphic" scale="2.6" xChannelSelector="R" yChannelSelector="G"/>' +
      '</filter>';
    root.appendChild(svg);
  }

  function boil(tl, duration) {
    const noise = document.getElementById('la-boil-noise');
    const state = { f: 0 };
    tl.to(
      state,
      {
        f: duration * 8,
        duration,
        ease: 'none',
        onUpdate: () => noise.setAttribute('seed', String(1 + (Math.floor(state.f) % 6))),
      },
      0,
    );
  }

  // Turn <div class="sketch" data-src data-w data-h> into an SVG image revealed
  // by a fat zig-zag pen stroke. Returns the mask path so the caller can time it.
  function sketch(el) {
    const w = +el.dataset.w;
    const h = +el.dataset.h;
    const id = 'la-m' + uid++;
    const sw = Math.max(w, h) / (+el.dataset.rows || 9);
    const step = sw * 0.62;
    let d = '';
    let row = 0;
    for (let y = -sw * 0.3; y < h + sw * 0.6; y += step, row++) {
      const tilt = sw * 0.35;
      if (row === 0) d += `M ${-sw} ${y}`;
      d += row % 2 ? ` L ${-sw} ${y + tilt}` : ` L ${w + sw} ${y - tilt}`;
      d += ` L ${row % 2 ? -sw : w + sw} ${y + step}`;
    }
    el.innerHTML =
      `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" overflow="visible">` +
      `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="${-sw}" y="${-sw}" width="${w + sw * 2}" height="${h + sw * 2}">` +
      `<path d="${d}" fill="none" stroke="#fff" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/></mask></defs>` +
      `<g filter="url(#la-boil)"><image href="${el.dataset.src}" width="${w}" height="${h}" mask="url(#${id})"/></g></svg>`;
    const path = el.querySelector('mask path');
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    path.dataset.len = String(len);
    return path;
  }

  function draw(tl, el, duration, at, ease) {
    const paths = el.tagName === 'path' || el.tagName === 'circle' || el.tagName === 'line' ? [el] : el.querySelectorAll('path, circle, line, polyline');
    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
      tl.to(p, { strokeDashoffset: 0, duration, ease: ease || 'power2.inOut' }, at);
    });
  }

  function reveal(tl, el, duration, at) {
    const path = el.querySelector('mask path');
    tl.to(path, { strokeDashoffset: 0, duration, ease: 'power1.inOut' }, at);
  }

  window.LineArt = { ensureBoil, boil, sketch, draw, reveal };
})();
