# Exquisite Cleaners website

Multi-page static site built with Vite, GSAP (ScrollTrigger + SplitText), Lenis smooth scroll and Three.js.

## Commands

```bash
npm install
npm run dev       # local dev server
npm run build     # production build into dist/
npm run preview   # serve the production build
npm run images    # regenerate WebP images from assets-src/
```

Deploy by uploading the contents of `dist/` to any static host (Netlify, Vercel, cPanel, etc.).

## Before launch, replace

Everything below lives in `src/js/config.js`:

- `WHATSAPP_NUMBER` and `PHONE_DISPLAY`: every wa.me and tel: link on the site is built from these.
- `EMAIL`: empty hides the email everywhere; set it to show it in the footer, contact page and chat.
- `SOCIAL`: footer icons only appear for the profiles that have a URL.
- `SITE_URL`: once the client owns a domain, set it to add canonical tags, `sitemap.xml` and the sitemap line in `robots.txt`.
- `PRICES` (sample "from" prices in cedis, used by the chat) and `CURRENCIES` (exchange rates). The pricing cards use the same numbers in `data-price="…"` in `index.html`, `services.html`, `airbnb.html` and `family-care.html`.

Also: opening hours (`CONTACT.hours`), and photos (drop new `.jpg` files into `assets-src/` with the same names, then run `npm run images`).

## Customer preview (home page only)

```bash
npm run build:preview    # builds only index.html into preview-dist/
npm run deploy:preview   # builds and deploys to the Vercel project exquisite-cleaners-preview
```

Links to pages that aren't in the preview are rewritten at build time (`src/js/demo-links.js`): menu and "Explore" links scroll to the matching homepage section, and booking links open WhatsApp naming the service. The preview is marked `noindex`.

## Structure

- `*.html`: pages. `<!-- @include … -->` and `<x-img name="…">` are expanded at build time by the plugin in `vite.config.js` (shared head/header/footer, responsive WebP `srcset`).
- `src/partials/`: shared head, header (nav, mobile drawer, preloader, page wipe) and footer (CTA, chatbot, mobile action bar).
- `src/css/main.css`: design system and all component styles.
- `src/js/modules/`: `animations` (scroll effects), `transitions` (preloader + page wipe), `nav`, `interactions` (tilt, cursor, finder, flip cards, booking form), `currency`, `chatbot`, `hero3d` (Three.js, home only, lazy-loaded), `globe` (canvas).
