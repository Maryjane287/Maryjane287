// PrintPals batch 22 (Plus): My Maths Books series, Outdoor Adventure Passport, Family Fun Night kit, Little Chef Cookbook.

// A certificate page shared by the book series: big title, the child's name, and what comes next.
function seriesCert(paper, head, title, name, line, next, ring) {
  const pg = new Page(paper, '', { bare: true, tint: '#fffaf0' });
  const cx = pg.w / 2;
  pg.add(`<rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${pg.bottom - pg.m}" rx="10" fill="#fff" stroke="${ring}" stroke-width="2"/><rect x="${pg.left + 5}" y="${pg.m + 5}" width="${pg.width - 10}" height="${pg.bottom - pg.m - 10}" rx="7" fill="none" stroke="#ffb938" stroke-width="0.6" stroke-dasharray="2.4 1.6"/>`);
  pg.add(txt(cx, pg.m + 24, head, 6, { font: FONT, colour: SOFT }).replace('<text ', '<text letter-spacing="2" '));
  bubbleText(pg, title, cx, pg.m + 52, pg.width - 40, 22);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; pg.add(`<path d="${starPath(cx + Math.cos(a) * 46, pg.m + 96 + Math.sin(a) * 30, 3, 0.45)}" fill="${PALETTE[i % PALETTE.length]}"/>`); }
  pg.add(pic(ART('medal'), cx, pg.m + 96, 44));
  pg.add(txt(cx, pg.m + 142, 'is proudly awarded to', 6, { font: FONT, colour: SOFT }));
  if (name) bubbleText(pg, name, cx, pg.m + 168, pg.width - 40, 26); else pg.add(`<line x1="${cx - 60}" x2="${cx + 60}" y1="${pg.m + 168}" y2="${pg.m + 168}" stroke="#b9b3d6" stroke-width="0.5"/>`);
  wrap(line, 40).forEach((l, i) => pg.add(txt(cx, pg.m + 186 + i * 9, l, 7, { colour: INK })));
  if (next) pg.add(panel(pg.left + 24, pg.m + 206, pg.width - 48, 26, '#fff6e0', ring, 9) + txt(cx, pg.m + 222, next, fitFont(next, 6.4, pg.width - 60, 0.5), { colour: ring }));
  const ly = pg.bottom - 20;
  pg.add(txt(pg.left + 20, ly, 'Signed', 4.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${pg.left + 38}" x2="${cx - 8}" y1="${ly + 0.6}" y2="${ly + 0.6}" stroke="#b9b3d6" stroke-width="0.4"/>` + txt(cx + 8, ly, 'Date', 4.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${cx + 22}" x2="${pg.right - 20}" y1="${ly + 0.6}" y2="${ly + 0.6}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  pg.footer = () => {};
  return pg.svg();
}

// ================================================================ My Maths Books (Plus)
const MATHS_BOOKS = {
  1: { title: 'Counting to 10', ring: '#3a8fd8', tint: '#eef6ff', show: '1 to 10' },
  2: { title: 'Adding and taking away', ring: '#2e9d62', tint: '#f1f8e6', show: '+ and −' },
  3: { title: 'Numbers to 20 and doubles', ring: '#e08a00', tint: '#fff6e0', show: '11 to 20' },
  4: { title: 'Times tables fun', ring: '#8a3fd1', tint: '#f5edff', show: '× 2, 5, 10' },
};
const MATHS_PICS = ['🍎', '⭐', '🐞', '🎈', '🐟', '🌸', '🚗', '🍓', '🦆', '🧁'];

function mathsCover(paper, n, name) {
  const bk = MATHS_BOOKS[n], pg = new Page(paper, '', { bare: true, tint: bk.tint });
  pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="14" fill="#fff" stroke="${bk.ring}" stroke-width="1.6"/>`);
  pg.add(txt(pg.w / 2, pg.m + 22, `MY MATHS BOOK ${n} OF 4`, 6, { font: FONT, colour: SOFT }).replace('<text ', '<text letter-spacing="2" '));
  bubbleText(pg, name ? `${possessive(name)} maths` : 'My maths', pg.w / 2, pg.m + 48, pg.width - 40, 24);
  pg.add(txt(pg.w / 2, pg.m + 64, bk.title, 9, { colour: bk.ring }));
  const nums = { 1: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], 2: ['+', '−', '=', '3', '5', '8'], 3: ['11', '14', '17', '20', '2+2', '5+5'], 4: ['×2', '×5', '×10', '2', '5', '10'] }[n];
  nums.forEach((s, i) => { const cols = nums.length > 6 ? 5 : 3, x = pg.left + ((i % cols) + 0.5) * pg.width / cols, y = pg.m + 96 + Math.floor(i / cols) * 46, r = nums.length > 6 ? 16 : 20; pg.add(`<circle cx="${x}" cy="${y}" r="${r}" fill="${TINTS[i % TINTS.length]}" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="1.2"/>` + txt(x, y + r * 0.34, s, fitFont(s, r, r * 1.6, 0.6), { colour: PALETTE[i % PALETTE.length] })); });
  pg.add(txt(pg.left + 24, pg.bottom - 16, 'This book belongs to', 4.8, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 70}" x2="${pg.right - 24}" y1="${pg.bottom - 15.4}" y2="${pg.bottom - 15.4}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  pg.footer = () => {};
  return pg.svg();
}

function mathsNumberPage(paper, n, c, shift = 0) {
  const pg = new Page(paper, `The number ${n}`, { subtitle: `Say it, trace it, count it, show it and draw it. ${NUMBER_WORDS[n][0].toUpperCase() + NUMBER_WORDS[n].slice(1)}!` });
  const bh = 64;
  pg.add(panel(pg.left, pg.y, pg.width * 0.36, bh, TINTS[n % TINTS.length], c, 12));
  const ls = bh - 18, nw = (textWidth(String(n)) / 100) * ls;
  pg.add(drawText(String(n), pg.left + pg.width * 0.18 - nw / 2, pg.y + 7, ls, 'trace', true));
  const px = pg.left + pg.width * 0.36 + 6, pw = pg.width * 0.64 - 6, e = MATHS_PICS[(n - 1 + shift) % MATHS_PICS.length];
  pg.add(panel(px, pg.y, pw, bh, '#fff', '#e2ddf2', 12) + txt(px + 6, pg.y + 9, `Count the ${n}`, 5, { anchor: 'start', font: FONT, colour: SOFT }));
  const per = 5, es = 12;
  for (let k = 0; k < n; k++) pg.add(emoji(e, px + pw / 2 - (Math.min(n, per) - 1) * (es + 4) / 2 + (k % per) * (es + 4), pg.y + (n > 5 ? 26 : 34) + Math.floor(k / per) * (es + 6), es));
  pg.y += bh + 8;
  const ws = Math.min(22, pg.width * 0.7 / (textWidth(NUMBER_WORDS[n]) / 100 + 0.1));
  pg.add(txt(pg.left, pg.y + 7, 'Trace the word', 5.4, { anchor: 'start', colour: c }));
  pg.add(drawText(NUMBER_WORDS[n], pg.left + 44, pg.y - 3, ws, 'trace', true));
  pg.y += ws * 1.4 + 6;
  pg.add(txt(pg.left, pg.y + 7, `Colour ${n} in the ten frame`, 5.4, { anchor: 'start', colour: c }));
  drawTenFrame(pg, pg.left + pg.width - 110, pg.y - 4, 20, 0, c);
  pg.y += 50;
  const row = n > 9 ? `${n}  ${n}  ${n}  ${n}` : `${n}  ${n}  ${n}  ${n}  ${n}  ${n}`, size = Math.min(20, (pg.width - 6) / (textWidth(row) / 100 + 0.1));
  for (let r = 0; r < 2; r++) { pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${pg.y + size}" y2="${pg.y + size}" stroke="#c9c3e3" stroke-width="0.45"/>`); if (!r) pg.add(drawText(row, pg.left + 2, pg.y, size, 'trace', true)); pg.y += size * 1.5; }
  if (pg.room > 26) pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${pg.room - 4}" rx="10" fill="#fff" stroke="${c}" stroke-width="0.6" stroke-dasharray="3 2"/>` + txt(pg.left + 6, pg.y + 9, `Draw ${n} things of your own`, 5, { anchor: 'start', font: FONT, colour: SOFT }));
  return pg.svg();
}

function pictureSumsPage(paper, title, sub, rand, op, max, c) {
  const pg = new Page(paper, title, { subtitle: sub });
  const rh = pg.room / 6;
  for (let i = 0; i < 6; i++) {
    const y = pg.y + i * rh, e = MATHS_PICS[(i * 3) % MATHS_PICS.length];
    let a = 1 + Math.floor(rand() * (max - 1)), b = 1 + Math.floor(rand() * (max - a));
    if (op === '−') { a = 2 + Math.floor(rand() * (max - 1)); b = 1 + Math.floor(rand() * (a - 1)); }
    pg.add(panel(pg.left, y + 2, pg.width, rh - 4, TINTS[i % TINTS.length], PALETTE[i % PALETTE.length], 9));
    const es = Math.min(7.2, (rh - 10) / 2.1), gx = pg.left + 8;
    if (op === '+') {
      for (let k = 0; k < a; k++) pg.add(emoji(e, gx + (k % 5) * (es + 2) + es / 2, y + rh / 2 + (a > 5 ? (k < 5 ? -es * 0.55 : es * 0.55) : 0), es));
      const bx = gx + 5 * (es + 2) + 14;
      pg.add(txt(bx - 7, y + rh / 2 + 3, '+', 9, { colour: c }));
      for (let k = 0; k < b; k++) pg.add(emoji(e, bx + (k % 5) * (es + 2) + es / 2, y + rh / 2 + (b > 5 ? (k < 5 ? -es * 0.55 : es * 0.55) : 0), es));
    } else {
      for (let k = 0; k < a; k++) { const x = gx + (k % 10) * (es + 2) + es / 2, yy = y + rh / 2; pg.add(emoji(e, x, yy, es)); if (k >= a - b) pg.add(`<path d="M${x - es / 2} ${yy - es / 2} L${x + es / 2} ${yy + es / 2} M${x + es / 2} ${yy - es / 2} L${x - es / 2} ${yy + es / 2}" stroke="#e0453b" stroke-width="1.2" stroke-linecap="round"/>`); }
    }
    const q = `${a} ${op} ${b} =`;
    pg.add(txt(pg.right - 34, y + rh / 2 + 3, q, 7.4, { anchor: 'end', colour: INK }) + `<rect x="${pg.right - 30}" y="${y + rh / 2 - 8}" width="22" height="15" rx="4" fill="#fff" stroke="${c}" stroke-width="0.9"/>`);
  }
  return pg.svg();
}

function bondsPage(paper, target, c) {
  const pg = new Page(paper, `Ways to make ${target}`, { subtitle: `Number bonds! Fill in the missing part so both parts together make ${target}.` });
  const cols = 3, rows = 2, cw = pg.width / cols, ch = (pg.room - 4) / rows;
  const shown = [1, 3, 4, 2, 5, 0].map((k) => Math.min(target, k + (target > 6 ? 1 : 0)));
  shown.forEach((p, i) => {
    const cx = pg.left + (i % cols) * cw + cw / 2, top = pg.y + Math.floor(i / cols) * ch + 10, r = Math.min(cw, ch) * 0.16;
    pg.add(`<line x1="${cx}" y1="${top + r}" x2="${cx - cw * 0.26}" y2="${top + ch * 0.62}" stroke="${c}" stroke-width="1"/><line x1="${cx}" y1="${top + r}" x2="${cx + cw * 0.26}" y2="${top + ch * 0.62}" stroke="${c}" stroke-width="1"/>`);
    pg.add(`<circle cx="${cx}" cy="${top + r}" r="${r}" fill="${TINTS[i % TINTS.length]}" stroke="${c}" stroke-width="1.2"/>` + txt(cx, top + r * 1.35, target, r, { colour: c }));
    pg.add(`<circle cx="${cx - cw * 0.26}" cy="${top + ch * 0.62}" r="${r}" fill="#fff" stroke="${c}" stroke-width="1.2"/>` + txt(cx - cw * 0.26, top + ch * 0.62 + r * 0.35, p, r, { colour: INK }));
    pg.add(`<circle cx="${cx + cw * 0.26}" cy="${top + ch * 0.62}" r="${r}" fill="#fff" stroke="${c}" stroke-width="1.2"/>`);
  });
  return pg.svg();
}

function numberLinePage(paper, title, sub, lo, hi, rand, op, c) {
  const pg = new Page(paper, title, { subtitle: sub });
  const rh = pg.room / 5;
  for (let i = 0; i < 5; i++) {
    const y = pg.y + i * rh + rh * 0.52, x0 = pg.left + 6, w = pg.width - 70, n = hi - lo;
    pg.add(`<line x1="${x0}" x2="${x0 + w}" y1="${y}" y2="${y}" stroke="${INK}" stroke-width="0.7"/>`);
    for (let k = 0; k <= n; k++) { const x = x0 + (k * w) / n; pg.add(`<line x1="${x}" x2="${x}" y1="${y - 2.4}" y2="${y + 2.4}" stroke="${INK}" stroke-width="0.6"/>` + (n <= 10 || k % 2 === 0 ? txt(x, y + 8, lo + k, 4.6, { font: FONT, colour: SOFT }) : '')); }
    const a = op === '+' ? lo + 1 + Math.floor(rand() * (n - 2)) : lo + 2 + Math.floor(rand() * (n - 2)), b = 1 + Math.floor(rand() * (op === '+' ? hi - a : a - lo - 1));
    pg.add(`<circle cx="${x0 + ((a - lo) * w) / n}" cy="${y - 8}" r="2.4" fill="${c}"/>` + txt(pg.right - 30, y + 2, `${a} ${op} ${b} =`, 7, { anchor: 'end' }) + `<rect x="${pg.right - 26}" y="${y - 7}" width="20" height="13" rx="3" fill="#fff" stroke="${c}" stroke-width="0.9"/>`);
  }
  return pg.svg();
}

function teensPage(paper, rand, c) {
  const pg = new Page(paper, 'Numbers 11 to 20', { subtitle: 'Ten and some more! Count the dots in both ten frames and write the number.' });
  const nums = shuffle([11, 12, 13, 14, 15, 16, 17, 18, 19, 20], rand).slice(0, 6), cw = pg.width / 2, ch = pg.room / 3;
  nums.forEach((n, i) => { const x = pg.left + (i % 2) * cw + 6, y = pg.y + Math.floor(i / 2) * ch + 8, cell = Math.min(11, (cw - 50) / 5); drawTenFrame(pg, x, y, cell, 10, PALETTE[i % PALETTE.length]); drawTenFrame(pg, x, y + cell * 2.4, cell, n - 10, PALETTE[i % PALETTE.length]); pg.add(`<rect x="${x + cell * 5 + 10}" y="${y + cell * 1.4}" width="22" height="16" rx="4" fill="#fff" stroke="${c}" stroke-width="0.9"/>`); });
  return pg.svg();
}

function doublesPage(paper, c) {
  const pg = new Page(paper, 'Double trouble ladybirds', { subtitle: 'Each ladybird has the same number of spots on both wings. Draw the missing spots, then write the double!' });
  const cw = pg.width / 3, ch = pg.room / 2;
  [1, 2, 3, 4, 5, 6].forEach((n, i) => {
    const cx = pg.left + (i % 3) * cw + cw / 2, cy = pg.y + Math.floor(i / 3) * ch + ch * 0.42, r = Math.min(cw, ch) * 0.3;
    pg.add(`<circle cx="${cx}" cy="${cy - r * 0.9}" r="${r * 0.38}" fill="#fff" stroke="${INK}" stroke-width="0.9"/><ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.9}" fill="#fff" stroke="${INK}" stroke-width="1"/><line x1="${cx}" x2="${cx}" y1="${cy - r * 0.9}" y2="${cy + r * 0.9}" stroke="${INK}" stroke-width="0.9"/>`);
    for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 1.6 - Math.PI * 0.8; pg.add(`<circle cx="${cx - r * 0.5 + Math.sin(a) * r * 0.22}" cy="${cy + Math.cos(a) * r * 0.5}" r="${r * 0.1}" fill="${INK}"/>`); }
    pg.add(txt(cx, cy + r + 12, `${n} + ${n} =`, 7, { anchor: 'end' }) + `<rect x="${cx + 3}" y="${cy + r + 3}" width="18" height="13" rx="3" fill="#fff" stroke="${c}" stroke-width="0.9"/>`);
  });
  return pg.svg();
}

function skipPage(paper, steps, c) {
  const pg = new Page(paper, 'Hop along!', { subtitle: 'Count in steps and fill in the missing numbers on each path.' });
  const rh = pg.room / steps.length;
  steps.forEach((s, i) => {
    const y = pg.y + i * rh, n = 10, bw = (pg.width - 30) / n, col = PALETTE[i % PALETTE.length];
    pg.add(txt(pg.left, y + 10, `Count in ${s}s`, 6.4, { anchor: 'start', colour: col }) + emoji(['🐸', '🐰', '🦘'][i % 3], pg.right - 8, y + 8, 10));
    for (let k = 0; k < n; k++) { const x = pg.left + k * bw, v = s * (k + 1), show = k < 2 || k % 3 === 0; pg.add(`<rect x="${x + 1.5}" y="${y + 16}" width="${bw - 3}" height="${rh - 26}" rx="5" fill="${show ? TINTS[i % TINTS.length] : '#fff'}" stroke="${col}" stroke-width="0.8"/>` + (show ? txt(x + bw / 2, y + 16 + (rh - 26) / 2 + 2.6, v, 7.4, { colour: INK }) : '')); if (k < n - 1) pg.add(`<path d="M${x + bw * 0.6} ${y + 14} q${bw * 0.4} -7 ${bw * 0.8} 0" fill="none" stroke="${col}" stroke-width="0.6"/>`); }
  });
  return pg.svg();
}

function groupsPage(paper, table, rand, c) {
  const pg = new Page(paper, `The ${table} times table`, { subtitle: `Count the groups! How many altogether? Then say the ${table} times table out loud.` });
  const facts = shuffle([1, 2, 3, 4, 5, 6], rand).slice(0, 4), rh = (pg.room * 0.62) / 4;
  facts.forEach((g, i) => {
    const y = pg.y + i * rh, e = MATHS_PICS[(table + i) % MATHS_PICS.length], es = Math.min(6.4, (rh - 10) / (table > 5 ? 2.4 : 1.4));
    pg.add(panel(pg.left, y + 2, pg.width, rh - 4, TINTS[i % TINTS.length], PALETTE[i % PALETTE.length], 9));
    const gw = (pg.width - 70) / g;
    const per = Math.max(1, Math.min(5, Math.floor((gw - 8) / 6.2))), rowsN = Math.ceil(table / per), es2 = Math.min(6, (gw - 8) / per - 0.6, (rh - 14) / rowsN - 0.6);
    for (let k = 0; k < g; k++) { const gx = pg.left + 6 + k * gw; pg.add(`<rect x="${gx}" y="${y + 6}" width="${gw - 4}" height="${rh - 12}" rx="5" fill="#fff" stroke="#d9d4ec" stroke-width="0.5"/>`); for (let j = 0; j < table; j++) pg.add(emoji(e, gx + 4 + (j % per) * (es2 + 0.6) + es2 / 2, y + 9 + Math.floor(j / per) * (es2 + 0.6) + es2 / 2, es2)); }
    pg.add(txt(pg.right - 30, y + rh / 2 + 3, `${g} × ${table} =`, 7, { anchor: 'end' }) + `<rect x="${pg.right - 26}" y="${y + rh / 2 - 7}" width="20" height="13" rx="3" fill="#fff" stroke="${c}" stroke-width="0.9"/>`);
  });
  pg.y += rh * 4 + 6;
  pg.add(txt(pg.left, pg.y + 6, `Fill in the ${table} times table`, 6.4, { anchor: 'start', colour: c }));
  pg.y += 10;
  const cw = pg.width / 2, fh = (pg.room - 2) / 5;
  for (let k = 1; k <= 10; k++) { const x = pg.left + ((k - 1) >= 5 ? cw : 0), y = pg.y + ((k - 1) % 5) * fh; pg.add(txt(x + 4, y + fh * 0.7, `${k} × ${table} =`, 6, { anchor: 'start' }) + `<line x1="${x + 34}" x2="${x + cw - 10}" y1="${y + fh * 0.72}" y2="${y + fh * 0.72}" stroke="#c9c3e3" stroke-width="0.5"/>`); }
  return pg.svg();
}

function makeMathsBook(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const n = MATHS_BOOKS[+o.book] ? +o.book : 1, bk = MATHS_BOOKS[n], c = bk.ring;
  const pages = [mathsCover(paper, n, name)];
  if (n === 1) { const shift = Math.floor(rand() * 10); for (let k = 1; k <= 10; k++) pages.push(mathsNumberPage(paper, k, PALETTE[(k - 1) % PALETTE.length], shift)); }
  if (n === 2) {
    pages.push(pictureSumsPage(paper, 'Adding pictures', 'Count both groups, then count them all together. How many altogether?', rand, '+', 6, c));
    pages.push(pictureSumsPage(paper, 'More adding', 'Count on from the first group to find how many altogether.', rand, '+', 10, c));
    pages.push(pictureSumsPage(paper, 'Taking away', 'Some have gone away! The crossed out ones are gone. How many are left?', rand, '−', 8, c));
    pages.push(pictureSumsPage(paper, 'More taking away', 'Count what is left when the crossed out ones go away.', rand, '−', 10, c));
    pages.push(bondsPage(paper, 5, c), bondsPage(paper, 10, c));
    pages.push(numberLinePage(paper, 'Hop on the number line', 'Start at the dot and hop forwards to add.', 0, 10, rand, '+', c));
    pages.push(numberLinePage(paper, 'Hop back on the number line', 'Start at the dot and hop backwards to take away.', 0, 10, rand, '−', c));
  }
  if (n === 3) {
    pages.push(teensPage(paper, rand, c), teensPage(paper, rand, c));
    pages.push(doublesPage(paper, c));
    pages.push(numberLinePage(paper, 'Adding up to 20', 'Start at the dot and hop forwards.', 0, 20, rand, '+', c));
    pages.push(numberLinePage(paper, 'Taking away within 20', 'Start at the dot and hop backwards.', 0, 20, rand, '−', c));
    pages.push(skipPage(paper, [2, 5, 10], c));
  }
  if (n === 4) {
    pages.push(skipPage(paper, [2, 5, 10], c));
    [2, 5, 10].forEach((t) => pages.push(groupsPage(paper, t, rand, c)));
    pages.push(pictureSumsPage(paper, 'Warm up: adding', 'Quick adding before the times tables!', rand, '+', 10, c));
  }
  const next = n < 4 ? `Next: Maths Book ${n + 1}, ${MATHS_BOOKS[n + 1].title}` : 'You finished all four maths books. Amazing!';
  pages.push(seriesCert(paper, `MATHS BOOK ${n} COMPLETE`, 'Maths Superstar!', name, `for finishing ${bk.title.toLowerCase()}!`, next, c));
  return pages;
}

// ================================================================ Outdoor Adventure Passport (Plus)
const MISSIONS = [
  ['🍂', 'Find a leaf bigger than your hand'], ['🪨', 'Find 5 different stones'], ['🐌', 'Spot a snail or a slug'], ['🌳', 'Hug a tree and name it'], ['☁️', 'Find a cloud shaped like an animal'], ['🐦', 'Hear 3 different bird songs'],
  ['🌼', 'Find a yellow flower'], ['🕷️', 'Find a spider web'], ['🌈', 'Find something of every colour'], ['🦶', 'Walk barefoot on grass'], ['🪵', 'Look under a log (and put it back!)'], ['💧', 'Jump in a puddle'],
  ['🍃', 'Make a leaf rubbing'], ['🌰', 'Find a seed, nut or pine cone'], ['🐜', 'Watch ants for one minute'], ['🌙', 'Spot the moon in the daytime'], ['🦋', 'Spot a butterfly or moth'], ['🌬️', 'Fly something in the wind'],
  ['🖼️', 'Make a picture from nature'], ['👂', 'Sit still and count sounds for 1 minute'], ['🪺', 'Look for a nest (do not touch!)'], ['🌱', 'Plant a seed'], ['🧺', 'Have a picnic outside'], ['⭐', 'Look at the stars with a grown-up'],
];
const SEASONS = {
  spring: ['Spring spotter', '#2e9d62', ['🌷', 'Tulip'], ['🐣', 'Baby bird'], ['🐝', 'Bee'], ['🌸', 'Blossom'], ['🐑', 'Lamb'], ['🌧️', 'Spring shower'], ['🐛', 'Caterpillar'], ['🌱', 'New shoot'], ['🦋', 'Butterfly']],
  summer: ['Summer spotter', '#e08a00', ['🌻', 'Sunflower'], ['🐞', 'Ladybird'], ['🍓', 'Berry'], ['🐚', 'Shell'], ['☀️', 'Sunny day'], ['🦗', 'Grasshopper'], ['🍦', 'Ice cream van'], ['🌾', 'Long grass'], ['🌈', 'Rainbow']],
  autumn: ['Autumn spotter', '#c0662b', ['🍂', 'Red leaf'], ['🍁', 'Yellow leaf'], ['🌰', 'Conker or nut'], ['🍄', 'Mushroom'], ['🦔', 'Hedgehog'], ['🐿️', 'Squirrel'], ['🎃', 'Pumpkin'], ['🌫️', 'Misty morning'], ['🍎', 'Apple']],
  winter: ['Winter spotter', '#3a8fd8', ['❄️', 'Frost'], ['⛄', 'Snowman'], ['🌲', 'Evergreen tree'], ['🐦', 'Robin'], ['🧤', 'Lost glove'], ['🌬️', 'Your breath in the air'], ['🧊', 'Ice'], ['🌙', 'Early moon'], ['🦌', 'Animal tracks']],
};

function makeAdventure(o, paper) {
  const name = nameOf(o.name, '') || '';
  const m = new Date().getMonth(), now = m <= 1 || m === 11 ? 'winter' : m <= 4 ? 'spring' : m <= 7 ? 'summer' : 'autumn';
  const seasons = o.season === 'all' ? Object.keys(SEASONS) : [SEASONS[o.season] ? o.season : now];
  const ring = '#2e9d62', tint = '#f1f8e6';
  const pages = [];
  // Passport cover.
  {
    const pg = new Page(paper, '', { bare: true, tint: '#fff' });
    pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="14" fill="#1f5c45"/><rect x="${pg.left + 4}" y="${pg.m + 4}" width="${pg.width - 8}" height="${pg.bottom - pg.m - 11}" rx="10" fill="none" stroke="#ffd166" stroke-width="0.8"/>`);
    pg.add(txt(pg.w / 2, pg.m + 34, 'OUTDOOR ADVENTURE', 11, { colour: '#ffd166' }).replace('<text ', '<text letter-spacing="2" ') + txt(pg.w / 2, pg.m + 50, 'PASSPORT', 16, { colour: '#ffd166' }).replace('<text ', '<text letter-spacing="4" '));
    pg.add(`<circle cx="${pg.w / 2}" cy="${pg.m + 110}" r="36" fill="none" stroke="#ffd166" stroke-width="1.2"/>` + emoji('🧭', pg.w / 2, pg.m + 110, 40));
    pg.add(txt(pg.w / 2, pg.m + 170, 'Explorer', 7, { font: FONT, colour: '#cfe8dc' }) + (name ? txt(pg.w / 2, pg.m + 186, name, 14, { colour: '#fff' }) : `<line x1="${pg.w / 2 - 50}" x2="${pg.w / 2 + 50}" y1="${pg.m + 186}" y2="${pg.m + 186}" stroke="#cfe8dc" stroke-width="0.5"/>`));
    ['🌳', '🐞', '🍂', '⭐'].forEach((e, i) => pg.add(emoji(e, pg.left + 20 + i * (pg.width - 40) / 3, pg.bottom - 26, 12)));
    pg.footer = () => {};
    pages.push(pg.svg());
  }
  // Missions with stamp circles.
  for (let p = 0; p < 24; p += 12) {
    const pg = new Page(paper, p ? 'Explorer missions (more)' : 'Explorer missions', { subtitle: 'Do each mission, then a grown-up stamps, signs or draws a star in the circle!' });
    const cw = pg.width / 2, rh = pg.room / 6;
    MISSIONS.slice(p, p + 12).forEach(([e, t], i) => {
      const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * rh, c = PALETTE[(p + i) % PALETTE.length];
      pg.add(panel(x + 1.5, y + 1.5, cw - 3, rh - 3, TINTS[(p + i) % TINTS.length], c, 8) + emoji(e, x + 12, y + rh / 2, Math.min(12, rh * 0.4)));
      const ml = wrap(t, 18); textLines(pg, ml, x + 22, y + rh / 2 - (ml.length - 1) * 2.8 + 1.8, 4.8, { weight: 800, lh: 1.25 });
      pg.add(`<circle cx="${x + cw - 16}" cy="${y + rh / 2}" r="${Math.min(11, rh * 0.36)}" fill="#fff" stroke="${c}" stroke-width="0.9" stroke-dasharray="2 1.4"/>`);
    });
    pages.push(pg.svg());
  }
  seasons.forEach((sk) => {
    const [title, c, ...items] = SEASONS[sk];
    const pg = new Page(paper, title, { subtitle: 'Go outside and look carefully. Tick each thing when you spot it!' });
    const cw = pg.width / 3, ch = pg.room / 3;
    items.forEach(([e, t], i) => { const x = pg.left + (i % 3) * cw, y = pg.y + Math.floor(i / 3) * ch; pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, '#fff', c, 10) + emoji(e, x + cw / 2, y + ch * 0.42, ch * 0.36) + txt(x + cw / 2, y + ch - 12, t, fitFont(t, 6, cw - 12, 0.5), { colour: c }) + `<rect x="${x + cw - 16}" y="${y + 8}" width="9" height="9" rx="2" fill="#fff" stroke="${c}" stroke-width="0.8"/>`); });
    pages.push(pg.svg());
  });
  // Bug hunt log.
  {
    const pg = new Page(paper, 'Bug hunt log', { subtitle: 'Look under leaves and stones (and put them back gently). Draw each minibeast you find.' });
    const cw = pg.width / 2, ch = pg.room / 3;
    for (let i = 0; i < 6; i++) { const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * ch, c = PALETTE[i % PALETTE.length]; pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, '#fff', c, 10)); [['Name', 10], ['Where I found it', ch - 22], ['Legs', ch - 12]].forEach(([l, yy]) => pg.add(txt(x + 8, y + yy, l, 4.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${x + 10 + l.length * 2.4}" x2="${x + cw - 10}" y1="${y + yy + 0.6}" y2="${y + yy + 0.6}" stroke="#d9d4ec" stroke-width="0.45"/>`)); }
    pages.push(pg.svg());
  }
  // Nature bingo.
  {
    const pg = new Page(paper, 'Nature bingo', { subtitle: 'Cross off each thing you find. Get a line to win, or find them all for a full house!' });
    const pics = ['🌳', '🍃', '🐦', '🌼', '🪨', '🐌', '☁️', '🍄', '🐝', '🌰', '🦋', '🪶', '🐜', '💧', '🌿', '🕸️'], n = 4, s = Math.min(pg.width, pg.room - 4) / n, x0 = pg.w / 2 - (s * n) / 2;
    pics.forEach((e, i) => { const x = x0 + (i % n) * s, y = pg.y + Math.floor(i / n) * s; pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${s - 3}" height="${s - 3}" rx="8" fill="${TINTS[i % TINTS.length]}" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="0.9"/>` + emoji(e, x + s / 2, y + s / 2, s * 0.5)); });
    pages.push(pg.svg());
  }
  // Cloud watching and leaf rubbing.
  {
    const pg = new Page(paper, 'Sky and leaf lab', { subtitle: 'Lie back and watch the clouds, then make a leaf rubbing with a crayon on its side.' });
    const bh = (pg.room - 8) / 2;
    [['What shapes can you see in the clouds? Draw them!', '#3a8fd8'], ['Put a leaf under this box and rub over it with a crayon', '#2e9d62']].forEach(([t, c], i) => pg.add(`<rect x="${pg.left}" y="${pg.y + i * (bh + 8)}" width="${pg.width}" height="${bh}" rx="12" fill="#fff" stroke="${c}" stroke-width="0.8" stroke-dasharray="3 2"/>` + txt(pg.left + 8, pg.y + i * (bh + 8) + 10, t, 5.4, { anchor: 'start', colour: c }) + emoji(i ? '🍃' : '☁️', pg.right - 12, pg.y + i * (bh + 8) + 12, 12)));
    pages.push(pg.svg());
  }
  pages.push(seriesCert(paper, 'OUTDOOR ADVENTURE PASSPORT', 'Nature Explorer', name, 'for completing outdoor missions and exploring the wild world!', 'Next: try every season\'s spotter sheet!', ring));
  return pages;
}

// ================================================================ Family Fun Night kit (Plus)
const CHARADES = ['A sleepy cat', 'Brushing your teeth', 'A dinosaur', 'Riding a bike', 'A robot', 'Making a pizza', 'A monkey', 'Swimming', 'A superhero', 'Eating spaghetti', 'A penguin', 'Flying a kite', 'A ballerina', 'Building a snowman', 'An elephant', 'Playing football', 'A rocket', 'Washing a car', 'A frog', 'Blowing bubbles', 'A pirate', 'Baking a cake', 'A kangaroo', 'Painting a picture'];
const FAMILY_QUIZ = ['What is my favourite food?', 'What makes me laugh the most?', 'What am I scared of?', 'Where would I love to go on holiday?', 'What is my favourite animal?', 'What would I do with a magic wand?', 'What is my favourite colour?', 'Which song do I sing the most?', 'What job would I love?', 'What is my best memory?'];
const FAMILY_BUCKET = ['Watch the sunrise together', 'Have a breakfast picnic', 'Build the biggest pillow fort', 'Go on a bike ride', 'Camp in the living room', 'Bake a cake from scratch', 'Have a no-screens day', 'Plant something and watch it grow', 'Visit a new park', 'Make up a family song', 'Have a talent show', 'Write letters to each other', 'Try a food none of us have tried', 'Go stargazing', 'Have a water fight', 'Make a family time capsule', 'Do a jigsaw together', 'Volunteer or help a neighbour', 'Have a pyjama day', 'Take a family photo in a silly place'];

function makeFamilyNight(o, paper) {
  const fam = String(o.family || '').trim().slice(0, 20);
  const the = fam ? `The ${fam} family` : 'Our family';
  const ring = '#e0457b', tint = '#fff0f5';
  const pages = [];
  pages.push(seasonCover(paper, `${the} fun night`, 'Games, films, food and laughter', 'house', tint, ring, ['🎲', '🍿', '🎬', '❤️'], 'kit'));
  // A month of family nights.
  {
    const pg = new Page(paper, 'Our month of family nights', { subtitle: 'Pick one night a week. Write the day and what you will do, then colour the star afterwards.', noName: true });
    const nights = [['🎲', 'Game night', '#6c8cff'], ['🍿', 'Movie night', '#e0457b'], ['👩‍🍳', 'Cook together night', '#e08a00'], ['🔦', 'Adventure night', '#2e9d62']];
    const rh = pg.room / 4;
    nights.forEach(([e, t, c], i) => {
      const y = pg.y + i * rh;
      pg.add(panel(pg.left, y + 2, pg.width, rh - 5, '#fff', c, 12) + emoji(e, pg.left + 18, y + rh / 2, 18) + txt(pg.left + 34, y + 16, `Week ${i + 1}: ${t}`, 7.4, { anchor: 'start', colour: c }));
      [['Day', 0.34], ['Our plan', rh - 20]].forEach(([l, yy], k) => pg.add(txt(pg.left + 34, y + (k ? yy : 28), l, 4.8, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${pg.left + 34 + l.length * 2.6 + 4}" x2="${pg.right - 24}" y1="${y + (k ? yy : 28) + 0.6}" y2="${y + (k ? yy : 28) + 0.6}" stroke="#d9d4ec" stroke-width="0.45"/>`));
      pg.add(`<path d="${starPath(pg.right - 12, y + rh / 2, 7, 0.46)}" fill="#fff" stroke="${c}" stroke-width="0.9"/>`);
    });
    pages.push(pg.svg());
  }
  // Movie night tickets.
  pages.push(tagsPage(paper, 'Movie night tickets', 'Cut out a ticket for everyone. Tear off the stub at the door!', 8, 2, (pg, x, y, w, h, i) => {
    const c = PALETTE[i % PALETTE.length];
    pg.add(`<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="5" fill="${TINTS[i % TINTS.length]}"/><line x1="${x + w * 0.72}" x2="${x + w * 0.72}" y1="${y + 4}" y2="${y + h - 4}" stroke="${c}" stroke-width="0.6" stroke-dasharray="1.6 1.2"/>`);
    pg.add(emoji('🎬', x + 14, y + 14, 10) + txt(x + 24, y + 16, fam ? `${fam} Cinema` : 'Family Cinema', fitFont(fam ? `${fam} Cinema` : 'Family Cinema', 7, w * 0.72 - 30, 0.52), { anchor: 'start', colour: c }));
    [['Film', h * 0.52], ['Seat', h * 0.78]].forEach(([l, yy]) => pg.add(txt(x + 10, y + yy, l, 4.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${x + 22}" x2="${x + w * 0.72 - 6}" y1="${y + yy + 0.6}" y2="${y + yy + 0.6}" stroke="#c9c3e3" stroke-width="0.45"/>`));
    pg.add(txt(x + w * 0.86, y + h / 2 - 2, 'ADMIT', 4.4, { colour: c }) + txt(x + w * 0.86, y + h / 2 + 6, 'ONE', 6, { colour: c }) + emoji('🍿', x + w * 0.86, y + h - 12, 8));
  }));
  // Snack menu.
  {
    const pg = new Page(paper, '', { bare: true, tint: '#fffdf8' });
    pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="12" fill="#fff" stroke="${ring}" stroke-width="1.2"/>`);
    bubbleText(pg, fam ? `${fam} Snack Bar` : 'Family Snack Bar', pg.w / 2, pg.m + 34, pg.width - 40, 20);
    const items = [['🍿', 'Popcorn'], ['🥤', 'Drinks'], ['🍎', 'Fruit'], ['🧀', 'Cheesy snacks'], ['🍪', 'Something sweet'], ['⭐', 'Special of the night']];
    const rh = (pg.bottom - 30 - (pg.m + 50)) / items.length;
    items.forEach(([e, t], i) => { const y = pg.m + 50 + i * rh; pg.add(emoji(e, pg.left + 18, y + rh / 2, 14) + txt(pg.left + 34, y + rh / 2 + 2.4, t, 8, { anchor: 'start', colour: PALETTE[i % PALETTE.length] }) + `<line x1="${pg.left + 34 + t.length * 4 + 6}" x2="${pg.right - 40}" y1="${y + rh / 2 + 2}" y2="${y + rh / 2 + 2}" stroke="#d9d4ec" stroke-width="0.5" stroke-dasharray="1 2"/>` + txt(pg.right - 14, y + rh / 2 + 2.4, 'free!', 6, { anchor: 'end', font: FONT, colour: SOFT })); });
    pg.footer = () => {};
    pages.push(pg.svg());
  }
  // Charades cards.
  for (let p = 0; p < 24; p += 12) {
    pages.push(tagsPage(paper, p ? 'Charades cards (more)' : 'Charades cards', 'Take a card and act it out with no words. Everyone else guesses!', 12, 3, (pg, x, y, w, h, i) => {
      const t = CHARADES[p + i], c = PALETTE[(p + i) % PALETTE.length];
      pg.add(`<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="5" fill="${TINTS[(p + i) % TINTS.length]}"/>` + emoji('🎭', x + w / 2, y + h * 0.3, 10));
      textLines(pg, wrap(t, 14), x + w / 2, y + h * 0.62, 6, { anchor: 'middle', weight: 800, colour: c });
    }));
  }
  // Family quiz.
  {
    const pg = new Page(paper, 'How well do we know each other?', { subtitle: 'One person answers secretly, everyone else guesses. A point for every right guess!', noName: true });
    const rh = pg.room / FAMILY_QUIZ.length;
    FAMILY_QUIZ.forEach((q, i) => { const y = pg.y + i * rh, c = PALETTE[i % PALETTE.length]; pg.add(panel(pg.left, y + 1.5, pg.width, rh - 3, TINTS[i % TINTS.length], c, 7) + txt(pg.left + 8, y + rh / 2 + 2, `${i + 1}. ${q}`, 5.8, { anchor: 'start', colour: INK }) + `<line x1="${pg.left + pg.width * 0.6}" x2="${pg.right - 8}" y1="${y + rh / 2 + 2.6}" y2="${y + rh / 2 + 2.6}" stroke="#c9c3e3" stroke-width="0.45"/>`); });
    pages.push(pg.svg());
  }
  // Family bucket list.
  pages.push(checklistPage(paper, `${the} bucket list`, 'Twenty things to do together. Colour the star each time you do one!', FAMILY_BUCKET.slice(0, 10).map((t, i) => [['🌅', '🧺', '🏰', '🚲', '⛺', '🎂', '📵', '🌱', '🌳', '🎵'][i], t]), ''));
  pages.push(checklistPage(paper, 'Bucket list (more)', 'Keep going! Add your own ideas on the back.', FAMILY_BUCKET.slice(10).map((t, i) => [['🎤', '💌', '🍽️', '⭐', '💦', '📦', '🧩', '🤝', '🩳', '📸'][i], t]), ''));
  // Family awards.
  pages.push(tagsPage(paper, 'Family awards', 'At the end of family night, give out the awards! Write a name on each.', 8, 2, (pg, x, y, w, h, i) => {
    const aw = [['😂', 'Best Laugher'], ['👩‍🍳', 'Top Chef'], ['🎲', 'Game Champion'], ['🤗', 'Best Hugger'], ['💡', 'Big Ideas'], ['🎤', 'Star Singer'], ['🧹', 'Super Tidier'], ['❤️', 'Kindest Heart']][i];
    pg.add(`<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="5" fill="${TINTS[i % TINTS.length]}"/>` + emoji(aw[0], x + 18, y + h / 2, Math.min(18, h * 0.45)) + txt(x + 34, y + h * 0.42, aw[1], fitFont(aw[1], 8, w - 42, 0.52), { anchor: 'start', colour: PALETTE[i % PALETTE.length] }) + `<line x1="${x + 34}" x2="${x + w - 10}" y1="${y + h * 0.72}" y2="${y + h * 0.72}" stroke="#c9c3e3" stroke-width="0.45"/>`);
  }));
  return pages;
}

// ================================================================ Little Chef Cookbook (Plus)
const RECIPES = [
  ['Rainbow fruit kebabs', ['🍓', 'Strawberries'], [['🍊', 'Orange pieces'], ['🍌', 'Banana slices'], ['🥝', 'Kiwi'], ['🍇', 'Grapes'], ['🫐', 'Blueberries']], ['Wash your hands and the fruit', 'A grown-up helps cut the fruit', 'Push the fruit onto a stick in rainbow order', 'Eat your rainbow!'], 'sweet'],
  ['Yoghurt parfait cup', ['🥣', 'Yoghurt'], [['🍓', 'Berries'], ['🥣', 'Granola'], ['🍯', 'A little honey']], ['Spoon yoghurt into a clear cup', 'Add a layer of berries', 'Add a layer of granola', 'Repeat, then drizzle honey on top'], 'sweet'],
  ['Funny face crackers', ['🍘', 'Crackers'], [['🧀', 'Cheese spread'], ['🥒', 'Cucumber slices'], ['🥕', 'Carrot sticks'], ['🍅', 'Cherry tomatoes']], ['Spread cheese on a cracker', 'Add cucumber eyes', 'Make a tomato nose', 'Give it carrot hair and a smile!'], 'savoury'],
  ['Sandwich shapes', ['🍞', 'Bread'], [['🧈', 'Butter'], ['🧀', 'Cheese'], ['⭐', 'Cookie cutters']], ['Butter two slices of bread', 'Add your filling', 'Press a cookie cutter into the sandwich', 'Eat the shapes, and the edges too!'], 'savoury'],
  ['Banana boats', ['🍌', 'A banana'], [['🥜', 'Peanut or seed butter'], ['🍇', 'Raisins'], ['🫐', 'Blueberries']], ['Peel the banana', 'A grown-up cuts it in half the long way', 'Spread on the butter', 'Add raisin and blueberry passengers!'], 'sweet'],
  ['Mini pizza toasts', ['🍞', 'Toast or muffins'], [['🍅', 'Tomato sauce'], ['🧀', 'Grated cheese'], ['🫑', 'Pepper pieces']], ['Spread sauce on the toast', 'Sprinkle on cheese', 'Add your toppings', 'A grown-up grills it until bubbly'], 'savoury'],
  ['Fruity smoothie', ['🍌', 'A banana'], [['🍓', 'Frozen berries'], ['🥛', 'Milk or yoghurt'], ['🍯', 'A little honey']], ['Put everything in the blender', 'A grown-up holds the lid', 'Blend until smooth', 'Pour and enjoy with a straw!'], 'sweet'],
  ['Crunchy veggie dippers', ['🥕', 'Carrots'], [['🥒', 'Cucumber'], ['🫑', 'Pepper'], ['🥣', 'Hummus or yoghurt dip']], ['Wash the vegetables', 'A grown-up cuts them into sticks', 'Spoon dip into a little bowl', 'Dip, crunch and munch!'], 'savoury'],
];

function makeCookbook(o, paper) {
  const name = nameOf(o.name, '') || '';
  const pick = o.kind === 'sweet' || o.kind === 'savoury' ? RECIPES.filter((r) => r[4] === o.kind) : RECIPES;
  const ring = '#e08a00', tint = '#fff6e0';
  const pages = [];
  pages.push(seasonCover(paper, name ? `Chef ${possessive(name)} cookbook` : 'My little cookbook', 'Easy recipes for little hands', 'cake', tint, ring, ['👩‍🍳', '🍓', '🥕', '🧁'], 'cookbook'));
  // Kitchen rules.
  pages.push(checklistPage(paper, 'Little chef kitchen rules', 'Read these together before you start cooking. Colour a star for each one you remember!', [['🧼', 'Wash my hands first'], ['🧑‍🍳', 'Always cook with a grown-up'], ['🔪', 'Only grown-ups use sharp knives'], ['🔥', 'Stay away from the hot oven'], ['👕', 'Wear an apron and tie back hair'], ['🧽', 'Help tidy up at the end'], ['😋', 'Taste everything!']], name));
  pick.forEach(([title, main, extra, steps], ri) => {
    const c = PALETTE[ri % PALETTE.length];
    const pg = new Page(paper, title, { subtitle: 'Always cook with a grown-up. Colour the stars to rate it when you have tasted it!' });
    const lw = pg.width * 0.36;
    pg.add(panel(pg.left, pg.y, lw, pg.room * 0.62, TINTS[ri % TINTS.length], c, 10) + txt(pg.left + 6, pg.y + 10, 'You will need', 6, { anchor: 'start', colour: c }));
    [main, ...extra].forEach(([e, t], i) => pg.add(emoji(e, pg.left + 12, pg.y + 22 + i * 14, 10) + txt(pg.left + 22, pg.y + 24 + i * 14, t, fitFont(t, 5.2, lw - 26, 0.5), { anchor: 'start', font: FONT, weight: 700 })));
    const sx = pg.left + lw + 6, sw = pg.width - lw - 6, sh = (pg.room * 0.62) / steps.length;
    steps.forEach((s, i) => { const y = pg.y + i * sh; pg.add(panel(sx, y + 1.5, sw, sh - 3, '#fff', c, 8) + `<circle cx="${sx + 10}" cy="${y + sh / 2}" r="5.5" fill="${c}"/>` + txt(sx + 10, y + sh / 2 + 2.2, i + 1, 6, { colour: '#fff' })); textLines(pg, wrap(s, Math.floor((sw - 24) / 2.7)), sx + 20, y + sh / 2 - (wrap(s, Math.floor((sw - 24) / 2.7)).length - 1) * 3 + 1.8, 5.4, { weight: 800, lh: 1.25 }); });
    pg.y += pg.room * 0.62 + 8;
    const bh = pg.room - 30;
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${bh}" rx="10" fill="#fff" stroke="${c}" stroke-width="0.6" stroke-dasharray="3 2"/>` + txt(pg.left + 6, pg.y + 9, 'Draw what you made!', 5, { anchor: 'start', font: FONT, colour: SOFT }));
    pg.y += bh + 6;
    pg.add(txt(pg.left, pg.y + 12, 'I rate it', 7, { anchor: 'start', colour: c }));
    for (let k = 0; k < 5; k++) pg.add(`<path d="${starPath(pg.left + 44 + k * 16, pg.y + 9, 6.5, 0.46)}" fill="#fff" stroke="${c}" stroke-width="0.9"/>`);
    pages.push(pg.svg());
  });
  // My own recipe.
  {
    const pg = new Page(paper, 'My own recipe', { subtitle: 'Invent your very own recipe! What will you call it?' });
    pg.add(txt(pg.left, pg.y + 8, 'It is called', 6.4, { anchor: 'start', colour: ring }) + `<line x1="${pg.left + 40}" x2="${pg.right}" y1="${pg.y + 8.6}" y2="${pg.y + 8.6}" stroke="#c9c3e3" stroke-width="0.5"/>`);
    pg.y += 16;
    const lw = pg.width * 0.4, h = pg.room * 0.5;
    pg.add(panel(pg.left, pg.y, lw, h, tint, ring, 10) + txt(pg.left + 6, pg.y + 10, 'You will need', 6, { anchor: 'start', colour: ring }));
    for (let l = 1; l <= 6; l++) pg.add(`<line x1="${pg.left + 8}" x2="${pg.left + lw - 8}" y1="${pg.y + 12 + l * (h - 16) / 6.4}" y2="${pg.y + 12 + l * (h - 16) / 6.4}" stroke="#d9c38f" stroke-width="0.45"/>`);
    pg.add(panel(pg.left + lw + 6, pg.y, pg.width - lw - 6, h, '#fff', ring, 10) + txt(pg.left + lw + 12, pg.y + 10, 'What to do', 6, { anchor: 'start', colour: ring }));
    for (let l = 1; l <= 6; l++) pg.add(txt(pg.left + lw + 12, pg.y + 12 + l * (h - 16) / 6.4, `${l}.`, 5, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${pg.left + lw + 20}" x2="${pg.right - 8}" y1="${pg.y + 12 + l * (h - 16) / 6.4}" y2="${pg.y + 12 + l * (h - 16) / 6.4}" stroke="#d9d4ec" stroke-width="0.45"/>`);
    pg.y += h + 8;
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${pg.room - 4}" rx="10" fill="#fff" stroke="${ring}" stroke-width="0.6" stroke-dasharray="3 2"/>` + txt(pg.left + 6, pg.y + 9, 'Draw it!', 5, { anchor: 'start', font: FONT, colour: SOFT }));
    pages.push(pg.svg());
  }
  // Shopping list.
  pages.push(tagsPage(paper, 'Little chef shopping list', 'Write what you need, then tick it off at the shop.', 2, 2, (pg, x, y, w, h) => {
    pg.add(emoji('🛒', x + 14, y + 14, 12) + txt(x + 26, y + 16, 'Shopping list', 7, { anchor: 'start', colour: ring }));
    for (let l = 0; l < 14; l++) { const ly = y + 30 + l * ((h - 40) / 14); pg.add(`<rect x="${x + 8}" y="${ly - 4}" width="4.5" height="4.5" rx="1" fill="#fff" stroke="${ring}" stroke-width="0.5"/><line x1="${x + 16}" x2="${x + w - 8}" y1="${ly + 0.5}" y2="${ly + 0.5}" stroke="#d9d4ec" stroke-width="0.45"/>`); }
  }));
  pages.push(seriesCert(paper, 'COOKBOOK COMPLETE', 'Little Chef Award', name, 'for cooking, tasting and helping in the kitchen!', 'Next: invent your own recipe and teach it to your family!', ring));
  return pages;
}

Object.assign(MAKERS, { mathsbook: makeMathsBook, adventure: makeAdventure, familynight: makeFamilyNight, cookbook: makeCookbook });
