// Renders 1000x1500 Pinterest pins for every PrintPals tool.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const tools = require('./tools.json');
const only = process.argv.slice(2);
const pub = path.resolve(__dirname, '../../pp-branch/printpals/public');
const out = path.join(pub, 'pins'); fs.mkdirSync(out, { recursive: true });
const logo = fs.readFileSync(pub + '/img/logo.svg', 'utf8');
const src = path.resolve(__dirname, 'src');
const deep = { '#fff0f0': '#ff8f8f', '#fff6e0': '#ffc44d', '#e8f8f4': '#57cdb4', '#eef2ff': '#8ea6ff', '#f5edff': '#bb86ff', '#fff0f5': '#ff8fc0', '#e6f6fc': '#5cc6ea', '#f1f8e6': '#9fd46a' };
const css = `@font-face{font-family:B;src:url(file://${pub}/fonts/baloo2.woff2)}@font-face{font-family:N;src:url(file://${pub}/fonts/nunito.woff2)}
*{box-sizing:border-box}body{margin:0;width:1000px;height:1500px;font-family:N;color:#2d2350;position:relative;overflow:hidden}
.blob{position:absolute;border-radius:50%}
.col{position:absolute;top:66px;left:50px;right:50px;bottom:250px;display:flex;flex-direction:column;align-items:center}
.kick{text-align:center}
.kick span{display:inline-block;font:800 30px N;letter-spacing:3px;color:#fff;padding:12px 30px;border-radius:99px;box-shadow:0 8px 20px rgba(45,35,80,.18)}
h1{margin:22px 0 0;text-align:center;font:800 96px/0.98 B;letter-spacing:-1.5px;color:#2d2350}
.sub{margin:18px 40px 0;text-align:center;font:700 36px/1.3 N;color:#5d5578}
.stage{flex:1;position:relative;width:100%;margin-top:30px}
.sheet{position:absolute;background:#fff;border-radius:14px;box-shadow:0 30px 60px rgba(45,35,80,.28),0 6px 14px rgba(45,35,80,.12)}
.sheet img{display:block;width:100%;border-radius:14px}
.foot{position:absolute;left:50px;right:50px;bottom:50px;height:170px;background:#fff;border-radius:40px;box-shadow:0 16px 40px rgba(45,35,80,.14);display:flex;align-items:center;justify-content:space-between;padding:0 44px}
.brand{display:flex;align-items:center;gap:16px;font:800 44px B}.brand svg{width:66px;height:66px}.brand b{color:#ff6b6b}
.url{font:800 26px N;color:#8a82a6;margin-top:-6px}
.chips{display:flex;flex-direction:column;gap:10px;align-items:flex-end}
.chip{font:800 26px N;background:#f4f1fb;border-radius:99px;padding:8px 22px;color:#2d2350}`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  for (const t of tools) {
    if (only.length && !only.includes(t.id)) continue;
    const accent = deep[t.tint] || '#ff8f8f';
    const kick = t.plus ? '✨ TRY 7 DAYS FREE' : 'FREE PRINTABLE';
    const kickBg = t.plus ? 'linear-gradient(135deg,#8a3fd1,#ff6b9e)' : 'linear-gradient(135deg,#ff7a6b,#ff5f9e)';
    const h = t.h1.replace(/^Personalised /, 'Personalised<br>');
    const len = t.h1.length, fs1 = len > 30 ? 80 : len > 20 ? 92 : 104;
    const s0 = `file://${src}/${t.id}-0.png`, s1 = fs.existsSync(`${src}/${t.id}-1.png`) ? `file://${src}/${t.id}-1.png` : '';
    const img0 = fs.readFileSync(`${src}/${t.id}-0.png`); const land = img0.readUInt32BE(16) > img0.readUInt32BE(20);
    const front = `<div class="sheet" id="front" style="transform:rotate(-2.5deg)"><img src="${s0}"></div>`;
    const back = s1 && !land ? `<div class="sheet" id="back" style="transform:rotate(5deg)"><img src="${s1}"></div>` : '';
    const html = `<html><head><style>${css}</style></head><body style="background:linear-gradient(180deg,${t.tint} 0%,#fffaf3 70%)">
<div class="blob" style="width:420px;height:420px;right:-150px;top:-140px;background:${accent};opacity:.35"></div>
<div class="blob" style="width:300px;height:300px;left:-130px;top:520px;background:#ffe08a;opacity:.45"></div>
<div class="blob" style="width:220px;height:220px;right:-60px;bottom:330px;background:${accent};opacity:.25"></div>
<div class="col"><div class="kick"><span style="background:${kickBg}">${kick}</span></div>
<h1 style="font-size:${fs1}px">${h}</h1>
<div class="sub">${t.card}</div>
<div class="stage" id="stage">${back}${front}</div></div>
<div class="foot"><div><div class="brand">${logo}<span>Print<b>Pals</b></span></div><div class="url">printpals.web.app</div></div>
<div class="chips"><span class="chip">${t.ages}</span><span class="chip">${t.plus ? 'Personalised with their name' : 'No sign up'}</span></div></div></body></html>`;
    fs.writeFileSync(path.join(__dirname, 'tmp.html'), html);
    await p.goto('file://' + path.join(__dirname, 'tmp.html'), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    // Size the worksheet to the space left under the words.
    await p.evaluate((land) => {
      const st = document.getElementById('stage'), H = st.clientHeight - 20, Wmax = land ? 860 : 600;
      const f = document.getElementById('front'), bk = document.getElementById('back'), img = f.querySelector('img');
      const r = img.naturalWidth / img.naturalHeight, w = Math.min(Wmax, H * r), h = w / r, cx = st.clientWidth / 2;
      const place = (el, dx, dy) => { el.style.width = w + 'px'; el.style.left = (cx - w / 2 + dx) + 'px'; el.style.top = (Math.max(0, (H - h) / 2) + dy + 8) + 'px'; };
      place(f, bk ? 45 : 0, bk ? 12 : 0); if (bk) place(bk, -70, -6);
    }, land);
    await p.waitForTimeout(120);
    await p.screenshot({ path: `${out}/${t.id}.jpg`, type: 'jpeg', quality: 84 });
  }
  await b.close();
})();
