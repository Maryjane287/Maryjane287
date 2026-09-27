// Shows real buyers' reviews wherever the page has a [data-reviews] section.
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const stars = n => `<span class="stars" aria-label="${n} out of 5 stars">${'★'.repeat(Math.round(n))}<i>${'★'.repeat(5 - Math.round(n))}</i></span>`;
const when = t => new Date(t).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

for (const sec of document.querySelectorAll('[data-reviews]')) {
  const mag = sec.dataset.reviews;
  fetch(`/api/reviews${mag ? `?mag=${encodeURIComponent(mag)}` : ''}`).then(r => (r.ok ? r.json() : null)).then(data => {
    if (!data?.count) return; // no reviews yet: the section stays hidden
    sec.hidden = false;
    const sum = sec.querySelector('.rev-summary');
    sum.innerHTML = `${stars(data.average)} <b>${data.average.toFixed(1)} out of 5</b> <span>from ${data.count} ${data.count === 1 ? 'review' : 'reviews'} by real buyers</span>`;
    sum.hidden = false;
    const list = sec.querySelector('.rev-list');
    list.innerHTML = data.items.slice(0, Number(sec.dataset.max) || 9).map(r => `
      <figure class="rev">
        ${r.photo ? `<img src="${esc(r.photo)}" alt="${esc(r.name)}'s magazine" loading="lazy">` : ''}
        <figcaption>${stars(r.rating)}<blockquote>${esc(r.text)}</blockquote>
        <p class="rev-who"><b>${esc(r.name)}</b>${r.place ? `, ${esc(r.place)}` : ''} <span class="rev-verified">Verified buyer</span></p>
        <p class="rev-meta">${esc((r.title || '').split(':')[0])}${r.title ? ' &middot; ' : ''}${when(r.at)}</p></figcaption>
      </figure>`).join('');
    list.hidden = false;
  }).catch(() => {});
}
