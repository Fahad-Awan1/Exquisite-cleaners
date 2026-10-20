import { gsap } from 'gsap';
import { waLink } from '../config.js';

const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export function initInteractions(lenis, reduceMotion) {
  if (finePointer && !reduceMotion) {
    initTilt();
    initMagnetic();
    initCursor();
  }
  initAnchors(lenis);
  initFinder(reduceMotion);
  initFlips();
  initBookingForm();
}

/* 3D tilt that follows the pointer */
function initTilt() {
  $$('[data-tilt]').forEach((el) => {
    const rx = gsap.quickTo(el, 'rotateX', { duration: 0.6, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotateY', { duration: 0.6, ease: 'power3.out' });
    gsap.set(el, { transformPerspective: 1000 });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      rx(-y * 10);
      ry(x * 12);
    });
    el.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

/* Buttons that lean towards the cursor */
function initMagnetic() {
  $$('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.3);
      y((e.clientY - r.top - r.height / 2) * 0.4);
    });
    el.addEventListener('pointerleave', () => { x(0); y(0); });
  });
}

/* Gold ring cursor that grows with a label over cards */
function initCursor() {
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;
  const label = cursor.querySelector('.cursor__label');
  const x = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
  const y = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });
  window.addEventListener('pointermove', (e) => {
    cursor.classList.add('is-visible');
    x(e.clientX);
    y(e.clientY);
  });
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[data-cursor]');
    cursor.classList.toggle('is-hover', !!t);
    if (t) label.textContent = t.dataset.cursor;
  });
}

/* In-page anchors use Lenis for a smooth glide.
   data-tab="baby" also opens that occasion tab (#tab-baby) on the way. */
function initAnchors(lenis) {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    if (a.dataset.tab) document.getElementById(`tab-${a.dataset.tab}`)?.click();
    if (lenis) lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    else target.scrollIntoView({ behavior: 'smooth' });
  });
}

/* Occasion finder: accessible tabs with an animated panel swap */
function initFinder(reduceMotion) {
  $$('[data-finder]').forEach((finder) => {
    const tabs = $$('[role="tab"]', finder);
    const panels = $$('[role="tabpanel"]', finder);
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach((p) => (p.hidden = p.id !== tab.getAttribute('aria-controls')));
      if (focus) tab.focus();
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (panel) {
        gsap.fromTo(panel.querySelector('img'), { clipPath: 'inset(0 100% 0 0)', scale: 1.15 }, { clipPath: 'inset(0 0% 0 0)', scale: 1, duration: 1, ease: 'expo.out' });
        gsap.fromTo(panel.querySelectorAll('.finder__body > *'), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: 'expo.out' });
      }
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        select(next, true);
      });
    });
  });
}

/* Flip cards: hover on desktop, tap or button on touch and keyboard */
function initFlips() {
  $$('.flip').forEach((card) => {
    const btns = $$('[data-flip]', card);
    const toggle = () => {
      const on = card.classList.toggle('is-flipped');
      btns.forEach((b) => b.setAttribute('aria-expanded', String(on)));
    };
    btns.forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); toggle(); }));
    if (!finePointer) {
      card.addEventListener('click', (e) => { if (!e.target.closest('a, button')) toggle(); });
    }
  });
  // Open the card a link points to (e.g. family-care.html#mama-care)
  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target?.classList.contains('flip')) setTimeout(() => target.classList.add('is-flipped'), 1200);
  }
}

/* Booking form → pre-filled WhatsApp message */
function initBookingForm() {
  const form = document.querySelector('[data-booking]');
  if (!form) return;
  const status = form.querySelector('[data-status]');

  const params = new URLSearchParams(location.search);
  const service = params.get('service');
  if (service) {
    const select = form.querySelector('[name="service"]');
    const opt = Array.from(select.options).find((o) => o.value === service);
    if (opt) select.value = service;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let firstInvalid = null;
    $$('[required]', form).forEach((input) => {
      const field = input.closest('.field');
      const err = field.querySelector('.field__error');
      const ok = input.value.trim() !== '';
      field.classList.toggle('field--invalid', !ok);
      input.setAttribute('aria-invalid', String(!ok));
      if (err) err.textContent = ok ? '' : 'Please fill this in.';
      if (!ok && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    const data = new FormData(form);
    const lines = [
      'Hello Exquisite Cleaners, I would like to book:',
      `• Service: ${data.get('service')}`,
      data.get('property') && `• Property: ${data.get('property')}`,
      data.get('frequency') && `• Frequency: ${data.get('frequency')}`,
      data.get('date') && `• Preferred date: ${data.get('date')}`,
      `• Location: ${data.get('location')}`,
      `• Name: ${data.get('name')}`,
      `• Phone: ${data.get('phone')}`,
      data.get('abroad') && '• I live abroad (diaspora client)',
      data.get('message') && `• Notes: ${data.get('message')}`,
    ].filter(Boolean);

    window.open(waLink(lines.join('\n')), '_blank', 'noopener');
    status.textContent = 'Thank you! WhatsApp has opened with your booking details. Just press send and we’ll reply shortly.';
    status.hidden = false;
    gsap.fromTo(status, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
  });
}
