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
  sezabe: 'Drawing6-1-150f4ed3a5ed7e38adbf9b24bf86c86e.png',
  kegau: 'a1448f58-2f87-4a50-8918-d618afdb0354-ca78cf7dec51a36f12cc04694d47c820.jpg',
  'cedarberg-aqua': 'cedarberg-aqua-a01eb85ff2b9bdabdd07b0a2e9b7bf02.png',
};
for (const [name, f] of Object.entries(partners)) {
  const logo = await sharp(`${RAW}/${f}`, { animated: false }).resize({ width: 300, height: 170, fit: 'inside' }).toBuffer();
  await sharp({ create: { width: 360, height: 220, channels: 4, background: '#ffffff' } })
    .composite([{ input: logo, gravity: 'center' }])
    .webp({ quality: 88 })
    .toFile(path.join(OUT, `partner-${name}.webp`));
  console.log('✓ partner', name);
}

// Logo: the gold EV emblem on navy for the round emblem / 3D coin face, the full lockup for the footer,
// favicons and the social preview image.
const emblemSrc = `${RAW}/fav.png`;
for (const size of [256, 512]) {
  const mark = await sharp(emblemSrc).resize(Math.round(size * 0.8)).toBuffer();
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><defs><radialGradient id="g" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#1c3566"/><stop offset="1" stop-color="${NAVY}"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`);
  await sharp(bg).composite([{ input: mark, gravity: 'center' }]).webp({ quality: 88 }).toFile(path.join(OUT, `emblem-${size}.webp`));
}
await sharp(`${RAW}/logo-transnew.png`).resize({ width: 600 }).webp({ quality: 86 }).toFile(path.join(OUT, 'logo-full.webp'));
const fav = async (size, file) => {
  const mark = await sharp(emblemSrc).resize(Math.round(size * 0.86)).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: NAVY } }).composite([{ input: mark, gravity: 'center' }]).png().toFile(path.join(OUT, file));
};
await fav(48, 'favicon.png');
await fav(180, 'apple-touch-icon.png');
const ogMark = await sharp(`${RAW}/logo-transnew.png`).resize({ height: 520 }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: NAVY } }).composite([{ input: ogMark, gravity: 'center' }]).jpeg({ quality: 82 }).toFile(path.join(OUT, 'og-image.jpg'));
console.log('✓ logo assets');
