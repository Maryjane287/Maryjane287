// Renders all 24 finished pages of a buyer's magazine in their own browser and
// uploads them, so the website can make the print-ready PDF without any help.
import { renderFullMagazine, renderCardSet } from './covers.js';

const LIB = 'https://cdn.jsdelivr.net/npm/modern-screenshot@4.6.0/+esm';
const WIDTH = 794;      // A4 width in CSS pixels
// About 290 dpi on computers. Phones have far less memory for pictures, so
// they use a little less (about 240 dpi, still sharp in print).
const SCALE = matchMedia('(pointer: coarse)').matches ? 2.5 : 3;

// Older phones lack crypto.randomUUID, so make the same kind of id by hand.
const newId = () => crypto.randomUUID ? crypto.randomUUID() : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));

async function upload(id, n, blob, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(`/api/order/page?id=${id}&n=${n}`, { method: 'POST', headers: { 'content-type': 'image/jpeg' }, body: blob });
      if (res.ok) return;
      throw new Error(`upload ${res.status}`);
    } catch (e) {
      if (i >= tries) throw e;
      await new Promise(r => setTimeout(r, 800 * i));
    }
  }
}

export async function renderAndUpload({ mag, values, opts, cards = false, onProgress = () => {} }) {
  const { domToBlob } = await import(LIB);
  const id = newId();
  const pages = [...renderFullMagazine(mag, values, opts), ...(cards ? renderCardSet(mag, values, opts) : [])];
  const host = document.createElement('div');
  host.setAttribute('aria-hidden', 'true');
  host.style.cssText = `position:fixed;left:-${WIDTH * 2}px;top:0;width:${WIDTH}px;pointer-events:none`;
  document.body.append(host);
  try {
    await document.fonts.ready;
    for (let i = 0; i < pages.length; i++) {
      host.innerHTML = pages[i];
      const node = host.firstElementChild;
      await Promise.all([...node.querySelectorAll('img')].map(img => img.decode().catch(() => {})));
      const blob = await domToBlob(node, { scale: SCALE, type: 'image/jpeg', quality: 0.9, backgroundColor: '#ffffff', width: WIDTH, height: Math.round(WIDTH * 297 / 210) });
      await upload(id, i + 1, blob);
      onProgress(i + 1, pages.length);
    }
  } finally {
    host.remove();
  }
  return id;
}

export async function finishOrder(body) {
  const res = await fetch('/api/order/finish', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `finish ${res.status}`);
  return data;
}
