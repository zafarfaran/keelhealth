'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Scroll choreography for the whole page.
 *
 * Rule from the design language: the markup is always the finished state.
 * From-states are applied only when an animation actually runs, so the page
 * reads correctly with JavaScript off, with motion set to Off, or if this
 * component never mounts.
 *
 * GSAP vars are dynamic by nature, so the two aliases below are deliberately
 * untyped rather than fighting the tween-vars generics at every call site.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
const g = gsap as any;

export default function SiteMotion() {
  useEffect(() => {
    const $ = (s: string, c: ParentNode = document) => c.querySelector(s) as HTMLElement | null;
    const $$ = (s: string, c: ParentNode = document) =>
      Array.prototype.slice.call(c.querySelectorAll(s)) as HTMLElement[];

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    /* ---------- Anchor links (JS smooth scroll; CSS smooth-scroll breaks ScrollTrigger measuring) ---------- */
    const anchors = $$('a[href^="#"]') as HTMLAnchorElement[];
    const onAnchor = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const id = a.getAttribute('href') || '';
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 68;
      window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    };
    anchors.forEach((a) => a.addEventListener('click', onAnchor));

    /* ---------- Videos: fall back to the poster on error, only play while on screen ---------- */
    const observers: IntersectionObserver[] = [];
    $$('video').forEach((el) => {
      const v = el as HTMLVideoElement;
      const drop = () => (v.parentNode as HTMLElement)?.classList.add('no-video');
      v.addEventListener('error', drop);
      $$('source', v).forEach((s) => s.addEventListener('error', drop));
      if (reducedMotion) {
        v.pause();
        drop();
        return;
      }
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((en) => {
              if (en.isIntersecting) {
                const p = v.play();
                if (p && p.catch) p.catch(() => {});
              } else v.pause();
            });
          },
          { rootMargin: '120px 0px' }
        );
        io.observe(v);
        observers.push(io);
      }
    });

    /* ---------- Motion ----------
       Always on. The only thing that switches it off is the reader's own
       operating-system reduced-motion setting, which is an accessibility
       requirement rather than a site preference. */
    function finishStaticStates() {
      $$('#manifesto .w').forEach((w) => w.classList.remove('dim'));
    }

    if (reducedMotion) {
      finishStaticStates();
      return () => {
        anchors.forEach((a) => a.removeEventListener('click', onAnchor));
        observers.forEach((io) => io.disconnect());
      };
    }

    const D = 1; // distance multiplier, kept so tuning stays in one place
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out' });

    const ctx = g.context(() => {
      /* ---------- Helpers ---------- */
      function splitWords(el: HTMLElement): HTMLElement[] {
        // Wrap each word in a span.w; keep child elements (like the emphasis span) whole.
        if (el.dataset.split === '1') {
          return Array.prototype.slice
            .call(el.children)
            .filter((c: Element) => c.classList.contains('w')) as HTMLElement[];
        }
        const nodes = Array.prototype.slice.call(el.childNodes) as Node[];
        const out: Node[] = [];
        nodes.forEach((n) => {
          if (n.nodeType === 3) {
            const parts = (n.textContent || '').split(/(\s+)/);
            parts.forEach((p) => {
              if (!p) return;
              if (/^\s+$/.test(p)) {
                out.push(document.createTextNode(' '));
                return;
              }
              const s = document.createElement('span');
              s.className = 'w';
              s.textContent = p;
              out.push(s);
            });
          } else if (n.nodeType === 1) {
            (n as HTMLElement).classList.add('w');
            out.push(n);
          }
        });
        el.innerHTML = '';
        out.forEach((n) => el.appendChild(n));
        el.dataset.split = '1';
        return Array.prototype.slice
          .call(el.children)
          .filter((c: Element) => c.classList.contains('w')) as HTMLElement[];
      }

      /**
       * Headline treatment.
       *
       * Emphasis is carried by the animation, not by a different typeface: the
       * headline reads as one uniform block, then the accented phrase arrives by
       * a different means — a horizontal wipe against the vertical rise of every
       * other word. Different axis, so the eye lands on it.
       */
      function animateHeadline(el: HTMLElement, tl: any, at: number | string = 0) {
        const words = splitWords(el);
        if (!words.length) return;
        const accent = words.filter((w) => w.closest('.em'));
        const plain = words.filter((w) => !w.closest('.em'));

        if (plain.length)
          tl.from(
            plain,
            {
              yPercent: 60,
              opacity: 0,
              duration: 0.7,
              stagger: 0.05,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            },
            at
          );

        if (accent.length)
          tl.fromTo(
            accent,
            { clipPath: 'inset(0 100% -20% 0)', opacity: 0.25 },
            {
              clipPath: 'inset(0 0% -20% 0)',
              opacity: 1,
              duration: 0.85,
              stagger: 0.09,
              ease: 'power2.out',
              clearProps: 'clipPath,opacity',
            },
            typeof at === 'number' ? at + 0.22 : '>-0.45'
          );
      }

      function reveal(
        targets: string | HTMLElement[],
        opts: { stagger?: number; trigger?: Element | string } = {}
      ) {
        const els = (typeof targets === 'string' ? $$(targets) : targets).filter(
          // Headings are animated word by word in headlines() instead.
          (el) => !el.matches('.h2, .display')
        );
        if (!els.length) return;
        /* Text wipes up out of its own line box rather than fading in. A fade
         * says nothing about the element; a wipe against a fixed edge reads as
         * the page setting type, and it never leaves copy half-legible. The
         * horizontal bleed keeps descenders and italic overhang from clipping. */
        g.fromTo(
          els,
          { clipPath: 'inset(0 -0.35em 100% -0.35em)', y: 14 * D },
          {
            clipPath: 'inset(0 -0.35em 0% -0.35em)',
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: opts.stagger || 0,
            scrollTrigger: { trigger: opts.trigger || els[0], start: 'top 90%', once: true },
            clearProps: 'clipPath,transform',
          }
        );
      }

      /* Cards arrive by uncovering from their own bottom edge, in short rows.
       * The stagger is by row, so the grid reads as rows rather than as a
       * queue of identical fades. */
      function cardsIn(els: HTMLElement[], perRow: number, start: string) {
        els.forEach((el, i) => {
          const r = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
          /* The trigger is created on its own and starts the tween from onEnter,
           * rather than being built inside a fromTo. Building N from-tweens with
           * embedded triggers in a loop makes each one refresh the ones before
           * it, and ScrollTrigger throws part-way through that. */
          ScrollTrigger.create({
            trigger: el,
            start,
            once: true,
            onEnter: () =>
              g.fromTo(
                el,
                { clipPath: `inset(0 0 100% 0 round ${r}px)`, y: 18 * D },
                {
                  clipPath: `inset(0 0 0% 0 round ${r}px)`,
                  y: 0,
                  duration: 0.85,
                  ease: 'power3.out',
                  delay: (i % perRow) * 0.07,
                  clearProps: 'clipPath,transform',
                }
              ),
          });
        });
      }

      /* A section marker draws its rule before the label arrives, so the
       * opening of a section is one gesture instead of another staggered fade. */
      function secHead(scope: string) {
        const head = $(scope);
        if (!head) return;
        const label = $('.eyebrow', head);
        const rest = $$(':scope > :not(.eyebrow):not(.h2)', head);
        const tl = g.timeline({
          scrollTrigger: { trigger: head, start: 'top 88%', once: true },
        });
        if (label) {
          /* The rule lives inside the label, so one horizontal wipe draws the
           * rule and sets the word in a single move. */
          tl.fromTo(
            label,
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 0.7, ease: 'power2.out',
              clearProps: 'clipPath' },
            0
          );
        }
        if (rest.length)
          tl.fromTo(
            rest,
            { clipPath: 'inset(0 -0.35em 100% -0.35em)', y: 14 * D },
            { clipPath: 'inset(0 -0.35em 0% -0.35em)', y: 0, duration: 0.8,
              ease: 'power3.out', stagger: 0.08, clearProps: 'clipPath,transform' },
            0.3
          );
      }

      function maskReveal(scope: ParentNode | null, delay?: number) {
        $$('.mask-reveal', scope || document).forEach((el) => {
          const r = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 28;
          g.fromTo(
            el,
            { clipPath: `inset(0% 0% 100% 0% round ${r}px)` },
            {
              clipPath: `inset(0% 0% 0% 0% round ${r}px)`,
              duration: 1.1,
              ease: 'power3.out',
              delay: delay || 0,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            }
          );
          const img = $('img', el);
          if (img)
            g.fromTo(
              img,
              { scale: 1.08 },
              {
                scale: 1,
                duration: 1.4,
                ease: 'power2.out',
                delay: delay || 0,
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
              }
            );
        });
      }

      function countTo(el: HTMLElement, to: number, dur?: number, dec?: number, fmt?: boolean) {
        const obj = { v: parseFloat(el.getAttribute('data-from') || '0') };
        return g.to(obj, {
          v: to,
          duration: dur || 1.3,
          ease: 'power2.out',
          onUpdate: () => {
            const n = dec ? obj.v.toFixed(dec) : String(Math.round(obj.v));
            el.textContent = fmt ? Number(n).toLocaleString('en-GB') : n;
          },
        });
      }

      function counters(scope: ParentNode | null, delay?: number) {
        $$('.count', scope || document).forEach((c) => {
          const to = parseFloat(c.getAttribute('data-to') || '0');
          const dec = parseInt(c.getAttribute('data-dec') || '0', 10);
          const fmt = c.getAttribute('data-fmt') === '1';
          const tw = countTo(c, to, 1.3, dec, fmt);
          tw.pause();
          tw.delay(delay || 0);
          tw.play();
        });
      }

      function growBars(scope: ParentNode | null, delay?: number) {
        const bars = $$('.bar-fill', scope || document);
        if (!bars.length) return;
        g.from(bars, {
          scaleX: 0,
          duration: 0.85,
          ease: 'power2.out',
          delay: delay || 0,
          stagger: 0.1,
        });
      }

      /* ---------- Hero ---------- */
      (function hero() {
        const h1 = $('.hero h1');
        const eyebrow = $('.hero .eyebrow');
        const lede = $('.hero-sub');
        const actions = $('.hero-actions');
        const fine = $('.hero .fineprint');
        const tl = g.timeline({ delay: 0.1 });
        if (eyebrow)
          tl.from(eyebrow, { y: 14 * D, opacity: 0, duration: 0.6, clearProps: 'transform,opacity' }, 0);
        if (h1) animateHeadline(h1, tl, 0.1);
        [lede, actions, fine].forEach((el, i) => {
          if (el)
            tl.from(
              el,
              { y: 22 * D, opacity: 0, duration: 0.7, clearProps: 'transform,opacity' },
              0.55 + i * 0.1
            );
        });
        /* The cutout rises into the colour field; the field opens behind it. */
        const field = $('.hero-field');
        if (field)
          tl.from(field, { scale: 1.06, opacity: 0, duration: 1.1, ease: 'power2.out',
            transformOrigin: '75% 50%', clearProps: 'transform,opacity' }, 0);
        const cutout = $('.hero-cutout');
        if (cutout)
          tl.from(cutout, { y: 44 * D, opacity: 0, duration: 1.1, ease: 'power3.out',
            clearProps: 'transform,opacity' }, 0.2);

        const facts = $$('.hero-facts li');
        if (facts.length)
          tl.from(
            facts,
            { y: 14 * D, opacity: 0, duration: 0.6, stagger: 0.08, clearProps: 'transform,opacity' },
            1.0
          );
      })();

      /* ---------- Manifesto: words light up as the curve draws ---------- */
      (function manifesto() {
        const sec = $('#why');
        const p = $('#manifesto');
        if (!sec || !p) return;
        const words = splitWords(p);
        words.forEach((w) => w.classList.add('dim'));
        g.set(words, { opacity: 0.16 });
        g.to(words, {
          opacity: 1,
          stagger: 0.04,
          ease: 'none',
          scrollTrigger: { trigger: sec, start: 'top 78%', end: 'center 58%', scrub: 0.4 },
        });
      })();

      /* ---------- The gap: the viz drives itself, this is just the copy ---------- */
      (function gap() {
        const sec = $('#gap');
        if (!sec) return;
        reveal('.gap-inner > .eyebrow', { trigger: sec });
        reveal('.gap-line', { trigger: '.gap-line' });
      })();

      /* ---------- Headlines: word-level reveal carries the emphasis ---------- */
      (function headlines() {
        $$('h2.h2').forEach((h) => {
          const tl = g.timeline({
            scrollTrigger: { trigger: h, start: 'top 88%', once: true },
          });
          animateHeadline(h, tl, 0);
        });
      })();

      /* ---------- Seven doors ---------- */
      (function doors() {
        secHead('.doors .sec-head');
        cardsIn($$('.door'), 4, 'top 92%');
        maskReveal($('.doors'), 0.15);
      })();

      /* ---------- How it works: the bloom animates itself ---------- */
      (function how() {
        const sec = $('#how');
        if (!sec) return;
        secHead('.how-head');
      })();

      /* ---------- Features: reveals + each demo's own mechanism ---------- */
      (function features() {
        secHead('.features .sec-head');
        cardsIn($$('.feat'), 2, 'top 88%');
        reveal('.also li', { stagger: 0.06, trigger: '.also' });

        const scan = $('[data-demo="scan"]');
        if (scan) {
          const line = $('.scan-line', scan);
          const chips = $$('.chip-item', scan);
          const verdict = $('.verdict', scan);
          const tl = g.timeline({ scrollTrigger: { trigger: scan, start: 'top 70%', once: true } });
          tl.set(line, { opacity: 1, top: '0%' })
            .to(line, { top: '100%', duration: 1.1, ease: 'sine.inOut' })
            .to(line, { top: '0%', duration: 0.9, ease: 'sine.inOut' })
            .to(line, { opacity: 0, duration: 0.2 })
            .from(
              chips,
              {
                scale: 0.6,
                opacity: 0,
                duration: 0.5,
                stagger: 0.12,
                ease: 'back.out(1.6)',
                clearProps: 'transform,opacity',
              },
              '-=0.5'
            )
            .from(
              verdict,
              { y: 10 * D, opacity: 0, duration: 0.5, clearProps: 'transform,opacity' },
              '-=0.1'
            );
        }

        const coach = $('[data-demo="coach"]');
        if (coach) {
          const bubbles = $$('.bubble', coach);
          g.from(bubbles, {
            y: 16 * D,
            opacity: 0,
            scale: 0.96,
            transformOrigin: (i: number) =>
              bubbles[i].classList.contains('user') ? 'right bottom' : 'left bottom',
            duration: 0.55,
            stagger: 0.55,
            ease: 'back.out(1.6)',
            clearProps: 'transform,opacity',
            scrollTrigger: { trigger: coach, start: 'top 70%', once: true },
          });
        }

        const lift = $('[data-demo="lift"]');
        if (lift) {
          const bars = $$('.lift-bar', lift);
          const kgs = $$('.lift-kg', lift);
          const wks = $$('.lift-wk', lift);
          const cue = $('.lift-cue', lift);
          const tl2 = g.timeline({ scrollTrigger: { trigger: lift, start: 'top 70%', once: true } });
          tl2
            .from(bars, { scaleY: 0, duration: 0.85, stagger: 0.18, ease: 'power2.out' })
            .from(
              kgs,
              { y: 8 * D, opacity: 0, duration: 0.4, stagger: 0.18, clearProps: 'transform,opacity' },
              0.35
            )
            .from(wks, { opacity: 0, duration: 0.4, stagger: 0.18, clearProps: 'opacity' }, 0.35)
            .from(
              cue,
              { opacity: 0, y: 8 * D, duration: 0.5, clearProps: 'transform,opacity' },
              '-=0.2'
            );
        }

        const report = $('[data-demo="report"]');
        if (report) {
          ScrollTrigger.create({
            trigger: report,
            start: 'top 70%',
            once: true,
            onEnter: () => {
              g.from($$('.report-stat', report), {
                y: 12 * D,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                clearProps: 'transform,opacity',
              });
              growBars(report, 0.3);
              counters(report, 0.3);
              g.from($('.report-note', report), {
                opacity: 0,
                duration: 0.5,
                delay: 0.9,
                clearProps: 'opacity',
              });
            },
          });
        }
      })();

      /* ---------- Strength / Strong for life ---------- */
      (function strength() {
        reveal('.strength .split-copy > *', { stagger: 0.08, trigger: '.strength .split-copy' });
        maskReveal($('.strength'));
        reveal('.life-head > *', { stagger: 0.1, trigger: '.life-head' });
        const cards = $$('.life-card');
        if (cards.length) {
          ScrollTrigger.create({
            trigger: cards[0],
            start: 'top 85%',
            once: true,
            onEnter: () => {
              g.from(cards, {
                y: 24 * D,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                clearProps: 'transform,opacity',
              });
              cards.forEach((c, i) => counters(c, 0.3 + i * 0.1));
            },
          });
        }
      })();

      /* ---------- Menopause / GP doc ---------- */
      (function meno() {
        reveal('.meno .split-copy > *', { stagger: 0.08, trigger: '.meno .split-copy' });
        const doc = $('.gp-doc');
        if (!doc) return;
        g.from(doc, {
          y: 30 * D,
          opacity: 0,
          duration: 0.8,
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: doc, start: 'top 85%', once: true },
        });
        $$('.gp-spark polyline', doc).forEach((p, i) => {
          const len = (p as unknown as SVGGeometryElement).getTotalLength();
          g.fromTo(
            p,
            { strokeDasharray: len, strokeDashoffset: len },
            {
              strokeDashoffset: 0,
              duration: 1.1,
              ease: 'power2.out',
              delay: 0.3 + i * 0.15,
              scrollTrigger: { trigger: doc, start: 'top 80%', once: true },
            }
          );
        });
      })();

      /* ---------- Honest: strike-through lines draw across ---------- */
      (function honest() {
        reveal('.honest-head > *', { stagger: 0.1, trigger: '.honest-head' });
        const items = $$('.honest-list li');
        g.from(items, {
          y: 18 * D,
          opacity: 0,
          duration: 0.55,
          stagger: 0.08,
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: '.honest-list', start: 'top 85%', once: true },
        });
        $$('.honest-list s').forEach((s, i) => {
          // Pseudo-elements can't be tweened, so the rule becomes a real child element.
          if (s.querySelector('i')) return;
          const line = document.createElement('i');
          line.setAttribute('aria-hidden', 'true');
          line.style.cssText =
            'position:absolute;left:0;right:0;top:56%;height:2px;background:#F0C9A8;border-radius:2px;transform-origin:left center';
          s.appendChild(line);
          s.classList.add('js-strike');
          g.from(line, {
            scaleX: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: 0.4 + i * 0.12,
            scrollTrigger: { trigger: '.honest-list', start: 'top 85%', once: true },
          });
        });
        if (!document.getElementById('keel-strike-style')) {
          const st = document.createElement('style');
          st.id = 'keel-strike-style';
          st.textContent = '.honest-list s.js-strike::after{display:none}';
          document.head.appendChild(st);
        }
      })();

      /* ---------- Pricing / FAQ / CTA ---------- */
      (function rest() {
        reveal('.pricing .sec-head > *', { stagger: 0.1, trigger: '.pricing .sec-head' });
        g.from($$('.plan'), {
          y: 28 * D,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: '.plans', start: 'top 85%', once: true },
        });
        reveal('.plan-row');
        reveal('.terms');
        reveal('.lifetime');

        reveal('.faq-head > *', { stagger: 0.1, trigger: '.faq-head' });
        g.from($$('.faq-list details'), {
          y: 18 * D,
          opacity: 0,
          duration: 0.55,
          stagger: 0.07,
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: '.faq-list', start: 'top 85%', once: true },
        });

        reveal('.cta-inner > *', { stagger: 0.1, trigger: '.cta' });
      })();
    });

    /* ---------- Keep pins accurate once assets load ---------- */
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    const lateImages = $$('img').filter((im) => !(im as HTMLImageElement).complete);
    lateImages.forEach((im) => im.addEventListener('load', refresh, { once: true }));

    return () => {
      anchors.forEach((a) => a.removeEventListener('click', onAnchor));
      observers.forEach((io) => io.disconnect());
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, []);

  return null;
}
