// Render every page of a pack from the local site and save it as a PNG (for fresh pin pictures).
const { chromium } = require('playwright');
const path = require('path');
const out = path.resolve(__dirname, 'src');
const jobs = { christmas: 'christmas-advent-activity-book-for-kids', xmascards: 'class-christmas-cards', classcalendar: 'class-calendar-gift', xmasshow: 'christmas-show-kit', classadvent: 'class-advent-countdown', classseason: 'class-seasonal-books-for-teachers', winter: 'winter-activity-pack-for-kids' };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  for (const [id, slug] of Object.entries(jobs)) {
    await p.goto(`http://localhost:8791/${slug}.html`); await p.waitForTimeout(1200);
    await p.evaluate(() => { const sel = document.querySelector('#maker select[name="paper"]'); if (sel) sel.value = 'a4'; const nm = document.querySelector('#maker input[name="name"]'); if (nm && !nm.value) nm.value = 'Emma'; window.PrintPals.render(); });
    await p.waitForTimeout(1200);
    const n = await p.evaluate(() => document.querySelectorAll('#preview svg.sheet').length);
    for (let i = 0; i < Math.min(n, 12); i++) {
      await p.evaluate((i) => { document.getElementById('shot')?.remove(); const sv = document.querySelectorAll('#preview svg.sheet')[i].cloneNode(true);
        const d = document.createElement('div'); d.id = 'shot'; d.style.cssText = 'position:fixed;left:0;top:0;width:800px;z-index:2147483647;background:#fff';
        sv.removeAttribute('width'); sv.removeAttribute('height'); sv.style.cssText = 'display:block;width:800px;height:auto'; d.appendChild(sv); document.body.appendChild(d);
        if (!document.getElementById('hideall')) { const st = document.createElement('style'); st.id = 'hideall'; st.textContent = 'body>*:not(#shot){visibility:hidden!important}'; document.head.appendChild(st); } }, i);
      await p.waitForTimeout(250);
      await (await p.$('#shot')).screenshot({ path: `${out}/${id}-p${i}.png` });
    }
    console.log(id, n, 'pages');
  }
  await b.close();
})();
