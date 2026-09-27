// Serves a finished magazine PDF, its card set or its cover image by its private
// order id. Digital orders unlock once they are paid.
import { getStore } from '@netlify/blobs';
import { getFile, isLocked } from '../lib/orders.mjs';

const NAMES = { cover: 'cover.jpg', cards: 'card-set.pdf', pdf: 'magazine.pdf' };

export default async req => {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const f = NAMES[url.searchParams.get('f')] ? url.searchParams.get('f') : 'pdf';
  const store = getStore({ name: 'orders', consistency: 'strong' });
  if (f !== 'cover' && await isLocked(store, id, process.env)) return new Response('This magazine unlocks as soon as payment is complete.', { status: 402 });
  const file = await getFile(store, id, f);
  if (!file) return new Response('Not found', { status: 404 });
  return new Response(file.buf, { headers: {
    'content-type': file.type,
    'content-disposition': `${url.searchParams.get('dl') ? 'attachment' : 'inline'}; filename="cover-story-${NAMES[f]}"`,
    'cache-control': 'private, max-age=3600',
    'x-robots-tag': 'noindex',
  } });
};

export const config = { path: '/api/order/file' };
