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
    const asks = (mag.inside || []).some(x => /the question/i.test(x));
    mag.inside = [
      '24 full pages, all about them',
      mag.inside[1],
      'Your letter, set beneath a full page photo',
      'A cover story feature written about them, with a pull quote and their fact file',
      'Full page photos and a scrapbook, with up to 12 of your pictures',
      heart.concepts ? 'Pages written about them: a day in their life, the little things only you notice, and their own field guide' : `Pages we write just for them: "${say(heart.timeline?.title)}", "${say(heart.facts?.title)}" and "${say(heart.letters?.title)}"`,
      `"${say(heart.world?.title)}", ten things you love and a page of promises`,
      'Voices: a card from each friend or family member you invite',
      'A pull out poster, a movie poster and one fun quiz',
      asks ? 'At the very end: the big question' : 'A closing note from us and a proper back cover',
    ];
  }
  return mags;
}
