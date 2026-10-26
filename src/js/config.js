// Business details used across the site. Change them here and every link, button and
// chatbot answer picks them up. (This file is also read at build time by vite.config.js.)

// Phone / WhatsApp: digits only in international format, no "+" or spaces.
// Every wa.me and tel: link on the site is built from this one value.
export const WHATSAPP_NUMBER = '17133645155';
// How the number is shown on the page.
export const PHONE_DISPLAY = '+1 713-364-5155';

// Leave empty to hide the email everywhere. Example: 'hello@exquisitecleaners.com'
export const EMAIL = '';

// Social profiles. An icon only appears in the footer when its URL is filled in.
export const SOCIAL = {
  instagram: '',
  facebook: '',
  tiktok: '',
};

// The live domain, e.g. 'https://exquisitecleaners.com'. Leave empty until the client owns one:
// canonical tags, the sitemap and the domain in robots.txt are only generated when it's set.
export const SITE_URL = '';

// Customer preview only (npm run build:preview / deploy:preview). The full site ignores these.
export const PREVIEW = {
  whatsappNumber: '27728408296', // +27 72 840 8296, used by every WhatsApp button in the preview
  currencyToggle: false, // false = no GH₵/£/$ switch, prices shown in GH₵ only
};

// Exquisite Ventures one-page site (ventures.html, npm run build:ventures).
export const VENTURES = {
  whatsappNumber: '27728408296', // +27 72 840 8296
  phoneDisplay: '+27 72 840 8296',
  email: '',
  social: {
    facebook: 'https://www.facebook.com/ExquisiteVenturesGh/',
    instagram: 'https://www.instagram.com/exquisiteventuresgh/',
    tiktok: '',
  },
  // Opened in a new tab from the Ventures page.
  cleanersUrl: 'https://cleaners.exquisiteventuresgh.com/',
};

// Which page is running: <html data-site="ventures"> marks the Ventures page, <html data-demo> the
// cleaners customer preview. (Guarded: this file is also read by vite.config.js in Node.)
const root = typeof document !== 'undefined' ? document.documentElement : null;
export const IS_VENTURES = !!root && root.dataset.site === 'ventures';
const isPreview = !!root && root.hasAttribute('data-demo');

let ACTIVE_WHATSAPP = WHATSAPP_NUMBER;
if (IS_VENTURES) ACTIVE_WHATSAPP = VENTURES.whatsappNumber;
else if (isPreview && PREVIEW.whatsappNumber) ACTIVE_WHATSAPP = PREVIEW.whatsappNumber;
export const CURRENCY_TOGGLE = !(isPreview && !PREVIEW.currencyToggle);

export const CONTACT = IS_VENTURES
  ? { whatsapp: ACTIVE_WHATSAPP, phone: VENTURES.phoneDisplay, phoneHref: `+${VENTURES.whatsappNumber}`, email: VENTURES.email, hours: '', city: 'Accra, Ghana' }
  : { whatsapp: ACTIVE_WHATSAPP, phone: PHONE_DISPLAY, phoneHref: `+${WHATSAPP_NUMBER}`, email: EMAIL, hours: 'Mon – Sat · 7:00 – 19:00', city: 'Accra, Ghana' };

// Social links for whichever site is running.
export const ACTIVE_SOCIAL = IS_VENTURES ? VENTURES.social : SOCIAL;

// Indicative prices are stored in Ghana cedis; other currencies are converted with these rates.
export const CURRENCIES = {
  GHS: { symbol: 'GH₵', rate: 1 },
  GBP: { symbol: '£', rate: 1 / 16.5 },
  USD: { symbol: '$', rate: 1 / 12.5 },
};

// Sample "from" prices in cedis. The pricing cards and the chat assistant both use these.
export const PRICES = {
  regular: 350,
  deep: 950,
  moveout: 1200,
  carpet: 400,
  airbnb: 450,
  airbnbLinen: 650,
  familyCare: 1500,
};

export const waLink = (text = '') =>
  `https://wa.me/${ACTIVE_WHATSAPP}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
