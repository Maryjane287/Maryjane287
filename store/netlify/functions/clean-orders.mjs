// Runs every day and deletes order files (which contain the buyer's photos)
// once they are 30 days old.
import { getStore } from '@netlify/blobs';
import { cleanOldOrders } from '../lib/orders.mjs';
import { cleanOldNotes } from '../lib/notes.mjs';

export default async () => {
  const removed = await cleanOldOrders(getStore({ name: 'orders', consistency: 'strong' }));
  console.log(`Removed ${removed} old order files`);
  console.log(`Removed ${await cleanOldNotes(getStore({ name: 'notes', consistency: 'strong' }))} old family notes`);
};

export const config = { schedule: '@daily' };
