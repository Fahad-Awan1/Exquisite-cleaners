import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* Photo wheel ([data-ring]): the gallery photos ride round an upright circle like a Ferris
   wheel, staying upright. The photo at the bottom is the "front" one: largest and brightest;
   photos shrink and dim as they rise over the top. A gold hub with spokes turns with them.
   Drag / swipe to spin it (with momentum), fast scrolling gives it a push, ‹ › step one photo,
   keyboard focus brings the focused photo to the front. Pauses while off-screen; with reduced
   motion it only moves when you move it. On phones the wheel carries 12 photos (CSS hides the
   rest from the wheel; the full-screen viewer still shows all of them). */
export function initRing(ring, reduceMotion) {
  const spinner = ring.querySelector('.ring__spinner');
  const spokes = ring.querySelector('.ring__spokes');
  const all = Array.from(spinner.children);
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const cruise = reduceMotion ? 0 : -0.12; // degrees per frame at rest
  const state = { angle: 0, velocity: cruise };
  let items = all;
  let n = all.length;
  let step = 360 / n;
  let radius = 0;
  let visible = false;
  let hovering = false;
  let tween = null;

  // Size the wheel to the space available, and draw one spoke per photo.
  const layout = () => {
    items = all.filter((el) => getComputedStyle(el).display !== 'none');
    n = items.length;
    step = 360 / n;
    const w = items[0].offsetWidth;
    const h = items[0].offsetHeight;
    const maxX = ring.clientWidth / 2 - w * 0.42;
    const maxY = ring.clientHeight / 2 - h / 2 - 6;
    radius = Math.max(60, Math.min(maxX, maxY));
    ring.style.setProperty('--r', `${radius}px`);
    spokes.setAttribute('viewBox', `${-radius} ${-radius} ${radius * 2} ${radius * 2}`);
    spokes.style.width = spokes.style.height = `${radius * 2}px`;
    spokes.innerHTML = items.map((_, i) => {
      const a = (i * step * Math.PI) / 180;
      return `<line x1="0" y1="0" x2="${(Math.sin(a) * radius).toFixed(1)}" y2="${(Math.cos(a) * radius).toFixed(1)}"/>`;
    }).join('') + `<circle cx="0" cy="0" r="${(radius - 1).toFixed(1)}"/>`;
    render();
  };

  // Position every photo on the circle. 0° is the bottom (front) of the wheel.
  const render = () => {
    for (let i = 0; i < n; i++) {
      const deg = i * step + state.angle;
      const a = (deg * Math.PI) / 180;
      const x = Math.sin(a) * radius;
      const y = Math.cos(a) * radius;
      const front = (Math.cos(a) + 1) / 2; // 1 at the bottom, 0 at the top
      const scale = 0.55 + 0.45 * front ** 1.2;
      const el = items[i];
      el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${scale.toFixed(3)})`;
      el.style.zIndex = String(Math.round(front * 100));
      el.style.opacity = (0.45 + 0.55 * front ** 1.4).toFixed(3);
      el.classList.toggle('is-front', front > 0.985);
    }
    spokes.style.transform = `rotate(${-state.angle}deg)`;
  };

  // Continuous turning + momentum, only while the wheel is on screen.
  gsap.ticker.add(() => {
    if (!visible || tween) return;
    const target = hovering ? cruise * 0.25 : cruise;
    state.velocity += (target - state.velocity) * 0.04;
    if (Math.abs(state.velocity) < 0.0005 && !cruise) return;
    state.angle += state.velocity;
    render();
  });
  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '100px' }).observe(ring);

  // Entrance: the wheel grows in and spins up the first time it appears.
  if (!reduceMotion) {
    gsap.set(ring, { opacity: 0 });
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      state.velocity = -3;
      gsap.fromTo(ring, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6, ease: 'expo.out' });
    }, { rootMargin: '0px 0px -20% 0px' });
    io.observe(ring);
    // Scrolling quickly past gives the wheel a push.
    ScrollTrigger.create({
      trigger: ring,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const v = self.getVelocity();
        if (Math.abs(v) > 300 && !tween) state.velocity = Math.max(-4, Math.min(4, -v / 700));
      },
    });
  }

  // Drag / swipe sideways to turn the wheel; vertical swipes keep scrolling the page.
  let dragX = null;
  let lastX = 0;
  let moved = 0;
  ring.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    tween?.kill();
    tween = null;
    dragX = lastX = e.clientX;
    moved = 0;
  });
  window.addEventListener('pointermove', (e) => {
    if (dragX === null) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    moved += Math.abs(dx);
    if (moved > 6) ring.classList.add('is-dragging');
    state.angle -= dx * 0.35;
    state.velocity = -dx * 0.35;
    render();
  });
  const endDrag = () => {
    if (dragX === null) return;
    dragX = null;
    ring.classList.remove('is-dragging');
  };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  // A drag shouldn't count as a click on a photo (which opens the viewer).
  ring.addEventListener('click', (e) => { if (moved > 6) { e.stopPropagation(); e.preventDefault(); moved = 0; } }, true);

  if (finePointer) {
    ring.addEventListener('pointerenter', () => (hovering = true));
    ring.addEventListener('pointerleave', () => (hovering = false));
  }

  // Turn a given photo to the front (bottom) along the shortest way round.
  const goTo = (i) => {
    let target = -i * step;
    target += Math.round((state.angle - target) / 360) * 360;
    tween?.kill();
    state.velocity = 0;
    tween = gsap.to(state, {
      angle: target, duration: reduceMotion ? 0.01 : 0.9, ease: 'expo.out',
      onUpdate: render,
      onComplete: () => { tween = null; state.velocity = 0; },
    });
  };
  const current = () => ((Math.round(-state.angle / step) % n) + n) % n;
  document.querySelector('[data-ring-prev]')?.addEventListener('click', () => goTo(current() - 1));
  document.querySelector('[data-ring-next]')?.addEventListener('click', () => goTo(current() + 1));
  // Keyboard focus (Tab) brings the photo round to the front; mouse/touch focus doesn't.
  all.forEach((item) => item.addEventListener('focus', () => {
    const i = items.indexOf(item);
    if (i >= 0 && item.matches(':focus-visible')) goTo(i);
  }));

  layout();
  new ResizeObserver(layout).observe(ring);
}
