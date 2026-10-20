// Business details used across the site. Replace the placeholders before launch.
export const CONTACT = {
  whatsapp: '17133645155', // international format, no "+" or spaces
  phone: '+1 713-364-5155',
  phoneHref: '+17133645155',
  email: 'fahadriazcs@gmail.com',
  hours: 'Mon – Sat · 7:00 – 19:00',
  city: 'Accra, Ghana',
};

// Indicative prices are stored in Ghana cedis; other currencies are converted with these rates.
export const CURRENCIES = {
  GHS: { symbol: 'GH₵', rate: 1 },
  GBP: { symbol: '£', rate: 1 / 16.5 },
  USD: { symbol: '$', rate: 1 / 12.5 },
};

export const waLink = (text = '') =>
  `https://wa.me/${CONTACT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
