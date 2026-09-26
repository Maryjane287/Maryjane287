// PrintPals batch 3: sight words, CVC phonics, number bonds, flashcards,
// chore charts, feelings charts, scavenger hunts and matching.

const ART = (name) => `img/${name}.webp`;
const P = (ch) => artFor(ch) || ch; // painted picture when we have one

// ================================================================ sight words
const SIGHT_LISTS = {
  'dolch-pre': 'a, and, away, big, blue, can, come, down, find, for, funny, go, help, here, I, in, is, it, jump, little, look, make, me, my, not, one, play, red, run, said, see, the, three, to, two, up, we, where, yellow, you',
  'dolch-primer': 'all, am, are, at, ate, be, black, brown, but, came, did, do, eat, four, get, good, have, he, into, like, must, new, no, now, on, our, out, please, pretty, ran, ride, saw, say, she, so, soon, that, there, they, this, too, under, want, was, well, went, what, white, who, will, with, yes',
  'dolch-first': 'after, again, an, any, as, ask, by, could, every, fly, from, give, going, had, has, her, him, his, how, just, know, let, live, may, of, old, once, open, over, put, round, some, stop, take, thank, them, then, think, walk, were, when',
  'fry-1': 'the, of, and, a, to, in, is, you, that, it, he, was, for, on, are, as, with, his, they, I, at, be, this, have, from, or, one, had, by, words, but, not, what, all, were, we, when, your, can, said, there, use, an, each, which, she, do, how, their, if',
  'fry-2': 'will, up, other, about, out, many, then, them, these, so, some, her, would, make, like, him, into, time, has, look, two, more, write, go, see, number, no, way, could, people, my, than, first, water, been, call, who, oil, its, now, find, long, down, day, did, get, come, made, may, part',
  'uk-y1': 'the, a, do, to, today, of, said, says, are, were, was, is, his, has, I, you, your, they, be, he, me, she, we, no, go, so, by, my, here, there, where, love, come, some, one, once, ask, friend, school, put, push, pull, full, house, our',
};

(function fillSightWords() {
  const form = typeof document !== 'undefined' && document.querySelector('#maker[data-tool=sight]');
  if (!form) return;
  const list = form.querySelector('[name=list]'), words = form.querySelector('[name=words]');
  const fill = () => { if (SIGHT_LISTS[list.value]) words.value = SIGHT_LISTS[list.value]; };
  list.addEventListener('change', fill);
  if (!words.value.trim()) fill();
})();

function makeSight(o, paper) {
  const rand = rng(+o.seed || 1);
  let words = [...new Set(listOf(o.words, 120).map((w) => cleanText(w).trim()).filter(Boolean))];
  if (!words.length) words = SIGHT_LISTS['dolch-pre'].split(', ');
  const how = o.count === 'all' ? words.length : +o.count || 8;
  if (o.order === 'mix') words = shuffle(words, rand);
  const pick = words.slice(0, how);
  const big = o.size !== 'medium';
  const per = big ? 4 : 5;
  const size = big ? 11 : 9.5;
  const pages = [];
  for (let i = 0; i < pick.length; i += per) {
    const pg = new Page(paper, 'Sight words', { subtitle: 'Read it, trace it, write it, then find it!' });
    const blockH = (pg.room - 2) / per;
    pick.slice(i, i + per).forEach((w, j) => {
      const c = (i + j) % PALETTE.length;
      const y = pg.y + j * blockH;
      const tileW = 38;
      pg.add(`<rect x="${pg.left}" y="${y}" width="${tileW}" height="${blockH - 5}" rx="6" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.7"/>`);
      pg.add(`<text x="${pg.left + tileW / 2}" y="${y + (blockH - 5) / 2 + 3}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(w, 13, tileW - 6, 0.5).toFixed(2)}" fill="${INK}">${esc(w)}</text>`);
      pg.add(`<text x="${pg.left + tileW / 2}" y="${y + blockH - 9}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.2" fill="${PALETTE[c]}">READ IT</text>`);
      const x0 = pg.left + tileW + 5;
      const rh = rowHeight(size) * 0.86;
      // Trace it
      pg.guides(y + 1, size, x0, pg.right, false);
      const unit = (textWidth(w) / 100) * size;
      let x = x0 + 3, n = 0;
      while (x + unit < pg.right - 2 && n < 4) { pg.add(drawText(w, x, y + 1, size, 'trace', n === 0 && o.dots !== false)); x += unit + size * 1.2; n++; }
      // Write it
      pg.guides(y + 1 + rh, size, x0, pg.right, false);
      pg.add(`<text x="${pg.right}" y="${y + rh - 0.5}" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="2.8" fill="${SOFT}">TRACE IT</text>`);
      pg.add(`<text x="${pg.right}" y="${y + rh * 2 - 0.5}" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="2.8" fill="${SOFT}">WRITE IT</text>`);
      // Find it
      const others = shuffle(words.filter((v) => v !== w), rand).slice(0, 4);
      const chips = shuffle([w, w, ...others], rand);
      const fy = y + rh * 2 + 3;
      pg.add(`<text x="${x0}" y="${fy + 4.4}" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${SOFT}">Find it:</text>`);
      const cw = (pg.right - x0 - 16) / chips.length;
      chips.forEach((v, k) => {
        pg.add(`<text x="${x0 + 16 + k * cw + cw / 2}" y="${fy + 4.6}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fitFont(v, 5, cw - 2)}" fill="${INK}">${esc(v)}</text>`);
      });
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ CVC words
const CVC = {
  a: [['cat', ART('cat')], ['hat', ART('hat')], ['bat', '🦇'], ['rat', '🐀'], ['van', '🚐'], ['map', '🗺️'], ['cap', '🧢'], ['jam', '🍯']],
  e: [['bed', '🛏️'], ['hen', '🐔'], ['pen', '🖊️'], ['net', '🥅'], ['web', '🕸️'], ['leg', '🦵'], ['ten', '🔟'], ['jet', '✈️']],
  i: [['pig', ART('pig')], ['pin', '📌'], ['lip', '👄'], ['bin', '🗑️'], ['six', '6️⃣'], ['wig', '💇'], ['fig', '🟣'], ['dig', '⛏️']],
  o: [['dog', ART('dog')], ['fox', '🦊'], ['box', '📦'], ['log', '🪵'], ['pot', '🍲'], ['mop', '🧹'], ['cot', '🛌'], ['hop', '🐇']],
  u: [['sun', ART('sun')], ['bus', '🚌'], ['bug', '🐛'], ['cup', '☕'], ['mug', '🍵'], ['nut', '🥜'], ['hut', '🛖'], ['tub', '🛁']],
};
// Pictures that are clear enough for little ones.
const CVC_CLEAR = new Set(['cat', 'hat', 'bat', 'rat', 'van', 'map', 'cap', 'bed', 'hen', 'pen', 'net', 'web', 'leg', 'ten', 'jet', 'pig', 'pin', 'lip', 'bin', 'six',
  'dog', 'fox', 'box', 'log', 'pot', 'mop', 'sun', 'bus', 'bug', 'cup', 'nut', 'hut', 'tub']);

function makeCVC(o, paper) {
  const rand = rng(+o.seed || 1);
  const vowels = o.vowel && CVC[o.vowel] ? [o.vowel] : Object.keys(CVC);
  let items = [];
  vowels.forEach((v) => items.push(...CVC[v].filter(([w]) => CVC_CLEAR.has(w))));
  items = shuffle(items, rand).slice(0, 8);
  const act = o.activity || 'sound';
  const sub = { sound: 'Touch each dot and say the sound, then blend them: c, a, t, cat! Write the word on the line.', middle: 'Which vowel is missing? Say the word slowly and write it in.', first: 'What sound does it start with? Write the first letter.', build: 'Cut out the letters at the bottom and stick them in the boxes.' }[act];
  const pg = new Page(paper, act === 'build' ? 'Build the words' : act === 'sound' ? 'Sound it out' : 'Finish the words', { subtitle: sub });
  const cols = 2, rows = 4;
  const tilesH = act === 'build' ? 36 : 0;
  const cw = pg.width / cols, ch = (pg.room - tilesH - 2) / rows;
  items.forEach(([w, src], i) => {
    const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
    const c = i % PALETTE.length;
    pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="6" fill="#fff" stroke="${PALETTE[c]}" stroke-width="0.7"/>`);
    pg.add(pic(src, x + 19, y + ch / 2, Math.min(28, ch - 14)));
    const box = Math.min(17, (cw - 42) / 3.25);
    const bx = x + 36, by = y + ch / 2 - box / 2 - 3;
    w.split('').forEach((L, k) => {
      const lx = bx + k * (box + 3);
      const hidden = (act === 'middle' && k === 1) || (act === 'first' && k === 0) || act === 'build';
      pg.add(`<rect x="${lx}" y="${by}" width="${box}" height="${box}" rx="3" fill="${hidden ? TINTS[c] : '#fff'}" stroke="${INK}" stroke-width="0.5"/>`);
      if (!hidden) {
        // Letters sit on a baseline inside the box; tails (g, p, y) sit a little higher so they fit.
        const size = box * 0.7;
        const base = by + box * (/[gjpqy]/.test(L) ? 0.6 : 0.8);
        pg.add(drawText(L, lx + box / 2 - (GLYPHS[L].w / 200) * size, base - size, size, 'model'));
      }
      pg.add(`<circle cx="${lx + box / 2}" cy="${by + box + 4}" r="1.6" fill="${PALETTE[c]}"/>`);
    });
    if (act === 'middle') pg.add(`<text x="${bx}" y="${y + ch - 5}" font-family="${FONT}" font-weight="800" font-size="3.8" fill="${SOFT}">a  e  i  o  u</text>`);
    else if (act === 'sound') pg.add(`<line x1="${bx}" x2="${bx + 3 * box + 6}" y1="${y + ch - 6}" y2="${y + ch - 6}" stroke="#9a93b8" stroke-width="0.4"/>`);
  });
  if (act === 'build') {
    const letters = shuffle(items.flatMap(([w]) => w.split('')), rand);
    const ty = pg.bottom - tilesH + 4;
    scissors(pg, ty - 2);
    const tw = pg.width / 12;
    letters.forEach((L, k) => {
      const tx = pg.left + (k % 12) * tw, yy = ty + 3 + Math.floor(k / 12) * (tw + 1);
      pg.add(`<rect x="${tx + 0.8}" y="${yy}" width="${tw - 1.6}" height="${tw - 1.6}" rx="2" fill="${TINTS[k % TINTS.length]}" stroke="#b9b3d6" stroke-width="0.35" stroke-dasharray="1.4 1"/>`);
      const size = tw * 0.42;
      pg.add(drawText(L, tx + tw / 2 - (GLYPHS[L].w / 200) * size, yy + tw * 0.2 - (/[gjpqy]/.test(L) ? size * 0.2 : 0), size, 'model'));
    });
  }
  const pages = [pg.svg()];
  if (o.key !== false && act !== 'sound') {
    const k = new Page(paper, 'Answers', { subtitle: 'For grown-ups.', noName: true });
    items.forEach(([w, src], i) => {
      const y = k.y + i * 12;
      k.add(pic(src, k.left + 6, y + 4, 9));
      k.add(`<text x="${k.left + 16}" y="${y + 6}" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="${INK}">${w}</text>`);
    });
    pages.push(k.svg());
  }
  return pages;
}

// ================================================================ number bonds
function bondPictures(pg, cx, cy, r, n, src) {
  if (!n) return;
  const cols = Math.ceil(Math.sqrt(n)), rows = Math.ceil(n / cols);
  const s = Math.min((r * 1.35) / cols, (r * 1.35) / rows);
  for (let i = 0; i < n; i++) {
    const x = cx - ((Math.min(cols, n) - 1) * s) / 2 + (i % cols) * s, y = cy - ((rows - 1) * s) / 2 + Math.floor(i / cols) * s;
    pg.add(pic(src, x, y, s * 0.95));
  }
}

function makeBonds(o, paper) {
  const rand = rng(+o.seed || 1);
  const to = { '5': [5], '10': [10], '20': [20], 'upto10': [3, 4, 5, 6, 7, 8, 9, 10] }[o.to] || [10];
  const pics = o.pictures !== false && Math.max(...to) <= 10;
  const items = [];
  for (let i = 0; i < 12; i++) {
    const whole = to[Math.floor(rand() * to.length)];
    const a = Math.floor(rand() * (whole + 1));
    const miss = o.missing === 'whole' ? 0 : o.missing === 'part' ? 1 + Math.floor(rand() * 2) : Math.floor(rand() * 3);
    items.push({ whole, a, b: whole - a, miss });
  }
  const arts = ['apple', 'strawberry', 'star', 'ladybird', 'cupcake', 'orange', 'chick', 'heart', 'cookie', 'fish', 'egg', 'balloon'].map(ART);
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const label = to.length > 1 ? 'up to 10' : `to ${to[0]}`;
    const pg = new Page(paper, answers ? 'Number bonds: answers' : `Number bonds ${label}`, { subtitle: answers ? 'Answer key for grown-ups.' : 'The two small circles make the big one. Fill in the missing number!', noName: answers });
    const cols = 3, rows = 4;
    const cw = pg.width / cols, ch = (pg.room - 2) / rows;
    items.forEach((it, i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      const c = i % PALETTE.length;
      const R = Math.min(11, ch * 0.2), r = R * 0.92;
      const top = [x + cw / 2, y + R + 3], left = [x + cw / 2 - R * 1.35, y + ch - r - 7], right = [x + cw / 2 + R * 1.35, y + ch - r - 7];
      pg.add(`<line x1="${top[0]}" y1="${top[1]}" x2="${left[0]}" y2="${left[1]}" stroke="${INK}" stroke-width="0.6"/><line x1="${top[0]}" y1="${top[1]}" x2="${right[0]}" y2="${right[1]}" stroke="${INK}" stroke-width="0.6"/>`);
      [[top, R, it.whole, 0], [left, r, it.a, 1], [right, r, it.b, 2]].forEach(([[cx, cy], rr, v, k]) => {
        const blank = it.miss === k;
        pg.add(`<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${k === 0 ? TINTS[c] : '#fff'}" stroke="${PALETTE[c]}" stroke-width="${k === 0 ? 1 : 0.7}"/>`);
        if (blank && !answers) return;
        if (pics && k > 0 && !answers && v > 0 && v <= 10) bondPictures(pg, cx, cy, rr, v, arts[i % arts.length]);
        else pg.add(`<text x="${cx}" y="${cy + rr * 0.34}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${rr * 0.95}" fill="${blank ? '#e0457b' : INK}">${v}</text>`);
      });
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ flashcards
const FLASH_SETS = {
  animals: () => SETS.animals, food: () => SETS.food, things: () => SETS.things,
  abc: () => Object.entries(ABC).map(([L, [w, src]]) => [`${L} ${L.toLowerCase()}`, src.startsWith('img/') ? src : P(src), w]),
  numbers: () => [...Array(21)].map((_, n) => [String(n), '', NUMBER_WORDS[n]]),
};

function flashItems(o) {
  if (o.set === 'words' || o.set === 'sight') {
    const list = o.set === 'sight' ? SIGHT_LISTS['dolch-pre'] : o.words;
    return listOf(list, 80).map((w) => {
      const hit = [...SETS.animals, ...SETS.food, ...SETS.things].find(([n]) => n.toLowerCase() === w.toLowerCase());
      return [w, hit ? hit[1] : ''];
    });
  }
  return (FLASH_SETS[o.set] || FLASH_SETS.animals)();
}

function flashFace(pg, x, y, w, h, item, side, c, set) {
  const [label, src, extra] = item;
  pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" rx="6" fill="${side === 'back' ? '#fff' : TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.8"/>`);
  pg.add(`<rect x="${x + 0.4}" y="${y + 0.4}" width="${w - 0.8}" height="${h - 0.8}" rx="7" fill="none" stroke="#d9d4ec" stroke-width="0.3" stroke-dasharray="2 1.5"/>`);
  const showPic = side !== 'back' && (src || set === 'numbers');
  const showWord = side !== 'front' || (!src && set !== 'numbers');
  if (set === 'numbers' && showPic) {
    const n = +label;
    const rows = Math.max(1, Math.ceil(n / 5));
    const d = Math.min((w - 14) / 5.3, (h * 0.46) / rows, 16);
    pg.add(`<text x="${x + w / 2}" y="${y + h * 0.4 - (rows > 1 ? h * 0.06 : 0)}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${h * (rows > 1 ? 0.26 : 0.32)}" fill="${PALETTE[c]}">${label}</text>`);
    const top = y + h * (rows > 1 ? 0.44 : 0.52) + d / 2;
    for (let k = 0; k < n; k++) pg.add(pic(ART('star'), x + w / 2 - (Math.min(n, 5) - 1) * d / 2 + (k % 5) * d, top + Math.floor(k / 5) * d, d * 0.92));
    if (side === 'both') pg.add(`<text x="${x + w / 2}" y="${y + h - 7}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${Math.min(6, h * 0.08)}" fill="${INK}">${extra}</text>`);
    return;
  }
  if (showPic) pg.add(pic(src, x + w / 2, y + h * (side === 'both' ? 0.42 : 0.5), Math.min(w, h) * (side === 'both' ? 0.55 : 0.68)));
  if (showWord) {
    const text = set === 'abc' && side !== 'both' ? label : set === 'abc' ? `${label}  ${extra}` : set === 'numbers' ? `${label}  ${extra}` : label;
    const alone = !showPic;
    const fs = fitFont(text, alone ? h * 0.26 : h * 0.11, w - 10, 0.55);
    pg.add(`<text x="${x + w / 2}" y="${alone ? y + h / 2 + fs * 0.35 : y + h - 8}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs.toFixed(2)}" fill="${INK}">${esc(text)}</text>`);
  }
}

function makeFlashcards(o, paper) {
  const items = flashItems(o);
  if (!items.length) items.push(['cat', ART('cat')]);
  const big = o.cardsize === 'big';
  const cols = 2, rows = big ? 2 : 4, per = cols * rows;
  const double = o.sides === 'double';
  const pages = [];
  for (let i = 0; i < items.length; i += per) {
    const chunk = items.slice(i, i + per);
    for (const side of double ? ['front', 'back'] : ['both']) {
      const pg = new Page(paper, '', { bare: true });
      const w = pg.width / cols, h = (pg.bottom - pg.m) / rows;
      chunk.forEach((it, k) => {
        let col = k % cols;
        if (side === 'back') col = cols - 1 - col; // mirrored so it lines up when printed on both sides
        flashFace(pg, pg.left + col * w, pg.m + Math.floor(k / cols) * h, w, h, it, side, (i + k) % PALETTE.length, o.set);
      });
      pages.push(pg.svg());
    }
  }
  return pages;
}

// ================================================================ chore charts
const CHORES = {
  little: ['🧸 Put my toys away', '🧺 Clothes in the basket', '🍽️ Help set the table', '🌱 Water the plants', '🐶 Feed the pet', '🛏️ Make my bed'],
  middle: ['🛏️ Make my bed', '🧹 Tidy my room', '🍽️ Set the table', '🧺 Sort the washing', '🐶 Feed the pet', '🌱 Water the plants', '📚 Pack my school bag'],
  big: ['🛏️ Make my bed', '🧹 Hoover my room', '🍽️ Clear the table', '🧺 Fold my clothes', '🗑️ Take out the bins', '🐶 Walk the dog', '🧽 Wipe the table', '🌱 Water the garden'],
};

(function fillChores() {
  const form = typeof document !== 'undefined' && document.querySelector('#maker[data-tool=chores]');
  if (!form) return;
  const age = form.querySelector('[name=age]'), box = form.querySelector('[name=chores]');
  const fill = () => { if (CHORES[age.value]) box.value = CHORES[age.value].join('\n'); };
  age.addEventListener('change', fill);
  if (!box.value.trim()) fill();
})();

function makeChores(o, paper) {
  const kids = listOf(o.names, 12).map((n) => nameOf(n, ''));
  if (!kids.length) kids.push('');
  const steps = parseSteps(String(o.chores || '').trim() || (CHORES[o.age] || CHORES.middle).join('\n'));
  const days = o.week === 'school' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const money = o.money === true;
  return kids.map((name, ki) => {
    const pg = new Page(paper, name ? `${possessive(name)} Jobs This Week` : 'My Jobs This Week', { subtitle: 'Do a job, then colour a star. Every job helps the family!', noName: true });
    const payW = money ? 18 : 0;
    const dayW = Math.min(13, (pg.width - 62 - payW) / days.length);
    const labelW = pg.width - dayW * days.length - payW;
    const footer = 34;
    const rowH = Math.min(22, (pg.room - 10 - footer) / steps.length);
    days.forEach((d, i) => pg.add(`<text x="${pg.left + labelW + i * dayW + dayW / 2}" y="${pg.y + 3}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${SOFT}">${d}</text>`));
    if (money) pg.add(`<text x="${pg.right - payW / 2}" y="${pg.y + 3}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${SOFT}">Earns</text>`);
    let y = pg.y + 7;
    steps.forEach((s, i) => {
      const c = (i + ki) % PALETTE.length;
      pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${rowH - 2.5}" rx="5" fill="${TINTS[c]}"/>`);
      pg.add(pic(P(s.pic), pg.left + 10, y + (rowH - 2.5) / 2, Math.min(16, rowH - 5)));
      pg.add(`<text x="${pg.left + 21}" y="${y + (rowH - 2.5) / 2 + 1.8}" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(s.label, 5.2, labelW - 24, 0.5).toFixed(2)}" fill="${INK}">${esc(s.label)}</text>`);
      days.forEach((d, k) => {
        const cx = pg.left + labelW + k * dayW + dayW / 2, cy = y + (rowH - 2.5) / 2;
        pg.add(`<path d="${starPath(cx, cy, Math.min(4.8, dayW * 0.38), 0.48)}" fill="#fff" stroke="${PALETTE[c]}" stroke-width="0.6" stroke-linejoin="round"/>`);
      });
      if (money) pg.add(`<rect x="${pg.right - payW + 2}" y="${y + 3}" width="${payW - 4}" height="${rowH - 8.5}" rx="2" fill="#fff" stroke="${SOFT}" stroke-width="0.4"/>`);
      y += rowH;
    });
    y += 4;
    const bw = (pg.width - 4) / 2;
    [['⭐', 'Stars this week'], ['🎁', money ? 'I have earned' : 'My reward']].forEach(([icon, label], k) => {
      const x = pg.left + k * (bw + 4);
      pg.add(`<rect x="${x}" y="${y}" width="${bw}" height="24" rx="6" fill="#fff" stroke="#ffb938" stroke-width="0.7" stroke-dasharray="2.5 1.5"/>`);
      pg.add(pic(P(icon), x + 11, y + 12, 13));
      pg.add(`<text x="${x + 21}" y="${y + 9}" font-family="${FONT}" font-weight="800" font-size="4" fill="${SOFT}">${label}</text>`);
      pg.add(`<line x1="${x + 21}" x2="${x + bw - 6}" y1="${y + 18}" y2="${y + 18}" stroke="#9a93b8" stroke-width="0.4"/>`);
    });
    return pg.svg();
  });
}

// ================================================================ feelings
const FEELINGS = {
  happy: '#ffd54f', sad: '#90caf9', angry: '#ff8a80', scared: '#ce93d8', excited: '#ffb74d', tired: '#b0bec5',
  worried: '#a5d6a7', calm: '#80deea', silly: '#f8bbd0', proud: '#ffe082', surprised: '#fff59d', lonely: '#b39ddb',
};

function face(cx, cy, r, mood, colour) {
  const fill = colour ? FEELINGS[mood] : '#fff';
  const ink = INK, sw = (r * 0.07).toFixed(2);
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${ink}" stroke-width="${(r * 0.06).toFixed(2)}"/>`;
  const ex = r * 0.36, ey = cy - r * 0.14;
  const eye = (x, kind) => {
    if (kind === 'closed') return `<path d="M${x - r * 0.13} ${ey} Q${x} ${ey + r * 0.1} ${x + r * 0.13} ${ey}" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round"/>`;
    if (kind === 'happy') return `<path d="M${x - r * 0.13} ${ey + r * 0.04} Q${x} ${ey - r * 0.12} ${x + r * 0.13} ${ey + r * 0.04}" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round"/>`;
    if (kind === 'big') return `<circle cx="${x}" cy="${ey}" r="${r * 0.13}" fill="#fff" stroke="${ink}" stroke-width="${sw}"/><circle cx="${x}" cy="${ey}" r="${r * 0.06}" fill="${ink}"/>`;
    return `<circle cx="${x}" cy="${ey}" r="${r * 0.08}" fill="${ink}"/>`;
  };
  const brow = (x, dir) => `<path d="M${x - r * 0.15} ${ey - r * 0.2 + dir * r * 0.06} L${x + r * 0.15} ${ey - r * 0.2 - dir * r * 0.06}" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round"/>`;
  const mouth = (d) => `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const my = cy + r * 0.38, mx = r * 0.32;
  const kinds = { proud: 'happy', tired: 'closed', surprised: 'big', scared: 'big' };
  s += eye(cx - ex, mood === 'silly' ? 'happy' : kinds[mood]) + eye(cx + ex, kinds[mood]);
  if (mood === 'angry') s += brow(cx - ex, -1) + brow(cx + ex, 1);
  if (mood === 'sad' || mood === 'worried' || mood === 'lonely' || mood === 'scared') s += brow(cx - ex, 1) + brow(cx + ex, -1);
  const M = {
    happy: `M${cx - mx} ${my - r * 0.06} Q${cx} ${my + r * 0.3} ${cx + mx} ${my - r * 0.06}`,
    sad: `M${cx - mx} ${my + r * 0.12} Q${cx} ${my - r * 0.18} ${cx + mx} ${my + r * 0.12}`,
    angry: `M${cx - mx} ${my + r * 0.1} Q${cx} ${my - r * 0.1} ${cx + mx} ${my + r * 0.1}`,
    worried: `M${cx - mx} ${my + r * 0.04} q${mx / 3} ${-r * 0.1} ${mx * 2 / 3} 0 t${mx * 2 / 3} 0 t${mx * 2 / 3} 0`,
    calm: `M${cx - mx * 0.8} ${my} Q${cx} ${my + r * 0.14} ${cx + mx * 0.8} ${my}`,
    tired: `M${cx - mx * 0.5} ${my + r * 0.04} L${cx + mx * 0.5} ${my + r * 0.04}`,
    lonely: `M${cx - mx * 0.7} ${my + r * 0.1} Q${cx} ${my - r * 0.06} ${cx + mx * 0.7} ${my + r * 0.1}`,
    proud: `M${cx - mx} ${my - r * 0.06} Q${cx} ${my + r * 0.26} ${cx + mx} ${my - r * 0.06}`,
  };
  if (mood === 'excited' || mood === 'silly') s += `<path d="M${cx - mx} ${my - r * 0.08} Q${cx} ${my + r * 0.42} ${cx + mx} ${my - r * 0.08} Z" fill="#fff" stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  else if (mood === 'surprised' || mood === 'scared') s += `<ellipse cx="${cx}" cy="${my + r * 0.04}" rx="${r * 0.13}" ry="${r * 0.17}" fill="#fff" stroke="${ink}" stroke-width="${sw}"/>`;
  else s += mouth(M[mood] || M.happy);
  if (mood === 'silly') s += `<path d="M${cx - r * 0.1} ${my + r * 0.12} Q${cx} ${my + r * 0.36} ${cx + r * 0.1} ${my + r * 0.12}" fill="#ff8fab" stroke="${ink}" stroke-width="${(r * 0.05).toFixed(2)}"/>`;
  if (mood === 'tired') s += `<text x="${cx + r * 0.62}" y="${cy - r * 0.55}" font-family="${TITLE_FONT}" font-weight="800" font-size="${r * 0.4}" fill="${ink}">z</text>`;
  if (mood === 'lonely' || mood === 'sad') s += `<path d="M${cx + ex} ${ey + r * 0.14} q${-r * 0.06} ${r * 0.14} 0 ${r * 0.2} q${r * 0.06} ${-r * 0.06} 0 ${-r * 0.2} Z" fill="#6ab7f5"/>`;
  if (['happy', 'excited', 'proud', 'silly'].includes(mood) && colour) s += `<circle cx="${cx - r * 0.55}" cy="${cy + r * 0.2}" r="${r * 0.12}" fill="#ff8fab" opacity="0.6"/><circle cx="${cx + r * 0.55}" cy="${cy + r * 0.2}" r="${r * 0.12}" fill="#ff8fab" opacity="0.6"/>`;
  return s;
}

const CALM_IDEAS = [['🌬️', 'Take 5 big breaths'], ['🔢', 'Count to 10 slowly'], [ART('bear'), 'Hug my teddy'], ['💧', 'Drink some water'], ['🖍️', 'Draw how I feel'],
  ['🗣️', 'Talk to a grown-up'], ['🎵', 'Listen to music'], ['🤸', 'Stretch like a cat'], ['🛋️', 'Go to my quiet spot'], ['🤗', 'Ask for a hug']];

function makeFeelings(o, paper) {
  const name = nameOf(o.name, '');
  const colour = o.faces !== 'colour-in';
  const moods = Object.keys(FEELINGS);
  const pages = [];
  if (o.chart !== false) {
    const pg = new Page(paper, 'How do I feel today?', { subtitle: 'Point to the face that feels like you. All feelings are OK!', noName: !name });
    const cols = 3, rows = 4, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    moods.forEach((m, i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="7" fill="${colour ? TINTS[i % TINTS.length] : '#fff'}" stroke="#e3def3" stroke-width="0.5"/>`);
      pg.add(face(x + cw / 2, y + ch * 0.44, Math.min(cw, ch) * 0.28, m, colour));
      pg.add(`<text x="${x + cw / 2}" y="${y + ch - 8}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="6.5" fill="${INK}">${m}</text>`);
    });
    pages.push(pg.svg());
  }
  if (o.week !== false) {
    const pg = new Page(paper, name ? `${possessive(name)} Feelings Week` : 'My Feelings Week', { subtitle: 'Each day, circle the face that shows how you feel, and say why.', noName: true });
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const rowH = (pg.room - 2) / 7;
    const pick = ['happy', 'calm', 'sad', 'angry', 'worried', 'tired'];
    days.forEach((d, i) => {
      const y = pg.y + i * rowH;
      pg.add(`<rect x="${pg.left}" y="${y + 1}" width="${pg.width}" height="${rowH - 3}" rx="6" fill="${TINTS[i]}"/>`);
      pg.add(`<text x="${pg.left + 5}" y="${y + rowH / 2 + 1}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.4" fill="${INK}">${d}</text>`);
      const r = Math.min(5.5, rowH * 0.2);
      pick.forEach((m, k) => pg.add(face(pg.left + 44 + k * (r * 2.5), y + rowH * 0.36, r, m, colour)));
      pg.add(`<text x="${pg.left + 44 + 6 * r * 2.5 + 3}" y="${y + rowH * 0.36 + 1.4}" font-family="${FONT}" font-weight="700" font-size="3.8" fill="${SOFT}">because...</text>`);
      pg.add(`<line x1="${pg.left + 44}" x2="${pg.right - 5}" y1="${y + rowH - 6}" y2="${y + rowH - 6}" stroke="#9a93b8" stroke-width="0.35"/>`);
    });
    pages.push(pg.svg());
  }
  if (o.calm !== false) {
    const pg = new Page(paper, 'When I have big feelings, I can...', { subtitle: 'Try one of these. Colour the ones that help you most.', noName: true });
    const cols = 2, rows = 5, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    CALM_IDEAS.forEach(([src, label], i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      const c = i % PALETTE.length;
      pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="8" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
      pg.add(pic(P(src), x + 20, y + ch / 2, Math.min(30, ch - 14)));
      textLines(pg, wrap(label, 16), x + 38, y + ch / 2 + 1 - (wrap(label, 16).length - 1) * 3.5, 6, { weight: 800, font: TITLE_FONT, lh: 1.2 });
    });
    pages.push(pg.svg());
  }
  if (!pages.length) pages.push(new Page(paper, 'Feelings', { subtitle: 'Tick at least one page to include.', noName: true }).svg());
  return pages;
}

// ================================================================ scavenger hunts
const HUNTS = {
  home: ['🥄 spoon', '🧦 sock', '📚 book', '☕ cup', `${ART('bear')} teddy`, '🔑 key', '⏰ clock', '🪥 toothbrush', '👟 shoe', '⚽ ball', `${ART('apple')} apple`, `${ART('blocks')} blocks`],
  garden: ['🍃 leaf', `${ART('daisy')} flower`, `${ART('ladybird')} ladybird`, '🪨 stone', '🪵 stick', '🪶 feather', '🐌 snail', `${ART('ant')} ant`, '🐦 bird', '🪱 worm', `${ART('mushroom')} mushroom`, '🦋 butterfly'],
  park: ['🪑 bench', '🌳 tree', `${ART('dog')} dog`, '🦆 duck', '💧 puddle', '🌲 pine cone', '🛝 slide', '🚲 bike', '☁️ cloud', `${ART('sun')} sun`, '🐿️ squirrel', `${ART('tulip')} flower`],
  beach: ['🐚 shell', '🦀 crab', '⛱️ umbrella', '🌊 wave', `${ART('fish')} fish`, '🪣 bucket', '⛵ boat', '🩴 flip-flops', `${ART('star')} starfish`, '🍦 ice cream', `${ART('sun')} sun`, '🪨 rock'],
  shop: [`${ART('apple')} apple`, `${ART('banana')} banana`, `${ART('egg')} eggs`, '🍞 bread', '🥛 milk', '🧀 cheese', `${ART('orange')} orange`, '🥕 carrot', `${ART('strawberry')} strawberry`, '🍝 pasta', '🥫 tin', '🛒 trolley'],
  colours: ['#ff4d4d red', '#ff9f1c orange', '#ffd23f yellow', '#3fbf60 green', '#3a86ff blue', '#9b5de5 purple', '#ff70a6 pink', '#8d5524 brown', '#2d2350 black', '#ffffff white', '#9aa5b1 grey', '#ffd700 gold'],
  shapes: ['circle circle', 'square square', 'triangle triangle', 'rectangle rectangle', 'star star', 'heart heart', 'oval oval', 'diamond diamond'],
};

function shapeIcon(kind, cx, cy, r) {
  const st = `fill="#fff" stroke="${INK}" stroke-width="0.9" stroke-linejoin="round"`;
  switch (kind) {
    case 'circle': return `<circle cx="${cx}" cy="${cy}" r="${r}" ${st}/>`;
    case 'square': return `<rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" ${st}/>`;
    case 'triangle': return `<path d="M${cx} ${cy - r} L${cx + r * 1.1} ${cy + r * 0.85} L${cx - r * 1.1} ${cy + r * 0.85} Z" ${st}/>`;
    case 'rectangle': return `<rect x="${cx - r * 1.3}" y="${cy - r * 0.75}" width="${r * 2.6}" height="${r * 1.5}" ${st}/>`;
    case 'star': return `<path d="${starPath(cx, cy, r * 1.1, 0.45)}" ${st}/>`;
    case 'heart': return `<path d="M${cx} ${cy + r} C${cx - r * 1.6} ${cy - r * 0.1} ${cx - r * 0.7} ${cy - r * 1.3} ${cx} ${cy - r * 0.45} C${cx + r * 0.7} ${cy - r * 1.3} ${cx + r * 1.6} ${cy - r * 0.1} ${cx} ${cy + r} Z" ${st}/>`;
    case 'oval': return `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.3}" ry="${r * 0.8}" ${st}/>`;
    default: return `<path d="M${cx} ${cy - r * 1.1} L${cx + r * 0.85} ${cy} L${cx} ${cy + r * 1.1} L${cx - r * 0.85} ${cy} Z" ${st}/>`;
  }
}

function makeHunt(o, paper) {
  const theme = HUNTS[o.theme] ? o.theme : 'garden';
  const items = HUNTS[theme].map((s) => { const i = s.indexOf(' '); return [s.slice(0, i), s.slice(i + 1)]; });
  const title = { home: 'Indoor treasure hunt', garden: 'Garden scavenger hunt', park: 'Park scavenger hunt', beach: 'Beach scavenger hunt', shop: 'Supermarket hunt', colours: 'Colour hunt', shapes: 'Shape hunt' }[theme];
  const sub = theme === 'colours' ? 'Find something in each colour. Tick it or draw what you found!' : theme === 'shapes' ? 'Find something shaped like each one. Draw what you found!' : 'Can you find them all? Tick each one when you spot it!';
  const pg = new Page(paper, title, { subtitle: sub });
  const cols = 3, rows = Math.ceil(items.length / cols);
  const foot = 24;
  const cw = pg.width / cols, ch = (pg.room - foot - 2) / rows;
  items.forEach(([src, label], i) => {
    const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
    const c = i % PALETTE.length;
    pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="7" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
    const size = Math.min(cw, ch) * 0.46;
    if (theme === 'colours') {
      pg.add(`<path d="M${x + cw / 2} ${y + ch * 0.42 - size * 0.5} c${size * 0.4} 0 ${size * 0.6} ${size * 0.15} ${size * 0.52} ${size * 0.45} c${size * 0.1} ${size * 0.35} ${-size * 0.2} ${size * 0.55} ${-size * 0.52} ${size * 0.52} c${-size * 0.4} 0 ${-size * 0.62} ${-size * 0.2} ${-size * 0.55} ${-size * 0.5} c0 ${-size * 0.3} ${size * 0.2} ${-size * 0.47} ${size * 0.55} ${-size * 0.47} Z" fill="${src}" stroke="${INK}" stroke-width="0.5"/>`);
    } else if (theme === 'shapes') pg.add(shapeIcon(src, x + cw / 2, y + ch * 0.42, size * 0.42));
    else pg.add(pic(src, x + cw / 2, y + ch * 0.42, size));
    const tw = label.length * 2.95, sx = x + cw / 2 - (tw + 7) / 2;
    pg.add(`<rect x="${sx}" y="${y + ch - 11.2}" width="5" height="5" rx="1.2" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`);
    pg.add(`<text x="${sx + 7}" y="${y + ch - 7}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.6" fill="${INK}">${esc(label)}</text>`);
  });
  const fy = pg.bottom - foot + 3;
  pg.add(`<rect x="${pg.left}" y="${fy}" width="${pg.width}" height="${foot - 4}" rx="7" fill="#fff6e0" stroke="#ffb938" stroke-width="0.6" stroke-dasharray="2.5 1.5"/>`);
  pg.add(pic(ART('medal'), pg.left + 12, fy + (foot - 4) / 2, 15));
  pg.add(`<text x="${pg.left + 24}" y="${fy + 12}" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="${INK}">I found</text>`);
  pg.add(`<rect x="${pg.left + 46}" y="${fy + 5}" width="14" height="10" rx="2" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`);
  pg.add(`<text x="${pg.left + 63}" y="${fy + 12}" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="${INK}">out of ${items.length}!</text>`);
  return [pg.svg()];
}

// ================================================================ matching
function makeMatching(o, paper) {
  const rand = rng(+o.seed || 1);
  const n = Math.max(4, Math.min(6, +o.pairs || 5));
  const kind = o.kind || 'word';
  const painted = shuffle([...SETS.animals, ...SETS.food, ...SETS.things].filter(([, s]) => s.startsWith('img/')), rand);
  let pairs;
  if (kind === 'case') pairs = shuffle('ABDEFGHLMNQRT'.split(''), rand).slice(0, n).map((L) => [{ t: L }, { t: L.toLowerCase() }]);
  else if (kind === 'count') pairs = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], rand).slice(0, n).map((k, i) => [{ count: k, src: painted[i][1] }, { t: String(k) }]);
  else if (kind === 'shadow') pairs = painted.slice(0, n).map(([, src]) => [{ src }, { src, shadow: true }]);
  else pairs = painted.slice(0, n).map(([name, src]) => [{ src }, { t: name.toLowerCase() }]);
  const order = shuffle([...Array(n).keys()], rand);
  const title = { word: 'Match the picture to the word', case: 'Match the big and little letters', count: 'Count and match', shadow: 'Match the shadow' }[kind] || 'Matching';
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? `${title}: answers` : title, { subtitle: answers ? 'Answer key for grown-ups.' : 'Draw a line from each one on the left to its partner on the right.', noName: answers });
    pg.add(`<defs><filter id="shadow"><feColorMatrix type="matrix" values="0 0 0 0 0.24  0 0 0 0 0.2  0 0 0 0 0.36  0 0 0 1 0"/></filter></defs>`);
    const rowH = (pg.room - 4) / n;
    const colW = 62;
    const lx = pg.left + 6, rx = pg.right - colW - 6;
    const cell = (item, x, y, c) => {
      const cx = x + colW / 2, cy = y + rowH / 2;
      pg.add(`<rect x="${x}" y="${y + 3}" width="${colW}" height="${rowH - 6}" rx="7" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
      const s = Math.min(colW, rowH) * 0.66;
      if (item.count) {
        const k = item.count, cols = Math.min(5, k), rows = Math.ceil(k / 5), d = Math.min(colW / 5.6, (rowH - 10) / rows);
        for (let i = 0; i < k; i++) pg.add(pic(item.src, cx - ((cols - 1) * d) / 2 + (i % 5) * d, cy - ((rows - 1) * d) / 2 + Math.floor(i / 5) * d, d * 0.92));
      } else if (item.src) {
        const img = pic(item.src, cx, cy, s);
        pg.add(item.shadow ? img.replace('<image ', '<image filter="url(#shadow)" ') : img);
      } else pg.add(`<text x="${cx}" y="${cy + s * 0.2}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(item.t, s * 0.62, colW - 8, 0.52).toFixed(2)}" fill="${INK}">${esc(item.t)}</text>`);
    };
    pairs.forEach(([a], i) => cell(a, lx, pg.y + i * rowH, i % PALETTE.length));
    order.forEach((pi, j) => cell(pairs[pi][1], rx, pg.y + j * rowH, (pi + 3) % PALETTE.length));
    for (let i = 0; i < n; i++) {
      const y = pg.y + i * rowH + rowH / 2;
      pg.add(`<circle cx="${lx + colW + 4}" cy="${y}" r="1.6" fill="${INK}"/><circle cx="${rx - 4}" cy="${y}" r="1.6" fill="${INK}"/>`);
    }
    if (answers) pairs.forEach((_, i) => {
      const j = order.indexOf(i);
      pg.add(`<line x1="${lx + colW + 4}" y1="${pg.y + i * rowH + rowH / 2}" x2="${rx - 4}" y2="${pg.y + j * rowH + rowH / 2}" stroke="#e0457b" stroke-width="0.8" stroke-linecap="round"/>`);
    });
    pages.push(pg.svg());
  }
  return pages;
}

Object.assign(MAKERS, { sight: makeSight, cvc: makeCVC, bonds: makeBonds, flashcards: makeFlashcards, chores: makeChores, feelings: makeFeelings, hunt: makeHunt, matching: makeMatching });
