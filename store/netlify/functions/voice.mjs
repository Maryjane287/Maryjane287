// Voice notes: POST saves one (from the family link or the maker), GET plays
// one (from the code printed in the magazine).
import { getStore } from '@netlify/blobs';
import { json, fail, HttpError } from '../lib/orders.mjs';
import { saveVoice, getVoice, audioResponse } from '../lib/voice.mjs';

export default async req => {
  const url = new URL(req.url);
  const store = getStore({ name: 'voices', consistency: 'strong' });
  try {
    if (req.method === 'GET') return audioResponse(await getVoice(store, url.searchParams.get('v')), req.headers.get('range'));
    if (req.method !== 'POST') return json({ error: 'GET or POST only' }, 405);
    const body = await req.json().catch(() => { throw new HttpError(400, 'Bad request'); });
    return json(await saveVoice(store, body));
  } catch (e) { return fail(e); }
};

export const config = { path: '/api/voice' };
