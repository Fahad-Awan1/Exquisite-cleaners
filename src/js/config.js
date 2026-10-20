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

export const CONTACT = {
  whatsapp: WHATSAPP_NUMBER,
  phone: PHONE_DISPLAY,
  phoneHref: `+${WHATSAPP_NUMBER}`,
  email: EMAIL,
  hours: 'Mon – Sat · 7:00 – 19:00',
  city: 'Accra, Ghana',
};

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
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
