// Stitches the uploaded pages into the finished PDF. For printed copies it also
// creates the Peecho checkout the buyer is sent to.
import { getStore } from '@netlify/blobs';
import { buildPdf, createCheckout, json, fail, HttpError } from '../lib/orders.mjs';
import site from '../../data/site.json' with { type: 'json' };

export default async req => {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);
  try {
    const { id, kind, finish, title } = await req.json().catch(() => { throw new HttpError(400, 'Bad request'); });
    const origin = process.env.URL || new URL(req.url).origin;
    const store = getStore({ name: 'orders', consistency: 'strong' });
    await buildPdf(store, id, title);
    const out = { pdf: `${origin}/api/order/file?id=${id}&f=pdf` };
    if (kind === 'print') out.checkout = await createCheckout({ env: process.env, origin, id, title, finish, offerings: site.peecho?.offerings });
    return json(out);
  } catch (e) { return fail(e); }
};

export const config = { path: '/api/order/finish' };
