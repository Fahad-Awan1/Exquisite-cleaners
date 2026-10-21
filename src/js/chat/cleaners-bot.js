import { CONTACT, CURRENCIES, CURRENCY_TOGGLE, PRICES, waLink } from '../config.js';

/* "Ama", the Exquisite Cleaners assistant: intents, chips and price answers.
   The shared chat engine (modules/chatbot.js) does the matching and rendering. */

const price = (ghs) => {
  let code = 'GHS';
  if (CURRENCY_TOGGLE) { try { code = localStorage.getItem('ec-currency') || 'GHS'; } catch (e) { /* ignore */ } }
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
    reply: () => `Here are our sample starting prices:\n• Regular home clean: from ${price(PRICES.regular)}\n• Deep clean: from ${price(PRICES.deep)}\n• Move-in / move-out: from ${price(PRICES.moveout)}\n• Carpet & upholstery: from ${price(PRICES.carpet)}\n• Airbnb turnover: from ${price(PRICES.airbnb)}\n• Family Care: from ${price(PRICES.familyCare)} per month\n\nFinal price after a free quote.${CURRENCY_TOGGLE ? ' You can switch currency at the top of the page.' : ''}\n[[Get a free quote on WhatsApp|${waLink("Hello Exquisite Cleaners, I'd like a free quote.")}]]`,
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
    reply: () => `Of course. You can reach our team:\n• [WhatsApp](${waLink('Hello Exquisite Cleaners!')})\n• Call [${CONTACT.phone}](tel:${CONTACT.phoneHref})${CONTACT.email ? `\n• Email [${CONTACT.email}](mailto:${CONTACT.email})` : ''}`,
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

/* Price questions ("How much is a deep clean?") answer with that service's sample
   "from" price in the selected currency. Checked in order, so "deep" wins over "home". */
const PRICE_WORDS = /\b(price|prices|pricing|cost|costs|how much|quote|rate|rates|charge|charges|fee|fees|expensive|cheap|budget)\b/;
const PRICE_SERVICES = [
  { keys: ['deep'], name: 'A deep clean', ghs: () => PRICES.deep, ask: 'a deep clean' },
  { keys: ['move in', 'move-in', 'move out', 'move-out', 'moving', 'end of tenancy'], name: 'A move-in / move-out clean', ghs: () => PRICES.moveout, ask: 'a move-in / move-out clean' },
  { keys: ['carpet', 'upholstery', 'sofa', 'couch', 'rug'], name: 'Carpet & upholstery cleaning', ghs: () => PRICES.carpet, ask: 'carpet & upholstery cleaning' },
  { keys: ['airbnb', 'turnover', 'short stay', 'short-stay', 'guest'], name: 'An Airbnb turnover clean', ghs: () => PRICES.airbnb, ask: 'Airbnb turnover cleaning',
    extra: () => `With linen laundry, restocking and a photo report, it starts from ${price(PRICES.airbnbLinen)}.` },
  { keys: ['family care', 'parent', 'parents', 'mum', 'mom', 'dad', 'abroad', 'elderly'], name: 'Exquisite Family Care', ghs: () => PRICES.familyCare, per: ' per month', ask: 'Exquisite Family Care' },
  { keys: ['office', 'commercial', 'business', 'restaurant', 'school', 'shop', 'contract', 'company'], ask: 'commercial cleaning',
    custom: 'Business cleaning is priced per site, after a free site visit, so the team and schedule match your space.' },
  { keys: ['mama', 'baby', 'bereave', 'funeral', 'wedding', 'travel', 'festival', 'christmas', 'paint', 'plumb', 'tiling', 'repair', 'maintenance'], ask: 'a care package or maintenance job',
    custom: 'This service is tailored to your home and dates, so we price it after a quick chat.' },
  { keys: ['regular', 'weekly', 'fortnightly', 'standard', 'home', 'house', 'apartment', 'flat', 'clean', 'cleaning'], name: 'A regular home clean', ghs: () => PRICES.regular, ask: 'a regular home clean' },
];

function priceAnswer(t) {
  const svc = PRICE_SERVICES.find((p) => p.keys.some((k) => (k.length > 5 ? t.includes(k) : t.includes(` ${k} `))));
  if (!svc) return INTENTS.find((i) => i.id === 'prices');
  const button = `[[Get a free quote on WhatsApp|${waLink(`Hello Exquisite Cleaners, I'd like a free quote for ${svc.ask}.`)}]]`;
  const body = svc.custom
    ? svc.custom
    : `${svc.name} starts from ${price(svc.ghs())}${svc.per || ''} (sample price).${svc.extra ? `\n${svc.extra()}` : ''}`;
  return {
    reply: () => `${body}\n\nFinal price after a free quote.\n${button}`,
    chips: ['Prices', 'Book a clean', 'Talk to a person'],
  };
}

const FALLBACK = {
  reply: () => `I’m not completely sure about that one, but our team can help. [Chat with us on WhatsApp](${waLink('Hello Exquisite Cleaners, I have a question.')}) or try one of these:`,
  chips: ['Our services', 'Prices', 'Talk to a person'],
};


export const cleanersBot = {
  name: 'Ama',
  greeting: 'Akwaaba! I’m Ama, the Exquisite Cleaners assistant.\nAsk me about our services, prices, care packages or how to book.',
  intents: [...INTENTS, CARE],
  chipMap: { ...CHIP_MAP },
  startChips: START_CHIPS,
  // Price questions get that service's price before normal keyword matching.
  preMatch: (t) => (PRICE_WORDS.test(t) ? priceAnswer(t) : null),
  fallback: FALLBACK,
};
