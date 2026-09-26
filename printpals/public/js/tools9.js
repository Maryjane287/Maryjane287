// PrintPals batch 8: hundred square, alphabet order, colour words, how to draw,
// sentences, bookmarks, clock craft and snakes and ladders.

// ================================================================ hundred square
function makeHundred(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'full';
  const pages = [];
  if (kind === 'pieces') {
    for (const answers of [false, true]) {
      if (answers && o.key === false) break;
      const pg = new Page(paper, answers ? 'Hundred square pieces: answers' : 'Hundred square pieces', { subtitle: answers ? 'Answer key for grown-ups.' : 'Each piece comes from a hundred square. Fill in the numbers around the middle one.', noName: answers });
      const cols = 3, rows = 3, cw = pg.width / cols, ch = (pg.room - 2) / rows, cell = Math.min(cw, ch) / 3.6;
      const r2 = rng(+o.seed || 1);
      for (let i = 0; i < 9; i++) {
        let n;
        do { n = 12 + Math.floor(r2() * 78); } while (n % 10 === 0 || n % 10 === 1);
        const x = pg.left + (i % cols) * cw + cw / 2, y = pg.y + Math.floor(i / cols) * ch + ch / 2;
        [[0, 0, n], [-1, 0, n - 1], [1, 0, n + 1], [0, -1, n - 10], [0, 1, n + 10]].forEach(([dx, dy, v]) => {
          const bx = x + dx * cell - cell / 2, by = y + dy * cell - cell / 2, centre = !dx && !dy;
          pg.add(`<rect x="${bx}" y="${by}" width="${cell}" height="${cell}" fill="${centre ? '#ffc93c' : '#fff'}" stroke="${INK}" stroke-width="0.6"/>`);
          if (centre || answers) pg.add(`<text x="${bx + cell / 2}" y="${by + cell / 2 + cell * 0.16}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${cell * 0.44}" fill="${centre ? INK : '#e0457b'}">${v}</text>`);
        });
      }
      pages.push(pg.svg());
    }
    return pages;
  }
  const step = +o.step || 5;
  const blanks = new Set();
  if (kind === 'missing') {
    const count = { easy: 20, medium: 40, hard: 65 }[o.level] || 40;
    shuffle([...Array(100).keys()].map((k) => k + 1), rand).slice(0, count).forEach((v) => blanks.add(v));
  }
  for (const answers of [false, true]) {
    if (answers && (o.key === false || kind === 'full')) break;
    const titles = { full: 'Hundred square', missing: 'Fill in the missing numbers', blank: 'Write the hundred square', pattern: `Counting in ${step}s` };
    const subs = { full: 'Count along the rows. What patterns can you spot?', missing: 'Write the missing numbers in the empty squares.', blank: 'Write the numbers 1 to 100. The first row is done for you.', pattern: `Colour every number you say when you count in ${step}s. What pattern do you see?` };
    const pg = new Page(paper, answers ? `${titles[kind]}: answers` : titles[kind], { subtitle: answers ? 'Answer key for grown-ups.' : subs[kind], noName: answers });
    const cell = Math.min(pg.width / 10, (pg.room - 4) / 10);
    const gx = pg.left + (pg.width - cell * 10) / 2;
    for (let v = 1; v <= 100; v++) {
      const r = Math.floor((v - 1) / 10), c = (v - 1) % 10, x = gx + c * cell, y = pg.y + r * cell;
      const hide = (kind === 'missing' && blanks.has(v)) || (kind === 'blank' && v > 10);
      const colour = kind === 'pattern' && answers && v % step === 0;
      const fill = colour ? '#ffc93c' : kind === 'full' ? TINTS[r % TINTS.length] : hide ? '#fff' : '#fbfaff';
      pg.add(`<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${fill}" stroke="#9a93b8" stroke-width="0.35"/>`);
      if (!hide || answers) pg.add(`<text x="${x + cell / 2}" y="${y + cell / 2 + cell * 0.15}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${cell * 0.4}" fill="${hide ? '#e0457b' : INK}">${v}</text>`);
    }
    pg.add(`<rect x="${gx}" y="${pg.y}" width="${cell * 10}" height="${cell * 10}" fill="none" stroke="${INK}" stroke-width="0.9"/>`);
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ alphabet order
const ABC_WORDS = [['apple', 'img/apple.webp'], ['balloon', 'img/balloon.webp'], ['cat', 'img/cat.webp'], ['dog', 'img/dog.webp'], ['egg', 'img/egg.webp'],
  ['fish', 'img/fish.webp'], ['hat', 'img/hat.webp'], ['lion', 'img/lion.webp'], ['monkey', 'img/monkey.webp'], ['nest', 'img/nest.webp'],
  ['octopus', 'img/octopus.webp'], ['pig', 'img/pig.webp'], ['rainbow', 'img/rainbow.webp'], ['sun', 'img/sun.webp'], ['turtle', 'img/turtle.webp'], ['zebra', 'img/zebra.webp']];

function makeAbcOrder(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'missing';
  const upper = o.case === 'upper';
  const L = (i) => { const c = String.fromCharCode(97 + i); return upper ? c.toUpperCase() : c; };
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const titles = { missing: 'Missing letters', between: 'Before and after', words: 'ABC order' };
    const subs = { missing: 'Say the alphabet. Write the missing letters in the boxes.', between: 'Write the letter that comes before and the letter that comes after.', words: 'Which word comes first in the alphabet? Number the pictures 1, 2, 3, 4.' };
    const pg = new Page(paper, answers ? `${titles[kind]}: answers` : titles[kind], { subtitle: answers ? 'Answer key for grown-ups.' : subs[kind], noName: answers });
    const r2 = rng(+o.seed || 1);
    if (kind === 'missing') {
      const rows = 7, rh = (pg.room - 2) / rows, box = Math.min(18, (pg.width - 8) / 9.4);
      for (let r = 0; r < rows; r++) {
        const start = Math.floor(r2() * 18), gaps = new Set(shuffle([1, 2, 3, 4, 5, 6, 7], r2).slice(0, 3));
        for (let k = 0; k < 8; k++) {
          const x = pg.left + 4 + k * (box + 4), y = pg.y + r * rh + (rh - box) / 2, gap = gaps.has(k);
          pg.add(`<rect x="${x}" y="${y}" width="${box}" height="${box}" rx="3" fill="${gap ? '#fff' : TINTS[r % TINTS.length]}" stroke="${gap ? PALETTE[r % PALETTE.length] : '#d9d4ec'}" stroke-width="${gap ? 0.8 : 0.4}"/>`);
          if (!gap || answers) {
            const ch = L(start + k), size = box * 0.5;
            const top = y + box * 0.72 - size - (/[gjpqy]/.test(ch) ? size * 0.25 : 0);
            pg.add(drawText(ch, x + box / 2 - (GLYPHS[ch].w / 200) * size, upper ? y + box * 0.25 : top, size, gap ? 'ghost' : 'model'));
            if (gap) pg.add(`<text x="${x + box / 2}" y="${y + box * 0.72}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${box * 0.55}" fill="#e0457b">${ch}</text>`);
          }
        }
      }
    } else if (kind === 'between') {
      const cols = 2, rows = 7, cw = pg.width / cols, rh = (pg.room - 2) / rows, box = 13;
      for (let i = 0; i < cols * rows; i++) {
        const m = 1 + Math.floor(r2() * 24);
        const x = pg.left + (i % cols) * cw + 6, y = pg.y + Math.floor(i / cols) * rh + (rh - box) / 2;
        [m - 1, m, m + 1].forEach((v, k) => {
          const bx = x + k * (box + 8), mid = k === 1;
          pg.add(`<rect x="${bx}" y="${y}" width="${box}" height="${box}" rx="3" fill="${mid ? '#ffc93c' : '#fff'}" stroke="${INK}" stroke-width="0.5"/>`);
          if (mid || answers) pg.add(`<text x="${bx + box / 2}" y="${y + box * 0.72}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${box * 0.6}" fill="${mid ? INK : '#e0457b'}">${L(v)}</text>`);
        });
      }
    } else {
      const groups = 4, gh = (pg.room - 2) / groups;
      for (let g = 0; g < groups; g++) {
        const words = shuffle(ABC_WORDS, r2).slice(0, 4);
        const order = [...words].sort((a, b) => a[0].localeCompare(b[0]));
        const y = pg.y + g * gh, cw = pg.width / 4;
        pg.add(`<rect x="${pg.left}" y="${y + 1.5}" width="${pg.width}" height="${gh - 4}" rx="7" fill="${TINTS[g]}"/>`);
        words.forEach(([w, src], k) => {
          const cx = pg.left + k * cw + cw / 2;
          pg.add(pic(src, cx, y + gh * 0.34, Math.min(26, gh * 0.4)));
          pg.add(`<text x="${cx}" y="${y + gh * 0.66}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="${INK}">${w}</text>`);
          pg.add(`<rect x="${cx - 6}" y="${y + gh * 0.72}" width="12" height="10" rx="2" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`);
          if (answers) pg.add(`<text x="${cx}" y="${y + gh * 0.72 + 7.4}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="#e0457b">${order.findIndex((x) => x[0] === w) + 1}</text>`);
        });
      }
    }
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ colour words
const COLOUR_WORDS = [['red', '#ff4d4d'], ['orange', '#ff9f1c'], ['yellow', '#ffd23f'], ['green', '#3fbf60'], ['blue', '#3a86ff'], ['purple', '#9b5de5'],
  ['pink', '#ff70a6'], ['brown', '#8d5524'], ['black', '#2d2350'], ['white', '#ffffff'], ['grey', '#9aa5b1']];

function crayon(x, y, w, h, colour) {
  return `<path d="M${x} ${y} H${x + w - h} L${x + w} ${y + h / 2} L${x + w - h} ${y + h} H${x} Z" fill="${colour}" stroke="${INK}" stroke-width="0.6" stroke-linejoin="round"/>`
    + `<rect x="${x + w * 0.18}" y="${y}" width="${w * 0.5}" height="${h}" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`;
}

function makeColourWords(o, paper) {
  const rand = rng(+o.seed || 1);
  if (o.kind === 'read') {
    const pg = new Page(paper, 'Read and colour', { subtitle: 'Read the colour word under each picture, then colour it in that colour.' });
    const arts = shuffle(['fish', 'butterfly', 'car', 'teddy', 'rocket', 'ladybird', 'owl', 'sunflower', 'frog'], rand).slice(0, 6);
    const cols = shuffle(COLOUR_WORDS.filter(([w]) => w !== 'white' && w !== 'black'), rand);
    const cw = pg.width / 2, ch = (pg.room - 2) / 3;
    arts.forEach((a, i) => {
      const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * ch, [word, hex] = cols[i];
      pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="7" fill="#fff" stroke="#d9d4ec" stroke-width="0.6"/>`);
      const size = ch - 26;
      pg.add(`<g transform="translate(${x + cw / 2 - size / 2} ${y + 5}) scale(${(size / 200).toFixed(4)})">${colouringArt(a)}</g>`);
      pg.add(crayon(x + cw / 2 - 28, y + ch - 16, 18, 7, hex));
      pg.add(`<text x="${x + cw / 2 - 4}" y="${y + ch - 10}" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="${INK}">${word}</text>`);
    });
    return [pg.svg()];
  }
  const list = o.colour && o.colour !== 'all' ? COLOUR_WORDS.filter(([w]) => w === o.colour) : COLOUR_WORDS;
  return list.map(([word, hex]) => {
    const pg = new Page(paper, `The colour ${word}`, { subtitle: `Read it, trace it, write it, then colour the shapes ${word}.` });
    pg.add(crayon(pg.left, pg.y + 4, 70, 22, hex));
    bubbleText(pg, word, pg.left + 130, pg.y + 24, 100, 24);
    pg.y += 38;
    const size = 18;
    for (let r = 0; r < 3; r++) {
      pg.guides(pg.y, size, pg.left, pg.right, false);
      if (r < 2) fillRow(pg, word, pg.y, size, r === 0 ? 'model' : 'trace', r === 0, r === 0 ? 1 : 99);
      pg.y += rowHeight(size) * 0.8;
    }
    pg.y += 4;
    const shapes = shuffle(['star', 'heart', 'circle', 'diamond', 'hexagon', 'triangle', 'square', 'oval'], rand).slice(0, 3);
    const cw = pg.width / 3, r = Math.min(cw, pg.room) * 0.28;
    shapes.forEach((kind, i) => pg.add(shape2d(kind, pg.left + cw * (i + 0.5), pg.y + r + 8, r, `fill="#fff" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"`)));
    return pg.svg();
  });
}

// ================================================================ how to draw
// The order an artist would draw each part: big outline first, then limbs, face, and the scenery last.
const DRAW_ORDER = {
  cat: [4, 1, 3, 0, 2, 5, 6, 7, 8, 9, 10], owl: [2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 1], teddy: [4, 2, 0, 1, 3, 5, 6, 7, 8],
  penguin: [5, 6, 4, 11, 7, 8, 9, 10, 12, 0, 1, 2, 3], robot: [1, 7, 0, 2, 3, 4, 5, 6, 8, 9, 10],
  frog: [5, 3, 6, 4, 7, 8, 9, 2, 10, 0, 1], dog: [4, 1, 5, 2, 3, 6, 7, 8, 9, 10, 0], bunny: [5, 3, 1, 2, 4, 6, 7, 8, 9, 10, 11, 0],
  unicorn: [6, 5, 7, 4, 8, 9, 10, 11, 0, 1, 2, 3], ladybird: [3, 5, 4, 1, 2, 6, 7, 8, 9, 0], fish: [4, 2, 3, 5, 6, 7, 1, 0],
  rocket: [9, 11, 8, 7, 10, 12, 6, 0, 1, 2, 3, 4, 5],
};
const DRAWABLE = ['cat', 'owl', 'teddy', 'penguin', 'robot', 'frog', 'dog', 'bunny', 'unicorn', 'ladybird', 'fish', 'rocket'];

function makeHowToDraw(o, paper) {
  const rand = rng(+o.seed || 1);
  const key = DRAWABLE.includes(o.picture) ? o.picture : DRAWABLE[Math.floor(rand() * DRAWABLE.length)];
  const art = COLOURING[key];
  const raw = art.draw(), order = DRAW_ORDER[key];
  const parts = order && order.length === raw.length ? order.map((i) => raw[i]) : raw;
  const steps = Math.min(6, parts.length);
  const per = Math.ceil(parts.length / steps);
  const nm = art.name.toLowerCase();
  const pg = new Page(paper, `How to draw ${/^[aeiou]/.test(nm) ? 'an' : 'a'} ${nm}`, { subtitle: 'Copy one step at a time. The new lines in each step are dark. Then draw your own below!' });
  const cols = 3, gw = pg.width / cols, gh = (pg.room * 0.55) / 2;
  const grey = (s) => s.replace(/#1f1b2e/g, '#cfcadf');
  for (let st = 0; st < steps; st++) {
    const x = pg.left + (st % cols) * gw, y = pg.y + Math.floor(st / cols) * gh;
    pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${gw - 3}" height="${gh - 3}" rx="6" fill="#fff" stroke="#d9d4ec" stroke-width="0.6"/>`);
    pg.add(`<circle cx="${x + 8}" cy="${y + 8}" r="4.5" fill="${PALETTE[st % PALETTE.length]}"/><text x="${x + 8}" y="${y + 9.8}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.6" fill="#fff">${st + 1}</text>`);
    const shown = parts.slice(0, Math.min(parts.length, (st + 1) * per));
    const old = parts.slice(0, st * per);
    const inner = old.map(grey).join('') + shown.slice(old.length).join('');
    const size = Math.min(gw, gh) - 10;
    pg.add(`<g transform="translate(${x + (gw - size) / 2} ${y + (gh - size) / 2 + 2}) scale(${(size / 200).toFixed(4)})">${inner}</g>`);
  }
  pg.y += gh * 2 + 6;
  const bh = pg.room - 2;
  pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${bh}" rx="8" fill="#fff" stroke="${INK}" stroke-width="0.8" stroke-dasharray="3 2"/>`);
  pg.add(`<text x="${pg.left + 6}" y="${pg.y + 8}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="${SOFT}">✏️ Your turn! Draw it here, then colour it in.</text>`);
  return [pg.svg()];
}

// ================================================================ sentences
const SENTENCES = [['The dog can run.', ART('dog')], ['I like red apples.', ART('apple')], ['We went to the park.', '🌳'], ['My cat is very fast.', ART('cat')],
  ['The sun is hot today.', ART('sun')], ['Sam has a big kite.', '🪁'], ['Mia can see a bird.', '🐦'], ['The fish is in the pond.', ART('fish')],
  ['I love my mum.', ART('heart')], ['Leo got a new bike.', '🚲'], ['The pig is in the mud.', ART('pig')], ['We can bake a cake.', ART('cake')]];

function makeSentences(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'fix';
  const items = shuffle(SENTENCES, rand).slice(0, 6);
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && (o.key === false || kind === 'finish')) break;
    const titles = { fix: 'Fix the sentence', unscramble: 'Mixed-up sentences', finish: 'Finish the sentence' };
    const subs = { fix: 'Each sentence needs a capital letter and a full stop. Write it out correctly.', unscramble: 'Put the words in the right order to make a sentence. Write it on the line.', finish: 'Finish each sentence your own way, then draw a picture.' };
    const pg = new Page(paper, answers ? `${titles[kind]}: answers` : titles[kind], { subtitle: answers ? 'Answer key for grown-ups.' : subs[kind], noName: answers });
    const rh = (pg.room - 2) / items.length;
    const r2 = rng(+o.seed || 7);
    items.forEach(([sent, src], i) => {
      const y = pg.y + i * rh, c = i % PALETTE.length;
      pg.add(`<rect x="${pg.left}" y="${y + 1.5}" width="${pg.width}" height="${rh - 4}" rx="6" fill="${TINTS[c]}"/>`);
      pg.add(pic(src, pg.left + 12, y + rh / 2, Math.min(18, rh - 12)));
      const x = pg.left + 26, lineY = y + rh - 9;
      if (kind === 'fix') {
        const wrong = sent.charAt(0).toLowerCase() + sent.slice(1, -1);
        pg.add(`<text x="${x}" y="${y + 11}" font-family="${FONT}" font-weight="800" font-size="5.6" fill="${INK}">${esc(wrong)}</text>`);
      } else if (kind === 'unscramble') {
        const words = sent.slice(0, -1).split(' ');
        let wx = x;
        shuffle(words, r2).forEach((w) => {
          const ww = w.length * 3 + 6;
          pg.add(`<rect x="${wx}" y="${y + 5}" width="${ww}" height="8.5" rx="2" fill="#fff" stroke="${PALETTE[c]}" stroke-width="0.5"/><text x="${wx + ww / 2}" y="${y + 11}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.8" fill="${INK}">${esc(w)}</text>`);
          wx += ww + 3;
        });
      } else {
        const start = sent.split(' ').slice(0, 3).join(' ');
        pg.add(`<text x="${x}" y="${y + 11}" font-family="${FONT}" font-weight="800" font-size="5.6" fill="${INK}">${esc(start)} ...</text>`);
      }
      if (answers) pg.add(`<text x="${x}" y="${lineY - 1}" font-family="${FONT}" font-weight="800" font-size="5.2" fill="#e0457b">${esc(sent)}</text>`);
      pg.add(`<line x1="${x}" x2="${pg.right - 6}" y1="${lineY}" y2="${lineY}" stroke="#9a93b8" stroke-width="0.45"/>`);
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ bookmarks
const BOOK_QUOTES = ['I love reading!', 'Books are magic', 'Just one more page!', 'Reading is my superpower', 'Keep calm and read on', 'Every book is an adventure'];

function makeBookmarks(o, paper) {
  const rand = rng(+o.seed || 1);
  const names = listOf(o.names, 40).map((n) => nameOf(n, ''));
  const bright = o.style === 'bright';
  const artsLine = ['cat', 'owl', 'unicorn', 'rocket', 'butterfly', 'teddy', 'penguin', 'dog', 'bee', 'frog', 'fish', 'sunflower'];
  const painted = ['lion', 'monkey', 'octopus', 'turtle', 'cat', 'dog', 'pig', 'zebra', 'bear', 'chick', 'rainbow', 'star'];
  const count = Math.max(4, names.length);
  const pages = [];
  for (let p = 0; p < Math.ceil(count / 4); p++) {
    const pg = new Page(paper, '', { bare: true });
    const bw = pg.width / 4, bh = pg.bottom - pg.m;
    for (let k = 0; k < 4; k++) {
      const i = p * 4 + k, x = pg.left + k * bw + 3, w = bw - 6, y = pg.m, c = i % PALETTE.length;
      const name = i < names.length ? names[i] : '';
      pg.add(`<rect x="${x}" y="${y}" width="${w}" height="${bh}" rx="6" fill="${bright ? TINTS[c] : '#fff'}" stroke="${bright ? PALETTE[c] : INK}" stroke-width="0.9"/>`);
      pg.add(`<circle cx="${x + w / 2}" cy="${y + 7}" r="2.4" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`);
      const size = w - 6;
      if (bright) pg.add(pic(ART(painted[(i + Math.floor(rand() * 3)) % painted.length]), x + w / 2, y + 12 + size / 2, size));
      else pg.add(`<g transform="translate(${x + 3} ${y + 12}) scale(${(size / 200).toFixed(4)})">${colouringArt(artsLine[(i + Math.floor(rand() * 3)) % artsLine.length])}</g>`);
      const q = BOOK_QUOTES[(i + p) % BOOK_QUOTES.length];
      const lines = wrap(q, 12);
      textLines(pg, lines, x + w / 2, y + size + 24, 5.4, { anchor: 'middle', weight: 800, font: TITLE_FONT, colour: bright ? PALETTE[c] : INK });
      if (name) {
        const fs = Math.min(13, (bh - size - 60) / (name.length * 0.56));
        const cy = y + size + 30 + lines.length * 7 + (bh - size - 40 - lines.length * 7) / 2;
        pg.add(`<text transform="rotate(-90 ${x + w / 2} ${cy})" x="${x + w / 2}" y="${cy + fs * 0.34}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs.toFixed(2)}" fill="#fff" stroke="${INK}" stroke-width="${(fs * 0.06).toFixed(2)}" paint-order="stroke">${esc(name)}</text>`);
      } else {
        for (let s = 0; s < 4; s++) pg.add(`<path d="${starPath(x + w / 2 + (s % 2 ? 7 : -7), y + size + 50 + s * 26, 5, 0.45)}" fill="#fff" stroke="${bright ? PALETTE[c] : INK}" stroke-width="0.7" stroke-linejoin="round"/>`);
      }
    }
    pg.footer = () => {};
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ clock craft
function makeClockCraft(o, paper) {
  const pg = new Page(paper, 'Make your own clock', { subtitle: 'Colour it, cut out the clock and the hands, then join them in the middle with a paper fastener.', noName: true });
  const R = Math.min(pg.width / 2 - 6, 72), cx = pg.w / 2, cy = pg.y + R + 6;
  const helpers = o.helpers !== false;
  if (helpers) {
    pg.add(`<path d="M${cx} ${cy - R} A${R} ${R} 0 0 1 ${cx} ${cy + R} Z" fill="#e6f1ff"/><path d="M${cx} ${cy - R} A${R} ${R} 0 0 0 ${cx} ${cy + R} Z" fill="#ffe8ef"/>`);
  }
  pg.add(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${helpers ? 'none' : '#fff'}" stroke="${INK}" stroke-width="1.4"/>`);
  for (let m = 0; m < 60; m++) {
    const a = (m * Math.PI) / 30, big = m % 5 === 0, r1 = R - (big ? 7 : 4);
    pg.add(`<line x1="${cx + Math.sin(a) * r1}" y1="${cy - Math.cos(a) * r1}" x2="${cx + Math.sin(a) * (R - 1)}" y2="${cy - Math.cos(a) * (R - 1)}" stroke="${INK}" stroke-width="${big ? 0.8 : 0.35}"/>`);
    if (big && o.minutes !== false) pg.add(`<text x="${cx + Math.sin(a) * (R + 5)}" y="${cy - Math.cos(a) * (R + 5) + 1.4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${SOFT}">${m}</text>`);
  }
  for (let h = 1; h <= 12; h++) {
    const a = (h * Math.PI) / 6;
    pg.add(`<text x="${cx + Math.sin(a) * (R - 17)}" y="${cy - Math.cos(a) * (R - 17) + 4.4}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="12" fill="${INK}">${h}</text>`);
  }
  if (helpers) {
    pg.add(`<text x="${cx + R * 0.34}" y="${cy + 3}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.6" fill="#3a86ff">past</text><text x="${cx - R * 0.34}" y="${cy + 3}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.6" fill="#e0457b">to</text>`);
    pg.add(`<text x="${cx}" y="${cy - R * 0.4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4" fill="${SOFT}">o'clock</text><text x="${cx}" y="${cy + R * 0.46}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4" fill="${SOFT}">half past</text>`);
  }
  pg.add(`<circle cx="${cx}" cy="${cy}" r="2" fill="#fff" stroke="${INK}" stroke-width="0.8"/>`);
  pg.add(`<circle cx="${cx}" cy="${cy}" r="${R + 10}" fill="none" stroke="#b9b3d6" stroke-width="0.5" stroke-dasharray="2.5 1.8"/>`);
  // Hands to cut out
  const hy = cy + R + 22;
  scissors(pg, hy - 6);
  const hand = (x, y, len, w, c, label) => {
    pg.add(`<path d="M${x} ${y - w / 2} H${x + len - w * 1.6} L${x + len - w * 1.6} ${y - w * 1.1} L${x + len} ${y} L${x + len - w * 1.6} ${y + w * 1.1} L${x + len - w * 1.6} ${y + w / 2} H${x} A${w / 2} ${w / 2} 0 0 1 ${x} ${y - w / 2} Z" fill="${c}" stroke="${INK}" stroke-width="0.7" stroke-linejoin="round"/>`);
    pg.add(`<circle cx="${x + 3}" cy="${y}" r="1.6" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`);
    pg.add(`<text x="${x}" y="${y + w + 5}" font-family="${FONT}" font-weight="800" font-size="3.8" fill="${SOFT}">${label}</text>`);
  };
  hand(pg.left + 10, hy + 8, R * 0.62, 6, '#ffd6e4', 'hour hand (short)');
  hand(pg.left + 10, hy + 26, R * 0.9, 5, '#d6e6ff', 'minute hand (long)');
  pg.add(`<text x="${pg.right}" y="${hy + 14}" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="3.8" fill="${SOFT}">Tip: glue the clock onto card</text><text x="${pg.right}" y="${hy + 20}" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="3.8" fill="${SOFT}">so it lasts longer.</text>`);
  return [pg.svg()];
}

// ================================================================ snakes and ladders
function makeSnakes(o, paper) {
  const rand = rng(+o.seed || 1);
  const pages = [];
  const pg = new Page(paper, 'Snakes and ladders', { subtitle: 'Roll the dice and move your counter. Climb up the ladders, slide down the snakes. First to 100 wins!', noName: true });
  const cell = Math.min(pg.width, pg.room - 2) / 10;
  const gx = pg.left + (pg.width - cell * 10) / 2, gy = pg.y;
  const pos = (n) => {
    const r = Math.floor((n - 1) / 10), c = (n - 1) % 10, col = r % 2 === 0 ? c : 9 - c;
    return [gx + col * cell + cell / 2, gy + (9 - r) * cell + cell / 2];
  };
  for (let n = 1; n <= 100; n++) {
    const [x, y] = pos(n);
    const r = Math.floor((n - 1) / 10);
    pg.add(`<rect x="${x - cell / 2}" y="${y - cell / 2}" width="${cell}" height="${cell}" fill="${(n + r) % 2 ? TINTS[r % TINTS.length] : '#fff'}" stroke="#c9c3e3" stroke-width="0.3"/>`);
    pg.add(`<text x="${x - cell / 2 + 1.6}" y="${y - cell / 2 + 4.4}" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${SOFT}">${n}</text>`);
  }
  pg.add(`<text x="${pos(1)[0]}" y="${pos(1)[1] + 3}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="4.4" fill="#2e9d63">START</text>`);
  pg.add(pic(ART('medal'), pos(100)[0], pos(100)[1] + 1, cell * 0.6));
  // Pick ladders and snakes that do not share squares.
  const used = new Set([1, 100]);
  const pick = (lo, hi) => { let n; do { n = lo + Math.floor(rand() * (hi - lo + 1)); } while (used.has(n)); used.add(n); return n; };
  const ladders = [], snakes = [];
  for (let i = 0; i < 5; i++) { const a = pick(2, 70); let b; do { b = pick(Math.min(99, a + 9), Math.min(99, a + 24)); } while (Math.floor((b - 1) / 10) === Math.floor((a - 1) / 10)); ladders.push([a, b]); }
  for (let i = 0; i < 5; i++) { const h = pick(25, 98); let t; do { t = pick(Math.max(2, h - 24), Math.max(2, h - 9)); } while (Math.floor((t - 1) / 10) === Math.floor((h - 1) / 10)); snakes.push([h, t]); }
  ladders.forEach(([a, b]) => {
    const [x1, y1] = pos(a), [x2, y2] = pos(b);
    const len = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / len * 2.6, ny = (x2 - x1) / len * 2.6;
    let s = `<line x1="${x1 + nx}" y1="${y1 + ny}" x2="${x2 + nx}" y2="${y2 + ny}" stroke="#8d5524" stroke-width="1.6" stroke-linecap="round"/><line x1="${x1 - nx}" y1="${y1 - ny}" x2="${x2 - nx}" y2="${y2 - ny}" stroke="#8d5524" stroke-width="1.6" stroke-linecap="round"/>`;
    const rungs = Math.floor(len / 5);
    for (let k = 1; k < rungs; k++) { const t = k / rungs, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t; s += `<line x1="${x + nx}" y1="${y + ny}" x2="${x - nx}" y2="${y - ny}" stroke="#c28a4e" stroke-width="0.9"/>`; }
    pg.add(s);
  });
  snakes.forEach(([h, t], i) => {
    const [x1, y1] = pos(h), [x2, y2] = pos(t);
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len, wig = Math.min(12, len * 0.18);
    const d = `M${x1} ${y1} C${x1 + dx * 0.3 + nx * wig} ${y1 + dy * 0.3 + ny * wig} ${x1 + dx * 0.7 - nx * wig} ${y1 + dy * 0.7 - ny * wig} ${x2} ${y2}`;
    const col = [PALETTE[0], PALETTE[2], PALETTE[4], PALETTE[5], PALETTE[7]][i];
    pg.add(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="3.2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="0.6" stroke-dasharray="1 2.4" stroke-linecap="round"/>`);
    pg.add(`<ellipse cx="${x1}" cy="${y1}" rx="3.4" ry="2.8" fill="${col}" stroke="${INK}" stroke-width="0.6"/><circle cx="${x1 - 1.2}" cy="${y1 - 0.8}" r="0.7" fill="${INK}"/><circle cx="${x1 + 1.2}" cy="${y1 - 0.8}" r="0.7" fill="${INK}"/>`);
  });
  pages.push(pg.svg());
  if (o.extras !== false) {
    const p2 = new Page(paper, 'Dice and counters', { subtitle: 'Cut out the dice, fold along the lines and glue the tabs. Cut out a counter for each player.', noName: true });
    const s = 26, ox = p2.left + 20, oy = p2.y + 6;
    const pips = { 1: [[0.5, 0.5]], 2: [[0.28, 0.28], [0.72, 0.72]], 3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]], 4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]], 5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]], 6: [[0.28, 0.22], [0.72, 0.22], [0.28, 0.5], [0.72, 0.5], [0.28, 0.78], [0.72, 0.78]] };
    const net = [[1, 0, 1], [0, 1, 2], [1, 1, 3], [2, 1, 5], [3, 1, 4], [1, 2, 6]];
    net.forEach(([c, r, n]) => {
      const x = ox + c * s, y = oy + r * s;
      p2.add(`<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#fff" stroke="${INK}" stroke-width="0.7"/>`);
      pips[n].forEach(([px, py]) => p2.add(`<circle cx="${x + px * s}" cy="${y + py * s}" r="${s * 0.08}" fill="${INK}"/>`));
    });
    const tab = (x, y, w, h) => p2.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f4f1fb" stroke="${INK}" stroke-width="0.5" stroke-dasharray="2 1.4"/>`);
    tab(ox + s, oy - 8, s, 8); tab(ox - 8, oy + s, 8, s); tab(ox + 4 * s, oy + s, 8, s); tab(ox + s, oy + 3 * s, s, 8); tab(ox, oy + s - 8, s, 8); tab(ox + 2 * s, oy + s - 8, s, 8);
    p2.add(`<text x="${ox + 2 * s + 30}" y="${oy + 8}" font-family="${FONT}" font-weight="700" font-size="4" fill="${SOFT}">Fold on the lines. Glue the grey tabs inside.</text>`);
    const cy2 = oy + 3 * s + 30;
    ['lion', 'monkey', 'pig', 'turtle', 'chick', 'octopus'].forEach((a, i) => {
      const x = p2.left + 18 + i * 30, y = cy2;
      p2.add(`<circle cx="${x}" cy="${y}" r="12" fill="${TINTS[i]}" stroke="${PALETTE[i]}" stroke-width="1"/><circle cx="${x}" cy="${y}" r="13.5" fill="none" stroke="#b9b3d6" stroke-width="0.4" stroke-dasharray="2 1.4"/>`);
      p2.add(pic(ART(a), x, y, 18));
    });
    pages.push(p2.svg());
  }
  return pages;
}

Object.assign(MAKERS, { hundred: makeHundred, abcorder: makeAbcOrder, colourwords: makeColourWords, howtodraw: makeHowToDraw, sentences: makeSentences, bookmarks: makeBookmarks, clockcraft: makeClockCraft, snakes: makeSnakes });
