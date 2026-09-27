// Runs every day and deletes order files (which contain the buyer's photos)
// once they are 30 days old.
import { getStore } from '@netlify/blobs';
import { cleanOldOrders } from '../lib/orders.mjs';

export default async () => {
  const removed = await cleanOldOrders(getStore({ name: 'orders', consistency: 'strong' }));
  console.log(`Removed ${removed} old order files`);
};

export const config = { schedule: '@daily' };
