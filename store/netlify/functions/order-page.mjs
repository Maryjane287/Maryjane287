// Receives one rendered page (JPEG) of a buyer's magazine.
import { getStore } from '@netlify/blobs';
import { savePage, json, fail } from '../lib/orders.mjs';

export default async req => {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);
  try {
    const url = new URL(req.url);
    const bytes = new Uint8Array(await req.arrayBuffer());
    await savePage(getStore({ name: 'orders', consistency: 'strong' }), url.searchParams.get('id'), Number(url.searchParams.get('n')), bytes);
    return json({ ok: true });
  } catch (e) { return fail(e); }
};

export const config = { path: '/api/order/page' };
