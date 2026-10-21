import { waLink } from '../config.js';
import { demoTarget } from '../demo-links.js';

/* ------------------------------------------------------------------
   "Ama" — a hardcoded assistant. Each intent has trigger keywords,
   a reply and follow-up chips. Replies may contain [label](url) links
   and [[label|url]] buttons.
   ------------------------------------------------------------------ */

/* Keyword matcher shared by every assistant. Whole words/phrases score highest; longer
   stems ("sanitis") also count. Greetings and thanks only win when nothing else matched. */
function match(text, bot) {
  const t = ` ${text.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').replace(/\s+/g, ' ')} `;
  const early = bot.preMatch && bot.preMatch(t);
  if (early) return early;
  let best = null;
  let bestScore = 0;
  for (const intent of bot.intents) {
    let score = 0;
    for (const k of intent.keys || []) {
      if (t.includes(` ${k} `)) score += 3 + k.split(' ').length;
      else if (k.length > 4 && t.includes(k)) score += 2;
    }
    if (intent.id === 'greet' || intent.id === 'thanks') score *= 0.5;
    if (score > bestScore) { best = intent; bestScore = score; }
  }
  return best;
}

// In the home-only preview, links to other pages go to the matching homepage section or WhatsApp.
const isDemo = document.documentElement.hasAttribute('data-demo');
function resolveLink(url) {
  const t = isDemo && demoTarget(url);
  if (!t) return { href: url };
  return t.wa ? { href: waLink(t.wa) } : { href: t.href, tab: t.tab };
}

// Renders [label](url) links and [[label|url]] buttons, without using innerHTML on user input.
function renderRich(el, text) {
  const re = /\[\[([^|\]]+)\|([^\]]+)\]\]|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    el.append(text.slice(last, m.index));
    const isButton = m[1] !== undefined;
    const { href, tab } = resolveLink(isButton ? m[2] : m[4]);
    const a = document.createElement('a');
    a.textContent = isButton ? m[1] : m[3];
    a.href = href;
    if (isButton) a.className = 'msg__btn';
    if (tab) a.dataset.tab = tab;
    if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
    el.append(a);
    last = m.index + m[0].length;
  }
  el.append(text.slice(last));
}

export function initChat(lenis, bot) {
  const root = document.querySelector('[data-chat]');
  if (!root) return;
  const toggle = root.querySelector('[data-chat-toggle]');
  const close = root.querySelector('[data-chat-close]');
  const panel = root.querySelector('[data-chat-panel]');
  const log = root.querySelector('[data-chat-log]');
  const chips = root.querySelector('[data-chat-chips]');
  const form = root.querySelector('[data-chat-form]');
  const input = form.querySelector('input');
  const teaser = root.querySelector('[data-chat-teaser]');
  let started = false;
  let open = false;
  const mobile = window.matchMedia('(max-width: 639px)');

  const scrollDown = () => (log.scrollTop = log.scrollHeight);

  const addMsg = (text, who) => {
    const div = document.createElement('div');
    div.className = `msg msg--${who}`;
    if (who === 'bot') renderRich(div, text);
    else div.textContent = text;
    log.append(div);
    scrollDown();
  };

  const setChips = (list) => {
    chips.replaceChildren(...list.map((label) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.addEventListener('click', () => ask(label));
      return b;
    }));
  };

  const respond = (intent) => {
    const typing = document.createElement('div');
    typing.className = 'msg msg--bot msg--typing';
    typing.setAttribute('aria-label', `${bot.name} is typing`);
    typing.innerHTML = '<i></i><i></i><i></i>';
    log.append(typing);
    scrollDown();
    const text = intent.reply();
    setTimeout(() => {
      typing.remove();
      addMsg(text, 'bot');
      setChips(intent.chips);
    }, Math.min(1400, 500 + text.length * 4));
  };

  const ask = (text) => {
    const q = text.trim();
    if (!q) return;
    addMsg(q, 'user');
    const mapped = bot.chipMap[q];
    const intent = mapped ? bot.intents.find((i) => i.id === mapped) : match(q, bot);
    respond(intent || bot.fallback);
  };

  const setOpen = (state) => {
    open = state;
    root.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close chat assistant' : 'Open chat assistant');
    panel.setAttribute('aria-hidden', String(!open));
    if (mobile.matches) { open ? lenis?.stop() : lenis?.start(); document.body.style.overflow = open ? 'hidden' : ''; }
    if (open && !started) {
      started = true;
      addMsg(bot.greeting, 'bot');
      setChips(bot.startChips);
    }
    if (open && !mobile.matches) setTimeout(() => input.focus(), 300);
    if (!open) toggle.focus({ preventScroll: true });
  };

  toggle.addEventListener('click', () => setOpen(!open));
  close.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) setOpen(false); });
  form.addEventListener('submit', (e) => { e.preventDefault(); ask(input.value); input.value = ''; });
  // Let wheel events scroll the chat log instead of the page under Lenis.
  log.setAttribute('data-lenis-prevent', '');

  // A link in a reply to a section of this page: close the chat so the page can scroll there.
  log.addEventListener('click', (e) => { if (e.target.closest('a[href^="#"]')) setOpen(false); });

  // Teaser bubble: shown once per session, hides itself after 5 seconds, and never comes
  // back once it has been shown, dismissed, or the chat has been opened.
  const TEASER_KEY = 'ec-chat-teaser';
  const teaserDone = () => { try { return sessionStorage.getItem(TEASER_KEY) === '1'; } catch (e) { return false; } };
  const retireTeaser = () => {
    try { sessionStorage.setItem(TEASER_KEY, '1'); } catch (e) { /* storage blocked */ }
    teaser.classList.remove('is-visible');
    setTimeout(() => (teaser.hidden = true), 500);
  };
  if (!teaserDone()) {
    setTimeout(() => {
      if (open || teaserDone()) return;
      teaser.hidden = false;
      requestAnimationFrame(() => teaser.classList.add('is-visible'));
      try { sessionStorage.setItem(TEASER_KEY, '1'); } catch (e) { /* storage blocked */ }
      setTimeout(retireTeaser, 5000);
    }, 4000);
  }
  teaser.querySelector('[data-chat-teaser-open]').addEventListener('click', () => { retireTeaser(); setOpen(true); });
  teaser.querySelector('[data-chat-teaser-close]').addEventListener('click', retireTeaser);
  toggle.addEventListener('click', retireTeaser);
}
