// Renders Cover Story social media images (profile picture and banners) with
// real example covers. Run: node scripts/social.mjs <outdir>
import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import { renderCover, designExamples, baseDesign } from '../src/covers.js';

const root = new URL('..', import.meta.url);
const out = process.argv[2] || new URL('social/', root).pathname;
await mkdir(out, { recursive: true });
const mags = JSON.parse(await readFile(new URL('data/magazines.json', root))).filter(m => !m.hidden);
const coversCss = await readFile(new URL('assets/covers.css', root), 'utf8');

const cover = slug => {
  const mag = mags.find(m => m.slug === slug);
  const design = baseDesign(mag);
  const ex = designExamples(mag, design)[0];
  const ph = ex.photos?.photo1 ? { photo1: ex.photos.photo1.replace(/^\//, '') } : {};
  return renderCover(mag, ex.values, { palette: ex.palette, portraitOpts: ex.portrait, photos: ph, design });
};
const FAN = ['mothers-day-magazine', 'birthday-magazine', 'anniversary-magazine', 'pet-magazine', 'wedding-magazine'];

const C = { ivory: '#faf6f2', blush: '#fae3e9', tint: '#f5cdd8', ink: '#161318', rose: '#b4446a', deep: '#8e2f51', gold: '#e7c9a0' };

const fan = (w, gap, lift) => FAN.map((s, i) => {
  const k = i - 2;
  return `<div class="mag" style="width:${w}px;left:calc(50% + ${k * gap}px - ${w / 2}px);top:${Math.abs(k) * lift}px;transform:rotate(${k * 5}deg);z-index:${10 - Math.abs(k)}">${cover(s)}</div>`;
}).join('');

const base = (w, h, body, extra = '') => `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="assets/fonts.css">
<style>${coversCss}
html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden}
body{position:relative;font-family:Outfit,sans-serif;color:${C.ink};
  background:radial-gradient(ellipse at 50% 0%, #fff 0, ${C.blush} 45%, ${C.tint} 100%)}
.mag{position:absolute;border-radius:6px;overflow:hidden;box-shadow:0 30px 60px rgba(90,20,50,.28),0 6px 14px rgba(90,20,50,.18)}
.word{font:400 1em/1 'DM Serif Display',serif;letter-spacing:-.01em}
.tag{font:400 italic 1em/1.1 'DM Serif Display',serif;color:${C.rose}}
.sub{font:600 1em/1.35 Outfit;color:${C.ink}}
.sub b{color:${C.rose}}
.spark{position:absolute;color:${C.rose};opacity:.55}
${extra}</style></head><body>${body}</body></html>`;

const jobs = {
  // Profile picture: shows as a small circle, so one bold, simple mark.
  'profile-picture-1080.png': [1080, 1080, base(1080, 1080, `
    <div class="ring"></div>
    <div class="m"><div class="band"><span class="word">CS</span></div><div class="strip"></div>
      <div class="lines"><i></i><i></i><i style="width:55%"></i></div><div class="heart">&#9829;</div></div>`,
    `body{background:radial-gradient(circle at 35% 25%, #d0668c 0, ${C.rose} 45%, ${C.deep} 100%)}
     .m{position:absolute;left:300px;top:215px;width:480px;height:650px;background:${C.ivory};border-radius:26px;transform:rotate(-7deg);
        box-shadow:22px 26px 0 ${C.ink},0 40px 80px rgba(0,0,0,.35);overflow:hidden}
     .band{height:300px;background:${C.deep};display:flex;align-items:center;justify-content:center}
     .band span{font-size:250px;color:${C.ivory};margin-top:20px}
     .strip{height:46px;background:${C.gold}}
     .lines{padding:46px 56px}
     .lines i{display:block;height:26px;border-radius:13px;background:${C.tint};margin-bottom:26px;width:80%}
     .heart{position:absolute;right:48px;bottom:30px;font-size:110px;color:${C.rose};line-height:1}`)],

  // Pinterest profile cover 16:9.
  'pinterest-cover-1920x1080.png': [1920, 1080, base(1920, 1080, `
    <div style="position:absolute;top:110px;left:0;right:0;text-align:center">
      <div class="word" style="font-size:168px">Cover Story</div>
      <div class="tag" style="font-size:64px;margin-top:18px">Make them the cover story</div>
    </div>
    <div style="position:absolute;left:0;right:0;top:470px;height:700px">${fan(330, 300, 34)}</div>
    <span class="spark" style="left:260px;top:180px;font-size:60px">&#10022;</span>
    <span class="spark" style="right:250px;top:330px;font-size:44px">&#10022;</span>`)],

  // YouTube banner: everything that matters sits in the centre 1546 x 423 safe area.
  'youtube-banner-2560x1440.png': [2560, 1440, base(2560, 1440, `
    <div style="position:absolute;left:507px;top:508px;width:1546px;height:423px">
      <div style="position:absolute;left:30px;top:70px;width:760px">
        <div class="word" style="font-size:130px">Cover Story</div>
        <div class="tag" style="font-size:54px;margin-top:14px">Make them the cover story</div>
        <div class="sub" style="font-size:30px;margin-top:22px">Personalised magazines <b>all about the people you love</b></div>
      </div>
      <div style="position:absolute;left:820px;width:740px;top:-20px;height:600px">${fan(230, 140, 18)}</div>
    </div>
    <span class="spark" style="left:640px;top:470px;font-size:44px">&#10022;</span>`)],

  // Facebook page cover: 1640 x 924 keeps the middle visible on phones and desktop.
  'facebook-cover-1640x924.png': [1640, 924, base(1640, 924, `
    <div style="position:absolute;left:150px;top:250px;width:640px">
      <div class="word" style="font-size:106px">Cover Story</div>
      <div class="tag" style="font-size:46px;margin-top:14px">Make them the cover story</div>
      <div class="sub" style="font-size:27px;margin-top:22px">Personalised magazines <b>all about the people you love</b>. Made in 5 minutes, loved forever.</div>
    </div>
    <div style="position:absolute;left:900px;width:680px;top:190px;height:760px">${fan(210, 120, 20)}</div>
    <span class="spark" style="left:110px;top:200px;font-size:44px">&#10022;</span>`)],
};

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
const tmp = new URL('.social-render.html', root);
for (const [name, [w, h, html]] of Object.entries(jobs)) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await writeFile(tmp, html);
  await page.goto(tmp.href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await writeFile(`${out}/${name}`, await page.screenshot({ type: 'png' }));
  await page.close();
  console.log('made', name);
}
await browser.close();
await unlink(tmp);
