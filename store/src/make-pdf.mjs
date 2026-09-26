// Makes the finished, print-ready A4 PDF for one order.
//   npm run make-pdf -- order.json [out.pdf]
// order.json holds the fields from the order form:
//   { "magazine": "birthday-magazine", "design": "retro", "palette": "coral",
//     "answers": { "name": "Mia", ... }, "photos": { "photo1": "path or https URL", ... } }
// "answers" may also be the JSON string exactly as Netlify Forms stores it.
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { chromium } from 'playwright-core';
import { renderFullMagazine } from './covers.js';

const [orderPath, outArg] = process.argv.slice(2);
if (!orderPath) { console.error('Usage: npm run make-pdf -- order.json [out.pdf]'); process.exit(1); }

const root = new URL('..', import.meta.url);
const mags = JSON.parse(await readFile(new URL('data/magazines.json', root)));
const order = JSON.parse(await readFile(orderPath, 'utf8'));
const mag = mags.find(m => m.slug === order.magazine);
if (!mag) { console.error(`Unknown magazine "${order.magazine}"`); process.exit(1); }
const answers = typeof order.answers === 'string' ? JSON.parse(order.answers) : order.answers || {};

// Photos are embedded so the PDF is self contained.
const mime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
async function embed(src) {
  if (/^https?:/.test(src)) {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`Could not download ${src}: ${res.status}`);
    return `data:${res.headers.get('content-type') || 'image/jpeg'};base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`;
  }
  const file = resolve(orderPath, '..', src);
  return `data:${mime[extname(file).toLowerCase()] || 'image/jpeg'};base64,${(await readFile(file)).toString('base64')}`;
}
const photos = {};
for (const [k, src] of Object.entries(order.photos || {})) if (src) photos[k] = await embed(src);

const example = mag.examples.find(e => e.palette === order.palette) || mag.examples[0];
const pages = renderFullMagazine(mag, answers, { palette: order.palette || example.palette, portraitOpts: example.portrait, photos, design: order.design || 'signature' });
const css = await readFile(new URL('assets/covers.css', root), 'utf8');
const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="assets/fonts.css"><style>${css}
  @page { size: A4; margin: 0; }
  html, body { margin: 0; }
  .sheet { width: 210mm; height: 297mm; overflow: hidden; break-after: page; }
  .sheet > * { width: 210mm; height: 297mm; aspect-ratio: auto; }
</style></head><body>${pages.map(p => `<div class="sheet">${p}</div>`).join('')}</body></html>`;

const tmp = new URL('.pdf-render.html', root);
await writeFile(tmp, html);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage();
await page.goto(tmp.href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const who = (answers.name || answers.names || answers.forWho || 'magazine').replace(/[^\w-]+/g, '-');
const out = outArg || `${mag.slug}-${who}.pdf`;
await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
await browser.close();
await unlink(tmp);
console.log(`Made ${out} (${pages.length} pages)`);
