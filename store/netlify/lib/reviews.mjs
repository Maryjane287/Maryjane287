// Customer reviews. Only people who really bought a magazine can leave one:
// the link in their "your magazine is ready" email carries their order id,
// and we check that order was paid. Reviews appear straight away; the shop
// gets an email with each one and a one-tap link to hide it.
import { idOk, HttpError } from './orders.mjs';

const MAX_PHOTO = 4 * 1024 * 1024;
const clean = (s, n) => String(s || '').replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const isImage = b => b.length > 3 && ((b[0] === 0xff && b[1] === 0xd8) || (b[0] === 0x89 && b[1] === 0x50));

// Signed links let the shop hide a review without logging in anywhere.
export async function hideToken(key, secret) {
  const { createHmac } = await import('node:crypto');
  return createHmac('sha256', String(secret)).update(`hide:${key}`).digest('hex').slice(0, 32);
}

export async function canReview(orders, reviews, id) {
  if (!idOk(id)) return { ok: false, why: 'This review link is not quite right.' };
  if (!(await orders.get(`${id}/paid`, { type: 'text' }))) return { ok: false, why: 'We could not find a paid order for this link.' };
  if (await reviews.get(`by-order/${id}`, { type: 'text' })) return { ok: false, why: 'Thank you, you have already left a review for this order.' };
  const info = JSON.parse((await orders.get(`${id}/order.json`, { type: 'text' })) || '{}');
  return { ok: true, title: info.title || '', mag: info.mag || '' };
}

// body: { id, rating, name, place, text, photo (base64 JPEG/PNG, optional) }
export async function addReview(orders, reviews, body, now = Date.now()) {
  const check = await canReview(orders, reviews, body.id);
  if (!check.ok) throw new HttpError(403, check.why);
  const rating = Math.round(Number(body.rating));
  if (!(rating >= 1 && rating <= 5)) throw new HttpError(400, 'Please choose how many stars.');
  const text = clean(body.text, 600);
  const name = clean(body.name, 40);
  if (text.length < 3 || !name) throw new HttpError(400, 'Please add your name and a few words.');
  const mag = /^[a-z0-9-]{2,60}$/.test(check.mag || '') ? check.mag : '';
  const key = `r/${String(9999999999999 - now).padStart(13, '0')}-${body.id.slice(0, 8)}`;
  let photo = '';
  if (body.photo) {
    const bytes = Buffer.from(String(body.photo), 'base64');
    if (bytes.length > MAX_PHOTO || !isImage(bytes)) throw new HttpError(400, 'The photo must be a JPEG or PNG under 4MB.');
    photo = `photo/${key.slice(2)}`;
    await reviews.set(photo, bytes);
  }
  const review = { rating, name, place: clean(body.place, 40), text, mag, title: clean(check.title, 140), photo: photo ? photo.slice(6) : '', at: now };
  await reviews.set(key, JSON.stringify(review));
  await reviews.set(`by-order/${body.id}`, key);
  return { key, review };
}

// Newest first. With mag, only that magazine's reviews (all reviews count
// towards the overall star rating).
export async function listReviews(reviews, { mag = '', limit = 30 } = {}) {
  const { blobs } = await reviews.list({ prefix: 'r/' });
  const keys = blobs.map(b => b.key).sort();
  const all = [];
  for (const key of keys) {
    const r = JSON.parse((await reviews.get(key, { type: 'text' })) || 'null');
    if (r && !r.hidden) all.push(r);
  }
  const count = all.length;
  const average = count ? Math.round((all.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10 : 0;
  const mine = mag ? all.filter(r => r.mag === mag) : all;
  // A magazine with few reviews of its own also shows the others, its own first.
  const items = (mine.length >= 3 || !mag ? mine : [...mine, ...all.filter(r => r.mag !== mag)]).slice(0, limit)
    .map(({ rating, name, place, text, title, photo, at, mag: m }) => ({ rating, name, place, text, title, at, mag: m, photo: photo ? `/api/reviews/photo?p=${encodeURIComponent(photo)}` : '' }));
  return { count, average, items };
}

export async function hideReview(reviews, key, token, secret) {
  if (!/^r\/\d{13}-[0-9a-f]{8}$/.test(key || '') || !secret || token !== (await hideToken(key, secret))) throw new HttpError(403, 'This link is not valid.');
  const r = JSON.parse((await reviews.get(key, { type: 'text' })) || 'null');
  if (!r) throw new HttpError(404, 'That review has gone.');
  r.hidden = true;
  await reviews.set(key, JSON.stringify(r));
  if (r.photo) await reviews.delete(`photo/${r.photo}`);
  return r;
}
