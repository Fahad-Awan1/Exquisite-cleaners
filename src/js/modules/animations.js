import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const inHero = (el) => !!el.closest('.hero, .page-hero');
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

/* One-shot "has scrolled into view" callback using IntersectionObserver.
   Much cheaper than a ScrollTrigger per element: the browser tracks visibility natively
   and nothing has to be recalculated when the layout changes. With batch: true, elements
   that appear in the same frame are handed over together so they can be staggered. */
function whenVisible(els, cb, { margin = '0px 0px -8% 0px', batch = false } = {}) {
  if (!els.length) return;
  let queue = [];
  let scheduled = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      if (batch) queue.push(e.target);
      else cb(e.target);
    });
    if (batch && queue.length && !scheduled) {
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; const q = queue; queue = []; cb(q); });
    }
  }, { rootMargin: margin });
  els.forEach((el) => io.observe(el));
}

// Mobile browsers resize the viewport when the address bar shows/hides; don't recalculate pins for that.
ScrollTrigger.config({ ignoreMobileResize: true });

/* reduceMotion = the OS "reduce motion" setting (also switched on by many phones' battery savers).
   In that case we keep the gentle effects (fades, text reveals, counters, 3D hero) and only drop
   the large scroll-linked movement (pinning, parallax, scrubbing). */
export function initAnimations({ reduceMotion }) {
  splitHeadings();
  reveals();
  initCounters();
  initMarquee();

  if (reduceMotion) {
    document.querySelector('[data-process]')?.classList.add('process--static');
  } else {
    heroParallax();
    imageParallax();
    maskReveal();
    beforeAfter();
    horizontalProcess();
    bigWords();
    servicesShowcase();
  }

  if (isTouch) touchEffects(reduceMotion);

  // Images loading late can change layout; keep triggers accurate.
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* Touch screens have no hover, so give them scroll-driven equivalents:
   cards "light up" as they cross the middle of the screen, card photos tilt in 3D
   as they scroll past, flip cards peek to show they can be flipped, and gold buttons shimmer. */
function touchEffects(reduceMotion) {
  document.documentElement.classList.add('touch');

  // "Lit up" while crossing the middle band of the screen.
  const band = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle('is-inview', e.isIntersecting));
  }, { rootMargin: '-28% 0px -28% 0px' });
  $$('.card, .feature, .price-card, .contact-card, .split__media, .finder__panel').forEach((el) => band.observe(el));

  if (reduceMotion) return;

  $$('.card__media').forEach((media) => {
    gsap.fromTo(media, { rotateX: 14, transformPerspective: 900, transformOrigin: '50% 100%' }, {
      rotateX: -6, ease: 'none',
      scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  const icons = $$('.feature__icon');
  gsap.set(icons, { rotateY: -180, scale: 0.6 });
  whenVisible(icons, (batch) => gsap.to(batch, { rotateY: 0, scale: 1, duration: 1.2, stagger: 0.1, ease: 'back.out(1.6)' }), { batch: true, margin: '0px 0px -15% 0px' });

  whenVisible($$('.flip'), (card) => {
    if (card.classList.contains('is-flipped')) return;
    const inner = card.querySelector('.flip__inner');
    gsap.timeline({ delay: 0.5, onComplete: () => gsap.set(inner, { clearProps: 'transform' }) })
      .to(inner, { rotateY: 28, duration: 0.6, ease: 'power2.out' })
      .to(inner, { rotateY: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' });
  }, { margin: '0px 0px -35% 0px' });
}

/* Line-by-line masked heading reveals */
function splitHeadings() {
  $$('[data-split]').forEach((el) => {
    const hero = inHero(el);
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        el.classList.add('is-split');
        const anim = gsap.from(self.lines, {
          yPercent: 115, rotate: 2, duration: 1.2, stagger: 0.1, ease: 'expo.out',
          delay: hero ? 0.15 : 0, paused: !hero,
        });
        // Re-split after a resize: show lines that were already revealed straight away.
        if (el.dataset.revealed) anim.progress(1);
        el._splitAnim = anim;
        return anim;
      },
    });
    if (!hero) {
      whenVisible([el], () => {
        el.dataset.revealed = '1';
        el._splitAnim?.play();
      }, { margin: '0px 0px -12% 0px' });
    }
  });
}

/* Fade-up and 3D flip-up reveals, batched for natural staggering */
function reveals() {
  const heroItems = $$('[data-reveal]').filter(inHero);
  gsap.to(heroItems, { opacity: 1, y: 0, duration: 1.2, stagger: 0.12, delay: 0.35, ease: 'expo.out', startAt: { y: 40 } });

  const fades = $$('[data-reveal]').filter((el) => !inHero(el));
  gsap.set(fades, { y: 50 });
  whenVisible(fades, (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out', overwrite: true }), { batch: true });

  const flips = $$('[data-reveal-3d]');
  gsap.set(flips, { y: 90, rotateX: -32, transformPerspective: 1200, transformOrigin: '50% 0%' });
  whenVisible(flips, (batch) => gsap.to(batch, { opacity: 1, y: 0, rotateX: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out', overwrite: true, clearProps: 'transform' }), { batch: true });
}

/* Hero background drifts and zooms as you scroll away */
function heroParallax() {
  $$('.hero__bg img, .page-hero__bg img').forEach((img) => {
    const section = img.closest('.hero, .page-hero');
    gsap.fromTo(img, { scale: 1.12, yPercent: 0 }, {
      scale: 1.25, yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
    });
  });
  const copy = document.querySelector('.hero__copy, .page-hero__inner');
  if (copy) {
    const scrub = { trigger: copy.closest('.hero, .page-hero'), start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true };
    gsap.to(copy, { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: scrub });
    // The page-hero emblem rises with the heading so the gap between them stays the same while scrolling.
    // It moves through the CSS `translate` property because its own coin animation owns `transform`.
    const orb = document.querySelector('.page-hero__orb');
    if (orb) gsap.to(orb, { '--orb-y': () => `${-copy.offsetHeight * 0.18}px`, ease: 'none', scrollTrigger: { ...scrub } });
  }
}

/* Generic parallax: images inside [data-parallax] move against the scroll */
function imageParallax() {
  $$('[data-parallax]').forEach((wrap) => {
    const img = wrap.querySelector('img');
    if (!img) return;
    const amount = parseFloat(wrap.dataset.parallax || '12');
    gsap.fromTo(img, { yPercent: -amount }, {
      yPercent: amount * 0.2, ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* Rounded image grows to full bleed (agrumeafarm-style).
   Uses transform only (no clip-path), so the GPU does the work and nothing is repainted. */
function maskReveal() {
  $$('.mask-reveal').forEach((sec) => {
    const media = sec.querySelector('.mask-reveal__media');
    const img = media.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 85%', end: 'center center', scrub: 0.6 } });
    tl.fromTo(media, { scaleX: 0.72, scaleY: 0.76 }, { scaleX: 1, scaleY: 1, ease: 'none' })
      .fromTo(img, { scale: 1.25 }, { scale: 1, ease: 'none' }, 0);
  });
}

/* Pinned "lived-in → immaculate" wipe driven by scroll.
   The "before" layer slides out while its photo slides back the other way, so the image
   appears to be wiped away without any repainting. */
function beforeAfter() {
  const sec = document.querySelector('[data-ba]');
  if (!sec) return;
  const stage = sec.querySelector('.ba__stage');
  const before = sec.querySelector('.ba__before');
  const beforeInner = sec.querySelector('.ba__before-inner');
  const bar = sec.querySelector('.ba__squeegee');
  const sparkles = $$('.ba__sparkles i', sec);
  const after = sec.querySelector('.ba__label--after');
  gsap.set(after, { opacity: 0.35 });

  const tl = gsap.timeline({
    scrollTrigger: { trigger: sec, start: 'top top', end: '+=140%', scrub: 0.6, pin: sec.querySelector('.ba__pin'), anticipatePin: 1, invalidateOnRefresh: true },
  });
  tl.fromTo(before, { xPercent: 0 }, { xPercent: 100, ease: 'none', duration: 1 }, 0)
    .fromTo(beforeInner, { xPercent: 0 }, { xPercent: -100, ease: 'none', duration: 1 }, 0)
    .fromTo(bar, { x: 0 }, { x: () => stage.offsetWidth, ease: 'none', duration: 1 }, 0)
    .to(after, { opacity: 1, duration: 0.2 }, 0.8)
    .to(sparkles, { opacity: 1, scale: 1, rotate: 90, duration: 0.15, stagger: 0.05, ease: 'back.out(3)' }, 0.85)
    .to(sparkles, { opacity: 0, scale: 0.4, duration: 0.15, stagger: 0.05 }, 1.05);
}

/* Services showcase ([data-showcase]):
   - wide screens: the cards start as a fanned deck in the middle and are dealt out into
     their places as you scroll (scrolling back gathers them again);
   - phones/tablets: each card swings in, in 3D, from alternating sides;
   - everywhere: when a card arrives its photo wipes up into view, a gold shine sweeps
     across it, the number badge spins in and the text slides in line by line. */
function servicesShowcase() {
  const sec = document.querySelector('[data-showcase]');
  if (!sec) return;
  const grid = sec.querySelector('.cards');
  const cards = $$('.card', grid);
  const mid = (cards.length - 1) / 2;
  const mm = gsap.matchMedia();

  mm.add('(min-width: 1100px)', () => {
    // Distance from each card's slot to the centre of the grid (offsetLeft ignores transforms).
    const toCentre = (card) => grid.offsetWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);
    const tl = gsap.timeline({
      scrollTrigger: { trigger: grid, start: 'top 90%', end: 'top 30%', scrub: 0.8, invalidateOnRefresh: true },
    });
    cards.forEach((card, i) => {
      gsap.set(card, { zIndex: cards.length - Math.round(Math.abs(i - mid)) }); // stacking set once, not animated
      tl.fromTo(card,
        { x: () => toCentre(card), y: 70 + Math.abs(i - mid) * 18, rotation: (i - mid) * 8, scale: 0.84, transformOrigin: '50% 120%' },
        { x: 0, y: 0, rotation: 0, scale: 1, ease: 'power2.out' }, 0);
    });
  });

  mm.add('(max-width: 1099px)', () => {
    cards.forEach((card, i) => {
      const dir = i % 2 ? 1 : -1;
      gsap.fromTo(card,
        { rotateY: dir * 32, x: dir * 60, y: 50, opacity: 0.15, transformPerspective: 1000, transformOrigin: dir > 0 ? '100% 50%' : '0% 50%' },
        { rotateY: 0, x: 0, y: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 98%', end: 'top 58%', scrub: 0.6 } });
    });
  });

  cards.forEach((card) => {
    const media = card.querySelector('.card__media');
    const img = media?.querySelector('img');
    const num = card.querySelector('.card__num');
    const lines = card.querySelectorAll('.card__tag, .card__title, .card__text, .tags li, .link-arrow');
    gsap.set(media, { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set(num, { scale: 0, rotation: -180 });
    gsap.set(lines, { y: 22, opacity: 0 });
    whenVisible([card], () => {
      card.classList.add('is-shown');
      gsap.timeline()
        .to(media, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' })
        .fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.6, ease: 'expo.out', clearProps: 'transform' }, 0.1)
        .to(num, { scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(2)' }, 0.6)
        .to(lines, { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: 'expo.out', clearProps: 'transform,opacity' }, 0.35);
    }, { margin: '0px 0px -12% 0px' });
  });
}

/* Pinned horizontal process on every screen size. Panels turn in 3D as they slide past the centre. */
function horizontalProcess() {
  const sec = document.querySelector('[data-process]');
  if (!sec) return;
  const track = sec.querySelector('.process__track');
  const panels = $$('.process__panel', sec);
  const distance = () => track.scrollWidth - window.innerWidth;

  const slide = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: { trigger: sec, start: 'top top', end: () => `+=${distance()}`, scrub: 0.8, pin: true, invalidateOnRefresh: true, anticipatePin: 1 },
  });

  panels.forEach((panel) => {
    gsap.fromTo(panel, { rotateY: -18, scale: 0.92, transformPerspective: 1200 }, {
      rotateY: 0, scale: 1, ease: 'none',
      scrollTrigger: { trigger: panel, containerAnimation: slide, start: 'left right', end: 'center center', scrub: true },
    });
  });
}

/* Outline words drift sideways with the scroll */
function bigWords() {
  $$('.big-word').forEach((el, i) => {
    gsap.fromTo(el, { xPercent: i % 2 ? -20 : 5 }, {
      xPercent: i % 2 ? 5 : -20, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* Count-up numbers */
function initCounters() {
  $$('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const obj = { v: 0 };
    el.textContent = '0' + suffix;
    whenVisible([el], () => gsap.to(obj, {
      v: end, duration: 2, ease: 'power3.out',
      onUpdate: () => (el.textContent = Math.round(obj.v) + suffix),
    }));
  });
}

/* Endless marquee that speeds up and flips direction with scroll velocity.
   One shared ticker eases the speed back, instead of creating new tweens on every scroll event. */
function initMarquee() {
  const loops = $$('.marquee__track').map((track) => {
    const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
    loop.totalTime(28 * 500); // start deep into the loop so reversing never hits time 0
    return loop;
  });
  if (!loops.length) return;
  let dir = 1;
  let boost = 0;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const v = self.getVelocity();
      if (Math.abs(v) < 5) return;
      dir = v < 0 ? -1 : 1;
      boost = Math.min(3, Math.abs(v) / 600);
    },
  });
  gsap.ticker.add(() => {
    boost *= 0.94;
    const ts = dir * (1 + boost);
    loops.forEach((l) => { if (Math.abs(l.timeScale() - ts) > 0.01) l.timeScale(ts); });
  });
}
