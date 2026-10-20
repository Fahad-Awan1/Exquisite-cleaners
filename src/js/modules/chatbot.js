import { CONTACT, CURRENCIES, waLink } from '../config.js';

/* ------------------------------------------------------------------
   "Ama" — a hardcoded assistant. Each intent has trigger keywords,
   a reply (with optional [label](url) links) and follow-up chips.
   ------------------------------------------------------------------ */

const price = (ghs) => {
  let code = 'GHS';
  try { code = localStorage.getItem('ec-currency') || 'GHS'; } catch (e) { /* ignore */ }
  const c = CURRENCIES[code] || CURRENCIES.GHS;
  const v = ghs * c.rate;
  return c.symbol + (code === 'GHS' ? Math.round(v / 10) * 10 : Math.round(v)).toLocaleString('en-GB');
};

const INTENTS = [
  {
    id: 'greet',
    keys: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'akwaaba', 'howdy'],
    reply: () => 'Hello, and welcome! How can I help you today? You can ask about our services, prices, care packages or booking.',
    chips: ['Our services', 'Prices', 'Book a clean'],
  },
  {
    id: 'services',
    keys: ['service', 'services', 'what do you do', 'offer', 'help with', 'options'],
    reply: () => 'We offer:\n• Residential cleaning\n• Corporate & commercial cleaning\n• Airbnb & short-stay management\n• Specialised home care (Family Care, Mama Care, Bereavement, Wedding Recovery, Return From Travel, Festival prep)\n• Property maintenance\n\nSee them all on our [services page](/services.html).',
    chips: ['Home cleaning', 'Office cleaning', 'Family Care', 'Maintenance'],
  },
  {
    id: 'residential',
    keys: ['home', 'house', 'residential', 'apartment', 'flat', 'deep clean', 'deep cleaning', 'regular clean', 'carpet', 'upholstery', 'sofa', 'window', 'floor', 'kitchen', 'bathroom', 'sanitis', 'sanitiz', 'move in', 'move out', 'moving'],
    reply: () => 'Our residential cleaning covers homes of every size:\n• Regular and deep cleaning\n• Move-in / move-out cleans\n• Kitchens, bathrooms, windows and floors\n• Laundry and ironing\n• Carpet and upholstery cleaning\n• Home sanitisation\n\n[More about home cleaning](/services.html#residential)',
    chips: ['Prices', 'Book a clean', 'Laundry & ironing'],
  },
  {
    id: 'laundry',
    keys: ['laundry', 'ironing', 'iron', 'washing clothes', 'linen'],
    reply: () => 'Yes, we do laundry and ironing, either on its own or as part of a home clean, Airbnb turnover or care package.',
    chips: ['Home cleaning', 'Airbnb hosting', 'Book a clean'],
  },
  {
    id: 'commercial',
    keys: ['office', 'commercial', 'business', 'company', 'corporate', 'restaurant', 'shop', 'retail', 'school', 'church', 'venue', 'event', 'building', 'contract'],
    reply: () => 'We clean offices, restaurants, retail spaces, corporate facilities, schools, commercial buildings, events and venues.\n\nWe specialise in long-term contracts with a dedicated, dependable team. [Commercial cleaning](/services.html#commercial)',
    chips: ['Request a site visit', 'Prices', 'Talk to a person'],
  },
  {
    id: 'airbnb',
    keys: ['airbnb', 'short stay', 'short-stay', 'host', 'guest', 'turnover', 'booking.com', 'rental', 'holiday let', 'property manager'],
    reply: () => `For Airbnb and short-stay hosts we handle:\n• Guest turnover cleaning\n• Linen and laundry\n• Property inspections\n• Restocking essentials\n• Check-in / check-out support\n• Emergency guest support\n• Maintenance coordination\n\nTurnovers start from about ${price(450)}. Ideal if you live outside Ghana. [Airbnb management](/airbnb.html)`,
    chips: ['I live abroad', 'Prices', 'Book a clean'],
  },
  {
    id: 'family',
    keys: ['abroad', 'diaspora', 'overseas', 'uk', 'london', 'usa', 'america', 'canada', 'germany', 'parent', 'parents', 'mum', 'mom', 'dad', 'mother', 'father', 'elderly', 'grandma', 'grandmother', 'family care', 'check on', 'loved one', 'i live abroad'],
    reply: () => 'Exquisite Family Care is made for Ghanaians abroad and busy professionals. We can:\n• Clean and sanitise the home\n• Do laundry and ironing\n• Shop for groceries and collect medication\n• Carry out home safety checks\n• Make companion visits and help with appointments\n• Make emergency support visits\n• Send you monthly updates and photographs\n\n[Explore Family Care](/family-care.html#family-care)',
    chips: ['Family Care price', 'Airbnb hosting', 'Talk to a person'],
  },
  {
    id: 'mama',
    keys: ['baby', 'newborn', 'mama', 'new mother', 'new mum', 'pregnan', 'nursery', 'maternity', 'birth'],
    reply: () => 'Congratulations! Mama Care helps new families with deep cleaning, laundry and ironing, bed linen changes, nursery preparation, kitchen cleaning, grocery shopping, meal preparation help and baby-room sanitisation. [Mama Care](/family-care.html#mama-care)',
    chips: ['Book a clean', 'Prices', 'Other care packages'],
  },
  {
    id: 'bereavement',
    keys: ['funeral', 'bereave', 'death', 'passed away', 'burial', 'one week', 'mourning', 'condolence'],
    reply: () => 'We’re so sorry for your loss. Bereavement Care supports families, churches and funeral organisers with pre-funeral cleaning, guest-area preparation, cleaning during arrangements, a post-funeral deep clean, laundry, waste management and kitchen support. [Bereavement Care](/family-care.html#bereavement)',
    chips: ['Talk to a person', 'Book a clean'],
  },
  {
    id: 'wedding',
    keys: ['wedding', 'marriage', 'engagement', 'newlywed', 'reception', 'party', 'after party'],
    reply: () => 'Wedding Recovery takes care of everything after the celebration: post-wedding cleaning, guest rooms, laundry, gift organisation, kitchen cleaning and waste removal. [Wedding Recovery](/family-care.html#wedding)',
    chips: ['Book a clean', 'Festival prep', 'Prices'],
  },
  {
    id: 'travel',
    keys: ['return', 'returning', 'coming home', 'travel', 'trip', 'holiday', 'arrive', 'arrival', 'landing', 'flight'],
    reply: () => 'With Return From Travel we get your home ready before you land: deep cleaning, fresh bedding, grocery stocking, fridge preparation, airing the home and optional welcome touches. [Return From Travel](/family-care.html#travel)',
    chips: ['Book a clean', 'I live abroad'],
  },
  {
    id: 'festival',
    keys: ['festival', 'christmas', 'easter', 'eid', 'homowo', 'new year', 'celebration', 'guests coming', 'festival prep'],
    reply: () => 'Festival & Celebration Preparation gets your home guest-ready with deep cleaning, window, carpet and upholstery cleaning, guest-room preparation and outdoor cleaning. [Festival prep](/family-care.html#festival)',
    chips: ['Book a clean', 'Prices'],
  },
  {
    id: 'maintenance',
    keys: ['paint', 'painting', 'plumb', 'plumbing', 'leak', 'pipe', 'tile', 'tiling', 'repair', 'fix', 'handyman', 'maintenance', 'fixture', 'install', 'broken'],
    reply: () => 'Through qualified personnel and trusted providers we coordinate:\n• Interior and exterior painting\n• Plumbing repairs and installations\n• Floor and wall tiling\n• Minor handyman repairs\n• Fixture installations\n• Preventative maintenance\n\n[Property maintenance](/property-maintenance.html)',
    chips: ['Request a site visit', 'I live abroad'],
  },
  {
    id: 'prices',
    keys: ['price', 'prices', 'cost', 'how much', 'quote', 'rate', 'charge', 'fee', 'expensive', 'cheap', 'budget', 'family care price'],
    reply: () => `Here are our indicative starting prices:\n• Regular home clean: from ${price(350)}\n• Deep clean: from ${price(950)}\n• Move-in / move-out: from ${price(1200)}\n• Airbnb turnover: from ${price(450)}\n• Family Care: from ${price(1500)} per month\n\nThe final quote depends on size and needs. Switch currency at the top of the page. [Get an exact quote](/contact.html)`,
    chips: ['Book a clean', 'Office cleaning', 'Talk to a person'],
  },
  {
    id: 'book',
    keys: ['book', 'booking', 'appointment', 'schedule', 'reserve', 'hire', 'available', 'availability', 'request a site visit', 'site visit', 'when can'],
    reply: () => `Booking takes a minute:\n1. Fill in our [booking form](/contact.html), or\n2. Message us on [WhatsApp](${waLink('Hello Exquisite Cleaners, I would like to book a clean.')})\n\nWe confirm the details and time with you, usually the same day.`,
    chips: ['Prices', 'Where do you work?', 'Opening hours'],
  },
  {
    id: 'location',
    keys: ['where', 'location', 'area', 'areas', 'accra', 'tema', 'kumasi', 'east legon', 'cantonments', 'airport', 'spintex', 'city', 'region', 'cover', 'where do you work'],
    reply: () => `We’re based in ${CONTACT.city} and serve Greater Accra. For other areas, [message us](${waLink('Hello, do you cover my area?')}) and we’ll let you know.`,
    chips: ['Book a clean', 'Opening hours'],
  },
  {
    id: 'hours',
    keys: ['hour', 'hours', 'open', 'opening', 'time', 'sunday', 'weekend', 'opening hours'],
    reply: () => `Our team works ${CONTACT.hours}. Messages sent outside those hours are answered first thing the next working day.`,
    chips: ['Book a clean', 'Talk to a person'],
  },
  {
    id: 'payment',
    keys: ['pay', 'payment', 'momo', 'mobile money', 'card', 'bank', 'transfer', 'invoice', 'deposit'],
    reply: () => 'We share payment details when we confirm your booking, including options for clients paying from abroad. Business clients on contracts receive regular invoices.',
    chips: ['Book a clean', 'Talk to a person'],
  },
  {
    id: 'trust',
    keys: ['trust', 'safe', 'vetted', 'background', 'insured', 'reliable', 'staff', 'cleaners', 'team', 'who will come', 'eco', 'product', 'chemical', 'supplies', 'equipment'],
    reply: () => 'Your home is in safe hands. Our cleaners are carefully vetted and trained, and we use quality, eco-conscious products. Tell us about allergies or product preferences and we’ll follow them. Clients abroad receive photo updates so they can see the work.',
    chips: ['Book a clean', 'Family Care'],
  },
  {
    id: 'human',
    keys: ['human', 'person', 'agent', 'call', 'phone', 'number', 'contact', 'email', 'whatsapp', 'talk to a person', 'speak'],
    reply: () => `Of course. You can reach our team:\n• [WhatsApp](${waLink('Hello Exquisite Cleaners!')})\n• Call [${CONTACT.phone}](tel:${CONTACT.phoneHref})\n• Email [${CONTACT.email}](mailto:${CONTACT.email})`,
    chips: ['Book a clean', 'Prices'],
  },
  {
    id: 'thanks',
    keys: ['thank', 'thanks', 'medaase', 'great', 'perfect', 'awesome', 'ok', 'okay', 'bye', 'goodbye'],
    reply: () => 'You’re very welcome! If you need anything else, I’m right here. You do, we clean.',
    chips: ['Book a clean', 'Our services'],
  },
];

// Short chip labels that map straight to an intent.
const CHIP_MAP = {
  'Our services': 'services', 'Home cleaning': 'residential', 'Office cleaning': 'commercial', 'Airbnb hosting': 'airbnb',
  'Family Care': 'family', 'Family Care price': 'prices', 'Maintenance': 'maintenance', 'Prices': 'prices', 'Book a clean': 'book',
  'I live abroad': 'family', 'Talk to a person': 'human', 'Opening hours': 'hours', 'Where do you work?': 'location',
  'Laundry & ironing': 'laundry', 'Request a site visit': 'book', 'Festival prep': 'festival', 'Other care packages': 'care',
};

const CARE = {
  id: 'care',
  reply: () => 'Our specialised care packages:\n• Exquisite Family Care\n• Mama Care\n• Bereavement Care\n• Wedding Recovery\n• Return From Travel\n• Festival & Celebration Preparation\n\n[See all packages](/family-care.html)',
  chips: ['Family Care', 'Book a clean'],
};

const START_CHIPS = ['Prices', 'I live abroad', 'Airbnb hosting', 'Office cleaning', 'Book a clean'];

function match(text) {
  const t = ` ${text.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').replace(/\s+/g, ' ')} `;
  let best = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    let score = 0;
    for (const k of intent.keys) {
      if (t.includes(` ${k} `)) score += 3 + k.split(' ').length; // whole word or phrase
      else if (k.length > 4 && t.includes(k)) score += 2; // stem, e.g. "sanitis"
    }
    // Greetings and thanks only win when nothing more specific matched.
    if (intent.id === 'greet' || intent.id === 'thanks') score *= 0.5;
    if (score > bestScore) { best = intent; bestScore = score; }
  }
  return best;
}

const FALLBACK = {
  reply: () => `I’m not completely sure about that one, but our team can help. [Chat with us on WhatsApp](${waLink('Hello Exquisite Cleaners, I have a question.')}) or try one of these:`,
  chips: ['Our services', 'Prices', 'Talk to a person'],
};

// Renders text with [label](url) links, without using innerHTML on user input.
function renderRich(el, text) {
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    el.append(text.slice(last, m.index));
    const a = document.createElement('a');
    a.textContent = m[1];
    a.href = m[2];
    if (/^https?:/.test(m[2])) { a.target = '_blank'; a.rel = 'noopener'; }
    el.append(a);
    last = m.index + m[0].length;
  }
  el.append(text.slice(last));
}

export function initChat(lenis) {
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
    typing.setAttribute('aria-label', 'Ama is typing');
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
    const mapped = CHIP_MAP[q];
    const intent = mapped === 'care' ? CARE : mapped ? INTENTS.find((i) => i.id === mapped) : match(q);
    respond(intent || FALLBACK);
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
      addMsg('Akwaaba! I’m Ama, the Exquisite Cleaners assistant.\nAsk me about our services, prices, care packages or how to book.', 'bot');
      setChips(START_CHIPS);
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

  // A gentle teaser bubble after a few seconds, once per session.
  let seen = false;
  try { seen = sessionStorage.getItem('ec-chat-teaser') === '1'; } catch (e) { /* ignore */ }
  if (!seen) {
    setTimeout(() => {
      if (open) return;
      teaser.classList.add('is-visible');
      try { sessionStorage.setItem('ec-chat-teaser', '1'); } catch (e) { /* ignore */ }
      setTimeout(() => teaser.classList.remove('is-visible'), 7000);
    }, 6000);
  }
  teaser.addEventListener('click', () => setOpen(true));
}
