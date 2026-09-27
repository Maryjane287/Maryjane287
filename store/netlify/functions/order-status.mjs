// The download page asks this whether an order is paid yet.
import { getStore } from '@netlify/blobs';
import { orderStatus, json, fail } from '../lib/orders.mjs';

export default async req => {
  try {
    const url = new URL(req.url);
    const origin = process.env.URL || url.origin;
    return json(await orderStatus(getStore({ name: 'orders', consistency: 'strong' }), url.searchParams.get('id'), origin));
  } catch (e) { return fail(e); }
};

export const config = { path: '/api/order/status' };
