// The magazine maker: pick a magazine, answer questions, add photos, and watch
// the cover update live. Photos stay in the browser until the order is placed.
import { renderCover, renderPages, renderFullMagazine, renderCardSet, PALETTES, DESIGNS, designsFor, baseDesign, esc } from './covers.js';
import { renderAndUpload, finishOrder } from './order-pdf.js';

const mags = JSON.parse(document.getElementById('mags').textContent);
const checkout = JSON.parse(document.getElementById('site-checkout').textContent);
const params = new URLSearchParams(location.search);
const $ = s => document.querySelector(s);
const form = $('#order');

const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

const state = {
  slug: params.get('m') || store.get('maker:slug') || mags[0].slug,
  palette: null,
  design: DESIGNS[params.get('d')] ? params.get('d') : (DESIGNS[store.get('maker:design')] ? store.get('maker:design') : 'signature'),
  values: {},
  photos: {},
  tab: 0,
};
if (!mags.some(m => m.slug === state.slug)) state.slug = mags[0].slug;
const mag = () => mags.find(m => m.slug === state.slug);

if (params.get('t')) {
  const r = form.querySelector(`input[name="tier"][value="${CSS.escape(params.get('t'))}"]`);
  if (r) r.checked = true;
}

function choose(slug) {
  state.slug = slug;
  store.set('maker:slug', slug);
  const m = mag();
  state.values = store.get(`maker:${slug}`) || {};
  state.palette = store.get(`maker:${slug}:palette`) || m.examples[0].palette;
  state.photos = {};
  state.tab = 0;
  document.querySelectorAll('.pick-btn').forEach(b => b.setAttribute('aria-checked', String(b.dataset.m === slug)));
  const on = document.querySelector('.pick-btn[aria-checked="true"]');
  if (on) on.parentElement.scrollLeft = on.offsetLeft - on.parentElement.offsetLeft - (on.parentElement.clientWidth - on.offsetWidth) / 2;
  if (!designsFor(m).includes(state.design)) state.design = baseDesign(m);
  if (state.design !== 'signature' && state.palette === 'paper') state.palette = DESIGNS[state.design].palettes[0];
  renderPalette();
  renderDesigns();
  renderFields();
  checkNotes(true);
  renderTabs();
  update();
}

const coverOpts = (design = state.design) => {
  const m = mag();
  return { palette: state.palette, design, portraitOpts: m.examples.find(e => e.palette === state.palette)?.portrait || m.examples[0].portrait, photos: state.photos };
};

function renderDesigns() {
  const m = mag();
  $('.designs').innerHTML = designsFor(m).map(k => [k, DESIGNS[k]]).map(([k, d]) =>
    `<button type="button" class="design-btn" role="radio" aria-checked="${k === state.design}" data-d="${k}">${renderCover(m, state.values, coverOpts(k))}<span>${esc(d.label)}</span></button>`).join('');
}

function renderPalette() {
  const box = $('.palette');
  if (mag().layout === 'newspaper' && state.design === 'signature') { box.hidden = true; return; }
  box.hidden = false;
  box.innerHTML = Object.entries(PALETTES).filter(([k]) => k !== 'paper').map(([k, p]) =>
    `<button type="button" class="swatch" role="radio" aria-label="${k}" aria-checked="${k === state.palette}" data-p="${k}" style="background:linear-gradient(135deg, ${p.bg} 55%, ${p.accent} 55%)"></button>`).join('');
}

// Optional answers for the fun pages inside (the list, awards, vouchers,
// recipe and passport), so those pages are about them too.
const FUN = [
  ['x_reasons', 'Reasons you love them', 'One per line, up to ten', 'The way they sing in the car\nTheir terrible jokes\nHow they always remember birthdays', 600, true],
  ['x_awards', 'Awards they deserve', 'Up to four, separated by commas', 'Best dancer, Snack champion, Loudest laugh, Queen of plans', 160],
  ['x_treats', 'Vouchers to give them', 'Up to four, separated by commas', 'Breakfast in bed, A lie in, Pizza night, One day off chores', 160, false, true],
  ['x_recipe', 'What they are made of', 'For the recipe page, up to five, separated by commas', 'sunshine, strong coffee, bad puns', 140],
  ['x_places', 'Places they love', 'Stamps for their passport, up to three', 'Paris, the seaside, Grandma\'s kitchen', 100],
  ['x_job', 'Their job title, the fun version', 'Printed on their passport', 'Chief hug officer', 40],
];
function funPages(m) {
  const gentle = m.slug === 'pet-memorial-magazine';
  const rows = FUN.filter(r => !(gentle && r[6])).map(([id, label, hint, eg, max, area]) => {
    const val = esc(state.values[id] || '');
    const common = `data-f="${id}" maxlength="${max}" placeholder="${esc(eg)}"`;
    return `<label class="field${area || max > 60 ? ' wide' : ''}"><span>${esc(label)} <small>${esc(hint)}</small></span>${area ? `<textarea rows="4" ${common}>${val}</textarea>` : `<input type="text" ${common} value="${val}">`}</label>`;
  }).join('');
  return `<fieldset class="fun-pages wide"><legend>Make the fun pages about them too <small>(optional)</small></legend><p class="small">These fill the list of reasons we love them, the awards night, ${gentle ? '' : 'the vouchers, '}the recipe and the passport. Leave any blank and we will write something warm for that page.</p><div class="fun-grid">${rows}</div></fieldset>`;
}

function renderFields() {
  const m = mag();
  const text = m.fields.filter(f => f.type !== 'photo');
  const photos = m.fields.filter(f => f.type === 'photo');
  $('#fields').innerHTML = text.map((f, i) => {
    const val = esc(state.values[f.id] || '');
    const common = `name="q_${f.id}" data-f="${f.id}" maxlength="${f.max || 200}" placeholder="${esc(f.example)}" required`;
    const input = f.type === 'textarea' ? `<textarea ${common}>${val}</textarea>` : `<input type="text" ${common} value="${val}">`;
    return `<label class="field${f.type === 'textarea' || (f.max || 0) > 60 ? ' wide' : ''}"><span>${esc(f.label)}</span>${input}${f.type === 'textarea' ? `<small class="count" data-count="${f.id}"></small>` : ''}</label>`;
  }).join('') + funPages(m) + `<fieldset class="friend-notes wide"><legend>Little notes from family and friends <small>(optional)</small></legend><p class="small">Ask a few people who love them for one sweet line each. They all appear together on a special page in the magazine, each one signed with their name.</p>${familyInvite()}${[1, 2, 3, 4].map(i => `<div class="friend-note"><input type="text" data-f="note${i}_from" maxlength="30" placeholder="${['Grandma', 'Uncle Sam', 'Emma', 'Leo'][i - 1]}" aria-label="Note ${i}: who it is from" value="${esc(state.values[`note${i}_from`] || '')}"><input type="text" data-f="note${i}_msg" maxlength="110" placeholder="${['You make every room brighter.', 'Still the best dancer I know!', 'Here is to many more adventures together.', 'Love you to the moon and back.'][i - 1]}" aria-label="Note ${i}: their message" value="${esc(state.values[`note${i}_msg`] || '')}"></div>`).join('')}</fieldset><div class="photos">${photos.map(f => `
    <label class="photo-drop"><span><b>+</b>${esc(f.label)}</span><input type="file" name="${f.id}" data-photo="${f.id}" accept="image/*"></label>`).join('')}</div>`;
  updateCounts();
}

// Family notes: a private link the buyer sends on WhatsApp or by email. Each
// person writes their own line from their phone, and it drops into a free
// note space above. Nobody without the link can see or add notes.
function familyInvite() {
  const board = state.values.notesBoard;
  return `<div class="fam-invite"><p class="fam-head"><b>Let them write it themselves</b>Send a link to Grandma, an aunt or a friend. They type their note on their own phone and it appears here, signed with their name.</p>${board
    ? `<div class="fam-link"><input type="text" readonly value="${esc(inviteLink())}" aria-label="Link for family"><button type="button" class="btn btn-small" data-fam="copy">Copy link</button><a class="btn btn-small btn-ghost" data-fam="wa" href="${esc(waLink())}" target="_blank" rel="noopener">Send on WhatsApp</a></div><p class="fam-status" id="fam-status" aria-live="polite">Waiting for notes. They drop into an empty space below as they arrive.</p><button type="button" class="link-btn" data-fam="check">Check for new notes</button>`
    : '<button type="button" class="btn btn-small" data-fam="make">Get a link for family</button>'}</div>`;
}
const whoFor = () => { const m = mag(); return String(state.values[m.fields[0].id] || '').trim() || 'someone special'; };
function inviteLink() {
  const q = new URLSearchParams({ b: state.values.notesBoard, w: whoFor(), f: String(state.values.from || state.values.fromWho || '').trim(), m: mag().title });
  return `${location.origin}/note/?${q}`;
}
const waLink = () => `https://wa.me/?text=${encodeURIComponent(`We're making a magazine for ${whoFor()} and it wouldn't be complete without you. Could you write one little line for them? It only takes a minute: ${inviteLink()}`)}`;
function newBoard() {
  const a = new Uint8Array(12);
  (window.crypto || window.msCrypto).getRandomValues(a);
  return Array.from(a, x => x.toString(36).padStart(2, '0')).join('').slice(0, 24);
}
var famBusy = false;
async function checkNotes(quiet) {
  const board = state.values.notesBoard;
  const status = $('#fam-status');
  if (!board || famBusy) return;
  famBusy = true;
  try {
    const { notes = [] } = await (await fetch(`/api/notes?b=${board}`)).json();
    const used = new Set(state.values.notesUsed || []);
    let added = 0;
    for (const n of notes.filter(n => !used.has(n.id))) {
      const i = [1, 2, 3, 4].find(k => !String(state.values[`note${k}_msg`] || '').trim());
      if (!i) break;
      state.values[`note${i}_from`] = n.from; state.values[`note${i}_msg`] = n.msg;
      const a = $(`[data-f="note${i}_from"]`), b = $(`[data-f="note${i}_msg"]`);
      if (a) a.value = n.from; if (b) b.value = n.msg;
      used.add(n.id); added++;
    }
    state.values.notesUsed = [...used];
    store.set(`maker:${state.slug}`, state.values);
    const waiting = notes.filter(n => !used.has(n.id)).length;
    if (status) status.textContent = !notes.length
      ? (quiet ? 'Waiting for notes. They drop into an empty space below as they arrive.' : 'No notes yet. Once someone writes one, it appears here.')
      : `${notes.length} ${notes.length === 1 ? 'note has' : 'notes have'} arrived, from ${notes.map(n => n.from).join(', ')}.${added ? ` ${added} just added below.` : ''}${waiting ? ` ${waiting} more ${waiting === 1 ? 'is' : 'are'} waiting: clear a space below and tap Check for new notes.` : ''}`;
  } catch { if (status && !quiet) status.textContent = 'Could not check just now. Please try again in a moment.'; }
  famBusy = false;
}
$('#fields').addEventListener('click', async e => {
  const b = e.target.closest('[data-fam]');
  if (!b) return;
  const act = b.dataset.fam;
  if (act === 'make') {
    state.values.notesBoard = newBoard();
    store.set(`maker:${state.slug}`, state.values);
    b.closest('.fam-invite').outerHTML = familyInvite();
  } else if (act === 'copy') {
    const input = b.parentElement.querySelector('input');
    try { await navigator.clipboard.writeText(input.value); b.textContent = 'Copied'; } catch { input.select(); document.execCommand && document.execCommand('copy'); b.textContent = 'Copied'; }
    setTimeout(() => { b.textContent = 'Copy link'; }, 2000);
  } else if (act === 'check') checkNotes(false);
});
// The link carries the names, so refresh it when those answers change.
function refreshInvite() {
  const box = $('.fam-invite');
  if (!box || !state.values.notesBoard) return;
  const input = box.querySelector('input'), wa = box.querySelector('[data-fam="wa"]');
  if (input) input.value = inviteLink();
  if (wa) wa.href = waLink();
}
// Pick up new notes whenever the buyer comes back to the page.
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkNotes(true); });
setInterval(() => { if (!document.hidden) checkNotes(true); }, 60000);

function renderTabs() {
  const labels = ['Cover', 'Page 2', 'Page 3', 'Page 4'];
  $('.preview-tabs').innerHTML = labels.map((l, i) => `<button type="button" role="tab" aria-selected="${i === state.tab}" data-tab="${i}">${l}</button>`).join('');
}

let raf = 0;
function update() {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    const m = mag();
    const opts = coverOpts();
    const pages = [renderCover(m, state.values, opts), ...renderPages(m, state.values, opts)];
    $('#preview').innerHTML = pages[state.tab] || pages[0];
    document.querySelectorAll('.design-btn').forEach(b => { b.firstElementChild.outerHTML = renderCover(m, state.values, coverOpts(b.dataset.d)); });
    const first = m.fields[0];
    $('#who').textContent = (state.values[first.id] || '').trim() ? `${state.values[first.id].trim()}'s` : 'their';
  });
}

function updateCounts() {
  document.querySelectorAll('[data-count]').forEach(c => {
    const f = mag().fields.find(x => x.id === c.dataset.count);
    c.textContent = `${(state.values[f.id] || '').length} / ${f.max}`;
  });
}

// Shrink big phone photos before they go anywhere: faster preview, smaller upload.
async function shrink(file, max = 1600) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = bad; i.src = url; });
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    const blob = await new Promise(ok => c.toBlob(ok, 'image/jpeg', 0.85));
    return { blob, dataUrl: c.toDataURL('image/jpeg', 0.8) };
  } finally { URL.revokeObjectURL(url); }
}

document.querySelector('.pick').addEventListener('click', e => {
  const b = e.target.closest('.pick-btn');
  if (b && b.dataset.m !== state.slug) choose(b.dataset.m);
});

$('.designs').addEventListener('click', e => {
  const b = e.target.closest('.design-btn');
  if (!b || b.dataset.d === state.design) return;
  state.design = b.dataset.d;
  store.set('maker:design', state.design);
  if (state.design !== 'signature' && state.palette === 'paper') state.palette = DESIGNS[state.design].palettes[0];
  document.querySelectorAll('.design-btn').forEach(x => x.setAttribute('aria-checked', String(x === b)));
  renderPalette();
  state.tab = 0; renderTabs();
  const stage = $('.preview-stage'); stage.classList.remove('pop'); void stage.offsetWidth; stage.classList.add('pop');
  update();
});

$('.palette').addEventListener('click', e => {
  const s = e.target.closest('.swatch');
  if (!s) return;
  state.palette = s.dataset.p;
  store.set(`maker:${state.slug}:palette`, state.palette);
  document.querySelectorAll('.swatch').forEach(x => x.setAttribute('aria-checked', String(x === s)));
  renderDesigns();
  const stage = $('.preview-stage'); stage.classList.remove('pop'); void stage.offsetWidth; stage.classList.add('pop');
  update();
});

$('.preview-tabs').addEventListener('click', e => {
  const b = e.target.closest('[data-tab]');
  if (!b) return;
  state.tab = +b.dataset.tab;
  document.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-selected', String(x === b)));
  update();
});

$('#fields').addEventListener('input', e => {
  const f = e.target.dataset.f;
  if (!f) return;
  state.values[f] = e.target.value;
  store.set(`maker:${state.slug}`, state.values);
  updateCounts();
  refreshInvite();
  update();
});

// Typing in a field jumps the preview to the page that shows it.
$('#fields').addEventListener('focusin', e => {
  const f = e.target.dataset.f;
  if (!f) return;
  const tab = f === 'message' ? 1 : ['moment', 'trip', 'miss'].includes(f) ? 3 : 0;
  if (tab !== state.tab) { state.tab = tab; renderTabs(); update(); }
});

$('#fields').addEventListener('change', async e => {
  const id = e.target.dataset.photo;
  if (!id || !e.target.files[0]) return;
  const input = e.target;
  const drop = input.closest('.photo-drop');
  let shrunk;
  try { shrunk = await shrink(input.files[0]); } catch {
    // Some phones save photos in a format browsers cannot open (like HEIC).
    input.value = '';
    drop.querySelector('.photo-err')?.remove();
    drop.insertAdjacentHTML('beforeend', '<small class="photo-err">That photo would not open. Try a JPG or PNG.</small>');
    return;
  }
  drop.querySelector('.photo-err')?.remove();
  const { blob, dataUrl } = shrunk;
  state.photos[id] = dataUrl;
  // Swap in the smaller photo for upload where the browser allows it.
  try {
    const dt = new DataTransfer();
    dt.items.add(new File([blob], `${id}.jpg`, { type: 'image/jpeg' }));
    input.files = dt.files;
  } catch {}
  drop.querySelector('img')?.remove();
  drop.insertAdjacentHTML('afterbegin', `<img src="${dataUrl}" alt="">`);
  state.tab = id === 'photo1' ? 0 : 3;
  renderTabs();
  update();
});

// Printed options stay hidden until printing is switched on; ?print=1 shows them for testing.
if (params.get('print') === '1') form.querySelectorAll('[data-soon="print"]').forEach(el => { el.hidden = false; });
const syncFinish = () => {
  const printed = form.tier.value === 'print' || form.tier.value === 'hardcover';
  $('.finish').hidden = form.tier.value !== 'print';
  // Printed copies are posted to the address typed at the printer's checkout, so the email gift fields only apply to digital.
  $('.gift-toggle').hidden = printed;
  $('.gift-print').hidden = !printed;
  if (printed) form.gift.checked = false;
  const on = form.gift.checked;
  $('.gift-fields').hidden = !on;
  // The day picker only shows for "On a day I choose", already set to tomorrow so it is never an empty box.
  const later = on && form.gift_when.value === 'later';
  $('.gift-day').hidden = !later;
  form.gift_date.required = later;
  if (later && !form.gift_date.value) form.gift_date.value = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
  form.gift_email.required = on;
  form.gift_name.required = on;
};
form.gift.addEventListener('change', syncFinish);
form.querySelectorAll('[name=gift_when]').forEach(r => r.addEventListener('change', syncFinish));
form.gift_date.min = new Date().toISOString().slice(0, 10);
form.gift_date.max = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
form.addEventListener('change', e => { if (e.target.name === 'tier') syncFinish(); });
syncFinish();
if (params.get('print_error')) alert('Sorry, something went wrong at the printing checkout. Please try again, or choose the digital magazine.');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const m = mag();
  form.magazine.value = m.slug;
  form.palette.value = state.palette;
  form.design.value = state.design;
  form.answers.value = JSON.stringify(state.values);
  const btn = form.querySelector('[type="submit"]');
  const progress = $('#order-progress');
  const say = t => { progress.hidden = false; progress.textContent = t; };
  const reset = () => { btn.disabled = false; btn.textContent = 'Place my order'; progress.hidden = true; };
  btn.disabled = true; btn.textContent = 'Making your magazine...';
  const tier = form.tier.value;
  const printed = tier === 'print' || tier === 'hardcover';
  const who = (state.values[m.fields[0].id] || m.fields[0].example || '').trim();

  // 1. Render the 24 finished pages in this browser and make the PDF.
  let made = null;
  if (!window.PREVIEW) {
    try {
      say('Printing page 1 of 24...');
      const id = await renderAndUpload({ mag: m, values: state.values, opts: coverOpts(), cards: tier === 'cards', onProgress: (n, total) => say(`Printing page ${Math.min(n + 1, total)} of ${total}...`) });
      say('Binding your magazine...');
      made = { id, ...(await finishOrder({ id, kind: printed ? 'print' : 'digital', finish: tier === 'hardcover' ? 'hardcover' : form.finish.value, title: `${m.title}: ${who}`, email: form.email.value, who, mag: m.slug, tz: new Date().getTimezoneOffset(), gift: form.gift.checked ? { name: form.gift_name.value, email: form.gift_email.value, date: form.gift_when.value === 'later' ? form.gift_date.value : '', from: form.gift_from.value } : null })) };
      form['order-id'].value = id;
      form.pdf.value = made.pdf;
      if (made.cards) form.cards.value = made.cards;
      // Remembered so the download page can find this order after payment.
      store.set('order:last', { id, tier, title: `${m.title}: ${who}`, at: Date.now() });
    } catch (err) {
      console.error(err);
      if (printed) {
        reset();
        alert('Sorry, we could not prepare your printed copy just now. Please try again in a moment, or choose the digital magazine.');
        return;
      }
      // Digital orders still go through: we can make the PDF from the answers.
    }
  }

  // 2. Record the order, then 3. go to payment.
  try {
    say('Sending your story...');
    const res = window.PREVIEW ? { ok: true } : await fetch('/', { method: 'POST', body: new FormData(form) });
    if (!res.ok) throw new Error(res.status);
    if (printed && made?.checkout) { location.href = made.checkout; return; }
    const pay = checkout[tier];
    if (pay) {
      const url = new URL(pay);
      // Lemon Squeezy and Stripe name the email prefill differently.
      url.searchParams.set(url.hostname.endsWith('lemonsqueezy.com') ? 'checkout[email]' : 'prefilled_email', form.email.value);
      // Lets Lemon Squeezy tell us which magazine was paid for, to unlock the download.
      if (made?.id && url.hostname.endsWith('lemonsqueezy.com')) url.searchParams.set('checkout[custom][order_id]', made.id);
      // A discount code in the maker link (?code=...) is filled in at checkout; Lemon Squeezy checks it.
      if (params.get('code') && url.hostname.endsWith('lemonsqueezy.com')) url.searchParams.set('checkout[discount_code]', params.get('code').trim().slice(0, 40));
      location.href = url.href;
    } else {
      location.href = new URL(form.getAttribute('action'), location.href).href;
    }
  } catch {
    reset();
    alert('Sorry, that did not send. Please check your connection and try again.');
  }
});

choose(state.slug);

// Flip through the whole finished magazine, with their answers, before paying.
const allPages = $('#all-pages');
$('#see-all')?.addEventListener('click', () => {
  const m = mag();
  const opts = coverOpts();
  const pages = renderFullMagazine(m, state.values, opts);
  const extra = form.tier.value === 'cards' ? renderCardSet(m, state.values, opts) : [];
  allPages.querySelector('.all-grid').innerHTML = [...pages, ...extra].map((p, i) =>
    `<figure class="all-page"><div class="all-sheet">${p}<span class="watermark" aria-hidden="true">Preview</span></div><figcaption>${i === 0 ? 'Cover' : i < pages.length ? `Page ${i + 1}` : `Card set ${i - pages.length + 1}`}</figcaption></figure>`).join('');
  // Very old phones have no pop-up windows built in, so just show it in place.
  if (allPages.showModal) allPages.showModal(); else allPages.setAttribute('open', '');
});
allPages?.addEventListener('click', e => { if (e.target === allPages || e.target.closest('[data-close]')) allPages.close ? allPages.close() : allPages.removeAttribute('open'); });
