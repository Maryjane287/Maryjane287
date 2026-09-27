// Style B pins: the worksheet big on a bold colour, with a hook headline underneath. Saved as pins/b-<id>.jpg.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const tools = require('./tools.json');
const jobs = require('./jobsB.json');
const byId = Object.fromEntries(tools.map((t) => [t.id, t]));
const pub = path.resolve(__dirname, '../../pp-branch/printpals/public');
const logo = fs.readFileSync(pub + '/img/logo.svg', 'utf8');
const src = path.resolve(__dirname, 'src');
const bold = { '#fff0f0': '#ff6b6b', '#fff6e0': '#ffb938', '#e8f8f4': '#3fbfa8', '#eef2ff': '#6c8cff', '#f5edff': '#b06cff', '#fff0f5': '#ff7eb6', '#e6f6fc': '#3fb0e0', '#f1f8e6': '#7cc04a' };
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
.sub{font:700 30px/1.3 N;color:#5d5578}
.url{margin-top:16px;font:800 26px N;color:#8a82a6}`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  for (const j of jobs) {
    const t = byId[j.id], hook = j.hook, head = j.head, sub = j.sub, c = bold[t.tint] || '#ff6b6b';
    const img = `${src}/${t.id}-${j.img}.png`;
    const html = `<html><head><style>${css}</style></head><body style="background:linear-gradient(160deg,${c},${c}dd)"><div class="dots"></div>
<div class="brand">${logo}<span>Print<b>Pals</b></span></div><div class="tag">${t.plus ? '✨ 7 DAYS FREE' : 'FREE'}</div>
<div class="sheet"><img src="file://${img}"></div>
<div class="card"><div class="hook" style="color:${c}">${hook}</div><h1 style="font-size:${head.length > 26 ? 64 : 76}px">${head}</h1><div class="sub">${sub}</div><div class="url">printpals.web.app · ${t.ages}</div></div></body></html>`;
    fs.writeFileSync(path.join(__dirname, 'tmpb.html'), html);
    await p.goto('file://' + path.join(__dirname, 'tmpb.html')); await p.evaluate(() => document.fonts.ready);
    // Keep the sheet clear of the text card.
    await p.evaluate(() => { const s = document.querySelector('.sheet'), c = document.querySelector('.card'); const room = c.getBoundingClientRect().top - 150 - 30; const img = s.querySelector('img'); const r = img.naturalWidth / img.naturalHeight; const w = Math.min(700, room * r); s.style.width = w + 'px'; });
    await p.waitForTimeout(100);
    await p.screenshot({ path: `${pub}/pins/b-${j.key}.jpg`, type: 'jpeg', quality: 84 });
  }
  await b.close();
})();
