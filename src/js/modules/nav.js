import { gsap } from 'gsap';

// Header turns solid after the hero and hides while scrolling down.
export function initHeader(lenis) {
  const header = document.querySelector('[data-header]');
  const bar = document.querySelector('.action-bar');
  if (!header) return;
  let last = 0;
  let ticking = false;
  // Page height is measured once (and on resize) — reading it on every scroll forces a full layout.
  let pageH = document.documentElement.scrollHeight;
  let viewH = window.innerHeight;
  const measure = () => { pageH = document.documentElement.scrollHeight; viewH = window.innerHeight; };
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('load', measure);
  new ResizeObserver(measure).observe(document.body);

  const state = { scrolled: null, hidden: null, barHidden: null };
  const set = (el, key, cls, val) => { if (state[key] !== val) { state[key] = val; el.classList.toggle(cls, val); } };

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    set(header, 'scrolled', 'is-scrolled', y > 40);
    if (!document.body.classList.contains('drawer-open')) set(header, 'hidden', 'is-hidden', y > last && y > 400);
    // Keep the mobile action bar out of the way near the footer.
    if (bar) set(bar, 'barHidden', 'is-hidden', viewH + y > pageH - 140);
    last = y;
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
}

export function initDrawer(lenis) {
  const burger = document.querySelector('[data-burger]');
  const drawer = document.querySelector('[data-drawer]');
  if (!burger || !drawer) return;
  const bg = drawer.querySelector('.drawer__bg');
  const links = drawer.querySelectorAll('.drawer__nav a, .drawer__foot > *');
  let open = false;
  let tl;

  const set = (state) => {
    open = state;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('drawer-open', open);
    tl?.kill();
    if (open) {
      drawer.classList.add('is-open');
      lenis?.stop();
      tl = gsap.timeline()
        .fromTo(bg, { clipPath: 'circle(0% at calc(100% - 44px) 40px)' }, { clipPath: 'circle(150% at calc(100% - 44px) 40px)', duration: 0.9, ease: 'expo.inOut' })
        .fromTo(links, { y: 60, opacity: 0, rotateX: -40 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out' }, 0.35);
      links[0]?.focus({ preventScroll: true });
    } else {
      lenis?.start();
      tl = gsap.timeline({ onComplete: () => drawer.classList.remove('is-open') })
        .to(links, { y: -30, opacity: 0, duration: 0.3, stagger: 0.02, ease: 'power2.in' })
        .to(bg, { clipPath: 'circle(0% at calc(100% - 44px) 40px)', duration: 0.7, ease: 'expo.inOut' }, 0.15);
    }
  };

  burger.addEventListener('click', () => set(!open));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) { set(false); burger.focus(); } });
  window.matchMedia('(min-width: 1100px)').addEventListener('change', (e) => { if (e.matches && open) set(false); });
}
