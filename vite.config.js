import { defineConfig } from 'vite';
import { resolve, basename } from 'node:path';
import { readFileSync } from 'node:fs';

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

function partials() {
  return {
    name: 'ec-partials',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const page = basename(ctx.filename, '.html');
        const header = partial('header').replaceAll(`data-nav="${page}"`, `data-nav="${page}" aria-current="page"`);
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

export default defineConfig({
  plugins: [partials()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 700,
    cssCodeSplit: true,
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p, resolve(import.meta.dirname, `${p}.html`)])),
    },
  },
});
