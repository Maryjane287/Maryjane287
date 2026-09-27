const { chromium } = require('playwright');
const T = require('./alltools.json').T;
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2, locale: 'en-GB' });
 for (const [id, slug] of Object.entries(T)) {
   await p.goto(`http://localhost:8791/${slug}.html`); await p.waitForTimeout(1000);
   await p.addStyleTag({ content: '.top{display:none!important} #plusbox{display:none!important}' });
   const sheets = await p.$$('#preview svg');
   for (let i = 0; i < Math.min(2, sheets.length); i++) await sheets[i].screenshot({ path: `pin/src/${id}-${i}.png` });
 } await b.close(); })();
