// Converts photos in assets-src/ to responsive WebP files in public/images/.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'assets-src';
const OUT = 'public/images';
const WIDTHS = [480, 960, 1600];

fs.mkdirSync(OUT, { recursive: true });

for (const file of fs.readdirSync(SRC)) {
  if (!file.endsWith('.jpg')) continue;
  const name = path.parse(file).name;
  for (const w of WIDTHS) {
    await sharp(path.join(SRC, file))
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: w > 1000 ? 72 : 76 })
      .toFile(path.join(OUT, `${name}-${w}.webp`));
  }
  console.log('✓', name);
}

// "Before" version of the before/after photo, baked here so the browser never runs a CSS filter while animating.
{
  const src = path.join(SRC, 'lounge.jpg');
  const { width, height } = await sharp(src).metadata();
  const grime = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>${[[20, 72, 28], [70, 38, 24], [48, 88, 26], [85, 80, 20], [32, 30, 18]].map(([x, y, r], i) =>
      `<radialGradient id="g${i}" cx="${x}%" cy="${y}%" r="${r}%"><stop offset="0" stop-color="#3c2e14" stop-opacity=".55"/><stop offset="1" stop-color="#3c2e14" stop-opacity="0"/></radialGradient>`).join('')}</defs>
    ${[0, 1, 2, 3, 4].map((i) => `<rect width="100%" height="100%" fill="url(#g${i})"/>`).join('')}
  </svg>`);
  const before = await sharp(src)
    .modulate({ brightness: 0.62, saturation: 0.45 })
    .tint({ r: 150, g: 120, b: 80 })
    .linear(1.12, -10)
    .composite([{ input: grime }])
    .toBuffer();
  for (const w of WIDTHS) {
    await sharp(before).resize({ width: w }).webp({ quality: 70 }).toFile(path.join(OUT, `lounge-before-${w}.webp`));
  }
  console.log('✓ lounge-before');
}

// Logo: full lockup, emblem crop, favicons and social preview.
const logo = path.join(SRC, 'logo.png');
const meta = await sharp(logo).metadata();
console.log('logo size', meta.width, meta.height);
await sharp(logo).resize({ width: 600 }).webp({ quality: 85 }).toFile(path.join(OUT, 'logo-full.webp'));
const emblem = { left: 140, top: 58, width: 498, height: 498 };
await sharp(logo).extract(emblem).resize(512).webp({ quality: 86 }).toFile(path.join(OUT, 'emblem-512.webp'));
await sharp(logo).extract(emblem).resize(256).webp({ quality: 86 }).toFile(path.join(OUT, 'emblem-256.webp'));
await sharp(logo).extract(emblem).resize(180).png().toFile('public/apple-touch-icon.png');
await sharp(logo).extract(emblem).resize(48).png().toFile('public/favicon.png');
await sharp(logo).resize({ width: 1200, height: 630, fit: 'contain', background: '#0e1d38' }).jpeg({ quality: 82 }).toFile(path.join(OUT, 'og-image.jpg'));
console.log('✓ logo assets');
