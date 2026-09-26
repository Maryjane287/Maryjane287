// PrintPals batch 7: calendar, number of the day, greater than and less than, phonics sounds,
// opposites, life cycles, family tree and a road trip pack.

// ================================================================ calendar
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_ART = ['penguin', 'teddy', 'butterfly', 'rainbow', 'sunflower', 'bee', 'icecream', 'boat', 'owl', 'snail', 'castle', 'rocket'];

function calendarPage(paper, year, m, o, specials) {
  const pg = new Page(paper, '', { bare: true, landscape: true });
  const name = nameOf(o.name, '');
  const title = `${MONTHS[m]} ${year}`;
  pg.add(`<g transform="translate(${pg.left} ${pg.m - 2}) scale(0.19)">${colouringArt(MONTH_ART[m])}</g>`);
  bubbleText(pg, title, pg.w / 2, pg.m + 18, pg.width - 110, 20);
  if (name) pg.add(`<text x="${pg.right}" y="${pg.m + 16}" text-anchor="end" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="${SOFT}">${esc(possessive(name))} calendar</text>`);
  const monFirst = o.start !== 'sun';
  const names = monFirst ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const top = pg.m + 42;
  const cw = pg.width / 7;
  names.forEach((d, i) => {
    pg.add(`<rect x="${pg.left + i * cw + 0.6}" y="${top}" width="${cw - 1.2}" height="8" rx="3" fill="${PALETTE[i]}"/>`);
    pg.add(`<text x="${pg.left + i * cw + cw / 2}" y="${top + 5.6}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.8" fill="#fff">${d}</text>`);
  });
  const first = new Date(year, m, 1).getDay();
  const offset = monFirst ? (first + 6) % 7 : first;
  const days = new Date(year, m + 1, 0).getDate();
  const rows = Math.ceil((offset + days) / 7);
  const ch = (pg.bottom - top - 12) / rows;
  for (let i = 0; i < rows * 7; i++) {
    const d = i - offset + 1;
    const x = pg.left + (i % 7) * cw, y = top + 10 + Math.floor(i / 7) * ch;
    const ok = d >= 1 && d <= days;
    pg.add(`<rect x="${x + 0.6}" y="${y + 0.6}" width="${cw - 1.2}" height="${ch - 1.2}" rx="3" fill="${ok ? '#fff' : '#f7f5fc'}" stroke="#c9c3e3" stroke-width="0.4"/>`);
    if (!ok) continue;
    pg.add(`<text x="${x + 3}" y="${y + 6.5}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="${INK}">${d}</text>`);
    const sp = specials.filter((s) => s.m === m && s.d === d);
    sp.forEach((s, k) => {
      pg.add(`<path d="${starPath(x + cw - 5, y + 5, 3, 0.45)}" fill="#ffc93c"/>`);
      pg.add(`<text x="${x + cw / 2}" y="${y + ch - 4 - k * 4.5}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fitFont(s.text, 3.4, cw - 4, 0.52).toFixed(2)}" fill="#e0457b">${esc(s.text)}</text>`);
    });
  }
  pg.footer = () => {};
  return pg.svg();
}

function makeCalendar(o, paper) {
  const now = new Date();
  const year = Math.max(2000, Math.min(2100, parseInt(o.year, 10) || now.getFullYear()));
  // Special days: "12 March Mum's birthday" or "12/3 Mum's birthday"
  const specials = [];
  for (const line of String(o.specials || '').split('\n')) {
    const t = line.trim();
    let m = /^(\d{1,2})\s*[\/.-]\s*(\d{1,2})\s+(.+)$/.exec(t);
    if (m) { specials.push({ d: +m[1], m: +m[2] - 1, text: m[3].slice(0, 26) }); continue; }
    m = /^(\d{1,2})\s+([A-Za-z]+)\s+(.+)$/.exec(t);
    if (m) {
      const mi = MONTHS.findIndex((n) => n.toLowerCase().startsWith(m[2].toLowerCase().slice(0, 3)));
      if (mi >= 0) specials.push({ d: +m[1], m: mi, text: m[3].slice(0, 26) });
    }
  }
  if (o.month === 'all') return MONTHS.map((_, i) => calendarPage(paper, year, i, o, specials));
  const m = o.month === '' || o.month === undefined ? now.getMonth() : Math.max(0, Math.min(11, +o.month));
  return [calendarPage(paper, year, m, o, specials)];
}

// ================================================================ number of the day
function makeNumberDay(o, paper) {
  const rand = rng(+o.seed || 1);
  const max = o.range === '100' ? 100 : 20;
  let nums = [];
  const fixed = parseInt(o.number, 10);
  if (fixed >= 0 && fixed <= 100) nums = [fixed];
  else for (let i = 0; i < (o.week === true ? 5 : 1); i++) nums.push(1 + Math.floor(rand() * max));
  return nums.map((n) => {
    const pg = new Page(paper, 'Number of the day', { subtitle: 'Show the number in lots of different ways!' });
    const cols = 2, rows = 4, cw = pg.width / cols, ch = (pg.room - 30) / rows;
    // Big number badge
    pg.add(`<circle cx="${pg.w / 2}" cy="${pg.y + 11}" r="12" fill="#ffc93c"/><text x="${pg.w / 2}" y="${pg.y + 11 + (n > 99 ? 3.4 : 4.4)}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${n > 99 ? 10 : 13}" fill="${INK}">${n}</text>`);
    pg.y += 28;
    const box = (i, label) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch, c = i % PALETTE.length;
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="6" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
      pg.add(`<text x="${x + 6}" y="${y + 8}" font-family="${TITLE_FONT}" font-weight="800" font-size="4.6" fill="${INK}">${label}</text>`);
      return [x, y];
    };
    let [x, y] = box(0, 'Trace it');
    const s1 = 18;
    pg.add(drawText(String(n), x + 8, y + 13, s1, 'trace', true));
    pg.add(drawText(String(n), x + 12 + (textWidth(String(n)) / 100) * s1 + 8, y + 13, s1, 'trace'));
    [x, y] = box(1, 'In words');
    const word = n <= 20 ? NUMBER_WORDS[n] : numberWord(n);
    const ws = Math.min(16, (cw - 16) / (textWidth(word) / 100 + 0.1), ch - 22);
    pg.add(drawText(word, x + 8, y + 12 + (ch - 12 - ws * 1.4) / 2, ws, 'trace', true));
    [x, y] = box(2, n <= 20 ? 'Colour the ten frames' : 'Tens and ones');
    if (n <= 20) { tenFrame(pg, x + 8, y + 13, 7, 0, '#fff'); tenFrame(pg, x + 8 + 40, y + 13, 7, 0, '#fff'); }
    else pg.add(`<text x="${x + 10}" y="${y + ch - 12}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">____ tens and ____ ones</text>`);
    [x, y] = box(3, 'Tally marks');
    [x, y] = box(4, 'One less and one more');
    const bw = 18;
    [[n - 1, false], [n, true], [n + 1, false]].forEach(([v, show], k) => {
      const bx = x + 10 + k * (bw + 8);
      pg.add(`<rect x="${bx}" y="${y + 14}" width="${bw}" height="14" rx="3" fill="${show ? '#ffc93c' : '#fff'}" stroke="${INK}" stroke-width="0.5"/>`);
      if (show) pg.add(`<text x="${bx + bw / 2}" y="${y + 24}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="7" fill="${INK}">${v}</text>`);
    });
    [x, y] = box(5, 'Odd or even?');
    ['odd', 'even'].forEach((w, k) => pg.add(`<text x="${x + 22 + k * 32}" y="${y + ch / 2 + 4}" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="${INK}">${w}</text>`));
    [x, y] = box(6, 'Find it on the number line');
    const lo = Math.max(0, n - 5), nx = x + 8, nw = cw - 16, ny = y + ch / 2 + 2;
    pg.add(`<line x1="${nx}" x2="${nx + nw}" y1="${ny}" y2="${ny}" stroke="${INK}" stroke-width="0.5"/>`);
    for (let k = 0; k <= 10; k++) {
      const tx = nx + (k * nw) / 10, v = lo + k;
      pg.add(`<line x1="${tx}" x2="${tx}" y1="${ny - 1.6}" y2="${ny + 1.6}" stroke="${INK}" stroke-width="0.4"/>`);
      if (k % 2 === 0) pg.add(`<text x="${tx}" y="${ny + 6.5}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${INK}">${v}</text>`);
    }
    [x, y] = box(7, n <= 20 ? `Draw ${n} things` : 'Draw a picture of it');
    return pg.svg();
  });
}

function numberWord(n) {
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  if (n === 100) return 'one hundred';
  if (n < 20) return NUMBER_WORDS[n];
  return tens[Math.floor(n / 10)] + (n % 10 ? '-' + NUMBER_WORDS[n % 10] : '');
}

// ================================================================ greater than, less than
function croc(x, y, s, open) {
  // A friendly crocodile head whose mouth opens to the right (towards the bigger number).
  const k = s / 40;
  return `<g transform="translate(${x} ${y}) scale(${open === 'left' ? -k : k} ${k})"><path d="M-18 -4 Q-18 -16 -4 -16 L28 -26 Q34 -24 30 -18 L4 -6 L30 6 Q34 12 28 14 L-4 6 Q-18 6 -18 -4 Z" fill="#8bd17c" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`
    + `<path d="M6 -9 L10 -12 L13 -10 L17 -14 L20 -12 L24 -16 M6 1 L10 4 L13 2 L17 6 L20 4 L24 8" fill="none" stroke="${INK}" stroke-width="1.2"/><circle cx="-8" cy="-14" r="4" fill="#fff" stroke="${INK}" stroke-width="1.2"/><circle cx="-7" cy="-14" r="1.8" fill="${INK}"/></g>`;
}

function makeCompare(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'pictures';
  const max = kind === 'to100' ? 100 : kind === 'to20' ? 20 : 10;
  const items = [];
  for (let i = 0; i < (kind === 'pictures' ? 8 : 16); i++) {
    const a = Math.floor(rand() * (max + 1)), b = rand() < 0.12 ? a : Math.floor(rand() * (max + 1));
    items.push([a, b]);
  }
  const arts = ['apple', 'star', 'strawberry', 'ladybird', 'cupcake', 'balloon', 'orange', 'chick'].map(ART);
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Greater or less: answers' : 'Hungry crocodile', { subtitle: answers ? 'Answer key for grown-ups.' : 'The crocodile always eats the bigger number! Write > or < or = in each circle.', noName: answers });
    if (!answers) {
      pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="20" rx="6" fill="#effaf0"/>`);
      pg.add(croc(pg.left + 22, pg.y + 11, 16, 'right'));
      pg.add(`<text x="${pg.left + 42}" y="${pg.y + 8.5}" font-family="${FONT}" font-weight="800" font-size="4" fill="${INK}">&gt; means bigger than: 7 &gt; 3</text><text x="${pg.left + 42}" y="${pg.y + 15}" font-family="${FONT}" font-weight="800" font-size="4" fill="${INK}">&lt; means smaller than: 2 &lt; 5</text>`);
      pg.add(`<text x="${pg.right - 4}" y="${pg.y + 12}" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="4" fill="${INK}">= means the same: 4 = 4</text>`);
      pg.y += 26;
    }
    const cols = kind === 'pictures' ? 1 : 2, rows = Math.ceil(items.length / cols);
    const cw = pg.width / cols, ch = (pg.room - 2) / rows;
    items.forEach(([a, b], i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch, c = i % PALETTE.length;
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="6" fill="${TINTS[c]}"/>`);
      const mid = x + cw / 2, cy = y + ch / 2;
      const sign = a > b ? '>' : a < b ? '<' : '=';
      pg.add(`<circle cx="${mid}" cy="${cy}" r="${Math.min(7, ch * 0.3)}" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`);
      if (answers) pg.add(`<text x="${mid}" y="${cy + 3}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="9" fill="#e0457b">${esc(sign)}</text>`);
      if (kind === 'pictures') {
        [[a, x + 6, mid - 12], [b, mid + 12, x + cw - 6]].forEach(([n, l, r], side) => {
          const s = Math.min(9, (r - l) / 5.2);
          for (let k = 0; k < n; k++) pg.add(pic(arts[i % arts.length], l + s / 2 + (k % 5) * s * 1.05, cy - (n > 5 ? s * 0.55 : 0) + Math.floor(k / 5) * s * 1.1, s * 0.95));
          pg.add(`<text x="${(l + r) / 2}" y="${y + ch - 4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${SOFT}">${answers ? n : ''}</text>`);
        });
      } else {
        const fs = Math.min(12, ch * 0.45);
        pg.add(`<text x="${mid - 12}" y="${cy + fs * 0.35}" text-anchor="end" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${a}</text>`);
        pg.add(`<text x="${mid + 12}" y="${cy + fs * 0.35}" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${b}</text>`);
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ phonics sounds
const SOUNDS = {
  sh: [['ship', '🚢'], ['shell', '🐚'], ['sheep', '🐑'], ['shoe', '👟'], ['shark', '🦈'], ['shirt', '👕']],
  ch: [['chair', '🪑'], ['cheese', '🧀'], ['chick', ART('chick')], ['cherry', '🍒'], ['chips', '🍟'], ['chicken', '🐔']],
  th: [['thumb', '👍'], ['three', '3️⃣'], ['thread', '🧵'], ['thunder', '⛈️']],
  wh: [['whale', '🐋'], ['wheel', '🛞'], ['wheat', '🌾'], ['white', '⚪']],
  ck: [['duck', '🦆'], ['sock', '🧦'], ['clock', '⏰'], ['rock', '🪨'], ['truck', '🚚'], ['backpack', '🎒']],
  ng: [['ring', '💍'], ['king', '🤴'], ['wing', '🪽'], ['swing', '🛝']],
  cr: [['crab', '🦀'], ['crown', '👑'], ['crayon', '🖍️'], ['crocodile', '🐊']],
  st: [['star', ART('star')], ['stop', '🛑'], ['strawberry', ART('strawberry')], ['stamp', '📮']],
  sn: [['snail', '🐌'], ['snake', '🐍'], ['snowman', '⛄'], ['sneeze', '🤧']],
  tr: [['tree', '🌳'], ['train', '🚆'], ['truck', '🚚'], ['trumpet', '🎺']],
  fr: [['frog', '🐸'], ['fries', '🍟'], ['fruit', ART('orange')], ['fridge', '🧊']],
  bl: [['blocks', ART('blocks')], ['blue', '🔵'], ['blanket', '🛏️'], ['blueberry', ART('blueberry')]],
};
const SOUND_SETS = { starts: ['sh', 'ch', 'th', 'wh'], ends: ['ck', 'ng', 'sh'], blends: ['cr', 'st', 'sn', 'tr', 'fr', 'bl'] };

function makeSounds(o, paper) {
  const rand = rng(+o.seed || 1);
  const set = SOUND_SETS[o.set] || SOUND_SETS.starts;
  let items = [];
  set.forEach((snd) => items.push(...SOUNDS[snd].map(([w, src]) => ({ w, src, snd }))));
  items = shuffle(items, rand).slice(0, 9);
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Phonics sounds: answers' : `Which sound? ${set.join(' ')}`, { subtitle: answers ? 'Answer key for grown-ups.' : 'Say the word. Which sound do you hear? Ring it, then write it in the gap.', noName: answers });
    const cols = 3, rows = 3, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    items.forEach((it, i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch, c = i % PALETTE.length;
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="7" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
      pg.add(pic(it.src, x + cw / 2, y + ch * 0.3, Math.min(cw, ch) * 0.36));
      const at = it.w.indexOf(it.snd);
      const word = it.w.slice(0, at) + '__'.repeat(1) + it.w.slice(at + it.snd.length);
      const shown = answers ? it.w : word.replace('__', '___');
      pg.add(`<text x="${x + cw / 2}" y="${y + ch * 0.64}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(shown, 7.5, cw - 10, 0.55).toFixed(2)}" fill="${answers ? '#e0457b' : INK}" letter-spacing="0.6">${esc(shown)}</text>`);
      const opts = shuffle([it.snd, ...shuffle(set.filter((s) => s !== it.snd), rand).slice(0, 2)], rand);
      opts.forEach((s, k) => {
        const ox = x + cw / 2 + (k - 1) * 16;
        if (answers && s === it.snd) pg.add(`<circle cx="${ox}" cy="${y + ch * 0.83 - 1.4}" r="5.4" fill="none" stroke="#e0457b" stroke-width="0.8"/>`);
        pg.add(`<text x="${ox}" y="${y + ch * 0.83}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="5" fill="${INK}">${s}</text>`);
      });
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ opposites
const OPPOSITES = [[['big', '🐘'], ['small', '🐭']], [['hot', '🔥'], ['cold', '❄️']], [['happy', '😀'], ['sad', '😢']], [['day', ART('sun')], ['night', '🌙']],
  [['fast', '🐇'], ['slow', ART('turtle')]], [['full', '🥛'], ['empty', '🫙']], [['open', '📖'], ['closed', '📕']], [['wet', '☔'], ['dry', '🌵']],
  [['loud', '🥁'], ['quiet', '🤫']], [['tall', '🦒'], ['short', '🐶']], [['up', '🎈'], ['down', '🍂']], [['clean', '🛁'], ['dirty', ART('pig')]]];

function makeOpposites(o, paper) {
  const rand = rng(+o.seed || 1);
  const pairs = shuffle(OPPOSITES, rand).slice(0, 6);
  const kind = o.kind === 'draw' ? 'draw' : 'match';
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && (o.key === false || kind === 'draw')) break;
    const pg = new Page(paper, answers ? 'Opposites: answers' : kind === 'draw' ? 'Draw the opposite' : 'Match the opposites', { subtitle: answers ? 'Answer key for grown-ups.' : kind === 'draw' ? 'Look at each picture. Draw its opposite in the empty box.' : 'Draw a line from each word to its opposite.', noName: answers });
    const n = pairs.length, rowH = (pg.room - 4) / n, colW = 64;
    const lx = pg.left + 4, rx = pg.right - colW - 4;
    const cell = ([w, src], x, y, c) => {
      pg.add(`<rect x="${x}" y="${y + 3}" width="${colW}" height="${rowH - 6}" rx="7" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
      pg.add(pic(src, x + 17, y + rowH / 2, Math.min(24, rowH - 12)));
      pg.add(`<text x="${x + 34}" y="${y + rowH / 2 + 2.4}" font-family="${TITLE_FONT}" font-weight="800" font-size="7" fill="${INK}">${w}</text>`);
    };
    if (kind === 'draw') {
      pairs.forEach(([a, b], i) => {
        const y = pg.y + i * rowH;
        cell(a, lx, y, i % PALETTE.length);
        pg.add(`<text x="${pg.w / 2}" y="${y + rowH / 2 + 2}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.4" fill="${SOFT}">the opposite is</text>`);
        pg.add(`<rect x="${rx}" y="${y + 3}" width="${colW}" height="${rowH - 6}" rx="7" fill="#fff" stroke="#b9b3d6" stroke-width="0.6" stroke-dasharray="2.5 1.6"/>`);
        pg.add(`<text x="${rx + colW / 2}" y="${y + rowH - 6}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4" fill="${SOFT}">${b[0]}</text>`);
      });
    } else {
      const order = shuffle([...Array(n).keys()], rand);
      pairs.forEach(([a], i) => cell(a, lx, pg.y + i * rowH, i % PALETTE.length));
      order.forEach((pi, j) => cell(pairs[pi][1], rx, pg.y + j * rowH, (pi + 3) % PALETTE.length));
      for (let i = 0; i < n; i++) pg.add(`<circle cx="${lx + colW + 4}" cy="${pg.y + i * rowH + rowH / 2}" r="1.6" fill="${INK}"/><circle cx="${rx - 4}" cy="${pg.y + i * rowH + rowH / 2}" r="1.6" fill="${INK}"/>`);
      if (answers) pairs.forEach((_, i) => { const j = order.indexOf(i); pg.add(`<line x1="${lx + colW + 4}" y1="${pg.y + i * rowH + rowH / 2}" x2="${rx - 4}" y2="${pg.y + j * rowH + rowH / 2}" stroke="#e0457b" stroke-width="0.8"/>`); });
    }
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ life cycles
const STAGE_ART = {
  eggleaf: () => `<path d="M-36 20 Q-10 -34 40 -20 Q10 34 -36 20 Z" ${LW}/><path d="M-30 16 Q0 -2 34 -16" ${LT}/><circle cx="-4" cy="4" r="5" ${LW}/><circle cx="8" cy="0" r="5" ${LW}/><circle cx="4" cy="11" r="5" ${LW}/>`,
  chrysalis: () => `<path d="M0 -40 V-26" ${LN}/><path d="M-26 -30 H26" ${LN}/><path d="M0 -26 C16 -20 18 10 0 40 C-18 10 -16 -20 0 -26 Z" ${LW}/><path d="M-8 -6 Q0 -2 8 -6 M-10 8 Q0 12 10 8" ${LT}/>`,
  spawn: () => [[-14, -8], [0, -12], [14, -6], [-8, 6], [8, 8], [-20, 12], [20, 14], [0, 20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" ${LW}/><circle cx="${x}" cy="${y}" r="2.4" ${INKF}/>`).join(''),
  tadpole: () => `<path d="M-6 0 Q14 -14 34 -6 Q24 0 34 6 Q14 14 -6 0 Z" ${LW}/><ellipse cx="-14" cy="0" rx="16" ry="12" ${LW}/><circle cx="-20" cy="-3" r="2.4" ${INKF}/>`,
  froglet: () => `<ellipse cx="-4" cy="0" rx="22" ry="14" ${LW}/><path d="M16 2 Q34 6 40 -2" ${LN}/><circle cx="-14" cy="-12" r="6" ${LW}/><circle cx="2" cy="-12" r="6" ${LW}/><circle cx="-14" cy="-12" r="2.4" ${INKF}/><circle cx="2" cy="-12" r="2.4" ${INKF}/><path d="M-18 12 l-6 8 M8 12 l6 8" ${LN}/>`,
  seed: () => `<ellipse cx="0" cy="4" rx="16" ry="10" ${LW}/><path d="M-12 4 Q0 -2 12 4" ${LT}/><path d="M-40 22 H40" ${LN}/>`,
};
const CYCLES = {
  butterfly: { name: 'a butterfly', stages: [['egg', 'svg:eggleaf'], ['caterpillar', '🐛'], ['chrysalis', 'svg:chrysalis'], ['butterfly', '🦋']] },
  frog: { name: 'a frog', stages: [['frogspawn', 'svg:spawn'], ['tadpole', 'svg:tadpole'], ['froglet', 'svg:froglet'], ['frog', '🐸']] },
  plant: { name: 'a sunflower', stages: [['seed', 'svg:seed'], ['sprout', '🌱'], ['young plant', '🪴'], ['flower', ART('sunflower')]] },
  chicken: { name: 'a chicken', stages: [['egg', ART('egg')], ['hatching', '🐣'], ['chick', ART('chick')], ['hen', '🐔']] },
};

function stagePic(src, cx, cy, size) {
  if (src.startsWith('svg:')) return `<g transform="translate(${cx} ${cy}) scale(${(size / 90).toFixed(4)})">${STAGE_ART[src.slice(4)]()}</g>`;
  return pic(src, cx, cy, size);
}

function makeLifeCycle(o, paper) {
  const rand = rng(+o.seed || 1);
  const cy = CYCLES[o.cycle] || CYCLES.butterfly;
  const kind = o.kind || 'learn';
  const pg = new Page(paper, `The life cycle of ${cy.name}`, { subtitle: kind === 'learn' ? 'Follow the arrows round the circle. Say what happens at each step.' : kind === 'label' ? 'Write the name of each stage. Use the word bank to help.' : 'Cut out the pictures and stick them in the right order, starting at 1.' });
  const R = Math.min(pg.width, pg.room - (kind === 'cut' ? 60 : 30)) * 0.33;
  const cx = pg.w / 2, ccy = pg.y + R + 18;
  pg.add(`<circle cx="${cx}" cy="${ccy}" r="${R}" fill="none" stroke="#d9d4ec" stroke-width="1.2" stroke-dasharray="3 3"/>`);
  const spots = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  // Arrows between stages
  for (let i = 0; i < 4; i++) {
    const a1 = (-90 + i * 90 + 24) * Math.PI / 180, a2 = (-90 + i * 90 + 66) * Math.PI / 180;
    const x1 = cx + Math.cos(a1) * R, y1 = ccy + Math.sin(a1) * R, x2 = cx + Math.cos(a2) * R, y2 = ccy + Math.sin(a2) * R;
    pg.add(`<path d="M${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2}" fill="none" stroke="${PALETTE[i]}" stroke-width="1.6"/>`);
    const ang = a2 + Math.PI / 2;
    pg.add(`<path d="M${x2} ${y2} l${Math.cos(ang - 0.5) * -4} ${Math.sin(ang - 0.5) * -4} M${x2} ${y2} l${Math.cos(ang + 0.5) * -4} ${Math.sin(ang + 0.5) * -4}" stroke="${PALETTE[i]}" stroke-width="1.6" stroke-linecap="round"/>`);
  }
  const box = R * 0.8;
  cy.stages.forEach(([label, src], i) => {
    const [dx, dy] = spots[i];
    const x = cx + dx * R, y = ccy + dy * R;
    pg.add(`<rect x="${x - box / 2}" y="${y - box / 2}" width="${box}" height="${box}" rx="8" fill="#fff" stroke="${PALETTE[i]}" stroke-width="1"/>`);
    pg.add(`<circle cx="${x - box / 2 + 5}" cy="${y - box / 2 + 5}" r="4" fill="${PALETTE[i]}"/><text x="${x - box / 2 + 5}" y="${y - box / 2 + 6.5}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4" fill="#fff">${i + 1}</text>`);
    if (kind !== 'cut') pg.add(stagePic(src, x, y - 3, box * 0.62));
    if (kind === 'learn') pg.add(`<text x="${x}" y="${y + box / 2 - 3}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="4.6" fill="${INK}">${label}</text>`);
    else if (kind === 'label') pg.add(`<line x1="${x - box / 2 + 5}" x2="${x + box / 2 - 5}" y1="${y + box / 2 - 4}" y2="${y + box / 2 - 4}" stroke="#9a93b8" stroke-width="0.4"/>`);
  });
  const by = ccy + R + box / 2 + 10;
  if (kind === 'label') {
    pg.add(`<rect x="${pg.left}" y="${by}" width="${pg.width}" height="14" rx="5" fill="#fff6e0" stroke="#ffb938" stroke-width="0.5"/>`);
    pg.add(`<text x="${pg.w / 2}" y="${by + 9}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="${INK}">Word bank:   ${shuffle(cy.stages.map((s) => s[0]), rand).join('     ')}</text>`);
  } else if (kind === 'cut') {
    scissors(pg, by);
    const t = 32, gap = (pg.width - 4 * t) / 5;
    shuffle(cy.stages, rand).forEach(([label, src], i) => {
      const x = pg.left + gap + i * (t + gap), y = by + 6;
      cutTile(pg, x, y, t, stagePic(src, x + t / 2, y + t / 2 - 3, t * 0.62) + `<text x="${x + t / 2}" y="${y + t - 2.5}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.2" fill="${INK}">${label}</text>`, i);
    });
  }
  return [pg.svg()];
}

// ================================================================ family tree
function makeFamily(o, paper) {
  const name = nameOf(o.name, '');
  const kids = Math.max(0, Math.min(3, +o.siblings || 0));
  const pages = [];
  const pg = new Page(paper, name ? `${possessive(name)} Family Tree` : 'My Family Tree', { subtitle: 'Draw each person or stick a photo in the frame, then write their name.', noName: true });
  const cx = pg.w / 2;
  // The tree
  const top = pg.y + 4, bottom = pg.bottom - 4;
  pg.add(`<path d="M${cx - 16} ${bottom} Q${cx - 10} ${bottom - 60} ${cx - 8} ${top + 120} L${cx + 8} ${top + 120} Q${cx + 10} ${bottom - 60} ${cx + 16} ${bottom} Z" fill="#f3e3cf" stroke="${INK}" stroke-width="0.8"/>`);
  let crown = '';
  const r = pg.width * 0.46, ry = (bottom - top) * 0.38, ccy = top + ry + 4;
  for (let i = 0; i <= 14; i++) {
    const a = (i * 2 * Math.PI) / 14, b = ((i + 0.5) * 2 * Math.PI) / 14;
    const x = cx + Math.cos(a) * r, y = ccy + Math.sin(a) * ry;
    crown += i ? ` Q${cx + Math.cos(b - Math.PI / 14) * r * 1.12} ${ccy + Math.sin(b - Math.PI / 14) * ry * 1.12} ${x} ${y}` : `M${x} ${y}`;
  }
  pg.add(`<path d="${crown} Z" fill="#effaf0" stroke="${INK}" stroke-width="0.8"/>`);
  const frame = (x, y, w, label) => {
    pg.add(`<rect x="${x - w / 2}" y="${y}" width="${w}" height="${w * 1.05}" rx="${w * 0.2}" fill="#fff" stroke="${INK}" stroke-width="0.7"/>`);
    pg.add(`<rect x="${x - w / 2 - 2}" y="${y + w * 1.05 + 2}" width="${w + 4}" height="9" rx="3" fill="#fff" stroke="#c9c3e3" stroke-width="0.4"/>`);
    pg.add(`<text x="${x}" y="${y + w * 1.05 + 16}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.2" fill="${SOFT}">${label}</text>`);
  };
  const w = 30;
  // Grandparents
  const gy = top + 12;
  [['Grandma', -64], ['Grandpa', -36], ['Grandma', 36], ['Grandpa', 64]].forEach(([l, dx]) => frame(cx + dx, gy + 6, w * 0.76, l));
  // Parents
  const py = gy + 58;
  [['Mum', -1], ['Dad', 1]].forEach(([l, k]) => frame(cx + k * 34, py, w, l));
  pg.add(`<path d="${starPath(cx, py + 16, 5, 0.45)}" fill="#ffc93c"/>`);
  // Children
  const cyy = py + 62;
  const people = [['Me', 0], ...[...Array(kids)].map((_, i) => ['Brother or sister', i + 1])];
  const span = people.length;
  people.forEach(([l], i) => frame(cx + (i - (span - 1) / 2) * 44, cyy, i === 0 ? w * 1.1 : w, l));
  pages.push(pg.svg());
  if (o.about !== false) {
    const p2 = new Page(paper, name ? `All about ${possessive(name)} family` : 'All about my family', { subtitle: 'Talk about these with your family, then fill them in together.', noName: true });
    const qs = [['👨‍👩‍👧', 'There are ____ people in my family.'], ['🌍', 'My family comes from'], ['🗣️', 'Languages we speak'], ['🍲', 'Our favourite family meal'], ['🎉', 'A special day we celebrate'], ['❤️', 'My favourite thing to do together'], ['👵', 'Something I love about my grandparents'], ['📞', 'Family who live far away']];
    const rowH = (p2.room - 2) / qs.length;
    qs.forEach(([ic, q], i) => {
      const y = p2.y + i * rowH;
      p2.add(`<rect x="${p2.left}" y="${y + 1}" width="${p2.width}" height="${rowH - 3}" rx="6" fill="${TINTS[i % TINTS.length]}"/>`);
      p2.add(emoji(ic, p2.left + 9, y + rowH / 2 - 1, 9));
      p2.add(`<text x="${p2.left + 18}" y="${y + 9}" font-family="${TITLE_FONT}" font-weight="800" font-size="5" fill="${INK}">${esc(q)}</text>`);
      p2.add(`<line x1="${p2.left + 18}" x2="${p2.right - 6}" y1="${y + rowH - 7}" y2="${y + rowH - 7}" stroke="#9a93b8" stroke-width="0.4"/>`);
    });
    pages.push(p2.svg());
  }
  return pages;
}

// ================================================================ road trip pack
const TRIP_ITEMS = [['car', '🚗'], ['bus', '🚌'], ['lorry', '🚚'], ['bike', '🚲'], ['cow', '🐄'], ['sheep', '🐑'], ['horse', '🐎'], ['tractor', '🚜'],
  ['bridge', '🌉'], ['traffic lights', '🚦'], ['petrol station', '⛽'], ['plane', '✈️'], ['train', '🚆'], ['tree', '🌳'], ['dog', ART('dog')], ['motorbike', '🏍️'],
  ['police car', '🚓'], ['ambulance', '🚑'], ['bird', '🐦'], ['river', '🏞️']];

function makeTravel(o, paper) {
  const rand = rng(+o.seed || 1);
  const pages = [];
  if (o.bingo !== false) {
    const pg = new Page(paper, 'Road trip bingo', { subtitle: 'Cross off each thing when you see it. Shout bingo when you get a line!', noName: true });
    const h = (pg.room - 8) / 2;
    [0, 1].forEach((j) => {
      const items = shuffle(TRIP_ITEMS, rand).slice(0, 16);
      const n = 4, cell = Math.min((pg.width - 20) / n, (h - 14) / n), gx = pg.left + (pg.width - cell * n) / 2, gy = pg.y + j * (h + 8) + 10;
      pg.add(`<text x="${pg.left}" y="${gy - 3}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="${PALETTE[j * 3]}">Player ${j + 1}: ____________</text>`);
      items.forEach(([label, src], i) => {
        const x = gx + (i % n) * cell, y = gy + Math.floor(i / n) * cell;
        pg.add(`<rect x="${x + 0.6}" y="${y + 0.6}" width="${cell - 1.2}" height="${cell - 1.2}" rx="3" fill="${TINTS[(i + j) % TINTS.length]}" stroke="${INK}" stroke-width="0.4"/>`);
        pg.add(pic(src, x + cell / 2, y + cell * 0.42, cell * 0.5));
        pg.add(`<text x="${x + cell / 2}" y="${y + cell - 3}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fitFont(label, 3.4, cell - 4, 0.55).toFixed(2)}" fill="${INK}">${label}</text>`);
      });
    });
    pages.push(pg.svg());
  }
  if (o.xo !== false) {
    const pg = new Page(paper, 'Noughts and crosses', { subtitle: 'Take turns to draw an O or an X. Get three in a row to win!', noName: true });
    const cols = 2, rows = 3, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    for (let i = 0; i < 6; i++) {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch, s = Math.min(cw, ch) - 18;
      const gx = x + (cw - s) / 2, gy = y + 6, c = PALETTE[i % PALETTE.length];
      pg.add(`<path d="M${gx + s / 3} ${gy} V${gy + s} M${gx + (2 * s) / 3} ${gy} V${gy + s} M${gx} ${gy + s / 3} H${gx + s} M${gx} ${gy + (2 * s) / 3} H${gx + s}" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>`);
      pg.add(`<text x="${x + cw / 2}" y="${y + ch - 4}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="3.4" fill="${SOFT}">Winner: ________</text>`);
    }
    pages.push(pg.svg());
  }
  if (o.boxes !== false) {
    const pg = new Page(paper, 'Dots and boxes', { subtitle: 'Take turns to join two dots. Finish a box? Write your initial in it and go again!', noName: true });
    const n = 10, s = Math.min(pg.width, pg.room - 20) / (n - 1) * 0.92;
    const gx = pg.left + (pg.width - s * (n - 1)) / 2, gy = pg.y + 4;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) pg.add(`<circle cx="${gx + c * s}" cy="${gy + r * s}" r="1.1" fill="${INK}"/>`);
    const sy = gy + (n - 1) * s + 10;
    pg.add(`<text x="${pg.left}" y="${sy}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="${PALETTE[0]}">Player 1: ________   Score: ____</text><text x="${pg.right}" y="${sy}" text-anchor="end" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="${PALETTE[3]}">Player 2: ________   Score: ____</text>`);
    pages.push(pg.svg());
  }
  if (!pages.length) pages.push(new Page(paper, 'Road trip pack', { subtitle: 'Tick at least one page.', noName: true }).svg());
  return pages;
}

Object.assign(MAKERS, { calendar: makeCalendar, numberday: makeNumberDay, compare: makeCompare, sounds: makeSounds, opposites: makeOpposites, lifecycle: makeLifeCycle, family: makeFamily, travel: makeTravel });
