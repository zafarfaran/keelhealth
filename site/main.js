/* Keel marketing site — motion + small interactions.
   Rule: markup is the finished state. From-states are only applied when an animation runs. */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ---------- Nav ---------- */
  var toggle = $('.nav-toggle');
  var menu = $('#mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      menu.hidden = open;
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
      });
    });
  }

  /* ---------- Anchor links (JS smooth scroll; CSS smooth-scroll breaks ScrollTrigger measuring) ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 68;
      window.scrollTo({ top: top, behavior: reducedMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ---------- Videos: fallback to the poster image on error, only play while on screen ---------- */
  $$('video').forEach(function (v) {
    var drop = function () { v.parentNode.classList.add('no-video'); };
    v.addEventListener('error', drop);
    $$('source', v).forEach(function (s) { s.addEventListener('error', drop); });
    if (reducedMotion) { v.pause(); drop(); return; }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
          else v.pause();
        });
      }, { rootMargin: '120px 0px' });
      io.observe(v);
    }
  });

  /* ---------- Currency ---------- */
  $$('.cur').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cur = btn.getAttribute('data-cur');
      $$('.cur').forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      $$('[data-gbp]').forEach(function (el) {
        el.textContent = el.getAttribute(cur === 'usd' ? 'data-usd' : 'data-gbp');
      });
    });
  });

  /* ---------- Motion level ---------- */
  var level = null;
  try { level = new URLSearchParams(location.search).get('motion') || localStorage.getItem('keel-motion'); } catch (e) { level = null; }
  if (['full','subtle','off'].indexOf(level) === -1) level = null;
  if (!level) level = reducedMotion ? 'off' : 'full';

  $$('[data-motion]').forEach(function (b) {
    var on = b.getAttribute('data-motion') === level;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', String(on));
    b.addEventListener('click', function () {
      try { localStorage.setItem('keel-motion', b.getAttribute('data-motion')); } catch (e) {}
      location.reload();
    });
  });

  function finishStaticStates() {
    var count = $('#gap-count'); if (count) count.textContent = '110';
    var fill = $('#gap-fill'); if (fill) fill.style.transform = 'scaleX(1)';
    $$('.gap-line').forEach(function (l, i) { l.classList.toggle('is-on', i === 2); });
    $$('.gap-pin, .manifesto-pin').forEach(function (p) { p.style.minHeight = '0'; });
  }

  if (level === 'off' || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    finishStaticStates();
    return;
  }

  var D = level === 'subtle' ? 0.5 : 1;   // distance multiplier
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out' });

  /* ---------- Helpers ---------- */
  function splitWords(el) {
    // Wrap each word in a span.w; keep child elements (like the emphasis span) whole.
    var nodes = Array.prototype.slice.call(el.childNodes);
    var out = [];
    nodes.forEach(function (n) {
      if (n.nodeType === 3) {
        var parts = n.textContent.split(/(\s+)/);
        parts.forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { out.push(document.createTextNode(' ')); return; }
          var s = document.createElement('span'); s.className = 'w'; s.textContent = p; out.push(s);
        });
      } else if (n.nodeType === 1) {
        n.classList.add('w'); out.push(n);
      }
    });
    el.innerHTML = '';
    out.forEach(function (n) { el.appendChild(n); });
    return Array.prototype.slice.call(el.children).filter(function (c) { return c.classList.contains('w'); });
  }

  function reveal(targets, opts) {
    var els = typeof targets === 'string' ? $$(targets) : targets;
    if (!els.length) return;
    opts = opts || {};
    gsap.from(els, {
      y: 28 * D, opacity: 0, duration: 0.7, stagger: opts.stagger || 0,
      scrollTrigger: { trigger: opts.trigger || els[0], start: 'top 90%', once: true },
      clearProps: 'transform,opacity'
    });
  }

  function underline(scope) {
    $$('.em-rule', scope || document).forEach(function (r) {
      gsap.from(r, { scaleX: 0, duration: 0.8, ease: 'power2.out', delay: 0.35,
        scrollTrigger: { trigger: r, start: 'top 92%', once: true } });
    });
  }

  function maskReveal(scope, delay) {
    $$('.mask-reveal', scope || document).forEach(function (el) {
      var r = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 28;
      gsap.fromTo(el,
        { clipPath: 'inset(0% 0% 100% 0% round ' + r + 'px)' },
        { clipPath: 'inset(0% 0% 0% 0% round ' + r + 'px)', duration: 1.1, ease: 'power3.out', delay: delay || 0,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      var img = $('img', el);
      if (img) gsap.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: 'power2.out', delay: delay || 0,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
  }

  function countTo(el, to, dur, dec, fmt) {
    var obj = { v: parseFloat(el.getAttribute('data-from') || '0') };
    return gsap.to(obj, { v: to, duration: dur || 1.3, ease: 'power2.out',
      onUpdate: function () {
        var n = dec ? obj.v.toFixed(dec) : Math.round(obj.v);
        el.textContent = fmt ? Number(n).toLocaleString('en-GB') : n;
      } });
  }

  function counters(scope, delay) {
    $$('.count', scope).forEach(function (c) {
      var to = parseFloat(c.getAttribute('data-to'));
      var dec = parseInt(c.getAttribute('data-dec') || '0', 10);
      var fmt = c.getAttribute('data-fmt') === '1';
      var tw = countTo(c, to, 1.3, dec, fmt);
      tw.pause(); tw.delay(delay || 0); tw.play();
    });
  }

  function growBars(scope, delay) {
    var bars = $$('.bar-fill', scope);
    if (!bars.length) return;
    gsap.from(bars, { scaleX: 0, duration: 0.85, ease: 'power2.out', delay: delay || 0, stagger: 0.1 });
  }

  /* ---------- Hero ---------- */
  (function hero() {
    var h1 = $('.hero h1');
    var words = h1 ? splitWords(h1) : [];
    var eyebrow = $('.hero .eyebrow'), lede = $('.hero .lede'), actions = $('.hero-actions'), fine = $('.hero .fineprint');
    var tl = gsap.timeline({ delay: 0.1 });
    if (eyebrow) tl.from(eyebrow, { y: 14 * D, opacity: 0, duration: 0.6, clearProps: 'transform,opacity' }, 0);
    if (words.length) tl.from(words, { y: 40 * D, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', clearProps: 'transform,opacity' }, 0.1);
    var rule = $('.hero .em-rule');
    if (rule) tl.from(rule, { scaleX: 0, duration: 0.8, ease: 'power2.out' }, 0.7);
    [lede, actions, fine].forEach(function (el, i) {
      if (el) tl.from(el, { y: 22 * D, opacity: 0, duration: 0.7, clearProps: 'transform,opacity' }, 0.55 + i * 0.1);
    });
    var photo = $('.hero-photo');
    if (photo) {
      tl.fromTo(photo, { clipPath: 'inset(0% 0% 100% 0% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.2, ease: 'power3.out' }, 0.25);
      var img = $('img', photo), vid = $('video', photo);
      tl.fromTo([img, vid].filter(Boolean), { scale: 1.08 }, { scale: 1, duration: 1.6, ease: 'power2.out' }, 0.25);
    }
    var facts = $$('.hero-facts li');
    if (facts.length) tl.from(facts, { y: 14 * D, opacity: 0, duration: 0.6, stagger: 0.08, clearProps: 'transform,opacity' }, 1.0);
  })();

  /* ---------- Manifesto: words light up as you scroll (pinned) ---------- */
  (function manifesto() {
    var sec = $('#why'), p = $('#manifesto');
    if (!sec || !p) return;
    var words = splitWords(p);
    var mobile = window.matchMedia('(max-width: 900px)').matches;
    words.forEach(function (w) { w.classList.add('dim'); });
    gsap.set(words, { opacity: 0.16 });
    if (mobile) {
      // No pin on small screens: reveal in a scrubbed pass through the section.
      gsap.to(words, { opacity: 1, stagger: 0.04, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top 75%', end: 'bottom 55%', scrub: 0.4 } });
      return;
    }
    var tl = gsap.timeline({
      scrollTrigger: { trigger: sec, start: 'top top', end: '+=' + Math.round(words.length * 55), pin: '.manifesto-pin', scrub: 0.5, anticipatePin: 1 }
    });
    tl.to({}, { duration: 0.3 });
    tl.to(words, { opacity: 1, stagger: 0.05, duration: 0.2, ease: 'none' });
    tl.to({}, { duration: 0.6 });
  })();

  /* ---------- The gap (pinned, scrubbed) ---------- */
  (function gap() {
    var sec = $('#gap');
    if (!sec) return;
    var count = $('#gap-count'), fill = $('#gap-fill');
    var lines = $$('.gap-line', sec);
    var num = { v: 62 };
    var mobile = window.matchMedia('(max-width: 900px)').matches;

    lines.forEach(function (l, i) { gsap.set(l, { opacity: i === 0 ? 1 : 0 }); l.classList.remove('is-on'); });

    var tl = gsap.timeline({
      scrollTrigger: mobile
        ? { trigger: sec, start: 'top 70%', end: 'bottom 60%', scrub: 0.5 }
        : { trigger: sec, start: 'top top', end: '+=1800', pin: '.gap-pin', scrub: 0.6, anticipatePin: 1 }
    });
    tl.to({}, { duration: 0.6 });
    tl.to(lines[0], { opacity: 0, duration: 0.25 }, 'l1')
      .to(lines[1], { opacity: 1, duration: 0.35 }, 'l1+=0.15');
    tl.to({}, { duration: 0.4 });
    tl.to(num, { v: 110, duration: 1.4, ease: 'none', onUpdate: function () { count.textContent = Math.round(num.v); } }, 'grow')
      .to(fill, { scaleX: 1, duration: 1.4, ease: 'none' }, 'grow');
    tl.to(lines[1], { opacity: 0, duration: 0.25 }, 'l2')
      .to(lines[2], { opacity: 1, duration: 0.35 }, 'l2+=0.15');
    tl.to({}, { duration: 0.6 });
  })();

  /* ---------- Seven doors ---------- */
  (function doors() {
    reveal('.doors .sec-head > *', { stagger: 0.1, trigger: '.doors .sec-head' });
    underline($('.doors'));
    var tiles = $$('.door');
    tiles.forEach(function (t, i) {
      gsap.from(t, { y: 36 * D, opacity: 0, duration: 0.75, delay: (i % 4) * 0.08, clearProps: 'transform,opacity',
        scrollTrigger: { trigger: t, start: 'top 92%', once: true } });
    });
    maskReveal($('.doors'), 0.15);
  })();

  /* ---------- How it works + plan build sequence ---------- */
  (function how() {
    reveal('.how-copy > *', { stagger: 0.1, trigger: '.how-copy' });
    underline($('.how'));
    var steps = $$('.step');
    gsap.from(steps, { y: 22 * D, opacity: 0, duration: 0.6, stagger: 0.12, clearProps: 'transform,opacity',
      scrollTrigger: { trigger: '.steps', start: 'top 88%', once: true } });

    var build = $('#plan-build');
    if (!build) return;
    var lines = $$('.build-line', build), ticks = $$('.build-tick', build), card = $('.plan-card', build);
    var tl = gsap.timeline({ scrollTrigger: { trigger: build, start: 'top 75%', once: true } });
    tl.from(build, { y: 30 * D, opacity: 0, duration: 0.7, clearProps: 'transform,opacity' });
    lines.forEach(function (l, i) {
      tl.from(l, { opacity: 0, x: -8 * D, duration: 0.35, clearProps: 'transform,opacity' }, 0.4 + i * 0.55)
        .from(ticks[i], { scale: 0, duration: 0.4, ease: 'back.out(1.6)', clearProps: 'transform' }, 0.75 + i * 0.55);
    });
    tl.from(card, { y: 18 * D, opacity: 0, duration: 0.6, clearProps: 'transform,opacity' }, '>-0.1')
      .add(function () { counters(card, 0); growBars(card, 0.3); });
  })();

  /* ---------- Features: reveals + each demo's own mechanism ---------- */
  (function features() {
    reveal('.features .sec-head > *', { stagger: 0.1, trigger: '.features .sec-head' });
    underline($('.features'));
    $$('.feat').forEach(function (card, i) {
      gsap.from(card, { y: 32 * D, opacity: 0, duration: 0.75, delay: (i % 2) * 0.1, clearProps: 'transform,opacity',
        scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
    });
    reveal('.also li', { stagger: 0.06, trigger: '.also' });

    var scan = $('[data-demo="scan"]');
    if (scan) {
      var line = $('.scan-line', scan), chips = $$('.chip-item', scan), verdict = $('.verdict', scan);
      var tl = gsap.timeline({ scrollTrigger: { trigger: scan, start: 'top 70%', once: true } });
      tl.set(line, { opacity: 1, top: '0%' })
        .to(line, { top: '100%', duration: 1.1, ease: 'sine.inOut' })
        .to(line, { top: '0%', duration: 0.9, ease: 'sine.inOut' })
        .to(line, { opacity: 0, duration: 0.2 })
        .from(chips, { scale: 0.6, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(1.6)', clearProps: 'transform,opacity' }, '-=0.5')
        .from(verdict, { y: 10 * D, opacity: 0, duration: 0.5, clearProps: 'transform,opacity' }, '-=0.1');
    }

    var coach = $('[data-demo="coach"]');
    if (coach) {
      var bubbles = $$('.bubble', coach);
      gsap.from(bubbles, { y: 16 * D, opacity: 0, scale: 0.96,
        transformOrigin: function (i) { return bubbles[i].classList.contains('user') ? 'right bottom' : 'left bottom'; },
        duration: 0.55, stagger: 0.55, ease: 'back.out(1.6)', clearProps: 'transform,opacity',
        scrollTrigger: { trigger: coach, start: 'top 70%', once: true } });
    }

    var lift = $('[data-demo="lift"]');
    if (lift) {
      var bars = $$('.lift-bar', lift), kgs = $$('.lift-kg', lift), wks = $$('.lift-wk', lift), cue = $('.lift-cue', lift);
      var tl2 = gsap.timeline({ scrollTrigger: { trigger: lift, start: 'top 70%', once: true } });
      tl2.from(bars, { scaleY: 0, duration: 0.85, stagger: 0.18, ease: 'power2.out' })
        .from(kgs, { y: 8 * D, opacity: 0, duration: 0.4, stagger: 0.18, clearProps: 'transform,opacity' }, 0.35)
        .from(wks, { opacity: 0, duration: 0.4, stagger: 0.18, clearProps: 'opacity' }, 0.35)
        .from(cue, { opacity: 0, y: 8 * D, duration: 0.5, clearProps: 'transform,opacity' }, '-=0.2');
    }

    var report = $('[data-demo="report"]');
    if (report) {
      ScrollTrigger.create({ trigger: report, start: 'top 70%', once: true, onEnter: function () {
        gsap.from($$('.report-stat', report), { y: 12 * D, opacity: 0, duration: 0.5, stagger: 0.1, clearProps: 'transform,opacity' });
        growBars(report, 0.3);
        counters(report, 0.3);
        gsap.from($('.report-note', report), { opacity: 0, duration: 0.5, delay: 0.9, clearProps: 'opacity' });
      } });
    }
  })();

  /* ---------- Strength / Strong for life ---------- */
  (function strength() {
    reveal('.strength .split-copy > *', { stagger: 0.08, trigger: '.strength .split-copy' });
    maskReveal($('.strength'));
    reveal('.life-head > *', { stagger: 0.1, trigger: '.life-head' });
    underline($('.strength'));
    var cards = $$('.life-card');
    if (cards.length) {
      ScrollTrigger.create({ trigger: cards[0], start: 'top 85%', once: true, onEnter: function () {
        gsap.from(cards, { y: 24 * D, opacity: 0, duration: 0.6, stagger: 0.1, clearProps: 'transform,opacity' });
        cards.forEach(function (c, i) { counters(c, 0.3 + i * 0.1); });
      } });
    }
  })();

  /* ---------- Menopause / GP doc ---------- */
  (function meno() {
    reveal('.meno .split-copy > *', { stagger: 0.08, trigger: '.meno .split-copy' });
    underline($('.meno'));
    var doc = $('.gp-doc');
    if (!doc) return;
    gsap.from(doc, { y: 30 * D, opacity: 0, duration: 0.8, clearProps: 'transform,opacity',
      scrollTrigger: { trigger: doc, start: 'top 85%', once: true } });
    $$('.gp-spark polyline', doc).forEach(function (p, i) {
      var len = p.getTotalLength();
      gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', delay: 0.3 + i * 0.15,
        scrollTrigger: { trigger: doc, start: 'top 80%', once: true } });
    });
  })();

  /* ---------- Honest: strike-through lines draw across ---------- */
  (function honest() {
    reveal('.honest-head > *', { stagger: 0.1, trigger: '.honest-head' });
    underline($('.honest'));
    var items = $$('.honest-list li');
    gsap.from(items, { y: 18 * D, opacity: 0, duration: 0.55, stagger: 0.08, clearProps: 'transform,opacity',
      scrollTrigger: { trigger: '.honest-list', start: 'top 85%', once: true } });
    $$('.honest-list s').forEach(function (s, i) {
      // pseudo-elements can't be tweened; animate a CSS variable via an inline style on the element
      var line = document.createElement('i');
      line.setAttribute('aria-hidden', 'true');
      line.style.cssText = 'position:absolute;left:0;right:0;top:56%;height:2px;background:#F0C9A8;border-radius:2px;transform-origin:left center';
      s.appendChild(line);
      s.classList.add('js-strike');
      gsap.from(line, { scaleX: 0, duration: 0.6, ease: 'power2.out', delay: 0.4 + i * 0.12,
        scrollTrigger: { trigger: '.honest-list', start: 'top 85%', once: true } });
    });
    var st = document.createElement('style');
    st.textContent = '.honest-list s.js-strike::after{display:none}';
    document.head.appendChild(st);
  })();

  /* ---------- Pricing / FAQ / CTA ---------- */
  (function rest() {
    reveal('.pricing .sec-head > *', { stagger: 0.1, trigger: '.pricing .sec-head' });
    underline($('.pricing'));
    gsap.from($$('.plan'), { y: 28 * D, opacity: 0, duration: 0.7, stagger: 0.12, clearProps: 'transform,opacity',
      scrollTrigger: { trigger: '.plans', start: 'top 85%', once: true } });
    reveal('.plan-row'); reveal('.terms'); reveal('.lifetime');

    reveal('.faq-head > *', { stagger: 0.1, trigger: '.faq-head' });
    underline($('.faq'));
    gsap.from($$('.faq-list details'), { y: 18 * D, opacity: 0, duration: 0.55, stagger: 0.07, clearProps: 'transform,opacity',
      scrollTrigger: { trigger: '.faq-list', start: 'top 85%', once: true } });

    reveal('.cta-inner > *', { stagger: 0.1, trigger: '.cta' });
    underline($('.cta'));
  })();

  /* ---------- Keep pins accurate once assets load ---------- */
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  $$('img').forEach(function (im) { if (!im.complete) im.addEventListener('load', function () { ScrollTrigger.refresh(); }, { once: true }); });
})();
