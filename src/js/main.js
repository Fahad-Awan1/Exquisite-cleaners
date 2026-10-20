import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

import { CONTACT, waLink } from './config.js';
import { initIntro, initPageTransitions } from './modules/transitions.js';
import { initHeader, initDrawer } from './modules/nav.js';
import { initAnimations } from './modules/animations.js';
import { initCurrency } from './modules/currency.js';
import { initChat } from './modules/chatbot.js';
import { initInteractions } from './modules/interactions.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Smooth wheel scrolling on desktop only. Phones keep their native scrolling, which is already
// smooth and costs nothing extra.
let lenis = null;
if (!reduceMotion && finePointer) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
}
// Keep GSAP's lag smoothing on: while a phone is busy loading the page, animations pause
// instead of jumping straight to their end (which made intros look like they never played).
gsap.ticker.lagSmoothing(500, 33);
window.__lenis = lenis;

// Contact details from config.
document.querySelectorAll('[data-wa]').forEach((a) => (a.href = waLink(a.dataset.wa)));
document.querySelectorAll('[data-tel]').forEach((a) => { a.href = `tel:${CONTACT.phoneHref}`; a.textContent = CONTACT.phone; });
document.querySelectorAll('[data-tel-link]').forEach((a) => (a.href = `tel:${CONTACT.phoneHref}`));
document.querySelectorAll('[data-mail]').forEach((a) => { a.href = `mailto:${CONTACT.email}`; a.textContent = CONTACT.email; });
document.querySelectorAll('[data-mail-link]').forEach((a) => (a.href = `mailto:${CONTACT.email}`));
document.querySelectorAll('[data-tel-text]').forEach((el) => (el.textContent = CONTACT.phone));
document.querySelectorAll('[data-mail-text]').forEach((el) => (el.textContent = CONTACT.email));
document.querySelectorAll('[data-hours]').forEach((el) => (el.textContent = CONTACT.hours));
document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

initHeader(lenis);
initDrawer(lenis);
initCurrency();
initChat(lenis);
initInteractions(lenis, reduceMotion);
initPageTransitions(lenis);

// Fonts first so SplitText measures real line breaks.
// Don't let a slow font download on mobile data hold the intro back for long.
const fontsReady = Promise.race([
  document.fonts ? document.fonts.ready : Promise.resolve(),
  new Promise((r) => setTimeout(r, 1200)),
]);
fontsReady.then(async () => {
  const introTimeline = await initIntro();
  initAnimations({ reduceMotion, introTimeline });
});

// Hero 3D scene: home page only, loaded once the browser is idle after page load so it never
// competes with the first paint. Low-power devices (few CPU cores, little memory, data saver)
// keep the lightweight CSS 3D coin instead of WebGL.
const heroStage = document.querySelector('[data-hero-3d]');
// iPhones/iPads under-report their cores for privacy but have strong GPUs, so they always get 3D.
const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const lowPower = !isIOS && (navigator.hardwareConcurrency || 4) <= 4
  || (navigator.deviceMemory && navigator.deviceMemory <= 3)
  || (navigator.connection && navigator.connection.saveData);
if (heroStage && !lowPower) {
  const load = () => import('./modules/hero3d.js').then((m) => m.initHero3D(heroStage, reduceMotion)).catch(() => {});
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 300));
  const schedule = () => idle(load, { timeout: 2500 });
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
}

// Diaspora globe (canvas 2D): only loaded when it's about to scroll into view.
const globe = document.querySelector('[data-globe]');
if (globe) {
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    import('./modules/globe.js').then((m) => m.initGlobe(globe, reduceMotion));
  }, { rootMargin: '600px 0px' });
  io.observe(globe);
}
