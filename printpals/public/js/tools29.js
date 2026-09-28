// PrintPals batch 29 (Plus editions): Times Tables Club, Time Month, Phonics Month and Tiny Hands Month.

// ================================================================ Times Tables Club (Plus edition)
const TT_WEEKS = { start: [2, 10, 5, 3], next: [3, 4, 6, 8], master: [6, 7, 8, 9] };

function makeTimesClub(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const nm = name || 'Mia';
  const lk = edLook(o.look), level = TT_WEEKS[o.level] ? o.level : 'start', weeks = TT_WEEKS[level];
  const pages = [seriesCover(paper, 'PRINTPALS PLUS EDITION', name ? `${possessive(name)} Times Tables Club` : 'Times Tables Club', `This month: the ${weeks.slice(0, 3).join(', ')} and ${weeks[3]} times tables`, weeks.map((t) => `×${t}`).concat(['⚡', '🏆']), lk.ring, lk.tint, 'club book', ['Club membership card', 'A new table each week', 'Learn, practise, use', 'Friday speed test', 'A badge for every table', 'Answers for grown-ups'])];
  // Membership card and badges.
  pages.push(tagsPage(paper, 'My club card and badges', 'Cut out your membership card. Colour a badge each time you pass a Friday speed test!', 2, 1, (pg, x, y, w, h, i) => {
    if (i === 0) {
      pg.add(`<rect x="${x + 20}" y="${y + 6}" width="${w - 40}" height="${h - 12}" rx="10" fill="${lk.tint}" stroke="${lk.ring}" stroke-width="1.4"/><rect x="${x + 20}" y="${y + 6}" width="${w - 40}" height="16" rx="10" fill="${lk.ring}"/>` + txt(x + w / 2, y + 17, 'TIMES TABLES CLUB', 8, { colour: '#fff' }).replace('<text ', '<text letter-spacing="2" '));
      pg.add(txt(x + 32, y + 36, 'Member:', 6, { anchor: 'start', font: FONT, colour: SOFT }) + txt(x + 58, y + 36, nm, 9, { anchor: 'start', colour: lk.ring }) + txt(x + 32, y + 50, 'Joined:', 6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${x + 58}" x2="${x + w / 2 + 10}" y1="${y + 50.6}" y2="${y + 50.6}" stroke="#b9b3d6" stroke-width="0.5"/>` + txt(x + 32, y + 64, 'Club promise: I practise a little every day!', 6, { anchor: 'start', colour: INK }) + emoji('🏆', x + w - 50, y + 46, 22));
    } else {
      const tables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], cw = (w - 16) / 6;
      tables.forEach((t, k) => { const cx = x + 8 + (k % 6) * cw + cw / 2, cy = y + 22 + Math.floor(k / 6) * 40, on = weeks.includes(t); pg.add(`<circle cx="${cx}" cy="${cy}" r="15" fill="#fff" stroke="${on ? lk.ring : '#b9b3d6'}" stroke-width="${on ? 1.4 : 0.7}" stroke-dasharray="${on ? '' : '2 1.5'}"/><path d="${starPath(cx, cy - 2, 9, 0.5)}" fill="none" stroke="${on ? lk.accent : '#d9d4ec'}" stroke-width="0.7"/>` + txt(cx, cy + 11, `×${t}`, 6.4, { colour: on ? lk.ring : SOFT })); });
      pg.add(txt(x + w - 20, y + h - 12, 'Bold badges are this month!', 5, { anchor: 'end', font: FONT, colour: SOFT }));
    }
  }));
  pages.push(monthPlanPage(paper, lk, 'My club month plan', 'Monday learn, Tuesday fill the gaps, Wednesday mix it up, Thursday use it, Friday speed test!', weeks.flatMap((t) => [`Learn ×${t}`, 'Gaps', 'Mixed', 'Use it', 'Speed test']), 'My club reward'));
  const answers = [];
  weeks.forEach((t, wi) => {
    const w = wi + 1;
    // Monday: learn the table.
    {
      const pg = new Page(paper, `Learn the ${t} times table`, { subtitle: `Count in ${t}s along the line, then trace the answers and say them out loud!` });
      dayStrip(pg, lk, w, 1);
      const n = 12, x0 = pg.left + 6, step = (pg.width - 12) / n;
      pg.add(`<line x1="${x0}" x2="${x0 + n * step}" y1="${pg.y + 12}" y2="${pg.y + 12}" stroke="${INK}" stroke-width="0.8"/>`);
      for (let k = 0; k <= n; k++) { pg.add(`<line x1="${x0 + k * step}" x2="${x0 + k * step}" y1="${pg.y + 9}" y2="${pg.y + 15}" stroke="${INK}" stroke-width="0.6"/>` + txt(x0 + k * step, pg.y + 22, `${k * t}`, 5, { colour: PALETTE[k % PALETTE.length] })); if (k < n) pg.add(`<path d="M${x0 + k * step + 1} ${pg.y + 8} Q${x0 + k * step + step / 2} ${pg.y - 2} ${x0 + (k + 1) * step - 1} ${pg.y + 8}" fill="none" stroke="${lk.ring}" stroke-width="0.6"/>`); }
      pg.y += 30;
      const rh = (pg.room - 20) / 12;
      for (let k = 1; k <= 12; k++) { const y = pg.y + (k - 1) * rh, size = Math.min(rh * 0.6, 12); pg.add(panel(pg.left, y + 1, pg.width, rh - 2, k % 2 ? '#fff' : lk.tint, '#e2ddf2', 6) + txt(pg.left + 12, y + rh * 0.66, `${k}  ×  ${t}  =`, size * 0.9, { anchor: 'start', colour: INK })); pg.add(drawText(String(k * t), pg.left + 70, y + (rh - size) / 2, size, 'trace', false)); pg.add(emoji('🍎', pg.left + 110, y + rh / 2, Math.min(7, rh * 0.5))); pg.add(txt(pg.left + 116, y + rh * 0.66, `${k} group${k > 1 ? 's' : ''} of ${t}`, 5.2, { anchor: 'start', font: FONT, colour: SOFT })); }
      howDidIDo(pg, lk);
      pages.push(pg.svg());
    }
    // Tuesday: fill the gaps. Wednesday: mixed. Thursday: use it.
    const qset = (count, mix) => { const q = []; for (let k = 0; k < count; k++) { const tt = mix ? weeks[Math.floor(rand() * (wi + 1))] : t, m = 1 + Math.floor(rand() * 12); q.push(rand() < 0.5 ? [`${m} × ${tt} =`, m * tt] : [`${tt} × ${m} =`, m * tt]); } return q; };
    const sumsPage = (title, sub, d, qs, extra) => {
      const pg = new Page(paper, title, { subtitle: sub });
      dayStrip(pg, lk, w, d);
      if (d === 5) { pg.add(panel(pg.left, pg.y, pg.width, 16, lk.tint, lk.ring, 8) + txt(pg.left + 8, pg.y + 10.6, '⏱️ Time:', 6.4, { anchor: 'start', colour: lk.ring }) + `<rect x="${pg.left + 36}" y="${pg.y + 3}" width="30" height="10" rx="3" fill="#fff" stroke="${lk.ring}" stroke-width="0.7"/>` + txt(pg.left + 76, pg.y + 10.6, 'Score:', 6.4, { anchor: 'start', colour: lk.ring }) + `<rect x="${pg.left + 98}" y="${pg.y + 3}" width="22" height="10" rx="3" fill="#fff" stroke="${lk.ring}" stroke-width="0.7"/>` + txt(pg.left + 124, pg.y + 10.6, `out of ${qs.length}`, 6, { anchor: 'start', colour: INK })); pg.y += 20; }
      const cols = 2, rh = Math.min(16, (pg.room - (extra ? 60 : 20)) / Math.ceil(qs.length / cols)), cw = pg.width / cols;
      qs.forEach(([q], k) => { const x = pg.left + (k % cols) * cw, y = pg.y + Math.floor(k / cols) * rh; pg.add(panel(x + 2, y, cw - 4, rh - 3, Math.floor(k / cols) % 2 ? '#fff' : TINTS[k % TINTS.length], '#e2ddf2', 6) + txt(x + 8, y + rh / 2 + 1.4, `${k + 1}.`, 5, { anchor: 'start', font: FONT, colour: SOFT }) + txt(x + 18, y + rh / 2 + 2, q, Math.min(8, rh * 0.55), { anchor: 'start', colour: INK }) + `<rect x="${x + cw - 30}" y="${y + 2}" width="24" height="${rh - 7}" rx="3" fill="#fff" stroke="${lk.ring}" stroke-width="0.7"/>`); });
      pg.y += Math.ceil(qs.length / cols) * rh + 6;
      if (extra) extra(pg);
      howDidIDo(pg, lk);
      answers.push([`W${w} ${DAYS5[d - 1].slice(0, 3)}`, qs.map((q) => q[1])]);
      return pg.svg();
    };
    // Tuesday: gaps in order.
    { const qs = []; for (let k = 1; k <= 12; k++) qs.push([`${k} × ${t} =`, k * t]); pages.push(sumsPage(`Fill the gaps: ${t} times table`, 'Write every answer. Stuck? Count on in steps from the one before!', 2, qs, (pg) => { pg.add(txt(pg.left, pg.y + 5, `Count in ${t}s: fill the missing numbers`, 6.4, { anchor: 'start', colour: lk.ring })); const cw = pg.width / 10; for (let k = 0; k < 10; k++) { const v = (k + 1) * t, blank = k % 3 === 1; pg.add(`<rect x="${pg.left + k * cw + 2}" y="${pg.y + 9}" width="${cw - 4}" height="14" rx="4" fill="${blank ? '#fff' : lk.tint}" stroke="${lk.ring}" stroke-width="0.7"/>` + (blank ? '' : txt(pg.left + k * cw + cw / 2, pg.y + 18.6, `${v}`, 7, { colour: INK }))); } pg.y += 28; })); }
    pages.push(sumsPage(`Mixed practice: week ${w}`, wi ? 'This week\'s table mixed with the ones you already know!' : 'Mixed up this time! Take your time.', 3, qset(16, true)));
    // Thursday: use it (story sums with the name).
    {
      const stories = [[`${nm} has {m} bags with ${t} sweets in each. How many sweets?`, '🍬'], [`There are {m} cars. Each car has ${t} wheels... well, pretend! How many wheels?`, '🚗'], [`${nm} makes {m} rows of ${t} stickers. How many stickers?`, '⭐'], [`{m} friends each bring ${t} apples. How many apples?`, '🍎']];
      const pg = new Page(paper, `Use the ${t} times table`, { subtitle: 'Real life maths! Draw the groups if it helps, then write the answer.' });
      dayStrip(pg, lk, w, 4);
      const bh = (pg.room - 20) / 4, a = [];
      stories.forEach(([s, e], k) => { const m = 2 + Math.floor(rand() * 5), y = pg.y + k * bh, text = s.replace('{m}', m); pg.add(panel(pg.left, y + 2, pg.width, bh - 5, TINTS[k], PALETTE[k], 10) + emoji(e, pg.left + 12, y + 14, 11)); wrap(text, 56).forEach((l, j) => pg.add(txt(pg.left + 24, y + 12 + j * 7, l, 6.4, { anchor: 'start', colour: INK }))); pg.add(`<rect x="${pg.right - 32}" y="${y + bh - 20}" width="24" height="12" rx="3" fill="#fff" stroke="${PALETTE[k]}" stroke-width="0.8"/>`); a.push(m * t); });
      howDidIDo(pg, lk);
      answers.push([`W${w} Thu`, a]);
      pages.push(pg.svg());
    }
    pages.push(sumsPage(`Friday speed test: ${t} times table`, 'Ready, steady, go! A grown-up times you. Try to beat your time next week!', 5, qset(20, false)));
  });
  {
    const pg = new Page(paper, 'Times Tables Club: answers', { subtitle: 'Answer key for grown-ups, in the order of each page.', noName: true });
    const rh = pg.room / answers.length;
    answers.forEach(([lab, a], i) => pg.add(txt(pg.left, pg.y + i * rh + rh * 0.7, lab, 5, { anchor: 'start', colour: lk.ring }) + txt(pg.left + 22, pg.y + i * rh + rh * 0.7, a.join(', '), fitFont(a.join(', '), 5, pg.width - 24, 0.5), { anchor: 'start', font: FONT, colour: INK })));
    pages.push(pg.svg());
  }
  pages.push(seriesCert(paper, 'TIMES TABLES CLUB', 'Times Tables Champion', name, `for mastering the ${weeks.slice(0, 3).join(', ')} and ${weeks[3]} times tables!`, level === 'master' ? 'You are a times tables master!' : 'Next month: the next level of the club!', lk.ring));
  return pages;
}

// ================================================================ Time Month (Plus edition)
const TM_WEEKS = { easy: [['oclock'], ['oclock', 'half'], ['half'], ['oclock', 'half']], harder: [['oclock', 'half'], ['quarter'], ['quarter', 'half'], ['five']] };
const TM_TITLE = { oclock: 'o\'clock', half: 'half past', quarter: 'quarter past and to', five: 'five minutes' };

function tmTime(kinds, rand) {
  const k = kinds[Math.floor(rand() * kinds.length)], h = 1 + Math.floor(rand() * 12);
  const m = k === 'oclock' ? 0 : k === 'half' ? 30 : k === 'quarter' ? (rand() < 0.5 ? 15 : 45) : 5 * Math.floor(rand() * 12);
  return [h, m];
}

function makeTimeMonth(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const lk = edLook(o.look), level = TM_WEEKS[o.level] ? o.level : 'easy', plan = TM_WEEKS[level];
  const pages = [seriesCover(paper, 'PRINTPALS PLUS EDITION', name ? `${possessive(name)} Time Month` : 'My Time Month', level === 'easy' ? 'O\'clock and half past, 4 weeks' : 'Quarter hours and five minutes, 4 weeks', ['🕐', '🕜', '⏰', lk.corner, '🌞', '🏆'], lk.ring, lk.tint, 'workbook', ['Read the clocks', 'Draw the hands', 'My day in times', 'Friday time check', 'Make a paper clock', 'Answers for grown-ups'])];
  pages.push(monthPlanPage(paper, lk, 'My time month plan', 'A little time telling every day. Keep a real clock nearby to check!', plan.flatMap((k) => ['Read it', 'Draw it', 'Read it', 'My day', 'Time check']), 'My time reward'));
  const answers = [];
  plan.forEach((kinds, wi) => {
    const w = wi + 1, label = kinds.map((k) => TM_TITLE[k]).join(' and ');
    for (let d = 1; d <= 5; d++) {
      const kind = d === 2 ? 'draw' : d === 4 ? 'day' : 'read', friday = d === 5;
      const pg = new Page(paper, friday ? `Friday time check: ${label}` : kind === 'draw' ? `Draw the hands: ${label}` : kind === 'day' ? 'My day in times' : `Read the clocks: ${label}`, { subtitle: kind === 'draw' ? 'Draw the short hour hand and the long minute hand to show each time.' : kind === 'day' ? 'What time do you do these things? Draw the hands, then draw what you do!' : 'Look at the hands. Write the time underneath each clock.' });
      dayStrip(pg, lk, w, d);
      if (kind === 'day') {
        const acts = [['🌅', 'I wake up'], ['🥣', 'I eat breakfast'], ['🏫', 'I go to school or play'], ['🍽️', 'I eat dinner'], ['🛁', 'Bath time'], ['😴', 'Bedtime']], cw = pg.width / 2, ch = (pg.room - 20) / 3;
        acts.forEach(([e, t], k) => { const x = pg.left + (k % 2) * cw, y = pg.y + Math.floor(k / 2) * ch; pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, TINTS[k], PALETTE[k], 10) + emoji(e, x + 12, y + 12, 9) + txt(x + 22, y + 14, t, 6.4, { anchor: 'start', colour: PALETTE[k] })); clock(pg, x + cw * 0.3, y + ch * 0.58, Math.min(ch * 0.3, cw * 0.22), 0, 0, false); pg.add(`<rect x="${x + cw * 0.56}" y="${y + ch * 0.3}" width="${cw * 0.38}" height="${ch * 0.55}" rx="6" fill="#fff" stroke="${PALETTE[k]}" stroke-width="0.5" stroke-dasharray="2 1.5"/>`); });
        answers.push([`W${w} Thu`, ['my own answers']]);
      } else {
        const n = friday ? 9 : 6, cols = 3, cw = pg.width / cols, ch = (pg.room - 20) / Math.ceil(n / cols), a = [];
        for (let k = 0; k < n; k++) {
          const [h, m] = tmTime(kinds, rand), x = pg.left + (k % cols) * cw, y = pg.y + Math.floor(k / cols) * ch, r = Math.min(cw * 0.34, ch * 0.3);
          const drawIt = kind === 'draw' || (friday && k % 3 === 2);
          clock(pg, x + cw / 2, y + ch * 0.42, r, h, m, !drawIt);
          pg.add(drawIt ? txt(x + cw / 2, y + ch * 0.88, timeWords(h, m), fitFont(timeWords(h, m), 7, cw - 8, 0.52), { colour: lk.ring }) : `<rect x="${x + cw * 0.14}" y="${y + ch * 0.8}" width="${cw * 0.72}" height="${ch * 0.14}" rx="4" fill="#fff" stroke="${lk.ring}" stroke-width="0.7"/>`);
          a.push(drawIt ? `(draw) ${timeWords(h, m)}` : timeWords(h, m));
        }
        answers.push([`W${w} ${DAYS5[d - 1].slice(0, 3)}`, a]);
      }
      howDidIDo(pg, lk);
      pages.push(pg.svg());
    }
  });
  pages.push(...packRun('clockcraft', {}, paper, +o.seed || 1).sheets);
  {
    const pg = new Page(paper, 'Time Month: answers', { subtitle: 'Answer key for grown-ups.', noName: true });
    const rh = pg.room / answers.length;
    answers.forEach(([lab, a], i) => pg.add(txt(pg.left, pg.y + i * rh + rh * 0.7, lab, 5, { anchor: 'start', colour: lk.ring }) + txt(pg.left + 22, pg.y + i * rh + rh * 0.7, a.join(', '), fitFont(a.join(', '), 5, pg.width - 24, 0.5), { anchor: 'start', font: FONT, colour: INK })));
    pages.push(pg.svg());
  }
  pages.push(seriesCert(paper, 'TIME MONTH COMPLETE', 'Time Teller Star', name, 'for learning to tell the time like a grown-up!', level === 'easy' ? 'Next month: quarter past and five minutes!' : 'You can tell the time. Brilliant!', lk.ring));
  return pages;
}

// ================================================================ Phonics Month (Plus edition)
const PH_WEEKS = [
  { sounds: 's a t p', words: ['sat', 'pat', 'tap', 'sap', 'at', 'pats'], sentence: 'Pat sat.' },
  { sounds: 'i n m d', words: ['pin', 'tin', 'sit', 'man', 'dad', 'mad', 'dip'], sentence: 'Dad sat in a tin!' },
  { sounds: 'g o c k', words: ['dog', 'cat', 'got', 'cot', 'kit', 'pig', 'cod'], sentence: 'A cat got on a dog.' },
  { sounds: 'e u r h', words: ['hen', 'red', 'sun', 'hut', 'run', 'cup', 'hug'], sentence: 'The red hen can run.' },
];

function makePhonicsMonth(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const lk = edLook(o.look);
  const all = Object.values(PHONICS_BOOKS).flatMap((b) => b.sounds), pics = {};
  all.forEach(([s, p]) => { pics[s] = p; });
  const order = PH_WEEKS.flatMap((wk) => wk.sounds.split(' '));
  const pages = [seriesCover(paper, 'PRINTPALS PLUS EDITION', name ? `${possessive(name)} Phonics Month` : 'My Phonics Month', '16 sounds and first words in 4 weeks', order.slice(0, 6), lk.ring, lk.tint, 'workbook', ['A new sound each day', 'Pictures to circle', 'Trace and write', 'First sound puzzles', 'Friday: blend and read', 'Phonics certificate'])];
  pages.push(monthPlanPage(paper, lk, 'My phonics month plan', 'A new sound Monday to Thursday. On Friday, blend the sounds into real words!', PH_WEEKS.flatMap((wk) => wk.sounds.split(' ').map((s) => `Sound ${s}`).concat(['Blend it!'])), 'My phonics reward'));
  PH_WEEKS.forEach((wk, wi) => {
    const w = wi + 1;
    wk.sounds.split(' ').forEach((s, di) => {
      const d = di + 1, own = pics[s] || [], others = all.filter(([x]) => x !== s && x.length === 1).flatMap(([, p]) => p);
      const pg = new Page(paper, `Today's sound: ${s}`, { subtitle: `Say "${s}" like in ${own[0] ? own[0][0] : s}. Trace it, then find the pictures that start with ${s}!` });
      dayStrip(pg, lk, w, d);
      const bs = 42;
      pg.add(panel(pg.left, pg.y, 56, bs, lk.tint, lk.ring, 10));
      const ls = bs - 14; pg.add(drawText(s, pg.left + 28 - (textWidth(s) / 100) * ls / 2, pg.y + 7, ls, 'trace', true));
      own.forEach(([wd, e], k) => { const x = pg.left + 60 + k * ((pg.width - 60) / 3), cw = (pg.width - 60) / 3; pg.add(panel(x + 2, pg.y, cw - 4, bs, '#fff', '#e2ddf2', 10) + emoji(e, x + cw / 2, pg.y + 16, 18) + `<text x="${x + cw / 2}" y="${pg.y + bs - 6}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="7"><tspan fill="${lk.ring}">${esc(wd.slice(0, s.length))}</tspan><tspan fill="${INK}">${esc(wd.slice(s.length))}</tspan></text>`); });
      pg.y += bs + 8;
      const row = `${s}  ${s}  ${s}  ${s}  ${s}  ${s}  ${s}  ${s}`, size = Math.min(16, (pg.width - 6) / (textWidth(row) / 100 + 0.1));
      writeRows(pg, pg.y, 2, size);
      pg.add(drawText(row, pg.left + 2, pg.y, size, 'trace', false) + drawText(row, pg.left + 2, pg.y + size * 1.6, size, 'ghost', false));
      pg.y += size * 3.2 + 4;
      pg.add(txt(pg.left, pg.y + 3, `Circle everything that starts with "${s}"`, 6.4, { anchor: 'start', colour: PALETTE[2] }));
      pg.y += 7;
      const mix = shuffle(own.map((p) => p[1]).concat(shuffle(others, rand).slice(0, 5).map((p) => p[1])), rand), cw = pg.width / 4, ch = 24;
      mix.forEach((e, k) => { const x = pg.left + (k % 4) * cw + cw / 2, y = pg.y + Math.floor(k / 4) * ch + ch / 2; pg.add(`<circle cx="${x}" cy="${y}" r="10" fill="#fff" stroke="#e2ddf2" stroke-width="0.6"/>` + emoji(e, x, y, 13)); });
      pg.y += Math.ceil(mix.length / 4) * ch + 4;
      if (pg.bottom - pg.y > 40) {
        pg.add(txt(pg.left, pg.y + 3, 'Write the first sound', 6.4, { anchor: 'start', colour: PALETTE[3] }));
        pg.y += 7;
        own.forEach(([wd, e], k) => { const x = pg.left + k * (pg.width / 3), cw = pg.width / 3; pg.add(emoji(e, x + 12, pg.y + 10, 12) + `<rect x="${x + 24}" y="${pg.y + 2}" width="12" height="14" rx="3" fill="#fff" stroke="${lk.ring}" stroke-width="0.8"/>` + txt(x + 38, pg.y + 13, wd.slice(s.length), 9, { anchor: 'start', colour: INK })); });
      }
      howDidIDo(pg, lk);
      pages.push(pg.svg());
    });
    // Friday: blend and read.
    {
      const pg = new Page(paper, `Friday: blend and read! Week ${w}`, { subtitle: 'Say each sound, then push them together to read the word. Tick each word you can read!' });
      dayStrip(pg, lk, w, 5);
      const words = wk.words.slice(0, 6), rh = Math.min(22, (pg.room - 70) / words.length);
      words.forEach((wd, k) => { const y = pg.y + k * rh; pg.add(panel(pg.left, y + 1, pg.width, rh - 3, TINTS[k % TINTS.length], PALETTE[k % PALETTE.length], 8)); [...wd].forEach((ch, j) => pg.add(`<circle cx="${pg.left + 16 + j * 14}" cy="${y + rh / 2}" r="5.4" fill="#fff" stroke="${PALETTE[k % PALETTE.length]}" stroke-width="0.7"/>` + txt(pg.left + 16 + j * 14, y + rh / 2 + 2.6, ch, 7, { colour: INK }))); pg.add(`<path d="M${pg.left + 12} ${y + rh - 5} H${pg.left + 16 + (wd.length - 1) * 14 + 4}" stroke="${PALETTE[k % PALETTE.length]}" stroke-width="0.7" marker-end=""/>` + txt(pg.left + 80, y + rh / 2 + 3, wd, 10, { anchor: 'start', colour: INK }) + `<rect x="${pg.right - 18}" y="${y + rh / 2 - 5}" width="10" height="10" rx="2" fill="#fff" stroke="${PALETTE[k % PALETTE.length]}" stroke-width="0.8"/>`); });
      pg.y += words.length * rh + 8;
      const bh = Math.min(50, pg.bottom - 22 - pg.y);
      pg.add(panel(pg.left, pg.y, pg.width, bh, '#fff', lk.ring, 12) + txt(pg.left + 10, pg.y + 10, 'Read my sentence, then draw it!', 6, { anchor: 'start', colour: lk.ring }));
      colourSentence(pg, wk.sentence, pg.w / 2, pg.y + 24, 12, [], lk.ring, pg.width - 20);
      howDidIDo(pg, lk);
      pages.push(pg.svg());
    }
  });
  pages.push(seriesCert(paper, 'PHONICS MONTH COMPLETE', 'Super Sounds Star', name, 'for learning 16 sounds and reading real words!', 'Next: the My Phonics Books and Reading Month!', lk.ring));
  return pages;
}

// ================================================================ Tiny Hands Month (ages 2 to 3, Plus edition)
const TH_TYPES = ['trace', 'dots', 'colour', 'snip', 'match'];

function tinyTracePage(pg, lk, i) {
  const kinds = ['straight', 'wave', 'zigzag', 'bumps', 'loops'], type = kinds[Math.floor(i / 5) % kinds.length], rows = 4, rh = (pg.room - 20) / rows;
  const ends = [['🐝', '🌸'], ['🚗', '🏠'], ['🐶', '🦴'], ['🐟', '🌊'], ['🐰', '🥕'], ['🚀', '🌙']];
  for (let r = 0; r < rows; r++) {
    const y = pg.y + r * rh + rh / 2, [a, b] = ends[(Math.floor(i / 5) + r) % ends.length], x0 = pg.left + 22, x1 = pg.right - 22, amp = rh * 0.22;
    let d = `M${x0} ${y}`;
    for (let k = 1; k <= 60; k++) { const u = k / 60, x = x0 + (x1 - x0) * u, ph = u * 4 * Math.PI * 2 / 2; let yy = y; if (type === 'wave') yy = y - Math.sin(ph) * amp; else if (type === 'zigzag') { const f = (u * 8) % 2; yy = y - (f < 1 ? f : 2 - f) * amp * 2 + amp; } else if (type === 'bumps') yy = y - Math.abs(Math.sin(ph)) * amp * 1.6 + amp * 0.8; else if (type === 'loops') yy = y - Math.sin(ph * 1.5) * amp; d += ` L${x.toFixed(1)} ${yy.toFixed(1)}`; }
    pg.add(`<path d="${d}" fill="none" stroke="#b9b3d6" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="0.1 5"/><circle cx="${x0}" cy="${y}" r="3" fill="#3fbf7f"/>` + emoji(a, pg.left + 9, y, 14) + emoji(b, pg.right - 9, y, 14));
  }
}

function tinyDotsPage(pg, lk, i) {
  const cx = pg.w / 2, cy = pg.y + (pg.room - 20) / 2, R = Math.min(pg.width, pg.room - 30) * 0.4, pts = [];
  const shape = ['sun', 'heart', 'snail', 'caterpillar', 'flower'][Math.floor(i / 5) % 5];
  if (shape === 'sun') { for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; pts.push([cx + Math.cos(a) * R * 0.55, cy + Math.sin(a) * R * 0.55]); } pts.push([cx, cy]); for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 + 0.2; pts.push([cx + Math.cos(a) * R * 0.95, cy + Math.sin(a) * R * 0.95]); } }
  else if (shape === 'heart') { for (let k = 0; k < 18; k++) { const t = (k / 18) * Math.PI * 2; pts.push([cx + R * 0.055 * 16 * Math.pow(Math.sin(t), 3), cy - R * 0.055 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]); } }
  else if (shape === 'snail') { for (let k = 0; k < 16; k++) { const a = k * 0.7, rr = R * 0.12 + k * R * 0.04; pts.push([cx + Math.cos(a) * rr, cy - R * 0.1 + Math.sin(a) * rr]); } }
  else if (shape === 'caterpillar') { for (let k = 0; k < 7; k++) pts.push([pg.left + 16 + k * (pg.width - 32) / 6, cy + Math.sin(k * 1.2) * R * 0.25]); }
  else { for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; pts.push([cx + Math.cos(a) * R * 0.5, cy - R * 0.2 + Math.sin(a) * R * 0.5]); } pts.push([cx, cy - R * 0.2]); for (let k = 1; k <= 3; k++) pts.push([cx, cy - R * 0.2 + k * R * 0.28]); }
  const rr = shape === 'caterpillar' ? 12 : 9, kept = [];
  pts.forEach(([x, y]) => { if (!kept.some(([a, b]) => Math.hypot(a - x, b - y) < rr * 2.1)) kept.push([x, y]); });
  pts.length = 0; pts.push(...kept);
  pts.forEach(([x, y], k) => pg.add(`<circle cx="${x}" cy="${y}" r="${rr}" fill="#fff" stroke="${PALETTE[k % PALETTE.length]}" stroke-width="1.4"/>`));
  if (shape === 'caterpillar') pg.add(emoji('👀', pts[pts.length - 1][0], pts[pts.length - 1][1], 14));
  return shape;
}

function tinySnipPage(pg, lk, i) {
  const n = 5, sw = pg.width / n, h = pg.room - 24;
  for (let k = 0; k < n; k++) {
    const x = pg.left + k * sw, c = PALETTE[(i + k) % PALETTE.length], type = (i + k) % 3;
    pg.add(`<rect x="${x + 3}" y="${pg.y}" width="${sw - 6}" height="${h}" rx="6" fill="${TINTS[k % TINTS.length]}" stroke="${c}" stroke-width="0.8"/>` + emoji('✂️', x + sw / 2, pg.y + 8, 9));
    let d = `M${x + sw / 2} ${pg.y + 16}`;
    for (let s = 1; s <= 30; s++) { const y = pg.y + 16 + (h - 24) * s / 30, dx = type === 0 ? 0 : type === 1 ? Math.sin(s / 3) * sw * 0.2 : (s % 6 < 3 ? 1 : -1) * sw * 0.16; d += ` L${x + sw / 2 + dx} ${y}`; }
    pg.add(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="1.4" stroke-dasharray="4 3"/>`);
  }
}

function tinyMatchPage(pg, lk, i, rand) {
  const sets = [['🍎', '🍌', '🍓', '🍊'], ['🐶', '🐱', '🐰', '🐸'], ['🚗', '🚀', '🚂', '⛵'], ['⭐', '❤️', '🌙', '☀️'], ['🧸', '⚽', '🎈', '🪁']][Math.floor(i / 5) % 5], right = shuffle(sets, rand), rh = (pg.room - 20) / 4;
  sets.forEach((e, k) => { const y = pg.y + k * rh + rh / 2; pg.add(`<circle cx="${pg.left + 26}" cy="${y}" r="${rh * 0.36}" fill="${TINTS[k]}" stroke="${PALETTE[k]}" stroke-width="1"/>` + emoji(e, pg.left + 26, y, rh * 0.42) + `<circle cx="${pg.left + 26 + rh * 0.44}" cy="${y}" r="3" fill="${PALETTE[k]}"/>`); });
  right.forEach((e, k) => { const y = pg.y + k * rh + rh / 2; pg.add(`<circle cx="${pg.right - 26}" cy="${y}" r="${rh * 0.36}" fill="#fff" stroke="#b9b3d6" stroke-width="1"/>` + emoji(e, pg.right - 26, y, rh * 0.42) + `<circle cx="${pg.right - 26 - rh * 0.44}" cy="${y}" r="3" fill="#9a93b8"/>`); });
}

function makeTinyHands(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const lk = edLook(o.look);
  const TITLES = { trace: ['Follow the path', 'Help each friend get home! Follow the dots with your finger, then a chunky crayon.'], dots: ['Dot and dab', 'Put a sticker, a dab of paint or a fingerprint in every circle. Then colour!'], colour: ['Colour the busy picture', 'Lots of friends to colour! Big scribbles are perfect.'], snip: ['Snip snip!', 'With a grown-up, snip along the lines with child-safe scissors. Or tear them!'], match: ['Find the same', 'Draw a line to join the ones that are the same. Say their names!'] };
  const pages = [seriesCover(paper, 'PRINTPALS PLUS EDITION', name ? `${possessive(name)} Tiny Hands Month` : 'Tiny Hands Month', 'Big fun for ages 2 and 3', ['🖍️', '✂️', '🟡', lk.corner, '🧸', '⭐'], lk.ring, lk.tint, 'book', ['20 playful days', 'Follow the path', 'Dot and dab', 'First snipping', 'Find the same', 'Busy colouring'])];
  pages.push(monthPlanPage(paper, lk, 'Our tiny hands month plan', 'Five fun minutes a day is plenty! Stop while it is still fun, and colour a star together.', Array.from({ length: 20 }, (_, i) => TITLES[TH_TYPES[i % 5]][0].split(' ').slice(0, 2).join(' ')), 'A little treat'));
  for (let i = 0; i < 20; i++) {
    const w = Math.floor(i / 5) + 1, d = (i % 5) + 1, type = TH_TYPES[i % 5], [title, sub] = TITLES[type];
    const pg = new Page(paper, title, { subtitle: sub });
    dayStrip(pg, lk, w, d);
    if (type === 'trace') tinyTracePage(pg, lk, i);
    else if (type === 'dots') tinyDotsPage(pg, lk, i);
    else if (type === 'snip') tinySnipPage(pg, lk, i);
    else if (type === 'match') tinyMatchPage(pg, lk, i, rand);
    else {
      const sc = CM_ORDER[i % CM_ORDER.length], sn = cmScene(sc, rand), boxH = pg.room - 22, s2 = Math.min((pg.width - 6) / 200, (boxH - 6) / 240);
      pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${boxH}" rx="8" fill="#fff" stroke="#1f1b2e" stroke-width="1"/><g transform="translate(${pg.left + (pg.width - 200 * s2) / 2} ${pg.y + (boxH - 240 * s2) / 2}) scale(${s2.toFixed(4)})">${sn.svg}</g>`);
    }
    howDidIDo(pg, lk);
    pages.push(pg.svg());
  }
  pages.push(seriesCert(paper, 'TINY HANDS MONTH', 'Little Superstar', name, 'for 20 days of tracing, dabbing, snipping and colouring!', 'Next: My Handwriting Book 1, Pencil power!', lk.ring));
  return pages;
}

Object.assign(MAKERS, { timesclub: makeTimesClub, timemonth: makeTimeMonth, phonicsmonth: makePhonicsMonth, tinyhands: makeTinyHands });
