// The page a printed code opens: one big button that plays the voice note.
const $ = s => document.querySelector(s);
const q = new URLSearchParams(location.search);
const v = q.get('v') || '';
const from = (q.get('f') || '').trim().slice(0, 40);
const audio = $('#listen-audio');
const btn = $('#listen-play');
const msg = t => { $('#listen-msg').textContent = t; };

if (from) $('#listen-title').textContent = `A voice note from ${from}`;
if (!/^[a-z0-9]{20}$/.test(v)) { btn.hidden = true; msg('This code is not complete. Try scanning it again.'); }
else audio.src = `/api/voice?v=${v}`;

btn.addEventListener('click', () => { audio.paused ? audio.play().catch(() => msg('That did not play. Please try again.')) : audio.pause(); });
audio.addEventListener('play', () => { btn.classList.add('on'); msg('Playing...'); });
audio.addEventListener('pause', () => { btn.classList.remove('on'); });
audio.addEventListener('ended', () => { btn.classList.remove('on'); msg('Tap to hear it again.'); });
audio.addEventListener('timeupdate', () => { $('#listen-fill').style.width = `${audio.duration ? (audio.currentTime / audio.duration) * 100 : 0}%`; });
audio.addEventListener('error', () => { if (v) { btn.hidden = true; msg('We could not find this voice note. Please check the code, or contact us and we will help.'); } });
