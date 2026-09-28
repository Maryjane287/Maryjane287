// PrintPals batch 27 (Plus editions): a whole month built from our favourite free tools.
// Handwriting Month, Maths a Day, Reading Month and the Family Month Organiser.

const ED_LOOKS = {
  meadow: { name: 'Meadow', ring: '#2e9d62', tint: '#f1f8e6', accent: '#ffb938', corner: '🌼' },
  ocean: { name: 'Ocean', ring: '#1f8ac0', tint: '#e9f6fc', accent: '#ff7eb6', corner: '🐳' },
  candy: { name: 'Candy', ring: '#e0457b', tint: '#fff0f5', accent: '#8a3fd1', corner: '🍭' },
  space: { name: 'Space', ring: '#3a3fb8', tint: '#eef0ff', accent: '#ffb938', corner: '🚀' },
};
const edLook = (k) => ED_LOOKS[k] || ED_LOOKS.meadow;
const DAYS5 = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// A coloured strip across the top of a daily page: "Week 1 · Monday · Day 1".
function dayStrip(pg, lk, week, day, extra) {
  const n = (week - 1) * 5 + day;
  pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="14" rx="7" fill="${lk.tint}" stroke="${lk.ring}" stroke-width="0.6"/>`);
  pg.add(txt(pg.left + 8, pg.y + 9.4, `Week ${week}  ·  ${DAYS5[day - 1]}`, 6, { anchor: 'start', colour: lk.ring }) + txt(pg.right - 8, pg.y + 9.4, `Day ${n} of 20${extra ? '  ·  ' + extra : ''}`, 5.4, { anchor: 'end', font: FONT, colour: INK }));
  for (let k = 0; k < 20; k++) pg.add(`<circle cx="${pg.w / 2 - 22 + k * 3.2}" cy="${pg.y + 7}" r="1.1" fill="${k < n ? lk.ring : '#fff'}" stroke="${lk.ring}" stroke-width="0.4"/>`);
  pg.y += 20;
}

// "How did I do?" faces to circle at the bottom of a page.
function howDidIDo(pg, lk) {
  const y = pg.bottom - 12;
  pg.add(txt(pg.left, y + 2, 'How did I do today?', 6, { anchor: 'start', colour: lk.ring }));
  ['😊', '🙂', '😐'].forEach((e, i) => pg.add(`<circle cx="${pg.left + 66 + i * 16}" cy="${y}" r="6.4" fill="#fff" stroke="${lk.ring}" stroke-width="0.6"/>` + emoji(e, pg.left + 66 + i * 16, y, 8.4)));
  pg.add(txt(pg.right - 18, y + 2, 'Grown-up star:', 5, { anchor: 'end', font: FONT, colour: SOFT }) + `<path d="${starPath(pg.right - 8, y, 7, 0.45)}" fill="#fff" stroke="${lk.accent}" stroke-width="0.8"/>`);
}

// A month plan: 4 weeks by 5 days, a star for each day done, and a reward line.
function monthPlanPage(paper, lk, title, sub, labels, reward) {
  const pg = new Page(paper, title, { subtitle: sub });
  const lw = 34, cw = (pg.width - lw) / 5, hh = 12, rh = Math.min(40, (pg.room - hh - 40) / 4);
  DAYS5.forEach((d, i) => pg.add(`<rect x="${pg.left + lw + i * cw}" y="${pg.y}" width="${cw}" height="${hh}" fill="${lk.tint}" stroke="#d9d4ec" stroke-width="0.4"/>` + txt(pg.left + lw + i * cw + cw / 2, pg.y + 8, d.slice(0, 3), 5.6, { colour: lk.ring })));
  for (let w = 0; w < 4; w++) {
    const y = pg.y + hh + w * rh;
    pg.add(`<rect x="${pg.left}" y="${y}" width="${lw}" height="${rh}" fill="${TINTS[w]}" stroke="#d9d4ec" stroke-width="0.4"/>` + txt(pg.left + lw / 2, y + rh / 2 + 2, `Week ${w + 1}`, 6, { colour: PALETTE[w] }));
    for (let d = 0; d < 5; d++) { const x = pg.left + lw + d * cw, l = labels[w * 5 + d] || ''; pg.add(`<rect x="${x}" y="${y}" width="${cw}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.4"/><path d="${starPath(x + cw / 2, y + rh * 0.4, rh * 0.2, 0.45)}" fill="#fff" stroke="${PALETTE[(w * 5 + d) % PALETTE.length]}" stroke-width="0.8"/>` + txt(x + cw / 2, y + rh - 5, l, fitFont(l, 5, cw - 4, 0.5), { font: FONT, weight: 700, colour: INK })); }
  }
  pg.y += hh + 4 * rh + 10;
  pg.add(panel(pg.left, pg.y, pg.width, 26, lk.tint, lk.ring, 10) + emoji('🎁', pg.left + 14, pg.y + 13, 12) + txt(pg.left + 28, pg.y + 11, reward, 6.4, { anchor: 'start', colour: lk.ring }) + txt(pg.left + 28, pg.y + 20, 'When all 20 stars are coloured, my treat is:', 5.2, { anchor: 'start', font: FONT, colour: INK }) + `<line x1="${pg.left + 142}" x2="${pg.right - 10}" y1="${pg.y + 20.6}" y2="${pg.y + 20.6}" stroke="#b9b3d6" stroke-width="0.5"/>`);
  return pg.svg();
}

// A small "week complete" badge in the corner of every Friday page.
function weekBadge(pg, lk, week, bx, by) {
  const x = bx || pg.right - 20, y = by || pg.y + 16;
  pg.add(`<circle cx="${x}" cy="${y}" r="15" fill="${lk.tint}" stroke="${lk.ring}" stroke-width="1"/><path d="${starPath(x, y - 3, 7, 0.45)}" fill="#fff" stroke="${lk.accent}" stroke-width="0.8"/>` + txt(x, y + 9, `Week ${week}!`, 4.6, { colour: lk.ring }));
}

// Lined rows for writing, with the dashed middle line.
function writeRows(pg, y, n, size, gap) {
  for (let r = 0; r < n; r++) { const yy = y + r * size * (gap || 1.6); pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${yy + size}" y2="${yy + size}" stroke="#9a93b8" stroke-width="0.5"/><line x1="${pg.left}" x2="${pg.right}" y1="${yy + size * 0.45}" y2="${yy + size * 0.45}" stroke="#d9d4ec" stroke-width="0.4" stroke-dasharray="2 2"/>`); }
}

// ================================================================ Handwriting Month (Plus edition)
const HM_WORDS = ['cat', 'dog', 'sun', 'hat', 'bed', 'pig', 'cup', 'fox', 'jam', 'map', 'red', 'bus', 'hen', 'log', 'nut', 'van', 'web', 'zip', 'yes', 'kit'];
const HM_SENT = ['I can run.', 'The sun is hot.', 'I like my cat.', 'We can play.', 'A dog can dig.', 'I see a big bus.', 'My hat is red.', 'The pig is pink.', 'I am kind.', 'We go to the park.',
  'The fox is fast.', 'I can hop.', 'Look at the moon.', 'I love my mum.', 'The hen has eggs.', 'I can read.', 'It is a sunny day.', 'I have a kite.', 'We had fun.', 'I did it!'];
const HM_PATTERNS = ['wave', 'zigzag', 'bumps', 'castle', 'loops'];

function patternRow(pg, y, h, type, colour, end) {
  const x0 = pg.left + 6, x1 = end || pg.right - 6, n = 10, amp = h * 0.4;
  let d = `M${x0} ${y}`;
  for (let k = 0; k <= 80; k++) { const u = k / 80, x = x0 + (x1 - x0) * u, ph = u * n * Math.PI * 2; let yy = y; if (type === 'wave') yy = y - Math.sin(ph) * amp; else if (type === 'zigzag') { const f = (u * n * 2) % 2; yy = y - (f < 1 ? f : 2 - f) * amp * 2 + amp; } else if (type === 'bumps') yy = y - Math.abs(Math.sin(ph / 2)) * amp * 2 + amp; else if (type === 'castle') { const f = (u * n) % 1; yy = f < 0.5 ? y - amp : y + amp; } else { yy = y - Math.sin(ph) * amp * 0.9; } d += ` L${x.toFixed(1)} ${yy.toFixed(1)}`; }
  pg.add(`<path d="${d}" fill="none" stroke="#9a93b8" stroke-width="0.9" stroke-dasharray="0.1 2" stroke-linecap="round"/><circle cx="${x0}" cy="${y}" r="1.8" fill="#3fbf7f"/>` + emoji('✏️', x0 - 3, y - amp - 4, 6));
}

function makeHandMonth(o, paper) {
  const name = nameOf(o.name, '') || '';
  const lk = edLook(o.look), level = ['starter', 'steady', 'confident'].includes(o.level) ? o.level : 'steady';
  const nm = name || 'Mia';
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const focus = level === 'confident' ? HM_WORDS : level === 'starter' ? [...'cadgoesiltbhkmnrpujf'] : [...letters.slice(0, 20)];
  const pages = [seriesCover(paper, 'PRINTPALS PLUS EDITION', name ? `${possessive(name)} Handwriting Month` : 'My Handwriting Month', { starter: 'Starter: first letters, 4 weeks', steady: 'Steady: a letter a day, 4 weeks', confident: 'Confident: words and sentences, 4 weeks' }[level], ['✏️', '🔤', '⭐', lk.corner, '🏆', '💛'], lk.ring, lk.tint, 'workbook', ['20 daily pages', 'A warm-up every day', `Writing ${nm} daily`, 'Progress stars', 'A badge every Friday', 'Month certificate'])];
  pages.push(monthPlanPage(paper, lk, 'My handwriting month plan', 'Colour a star after each day\'s page. Ten happy minutes a day is all it takes!', focus.map((f) => (level === 'confident' ? f : `Letter ${f}`)), 'My handwriting reward'));
  for (let w = 1; w <= 4; w++) for (let d = 1; d <= 5; d++) {
    const i = (w - 1) * 5 + d - 1, f = focus[i];
    const pg = new Page(paper, level === 'confident' ? `Today's word: ${f}` : `Today's letter: ${f}`, { subtitle: 'Warm up your hand, trace carefully, then try it all on your own!' });
    dayStrip(pg, lk, w, d);
    if (d === 5) weekBadge(pg, lk, w);
    // Warm-up.
    pg.add(txt(pg.left, pg.y + 3, '1. Warm up', 6.4, { anchor: 'start', colour: PALETTE[0] }));
    patternRow(pg, pg.y + 16, 12, HM_PATTERNS[i % HM_PATTERNS.length], lk.ring, d === 5 ? pg.right - 40 : 0);
    pg.y += 30;
    // Focus.
    pg.add(txt(pg.left, pg.y + 3, level === 'confident' ? '2. Word of the day' : '2. Letter of the day', 6.4, { anchor: 'start', colour: PALETTE[1] }));
    pg.y += 7;
    if (level !== 'confident') {
      const U = f.toUpperCase(), [thing] = NAME_BOOK[U], isE = /^\S+ /.test(thing) && !ALL_PICS.includes(thing), label = isE ? thing.split(' ').slice(1).join(' ') : thing;
      const bs = 44, tail = /[gjpqy]/.test(f), ls = tail ? (bs - 8) / 1.5 : bs - 12;
      pg.add(panel(pg.left, pg.y, 60, bs, lk.tint, lk.ring, 10) + drawText(f, pg.left + 30 - (textWidth(f) / 100) * ls / 2, pg.y + (tail ? 4 : 6), ls, 'trace', true));
      pg.add(panel(pg.left + 64, pg.y, 50, bs, '#fff', '#e2ddf2', 10) + (isE ? emoji(thing.split(' ')[0], pg.left + 89, pg.y + 18, 20) : pic(ART(thing), pg.left + 89, pg.y + 18, 28)) + txt(pg.left + 89, pg.y + bs - 5, label, fitFont(label, 6, 44, 0.55), { colour: lk.ring }));
      const big = level === 'starter' ? `${U}  ${U}  ${f}  ${f}` : `${U}  ${f}  ${f}  ${f}`, bw = pg.width - 122, bsz = Math.min(bs * 0.62, bw / (textWidth(big) / 100 + 0.1));
      writeRows({ left: pg.left + 120, right: pg.right, add: (s) => pg.add(s) }, pg.y + 6, 1, bsz);
      pg.add(drawText(big, pg.left + 122, pg.y + 6, bsz, 'trace', false));
      pg.y += bs + 8;
      const row = `${f}  ${f}  ${f}  ${f}  ${f}  ${f}  ${f}`, size = Math.min(level === 'starter' ? 20 : 16, (pg.width - 6) / (textWidth(row) / 100 + 0.1));
      writeRows(pg, pg.y, 3, size);
      pg.add(drawText(row, pg.left + 2, pg.y, size, 'trace', false) + drawText(row, pg.left + 2, pg.y + size * 1.6, size, 'ghost', false));
      pg.y += size * 1.6 * 3 + 4;
    } else {
      const s = HM_SENT[i], size = Math.min(22, (pg.width * 0.5) / (textWidth(f) / 100 + 0.1));
      writeRows(pg, pg.y, 2, size);
      pg.add(drawText(`${f}  ${f}  ${f}`, pg.left + 2, pg.y, size, 'trace', true) + drawText(`${f}  ${f}  ${f}`, pg.left + 2, pg.y + size * 1.6, size, 'ghost', false));
      pg.y += size * 3.2 + 4;
      pg.add(txt(pg.left, pg.y + 3, '3. Sentence of the day', 6.4, { anchor: 'start', colour: PALETTE[2] }));
      pg.y += 7;
      const ss = Math.min(16, (pg.width - 6) / (textWidth(s) / 100 + 0.1));
      writeRows(pg, pg.y, 3, ss);
      pg.add(drawText(s, pg.left + 2, pg.y, ss, 'trace', false) + drawText(s, pg.left + 2, pg.y + ss * 1.6, ss, 'ghost', false));
      pg.y += ss * 1.6 * 3 + 4;
    }
    // Name.
    if (pg.bottom - pg.y > 44) {
      pg.add(txt(pg.left, pg.y + 3, `${level === 'confident' ? 4 : 3}. My name`, 6.4, { anchor: 'start', colour: PALETTE[3] }));
      pg.y += 7;
      const ns = Math.min(18, (pg.width * 0.46) / (textWidth(nm) / 100 + 0.1));
      writeRows(pg, pg.y, 1, ns);
      pg.add(drawText(nm, pg.left + 2, pg.y, ns, d % 2 ? 'trace' : 'ghost', false));
    }
    howDidIDo(pg, lk);
    pages.push(pg.svg());
  }
  pages.push(seriesCert(paper, 'HANDWRITING MONTH COMPLETE', 'Handwriting Hero', name, 'for 20 days of beautiful, careful writing!', 'Next month: move up a level or start again for even neater writing!', lk.ring));
  return pages;
}

// ================================================================ Maths a Day (Plus edition)
function mathsDayProblem(level, day, rand) {
  const r = (a, b) => a + Math.floor(rand() * (b - a + 1)), hard = day / 20;
  if (level === 'counting') {
    const max = 5 + Math.round(hard * 5), k = r(0, 2);
    if (k === 0) { const a = r(1, max - 1), b = r(1, Math.max(1, max - a)); return [`${a} + ${b} =`, a + b]; }
    if (k === 1) { const a = r(1, max - 1); return [`${a} + 1 =`, a + 1]; }
    const a = r(1, max); return [`1 more than ${a} is`, a + 1];
  }
  if (level === 'adding') {
    const max = 10 + Math.round(hard * 10), k = r(0, 2);
    if (k === 2 && day > 5) { const a = r(3, max), b = r(1, a - 1); return [`${a} − ${b} =`, a - b]; }
    const a = r(1, max - 1), b = r(1, Math.max(1, max - a)); return [`${a} + ${b} =`, a + b];
  }
  const k = r(0, 3), max = 40 + Math.round(hard * 60);
  if (k === 0) { const a = r(10, max - 5), b = r(2, Math.max(2, max - a)); return [`${a} + ${b} =`, a + b]; }
  if (k === 1) { const a = r(15, max), b = r(2, a - 5); return [`${a} − ${b} =`, a - b]; }
  const t = [2, 5, 10, 3, 4][r(0, day > 10 ? 4 : 2)], m = r(1, 10); return [`${m} × ${t} =`, m * t];
}
const MD_WARM = { counting: 'Count and write', adding: 'Number bonds', bigger: 'Skip counting' };
const MD_STORY = [
  ['{n} has {a} apples and gets {b} more. How many now?', '+'], ['There are {a} birds. {b} fly away. How many are left?', '−'],
  ['{n} builds a tower of {a} blocks, then adds {b}. How many blocks tall is it now?', '+'], ['{a} balloons, then {b} pop! How many are left?', '−'],
  ['{n} has {a} stickers and Sam gives {b} more. How many now?', '+'],
];

function makeMathsDay(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const lk = edLook(o.look), level = ['counting', 'adding', 'bigger'].includes(o.level) ? o.level : 'adding';
  const nm = name || 'Mia';
  const pages = [seriesCover(paper, 'PRINTPALS PLUS EDITION', name ? `${possessive(name)} Maths a Day` : 'My Maths a Day', { counting: 'Counting and first sums, 4 weeks', adding: 'Adding and taking away to 20, 4 weeks', bigger: 'Bigger numbers and times tables, 4 weeks' }[level], ['🔢', '➕', '⭐', lk.corner, '🧠', '🏆'], lk.ring, lk.tint, 'workbook', ['20 ten-minute days', 'Gets a little harder', 'A story problem daily', 'Friday check', 'Score tracker', 'Answers for grown-ups'])];
  pages.push(monthPlanPage(paper, lk, 'My maths month plan', 'One page a day, about ten minutes. Colour the star and write your Friday score!', Array.from({ length: 20 }, (_, i) => ((i % 5) === 4 ? 'Friday check' : '')), 'My maths reward'));
  const answers = [];
  for (let w = 1; w <= 4; w++) for (let d = 1; d <= 5; d++) {
    const day = (w - 1) * 5 + d, friday = d === 5;
    const pg = new Page(paper, friday ? `Friday check: week ${w}` : `Maths a Day: day ${day}`, { subtitle: friday ? 'Show what you learned this week! Take your time and check each answer.' : 'Warm up, do today\'s sums, then solve the story problem!' });
    dayStrip(pg, lk, w, d);
    const ans = [];
    if (!friday) {
      // Warm-up.
      pg.add(txt(pg.left, pg.y + 3, `1. Warm up: ${MD_WARM[level].toLowerCase()}`, 6.4, { anchor: 'start', colour: PALETTE[0] }));
      pg.y += 7;
      const wh = 26;
      if (level === 'counting') {
        const pics = ['🍎', '⭐', '🐞', '🎈'];
        pics.forEach((e, k) => { const n = 2 + Math.floor(rand() * (4 + Math.round(day / 4))), cw = pg.width / 4, x = pg.left + k * cw; pg.add(panel(x + 2, pg.y, cw - 4, wh, TINTS[k], PALETTE[k], 8)); for (let j = 0; j < n; j++) pg.add(emoji(e, x + 8 + (j % 5) * 6.4, pg.y + 7 + Math.floor(j / 5) * 7, 5.6)); pg.add(`<rect x="${x + cw - 18}" y="${pg.y + wh - 13}" width="12" height="10" rx="3" fill="#fff" stroke="${PALETTE[k]}" stroke-width="0.7"/>`); ans.push(n); });
      } else if (level === 'adding') {
        const tot = day < 10 ? 10 : 20;
        for (let k = 0; k < 4; k++) { const a = 1 + Math.floor(rand() * (tot - 1)), cw = pg.width / 4, x = pg.left + k * cw + cw / 2; pg.add(`<circle cx="${x}" cy="${pg.y + 6}" r="6" fill="${lk.tint}" stroke="${lk.ring}" stroke-width="0.8"/>` + txt(x, pg.y + 8.2, `${tot}`, 6, { colour: lk.ring }) + `<line x1="${x - 3}" y1="${pg.y + 11}" x2="${x - 9}" y2="${pg.y + 16}" stroke="${lk.ring}" stroke-width="0.6"/><line x1="${x + 3}" y1="${pg.y + 11}" x2="${x + 9}" y2="${pg.y + 16}" stroke="${lk.ring}" stroke-width="0.6"/><circle cx="${x - 11}" cy="${pg.y + 20}" r="5.4" fill="#fff" stroke="${PALETTE[k]}" stroke-width="0.8"/>` + txt(x - 11, pg.y + 22.2, `${a}`, 6, { colour: INK }) + `<circle cx="${x + 11}" cy="${pg.y + 20}" r="5.4" fill="#fff" stroke="${PALETTE[k]}" stroke-width="0.8"/>`); ans.push(`${tot - a}`); }
      } else {
        const step = [2, 5, 10, 3][(day - 1) % 4], start = step * Math.floor(rand() * 4);
        for (let k = 0; k < 8; k++) { const x = pg.left + k * (pg.width / 8) + pg.width / 16, v = start + k * step, blank = k === 3 || k === 5 || k === 7; pg.add(`<rect x="${x - 9}" y="${pg.y + 4}" width="18" height="14" rx="4" fill="${blank ? '#fff' : lk.tint}" stroke="${lk.ring}" stroke-width="0.7"/>` + (blank ? '' : txt(x, pg.y + 13.4, `${v}`, 7, { colour: INK }))); if (blank) ans.push(v); }
      }
      pg.y += wh + 8;
    }
    // Sums.
    const count = friday ? 12 : 8;
    pg.add(txt(pg.left, pg.y + 3, friday ? 'This week\'s check' : '2. Today\'s sums', 6.4, { anchor: 'start', colour: PALETTE[1] }));
    pg.y += 7;
    const cols = 2, rh = friday ? 17 : 15, cw = pg.width / cols;
    for (let k = 0; k < count; k++) {
      const [q, a] = mathsDayProblem(level, friday ? day - 1 : day, rand), x = pg.left + (k % cols) * cw, y = pg.y + Math.floor(k / cols) * rh;
      pg.add(panel(x + 2, y, cw - 4, rh - 3, k % 2 ? '#fff' : TINTS[Math.floor(k / 2) % TINTS.length], '#e2ddf2', 6) + txt(x + 8, y + rh / 2 + 1.4, `${k + 1}.`, 5, { anchor: 'start', font: FONT, colour: SOFT }) + txt(x + 18, y + rh / 2 + 2, q, 8, { anchor: 'start', colour: INK }) + `<rect x="${x + cw - 30}" y="${y + 2.5}" width="24" height="${rh - 8}" rx="3" fill="#fff" stroke="${lk.ring}" stroke-width="0.7"/>`);
      ans.push(a);
    }
    pg.y += Math.ceil(count / cols) * rh + 6;
    if (!friday) {
      const [t, op] = MD_STORY[(day - 1) % MD_STORY.length], hi = level === 'counting' ? 5 : level === 'adding' ? 10 : 40;
      let a = 2 + Math.floor(rand() * (hi - 1)), b = 1 + Math.floor(rand() * (op === '−' ? a - 1 : hi));
      if (op === '−' && b >= a) b = a - 1;
      const text = t.replace('{n}', nm).replace('{a}', a).replace('{b}', b);
      pg.add(txt(pg.left, pg.y + 3, '3. Story problem', 6.4, { anchor: 'start', colour: PALETTE[2] }));
      pg.y += 6;
      const sh = Math.min(46, pg.bottom - 22 - pg.y);
      pg.add(panel(pg.left, pg.y, pg.width, sh, lk.tint, lk.ring, 10));
      wrap(text, 58).forEach((l, k) => pg.add(txt(pg.left + 8, pg.y + 10 + k * 7.4, l, 6.6, { anchor: 'start', colour: INK })));
      pg.add(txt(pg.left + 8, pg.y + sh - 7, 'Draw it here, then write the answer:', 5, { anchor: 'start', font: FONT, colour: SOFT }) + `<rect x="${pg.right - 34}" y="${pg.y + sh - 18}" width="26" height="13" rx="3" fill="#fff" stroke="${lk.ring}" stroke-width="0.8"/>`);
      ans.push(op === '+' ? a + b : a - b);
    } else {
      pg.add(panel(pg.left, pg.y, pg.width, 22, lk.tint, lk.ring, 10) + txt(pg.left + 10, pg.y + 13.6, 'My score:', 7, { anchor: 'start', colour: lk.ring }) + `<rect x="${pg.left + 46}" y="${pg.y + 5}" width="22" height="12" rx="3" fill="#fff" stroke="${lk.ring}" stroke-width="0.8"/>` + txt(pg.left + 74, pg.y + 13.6, 'out of 12', 6.4, { anchor: 'start', colour: INK }));
      weekBadge(pg, lk, w, pg.right - 20, pg.y + 42);
    }
    howDidIDo(pg, lk);
    pages.push(pg.svg());
    answers.push([friday ? `W${w} Fri` : `Day ${day}`, ans]);
  }
  // Answers for grown-ups.
  {
    const pg = new Page(paper, 'Maths a Day: answers', { subtitle: 'Answer key for grown-ups. Warm-up answers first, then the sums in order, then the story problem.', noName: true });
    const rh = pg.room / 20;
    answers.forEach(([lab, a], i) => { const y = pg.y + i * rh; pg.add(txt(pg.left, y + rh * 0.7, lab, 5.2, { anchor: 'start', colour: lk.ring }) + txt(pg.left + 24, y + rh * 0.7, a.join(', '), fitFont(a.join(', '), 5.2, pg.width - 26, 0.5), { anchor: 'start', font: FONT, colour: INK })); });
    pages.push(pg.svg());
  }
  pages.push(seriesCert(paper, 'MATHS A DAY COMPLETE', 'Maths Superstar', name, 'for 20 days of brilliant maths and brave thinking!', 'Next month: try the next level up!', lk.ring));
  return pages;
}

// ================================================================ Reading Month (Plus edition)
const RM_SETS = {
  1: { title: 'First words', words: [['the', 'Look at the cat.'], ['and', 'Mum and I play.'], ['is', 'It is my ball.'], ['it', 'I can see it.'], ['I', 'I am big.'], ['see', 'I see a dog.'], ['can', 'I can jump.'], ['a', 'I have a hat.'], ['we', 'We go out.'], ['go', 'Go, go, go!'], ['to', 'I go to bed.'], ['my', 'This is my cup.'], ['like', 'I like cake.'], ['look', 'Look at me!'], ['here', 'Here is my dog.'], ['said', '"Hello," said Sam.']],
    stories: [['{n} and the cat', ['Look at the cat.', 'The cat is big.', 'It is my cat.', '{n} and the cat play.']], ['I can see', ['I can see a dog.', 'I can see a bus.', 'I can see a tree.', 'I can see {n}!']], ['We go to the park', ['We go to the park.', 'I like the park.', 'We go up and down.', 'It is fun!']], ['Here is my dog', ['Here is my dog.', 'Look at my dog go!', '"Sit," said {n}.', 'I like my dog.']]] },
  2: { title: 'Next words', words: [['was', 'It was fun.'], ['you', 'I love you.'], ['they', 'They are here.'], ['are', 'We are happy.'], ['have', 'I have a kite.'], ['come', 'Come and see!'], ['play', 'Let us play.'], ['some', 'I want some jam.'], ['what', 'What is that?'], ['where', 'Where is my hat?'], ['there', 'There it is!'], ['went', 'We went home.'], ['little', 'A little bird sang.'], ['one', 'I have one sock.'], ['do', 'What do you see?'], ['all', 'We all sing.']],
    stories: [['The lost hat', ['Where is my hat?', 'Is it there?', 'No, it was not there.', 'There it is, {n}!']], ['Come and play', ['"Come and play!" said {n}.', 'They all came to play.', 'We have a ball.', 'It was fun.']], ['The little bird', ['What is that?', 'It is a little bird.', 'Some birds sing.', 'The little bird went home.']], ['What do you see?', ['What do you see?', 'I see one red kite.', 'Do you see it?', 'You are a star, {n}!']]] },
};

function makeReadMonth(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const nm = name || 'Mia';
  const lk = edLook(o.look), set = RM_SETS[+o.set] ? +o.set : 1, S = RM_SETS[set];
  const all = S.words.map((w) => w[0]), others = Object.values(RM_SETS).flatMap((x) => x.words.map((w) => w[0]));
  const pages = [seriesCover(paper, 'PRINTPALS PLUS EDITION', name ? `${possessive(name)} Reading Month` : 'My Reading Month', `${S.title}: 16 words in 4 weeks`, all.slice(0, 6), lk.ring, lk.tint, 'workbook', ['A new word each day', 'Trace, write and find', 'A sentence to read', 'A story every Friday', 'My word wall', 'Reading certificate'])];
  const plan = []; for (let w = 0; w < 4; w++) { for (let d = 0; d < 4; d++) plan.push(`"${all[w * 4 + d]}"`); plan.push('Story!'); }
  pages.push(monthPlanPage(paper, lk, 'My reading month plan', 'A new word Monday to Thursday, then a story on Friday using all four!', plan, 'My reading reward'));
  // Word wall.
  {
    const pg = new Page(paper, 'My word wall', { subtitle: 'Colour a brick each time you can read the word all by yourself. Build the whole wall!' });
    const cols = 4, rows = 4, bw = pg.width / cols, bh = Math.min(34, (pg.room - 20) / rows);
    all.forEach((w, i) => { const r = Math.floor(i / cols), x = pg.left + (i % cols) * bw - (r % 2 ? bw / 4 : 0), y = pg.y + (rows - 1 - r) * bh; const cx = Math.max(pg.left + 2, x + 2), cw = Math.min(pg.right - 2, x + bw - 2) - cx; pg.add(`<rect x="${cx}" y="${y + 2}" width="${cw}" height="${bh - 4}" rx="4" fill="#fff" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="1"/>` + txt(cx + cw / 2, y + bh / 2 + 3.4, w, 11, { colour: INK })); });
    pg.y += rows * bh + 8;
    pg.add(panel(pg.left, pg.y, pg.width, Math.min(30, pg.room - 2), lk.tint, lk.ring, 10) + emoji('🧱', pg.left + 14, pg.y + 12, 11) + txt(pg.left + 26, pg.y + 14, `${nm} can read`, 7, { anchor: 'start', colour: lk.ring }) + `<rect x="${pg.left + 70}" y="${pg.y + 6}" width="22" height="12" rx="3" fill="#fff" stroke="${lk.ring}" stroke-width="0.8"/>` + txt(pg.left + 96, pg.y + 14, 'words!', 7, { anchor: 'start', colour: lk.ring }));
    pages.push(pg.svg());
  }
  for (let w = 1; w <= 4; w++) {
    for (let d = 1; d <= 4; d++) {
      const [word, sent] = S.words[(w - 1) * 4 + d - 1], col = PALETTE[(w * 4 + d) % PALETTE.length];
      const pg = new Page(paper, `Word of the day: ${word}`, { subtitle: `Say "${word}", trace it, write it, find it, then read the sentence!` });
      dayStrip(pg, lk, w, d);
      pg.add(panel(pg.left, pg.y, pg.width, 42, lk.tint, lk.ring, 12));
      const big = Math.min(30, (pg.width - 20) / (textWidth(word) / 100 + 0.1));
      pg.add(drawText(word, pg.w / 2 - (textWidth(word) / 100) * big / 2, pg.y + (42 - big) / 2 - (/[gjpqy]/.test(word) ? 4 : 0), big, 'trace', true));
      pg.y += 50;
      const row = `${word}   ${word}   ${word}   ${word}`, size = Math.min(16, (pg.width - 6) / (textWidth(row) / 100 + 0.1));
      writeRows(pg, pg.y, 3, size);
      pg.add(drawText(row, pg.left + 2, pg.y, size, 'trace', false) + drawText(row, pg.left + 2, pg.y + size * 1.6, size, 'ghost', false));
      pg.y += size * 1.6 * 3 + 2;
      pg.add(txt(pg.left, pg.y + 3, `Find and colour every "${word}"`, 6.4, { anchor: 'start', colour: col }));
      pg.y += 8;
      const decoys = others.filter((x) => x !== word), cells = [];
      for (let k = 0; k < 12; k++) cells.push(k < 5 ? word : decoys[Math.floor(rand() * decoys.length)]);
      const mixed = shuffle(cells, rand), cw = pg.width / 6, ch = 16;
      mixed.forEach((t, k) => { const x = pg.left + (k % 6) * cw + cw / 2, y = pg.y + Math.floor(k / 6) * ch + ch / 2; pg.add(`<ellipse cx="${x}" cy="${y}" rx="${cw * 0.44}" ry="${ch * 0.4}" fill="#fff" stroke="${PALETTE[k % PALETTE.length]}" stroke-width="0.8"/>` + txt(x, y + 2.6, t, 7.4, { colour: INK })); });
      pg.y += 2 * ch + 8;
      pg.add(txt(pg.left, pg.y + 3, 'Read it out loud', 6.4, { anchor: 'start', colour: col }));
      pg.y += 8;
      const bh = Math.min(30, pg.bottom - 20 - pg.y);
      pg.add(panel(pg.left, pg.y, pg.width, bh, '#fff', col, 10));
      colourSentence(pg, sent.replace('{n}', nm), pg.w / 2, pg.y + bh / 2 + 4, 11, [word.toLowerCase()], col, pg.width - 20);
      howDidIDo(pg, lk);
      pages.push(pg.svg());
    }
    // Friday story.
    const [title, lines] = S.stories[w - 1], hi = S.words.slice((w - 1) * 4, w * 4).map((x) => x[0].toLowerCase());
    const pg = new Page(paper, `Friday story: ${title.replace('{n}', nm)}`, { subtitle: 'Read the story using this week\'s words. Point to each word as you read. Draw the pictures!', noName: true });
    dayStrip(pg, lk, w, 5);
    weekBadge(pg, lk, w);
    pg.y += 34;
    const bh = (pg.room - 24) / 2, bw = pg.width / 2;
    lines.forEach((l, k) => { const x = pg.left + (k % 2) * bw, y = pg.y + Math.floor(k / 2) * bh; pg.add(panel(x + 2, y, bw - 4, bh - 4, '#fff', lk.ring, 10) + `<rect x="${x + 8}" y="${y + 6}" width="${bw - 16}" height="${bh - 34}" rx="7" fill="${lk.tint}" stroke="${lk.ring}" stroke-width="0.4" stroke-dasharray="3 2"/>`); colourSentence(pg, l.replace('{n}', nm), x + bw / 2, y + bh - 20, 8.4, hi, lk.ring, bw - 16); });
    pg.y += 2 * bh;
    pg.add(txt(pg.left, pg.y + 6, 'I read this story to:', 6.4, { anchor: 'start', colour: lk.ring }) + `<line x1="${pg.left + 60}" x2="${pg.right}" y1="${pg.y + 6.6}" y2="${pg.y + 6.6}" stroke="#c9c3e3" stroke-width="0.5"/>`);
    pages.push(pg.svg());
  }
  pages.push(seriesCert(paper, 'READING MONTH COMPLETE', 'Reading Star', name, 'for learning 16 new words and reading 4 stories!', set === 1 ? 'Next month: the Next Words level of Reading Month!' : 'Next: the My Sight Word Readers series!', lk.ring));
  return pages;
}

// ================================================================ Family Month Organiser (Plus edition)
function makeFamilyMonth(o, paper) {
  const kids = listOf(o.names, 3).map((n) => nameOf(n, '')).filter(Boolean).slice(0, 3);
  if (!kids.length) kids.push('Mia');
  const family = String(o.family || '').trim().slice(0, 20);
  const lk = edLook(o.look);
  const now = new Date(), mi = o.month === 'next' ? (now.getMonth() + 1) % 12 : now.getMonth(), yr = now.getFullYear() + (o.month === 'next' && mi === 0 ? 1 : 0);
  const mName = MONTHS[mi];
  const pages = [seriesCover(paper, 'PRINTPALS PLUS EDITION', family ? `The ${family} Family Month` : 'Our Family Month', `${mName} ${yr}`, ['🏡', '🌅', '🌙', '🧹', '⭐', '💛'], lk.ring, lk.tint, 'organiser', ['Month at a glance', 'Morning routines', 'Bedtime routines', 'Chore charts', 'Reward charts', 'Sunday check-ins'])];
  // Month at a glance.
  {
    const pg = new Page(paper, `${mName} ${yr} at a glance`, { subtitle: 'Birthdays, school days, trips and treats. Let the children draw a little picture on special days!', noName: true });
    const first = new Date(yr, mi, 1), start = (first.getDay() + 6) % 7, dim = new Date(yr, mi + 1, 0).getDate(), rows = Math.ceil((start + dim) / 7), cw = pg.width / 7, hh = 11, rh = Math.min(38, (pg.room - hh - 30) / rows);
    WEEKDAYS.map((d) => d.slice(0, 3)).forEach((d, i) => pg.add(`<rect x="${pg.left + i * cw}" y="${pg.y}" width="${cw}" height="${hh}" fill="${lk.ring}"/>` + txt(pg.left + i * cw + cw / 2, pg.y + 7.6, d, 5.6, { colour: '#fff' })));
    for (let k = 0; k < rows * 7; k++) { const dnum = k - start + 1, x = pg.left + (k % 7) * cw, y = pg.y + hh + Math.floor(k / 7) * rh; pg.add(`<rect x="${x}" y="${y}" width="${cw}" height="${rh}" fill="${dnum < 1 || dnum > dim ? '#f7f5fc' : '#fff'}" stroke="#d9d4ec" stroke-width="0.4"/>` + (dnum >= 1 && dnum <= dim ? txt(x + 4, y + 7, `${dnum}`, 6, { anchor: 'start', colour: k % 7 >= 5 ? lk.ring : INK }) : '')); }
    pg.y += hh + rows * rh + 8;
    pg.add(panel(pg.left, pg.y, pg.width, Math.max(20, pg.room - 2), lk.tint, lk.ring, 10) + txt(pg.left + 10, pg.y + 11, 'This month we are looking forward to...', 6.4, { anchor: 'start', colour: lk.ring }));
    pages.push(pg.svg());
  }
  // Routines per child.
  const routineChart = (kid, which) => {
    const steps = ROUTINES[which].slice(0, 8), pg = new Page(paper, `${possessive(kid)} ${which === 'morning' ? 'morning' : 'bedtime'} routine`, { subtitle: which === 'morning' ? 'Tick each step every morning. A calm, happy start to the day!' : 'Tick each step every evening. Slow and cosy, ready for sleep.', noName: true });
    const lw = 60, cw = (pg.width - lw) / 7, hh = 11, rh = Math.min(28, (pg.room - hh - 4) / steps.length);
    WEEKDAYS.map((d) => d.slice(0, 3)).forEach((d, i) => pg.add(`<rect x="${pg.left + lw + i * cw}" y="${pg.y}" width="${cw}" height="${hh}" fill="${lk.tint}" stroke="#d9d4ec" stroke-width="0.4"/>` + txt(pg.left + lw + i * cw + cw / 2, pg.y + 7.6, d, 5.2, { colour: lk.ring })));
    steps.forEach((s, j) => { const [e, ...t] = s.split(' '), y = pg.y + hh + j * rh; pg.add(`<rect x="${pg.left}" y="${y}" width="${lw}" height="${rh}" fill="${TINTS[j % TINTS.length]}" stroke="#d9d4ec" stroke-width="0.4"/>` + emoji(e, pg.left + 9, y + rh / 2, Math.min(11, rh * 0.5)) + txt(pg.left + 18, y + rh / 2 + 2, t.join(' '), fitFont(t.join(' '), 5.6, lw - 20, 0.55), { anchor: 'start', colour: INK })); for (let i = 0; i < 7; i++) pg.add(`<rect x="${pg.left + lw + i * cw}" y="${y}" width="${cw}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.4"/><rect x="${pg.left + lw + i * cw + cw / 2 - 4}" y="${y + rh / 2 - 4}" width="8" height="8" rx="2" fill="#fff" stroke="${PALETTE[j % PALETTE.length]}" stroke-width="0.7"/>`); });
    return pg.svg();
  };
  kids.forEach((k) => { pages.push(routineChart(k, 'morning')); pages.push(routineChart(k, 'bedtime')); });
  // Chores: all children on one chart per week, four weeks.
  {
    const chores = CHORES[o.chores] || CHORES.little;
    for (let w = 1; w <= 2; w++) {
      const pg = new Page(paper, `Family chore chart: weeks ${w * 2 - 1} and ${w * 2}`, { subtitle: 'Everyone helps! Write initials or draw a smile in the box when a job is done.', noName: true });
      for (let half = 0; half < 2; half++) {
        const top = pg.y + half * (pg.room / 2), lw = 54, cw = (pg.width - lw) / 7, hh = 10, rh = Math.min(13, (pg.room / 2 - hh - 12) / chores.length);
        pg.add(txt(pg.left, top + 6, `Week ${w * 2 - 1 + half}`, 6.4, { anchor: 'start', colour: PALETTE[half + w] }) + txt(pg.right, top + 6, kids.map((k) => `${k}: ${PALETTE_NAMES[kids.indexOf(k)]}`).join('   '), 4.6, { anchor: 'end', font: FONT, colour: SOFT }));
        const y0 = top + 9;
        WEEKDAYS.map((d) => d.slice(0, 3)).forEach((d, i) => pg.add(`<rect x="${pg.left + lw + i * cw}" y="${y0}" width="${cw}" height="${hh}" fill="${lk.tint}" stroke="#d9d4ec" stroke-width="0.4"/>` + txt(pg.left + lw + i * cw + cw / 2, y0 + 7, d, 5, { colour: lk.ring })));
        chores.forEach((c, j) => { const [e, ...t] = c.split(' '), y = y0 + hh + j * rh; pg.add(`<rect x="${pg.left}" y="${y}" width="${lw}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.4"/>` + emoji(e, pg.left + 6, y + rh / 2, rh * 0.55) + txt(pg.left + 12, y + rh / 2 + 1.8, t.join(' '), fitFont(t.join(' '), 5, lw - 14, 0.55), { anchor: 'start', colour: INK })); for (let i = 0; i < 7; i++) { pg.add(`<rect x="${pg.left + lw + i * cw}" y="${y}" width="${cw}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.4"/>`); kids.forEach((_, q) => pg.add(`<circle cx="${pg.left + lw + i * cw + cw / 2 + (q - (kids.length - 1) / 2) * 6}" cy="${y + rh / 2}" r="2.2" fill="#fff" stroke="${PALETTE[q]}" stroke-width="0.7"/>`)); } });
      }
      pages.push(pg.svg());
    }
  }
  // Reward chart per child: 4 weeks of stars.
  kids.forEach((kid, q) => {
    const pg = new Page(paper, `${possessive(kid)} star chart for ${mName}`, { subtitle: 'Colour a star for kind words, helping, trying hard and good listening. Fill a row, earn a treat!', noName: true });
    const lw = 34, cw = (pg.width - lw) / 7, rh = Math.min(40, (pg.room - 60) / 4);
    for (let w = 0; w < 4; w++) { const y = pg.y + w * rh; pg.add(`<rect x="${pg.left}" y="${y}" width="${lw}" height="${rh}" fill="${TINTS[w]}" stroke="#d9d4ec" stroke-width="0.4"/>` + txt(pg.left + lw / 2, y + rh / 2 + 2, `Week ${w + 1}`, 6, { colour: PALETTE[w] })); for (let i = 0; i < 7; i++) pg.add(`<rect x="${pg.left + lw + i * cw}" y="${y}" width="${cw}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.4"/><path d="${starPath(pg.left + lw + i * cw + cw / 2, y + rh / 2, Math.min(cw, rh) * 0.34, 0.45)}" fill="#fff" stroke="${PALETTE[(q + i) % PALETTE.length]}" stroke-width="0.9"/>`); }
    pg.y += 4 * rh + 8;
    for (let w = 0; w < 4; w++) { const x = pg.left + (w % 2) * (pg.width / 2), y = pg.y + Math.floor(w / 2) * 22; pg.add(panel(x + 2, y, pg.width / 2 - 4, 19, lk.tint, lk.ring, 8) + emoji('🎁', x + 11, y + 9.5, 8) + txt(x + 20, y + 12, `Week ${w + 1} treat:`, 5.6, { anchor: 'start', colour: lk.ring }) + `<line x1="${x + 56}" x2="${x + pg.width / 2 - 10}" y1="${y + 12.6}" y2="${y + 12.6}" stroke="#b9b3d6" stroke-width="0.5"/>`); }
    pages.push(pg.svg());
  });
  // Sunday check-ins, two weeks per page.
  for (let p = 0; p < 2; p++) {
    const pg = new Page(paper, `Sunday family check-in: weeks ${p * 2 + 1} and ${p * 2 + 2}`, { subtitle: 'Ten minutes together on Sunday. Everyone gets a turn to talk, and grown-ups share too!', noName: true });
    const qs = [['🌟', 'The best thing this week'], ['🌧️', 'Something that was hard'], ['🙏', 'Thank you to'], ['🎯', 'Next week we will']], bh = pg.room / 2;
    for (let h = 0; h < 2; h++) { const y0 = pg.y + h * bh; pg.add(txt(pg.left, y0 + 7, `Week ${p * 2 + h + 1}`, 7, { anchor: 'start', colour: lk.ring })); const qh = (bh - 14) / 4; qs.forEach(([e, t], i) => { const y = y0 + 11 + i * qh; pg.add(panel(pg.left, y, pg.width, qh - 3, TINTS[i], PALETTE[i], 8) + emoji(e, pg.left + 9, y + 8, 7) + txt(pg.left + 18, y + 9.6, t, 5.8, { anchor: 'start', colour: PALETTE[i] }) + `<line x1="${pg.left + 18}" x2="${pg.right - 8}" y1="${y + qh - 8}" y2="${y + qh - 8}" stroke="#c9c3e3" stroke-width="0.45"/>`); }); }
    pages.push(pg.svg());
  }
  pages.push(seriesCert(paper, `${mName.toUpperCase()} ${yr}`, 'Family Team of the Month', family ? `The ${family} Family` : kids.join(', '), 'for helping each other, trying hard and being kind all month long!', 'Next month: print a fresh Family Month and keep going!', lk.ring));
  return pages;
}
const PALETTE_NAMES = ['red circle', 'yellow circle', 'green circle'];

Object.assign(MAKERS, { handmonth: makeHandMonth, mathsday: makeMathsDay, readmonth: makeReadMonth, familymonth: makeFamilyMonth });
