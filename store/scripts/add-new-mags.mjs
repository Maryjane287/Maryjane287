// Adds the new magazines from new-mags-data.mjs to data/magazines.json and writes data/heart/<slug>.json.
import fs from 'fs';
import { NEW_MAGS } from './new-mags-data.mjs';
const p = new URL('../data/magazines.json', import.meta.url);
const mags = JSON.parse(fs.readFileSync(p, 'utf8'));
for (const { entry, heart } of NEW_MAGS) {
  const i = mags.findIndex(m => m.slug === entry.slug);
  if (i >= 0) mags[i] = { ...entry, examples: entry.examples.map((e, k) => ({ ...e, photos: mags[i].examples[k]?.photos || e.photos })) };
  else mags.push(entry);
  fs.writeFileSync(new URL(`../data/heart/${entry.slug}.json`, import.meta.url), JSON.stringify(heart, null, 2) + '\n');
}
fs.writeFileSync(p, JSON.stringify(mags, null, 2) + '\n');
console.log('magazines:', mags.length);
