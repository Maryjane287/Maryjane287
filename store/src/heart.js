// The written pages that make every magazine feel personal and loved, even
// when the buyer only answers a few questions. Each magazine brings its own
// words (data/heart/<slug>.json), so a Mum's issue and a dog's issue each get
// their own history, fun facts and a closing note from us.
// Like love.js it imports nothing, so covers.js can import it without a loop.
const escH = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ICONS = {
  spark: '<path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4z"/>',
  hands: '<path d="M4 14c2-1 3-3 5-3h4a2 2 0 0 1 0 4h-3M8 18h7l5-4a2 2 0 0 0-3-3l-3 2"/>',
  pulse: '<path d="M2 12h5l2-5 4 10 2-5h7"/>',
  heart: '<path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  moon: '<path d="M20 15A8 8 0 1 1 9 4a6.5 6.5 0 0 0 11 11z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5M8 7h7"/>',
  home: '<path d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6"/>',
  paw: '<circle cx="7" cy="9" r="1.8"/><circle cx="12" cy="6.5" r="1.8"/><circle cx="17" cy="9" r="1.8"/><path d="M12 12c-3 0-5.5 3-5.5 5.2 0 1.5 1.3 2.3 2.7 2 1-.2 1.8-.6 2.8-.6s1.8.4 2.8.6c1.4.3 2.7-.5 2.7-2C17.5 15 15 12 12 12z"/>',
  leaf: '<path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15zM5 19l7-7"/>',
  cake: '<path d="M4 20h16v-7H4zM4 15c2 1 4 1 5.3 0s2.7-1 4 0 3.4 1 6.7 0M12 13V9M12 6.5a1 1 0 0 0 0-2"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  music: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  gift: '<path d="M4 11h16v10H4zM3 7h18v4H3zM12 7v14M12 7c-2-4-6-3-5 0M12 7c2-4 6-3 5 0"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/>',
  cap: '<path d="M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6"/>',
  plane: '<path d="M2 13l20-8-6 16-4-6-6-1zM12 15l4-6"/>',
  ring: '<circle cx="12" cy="15" r="6"/><path d="M9 4h6l-3 5z"/>',
  baby: '<circle cx="12" cy="8" r="4"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7M10.5 8h.01M13.5 8h.01"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14c2 2.5 6 2.5 8 0M9 9.5h.01M15 9.5h.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  apple: '<path d="M12 7c-3-2-8 0-7 6 .6 4 3 8 5 8 1 0 1.3-.5 2-.5s1 .5 2 .5c2 0 4.4-4 5-8 1-6-4-8-7-6zM12 7c0-2 1-4 3-4"/>',
  tree: '<path d="M12 2l6 8h-3l4 6H5l4-6H6zM12 16v6"/>',
  camera: '<path d="M3 8h4l2-3h6l2 3h4v12H3z"/><circle cx="12" cy="13" r="3.5"/>',
};
export const HEART_ICONS = Object.keys(ICONS);
const icon = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k] || ICONS.heart}</svg>`;
const seal = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS.heart}</svg>`;
const sprig = '<svg class="lv-sprig" viewBox="0 0 100 100" aria-hidden="true"><path d="M8 92C30 70 52 52 92 8" fill="none"/><path d="M30 70c-8-10-6-20 2-24 4 10 4 18-2 24zM46 54c-2-12 4-20 12-20 0 10-4 16-12 20zM62 38c0-10 6-16 14-14-2 8-6 12-14 14zM34 66c10-6 20-4 24 4-10 4-18 3-24-4zM50 50c10-4 18 0 20 8-10 2-16 0-20-8z"/><circle cx="92" cy="8" r="5"/></svg>';

// Fills {who}, {from}, {age} and any answer id in our written lines, escaped.
export function filler(map) {
  return s => escH(String(s ?? '').replace(/\{(\w+)\}/g, (_, k) => String(map[k] ?? '')));
}

// Returns the written pages for one magazine as HTML. `page(cls, inner, n)`
// is the page wrapper from covers.js, `style` its colour variables.
export function heartPages(H, { t, page, style, chapters = [], own = [], promise = '' }) {
  const theme = H.theme ? ` lv-t-${H.theme}` : '';
  const out = {};
  const sec = (k, f) => { if (H[k]) out[k] = f(H[k]); };

  sec('story', s => (n) => page(`lv lv-story${theme}`, `<p class="pg-kicker">${t(s.kicker)}</p><h3>${t(s.title)}</h3><div class="lv-chapters${chapters.length > 4 || chapters.join('').length > 210 ? ' lv-ch5' : ''}">${chapters.map(([l, x], i) => `<div><span>${t(s.chapter || 'Chapter')} ${i + 1}</span><b>${t(l)}</b><p>${escH(x)}</p></div>`).join('')}</div><p class="lv-hand${t(s.hand).length > 70 ? ' lv-hand-s' : ''}">${t(s.hand)}</p>`, n));

  sec('picks', s => (n) => {
    const list = [...own, ...s.items.filter(x => !own.includes(x))].slice(0, 10);
    return page(`reasons${theme}`, `<p class="pg-kicker">${t(s.kicker)}</p><h3>${t(s.title)}</h3><ol class="reasons">${list.map(r => `<li>${t(r)}</li>`).join('')}</ol>`, n);
  });

  sec('timeline', s => (n) => page(`lv lv-fame${theme}`, `<p class="pg-kicker">${t(s.kicker)}</p><h3>${t(s.title)}</h3><ol class="lv-line">${s.items.map(([y, h, d]) => `<li><span class="lv-year">${t(y)}</span><b>${t(h)}</b><p>${t(d)}</p></li>`).join('')}<li class="lv-us"><span class="lv-year">${t(s.today[0] || 'Today')}</span><b>${t(s.today[1])}</b><p>${t(s.today[2])}</p></li></ol>`, n));

  sec('letters', s => (n) => page(`lv lv-letters${theme}`, `<p class="pg-kicker">${t(s.kicker)}</p><h3>${t(s.title)}</h3><div class="lv-notes">${s.items.map(([q, src], i) => `<figure class="lv-note lv-n${i + 1}"><blockquote>&ldquo;${t(q)}&rdquo;</blockquote><figcaption>${t(src)}</figcaption><i class="lv-seal">${seal}</i></figure>`).join('')}</div><p class="lv-hand">${t(s.hand)}</p>`, n));

  sec('facts', s => (n) => page(`lv lv-sci${theme}`, `<p class="pg-kicker">${t(s.kicker)}</p><h3>${t(s.title)}</h3><div class="lv-facts">${s.items.map(([k, h, d]) => `<div class="lv-fact"><i>${icon(k)}</i><b>${t(h)}</b><p>${t(d)}</p></div>`).join('')}</div><p class="lv-hand${t(s.hand).length > 60 ? ' lv-hand-s' : ''}">${t(s.hand)}</p>`, n));

  sec('world', s => (n) => page(`lv lv-world${theme}`, `<div class="lv-sun" aria-hidden="true"></div><p class="pg-kicker">${t(s.kicker)}</p><h3>${t(s.title)}</h3><p class="lv-lead">${t(s.lead)}</p><ul class="lv-gifts">${s.items.map(g => `<li>${t(g)}</li>`).join('')}</ul><p class="lv-close">${t(s.close)}</p>`, n));

  sec('promises', s => (n) => page(`lv lv-promise${theme}`, `<p class="pg-kicker">${t(s.kicker)}</p><h3>${t(s.title)}</h3><ol class="lv-promises">${[promise ? escH(promise) : '', ...s.items.map(t)].filter(Boolean).slice(0, 5).map(x => `<li>${x}</li>`).join('')}</ol><p class="lv-hand">${t(s.hand)}</p>`, n));

  sec('note', s => (n) => `<div class="pg pg-lv lv-us-note${theme}" ${style}>${sprig}${sprig}<div class="pg-in"><p class="pg-kicker">${t(s.kicker || 'A note from all of us at Cover Story')}</p><h3>${t(s.title)}</h3><div class="lv-letter">${s.paras.map(x => `<p>${t(x)}</p>`).join('')}<p class="lv-wish">${t(s.wish)}</p></div><p class="lv-sign">${t(s.sign || 'With warm wishes,')}<b>everyone at Cover Story</b></p></div><span class="pg-num">${n}</span></div>`);

  return out;
}
