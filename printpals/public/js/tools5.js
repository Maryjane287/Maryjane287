// PrintPals batch 4: joined handwriting, alphabets in other languages, word families,
// rhyming, number lines, fractions, colour by number and spot the difference.

// ================================================================ joined handwriting
const JOINED_PRESETS = {
  joins: 'an in un en on\nat it ut et ot\nch sh th wh\nee oo ll ff\ning ang ong ung\nai ay oi oy\nou ow er ir',
  words: 'door floor because find\nkind mind child children\nclimb most only both\nold cold gold told\nevery great pretty after\nfast last father class\nwater again half money',
  sentences: 'The sun is hot today.\nI like to read books.\nWe went to the park.\nMy cat is soft and fluffy.\nCan you jump up high?\nI love my family!',
};

(function fillJoined() {
  const form = typeof document !== 'undefined' && document.querySelector('#maker[data-tool=joined]');
  if (!form) return;
  const pre = form.querySelector('[name=preset]'), box = form.querySelector('[name=text]');
  const fill = () => { if (JOINED_PRESETS[pre.value]) box.value = JOINED_PRESETS[pre.value]; };
  pre.addEventListener('change', fill);
  if (!box.value.trim()) fill();
})();

function makeJoined(o, paper) {
  const lines = String(o.text || '').split('\n').map((l) => l.trim().replace(/\s+/g, ' ')).filter((l) => cleanText(l).trim()).slice(0, 30);
  if (!lines.length) lines.push(...JOINED_PRESETS.joins.split('\n'));
  const want = { big: 17, medium: 13, small: 10 }[o.size] || 13;
  const pages = [];
  let pg = null;
  const newPage = () => { if (pg) pages.push(pg.svg()); pg = new Page(paper, 'Joined handwriting', { subtitle: 'Start at the green dot. Keep your pencil on the paper as you join the letters.' }); };
  for (const line of lines) {
    const w = cursiveWidth(line);
    const size = Math.max(7, Math.min(want, ((pg ? pg.width : 184) - 8) / (w / 100)));
    const rh = rowHeight(size);
    const rows = o.rows === 'more' ? 4 : 3;
    if (!pg || pg.room < rh * rows) newPage();
    const unit = (w / 100) * size;
    for (let r = 0; r < rows; r++) {
      pg.guides(pg.y, size);
      if (r < rows - 1 || o.blank === false) {
        let x = pg.left + size * 0.5, n = 0;
        while ((n === 0 || x + unit <= pg.right - 2) && n < 6) {
          pg.add(drawCursive(line, x, pg.y, size, r === 0 && n === 0 ? 'model' : 'trace', r === 0 && n === 0 && o.dots !== false));
          x += unit + size * 1.2; n++;
        }
      }
      pg.y += rh;
    }
    pg.y += 2;
  }
  pages.push(pg.svg());
  return pages;
}

// ================================================================ alphabets in other languages
const ALPHABETS = {
  spanish: { name: 'Spanish', native: 'Español', letters: 'A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z', special: 'Ñ' },
  french: { name: 'French', native: 'Français', letters: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z', extra: 'É È Ê À Â Ç Î Ô Û Ù Ë Ï', special: '' },
  german: { name: 'German', native: 'Deutsch', letters: 'A Ä B C D E F G H I J K L M N O Ö P Q R S ẞ T U Ü V W X Y Z', special: 'Ä Ö Ü ẞ' },
  italian: { name: 'Italian', native: 'Italiano', letters: 'A B C D E F G H I L M N O P Q R S T U V Z', special: '' },
  portuguese: { name: 'Portuguese', native: 'Português', letters: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z', extra: 'Á Â Ã À Ç É Ê Í Ó Ô Õ Ú', special: '' },
  swahili: { name: 'Swahili', native: 'Kiswahili', letters: 'A B CH D E F G H I J K L M N O P R S T U V W Y Z', extra: 'DH GH KH NG\' NY SH TH', special: 'CH' },
  yoruba: { name: 'Yoruba', native: 'Yorùbá', letters: 'A B D E Ẹ F G GB H I J K L M N O Ọ P R S Ṣ T U W Y', special: 'Ẹ GB Ọ Ṣ' },
  igbo: { name: 'Igbo', native: 'Igbo', letters: 'A B CH D E F G GB GH GW H I Ị J K KP KW L M N Ṅ NW NY O Ọ P R S SH T U Ụ V W Y Z', special: 'CH GB GH GW Ị KP KW Ṅ NW NY Ọ SH Ụ' },
  hausa: { name: 'Hausa', native: 'Hausa', letters: 'A B Ɓ C D Ɗ E F G H I J K Ƙ L M N O R S SH T TS U W Y Ƴ Z', special: 'Ɓ Ɗ Ƙ SH TS Ƴ' },
  twi: { name: 'Twi', native: 'Twi (Akan)', letters: 'A B D E Ɛ F G H I K L M N O Ɔ P R S T U W Y', special: 'Ɛ Ɔ' },
};
const LETTER_FONT = "'Baloo 2', Nunito, 'Noto Sans', 'Segoe UI', Arial, sans-serif";

function lowerOf(L) {
  if (L === 'ẞ') return 'ß';
  return L.toLowerCase();
}

function makeAlphabets(o, paper) {
  const lang = ALPHABETS[o.language] || ALPHABETS.spanish;
  const letters = lang.letters.split(' ');
  const special = new Set(lang.special.split(' ').filter(Boolean));
  const pages = [];
  if (o.chart !== false) {
    const pg = new Page(paper, `The ${lang.name} alphabet`, { subtitle: `${lang.native}: ${letters.length} letters.${special.size ? ' The starred letters are not in the English alphabet.' : ''}`, noName: true });
    const extraH = lang.extra ? 24 : 0;
    const cols = letters.length > 30 ? 6 : 5;
    const rows = Math.ceil(letters.length / cols);
    const cw = pg.width / cols, ch = Math.min(40, (pg.room - extraH - 4) / rows);
    letters.forEach((L, i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      const c = i % PALETTE.length;
      const sp = special.has(L);
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="6" fill="${sp ? '#fff6e0' : TINTS[c]}" stroke="${sp ? '#ffb938' : PALETTE[c]}" stroke-width="${sp ? 1 : 0.6}"/>`);
      const text = `${L.length > 1 ? L[0] + L.slice(1).toLowerCase() : L} ${lowerOf(L)}`;
      pg.add(`<text x="${x + cw / 2}" y="${y + ch * 0.64}" text-anchor="middle" font-family="${LETTER_FONT}" font-weight="800" font-size="${fitFont(text, ch * 0.42, cw - 8, 0.62).toFixed(2)}" fill="${sp ? '#e07b00' : INK}">${esc(text)}</text>`);
      if (sp) pg.add(`<path d="${starPath(x + cw - 7, y + 7, 3.2, 0.45)}" fill="#ffc93c"/>`);
    });
    if (lang.extra) {
      const y = pg.y + rows * ch + 4;
      pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${extraH - 4}" rx="6" fill="#fff" stroke="#d9d4ec" stroke-width="0.5"/>`);
      pg.add(`<text x="${pg.left + 5}" y="${y + 7}" font-family="${FONT}" font-weight="800" font-size="3.8" fill="${SOFT}">${lang.name === 'Swahili' ? 'Letter pairs that make one sound' : 'Letters with accents'}</text>`);
      pg.add(`<text x="${pg.left + 5}" y="${y + 16}" font-family="${LETTER_FONT}" font-weight="800" font-size="7" letter-spacing="1.5" fill="${INK}">${esc(lang.extra.split(' ').join('   '))}</text>`);
    }
    pages.push(pg.svg());
  }
  if (o.trace !== false) {
    let pg = null;
    const rowH = 30;
    letters.forEach((L, i) => {
      if (!pg || pg.room < rowH) {
        if (pg) pages.push(pg.svg());
        pg = new Page(paper, `Write the ${lang.name} letters`, { subtitle: 'Trace the letters, then write them on your own.' });
      }
      const y = pg.y;
      const size = 16;
      pg.guides(y + 4, size, pg.left, pg.right, false);
      const base = y + 4 + size;
      const pair = L.length > 1 ? `${L[0]}${L.slice(1).toLowerCase()} ${lowerOf(L)}` : `${L}${lowerOf(L)}`;
      const unit = (pair.length + 0.4) * size * 0.62;
      let x = pg.left + 2, n = 0;
      while (x + unit < pg.right && n < 5) {
        pg.add(`<text x="${x}" y="${base}" font-family="${LETTER_FONT}" font-weight="700" font-size="${size * 1.32}" ${n === 0 ? `fill="${INK}"` : 'fill="none" stroke="#9a93b8" stroke-width="0.35" stroke-dasharray="0.9 0.9"'}>${esc(pair)}</text>`);
        x += unit + 6; n++;
      }
      pg.y += rowH;
    });
    pages.push(pg.svg());
  }
  if (!pages.length) pages.push(new Page(paper, lang.name, { subtitle: 'Tick at least one page.', noName: true }).svg());
  return pages;
}

// ================================================================ word families
const FAMILIES = {
  at: [['cat', 'img/cat.webp'], ['hat', 'img/hat.webp'], ['bat', '🦇'], ['rat', '🐀'], ['mat', ''], ['sat', '']],
  an: [['fan', '🪭'], ['van', '🚐'], ['pan', '🍳'], ['man', '👨'], ['can', '🥫'], ['ran', '']],
  ig: [['pig', 'img/pig.webp'], ['wig', ''], ['dig', '⛏️'], ['big', ''], ['fig', ''], ['jig', '']],
  op: [['mop', '🧹'], ['top', ''], ['hop', '🐇'], ['pop', 'img/popper.webp'], ['shop', '🏪'], ['stop', '🛑']],
  ug: [['bug', '🐛'], ['mug', '☕'], ['rug', ''], ['hug', '🤗'], ['jug', '🏺'], ['slug', '🐌']],
  en: [['hen', '🐔'], ['pen', '🖊️'], ['ten', '🔟'], ['men', ''], ['den', ''], ['Ben', '']],
  ot: [['pot', '🍲'], ['dot', ''], ['hot', '🔥'], ['cot', '🛏️'], ['not', ''], ['lot', '']],
  ing: [['king', '🤴'], ['ring', '💍'], ['sing', '🎤'], ['wing', '🪽'], ['swing', ''], ['thing', '']],
  ake: [['cake', 'img/cake.webp'], ['snake', '🐍'], ['lake', '🏞️'], ['rake', ''], ['bake', ''], ['make', '']],
  ell: [['bell', '🔔'], ['shell', '🐚'], ['well', ''], ['smell', '👃'], ['yell', ''], ['spell', '']],
};

function makeFamilies(o, paper) {
  const rand = rng(+o.seed || 1);
  const keys = o.family === 'all' ? Object.keys(FAMILIES) : [FAMILIES[o.family] ? o.family : 'at'];
  return keys.map((fam, fi) => {
    const words = FAMILIES[fam];
    const c = fi % PALETTE.length;
    const pg = new Page(paper, `The -${fam} family`, { subtitle: `Every word in this house ends with -${fam}. Write the first letter in each box.` });
    // The house
    const hx = pg.left + 10, hw = pg.width - 20, roofH = 34;
    const y0 = pg.y;
    pg.add(`<path d="M${hx - 6} ${y0 + roofH} L${hx + hw / 2} ${y0} L${hx + hw + 6} ${y0 + roofH} Z" fill="${PALETTE[c]}"/>`);
    pg.add(`<text x="${hx + hw / 2}" y="${y0 + roofH - 8}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="16" fill="#fff">-${fam}</text>`);
    const bodyH = 128;
    pg.add(`<rect x="${hx}" y="${y0 + roofH}" width="${hw}" height="${bodyH}" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="1"/>`);
    const cols = 2, rows = 3, ww = (hw - 18) / cols, wh = (bodyH - 16) / rows;
    words.forEach(([w, src], i) => {
      const x = hx + 6 + (i % cols) * (ww + 6), y = y0 + roofH + 5 + Math.floor(i / cols) * (wh + 3);
      pg.add(`<rect x="${x}" y="${y}" width="${ww}" height="${wh}" rx="4" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`);
      if (src) pg.add(pic(src, x + 16, y + wh / 2, Math.min(24, wh - 8)));
      else {
        // No picture yet: the child draws one.
        pg.add(`<rect x="${x + 4}" y="${y + 4}" width="24" height="${wh - 8}" rx="3" fill="#fff" stroke="#b9b3d6" stroke-width="0.45" stroke-dasharray="1.6 1.2"/><text x="${x + 16}" y="${y + wh / 2 + 1.4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.2" fill="${SOFT}">draw it</text>`);
      }
      const size = 11;
      const bx = x + 32;
      const first = w.length - fam.length;
      pg.add(`<rect x="${bx}" y="${y + wh / 2 - size * 0.7}" width="${size * 1.2 * first}" height="${size * 1.25}" rx="2" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
      pg.add(drawText(fam, bx + size * 1.2 * first + 3, y + wh / 2 - size * 0.62 - (fam === 'ake' || fam === 'ell' ? 0 : 0), size, 'model'));
    });
    pg.y = y0 + roofH + bodyH + 8;
    // Circle the family words
    const all = Object.entries(FAMILIES).filter(([f]) => f !== fam).flatMap(([, ws]) => ws.map(([w]) => w));
    const mix = shuffle([...shuffle(words.map(([w]) => w), rand).slice(0, 3), ...shuffle(all, rand).slice(0, 5)], rand);
    pg.add(`<text x="${pg.left}" y="${pg.y + 4}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">Draw a ring around the -${fam} words:</text>`);
    const cw = pg.width / mix.length;
    mix.forEach((w, i) => pg.add(`<text x="${pg.left + i * cw + cw / 2}" y="${pg.y + 15}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="6.5" fill="${INK}">${w}</text>`));
    pg.y += 24;
    pg.add(`<text x="${pg.left}" y="${pg.y + 4}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">Can you think of more -${fam} words? Write them here:</text>`);
    pg.y += 8;
    while (pg.room >= rowHeight(11)) { pg.guides(pg.y, 11, pg.left, pg.right, false); pg.y += rowHeight(11) * 0.9; }
    return pg.svg();
  });
}

// ================================================================ rhyming
const RHYMES = [
  [['cat', 'img/cat.webp'], ['hat', 'img/hat.webp']], [['dog', 'img/dog.webp'], ['log', '🪵']], [['bee', '🐝'], ['tree', '🌳']],
  [['star', 'img/star.webp'], ['car', '🚗']], [['cake', 'img/cake.webp'], ['snake', '🐍']], [['moon', '🌙'], ['spoon', '🥄']],
  [['fish', 'img/fish.webp'], ['dish', '🍽️']], [['goat', '🐐'], ['boat', '⛵']], [['bear', 'img/bear.webp'], ['chair', '🪑']],
  [['mouse', '🐭'], ['house', '🏠']], [['king', '🤴'], ['ring', '💍']], [['sock', '🧦'], ['clock', '⏰']],
  [['pen', '🖊️'], ['hen', '🐔']], [['fox', '🦊'], ['box', '📦']], [['nose', '👃'], ['rose', 'img/rose.webp']],
  [['bell', '🔔'], ['shell', '🐚']], [['whale', '🐋'], ['snail', '🐌']], [['kite', '🪁'], ['light', '💡']],
  [['ball', '⚽'], ['wall', '🧱']], [['tie', '👔'], ['pie', '🥧']],
];

function makeRhyming(o, paper) {
  const rand = rng(+o.seed || 1);
  const pairs = shuffle(RHYMES, rand);
  const kind = o.kind === 'circle' ? 'circle' : 'match';
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Rhyming: answers' : kind === 'match' ? 'Match the rhymes' : 'Which one rhymes?', { subtitle: answers ? 'Answer key for grown-ups.' : kind === 'match' ? 'Say each word. Draw a line to the picture that rhymes.' : 'Say the first word, then draw a ring around the picture that rhymes with it.', noName: answers });
    if (kind === 'match') {
      const n = 6, set = pairs.slice(0, n);
      const order = shuffle([...Array(n).keys()], rand);
      const rowH = (pg.room - 4) / n, colW = 64;
      const lx = pg.left + 4, rx = pg.right - colW - 4;
      const cell = ([w, src], x, y, c) => {
        pg.add(`<rect x="${x}" y="${y + 3}" width="${colW}" height="${rowH - 6}" rx="7" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
        pg.add(pic(src, x + 18, y + rowH / 2, Math.min(28, rowH - 12)));
        pg.add(`<text x="${x + 36}" y="${y + rowH / 2 + 2.4}" font-family="${TITLE_FONT}" font-weight="800" font-size="7" fill="${INK}">${w}</text>`);
      };
      set.forEach(([a], i) => cell(a, lx, pg.y + i * rowH, i % PALETTE.length));
      order.forEach((pi, j) => cell(set[pi][1], rx, pg.y + j * rowH, (pi + 3) % PALETTE.length));
      for (let i = 0; i < n; i++) pg.add(`<circle cx="${lx + colW + 4}" cy="${pg.y + i * rowH + rowH / 2}" r="1.6" fill="${INK}"/><circle cx="${rx - 4}" cy="${pg.y + i * rowH + rowH / 2}" r="1.6" fill="${INK}"/>`);
      if (answers) set.forEach((_, i) => { const j = order.indexOf(i); pg.add(`<line x1="${lx + colW + 4}" y1="${pg.y + i * rowH + rowH / 2}" x2="${rx - 4}" y2="${pg.y + j * rowH + rowH / 2}" stroke="#e0457b" stroke-width="0.8"/>`); });
    } else {
      const n = 6, rowH = (pg.room - 4) / n;
      pairs.slice(0, n).forEach(([a, b], i) => {
        const y = pg.y + i * rowH, c = i % PALETTE.length;
        const wrong = shuffle(pairs.filter((p) => p[0] !== a).flat().filter(([w]) => w !== b[0]), rand).slice(0, 2);
        const opts = shuffle([b, ...wrong], rand);
        pg.add(`<rect x="${pg.left}" y="${y + 2}" width="${pg.width}" height="${rowH - 4}" rx="7" fill="${TINTS[c]}"/>`);
        pg.add(pic(a[1], pg.left + 18, y + rowH / 2 - 3, Math.min(26, rowH - 16)));
        pg.add(`<text x="${pg.left + 18}" y="${y + rowH - 6}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="${INK}">${a[0]}</text>`);
        pg.add(`<text x="${pg.left + 40}" y="${y + rowH / 2 + 2}" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="${PALETTE[c]}">→</text>`);
        const ow = (pg.width - 56) / 3;
        opts.forEach(([w, src], k) => {
          const cx = pg.left + 54 + k * ow + ow / 2;
          if (answers && w === b[0]) pg.add(`<circle cx="${cx}" cy="${y + rowH / 2 - 2}" r="${Math.min(ow, rowH) * 0.42}" fill="none" stroke="#e0457b" stroke-width="0.9"/>`);
          pg.add(pic(src, cx, y + rowH / 2 - 4, Math.min(24, rowH - 16)));
          pg.add(`<text x="${cx}" y="${y + rowH - 6}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${SOFT}">${w}</text>`);
        });
      });
    }
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ number lines
function numberLine(pg, x, y, w, from, to, step, blanks, marks) {
  const n = Math.round((to - from) / step);
  const dx = w / n;
  pg.add(`<line x1="${x - 3}" x2="${x + w + 3}" y1="${y}" y2="${y}" stroke="${INK}" stroke-width="0.7"/>`);
  pg.add(`<path d="M${x + w + 5} ${y} l-3 -1.8 l0 3.6 Z M${x - 5} ${y} l3 -1.8 l0 3.6 Z" fill="${INK}"/>`);
  for (let i = 0; i <= n; i++) {
    const v = from + i * step, tx = x + i * dx;
    pg.add(`<line x1="${tx}" x2="${tx}" y1="${y - 2.2}" y2="${y + 2.2}" stroke="${INK}" stroke-width="0.5"/>`);
    if (blanks.has(v)) pg.add(`<rect x="${tx - 5}" y="${y + 3.6}" width="10" height="7.8" rx="1.6" fill="#fff" stroke="${marks && marks.answers ? '#e0457b' : '#9a93b8'}" stroke-width="0.45"/>` + (marks && marks.answers ? `<text x="${tx}" y="${y + 9.4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${n > 12 ? 4 : 5}" fill="#e0457b">${v}</text>` : ''));
    else pg.add(`<text x="${tx}" y="${y + 9.4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${n > 12 ? 4 : 5}" fill="${INK}">${v}</text>`);
  }
  return (v) => x + ((v - from) / step) * dx;
}

function makeNumberLines(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'missing';
  const range = +o.range || 10;
  const pages = [];
  const items = [];
  for (let i = 0; i < 8; i++) {
    if (kind === 'missing') {
      const step = range === 100 ? 10 : 1;
      const n = range === 100 ? 10 : range;
      const vals = [...Array(n + 1)].map((_, k) => k * step);
      const blanks = new Set(shuffle(vals, rand).slice(0, Math.max(3, Math.round(n / 3))));
      items.push({ blanks });
    } else {
      const max = range === 100 ? 20 : range;
      let a = 1 + Math.floor(rand() * (max - 2)), b = 1 + Math.floor(rand() * Math.min(6, max - a));
      if (kind === 'sub') { a = 3 + Math.floor(rand() * (max - 3)); b = 1 + Math.floor(rand() * Math.min(6, a - 1)); }
      items.push({ a, b, max });
    }
  }
  const sub = { missing: 'Count along the line and fill in the missing numbers.', add: 'Start on the first number. Jump forward, then write the answer.', sub: 'Start on the first number. Jump back, then write the answer.' }[kind];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const title = { missing: 'Number lines: missing numbers', add: 'Adding on a number line', sub: 'Taking away on a number line' }[kind];
    const pg = new Page(paper, answers ? `${title}: answers` : title, { subtitle: answers ? 'Answer key for grown-ups.' : sub, noName: answers });
    const rowH = (pg.room - 2) / items.length;
    items.forEach((it, i) => {
      const y = pg.y + i * rowH;
      if (kind === 'missing') {
        const step = range === 100 ? 10 : 1;
        numberLine(pg, pg.left + 6, y + rowH * 0.45, pg.width - 12, 0, range, step, it.blanks, { answers });
      } else {
        const eq = `${it.a} ${kind === 'add' ? '+' : '−'} ${it.b} =`;
        const ans = kind === 'add' ? it.a + it.b : it.a - it.b;
        pg.add(`<text x="${pg.left}" y="${y + 7}" font-family="${TITLE_FONT}" font-weight="800" font-size="6.5" fill="${INK}">${eq}</text>`);
        pg.add(`<rect x="${pg.left + eq.length * 3.4 + 2}" y="${y + 1.5}" width="11" height="7.5" rx="1.6" fill="#fff" stroke="${answers ? '#e0457b' : '#9a93b8'}" stroke-width="0.5"/>`);
        if (answers) pg.add(`<text x="${pg.left + eq.length * 3.4 + 7.5}" y="${y + 7}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="#e0457b">${ans}</text>`);
        const at = numberLine(pg, pg.left + 6, y + rowH * 0.66, pg.width - 12, 0, it.max, 1, new Set(), null);
        pg.add(`<circle cx="${at(it.a)}" cy="${y + rowH * 0.66}" r="1.6" fill="#3fbf7f"/>`);
        if (answers) {
          const dir = kind === 'add' ? 1 : -1;
          for (let k = 0; k < it.b; k++) {
            const x1 = at(it.a + dir * k), x2 = at(it.a + dir * (k + 1)), yy = y + rowH * 0.66;
            pg.add(`<path d="M${x1} ${yy - 1.5} Q${(x1 + x2) / 2} ${yy - 9} ${x2} ${yy - 1.5}" fill="none" stroke="#e0457b" stroke-width="0.6"/>`);
          }
        }
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ fractions
const FRAC_LEVELS = { halves: [[1, 2]], quarters: [[1, 2], [1, 4], [2, 4], [3, 4]], thirds: [[1, 3], [2, 3]], mix: [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 8], [3, 8], [5, 8]] };

function fracText(pg, cx, y, n, d, fs, colour = INK) {
  pg.add(`<text x="${cx}" y="${y}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs}" fill="${colour}">${n}</text>`);
  pg.add(`<line x1="${cx - fs * 0.45}" x2="${cx + fs * 0.45}" y1="${y + fs * 0.25}" y2="${y + fs * 0.25}" stroke="${colour}" stroke-width="${fs * 0.08}"/>`);
  pg.add(`<text x="${cx}" y="${y + fs * 1.1}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs}" fill="${colour}">${d}</text>`);
}

function fracShape(pg, kind, cx, cy, r, d, shaded, colour, equal = true) {
  let s = '';
  const st = `stroke="${INK}" stroke-width="0.6"`;
  if (kind === 'circle') {
    for (let k = 0; k < d; k++) {
      const a1 = -Math.PI / 2 + (k * 2 * Math.PI) / d, a2 = -Math.PI / 2 + ((k + 1) * 2 * Math.PI) / d;
      const big = a2 - a1 > Math.PI ? 1 : 0;
      s += `<path d="M${cx} ${cy} L${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A${r} ${r} 0 ${big} 1 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)} Z" fill="${shaded.has(k) ? colour : '#fff'}" ${st}/>`;
    }
    if (d === 1) s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${shaded.has(0) ? colour : '#fff'}" ${st}/>`;
  } else {
    const w = kind === 'bar' ? r * 2.6 : r * 1.9, h = kind === 'bar' ? r * 0.9 : r * 1.9;
    const x0 = cx - w / 2, y0 = cy - h / 2;
    // unequal parts for "is it fair?"
    const cuts = [...Array(d + 1)].map((_, k) => (equal ? k / d : Math.min(1, Math.max(0, k / d + (k > 0 && k < d ? (k % 2 ? 0.17 : -0.12) : 0)))));
    for (let k = 0; k < d; k++) s += `<rect x="${x0 + cuts[k] * w}" y="${y0}" width="${(cuts[k + 1] - cuts[k]) * w}" height="${h}" fill="${shaded.has(k) ? colour : '#fff'}" ${st}/>`;
  }
  pg.add(s);
}

function makeFractions(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'colour';
  const fr = FRAC_LEVELS[o.level] || FRAC_LEVELS.quarters;
  const items = [];
  for (let i = 0; i < 12; i++) {
    const [n, d] = fr[Math.floor(rand() * fr.length)];
    const shape = ['circle', 'square', 'bar'][Math.floor(rand() * 3)];
    const equal = kind !== 'fair' || rand() < 0.5;
    items.push({ n, d, shape: kind === 'fair' ? (rand() < 0.5 ? 'square' : 'bar') : shape, equal, set: [4, 6, 8, 12].filter((m) => m % d === 0)[Math.floor(rand() * 2)] || d * 2, art: ['apple', 'strawberry', 'star', 'cupcake', 'orange', 'heart', 'chick', 'cookie'][i % 8] });
  }
  const titles = { colour: 'Colour the fraction', name: 'What fraction is shaded?', fair: 'Equal parts or not?', set: 'Fractions of a group' };
  const subs = { colour: 'Colour in the fraction shown under each shape.', name: 'Count the shaded parts and the parts in all. Write the fraction.', fair: 'Is each shape cut into equal parts? Tick yes or no.', set: 'Colour or ring the right number of pictures.' };
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? `${titles[kind]}: answers` : titles[kind], { subtitle: answers ? 'Answer key for grown-ups.' : subs[kind], noName: answers });
    const cols = 3, rows = 4, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    items.forEach((it, i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      const c = PALETTE[i % PALETTE.length];
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="6" fill="#fff" stroke="#e3def3" stroke-width="0.5"/>`);
      const r = Math.min(cw, ch) * 0.3, cx = x + cw / 2, cy = y + ch * 0.42;
      if (kind === 'set') {
        const m = it.set, want = (m / it.d) * it.n;
        const colsA = Math.min(6, m), rowsA = Math.ceil(m / colsA), s = Math.min((cw - 10) / colsA, (ch * 0.55) / rowsA);
        for (let k = 0; k < m; k++) {
          const px = cx - ((colsA - 1) * s) / 2 + (k % colsA) * s, py = y + 8 + s / 2 + Math.floor(k / colsA) * s;
          if (answers && k < want) pg.add(`<circle cx="${px}" cy="${py}" r="${s * 0.5}" fill="#ffe0ea"/>`);
          pg.add(pic(ART(it.art), px, py, s * 0.86));
        }
        pg.add(`<text x="${cx - 6}" y="${y + ch - 9}" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="4.4" fill="${INK}">Colour</text>`);
        fracText(pg, cx + 2, y + ch - 13, it.n, it.d, 5.2);
        pg.add(`<text x="${cx + 8}" y="${y + ch - 9}" font-family="${FONT}" font-weight="800" font-size="4.4" fill="${INK}">of them</text>`);
        return;
      }
      const shaded = new Set();
      if (kind === 'name' || answers) for (let k = 0; k < it.n; k++) shaded.add(k);
      if (kind === 'fair') shaded.clear();
      fracShape(pg, it.shape, cx, cy, r, it.d, shaded, kind === 'name' ? '#8ecbff' : '#ffc6d9', it.equal);
      if (kind === 'colour') fracText(pg, cx, y + ch - 12, it.n, it.d, 6);
      else if (kind === 'name') {
        if (answers) fracText(pg, cx, y + ch - 12, it.n, it.d, 6, '#e0457b');
        else pg.add(`<rect x="${cx - 6}" y="${y + ch - 20}" width="12" height="16" rx="2" fill="#fff" stroke="#9a93b8" stroke-width="0.5"/><line x1="${cx - 4}" x2="${cx + 4}" y1="${y + ch - 12}" y2="${y + ch - 12}" stroke="#9a93b8" stroke-width="0.5"/>`);
      } else {
        ['yes', 'no'].forEach((t, k) => {
          const bx = cx - 18 + k * 20;
          const tick = answers && ((t === 'yes') === it.equal);
          pg.add(`<rect x="${bx}" y="${y + ch - 13}" width="5" height="5" rx="1" fill="${tick ? '#e0457b' : '#fff'}" stroke="${INK}" stroke-width="0.5"/><text x="${bx + 7}" y="${y + ch - 9}" font-family="${FONT}" font-weight="800" font-size="4.4" fill="${INK}">${t}</text>`);
        });
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ colour by number
const PIXEL = {
  heart: { name: 'a heart', colours: { '.': ['light blue', '#cfe8ff'], R: ['red', '#ff4d6d'], P: ['pink', '#ffb3c6'] },
    rows: ['............', '..RR....RR..', '.RPRR..RRRR.', 'RPRRRRRRRRRR', 'RRRRRRRRRRRR', 'RRRRRRRRRRRR', '.RRRRRRRRRR.', '..RRRRRRRR..', '...RRRRRR...', '....RRRR....', '.....RR.....', '............'] },
  apple: { name: 'an apple', colours: { '.': ['yellow', '#fff3b0'], R: ['red', '#ff4d4d'], G: ['green', '#4caf50'], B: ['brown', '#8d5524'], P: ['pink', '#ffb3b3'] },
    rows: ['......B.....', '......BGG...', '.....BGGG...', '..RRRRRRRR..', '.RRRRRRRRRR.', 'RRPRRRRRRRRR', 'RRPRRRRRRRRR', 'RRRRRRRRRRRR', 'RRRRRRRRRRRR', '.RRRRRRRRRR.', '..RRRRRRRR..', '...RR..RR...'] },
  house: { name: 'a house', colours: { '.': ['light blue', '#cfe8ff'], R: ['red', '#ff4d4d'], Y: ['yellow', '#ffd23f'], B: ['brown', '#8d5524'], W: ['blue', '#3a86ff'], G: ['green', '#4caf50'] },
    rows: ['.....RR.....', '....RRRR....', '...RRRRRR...', '..RRRRRRRR..', '.RRRRRRRRRR.', 'RRRRRRRRRRRR', '.YYYYYYYYYY.', '.YWWYYYYWWY.', '.YWWYBBYWWY.', '.YYYYBBYYYY.', '.YYYYBBYYYY.', 'GGGGGGGGGGGG'] },
  fish: { name: 'a fish', colours: { '.': ['blue', '#8ecbff'], O: ['orange', '#ff9f1c'], K: ['black', '#2d2350'], Y: ['yellow', '#ffd23f'] },
    rows: ['............', '............', '...OOOO...O.', '..OOYOOO.OO.', '.OKOYOYOOOO.', 'OOOOYOYOOOO.', 'OOOOYOYOOOO.', '.OOOYOYOOOO.', '..OOYOOO.OO.', '...OOOO...O.', '............', '............'] },
  flower: { name: 'a flower', colours: { '.': ['light blue', '#cfe8ff'], P: ['pink', '#ff70a6'], Y: ['yellow', '#ffd23f'], G: ['green', '#4caf50'] },
    rows: ['....PPPP....', '...PPPPPP...', '..PPPYYPPP..', '..PPYYYYPP..', '..PPYYYYPP..', '..PPPYYPPP..', '...PPPPPP...', '....PPPP....', '.....GG.....', '..GG.GG.....', '...GGGG.GG..', '.....GGGG...'] },
  star: { name: 'a star', colours: { '.': ['dark blue', '#3a3f8f'], Y: ['yellow', '#ffd23f'], O: ['orange', '#ff9f1c'] },
    rows: ['.....YY.....', '.....YY.....', '....YYYY....', '....YOOY....', 'YYYYYOOYYYYY', '.YYYYYYYYYY.', '..YYYYYYYY..', '...YYYYYY...', '..YYYYYYYY..', '..YYY..YYY..', '.YYY....YYY.', '.YY......YY.'] },
  butterfly: { name: 'a butterfly', colours: { '.': ['light blue', '#cfe8ff'], P: ['purple', '#b06cff'], Y: ['yellow', '#ffd23f'], K: ['black', '#2d2350'] },
    rows: ['............', '.PP......PP.', 'PPPP....PPPP', 'PPYPP..PPYPP', 'PPPPPKKPPPPP', '.PPPPKKPPPP.', '..PPPKKPPP..', '.PPPPKKPPPP.', 'PPYPPKKPPYPP', 'PPPP.KK.PPPP', '.PP......PP.', '............'] },
  tree: { name: 'an apple tree', colours: { '.': ['light blue', '#cfe8ff'], G: ['green', '#3fbf60'], R: ['red', '#ff4d4d'], B: ['brown', '#8d5524'], L: ['light green', '#b6e3a8'] },
    rows: ['....GGGG....', '..GGGGGGGG..', '.GGGGRGGGGG.', '.GGGGGGGRGG.', 'GGRGGGGGGGGG', '.GGGGGGGGGG.', '..GGGGRGGG..', '.....BB.....', '.....BB.....', '.....BB.....', '....BBBB....', 'LLLLLLLLLLLL'] },
  rocket: { name: 'a rocket', colours: { '.': ['dark blue', '#3a3f8f'], W: ['white', '#ffffff'], R: ['red', '#ff4d4d'], B: ['light blue', '#8ecbff'], O: ['orange', '#ff9f1c'] },
    rows: ['.....RR.....', '....RWWR....', '....WWWW....', '....WBBW....', '....WBBW....', '....WWWW....', '...RWWWWR...', '..RRWWWWRR..', '..RR.OO.RR..', '.....OO.....', '....O..O....', '............'] },
  duck: { name: 'a duck', colours: { '.': ['light blue', '#cfe8ff'], Y: ['yellow', '#ffd23f'], O: ['orange', '#ff9f1c'], K: ['black', '#2d2350'], B: ['blue', '#3a86ff'] },
    rows: ['............', '...YYY......', '..YYKYY.....', '..YYYYYOO...', '...YYY......', '..YYYYY.....', '.YYYYYYYYYY.', 'YYYYYYYYYYY.', 'YYYYYYYYYY..', '.YYYYYYYY...', 'BBBBBBBBBBBB', 'BBBBBBBBBBBB'] },
  cat: { name: 'a cat', colours: { '.': ['green', '#a5d6a7'], O: ['orange', '#ff9f1c'], K: ['black', '#2d2350'], P: ['pink', '#ff8fab'] },
    rows: ['.O........O.', '.OO......OO.', '.OOOOOOOOOO.', 'OOOOOOOOOOOO', 'OOKKOOOOKKOO', 'OOKKOOOOKKOO', 'OOOOOPPOOOOO', 'OOOOOOOOOOOO', '.OOOKOOKOOO.', '..OOOKKOOO..', '...OOOOOO...', '............'] },
  rainbow: { name: 'a rainbow', colours: { '.': ['light blue', '#cfe8ff'], R: ['red', '#ff4d4d'], O: ['orange', '#ff9f1c'], Y: ['yellow', '#ffd23f'], G: ['green', '#4caf50'], B: ['blue', '#3a86ff'], W: ['white', '#ffffff'] },
    rows: ['............', '...RRRRRR...', '..RROOOORR..', '.RROYYYYORR.', '.ROYGGGGYOR.', 'ROYGBBBBGYOR', 'ROYGB..BGYOR', 'ROYGB..BGYOR', 'WWWGB..BGWWW', 'WWWWW..WWWWW', '............', '............'] },
};

function makeColourByNumber(o, paper) {
  const rand = rng(+o.seed || 1);
  const key = PIXEL[o.picture] ? o.picture : Object.keys(PIXEL)[Math.floor(rand() * Object.keys(PIXEL).length)];
  const art = PIXEL[key];
  const chars = Object.keys(art.colours);
  const num = Object.fromEntries(chars.map((c, i) => [c, i + 1]));
  const mode = o.mode || 'numbers';
  const label = (n) => {
    if (mode === 'add') { const a = Math.floor(rand() * (n + 1)); return `${a}+${n - a}`; }
    if (mode === 'sub') { const b = 1 + Math.floor(rand() * 5); return `${n + b}−${b}`; }
    return String(n);
  };
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Colour by number: answer' : mode === 'numbers' ? 'Colour by number' : 'Colour by sums', { subtitle: answers ? `It is ${art.name}!` : mode === 'numbers' ? 'Colour each square with the colour for its number. What picture appears?' : 'Work out each sum. Colour the square with the colour for the answer.', noName: answers });
    // Colour key
    const kw = pg.width / Math.min(chars.length, 7);
    chars.forEach((c, i) => {
      const x = pg.left + (i % 7) * kw, y = pg.y + Math.floor(i / 7) * 10;
      pg.add(`<rect x="${x}" y="${y}" width="8" height="8" rx="2" fill="${art.colours[c][1]}" stroke="${INK}" stroke-width="0.4"/>`);
      pg.add(`<text x="${x + 10}" y="${y + 5.8}" font-family="${FONT}" font-weight="800" font-size="4.2" fill="${INK}">${num[c]} = ${art.colours[c][0]}</text>`);
    });
    pg.y += Math.ceil(chars.length / 7) * 10 + 4;
    const R = art.rows.length, C = art.rows[0].length;
    const cell = Math.min(pg.width / C, (pg.room - 2) / R);
    const gx = pg.left + (pg.width - cell * C) / 2;
    art.rows.forEach((row, r) => row.split('').forEach((ch, q) => {
      const x = gx + q * cell, y = pg.y + r * cell;
      pg.add(`<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${answers ? art.colours[ch][1] : '#fff'}" stroke="#9a93b8" stroke-width="0.35"/>`);
      if (!answers) {
        const t = label(num[ch]);
        pg.add(`<text x="${x + cell / 2}" y="${y + cell / 2 + (t.length > 2 ? 1.3 : 1.8)}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${t.length > 2 ? Math.min(3.8, cell * 0.26) : Math.min(5.5, cell * 0.36)}" fill="${INK}">${t}</text>`);
      }
    }));
    pg.add(`<rect x="${gx}" y="${pg.y}" width="${cell * C}" height="${cell * R}" fill="none" stroke="${INK}" stroke-width="0.8"/>`);
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ spot the difference
function sceneItems(rand) {
  const pool = shuffle(PAINTED.filter(([n]) => !['Rainbow', 'Sun', 'Nest'].includes(n)), rand);
  const slots = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) slots.push([0.1 + c * 0.2 + (rand() - 0.5) * 0.06, 0.52 + r * 0.26 + (rand() - 0.5) * 0.05]);
  const mixed = shuffle(slots, rand);
  const items = mixed.slice(0, 7).map(([x, y], i) => ({ x, y, s: 0.14 + rand() * 0.05, src: pool[i][1], flip: false }));
  items.free = mixed.slice(7);
  return items;
}

function drawScene(pg, x, y, w, h, sc, id) {
  pg.add(`<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/></clipPath></defs>`);
  let s = `<g clip-path="url(#${id})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#dff1ff"/>`;
  s += `<path d="M${x} ${y + h * 0.42} Q${x + w * 0.3} ${y + h * 0.34} ${x + w * 0.6} ${y + h * 0.42} T${x + w} ${y + h * 0.4} L${x + w} ${y + h} L${x} ${y + h} Z" fill="#c8ecb4"/>`;
  if (sc.sun) s += `<image href="img/sun.webp" x="${x + w * 0.8}" y="${y + h * 0.03}" width="${h * 0.24}" height="${h * 0.24}"/>`;
  sc.clouds.forEach(([cx, cy]) => { s += `<g fill="#fff"><ellipse cx="${x + cx * w}" cy="${y + cy * h}" rx="${w * 0.06}" ry="${h * 0.045}"/><ellipse cx="${x + cx * w + w * 0.04}" cy="${y + cy * h - h * 0.03}" rx="${w * 0.045}" ry="${h * 0.045}"/></g>`; });
  if (sc.rainbow) s += `<image href="img/rainbow.webp" x="${x + w * 0.03}" y="${y + h * 0.02}" width="${h * 0.3}" height="${h * 0.3}"/>`;
  sc.items.forEach((it) => {
    const size = it.s * w, ix = x + it.x * w - size / 2, iy = y + it.y * h - size / 2;
    s += it.flip ? `<image href="${it.src}" x="${-(ix + size)}" y="${iy}" width="${size}" height="${size}" transform="scale(-1 1)"/>` : `<image href="${it.src}" x="${ix}" y="${iy}" width="${size}" height="${size}"/>`;
  });
  s += `</g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="${INK}" stroke-width="0.8"/>`;
  pg.add(s);
}

function makeSpotDiff(o, paper) {
  const rand = rng(+o.seed || 1);
  const k = { easy: 3, medium: 5, hard: 7 }[o.level] || 5;
  const a = { items: sceneItems(rand), sun: true, rainbow: rand() < 0.5, clouds: [[0.3, 0.12], [0.55, 0.2]] };
  const free = a.items.free;
  const b = JSON.parse(JSON.stringify(a));
  const spots = [];
  const kinds = shuffle(['remove', 'swap', 'grow', 'add', 'remove', 'swap', 'shrink', 'add'], rand);
  const order = shuffle([...b.items.keys()], rand);
  const unused = shuffle(PAINTED.filter(([, s]) => !a.items.some((it) => it.src === s) && !/sun|rainbow|nest/.test(s)), rand);
  const skyDiffs = shuffle(['sun', 'cloud'], rand);
  for (let i = 0; i < k; i++) {
    if (i >= k - 1 && skyDiffs.length && rand() < 0.6) {
      const d = skyDiffs.pop();
      if (d === 'sun') { b.sun = false; spots.push([0.8 + 0.12 * 0.5, 0.15]); }
      else { b.clouds.pop(); spots.push([0.57, 0.18]); }
      continue;
    }
    const kind = kinds[i];
    if (kind === 'add' && free.length) {
      // Something new appears in an empty spot.
      const [x, y] = free.pop();
      b.items.push({ x, y, s: 0.16, src: unused.pop()[1], flip: false });
      spots.push([x, y]);
      continue;
    }
    const it = b.items[order[i]];
    if (kind === 'remove') it.src = null;
    else if (kind === 'swap' || kind === 'add') it.src = unused.pop()[1];
    else if (kind === 'grow') it.s *= 1.5;
    else it.s *= 0.6;
    spots.push([it.x, it.y]);
  }
  b.items = b.items.filter((it) => it.src);
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Spot the difference: answers' : 'Spot the difference', { subtitle: answers ? 'The differences are circled.' : `Can you find all ${k} differences? Circle them on the bottom picture.`, noName: answers });
    const h = (pg.room - 22) / 2, w = pg.width;
    drawScene(pg, pg.left, pg.y, w, h, a, `sa${answers ? 1 : 0}`);
    drawScene(pg, pg.left, pg.y + h + 6, w, h, b, `sb${answers ? 1 : 0}`);
    if (answers) spots.forEach(([sx, sy]) => pg.add(`<circle cx="${pg.left + sx * w}" cy="${pg.y + h + 6 + sy * h}" r="${w * 0.075}" fill="none" stroke="#e0457b" stroke-width="1.6" stroke-dasharray="3 1.2"/>`));
    const fy = pg.y + 2 * h + 12;
    pg.add(`<text x="${pg.left}" y="${fy + 3}" font-family="${FONT}" font-weight="800" font-size="4.8" fill="${INK}">I found:</text>`);
    for (let i = 0; i < k; i++) pg.add(`<path d="${starPath(pg.left + 26 + i * 10, fy + 1.5, 4, 0.46)}" fill="#fff" stroke="#ffb938" stroke-width="0.6" stroke-linejoin="round"/>`);
    pages.push(pg.svg());
  }
  return pages;
}

Object.assign(MAKERS, { joined: makeJoined, alphabets: makeAlphabets, families: makeFamilies, rhyming: makeRhyming, numberlines: makeNumberLines, fractions: makeFractions, colournum: makeColourByNumber, spotdiff: makeSpotDiff });
