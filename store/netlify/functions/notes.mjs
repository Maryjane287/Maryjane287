// Family notes for a magazine that is being made: GET lists the notes on a
// board (for the maker), POST adds one (from the family's link).
import { getStore } from '@netlify/blobs';
import { json, fail, HttpError } from '../lib/orders.mjs';
import { addNote, listNotes } from '../lib/notes.mjs';

export default async req => {
  const url = new URL(req.url);
  const store = getStore({ name: 'notes', consistency: 'strong' });
  try {
    if (req.method === 'GET') return json({ notes: await listNotes(store, url.searchParams.get('b')) });
    if (req.method !== 'POST') return json({ error: 'GET or POST only' }, 405);
    const body = await req.json().catch(() => { throw new HttpError(400, 'Bad request'); });
    return json(await addNote(store, body));
  } catch (e) { return fail(e); }
};

export const config = { path: '/api/notes' };
