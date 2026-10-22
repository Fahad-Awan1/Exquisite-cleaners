// Images for the Exquisite Ventures page (ventures.html): ventures-src/ → public/images/ventures/.
// Run with: npm run images:ventures
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const RAW = 'ventures-src/raw';
const OUT = 'public/images/ventures';
const NAVY = '#0b1a33';
const WIDTHS = [480, 960, 1600];
fs.mkdirSync(OUT, { recursive: true });

// Responsive WebP set (name-480/960/1600.webp), same naming as the cleaners images so <x-img> works.
async function photo(src, name) {
  for (const w of WIDTHS) {
    // No .rotate(): several WhatsApp photos carry a wrong EXIF rotation tag but are already upright.
    await sharp(src).resize({ width: w, withoutEnlargement: true })
      .webp({ quality: w > 1000 ? 72 : 76 })
      .toFile(path.join(OUT, `${name}-${w}.webp`));
  }
  console.log('✓', name);
}

// Hero, about and service photos
await photo('ventures-src/hero.jpg', 'hero');
await photo(`${RAW}/IMG-20171014-WA0024.jpeg`, 'about');
await photo(`${RAW}/wine-2373500_960_720.jpg`, 'import');
await photo(`${RAW}/decoration-2697945_960_720.jpg`, 'organise');
await photo(`${RAW}/events-2609526_960_720.jpg`, 'manage');

// Products (shot on white)
const products = ['I-promise.-10.png', 'I-promise.-2.png', 'I-promise.-4.png', 'I-promise.-7.png', 'I-promise.-8.png', 'fw-1.png', 'fw-2.png', 'fw.png'];
for (const [i, f] of products.entries()) await photo(`${RAW}/${f}`, `product-${i + 1}`);

// Event gallery: their own event photos plus the stock event photos used on the old site
const gallery = [
  'IMG-20171014-WA0024.jpeg', 'events-2609526_960_720.jpg', 'IMG-20171014-WA0026.jpeg', 'decoration-2697945_960_720.jpg',
  'IMG-20171020-WA0004.jpg', 'wine-905098_960_720.jpg', 'IMG-20171014-WA0042.jpeg', 'christening-1499314_960_720.jpg',
  'IMG-20171222-WA0010.jpg', 'dinner-1284245_960_720.jpg', 'IMG-20170826-WA0002-e1521202558137.jpeg', 'events-2609303_960_720.jpg',
  'IMG-20170826-WA0017-e1521202801490.jpeg', 'eat-805942_960_720.jpg', 'chile-1053658_960_720.jpg', 'events-2609305_960_720.jpg',
  'wine-2373500_960_720.jpg', 'IMG-20170826-WA0022-e1521202753905.jpeg',
];
for (const [i, f] of gallery.entries()) await photo(`${RAW}/${f}`, `gallery-${String(i + 1).padStart(2, '0')}`);

// Partner logos, on white tiles of equal size so the marquee stays even
const partners = {
  zidela: 'Capturez-f34ec05e2a482301b326f8838a09b4b9.png',
  carmien: 'Carmien-logo-5d3abe1cd1ad8876b8a59cd30edec0bd.png',
  'clos-malverne': 'ClosMalverneStlbschLlogo-9f5b001931b4d03b637fd17b11199a91.gif',
  kegau: 'a1448f58-2f87-4a50-8918-d618afdb0354-ca78cf7dec51a36f12cc04694d47c820.jpg',
  'safer-solution': 'safer-solution.png', // supplied by the client
};
for (const [name, f] of Object.entries(partners)) {
  if (!fs.existsSync(`${RAW}/${f}`)) { console.warn(`! partner logo missing: ${RAW}/${f}`); continue; }
  // Logos supplied with a wide white margin are trimmed first so they fill the tile like the others.
  const src = await sharp(`${RAW}/${f}`, { animated: false }).flatten({ background: '#ffffff' }).trim({ background: '#ffffff', threshold: 12 }).toBuffer();
  const logo = await sharp(src).resize({ width: 300, height: 170, fit: 'inside' }).toBuffer();
  await sharp({ create: { width: 360, height: 220, channels: 4, background: '#ffffff' } })
    .composite([{ input: logo, gravity: 'center' }])
    .webp({ quality: 88 })
    .toFile(path.join(OUT, `partner-${name}.webp`));
  console.log('✓ partner', name);
}

// Logo (ventures-src/logo-ev.png, 1536x1024, navy background): the EV emblem cut out as a square for the
// round emblem / 3D coin face and favicons, the full lockup for the footer and the social preview image.
const LOGO = 'ventures-src/logo-ev.png';
const BG = { r: 1, g: 12, b: 29 }; // the logo's own background colour just below the emblem
// Square centred on the emblem (x 492-1059, y 113-575) with room to spare, so a round crop never clips it.
// The wordmark underneath is faded out into the background.
// fade(size, from): covers everything below logo row 560 (where the emblem ends) in the background colour.
const fade = (size, top) => {
  const y = 560 - top, c = `rgb(${BG.r},${BG.g},${BG.b})`;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset="${30 / (size - y)}" stop-color="${c}"/></linearGradient></defs><rect y="${y}" width="${size}" height="${size - y}" fill="url(#f)"/></svg>`);
};
const SQ = 700, SQ_LEFT = 425, SQ_TOP = 0;
const emblem = await sharp(LOGO).extract({ left: SQ_LEFT, top: SQ_TOP, width: SQ, height: SQ }).composite([{ input: fade(SQ, SQ_TOP) }]).png().toBuffer();
for (const size of [256, 512]) {
  await sharp(emblem).resize(size).webp({ quality: 88 }).toFile(path.join(OUT, `emblem-${size}.webp`));
}
await sharp(LOGO).resize({ width: 600 }).webp({ quality: 86 }).toFile(path.join(OUT, 'logo-full.webp'));
// Favicons: a tighter crop so the monogram stays readable at 48px.
const tight = await sharp(LOGO).extract({ left: 476, top: 40, width: 600, height: 600 }).composite([{ input: fade(600, 40) }]).png().toBuffer();
await sharp(tight).resize(48).png().toFile(path.join(OUT, 'favicon.png'));
await sharp(tight).resize(180).png().toFile(path.join(OUT, 'apple-touch-icon.png'));
// Social preview: the full logo at 630px tall, widened to 1200 by repeating its edge pixels (no visible seam).
const og = await sharp(LOGO).resize({ height: 630 }).toBuffer();
await sharp(og).extend({ left: 128, right: 127, extendWith: 'copy' }).jpeg({ quality: 82 }).toFile(path.join(OUT, 'og-image.jpg'));
console.log('✓ logo assets');
