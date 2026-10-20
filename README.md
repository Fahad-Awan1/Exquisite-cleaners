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

- `src/js/config.js`: WhatsApp number, phone, email, opening hours, exchange rates.
- Prices: `data-price="…"` values (in cedis) in `index.html`, `services.html`, `airbnb.html`, `family-care.html`, and the matching numbers in `src/js/modules/chatbot.js` (prices intent).
- Domain: `https://exquisitecleaners.com` in the page `<link rel="canonical">` tags, `index.html` JSON-LD, `public/robots.txt` and `public/sitemap.xml`.
- Social links in `src/partials/footer.html`.
- Photos: drop new `.jpg` files into `assets-src/` (same names to replace) and run `npm run images`.

## Structure

- `*.html`: pages. `<!-- @include … -->` and `<x-img name="…">` are expanded at build time by the plugin in `vite.config.js` (shared head/header/footer, responsive WebP `srcset`).
- `src/partials/`: shared head, header (nav, mobile drawer, preloader, page wipe) and footer (CTA, chatbot, mobile action bar).
- `src/css/main.css`: design system and all component styles.
- `src/js/modules/`: `animations` (scroll effects), `transitions` (preloader + page wipe), `nav`, `interactions` (tilt, cursor, finder, flip cards, booking form), `currency`, `chatbot`, `hero3d` (Three.js, home only, lazy-loaded), `globe` (canvas).
