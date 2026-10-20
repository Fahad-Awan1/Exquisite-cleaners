import { defineConfig } from 'vite';
import { resolve, basename } from 'node:path';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';

const pages = ['index', 'services', 'family-care', 'airbnb', 'property-maintenance', 'about', 'contact'];

const partial = (name) => readFileSync(resolve(import.meta.dirname, `src/partials/${name}.html`), 'utf8');

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

function partials(demo) {
  return {
    name: 'ec-partials',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const page = basename(ctx.filename, '.html');
        const header = partial('header').replaceAll(`data-nav="${page}"`, `data-nav="${page}" aria-current="page"`);
        if (demo) {
          // Customer preview: mark the page, and keep it out of search engines.
          html = html
            .replace('<html lang="en">', '<html lang="en" data-demo>')
            .replace('<!-- @include head -->', '<meta name="robots" content="noindex, nofollow">\n    <!-- @include head -->');
        }
        return expandImages(
          html
            .replace('<!-- @include head -->', partial('head'))
            .replace('<!-- @include header -->', header)
            .replace('<!-- @include footer -->', partial('footer'))
        );
      },
    },
  };
}

// `npm run build:preview` (mode "demo") builds only the home page into preview-dist/,
// for showing the design to a customer without exposing the other pages.
export default defineConfig(({ mode }) => {
  const demo = mode === 'demo';
  // The preview hides from search engines and doesn't list the other pages.
  const demoCleanup = {
    name: 'ec-demo-cleanup',
    closeBundle() {
      const out = resolve(import.meta.dirname, 'preview-dist');
      rmSync(resolve(out, 'sitemap.xml'), { force: true });
      writeFileSync(resolve(out, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
    },
  };
  return {
  plugins: demo ? [partials(demo), demoCleanup] : [partials(demo)],
  build: {
    outDir: demo ? 'preview-dist' : 'dist',
    target: 'es2020',
    chunkSizeWarningLimit: 700,
    cssCodeSplit: true,
    rollupOptions: {
      input: Object.fromEntries((demo ? ['index'] : pages).map((p) => [p, resolve(import.meta.dirname, `${p}.html`)])),
    },
  },
  };
});
