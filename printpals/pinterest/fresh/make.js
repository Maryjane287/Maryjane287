// Fresh style B pins from chosen pages: the page big on a bold colour, a hook card underneath. Saved as public/pins/b-<key>.jpg.
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const pub = path.resolve(__dirname, '../pp-branch/printpals/public'), src = path.resolve(__dirname, 'src');
const logo = fs.readFileSync(pub + '/img/logo.svg', 'utf8'); const jobs = require('./jobs.json');
const css = `@font-face{font-family:B;src:url(file://${pub}/fonts/baloo2.woff2)}@font-face{font-family:N;src:url(file://${pub}/fonts/nunito.woff2)}
*{box-sizing:border-box}body{margin:0;width:1000px;height:1500px;font-family:N;position:relative;overflow:hidden}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.28) 3px,transparent 3.5px);background-size:44px 44px}
.brand{position:absolute;top:44px;left:50px;display:flex;align-items:center;gap:14px;background:#fff;border-radius:99px;padding:10px 26px 10px 14px;font:800 34px B;color:#2d2350;box-shadow:0 10px 24px rgba(0,0,0,.12)}.brand svg{width:50px;height:50px}.brand b{color:#ff6b6b}
.tag{position:absolute;top:52px;right:50px;background:#2d2350;color:#fff;font:800 26px N;padding:12px 24px;border-radius:99px;letter-spacing:1px}
.sheet{position:absolute;left:50%;top:150px;width:640px;transform:translateX(-50%) rotate(-2deg);background:#fff;border-radius:16px;box-shadow:0 34px 70px rgba(0,0,0,.28)}
.sheet img{display:block;width:100%;border-radius:16px}
.card{position:absolute;left:44px;right:44px;bottom:44px;background:#fff;border-radius:44px;padding:40px 46px 38px;box-shadow:0 20px 50px rgba(0,0,0,.18);text-align:center}
.hook{font:800 30px N;letter-spacing:2px;text-transform:uppercase}
h1{margin:10px 0 12px;font:800 76px/1 B;color:#2d2350;letter-spacing:-1px}
.sub{font:700 30px/1.3 N;color:#5d5578}.url{margin-top:16px;font:800 26px N;color:#8a82a6}`;
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  for (const j of jobs) {
    const html = `<html><head><style>${css}</style></head><body style="background:linear-gradient(160deg,${j.c},${j.c}dd)"><div class="dots"></div>
<div class="brand">${logo}<span>Print<b>Pals</b></span></div><div class="tag">✨ 7 DAYS FREE</div>
<div class="sheet"><img src="file://${src}/${j.id}-p${j.p}.png"></div>
<div class="card"><div class="hook" style="color:${j.c}">${j.hook}</div><h1 style="font-size:${j.head.length > 22 ? 62 : 74}px">${j.head}</h1><div class="sub">${j.sub}</div><div class="url">printpals.web.app</div></div></body></html>`;
    fs.writeFileSync(path.join(__dirname, 'tmp.html'), html);
    await p.goto('file://' + path.join(__dirname, 'tmp.html')); await p.evaluate(() => document.fonts.ready);
    await p.evaluate(() => { const s = document.querySelector('.sheet'), c = document.querySelector('.card'); const room = c.getBoundingClientRect().top - 150 - 30; const img = s.querySelector('img'); const r = img.naturalWidth / img.naturalHeight, w = Math.min(r > 1 ? 900 : 700, room * r); s.style.width = w + 'px'; s.style.top = (150 + Math.max(0, (room - w / r) / 2)) + 'px'; });
    await p.waitForTimeout(120); await p.screenshot({ path: `${pub}/pins/b-${j.key}.jpg`, type: 'jpeg', quality: 84 });
  }
  // contact sheet of the results
  let h = '<body style="margin:0;display:flex;flex-wrap:wrap;width:1800px">' + jobs.map(j => `<img src="file://${pub}/pins/b-${j.key}.jpg" style="width:300px">`).join('') + '</body>';
  fs.writeFileSync(path.join(__dirname, 'tmp.html'), h); await p.setViewportSize({ width: 1800, height: 900 }); await p.goto('file://' + path.join(__dirname, 'tmp.html')); await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(__dirname, 'made.png'), fullPage: true }); await b.close(); })();
