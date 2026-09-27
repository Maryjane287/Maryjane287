const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const pub = path.resolve(__dirname, '../../pp-branch/printpals/public');
const out = path.resolve(__dirname, '../../pinterest');
const logo = fs.readFileSync(pub + '/img/logo.svg', 'utf8');
const fonts = `@font-face{font-family:B;src:url(file://${pub}/fonts/baloo2.woff2)}@font-face{font-family:N;src:url(file://${pub}/fonts/nunito.woff2)}`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 800, height: 800 } });
  // Profile photo: shown as a circle, so everything stays inside the middle.
  fs.writeFileSync(path.join(__dirname, 'tmp.html'), `<html><head><style>${fonts}body{margin:0;width:800px;height:800px;background:radial-gradient(circle at 30% 25%,#fff3d6 0%,#ffe0e6 55%,#f3e6ff 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:B;overflow:hidden;position:relative}
  .b{position:absolute;border-radius:50%}.logo svg{width:330px;height:330px;filter:drop-shadow(0 18px 30px rgba(45,35,80,.2))}
  .name{font:800 112px B;color:#2d2350;margin-top:6px;letter-spacing:-2px}.name b{color:#ff6b6b}</style></head><body>
  <div class="b" style="width:120px;height:120px;left:120px;top:150px;background:#ffd166;opacity:.5"></div><div class="b" style="width:80px;height:80px;right:140px;top:170px;background:#8ea6ff;opacity:.35"></div>
  <div class="b" style="width:70px;height:70px;right:150px;bottom:110px;background:#57cdb4;opacity:.35"></div>
  <div class="logo">${logo}</div><div class="name">Print<b>Pals</b></div></body></html>`);
  await p.goto('file://' + path.join(__dirname, 'tmp.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
  await p.screenshot({ path: `${out}/PrintPals-profile-photo.png` });
  // Cover image: a row of pins under the name.
  await p.setViewportSize({ width: 1600, height: 900 });
  const ids = ['names', 'coding', 'colouring', 'pack', 'routine', 'calmkit', 'maths'];
  const imgs = ids.map((id, i) => `<img src="file://${pub}/pins/${id}.jpg" style="left:${40 + i * 220}px;top:${i % 2 ? 330 : 300}px;transform:rotate(${(i % 2 ? 3 : -3)}deg)">`).join('');
  fs.writeFileSync(path.join(__dirname, 'tmp.html'), `<html><head><style>${fonts}body{margin:0;width:1600px;height:900px;background:linear-gradient(135deg,#fff3d6,#ffe0e6 50%,#e6ecff);overflow:hidden;position:relative;font-family:N}
  img{position:absolute;width:300px;border-radius:18px;box-shadow:0 24px 50px rgba(45,35,80,.25)}
  .t{position:absolute;top:70px;left:0;right:0;text-align:center;font:800 88px B;color:#2d2350;letter-spacing:-1.5px}.t b{color:#ff6b6b}
  .s{position:absolute;top:185px;left:0;right:0;text-align:center;font:800 34px N;color:#5d5578}</style></head><body>
  <div class="t">Free printables kids <b>love</b></div><div class="s">Tracing · Phonics · Maths · Screen-free games · Crafts · Charts</div>${imgs}</body></html>`);
  await p.goto('file://' + path.join(__dirname, 'tmp.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  await p.screenshot({ path: `${out}/PrintPals-cover.jpg`, type: 'jpeg', quality: 88 });
  await b.close();
})();
