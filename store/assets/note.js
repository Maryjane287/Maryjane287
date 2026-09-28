// The page family members open from a notes link: they write one line for the
// magazine, which the person making it pulls into their magazine.
const $ = s => document.querySelector(s);
const q = new URLSearchParams(location.search);
const board = q.get('b') || '';
const who = (q.get('w') || '').trim().slice(0, 40);
const by = (q.get('f') || '').trim().slice(0, 40);
const title = (q.get('m') || '').trim().slice(0, 60);
const form = $('#note-form');
const many = /&| and /i.test(who) || /^the\s.+s$/i.test(who);
const whose = who ? (/s$/i.test(who) ? `${who}'` : `${who}'s`) : 'the';
const say = t => { $('#note-msg').textContent = t; $('#note-msg').hidden = false; };

if (who) $('#note-title').textContent = `${who} ${many ? 'are' : 'is'} getting a magazine`;
$('#note-intro').textContent = `${by ? `${by} ${/&| and /i.test(by) ? 'are' : 'is'} making` : "We're making"} ${title ? `"${title}"` : 'a magazine'} for ${who || 'someone special'}, and it would not be complete without a few words from you. Your note is printed inside, signed with your name.`;
if (!/^[a-z0-9]{16,40}$/.test(board)) { form.hidden = true; say('This link is not complete. Please ask for the link again.'); $('#note-msg').hidden = false; form.after($('#note-msg')); }

const preview = () => {
  const p = $('#note-preview');
  p.textContent = form.msg.value.trim() || form.msg.placeholder;
  const b = document.createElement('b');
  b.textContent = form.from.value.trim() || form.from.placeholder;
  p.append(b);
  $('#note-count').textContent = `${form.msg.value.length} / 110`;
};
form.addEventListener('input', preview);

form.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true; btn.textContent = 'Sending...';
  try {
    const res = await fetch('/api/notes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ board, from: form.from.value, msg: form.msg.value }) });
    const out = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(out.error || 'Something went wrong.');
    form.hidden = true;
    $('#note-done-lead').textContent = `It will be printed in ${whose} magazine, signed "${form.from.value.trim()}".`;
    $('#note-done').hidden = false;
    scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    say(err.message || 'Sorry, that did not send. Please try again.');
    btn.disabled = false; btn.textContent = 'Add my note';
  }
});
