// Lemon Squeezy calls this when a digital order is paid or refunded, so the
// buyer can download their magazine straight away.
import { getStore } from '@netlify/blobs';
import { verifyLemonSqueezy, handleLemonSqueezy, json } from '../lib/orders.mjs';

export default async req => {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);
  const raw = await req.text();
  if (!(await verifyLemonSqueezy(raw, req.headers.get('x-signature'), process.env.LEMON_SQUEEZY_WEBHOOK_SECRET))) return json({ error: 'Bad signature' }, 401);
  let event;
  try { event = JSON.parse(raw); } catch { return json({ error: 'Bad JSON' }, 400); }
  const result = await handleLemonSqueezy(getStore({ name: 'orders', consistency: 'strong' }), event);
  return json({ ok: true, result });
};

export const config = { path: '/api/ls-webhook' };
