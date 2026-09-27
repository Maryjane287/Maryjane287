// Order files: each buyer's browser renders their 24 finished pages and uploads
// them here. We stitch them into the print-ready PDF and, for printed copies,
// create a Peecho publication so the buyer can pay Peecho directly.
import { PDFDocument } from 'pdf-lib';

export const PAGES = 24;
const A4 = [595.28, 841.89]; // points
const MAX_PAGE_BYTES = 5 * 1024 * 1024;

export const idOk = id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(String(id || ''));

const isJpeg = b => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;

export async function savePage(store, id, n, bytes) {
  if (!idOk(id)) throw new HttpError(400, 'Bad order id');
  if (!Number.isInteger(n) || n < 1 || n > PAGES) throw new HttpError(400, 'Bad page number');
  if (!bytes.length || bytes.length > MAX_PAGE_BYTES || !isJpeg(bytes)) throw new HttpError(400, 'Page must be a JPEG under 5MB');
  if (await store.get(`${id}/magazine.pdf`, { type: 'arrayBuffer' })) throw new HttpError(409, 'Order already finished');
  await store.set(`${id}/p${n}.jpg`, bytes);
}

// Stitch the uploaded pages into one A4 PDF. Page 1 is kept as the cover image
// for the Peecho checkout; the other page images are removed once the PDF exists.
export async function buildPdf(store, id, title = 'Cover Story magazine') {
  if (!idOk(id)) throw new HttpError(400, 'Bad order id');
  const existing = await store.get(`${id}/magazine.pdf`, { type: 'arrayBuffer' });
  if (existing) return existing.byteLength;
  const pdf = await PDFDocument.create();
  pdf.setTitle(title);
  pdf.setAuthor('Cover Story');
  for (let n = 1; n <= PAGES; n++) {
    const buf = await store.get(`${id}/p${n}.jpg`, { type: 'arrayBuffer' });
    if (!buf) throw new HttpError(400, `Page ${n} is missing`);
    const img = await pdf.embedJpg(new Uint8Array(buf));
    const page = pdf.addPage(A4);
    page.drawImage(img, { x: 0, y: 0, width: A4[0], height: A4[1] });
  }
  const bytes = await pdf.save();
  await store.set(`${id}/magazine.pdf`, bytes);
  const cover = await store.get(`${id}/p1.jpg`, { type: 'arrayBuffer' });
  await store.set(`${id}/cover.jpg`, cover);
  for (let n = 1; n <= PAGES; n++) await store.delete(`${id}/p${n}.jpg`);
  return bytes.length;
}

export async function getFile(store, id, f) {
  if (!idOk(id)) return null;
  const key = f === 'cover' ? `${id}/cover.jpg` : `${id}/magazine.pdf`;
  const buf = await store.get(key, { type: 'arrayBuffer' });
  return buf ? { buf, type: f === 'cover' ? 'image/jpeg' : 'application/pdf' } : null;
}

// Create a one-off Peecho publication for this magazine and return the link to
// Peecho's checkout, where the buyer adds their address and pays Peecho directly.
export async function createCheckout({ env, origin, id, title, finish, offerings, fetchImpl = fetch }) {
  if (!env.PEECHO_API_KEY || !env.PEECHO_BUTTON_KEY) throw new HttpError(503, 'Printing is not set up yet');
  const host = env.PEECHO_ENV === 'test' ? 'https://test.www.peecho.com' : 'https://www.peecho.com';
  const file = f => `${origin}/api/order/file?id=${id}&f=${f}`;
  const offering = offerings?.[finish] || offerings?.glossy;
  const body = {
    apiKey: env.PEECHO_API_KEY,
    buttonKey: env.PEECHO_BUTTON_KEY,
    currency: env.PEECHO_CURRENCY || 'GBP',
    locale: 'en',
    order: {
      reference: id,
      product: {
        title: String(title || 'Cover Story magazine').slice(0, 120),
        source: { file: { src: file('pdf'), pages: PAGES, dimensions: { width: 210, height: 297 } } },
        thumbnail: { src: file('cover'), width: 210, height: 297 },
      },
    },
    ...(offering ? { fixedOfferingId: Number(offering) } : {}),
    redirect: {
      thankyou: { href: `${origin}/thanks/?printed=1` },
      cancellation: { href: `${origin}/make/` },
      error: { href: `${origin}/make/?print_error=1` },
    },
    enableSecureCheckout: true,
  };
  const res = await fetchImpl(`${host}/rest/v2/publication/create`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new HttpError(502, `Peecho said ${res.status}: ${text.slice(0, 300)}`);
  let data;
  try { data = JSON.parse(text); } catch { data = text.trim(); }
  if (data && data.secure_publication_id && data.token) return `${host}/checkout/print/en/${data.secure_publication_id}?token=${data.token}`;
  if (/^\d+$/.test(String(data))) return `${host}/print/${data}`;
  throw new HttpError(502, `Unexpected reply from Peecho: ${text.slice(0, 200)}`);
}

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
export const fail = e => json({ error: e.message || 'Something went wrong' }, e.status || 500);
