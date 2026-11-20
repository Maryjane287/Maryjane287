// Voice notes that play when someone scans the code printed in a magazine:
// a family member's message, or the buyer reading their own letter aloud.
// They are kept for good (the code is printed on paper), and only someone
// holding the long random id in the code can play one.
import { randomBytes } from 'node:crypto';
import { HttpError } from './orders.mjs';

export const VOICE_TYPES = ['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg', 'audio/aac', 'audio/wav', 'audio/x-m4a'];
export const MAX_VOICE = 3 * 1024 * 1024; // about two minutes on a phone, far more than a minute's note

export const voiceIdOk = v => /^[a-z0-9]{20}$/.test(String(v || ''));
const newId = () => Array.from(randomBytes(20), b => 'abcdefghijklmnopqrstuvwxyz0123456789'[b % 36]).join('');

export async function saveVoice(store, { audio, type } = {}) {
  const t = String(type || '').split(';')[0].trim().toLowerCase();
  if (!VOICE_TYPES.includes(t)) throw new HttpError(400, 'Please record your voice note again.');
  const buf = Buffer.from(String(audio || ''), 'base64');
  if (buf.length < 800) throw new HttpError(400, 'That recording came through empty. Please try again.');
  if (buf.length > MAX_VOICE) throw new HttpError(413, 'That recording is a little long. Please keep it under a minute.');
  const id = newId();
  await store.set(id, new Blob([buf], { type: t }), { metadata: { type: t, at: Date.now() } });
  return { id };
}

export async function getVoice(store, id) {
  if (!voiceIdOk(id)) throw new HttpError(400, 'This code is not complete.');
  const out = await store.getWithMetadata(id, { type: 'arrayBuffer' });
  if (!out || !out.data) throw new HttpError(404, 'We could not find this voice note.');
  return { data: new Uint8Array(out.data), type: out.metadata?.type || 'audio/webm' };
}

// Phones (Safari above all) only play audio that can be fetched in ranges.
export function audioResponse({ data, type }, range) {
  const size = data.length;
  const head = { 'content-type': type, 'accept-ranges': 'bytes', 'cache-control': 'private, max-age=31536000, immutable' };
  const m = /^bytes=(\d*)-(\d*)$/.exec(String(range || '').trim());
  if (!m || (!m[1] && !m[2])) return new Response(data, { headers: { ...head, 'content-length': String(size) } });
  let start = m[1] ? Number(m[1]) : Math.max(0, size - Number(m[2]));
  let end = m[1] && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
  if (start >= size || start > end) return new Response(null, { status: 416, headers: { ...head, 'content-range': `bytes */${size}` } });
  return new Response(data.slice(start, end + 1), { status: 206, headers: { ...head, 'content-range': `bytes ${start}-${end}/${size}`, 'content-length': String(end - start + 1) } });
}
