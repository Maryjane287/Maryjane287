// Notes from family: the buyer shares a private link, and each person who
// opens it writes one line for the magazine. Notes live on a "board" whose id
// is the secret in the link; the maker reads them back into the note spaces.
import { HttpError } from './orders.mjs';

export const MAX_NOTES = 12;
const clean = (s, n) => String(s ?? '').replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const checkBoard = b => { if (!/^[a-z0-9]{16,40}$/.test(String(b || ''))) throw new HttpError(400, 'This link is not complete. Ask for the link again.'); return b; };

export async function listNotes(store, board) {
  checkBoard(board);
  const { blobs } = await store.list({ prefix: `${board}/` });
  const notes = await Promise.all(blobs.map(async ({ key }) => ({ id: key.split('/')[1], ...JSON.parse((await store.get(key, { type: 'text' })) || '{}') })));
  return notes.filter(n => n.msg).sort((a, b) => a.at - b.at).map(({ id, from, msg }) => ({ id, from, msg }));
}

export async function addNote(store, { board, from, msg } = {}) {
  checkBoard(board);
  const note = { from: clean(from, 30), msg: clean(msg, 110), at: Date.now() };
  if (!note.from) throw new HttpError(400, 'Please add your name.');
  if (note.msg.length < 2) throw new HttpError(400, 'Please write your little note.');
  const { blobs } = await store.list({ prefix: `${board}/` });
  if (blobs.length >= MAX_NOTES) throw new HttpError(409, 'This magazine already has all the notes it can hold. Thank you!');
  const id = `${note.at.toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  await store.set(`${board}/${id}`, JSON.stringify(note));
  return { id };
}

// Notes are only needed while the magazine is being made; keep them 60 days.
export async function cleanOldNotes(store, now = Date.now(), days = 60) {
  const { blobs } = await store.list();
  let removed = 0;
  for (const { key } of blobs) {
    const at = parseInt(key.split('/')[1], 36);
    if (at && now - at > days * 864e5) { await store.delete(key); removed++; }
  }
  return removed;
}
