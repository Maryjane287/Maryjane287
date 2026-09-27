// Reviews from real buyers: list them for the website, and accept new ones
// from the review page (only with a paid order's link).
import { getStore } from '@netlify/blobs';
import { json, fail, HttpError } from '../lib/orders.mjs';
import { addReview, listReviews, canReview, hideToken } from '../lib/reviews.mjs';
import { mailReady, gmailSender } from '../lib/mail.mjs';

const stores = () => [getStore({ name: 'orders', consistency: 'strong' }), getStore({ name: 'reviews', consistency: 'strong' })];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export default async req => {
  const url = new URL(req.url);
  const [orders, reviews] = stores();
  try {
    if (req.method === 'GET' && url.searchParams.has('check')) return json(await canReview(orders, reviews, url.searchParams.get('check')));
    if (req.method === 'GET') {
      const data = await listReviews(reviews, { mag: url.searchParams.get('mag') || '' });
      return new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=60' } });
    }
    if (req.method !== 'POST') return json({ error: 'GET or POST only' }, 405);
    const body = await req.json().catch(() => { throw new HttpError(400, 'Bad request'); });
    const { key, review } = await addReview(orders, reviews, body);
    // Let the shop see every new review, with a one-tap link to hide it.
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    if (mailReady(process.env) && secret) {
      const origin = process.env.URL || url.origin;
      const hide = `${origin}/api/reviews/hide?k=${encodeURIComponent(key)}&t=${await hideToken(key, secret)}`;
      const send = await gmailSender(process.env);
      await send({
        to: process.env.GMAIL_USER,
        subject: `New ${review.rating} star review from ${review.name}`,
        html: `<p>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)} from <b>${esc(review.name)}</b>${review.place ? `, ${esc(review.place)}` : ''} (${esc(review.title)})</p><p>${esc(review.text)}</p>${review.photo ? `<p><img src="${origin}/api/reviews/photo?p=${encodeURIComponent(review.photo)}" width="300"></p>` : ''}<p>It is already on the website. Nothing to do, unless you want it removed: <a href="${hide}">hide this review</a>.</p>`,
      }).catch(e => console.error('Could not email the review:', e.message));
    }
    return json({ ok: true });
  } catch (e) { return fail(e); }
};

export const config = { path: '/api/reviews' };
