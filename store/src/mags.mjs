// Loads the magazines, adding each one's written pages from data/heart/<slug>.json.
// Optional story questions in that file join the form, before the photos.
import { readFile, readdir } from 'node:fs/promises';

export async function loadMags(root = new URL('..', import.meta.url)) {
  const mags = JSON.parse(await readFile(new URL('data/magazines.json', root)));
  const dir = new URL('data/heart/', root);
  const files = await readdir(dir).catch(() => []);
  for (const file of files.filter(f => f.endsWith('.json'))) {
    const mag = mags.find(m => m.slug === file.replace(/\.json$/, ''));
    if (!mag) continue;
    const { fields = [], ...heart } = JSON.parse(await readFile(new URL(file, dir)));
    const at = mag.fields.findIndex(f => f.type === 'photo');
    mag.fields.splice(at < 0 ? mag.fields.length : at, 0, ...fields.map(f => ({ ...f, optional: true })));
    mag.heart = heart;
    // The product page's "What's inside" list follows the new pages.
    const name = mag.fields[0].example;
    const say = x => String(x || '').replace(/\{\w+\}/g, k => (k === '{who}' || k === '{first}' || k === '{bare}' ? name : 'them'));
    mag.inside = [
      '24 full pages, all about them',
      mag.inside[1],
      'Their own story page, and ten things you love about them',
      `Pages we write just for them: "${say(heart.timeline?.title)}", "${say(heart.facts?.title)}" and "${say(heart.letters?.title)}"`,
      `"${say(heart.world?.title)}" and a page of promises`,
      mag.slug === 'pet-memorial-magazine' ? 'A gentle front page, poster and certificate' : 'A front page, perfume ad, movie poster and pull out poster',
      'A quiz and word search made from your answers',
      'Awards, a passport, a certificate and a notes page',
      'A closing note from all of us at Cover Story',
    ];
  }
  return mags;
}
