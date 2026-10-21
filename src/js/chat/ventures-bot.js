import { CONTACT, VENTURES, waLink } from '../config.js';

/* Assistant for the Exquisite Ventures page. Same engine as the cleaners site
   (modules/chatbot.js); only the topics and wording differ. */

const quoteButton = (what) => `[[Get a quote on WhatsApp|${waLink(`Hello Exquisite Ventures, I'd like a quote for ${what}.`)}]]`;

const INTENTS = [
  {
    id: 'greet',
    keys: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'akwaaba', 'howdy'],
    reply: () => 'Hello, and welcome to Exquisite Ventures! Ask me about importing products, planning an event, or getting a quote.',
    chips: ['Our services', 'Plan an event', 'Products we import'],
  },
  {
    id: 'about',
    keys: ['who are you', 'about', 'company', 'what do you do', 'exquisite ventures', 'business', 'team', 'services', 'service', 'offer'],
    reply: () => 'Exquisite Ventures is a team of creative business people who know both the Ghanaian and international markets. We help start-ups and established businesses with:\n• Import & export of premium products\n• Event organisation\n• Event management\n\n[See our services](#services)',
    chips: ['Products we import', 'Plan an event', 'Get a quote'],
  },
  {
    id: 'import',
    keys: ['import', 'export', 'products', 'product', 'wine', 'wines', 'water', 'flavoured', 'cosmetics', 'body care', 'tea', 'juice', 'fragrance', 'perfume', 'supply', 'supplier', 'wholesale', 'stock', 'buy', 'order', 'distribute'],
    reply: () => `We import premium products into Ghana, including wines, flavoured and sparkling water, juices, teas, cosmetics and fragrances.\n\nTell us what you need and in what quantities, and we’ll check availability.\n[See our products](#products)\n${quoteButton('imported products')}`,
    chips: ['Our partners', 'Get a quote', 'Talk to a person'],
  },
  {
    id: 'events',
    keys: ['event', 'events', 'party', 'parties', 'corporate', 'wedding', 'birthday', 'christening', 'naming', 'launch', 'dinner', 'venue', 'organise', 'organize', 'plan', 'planning', 'consulting', 'celebration', 'plan an event'],
    reply: () => `Event organisation covers:\n• Corporate events\n• Private events and parties\n• Venue scouting\n• Event consulting\n\nShare your date, guest numbers and style, and we’ll put a plan together.\n${quoteButton('an event')}`,
    chips: ['Event management', 'See the gallery', 'Get a quote'],
  },
  {
    id: 'management',
    keys: ['management', 'manage', 'coordinate', 'coordinator', 'on the day', 'my own event', 'supervise', 'event management'],
    reply: () => `Already planning your own event? With event management we become an extra pair of eyes on the day, keeping suppliers, timing and guests on track so you can enjoy it.\n${quoteButton('event management')}`,
    chips: ['Plan an event', 'Get a quote'],
  },
  {
    id: 'partners',
    keys: ['partner', 'partners', 'brands', 'brand', 'zidela', 'carmien', 'clos malverne', 'sezabe', 'kegau', 'cedarberg', 'our partners'],
    reply: () => 'We’re proud to work with brands including Zidela, Carmien, Clos Malverne, Sezabe, Kegau and Cedarberg Aqua.\n[See our partners](#partners)',
    chips: ['Products we import', 'Get a quote'],
  },
  {
    id: 'gallery',
    keys: ['gallery', 'photos', 'pictures', 'portfolio', 'past events', 'see the gallery', 'examples'],
    reply: () => 'Have a look at some of our past events and setups in the [gallery](#gallery).',
    chips: ['Plan an event', 'Get a quote'],
  },
  {
    id: 'cleaners',
    keys: ['clean', 'cleaning', 'cleaners', 'cleaner', 'home care', 'airbnb', 'housekeeping', 'exquisite cleaners'],
    reply: () => `Cleaning is handled by our sister company, Exquisite Cleaners: premium home, office and Airbnb cleaning plus family care across Accra.\n[[Visit Exquisite Cleaners|${VENTURES.cleanersUrl}]]`,
    chips: ['Our services', 'Talk to a person'],
  },
  {
    id: 'quote',
    keys: ['price', 'prices', 'cost', 'how much', 'quote', 'rate', 'charge', 'fee', 'budget', 'get a quote'],
    reply: () => `Every order and event is different, so we price each one after a quick chat. Send us the details and we’ll reply with a quote.\n${quoteButton('my project')}`,
    chips: ['Plan an event', 'Products we import', 'Talk to a person'],
  },
  {
    id: 'location',
    keys: ['where', 'location', 'located', 'ghana', 'accra', 'south africa', 'country', 'deliver', 'delivery'],
    reply: () => `We’re based in ${CONTACT.city} and serve clients across Ghana, working with producers and partners abroad, including South Africa.`,
    chips: ['Products we import', 'Talk to a person'],
  },
  {
    id: 'human',
    keys: ['human', 'person', 'agent', 'call', 'phone', 'number', 'contact', 'whatsapp', 'talk to a person', 'speak', 'facebook', 'instagram', 'social', 'email'],
    reply: () => `You can reach our team:\n• [WhatsApp](${waLink('Hello Exquisite Ventures!')})\n• Call [${CONTACT.phone}](tel:${CONTACT.phoneHref})\n• [Facebook](${VENTURES.social.facebook}) · [Instagram](${VENTURES.social.instagram})`,
    chips: ['Get a quote', 'Our services'],
  },
  {
    id: 'thanks',
    keys: ['thank', 'thanks', 'medaase', 'great', 'perfect', 'awesome', 'ok', 'okay', 'bye', 'goodbye'],
    reply: () => 'You’re very welcome! We’d love to bring a little class to your next project.',
    chips: ['Get a quote', 'Our services'],
  },
];

export const venturesBot = {
  name: 'Exquisite Ventures Assistant',
  greeting: 'Akwaaba! I’m the Exquisite Ventures assistant.\nAsk me about the products we import, planning an event, or getting a quote.',
  intents: INTENTS,
  chipMap: {
    'Our services': 'about', 'Plan an event': 'events', 'Products we import': 'import', 'Get a quote': 'quote',
    'Event management': 'management', 'Our partners': 'partners', 'See the gallery': 'gallery',
    'Talk to a person': 'human', 'Exquisite Cleaners': 'cleaners',
  },
  startChips: ['Our services', 'Plan an event', 'Products we import', 'Get a quote', 'Exquisite Cleaners'],
  fallback: {
    reply: () => `I’m not completely sure about that one, but our team can help. [Chat with us on WhatsApp](${waLink('Hello Exquisite Ventures, I have a question.')}) or try one of these:`,
    chips: ['Our services', 'Get a quote', 'Talk to a person'],
  },
};
