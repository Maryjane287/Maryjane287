// PrintPals worksheet makers. Each one returns a list of pages (SVG).

const ABC = {
  A: ['Apple', 'img/apple.webp'], B: ['Balloon', 'img/balloon.webp'], C: ['Cat', 'img/cat.webp'],
  D: ['Dog', 'img/dog.webp'], E: ['Egg', 'img/egg.webp'], F: ['Fish', 'img/fish.webp'],
  G: ['Gorilla', 'img/gorilla.webp'], H: ['Hat', 'img/hat.webp'], I: ['Ice cream', '🍦'],
  J: ['Juice', '🧃'], K: ['Kite', '🪁'], L: ['Lion', 'img/lion.webp'], M: ['Monkey', 'img/monkey.webp'],
  N: ['Nest', 'img/nest.webp'], O: ['Octopus', 'img/octopus.webp'], P: ['Pig', 'img/pig.webp'],
  Q: ['Queen', '👸'], R: ['Rainbow', 'img/rainbow.webp'], S: ['Sun', 'img/sun.webp'],
  T: ['Turtle', 'img/turtle.webp'], U: ['Umbrella', '☂️'], V: ['Violin', '🎻'], W: ['Whale', '🐳'],
  X: ['Fox', '🦊'], Y: ['Yo-yo', '🪀'], Z: ['Zebra', 'img/zebra.webp'],
};

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

function picture(src, x, y, size) {
  if (src.startsWith('img/')) {
    return `<image href="${src}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`;
  }
  return `<text x="${x + size / 2}" y="${y + size * 0.82}" font-size="${size * 0.85}" text-anchor="middle">${src}</text>`;
}

function applyCase(s, c) {
  if (c === 'upper') return s.toUpperCase();
  if (c === 'lower') return s.toLowerCase();
  if (c === 'title') return s.toLowerCase().replace(/(^|[\s'-])(\S)/g, (m, a, b) => a + b.toUpperCase());
  return s;
}

const SIZES = { large: 20, medium: 15, small: 11 };

// A painted friend in the corner cheers the child on.
const CHEER_FRIENDS = ['star', 'lion', 'turtle', 'monkey', 'octopus', 'bear', 'chick', 'cat', 'dog', 'pig', 'zebra', 'ladybird'];
const CHEER_WORDS = ['Great work!', 'You can do it!', 'Super job!', 'Keep going!', 'Brilliant!', 'Well done!'];
const CHEER_ROOM = 26;
function cheer(pg, k) {
  const friend = CHEER_FRIENDS[Math.abs(k) % CHEER_FRIENDS.length], words = CHEER_WORDS[Math.abs(k) % CHEER_WORDS.length];
  const y = pg.bottom + 2, size = 23;
  pg.add(`<image href="img/${friend}.webp" x="${pg.right - size}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`);
  const bw = words.length * 2.7 + 10, bx = pg.right - size - bw - 3, by = y + 4;
  pg.add(`<rect x="${bx}" y="${by}" width="${bw}" height="11" rx="5.5" fill="#fff6e0" stroke="#ffb938" stroke-width="0.5"/>`);
  pg.add(`<path d="M${bx + bw - 0.4} ${by + 4} L${bx + bw + 3.5} ${by + 6.5} L${bx + bw - 0.4} ${by + 8}" fill="#fff6e0" stroke="#ffb938" stroke-width="0.5" stroke-linejoin="round"/>`);
  pg.add(`<text x="${bx + bw / 2}" y="${by + 7.4}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="5" fill="${INK}">${words}</text>`);
}

// Pictures to count on each number page.
const COUNT_ART = [['apple', 'apples'], ['star', 'stars'], ['balloon', 'balloons'], ['fish', 'fish'], ['strawberry', 'strawberries'], ['cupcake', 'cupcakes'],
  ['ladybird', 'ladybirds'], ['banana', 'bananas'], ['sunflower', 'sunflowers'], ['egg', 'eggs'], ['cookie', 'cookies'], ['chick', 'chicks'],
  ['heart', 'hearts'], ['orange', 'oranges'], ['tulip', 'tulips'], ['turtle', 'turtles'], ['donut', 'doughnuts'], ['blueberry', 'blueberries'],
  ['daisy', 'daisies'], ['mushroom', 'mushrooms']];

// ---------------------------------------------------------------- names
function makeNames(o, paper) {
  const names = (o.names || '').split(/[,\n]/).map((s) => applyCase(s.trim(), o.case)).filter((s) => cleanText(s).trim());
  if (!names.length) names.push('Your Name');
  return names.map((name) => {
    const pg = new Page(paper, 'Trace my name', { subtitle: 'Start at the green dot. Follow the dots, then try on your own!' });
    pg.bottom -= CHEER_ROOM;
    const want = SIZES[o.size] || 20;
    const size = fitSize(name, want, pg.width - want * 0.6);
    const rh = rowHeight(size);
    let row = 0;
    while (pg.room >= rh) {
      pg.guides(pg.y, size);
      const style = row === 0 ? 'model' : 'trace';
      const blanks = o.practice !== false ? 2 : 0;
      const rowsLeft = Math.floor(pg.room / rh);
      if (row === 0 || rowsLeft > blanks) fillRow(pg, name, pg.y, size, style, o.dots !== false && row === 0, row === 0 ? 1 : 99);
      pg.y += rh;
      row++;
    }
    cheer(pg, name.length);
    return pg.svg();
  });
}

// ---------------------------------------------------------------- letters
function letterPage(L, paper, o) {
  const [word, pic] = ABC[L];
  const lower = L.toLowerCase();
  const pg = new Page(paper, `Letter ${L} ${lower}`, { subtitle: `${L} is for ${word}. Start at the green dot and follow the numbers.` });
  // Big letters with stroke order, and the picture
  const big = 36;
  const top = pg.y + 2;
  pg.guides(top, big, pg.left, pg.left + 118);
  pg.add(drawText(L, pg.left + 8, top, big, 'model', true));
  pg.add(drawText(lower, pg.left + 8 + (GLYPHS[L].w / 100) * big + 16, top, big, 'model', true));
  const ps = 44;
  pg.add(`<rect x="${pg.right - ps - 8}" y="${top - 4}" width="${ps + 8}" height="${ps + 12}" rx="6" fill="#fff8e6" stroke="#ffe3a3" stroke-width="0.5"/>`);
  pg.add(picture(pic, pg.right - ps - 4, top - 1, ps));
  pg.add(`<text x="${pg.right - ps / 2 - 4}" y="${top + ps + 5}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="${INK}">${esc(word)}</text>`);
  pg.y = top + big * 1.5 + 10;

  const size = SIZES[o.size] || 15;
  const rh = rowHeight(size);
  const rows = [
    [L, 'trace'], [lower, 'trace'], [`${L}${lower}`, 'trace'],
    [applyCase(word, o.wordCase || 'title'), 'trace'], ['', 'blank'], ['', 'blank'],
  ];
  for (const [text, style] of rows) {
    if (pg.room < rh) break;
    pg.guides(pg.y, size);
    if (text) fillRow(pg, text, pg.y, size, style, o.dots !== false);
    pg.y += rh;
  }
  return pg.svg();
}

function makeLetters(o, paper) {
  const which = o.letter === 'all' ? Object.keys(ABC) : [o.letter || 'A'];
  return which.map((L) => letterPage(L, paper, o));
}

// ---------------------------------------------------------------- numbers
function tenFrame(pg, x, y, cell, n, colour) {
  let s = '';
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 5; c++) {
      const i = r * 5 + c;
      s += `<rect x="${x + c * cell}" y="${y + r * cell}" width="${cell}" height="${cell}" fill="#fff" stroke="#b9b3d6" stroke-width="0.45"/>`;
      if (i < n) s += `<circle cx="${x + c * cell + cell / 2}" cy="${y + r * cell + cell / 2}" r="${cell * 0.33}" fill="${colour}"/>`;
    }
  }
  pg.add(s);
}

function numberPage(n, paper, o) {
  const word = NUMBER_WORDS[n];
  const pg = new Page(paper, `Number ${n}`, { subtitle: `This is ${word}. Count, trace and write it.` });
  const big = 40;
  const top = pg.y + 2;
  pg.guides(top, big, pg.left, pg.left + 70, false);
  pg.add(drawText(String(n), pg.left + 8, top, big, 'model', true));
  // Ten frames show how many
  const cell = 9.5;
  const fx = pg.left + 80;
  tenFrame(pg, fx, top, cell, Math.min(n, 10), '#ff6b6b');
  if (n > 10) tenFrame(pg, fx, top + cell * 2 + 4, cell, n - 10, '#6c8cff');
  pg.add(`<text x="${fx + cell * 5 + 6}" y="${top + cell * 1.25}" font-family="${TITLE_FONT}" font-weight="800" font-size="9" fill="${INK}">${n}</text>`);
  pg.add(`<text x="${fx + cell * 5 + 6}" y="${top + cell * 1.25 + 7}" font-family="${FONT}" font-weight="700" font-size="4.5" fill="${SOFT}">${word}</text>`);
  pg.y = top + Math.max(big, n > 10 ? cell * 4 + 4 : cell * 2) + 14;

  const size = SIZES[o.size] || 15;
  const rh = rowHeight(size);
  const rows = [[String(n), 'trace'], [String(n), 'trace'], [word, 'trace'], ['', 'blank']];
  for (const [text, style] of rows) {
    if (pg.room < rh) break;
    pg.guides(pg.y, size, pg.left, pg.right, /[gjpqy]/.test(text));
    if (text) fillRow(pg, text, pg.y, size, style, o.dots !== false);
    pg.y += rh;
  }
  // Count the painted pictures
  if (n > 0) {
    const [art, plural] = COUNT_ART[(n - 1) % COUNT_ART.length];
    const ps = Math.min(15, (pg.width - 4) / 10);
    const rows = Math.ceil(n / 10);
    if (pg.room > rows * ps + 12) {
      pg.add(`<text x="${pg.left}" y="${pg.y + 2}" font-family="${FONT}" font-weight="800" font-size="4.5" fill="${INK}">Count the ${n === 1 ? art : plural}:</text>`);
      for (let i = 0; i < n; i++) {
        const x = pg.left + (i % 10) * ps, y = pg.y + 5 + Math.floor(i / 10) * ps;
        pg.add(`<image href="img/${art}.webp" x="${x + ps * 0.06}" y="${y}" width="${ps * 0.88}" height="${ps * 0.88}" preserveAspectRatio="xMidYMid meet"/>`);
      }
      pg.y += rows * ps + 10;
    }
  }
  // Colour the right amount of stars
  if (pg.room > 24) {
    pg.add(`<text x="${pg.left}" y="${pg.y + 2}" font-family="${FONT}" font-weight="800" font-size="4.5" fill="${INK}">Colour ${n} ${n === 1 ? 'star' : 'stars'}:</text>`);
    const count = Math.min(20, Math.max(n + 3, 10));
    const st = Math.min(14, (pg.width - 4) / Math.min(count, 10));
    for (let i = 0; i < count; i++) {
      const cx = pg.left + (i % 10) * st + st / 2, cy = pg.y + 12 + Math.floor(i / 10) * st;
      pg.add(`<path transform="translate(${cx} ${cy}) scale(${st / 30})" d="M0 -12 L3.5 -4 L12 -3.7 L5.5 2 L7.4 10.5 L0 6 L-7.4 10.5 L-5.5 2 L-12 -3.7 L-3.5 -4 Z" fill="none" stroke="${INK}" stroke-width="1.1" stroke-linejoin="round"/>`);
    }
  }
  return pg.svg();
}

function makeNumbers(o, paper) {
  const from = Math.max(0, Math.min(20, +o.from || 0));
  const to = Math.max(from, Math.min(20, +o.to || from));
  const out = [];
  for (let n = from; n <= to; n++) out.push(numberPage(n, paper, o));
  return out;
}

// ---------------------------------------------------------------- maths
function makeProblems(o, rand) {
  const max = +o.within || 10;
  const count = +o.count || 20;
  const list = [];
  const seen = new Set();
  let tries = 0;
  while (list.length < count && tries++ < 5000) {
    const op = o.op === 'mix' ? (rand() < 0.5 ? '+' : '−') : o.op === 'sub' ? '−' : '+';
    let a, b, ans;
    const zeroOk = rand() < 0.06; // sums with 0 only now and then
    if (op === '+') {
      ans = 2 + Math.floor(rand() * (max - 1));
      a = 1 + Math.floor(rand() * (ans - 1));
      b = ans - a;
      if (zeroOk) { a = ans; b = 0; }
    } else {
      a = 2 + Math.floor(rand() * (max - 1));
      b = 1 + Math.floor(rand() * (a - 1));
      ans = a - b;
      if (zeroOk) { b = rand() < 0.5 ? 0 : a; ans = a - b; }
    }
    const key = `${a}${op}${b}`;
    if (seen.has(key) && tries < 4000) continue;
    seen.add(key);
    list.push({ a, b, op, ans });
  }
  return list;
}

function mathsPages(o, paper, problems, answers) {
  const title = { add: 'Adding', sub: 'Taking away', mix: 'Adding and taking away' }[o.op] || 'Maths';
  const pages = [];
  const perPage = o.layout === 'vertical' ? 20 : 20;
  for (let start = 0; start < problems.length; start += perPage) {
    const pg = new Page(paper, answers ? `${title}: answers` : title, { subtitle: `Numbers up to ${o.within}. ${answers ? 'Answer key for grown-ups.' : 'Take your time and check your work!'}`, noName: answers });
    if (!answers) pg.bottom -= CHEER_ROOM;
    const chunk = problems.slice(start, start + perPage);
    const pics = o.pictures && +o.within <= 10;
    if (o.layout === 'vertical') {
      const cols = 4;
      const rows = Math.ceil(chunk.length / cols);
      const cw = pg.width / cols;
      const rhh = Math.min(48, (pg.room - 4) / rows);
      const fs = Math.min(12, rhh * 0.26);
      chunk.forEach((p, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const x = pg.left + c * cw + cw * 0.62, y = pg.y + r * rhh + fs;
        pg.add(`<text x="${pg.left + c * cw + 3}" y="${y - fs * 0.6}" font-family="${FONT}" font-weight="700" font-size="3.2" fill="${SOFT}">${start + i + 1}</text>`);
        pg.add(`<text x="${x}" y="${y}" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${p.a}</text>`);
        pg.add(`<text x="${x - fs * 1.9}" y="${y + fs * 1.1}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${p.op}</text>`);
        pg.add(`<text x="${x}" y="${y + fs * 1.1}" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${p.b}</text>`);
        pg.add(`<line x1="${x - fs * 2.6}" x2="${x + 2}" y1="${y + fs * 1.45}" y2="${y + fs * 1.45}" stroke="${INK}" stroke-width="0.7"/>`);
        if (answers) pg.add(`<text x="${x}" y="${y + fs * 2.6}" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="#e0457b">${p.ans}</text>`);
      });
    } else {
      const cols = 2;
      const rows = Math.ceil(chunk.length / cols);
      const cw = pg.width / cols;
      const rhh = Math.min(pics ? 26 : 22, (pg.room - 2) / rows);
      const fs = Math.min(10, rhh * (pics ? 0.36 : 0.45));
      chunk.forEach((p, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const x = pg.left + c * cw + 4, y = pg.y + r * rhh + fs;
        const eq = `${p.a} ${p.op} ${p.b} =`;
        pg.add(`<text x="${x}" y="${y}" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${eq}</text>`);
        const ex = x + fs * (eq.length * 0.56) + 3;
        if (answers) pg.add(`<text x="${ex + 2}" y="${y}" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="#e0457b">${p.ans}</text>`);
        else pg.add(`<rect x="${ex}" y="${y - fs * 0.95}" width="${fs * 1.9}" height="${fs * 1.25}" rx="2" fill="none" stroke="#b9b3d6" stroke-width="0.5"/>`);
        if (pics) {
          const d = Math.min(3.2, fs * 0.34);
          let dx = x;
          const dots = (n, col) => { for (let k = 0; k < n; k++) { pg.add(`<circle cx="${dx + d}" cy="${y + fs * 0.75}" r="${d * 0.8}" fill="${col}"/>`); dx += d * 2.1; } };
          dots(p.a, '#ff6b6b');
          dx += d * 1.2;
          dots(p.b, p.op === '+' ? '#6c8cff' : '#d6d1e8');
        }
      });
    }
    if (!answers) cheer(pg, (+o.seed || 0) + start);
    pages.push(pg.svg());
  }
  return pages;
}

function makeMaths(o, paper) {
  const rand = rng(+o.seed || 1);
  const problems = makeProblems(o, rand);
  const pages = mathsPages(o, paper, problems, false);
  if (o.key !== false) pages.push(...mathsPages(o, paper, problems, true));
  return pages;
}

// ---------------------------------------------------------------- word search
function buildSearch(words, size, level, rand) {
  const dirs = [[1, 0], [0, 1]];
  if (level !== 'easy') dirs.push([1, 1], [1, -1]);
  if (level === 'hard') dirs.push([-1, 0], [0, -1], [-1, -1], [-1, 1]);
  for (let attempt = 0; attempt < 60; attempt++) {
    const grid = Array.from({ length: size }, () => Array(size).fill(''));
    const placed = [];
    let ok = true;
    const sorted = [...words].sort((a, b) => b.length - a.length);
    for (const w of sorted) {
      let done = false;
      for (let t = 0; t < 400 && !done; t++) {
        const [dx, dy] = dirs[Math.floor(rand() * dirs.length)];
        const x = Math.floor(rand() * size), y = Math.floor(rand() * size);
        const ex = x + dx * (w.length - 1), ey = y + dy * (w.length - 1);
        if (ex < 0 || ey < 0 || ex >= size || ey >= size) continue;
        let fits = true;
        for (let i = 0; i < w.length; i++) {
          const c = grid[y + dy * i][x + dx * i];
          if (c && c !== w[i]) { fits = false; break; }
        }
        if (!fits) continue;
        for (let i = 0; i < w.length; i++) grid[y + dy * i][x + dx * i] = w[i];
        placed.push({ w, x, y, dx, dy });
        done = true;
      }
      if (!done) { ok = false; break; }
    }
    if (!ok) continue;
    const letters = 'ABCDEFGHIJKLMNOPRSTUVWY';
    for (const row of grid) for (let i = 0; i < size; i++) if (!row[i]) row[i] = letters[Math.floor(rand() * letters.length)];
    return { grid, placed };
  }
  return null;
}

function makeWordSearch(o, paper) {
  const rand = rng(+o.seed || 1);
  const size = Math.max(6, Math.min(16, +o.size || 10));
  const words = [...new Set((o.words || '').split(/[,\n]/).map((w) => w.normalize('NFD').replace(/[^A-Za-z]/g, '').toUpperCase()).filter((w) => w.length >= 2 && w.length <= size))].slice(0, 20);
  if (!words.length) words.push('CAT', 'DOG', 'SUN', 'FISH', 'BIRD', 'TREE');
  const built = buildSearch(words, size, o.level || 'easy', rand);
  const title = (o.title || 'Word Search').slice(0, 40);
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? `${title}: answers` : title, { subtitle: answers ? 'Answer key for grown-ups.' : 'Find each word and draw a ring around it. Tick it off when you find it!', noName: answers });
    if (!built) {
      pg.add(`<text x="${pg.left}" y="${pg.y + 10}" font-family="${FONT}" font-size="5" fill="${INK}">Too many long words for this grid. Try a bigger grid or fewer words.</text>`);
      pages.push(pg.svg());
      break;
    }
    if (!answers) pg.bottom -= CHEER_ROOM;
    const listH = Math.ceil(words.length / 3) * 8 + 14;
    const gw = Math.min(pg.width, pg.room - listH);
    const cell = gw / size;
    const gx = pg.left + (pg.width - gw) / 2, gy = pg.y;
    pg.add(`<rect x="${gx - 2}" y="${gy - 2}" width="${gw + 4}" height="${gw + 4}" rx="4" fill="#fbfaff" stroke="#b9b3d6" stroke-width="0.6"/>`);
    if (answers) {
      for (const p of built.placed) {
        const x1 = gx + (p.x + 0.5) * cell, y1 = gy + (p.y + 0.5) * cell;
        const x2 = x1 + p.dx * (p.w.length - 1) * cell, y2 = y1 + p.dy * (p.w.length - 1) * cell;
        pg.add(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffc93c" stroke-opacity="0.55" stroke-width="${cell * 0.78}" stroke-linecap="round"/>`);
      }
    }
    built.grid.forEach((row, y) => row.forEach((c, x) => {
      pg.add(`<text x="${gx + (x + 0.5) * cell}" y="${gy + (y + 0.5) * cell + cell * 0.2}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${cell * 0.55}" fill="${INK}">${c}</text>`);
    }));
    // Word list with tick boxes
    let wy = gy + gw + 12;
    const cols = 3, cw = pg.width / cols;
    words.forEach((w, i) => {
      const x = pg.left + (i % cols) * cw + 4, y = wy + Math.floor(i / cols) * 8;
      pg.add(`<rect x="${x}" y="${y - 3.8}" width="4.4" height="4.4" rx="1" fill="none" stroke="${SOFT}" stroke-width="0.45"/>`);
      pg.add(`<text x="${x + 7}" y="${y}" font-family="${FONT}" font-weight="800" font-size="4.8" fill="${INK}">${w}</text>`);
    });
    if (!answers) cheer(pg, (+o.seed || 0) + words.length);
    pages.push(pg.svg());
  }
  return pages;
}

// ---------------------------------------------------------------- spelling
function makeSpelling(o, paper) {
  const words = (o.words || '').split(/[,\n]/).map((w) => applyCase(w.trim(), o.case)).filter((w) => cleanText(w).trim()).slice(0, 40);
  if (!words.length) words.push('cat', 'sun', 'play', 'friend');
  const pages = [];
  const want = { large: 17, medium: 12.5, small: 9.5 }[o.size] || 12.5;
  let pg = null;
  const title = (o.title || 'My spelling words').slice(0, 40);
  for (const w of words) {
    const size = fitSize(w, want, (pg ? pg.width : 180) / 2.4);
    const rh = rowHeight(size);
    const block = rh * 2;
    if (!pg || pg.room < block) {
      if (pg) { cheer(pg, pages.length + 3); pages.push(pg.svg()); }
      pg = new Page(paper, title, { subtitle: 'Look, trace, then write it on your own.' });
      pg.bottom -= CHEER_ROOM;
    }
    pg.guides(pg.y, size);
    const unit = (textWidth(w) / 100) * size;
    let x = pg.left + size * 0.35;
    pg.add(drawText(w, x, pg.y, size, 'model', o.dots !== false));
    x += unit + size * 1.1;
    while (x + unit <= pg.right - size * 0.2) {
      pg.add(drawText(w, x, pg.y, size, 'trace'));
      x += unit + size * 1.1;
    }
    pg.y += rh;
    pg.guides(pg.y, size); // an empty row to write it alone
    pg.y += rh;
  }
  cheer(pg, pages.length + 3);
  pages.push(pg.svg());
  return pages;
}

const MAKERS = { names: makeNames, letters: makeLetters, numbers: makeNumbers, maths: makeMaths, wordsearch: makeWordSearch, spelling: makeSpelling };
