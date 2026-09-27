// PrintPals: connects a tool page's form to its worksheet maker.
(function () {
  const form = document.getElementById('maker');
  if (!form) return;
  const tool = form.dataset.tool;
  const preview = document.getElementById('preview');
  const count = document.getElementById('pageCount');
  let seed = Math.floor(Math.random() * 1e9);

  function paper() {
    const saved = (() => { try { return localStorage.getItem('pp-paper'); } catch { return null; } })();
    const sel = form.querySelector('[name=paper]');
    if (sel && !sel.dataset.ready) {
      sel.dataset.ready = '1';
      if (saved) sel.value = saved;
      else if (/^en-(US|CA)|es-(US|MX)/.test(navigator.language)) sel.value = 'letter';
    }
    return sel ? sel.value : 'a4';
  }

  function values() {
    const o = { seed };
    for (const el of form.elements) {
      if (!el.name || el.name === 'paper') continue;
      if (el.type === 'checkbox') o[el.name] = el.checked;
      else if (el.type === 'radio') { if (el.checked) o[el.name] = el.value; }
      else o[el.name] = el.value;
    }
    return o;
  }

  const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch {} } };

  // Ink saver: white backgrounds and grey pictures, for black and white printers and pricey ink.
  const inkBox = form.querySelector('[name=inksaver]');
  if (inkBox) { inkBox.checked = store.get('pp-ink') === '1'; inkBox.addEventListener('change', () => store.set('pp-ink', inkBox.checked ? '1' : '0')); }
  function lum(hex) {
    const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return null;
    let h = m[1]; if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  const INK_FILTER = '<defs><filter id="pp-ink"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="0.6" intercept="0.4"/><feFuncG type="linear" slope="0.6" intercept="0.4"/><feFuncB type="linear" slope="0.6" intercept="0.4"/></feComponentTransfer></filter></defs>';
  function inkSave(svg) {
    svg.querySelectorAll('rect[fill], circle[fill], ellipse[fill], path[fill], polygon[fill]').forEach((el) => {
      const L = lum(el.getAttribute('fill'));
      if (L !== null && L > 0.8 && L < 1) el.setAttribute('fill', '#fff');
    });
    svg.insertAdjacentHTML('afterbegin', INK_FILTER);
    svg.querySelectorAll('image').forEach((im) => im.setAttribute('filter', 'url(#pp-ink)'));
    svg.querySelectorAll('text').forEach((t) => { if (/Emoji/.test(t.getAttribute('font-family') || '')) t.setAttribute('filter', 'url(#pp-ink)'); });
  }

  // Easy-read letters: the single-storey a and g that children learn to write (Andika).
  const easyBox = form.querySelector('[name=easyread]');
  if (easyBox) { easyBox.checked = store.get('pp-easy') === '1'; easyBox.addEventListener('change', () => store.set('pp-easy', easyBox.checked ? '1' : '0')); }
  function easyRead(svg) {
    svg.querySelectorAll('text').forEach((t) => {
      if (/Emoji/.test(t.getAttribute('font-family') || '')) return;
      t.setAttribute('font-family', "Andika, 'Andika', sans-serif");
      const fs = parseFloat(t.getAttribute('font-size'));
      if (fs) t.setAttribute('font-size', (fs * 0.92).toFixed(2)); // Andika runs a little wider
    });
  }

  // Remember my child: the name is kept on this device only, so every sheet is ready personalised.
  const nameBox = form.querySelector('input[name=name]');
  const namesBox = form.querySelector('textarea[name=names]');
  const kept = store.get('pp-child') || '';
  // Only replaces an empty box or our example name, never something a grown-up typed.
  const untouched = (el) => !el.value.trim() || el.value === el.defaultValue;
  if (kept && nameBox && untouched(nameBox)) nameBox.value = kept;
  if (kept && namesBox && tool === 'names' && untouched(namesBox)) namesBox.value = kept;
  const remember = document.getElementById('remember');
  const showRemember = () => { if (remember) remember.hidden = !store.get('pp-child'); };
  if (nameBox) nameBox.addEventListener('change', () => { const v = nameBox.value.trim(); if (v) store.set('pp-child', v); showRemember(); });
  document.querySelectorAll('[data-action=forget]').forEach((b) => b.addEventListener('click', () => { store.set('pp-child', null); if (nameBox) nameBox.value = ''; showRemember(); soon(); }));
  showRemember();

  // Easier and harder: step the tool's level up or down.
  const levelName = form.dataset.level;
  const levelRadios = levelName ? [...form.querySelectorAll(`input[type=radio][name="${levelName}"]`)] : [];
  function syncLevel() {
    const i = levelRadios.findIndex((r) => r.checked);
    document.querySelectorAll('[data-action=easier]').forEach((b) => { b.disabled = i <= 0; });
    document.querySelectorAll('[data-action=harder]').forEach((b) => { b.disabled = i < 0 || i >= levelRadios.length - 1; });
  }
  function step(d) {
    const i = levelRadios.findIndex((r) => r.checked), j = Math.max(0, Math.min(levelRadios.length - 1, i + d));
    if (j !== i && levelRadios[j]) { levelRadios[j].checked = true; render(); syncLevel(); }
  }
  document.querySelectorAll('[data-action=easier]').forEach((b) => b.addEventListener('click', () => step(-1)));
  document.querySelectorAll('[data-action=harder]').forEach((b) => b.addEventListener('click', () => step(1)));
  form.addEventListener('change', syncLevel);
  syncLevel();

  // PrintPals Plus tools: free for 7 days on this device, then a plan is needed to print.
  const plusNeed = form.dataset.plus;
  const plusBox = document.getElementById('plusbox');
  function plusNote(html, kind) { if (!plusBox) return; plusBox.className = `plusbox ${kind}`; plusBox.innerHTML = html; plusBox.hidden = false; }
  function plusAllowed() {
    if (!plusNeed || !window.PPPlus) return true;
    const P = window.PPPlus, teacher = plusNeed === 'teacher';
    let ok = true;
    if (P.has(teacher)) plusNote(`✨ You have PrintPals ${teacher ? 'Teacher' : 'Plus'} on this device. Thank you for supporting PrintPals! <a href="${P.PORTAL}" rel="noopener">Manage my subscription</a>`, 'ok');
    else {
      P.trialStart();
      const left = P.trialLeft();
      if (left > 0) plusNote(`🎁 <b>Your free Plus week: ${left} day${left > 1 ? 's' : ''} left.</b> No card needed. <a href="/plus">See plans</a>`, 'trial');
      else {
        ok = false;
        plusNote(P.offerHtml(teacher), 'locked');
        const go = plusBox.querySelector('.unlock-go');
        if (go) go.addEventListener('click', () => {
          const done = P.unlock(plusBox.querySelector('.unlock-code').value, teacher);
          plusBox.querySelector('.unlock-msg').textContent = done ? 'Thank you! Plus is now open on this device.' : 'That does not look like a receipt number. Please check your payment email and try again.';
          if (done) setTimeout(plusAllowed, 900);
        });
      }
    }
    document.body.classList.toggle('plus-locked', !ok);
    return ok;
  }
  plusAllowed();

  let timer = null;
  const soon = () => { clearTimeout(timer); timer = setTimeout(render, 180); };
  function render() {
    const p = paper();
    try { localStorage.setItem('pp-paper', p); } catch {}
    const pages = MAKERS[tool](values(), p);
    preview.innerHTML = pages.map((svg) => `<div class="sheet-wrap">${svg}</div>`).join('');
    const saving = inkBox && inkBox.checked;
    for (const s of preview.querySelectorAll('svg.sheet')) {
      if (saving) inkSave(s);
      if (easyBox && easyBox.checked) easyRead(s);
      // A hair smaller than the paper, so a page never spills onto an extra blank one.
      s.setAttribute('width', `${(s.dataset.w - 1).toFixed(1)}mm`);
      s.setAttribute('height', `${(s.dataset.h - 1.4).toFixed(1)}mm`);
    }
    if (count) count.textContent = pages.length === 1 ? '1 page' : `${pages.length} pages`;
    const first = preview.querySelector('svg.sheet');
    const orient = first && first.dataset.orient === 'landscape' ? 'landscape' : 'portrait';
    document.getElementById('pageStyle').textContent = `@page { size: ${PAPER[p].css} ${orient}; margin: 0; }`;
    preview.classList.toggle('landscape', orient === 'landscape');
  }

  // Routine charts: choosing a routine fills in its steps (still editable).
  const routine = form.querySelector('[name=routine]');
  const steps = form.querySelector('[name=steps]');
  if (routine && steps && typeof ROUTINES !== 'undefined') {
    const fill = () => { if (ROUTINES[routine.value]) steps.value = ROUTINES[routine.value].join('\n'); else if (routine.value === 'custom') steps.value = ''; };
    routine.addEventListener('change', fill);
    if (!steps.value.trim()) fill();
  }

  form.addEventListener('input', soon);
  form.addEventListener('change', soon);
  form.addEventListener('submit', (e) => e.preventDefault());
  // Wait until every picture on the sheet has loaded, so nothing prints blank.
  function picturesReady() {
    const srcs = [...new Set([...preview.querySelectorAll('image')].map((i) => i.getAttribute('href')).filter(Boolean))];
    const one = (src) => new Promise((done) => { const im = new Image(); im.onload = im.onerror = done; im.src = src; });
    return Promise.race([Promise.all(srcs.map(one)), new Promise((done) => setTimeout(done, 4000))]);
  }
  document.querySelectorAll('[data-action=print]').forEach((b) => b.addEventListener('click', () => {
    if (!plusAllowed()) { plusBox.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    render(); picturesReady().then(() => setTimeout(() => { window.print(); invite(); }, 80)); }));

  // A gentle invitation to Plus after a few free prints, at most once every five days, never for Plus families.
  function invite() {
    if (form.dataset.plus || !window.PPPlus || window.PPPlus.has()) return;
    const n = (+store.get('pp-prints') || 0) + 1; store.set('pp-prints', String(n));
    const last = +store.get('pp-invite-at') || 0;
    if (n < 3 || Date.now() - last < 5 * 864e5 || document.querySelector('.invite')) return;
    store.set('pp-invite-at', String(Date.now()));
    const child = (store.get('pp-child') || '').trim().slice(0, 20), m = new Date().getMonth();
    const who = child || 'your child';
    const offer = m === 8 || m === 9 ? ['🎃', `A whole Halloween fun pack for ${who}`, 'Colouring, puzzles, pumpkin faces, treat bag labels and a costume award, with their name on the cover.', '/halloween-activity-pack-for-kids']
      : m >= 10 ? ['🎄', `A Christmas Advent book for ${who}`, '24 days of family moments and activities, a letter to Santa, gift tags and more, with their name on every page.', '/christmas-advent-activity-book-for-kids']
      : ['📅', `A whole month planned for ${who}`, 'Four weeks of learning that gets a little harder each week, with their name on every page.', '/monthly-learning-plan'];
    const box = document.createElement('div');
    box.className = 'invite no-print';
    box.innerHTML = `<button type="button" class="invite-x" aria-label="Close">×</button><span class="invite-ico">${offer[0]}</span><div><b>You have printed ${n} sheets. Wonderful! 💛</b><p><strong>${offer[1]}?</strong> ${offer[2]}</p><a class="btn small" href="${offer[3]}">Try it free for 7 days →</a> <span class="invite-note">No card needed</span></div>`;
    box.querySelector('.invite-x').addEventListener('click', () => box.remove());
    preview.parentNode.insertBefore(box, preview.parentNode.querySelector('.preview-head'));
  }
  window.PrintPals = { render: () => render() };
  // "Make a new set" always gives a different sheet (a random pick can land on the same one by chance).
  document.querySelectorAll('[data-action=shuffle]').forEach((b) => b.addEventListener('click', () => {
    const before = preview.innerHTML;
    for (let i = 0; i < 6; i++) { seed = Math.floor(Math.random() * 1e9); render(); if (preview.innerHTML !== before) break; }
  }));

  // Pictures and fonts can arrive after the first drawing: draw again then.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
  render();
})();
