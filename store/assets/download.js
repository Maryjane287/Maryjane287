// After Lemon Squeezy takes payment, this page waits for the payment to be
// confirmed and then shows the buyer their download buttons.
const $ = s => document.querySelector(s);
const params = new URLSearchParams(location.search);
let last = null;
try { last = JSON.parse(localStorage.getItem('order:last')); } catch {}
const id = params.get('id') || last?.id;

const title = $('#dl-title'), lead = $('#dl-lead'), btns = $('#dl-btns');

function ready(data) {
  title.textContent = 'Stop the press! Your magazine is ready.';
  lead.textContent = last?.title ? `${last.title}, all 24 pages, made just now.` : 'All 24 pages, made just now.';
  btns.innerHTML = `<a class="btn btn-big" href="${data.pdf}&dl=1">Download the magazine</a>${data.cards ? `<a class="btn btn-big btn-ghost" href="${data.cards}&dl=1">Download the card set</a>` : ''}`;
  btns.hidden = false;
}

function later() {
  title.textContent = 'Thank you! Your magazine is on its way.';
  lead.textContent = 'We could not show the download on this device, but it is coming to your inbox. If it has not arrived within a few hours, just reply to your receipt email.';
}

async function check(tries = 0) {
  if (!id) return later();
  try {
    const res = await fetch(`/api/order/status?id=${encodeURIComponent(id)}`);
    const data = await res.json();
    if (data.paid) return ready(data);
  } catch {}
  if (tries < 40) setTimeout(() => check(tries + 1), 3000);
  else later();
}
check();
