// The "hide this review" link in the shop's review emails.
import { getStore } from '@netlify/blobs';
import { hideReview } from '../lib/reviews.mjs';

const page = (title, text) => new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><body style="font-family:Helvetica,Arial,sans-serif;background:#fff4ec;color:#1d1a2f;text-align:center;padding:60px 20px"><h1 style="font-family:Georgia,serif;font-weight:400">${title}</h1><p>${text}</p><p><a href="/" style="color:#ff6f59">Back to the shop</a></p></body>`, { headers: { 'content-type': 'text/html; charset=utf-8' } });

export default async req => {
  const u = new URL(req.url).searchParams;
  try {
    await hideReview(getStore({ name: 'reviews', consistency: 'strong' }), u.get('k'), u.get('t'), process.env.LEMON_SQUEEZY_WEBHOOK_SECRET);
    return page('Review hidden', 'It no longer shows on the website. It can take a minute to disappear everywhere.');
  } catch (e) {
    return page('Could not hide it', e.message);
  }
};

export const config = { path: '/api/reviews/hide' };
