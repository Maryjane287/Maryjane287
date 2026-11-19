// Adds sample photos to magazines.json for every assets/samples/<slug>-<i>.jpg that exists.
// Extra photos of the same person, <slug>-<i>b.jpg and <slug>-<i>c.jpg, become photo2 and photo3.
import fs from 'fs';
const p = new URL('../data/magazines.json', import.meta.url);
const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
const list = Array.isArray(raw) ? raw : raw.magazines;
const has = (f) => fs.existsSync(new URL(`../assets/samples/${f}`, import.meta.url));
let n = 0, extra = 0;
for (const m of list) m.examples.forEach((ex, i) => {
  const f = `${m.slug}-${i}.jpg`;
  if (!has(f)) { delete ex.photos; return; }
  ex.photos = { photo1: `/assets/samples/${f}` };
  n++;
  for (const [key, suf] of [['photo2', 'b'], ['photo3', 'c']]) {
    const g = `${m.slug}-${i}${suf}.jpg`;
    if (has(g)) { ex.photos[key] = `/assets/samples/${g}`; extra++; }
  }
});
fs.writeFileSync(p, JSON.stringify(raw, null, 2) + '\n');
console.log('photos set:', n, 'extra photos:', extra);
