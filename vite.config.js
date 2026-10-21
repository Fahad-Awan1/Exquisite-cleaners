import { defineConfig } from 'vite';
import { resolve, basename } from 'node:path';
import { readFileSync, writeFileSync, rmSync, renameSync, readdirSync } from 'node:fs';
import { SITE_URL, PREVIEW } from './src/js/config.js';
import { demoTarget } from './src/js/demo-links.js';

const pages = ['index', 'services', 'family-care', 'airbnb', 'property-maintenance', 'about', 'contact'];

const partial = (name) => readFileSync(resolve(import.meta.dirname, `src/partials/${name}.html`), 'utf8');
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

// Responsive <x-img name="living" alt="…" sizes="…" class="…" loading="eager"> → <img srcset> of the WebP set in public/images.
function expandImages(html) {
  return html.replace(/<x-img\s([^>]*?)\s*(?:\/>|><\/x-img>)/g, (_, attrs) => {
    const get = (k) => (attrs.match(new RegExp(`${k}="([^"]*)"`)) || [])[1];
    const name = get('name');
    const sizes = get('sizes') || '100vw';
    const eager = get('loading') === 'eager';
    const cls = get('class');
    return `<img src="/images/${name}-960.webp" srcset="/images/${name}-480.webp 480w, /images/${name}-960.webp 960w, /images/${name}-1600.webp 1600w" sizes="${sizes}" alt="${get('alt') || ''}"${cls ? ` class="${cls}"` : ''} width="1600" height="1067" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  });
}

/* Customer preview only: rewrite every link to a page that isn't published.
   - data-demo-wa="message" (+ optional data-demo-label) → WhatsApp with that message
   - booking links (/contact.html?service=…) → WhatsApp naming the service
   - everything else → the matching homepage section (+ data-tab to open a care-package tab)
   WhatsApp links keep a real fallback href (#contact) and get the number at runtime from config.js. */
function rewriteDemoLinks(html) {
  return html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/g, (whole, attrs, inner) => {
    const get = (k) => (attrs.match(new RegExp(`\\s${k}="([^"]*)"`)) || [])[1];
    const strip = (a, k) => a.replace(new RegExp(`\\s${k}="[^"]*"`), '');
    const demoWa = get('data-demo-wa');
    const label = get('data-demo-label');
    let next = strip(strip(attrs, 'data-demo-wa'), 'data-demo-label');
    if (demoWa) {
      next = strip(next, 'href') + ` href="#contact" data-wa="${attr(demoWa)}" target="_blank" rel="noopener"`;
      return `<a${next}>${label || inner}</a>`;
    }
    const t = demoTarget(get('href'), { nav: /\sdata-nav="/.test(attrs) });
    if (!t) return whole;
    next = strip(next, 'href') + ` href="${t.href}"`;
    if (t.wa) next += ` data-wa="${attr(t.wa)}" target="_blank" rel="noopener"`;
    if (t.tab) next += ` data-tab="${t.tab}"`;
    return `<a${next}>${inner}</a>`;
  });
}

/* Customer preview with PREVIEW.currencyToggle = false: drop the GH₵/£/$ switches and reword
   the copy that talks about pounds and dollars, so the page only speaks in cedis. */
const GHS_ONLY_COPY = [
  ['Pay in the currency <em>you live in.</em>', 'Clear prices, <em>no surprises.</em>'],
  ['usually the same day, in cedis, pounds or dollars.', 'usually the same day.'],
  [' Pounds and dollars are approximate conversions.', ''],
  ['Prices on the site can be shown in cedis, pounds or dollars. ', 'Prices on the site are shown in Ghana cedis (GH₵). '],
];
function cedisOnly(html) {
  html = html.replace(/<div data-currency-switch[^>]*>[\s\S]*?<\/div>/g, '');
  for (const [from, to] of GHS_ONLY_COPY) {
    if (!html.includes(from)) console.warn(`[preview] currency copy not found, check GHS_ONLY_COPY: "${from}"`);
    html = html.replace(from, to);
  }
  return html;
}

function partials(demo) {
  return {
    name: 'ec-partials',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const page = basename(ctx.filename, '.html');
        const header = partial('header').replaceAll(`data-nav="${page}"`, `data-nav="${page}" aria-current="page"`);
        let head = partial('head');
        // The Exquisite Ventures page shares head/scripts/styles but has its own icons and partials
        // (<!-- @include ventures-header --> etc.).
        if (page === 'ventures') {
          head = head
            .replace('href="/favicon.png"', 'href="/images/ventures/favicon.png"')
            .replace('href="/apple-touch-icon.png"', 'href="/images/ventures/apple-touch-icon.png"')
            .replace('content="/images/og-image.jpg"', 'content="/images/ventures/og-image.jpg"')
            .replace('<meta property="og:site_name" content="Exquisite Cleaners">', '<meta property="og:site_name" content="Exquisite Ventures">');
          html = html.replace(/<!-- @include (ventures-[\w-]+) -->/g, (_, name) => partial(name));
        }
        if (demo) {
          // Customer preview: mark the page, and keep it out of search engines.
          html = html.replace('<html lang="en">', '<html lang="en" data-demo>');
          head = '<meta name="robots" content="noindex, nofollow">\n    ' + head;
        } else if (SITE_URL) {
          head = `<link rel="canonical" href="${SITE_URL}/${page === 'index' ? '' : page + '.html'}">\n    ` + head;
        }
        html = expandImages(
          html
            .replace('<!-- @include head -->', head)
            .replace('<!-- @include header -->', header)
            .replace('<!-- @include footer -->', partial('footer'))
        );
        if (!demo) return html.replace(/\sdata-demo-(wa|label)="[^"]*"/g, '');
        html = rewriteDemoLinks(html);
        return PREVIEW.currencyToggle ? html : cedisOnly(html);
      },
    },
  };
}

// robots.txt for every build; the sitemap only once the real domain is set in config.js.
function seoFiles(demo, outDir) {
  return {
    name: 'ec-seo-files',
    closeBundle() {
      const out = resolve(import.meta.dirname, outDir);
      rmSync(resolve(out, 'sitemap.xml'), { force: true });
      // The cleaners builds don't use the Exquisite Ventures images that live in public/.
      if (!outDir.startsWith('ventures')) rmSync(resolve(out, 'images/ventures'), { recursive: true, force: true });
      if (demo) {
        writeFileSync(resolve(out, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
        return;
      }
      let robots = 'User-agent: *\nAllow: /\n';
      if (SITE_URL) {
        const urls = pages.map((p) => `  <url><loc>${SITE_URL}/${p === 'index' ? '' : p + '.html'}</loc></url>`).join('\n');
        writeFileSync(resolve(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
        robots += `Sitemap: ${SITE_URL}/sitemap.xml\n`;
      }
      writeFileSync(resolve(out, 'robots.txt'), robots);
    },
  };
}

/* `npm run build:ventures` (mode "ventures"): the Exquisite Ventures one-page site, built from
   ventures.html into ventures-dist/index.html. Only the images it actually uses are kept. */
function venturesOutput(outDir) {
  return {
    name: 'ec-ventures-output',
    closeBundle() {
      const out = resolve(import.meta.dirname, outDir);
      renameSync(resolve(out, 'ventures.html'), resolve(out, 'index.html'));
      const used = new Set();
      const scan = (file) => {
        for (const m of readFileSync(file, 'utf8').matchAll(/\/images\/[\w\/.-]+\.(?:webp|png|jpe?g|svg)/g)) used.add(m[0]);
      };
      scan(resolve(out, 'index.html'));
      for (const f of readdirSync(resolve(out, 'assets'))) if (/\.(js|css)$/.test(f)) scan(resolve(out, 'assets', f));
      const walk = (dir, rel) => {
        for (const e of readdirSync(dir, { withFileTypes: true })) {
          const p = resolve(dir, e.name);
          if (e.isDirectory()) walk(p, `${rel}/${e.name}`);
          else if (!used.has(`${rel}/${e.name}`)) rmSync(p);
        }
      };
      walk(resolve(out, 'images'), '/images');
      for (const f of ['favicon.png', 'apple-touch-icon.png']) rmSync(resolve(out, f), { force: true });
      console.log(`[ventures] kept ${used.size} images`);
    },
  };
}

// `npm run build:preview` (mode "demo") builds only the home page into preview-dist/,
// for showing the design to a customer without exposing the other pages.
export default defineConfig(({ mode }) => {
  const demo = mode === 'demo';
  const ventures = mode === 'ventures';
  const outDir = demo ? 'preview-dist' : ventures ? 'ventures-dist' : 'dist';
  const input = ventures ? ['ventures'] : demo ? ['index'] : pages;
  return {
    plugins: [partials(demo), seoFiles(demo, outDir), ...(ventures ? [venturesOutput(outDir)] : [])],
    build: {
      outDir,
      target: 'es2020',
      chunkSizeWarningLimit: 700,
      cssCodeSplit: true,
      rollupOptions: {
        input: Object.fromEntries(input.map((p) => [p, resolve(import.meta.dirname, `${p}.html`)])),
      },
    },
  };
});
