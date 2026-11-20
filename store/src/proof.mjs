// Local check only (not part of the site): writes dist/proof/<slug>.html with
// every page of one magazine, from its first example plus optional extra
// answers, so whole magazines can be read and screenshotted.
// node src/proof.mjs <slug> [json-with-extra-values] [json-with-extra-photos]
import { writeFile, mkdir } from 'node:fs/promises';
import { loadMags } from './mags.mjs';
import { renderFullMagazine } from './covers.js';

const [slug, extra = '{}', extraPhotos = '{}'] = process.argv.slice(2);
const mags = await loadMags();
const list = slug === 'all' ? mags : mags.filter(m => m.slug === slug);
await mkdir(new URL('../dist/proof/', import.meta.url), { recursive: true });
for (const mag of list) {
  const ex = mag.examples[0];
  const values = { ...ex.values, ...JSON.parse(extra) };
  const photos = { ...(ex.photos || {}), ...JSON.parse(extraPhotos) };
  const pages = renderFullMagazine(mag, values, { palette: ex.palette, portraitOpts: ex.portrait, photos });
  const html = `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="/assets/fonts.css"><link rel="stylesheet" href="/assets/covers.css"><link rel="stylesheet" href="/assets/style.css">
<style>body{background:#eee;margin:0}.grid{display:flex;flex-wrap:wrap;gap:16px;padding:16px}.grid>div{width:380px}</style>
<div class="grid">${pages.map((p, i) => `<div data-n="${i + 1}"><div class="flip-page">${p}</div></div>`).join('')}</div>`;
  await writeFile(new URL(`../dist/proof/${mag.slug}.html`, import.meta.url), html);
}
console.log('proofs', list.length);
