// A tiny voice note recorder: tap to record (up to a minute), listen back,
// record again, then upload. Used on the family note page and in the maker.
const TYPES = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/aac'];
const MAX_SECONDS = 60;

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const canRecord = () => !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);

// Builds the recorder inside `box`. onChange(blob | null) fires when a
// recording is ready or removed.
export function makeRecorder(box, { label = 'Record a voice note', hint = 'Up to a minute. You can listen back before you send it.', onChange = () => {} } = {}) {
  if (!canRecord()) { box.innerHTML = '<p class="small">Voice notes need a newer browser. Your written note still works perfectly.</p>'; return { clear() {} }; }
  let rec = null, chunks = [], timer = 0, secs = 0, url = '', stream = null;
  const draw = (state, extra = '') => {
    box.innerHTML = {
      idle: `<button type="button" class="rec-btn" data-rec="start"><i class="rec-dot"></i>${esc(label)}</button><p class="small rec-hint">${esc(hint)}</p>`,
      live: `<button type="button" class="rec-btn rec-live" data-rec="stop"><i class="rec-dot"></i>Recording <b class="rec-time">0:00</b>, tap to stop</button>`,
      done: `<div class="rec-done"><audio controls src="${url}"></audio><button type="button" class="btn btn-small btn-ghost" data-rec="again">Record again</button><button type="button" class="btn btn-small btn-ghost" data-rec="remove">Remove</button></div>`,
      err: `<p class="small rec-err">${esc(extra)}</p><button type="button" class="rec-btn" data-rec="start"><i class="rec-dot"></i>Try again</button>`,
    }[state];
  };
  const stopAll = () => { clearInterval(timer); stream?.getTracks().forEach(t => t.stop()); stream = null; };
  const start = async () => {
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch { return draw('err', 'We could not reach your microphone. Please allow it in your browser and try again.'); }
    const type = TYPES.find(t => MediaRecorder.isTypeSupported?.(t)) || '';
    rec = new MediaRecorder(stream, type ? { mimeType: type, audioBitsPerSecond: 64000 } : {});
    chunks = []; secs = 0;
    rec.ondataavailable = e => e.data.size && chunks.push(e.data);
    rec.onstop = () => {
      stopAll();
      const blob = new Blob(chunks, { type: (rec.mimeType || type || 'audio/webm').split(';')[0] });
      if (blob.size < 800) return draw('err', 'That recording came through empty. Please try again.');
      if (url) URL.revokeObjectURL(url);
      url = URL.createObjectURL(blob);
      draw('done');
      onChange(blob);
    };
    rec.start(250);
    draw('live');
    timer = setInterval(() => {
      secs++;
      const t = box.querySelector('.rec-time');
      if (t) t.textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
      if (secs >= MAX_SECONDS) rec.stop();
    }, 1000);
  };
  box.addEventListener('click', e => {
    const act = e.target.closest('[data-rec]')?.dataset.rec;
    if (act === 'start' || act === 'again') { if (act === 'again') onChange(null); start(); }
    if (act === 'stop' && rec?.state === 'recording') rec.stop();
    if (act === 'remove') { onChange(null); draw('idle'); }
  });
  draw('idle');
  return { clear() { onChange(null); draw('idle'); } };
}

// Uploads a recording and returns its id for the code printed in the magazine.
export async function uploadVoice(blob) {
  const buf = new Uint8Array(await blob.arrayBuffer());
  let bin = '';
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  const res = await fetch('/api/voice', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ audio: btoa(bin), type: blob.type }) });
  const out = await res.json().catch(() => ({}));
  if (!res.ok || !out.id) throw new Error(out.error || 'Your voice note did not upload. Please try again.');
  return out.id;
}

// Shrinks a photo on the device so it uploads quickly (and fits a note card).
export async function smallPhoto(file, max = 900) {
  const img = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(img.width, img.height));
  const c = Object.assign(document.createElement('canvas'), { width: Math.round(img.width * k), height: Math.round(img.height * k) });
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.78);
}
