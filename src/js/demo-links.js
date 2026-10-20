/* Home-page-only customer preview (npm run build:preview).
   Only index.html is published, so every link to another page is redirected to the
   matching homepage section, or to WhatsApp for booking links. Used at build time
   (vite.config.js rewrites the HTML) and at runtime (chat assistant links). */

// Care-package anchors on family-care.html → occasion tab ids on the homepage (#tab-<id>).
const CARE_TABS = {
  'family-care': 'abroad',
  'mama-care': 'baby',
  bereavement: 'funeral',
  wedding: 'wedding',
  travel: 'travel',
  festival: 'festival',
};

/**
 * @param {string} href  link as written in the full site, e.g. "/family-care.html#mama-care"
 * @param {{ nav?: boolean }} [opts]  nav: true for menu links ("Contact" scrolls instead of opening WhatsApp)
 * @returns {null | { href: string, tab?: string, wa?: string }}  null = leave the link as it is
 */
export function demoTarget(href, { nav = false } = {}) {
  if (!href || !href.startsWith('/') || href.startsWith('//')) return null;
  const url = new URL(href, 'https://preview.local');
  const page = url.pathname.replace(/^\//, '').replace(/\.html$/, '') || 'index';
  const hash = url.hash.slice(1);

  switch (page) {
    case 'index':
      return null;
    case 'contact': {
      if (nav) return { href: '#contact' };
      const service = url.searchParams.get('service');
      return {
        href: '#contact',
        wa: service
          ? `Hello Exquisite Cleaners, I'd like to book ${service}.`
          : "Hello Exquisite Cleaners, I'd like to book a clean.",
      };
    }
    case 'services':
    case 'airbnb':
      return { href: '#services' };
    case 'property-maintenance':
      return { href: '#maintenance' };
    case 'about':
      return { href: '#why' };
    case 'family-care':
      return { href: '#care', tab: CARE_TABS[hash] || 'abroad' };
    default:
      return { href: '#main' };
  }
}
