import { gsap } from 'gsap';

const root = document.documentElement;

// First visit: logo preloader. Later pages: lift the gold wipe left by the previous page.
// Resolves when the page is uncovered enough for hero animations to start.
export function initIntro() {
  const preloader = document.querySelector('.preloader');
  const panel = document.querySelector('.wipe__panel');
  const logo = document.querySelector('.wipe__logo');
  try { sessionStorage.setItem('ec-visited', '1'); } catch (e) { /* private mode */ }

  return new Promise((resolve) => {
    if (root.classList.contains('returning') || !preloader) {
      preloader?.remove();
      gsap.set([panel, logo], { animation: 'none' });
      gsap.timeline()
        .to(logo, { opacity: 0, duration: 0.3 })
        .to(panel, { scaleY: 0, transformOrigin: 'top', duration: 0.9, ease: 'expo.inOut' }, 0.05)
        .add(resolve, 0.35);
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to('.preloader__ring circle', { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' })
      .to('.preloader__emblem', { opacity: 1, scale: 1, duration: 0.7 }, 0.2)
      .to('.preloader__word span', { y: 0, duration: 0.7, stagger: 0.035 }, 0.3)
      .to('.preloader__tag', { opacity: 1, duration: 0.5 }, 0.65)
      .to(preloader, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, 1.15)
      .add(resolve, 1.45)
      .add(() => preloader.remove());
  });
}

export function initPageTransitions(lenis) {
  const panel = document.querySelector('.wipe__panel');
  const logo = document.querySelector('.wipe__logo');

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) return; // same-page anchor
    if (url.href === location.href) { e.preventDefault(); return; }

    e.preventDefault();
    lenis?.stop();
    gsap.timeline({ onComplete: () => (location.href = url.href) })
      .set(panel, { transformOrigin: 'bottom' })
      .to(panel, { scaleY: 1, duration: 0.7, ease: 'expo.inOut' })
      .to(logo, { opacity: 1, duration: 0.25 }, 0.45);
  });

  // Coming back via the browser's back/forward cache: uncover the page again.
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    gsap.set(panel, { scaleY: 0 });
    gsap.set(logo, { opacity: 0 });
    lenis?.start();
  });
}
