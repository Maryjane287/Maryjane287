// Adds sample photos to magazines.json for every assets/samples/<slug>-<i>.jpg that exists.
import fs from 'fs';
const p = new URL('../data/magazines.json', import.meta.url);
const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
const list = Array.isArray(raw) ? raw : raw.magazines;
let n = 0;
for (const m of list) m.examples.forEach((ex, i) => {
  const f = `${m.slug}-${i}.jpg`;
  if (fs.existsSync(new URL(`../assets/samples/${f}`, import.meta.url))) { ex.photos = { photo1: `/assets/samples/${f}` }; n++; }
  else delete ex.photos;
});
fs.writeFileSync(p, JSON.stringify(raw, null, 2) + '\n');
console.log('photos set:', n);
