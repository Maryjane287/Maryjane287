// node pin-schedule.mjs 2026-09-29 outdir  -> batch-1.csv, batch-2.csv, ...
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { designsFor, designExamples, baseDesign, DESIGNS } from '/home/user/Maryjane287/store/src/covers.js';
const root = '/home/user/Maryjane287/store/';
const mags = JSON.parse(await readFile(root + 'data/magazines.json'));
const site = JSON.parse(await readFile(root + 'data/site.json'));
const url = site.url.replace(/\/$/, '');
const [start, out] = process.argv.slice(2);
export const BOARDS = {
  'Personalised Birthday Gift Ideas': ['birthday-magazine', 'milestone-birthday-magazine', 'star-sign-birthday-magazine', 'kids-magazine'],
  'Anniversary and Valentine Gift Ideas': ['anniversary-magazine', 'valentines-magazine'],
  'Wedding and Engagement Gifts': ['wedding-magazine', 'engagement-magazine'],
  'Gifts for Grandparents and Family': ['grandparents-newspaper', 'year-in-review-magazine', 'christmas-magazine'],
  'Gifts for Mum and Dad': ['mothers-day-magazine', 'fathers-day-magazine'],
  'New Baby and First Birthday Gifts': ['new-baby-magazine', 'first-birthday-magazine'],
  'Gifts for Pet Lovers': ['pet-magazine', 'pet-memorial-magazine'],
  'Thank You, Retirement and Graduation Gifts': ['teacher-magazine', 'retirement-magazine', 'graduation-magazine'],
  'Best Friend, New Home and Travel Gifts': ['best-friend-magazine', 'new-home-magazine', 'travel-magazine'],
};
const boardOf = slug => Object.keys(BOARDS).find(b => BOARDS[b].includes(slug));
// Christmas and birthday searches first, then everything else.
const priority = ['year-in-review-magazine', 'grandparents-newspaper', 'birthday-magazine', 'best-friend-magazine', 'mothers-day-magazine', 'fathers-day-magazine', 'kids-magazine', 'pet-magazine', 'anniversary-magazine', 'milestone-birthday-magazine'];
// The Christmas magazine arrived after batch 1 was uploaded, so it is left out
// of the main order and slotted in below, one Christmas pin a day from batch 2.
const LATE = ['christmas-magazine'];
const ordered = mags.filter(m => !LATE.includes(m.slug)).sort((a, b) => (priority.indexOf(a.slug) + 1 || 99) - (priority.indexOf(b.slug) + 1 || 99));
const queues = ordered.map(mag => designsFor(mag).flatMap(design => designExamples(mag, design).map(ex => ({ mag, design, ex }))));
const pins = [];
while (queues.some(q => q.length)) for (const q of queues) if (q.length) pins.push(q.shift());
const late = mags.filter(m => LATE.includes(m.slug)).flatMap(mag => designsFor(mag).flatMap(design => designExamples(mag, design).map(ex => ({ mag, design, ex }))));
for (let i = 0; i < late.length; i++) pins.splice(91 + i * 7, 0, late[i]);
// Pinterest refuses two pins with the same title, so repeats get one of the
// magazine's search keywords (then the example's name) added to the title.
const used = new Set();
const cap = s => s.replace(/\b\w/g, c => c.toUpperCase()).replace(/ (For|In|Of|And|To|A|The|From) /g, m => m.toLowerCase());
function uniqueTitle(p, base) {
  const head = `${p.mag.pinTitle}${base ? '' : `, ${DESIGNS[p.design].label} design`}`;
  const who = cap(String(p.ex.id).replace(/-/g, ' '));
  const options = [head, ...p.mag.keywords.map(k => `${head}: ${cap(k)}`), `${head} for ${who}`, ...p.mag.keywords.map(k => `${head}: ${cap(k)} for ${who}`)];
  const t = options.map(x => x.slice(0, 100)).find(x => !used.has(x.toLowerCase()));
  used.add(t.toLowerCase());
  return t;
}
const cell = s => (/[",\r\n]/.test(String(s)) ? `"${String(s).replace(/"/g, '""')}"` : String(s));
const PER_DAY = 7, HOURS = [7, 10, 13, 15, 18, 20, 22], PER_BATCH = 91;
const rows = pins.map((p, i) => {
  const base = p.design === baseDesign(p.mag);
  const d = new Date(start + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + Math.floor(i / PER_DAY)); d.setUTCHours(HOURS[i % PER_DAY]);
  const title = uniqueTitle(p, base);
  const desc = `${p.mag.short} Answer a few fun questions, add photos, and get a finished 24 page magazine about them. Instant PDF from 5 pounds, or printed and posted worldwide. A one of a kind gift from Cover Story.`.slice(0, 500);
  const file = `${p.mag.slug}-${base ? '' : p.design + '-'}${p.ex.id}.jpg`;
  return { title, date: d.toISOString().slice(0, 19), csv: [title, `${url}/pins/${file}`, boardOf(p.mag.slug), '', desc, `${url}/${p.mag.slug}/${base ? '' : p.design + '/'}?utm_source=pinterest&utm_content=${file.replace(/\.jpg$/, '')}`, d.toISOString().slice(0, 19), p.mag.keywords.slice(0, 5).join(', ')].map(cell).join(',') };
});
await mkdir(out, { recursive: true });
const head = ['Title', 'Media URL', 'Pinterest board', 'Thumbnail', 'Description', 'Link', 'Publish date', 'Keywords'].join(',');
for (let b = 0; b * PER_BATCH < rows.length; b++) {
  const part = rows.slice(b * PER_BATCH, (b + 1) * PER_BATCH);
  await writeFile(`${out}/cover-story-pins-batch-${b + 1}.csv`, '\ufeff' + head + '\r\n' + part.map(r => r.csv).join('\r\n') + '\r\n');
  console.log(`batch ${b + 1}: ${part.length} pins, ${part[0].date} to ${part.at(-1).date}`);
}
// Batch 1 was first uploaded with repeated titles; only the first of each
// title went through. This file holds just the pins that were refused.
if (process.env.DONE) {
  const done = new Set((await readFile(process.env.DONE, 'utf8')).split(/\r?\n/).filter(l => /,$/.test(l)).map(l => (l.match(/https:[^,]*\.jpg/) || [])[0]).filter(Boolean));
  const retry = rows.slice(0, PER_BATCH).filter(r => !done.has((r.csv.match(/https:[^,]*\.jpg/) || [])[0]));
  await writeFile(`${out}/cover-story-pins-batch-1-missing.csv`, '\ufeff' + head + '\r\n' + retry.map(r => r.csv).join('\r\n') + '\r\n');
  console.log('batch 1 missing pins:', retry.length);
}
// The retry of those pins then lost 29 more to "Duplicate Pin link": every pin
// now has its own link (a tag on the end), and this file holds just those 29.
if (process.env.FAILED) {
  const failed = new Set((await readFile(process.env.FAILED, 'utf8')).split(/\r?\n/).map(x => x.trim().toLowerCase()).filter(Boolean));
  const retry = rows.slice(0, PER_BATCH).filter(r => failed.has(r.title.toLowerCase()));
  await writeFile(`${out}/cover-story-pins-batch-1-last-29.csv`, '\ufeff' + head + '\r\n' + retry.map(r => r.csv).join('\r\n') + '\r\n');
  console.log('batch 1 last pins:', retry.length);
}
console.log('unique links', new Set(rows.map(r => r.csv.split(',').find(c => c.includes('utm_source')))).size);
console.log('unique titles', new Set(rows.map(r => r.title.toLowerCase())).size, 'of', rows.length);
console.log('missing boards', pins.filter(p => !boardOf(p.mag.slug)).length, 'total', pins.length);
