import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* 3D photo ring ([data-ring]): the gallery photos stand around a circle that slowly turns.
   Drag / swipe to spin it (with momentum), fast scrolling gives it a push, ‹ › step one
   photo, and keyboard focus turns the focused photo to the front. Photos facing away are
   dimmed. Pauses while off-screen; with reduced motion it only moves when you move it. */
export function initRing(ring, reduceMotion) {
  const spinner = ring.querySelector('.ring__spinner');
  const items = Array.from(spinner.children);
  const n = items.length;
  const step = 360 / n;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const cruise = reduceMotion ? 0 : -0.09; // degrees per frame at rest
  const state = { angle: 0, velocity: cruise };
  let radius = 0;
  let visible = false;
  let hovering = false;
  let tween = null;

  // Place each photo around the circle; the radius follows the photo width so they just touch.
  // Phones view the ring from a little higher so its circular shape reads on a narrow screen.
  let tilt = -7;
  const layout = () => {
    tilt = window.innerWidth < 640 ? -13 : -7;
    const w = items[0].offsetWidth;
    radius = Math.round((w / 2) / Math.tan(Math.PI / n) * 1.08);
    ring.style.setProperty('--r', `${radius}px`);
    items.forEach((item, i) => (item.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`));
  };
  layout();
  new ResizeObserver(layout).observe(ring);

  // Dim and soften the photos as they turn away from the viewer.
  const render = () => {
    spinner.style.transform = `translateZ(${-radius}px) rotateX(${tilt}deg) rotateY(${state.angle}deg)`;
    for (let i = 0; i < n; i++) {
      const facing = Math.cos(((i * step + state.angle) * Math.PI) / 180); // 1 = front, -1 = back
      const t = (facing + 1) / 2;
      items[i].style.opacity = (0.25 + 0.75 * t ** 1.6).toFixed(3);
      items[i].style.filter = facing < 0.2 ? `brightness(${(0.45 + 0.55 * t).toFixed(2)})` : '';
    }
  };

  // Continuous spin + momentum, only while the ring is on screen.
  gsap.ticker.add(() => {
    if (!visible || tween) return;
    const target = hovering ? cruise * 0.25 : cruise;
    state.velocity += (target - state.velocity) * 0.04;
    if (Math.abs(state.velocity) < 0.0005 && !cruise) return;
    state.angle += state.velocity;
    render();
  });
  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '100px' }).observe(ring);

  // Entrance: the ring zooms in and spins up the first time it appears.
  if (!reduceMotion) {
    gsap.set(spinner, { opacity: 0 });
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      state.velocity = -2.2;
      gsap.fromTo(ring, { scale: 0.72 }, { scale: 1, duration: 1.6, ease: 'expo.out' });
      gsap.to(spinner, { opacity: 1, duration: 1, ease: 'power2.out' });
    }, { rootMargin: '0px 0px -20% 0px' });
    io.observe(ring);
    // Scrolling quickly past gives the ring a push in the same direction.
    ScrollTrigger.create({
      trigger: ring,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const v = self.getVelocity();
        if (Math.abs(v) > 300 && !tween) state.velocity = Math.max(-3, Math.min(3, -v / 900));
      },
    });
  }

  // Drag / swipe. Horizontal moves spin the ring; vertical moves keep scrolling the page.
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
    state.angle += dx * 0.25;
    state.velocity = dx * 0.25;
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

  // Turn a given photo to the front along the shortest way round.
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
  items.forEach((item, i) => item.addEventListener('focus', () => { if (item.matches(':focus-visible')) goTo(i); }));

  render();
}
