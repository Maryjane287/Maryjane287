// The review page: only works from the link in a buyer's email.
const $ = s => document.querySelector(s);
const id = new URLSearchParams(location.search).get('id') || '';
const form = $('#review-form');
const say = t => { $('#rev-msg').textContent = t; $('#rev-msg').hidden = false; };

fetch(`/api/reviews?check=${encodeURIComponent(id)}`).then(r => r.json()).then(c => {
  if (!c.ok) { $('#rev-intro').textContent = c.why || 'This review link is not quite right.'; return; }
  if (c.title) $('#rev-intro').textContent = `Tell us about ${c.title.split(': ').slice(1).join(': ') || 'your magazine'}. Your review helps other people find the perfect gift.`;
  form.hidden = false;
}).catch(() => { $('#rev-intro').textContent = 'Sorry, something went wrong. Please try the link again in a moment.'; });

// Star picker
const starBtns = [...document.querySelectorAll('.rev-star')];
const setStars = n => { form.rating.value = n; starBtns.forEach((b, i) => { b.classList.toggle('on', i < n); b.setAttribute('aria-pressed', i < n); }); $('#rev-star-label').textContent = ['', 'Not for me', 'It was OK', 'Good', 'Really lovely', 'Absolutely loved it!'][n]; };
starBtns.forEach((b, i) => b.addEventListener('click', () => setStars(i + 1)));

// Photos are made smaller on the phone before sending, so they upload fast.
async function shrink(file) {
  const img = await createImageBitmap(file);
  const scale = Math.min(1, 1400 / Math.max(img.width, img.height));
  const c = document.createElement('canvas');
  c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.85).split(',')[1];
}
form.photo.addEventListener('change', async () => {
  const f = form.photo.files[0];
  $('#rev-preview').hidden = !f;
  if (f) $('#rev-preview').src = URL.createObjectURL(f);
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!Number(form.rating.value)) return say('Please tap the stars first.');
  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true; btn.textContent = 'Sending...';
  try {
    const photo = form.photo.files[0] ? await shrink(form.photo.files[0]) : '';
    const res = await fetch('/api/reviews', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id, rating: Number(form.rating.value), name: form.name.value, place: form.place.value, text: form.text.value, photo }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Something went wrong');
    form.hidden = true;
    $('#rev-intro').hidden = true;
    $('#rev-done').hidden = false;
  } catch (err) {
    say(err.message);
    btn.disabled = false; btn.textContent = 'Share my review';
  }
});
