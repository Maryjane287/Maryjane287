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

  let timer = null;
  function render() {
    const p = paper();
    try { localStorage.setItem('pp-paper', p); } catch {}
    const pages = MAKERS[tool](values(), p);
    preview.innerHTML = pages.map((svg) => `<div class="sheet-wrap">${svg}</div>`).join('');
    for (const s of preview.querySelectorAll('svg.sheet')) {
      // A hair smaller than the paper, so a page never spills onto an extra blank one.
      s.setAttribute('width', `${(s.dataset.w - 1).toFixed(1)}mm`);
      s.setAttribute('height', `${(s.dataset.h - 1.4).toFixed(1)}mm`);
    }
    if (count) count.textContent = pages.length === 1 ? '1 page' : `${pages.length} pages`;
    document.getElementById('pageStyle').textContent = `@page { size: ${PAPER[p].css} portrait; margin: 0; }`;
  }
  const soon = () => { clearTimeout(timer); timer = setTimeout(render, 180); };

  form.addEventListener('input', soon);
  form.addEventListener('change', soon);
  form.addEventListener('submit', (e) => e.preventDefault());
  document.querySelectorAll('[data-action=print]').forEach((b) => b.addEventListener('click', () => { render(); setTimeout(() => window.print(), 60); }));
  document.querySelectorAll('[data-action=shuffle]').forEach((b) => b.addEventListener('click', () => { seed = Math.floor(Math.random() * 1e9); render(); }));

  // Pictures and fonts can arrive after the first drawing: draw again then.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
  render();
})();
