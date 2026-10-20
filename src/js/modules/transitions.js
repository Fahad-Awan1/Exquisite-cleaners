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

/* Customer preview build (npm run build:preview): only the home page exists, so links to
   the other pages show a short "coming soon" note instead of a broken page. */
const demo = root.hasAttribute('data-demo');

function isOtherPage(a) {
  const url = new URL(a.href, location.href);
  return url.origin === location.origin && !['/', '/index.html'].includes(url.pathname);
}

let toastTimer;
function showComingSoon() {
  let toast = document.querySelector('.demo-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'demo-toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = '<strong>Full site coming soon</strong><span>This is a design preview of the home page.</span>';
    document.body.append(toast);
  }
  gsap.killTweensOf(toast);
  gsap.fromTo(toast, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => gsap.to(toast, { y: 20, opacity: 0, duration: 0.4 }), 2600);
}

export function initPageTransitions(lenis) {
  const panel = document.querySelector('.wipe__panel');
  const logo = document.querySelector('.wipe__logo');

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    if (demo && isOtherPage(a)) { e.preventDefault(); showComingSoon(); return; }
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
