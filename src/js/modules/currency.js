import { gsap } from 'gsap';
import { CURRENCIES } from '../config.js';

const KEY = 'ec-currency';

const read = () => {
  try { return localStorage.getItem(KEY); } catch (e) { return null; }
};
const save = (code) => {
  try { localStorage.setItem(KEY, code); } catch (e) { /* storage blocked */ }
};

const format = (ghs, code) => {
  const { symbol, rate } = CURRENCIES[code];
  const value = ghs * rate;
  const rounded = code === 'GHS' ? Math.round(value / 10) * 10 : Math.round(value);
  return symbol + rounded.toLocaleString('en-GB');
};

// Every [data-price="350"] shows that cedi amount in the chosen currency.
export function initCurrency() {
  let current = CURRENCIES[read()] ? read() : 'GHS';

  const apply = (code, animate) => {
    current = code;
    document.querySelectorAll('[data-currency]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.currency === code)));
    document.querySelectorAll('[data-price]').forEach((el) => {
      const text = format(parseFloat(el.dataset.price), code);
      if (!animate) { el.textContent = text; return; }
      gsap.timeline()
        .to(el, { yPercent: -60, opacity: 0, duration: 0.2, ease: 'power2.in' })
        .add(() => (el.textContent = text))
        .fromTo(el, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'expo.out' });
    });
    document.querySelectorAll('[data-currency-name]').forEach((el) => (el.textContent = code));
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-currency]');
    if (!btn || btn.dataset.currency === current) return;
    save(btn.dataset.currency);
    apply(btn.dataset.currency, true);
  });

  apply(current, false);
}
