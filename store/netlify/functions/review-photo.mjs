// Serves the photos buyers add to their reviews.
import { getStore } from '@netlify/blobs';

export default async req => {
  const p = new URL(req.url).searchParams.get('p') || '';
  if (!/^\d{13}-[0-9a-f]{8}$/.test(p)) return new Response('Not found', { status: 404 });
  const buf = await getStore({ name: 'reviews', consistency: 'strong' }).get(`photo/${p}`, { type: 'arrayBuffer' });
  if (!buf) return new Response('Not found', { status: 404 });
  const b = new Uint8Array(buf);
  return new Response(buf, { headers: { 'content-type': b[0] === 0x89 ? 'image/png' : 'image/jpeg', 'cache-control': 'public, max-age=86400' } });
};

export const config = { path: '/api/reviews/photo' };
