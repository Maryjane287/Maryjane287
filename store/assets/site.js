// Currency display and the optional Pinterest tag (only loaded after consent).
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

function guessCurrency() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  const lang = navigator.language || '';
  return tz.startsWith('America/') || lang === 'en-US' ? 'usd' : 'gbp';
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
