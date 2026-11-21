// Currency display and the optional Pinterest tag (only loaded after consent).
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

// Visitors in the UK see pounds, everyone else US dollars. The footer switch overrides it.
function guessCurrency() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const langs = navigator.languages || [navigator.language || ''];
    if (/^Europe\/(London|Belfast|Guernsey|Isle_of_Man|Jersey|Gibraltar)$/.test(tz) || langs.some(l => /-GB$/i.test(l))) return 'gbp';
  } catch {}
  return 'usd';
}

export function setCurrency(cur) {
  store.set('cur', cur);
  document.documentElement.dataset.cur = cur;
  document.querySelectorAll('.price').forEach(el => { el.textContent = el.dataset[cur] || el.textContent; });
  document.querySelectorAll('[data-cur]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cur === cur)));
}

setCurrency(store.get('cur') || guessCurrency());
document.addEventListener('click', e => {
  const b = e.target.closest('button[data-cur]');
  if (b) setCurrency(b.dataset.cur);
});

// Pinterest tag: measures which Pins lead to orders. Asks first, as UK and EU law requires.
if (window.PIN_TAG_ID) {
  const load = () => {
    !function (e) { if (!window.pintrk) { window.pintrk = function () { window.pintrk.queue.push(Array.prototype.slice.call(arguments)); }; const n = window.pintrk; n.queue = []; n.version = '3.0'; const t = document.createElement('script'); t.async = !0; t.src = e; document.head.appendChild(t); } }('https://s.pinimg.com/ct/core.js');
    window.pintrk('load', window.PIN_TAG_ID); window.pintrk('page');
  };
  const choice = store.get('cookies');
  if (choice === 'yes') load();
  else if (!choice) {
    const bar = document.createElement('div');
    bar.className = 'cookie-bar';
    bar.innerHTML = '<p>May we use a Pinterest cookie to see which Pins bring people here? No ads follow you around.</p><button class="btn btn-small" data-c="yes">Yes, fine</button><button class="btn btn-small btn-ghost" data-c="no">No thanks</button>';
    bar.addEventListener('click', e => { const c = e.target.dataset.c; if (!c) return; store.set('cookies', c); bar.remove(); if (c === 'yes') load(); });
    document.body.append(bar);
  }
}

// Older phone browsers can't size things by the cover's own width (cqw) or
// keep a page's shape (aspect-ratio). Where that is missing, measure each
// cover and page here instead, including the ones the maker draws later.
(() => {
  const ok = p => window.CSS && CSS.supports && CSS.supports(p);
  const noCq = !ok('width: 1cqw'), noRatio = !ok('aspect-ratio: 1');
  if (!noCq && !noRatio) return;
  const size = el => {
    // cqw measures the inside of the box, ignoring padding and any animation scale.
    const cs = getComputedStyle(el);
    const w = parseFloat(cs.width) - (cs.boxSizing === 'border-box' ? parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth) : 0);
    if (noCq) el.style.setProperty('--cq', w / 100 + 'px');
    if (noRatio) el.style.height = el.offsetWidth * 297 / 210 + 'px';
  };
  const ro = window.ResizeObserver ? new ResizeObserver(list => list.forEach(e => size(e.target))) : null;
  const seen = new WeakSet();
  const scan = root => {
    const els = [...(root.matches && root.matches('.cv, .pg') ? [root] : []), ...root.querySelectorAll('.cv, .pg')];
    els.forEach(el => { size(el); if (!seen.has(el)) { seen.add(el); if (ro) ro.observe(el); } });
  };
  scan(document);
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) scan(n); }))).observe(document.body, { childList: true, subtree: true });
  if (!ro) addEventListener('resize', () => scan(document));
})();

// Occasion filters on the home page: show only the magazines for that moment.
(() => {
  const bar = document.querySelector('.mag-filters');
  if (!bar) return;
  const cards = [...document.querySelectorAll('.mag-grid .mag-card')];
  bar.addEventListener('click', e => {
    const b = e.target.closest('button[data-f]');
    if (!b) return;
    const f = b.dataset.f;
    bar.querySelectorAll('button').forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', String(on)); });
    show(f, false);
  });
  // Show a first handful, then everything on request, so phones are not scrolling for ever.
  const more = document.querySelector('.mag-more');
  const FIRST = 12;
  let current = 'all';
  function show(f, all) {
    current = f;
    const match = cards.filter(c => f === 'all' || c.dataset.tags.split(' ').includes(f));
    cards.forEach(c => { c.hidden = true; });
    match.forEach((c, i) => { const on = all || i < FIRST; c.hidden = !on; if (on) { c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); } });
    if (more) { more.hidden = all || match.length <= FIRST; more.textContent = `See all ${match.length} magazines`; }
  }
  if (more) more.addEventListener('click', () => show(current, true));
  show('all', false);
})();

// Email sign up: sends to Netlify Forms without leaving the page.
(() => {
  const f = document.querySelector('form.news');
  if (!f) return;
  f.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = f.querySelector('button');
    btn.disabled = true;
    try {
      const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(f)).toString() });
      if (!r.ok) throw new Error(r.status);
      f.querySelector('.news-form').hidden = true;
      f.querySelector('.news-done').hidden = false;
      try { localStorage.setItem('cs-joined', '1'); } catch {}
    } catch {
      btn.disabled = false;
      btn.textContent = 'Try again';
    }
  });
})();

// A gentle welcome card: once, after a while on the page, never on the maker
// or checkout pages. Joining gives a 10% welcome code that the maker adds at checkout.
(() => {
  const foot = document.querySelector('form.news');
  const code = foot?.dataset.welcome;
  if (!foot || !code || /^\/(make|review|thanks|order)/.test(location.pathname)) return;
  const get = k => { try { return localStorage.getItem(k); } catch { return '1'; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
  if (get('cs-joined') || get('cs-welcome-seen')) return;
  const open = () => {
    if (document.querySelector('.welcome') || get('cs-welcome-seen')) return;
    set('cs-welcome-seen', '1');
    const box = document.createElement('aside');
    box.className = 'welcome';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Welcome offer');
    box.innerHTML = `<button class="welcome-x" type="button" aria-label="Close">&times;</button>
      <p class="kicker">A little welcome gift</p><h3>10% off your first digital magazine</h3>
      <p>Join our list for a gentle reminder before birthdays, Mother's Day, Valentine's and Christmas. About one email a month.</p>
      <form class="welcome-form"><label class="sr-only" for="welcome-email">Your email</label><input id="welcome-email" type="email" name="email" required autocomplete="email" placeholder="you@example.com"><button class="btn" type="submit">Send my code</button></form>
      <p class="welcome-done" hidden role="status">You are in! Your code is <b>${code}</b>. We have saved it for you, so it is added at checkout automatically.</p>`;
    document.body.appendChild(box);
    requestAnimationFrame(() => box.classList.add('in'));
    box.querySelector('.welcome-x').addEventListener('click', () => box.remove());
    box.querySelector('form').addEventListener('submit', async e => {
      e.preventDefault();
      const btn = box.querySelector('form button');
      btn.disabled = true;
      try {
        const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ 'form-name': 'newsletter', email: e.target.email.value, source: 'welcome' }).toString() });
        if (!r.ok) throw new Error(r.status);
        set('cs-joined', '1'); set('cs-welcome', code);
        box.querySelector('form').hidden = true;
        box.querySelector('.welcome-done').hidden = false;
      } catch { btn.disabled = false; btn.textContent = 'Try again'; }
    });
  };
  setTimeout(open, 30000);
  document.addEventListener('mouseout', e => { if (!e.relatedTarget && e.clientY < 10) open(); });
})();
