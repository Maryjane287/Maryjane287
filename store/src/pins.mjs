// Renders a 1000 x 1500 Pinterest image (JPEG) for every example cover into pins/.
// Run with `npm run pins` after changing covers or examples. The images are
// committed, so the site build itself needs no browser.
import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import { renderCover, PALETTES, esc } from './covers.js';

const root = new URL('..', import.meta.url);
const mags = JSON.parse(await readFile(new URL('data/magazines.json', root)));
const site = JSON.parse(await readFile(new URL('data/site.json', root)));
const coversCss = await readFile(new URL('assets/covers.css', root), 'utf8');

const executablePath = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 1000, height: 1500 } });
await mkdir(new URL('pins/', root), { recursive: true });
const tmp = new URL('.pin-render.html', root);

const pinHtml = (mag, ex) => {
  const p = PALETTES[ex.palette];
  const cover = renderCover(mag, ex.values, { palette: ex.palette, portraitOpts: ex.portrait });
  const back = ex.palette === 'paper' ? '#8b1e1e' : p.bg;
  const light = ['rose', 'butter', 'mint', 'sky'].includes(ex.palette);
  const size = mag.pinTitle.length > 30 ? 60 : 68;
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="assets/fonts.css">
  <style>${coversCss}
    html,body{margin:0;width:1000px;height:1500px;overflow:hidden}
    body{background:radial-gradient(circle at 20% 15%, color-mix(in srgb, ${back} 70%, #fff) 0, ${back} 55%, color-mix(in srgb, ${back} 80%, #000) 100%);font-family:Outfit,sans-serif;position:relative}
    .top{position:absolute;top:56px;left:0;right:0;text-align:center;color:${light ? p.ink : '#fff'};font:800 30px/1 Outfit;letter-spacing:.2em;text-transform:uppercase;text-shadow:${light ? 'none' : '0 2px 12px rgba(0,0,0,.25)'}}
    .top b{display:block;font:400 ${size}px/1 'DM Serif Display',serif;letter-spacing:0;text-transform:none;margin-top:14px}
    .wrap{position:absolute;left:170px;top:250px;width:660px;transform:rotate(-3deg);box-shadow:0 40px 80px rgba(0,0,0,.35),0 8px 18px rgba(0,0,0,.2);border-radius:6px;overflow:hidden}
    .band{position:absolute;left:60px;right:60px;bottom:56px;background:#fff;color:#1d1a2f;border-radius:28px;padding:26px 30px;text-align:center;font:700 30px/1.25 Outfit}
    .band span{display:block;font:800 22px/1 Outfit;letter-spacing:.18em;text-transform:uppercase;color:#ff6b5b;margin-top:10px}
    .spark{position:absolute;color:${light ? p.pop : '#fff'};font-size:60px;opacity:.9}
  </style></head><body>
    <div class="top">Made in 5 minutes<b>${esc(mag.pinTitle)}</b></div>
    <span class="spark" style="left:90px;top:330px">&#10022;</span><span class="spark" style="right:90px;top:900px;font-size:44px">&#10022;</span>
    <div class="wrap">${cover}</div>
    <div class="band">Answer a few fun questions, add photos. Instant PDF or printed and posted worldwide.<span>${esc(site.name)}</span></div>
  </body></html>`;
};

for (const mag of mags) {
  for (const ex of mag.examples) {
    await writeFile(tmp, pinHtml(mag, ex));
    await page.goto(tmp.href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const file = new URL(`pins/${mag.slug}-${ex.id}.jpg`, root);
    await writeFile(file, await page.screenshot({ type: 'jpeg', quality: 86 }));
    console.log('pin', mag.slug, ex.id);
  }
}
await browser.close();
await unlink(tmp);
