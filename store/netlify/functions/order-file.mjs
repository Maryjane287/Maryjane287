// Serves a finished magazine PDF (or its cover image) by its private order id.
import { getStore } from '@netlify/blobs';
import { getFile } from '../lib/orders.mjs';

export default async req => {
  const url = new URL(req.url);
  const f = url.searchParams.get('f') === 'cover' ? 'cover' : 'pdf';
  const file = await getFile(getStore({ name: 'orders', consistency: 'strong' }), url.searchParams.get('id'), f);
  if (!file) return new Response('Not found', { status: 404 });
  return new Response(file.buf, { headers: {
    'content-type': file.type,
    'content-disposition': `inline; filename="cover-story-${f === 'cover' ? 'cover.jpg' : 'magazine.pdf'}"`,
    'cache-control': 'private, max-age=3600',
    'x-robots-tag': 'noindex',
  } });
};

export const config = { path: '/api/order/file' };
