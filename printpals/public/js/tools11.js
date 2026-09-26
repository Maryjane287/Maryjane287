// PrintPals batch 10: secret code, copy the picture, finger puppets, handprint keepsakes,
// height chart, days and months, my body, and domino maths.

const PINK = '#e0457b';
const blankBox = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2.5" fill="#fff" stroke="#9a93b8" stroke-width="0.5"/>`;

// ================================================================ secret code
const CODE_PICS = ['apple', 'balloon', 'banana', 'bear', 'cake', 'cat', 'chick', 'cookie', 'cupcake', 'daisy', 'dog', 'donut', 'egg', 'envelope', 'fish',
  'gorilla', 'hat', 'heart', 'ladybird', 'lion', 'lolly', 'medal', 'monkey', 'mushroom', 'nest', 'octopus', 'orange', 'pig', 'present', 'rainbow',
  'star', 'strawberry', 'sun', 'tulip', 'turtle', 'zebra', 'ant', 'blueberry', 'popper'];
const CODE_MESSAGES = ['YOU ARE AMAZING', 'I LOVE YOU', 'BE KIND TODAY', 'READ A BOOK', 'LETS GO PLAY', 'YOU CAN DO IT', 'GIVE ME A HUG', 'SMILE A LOT',
  'YOU ARE MY STAR', 'TIME FOR A SNACK', 'KEEP TRYING', 'WELL DONE'];
const ALPHA26 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function makeSecretCode(o, paper) {
  const rand = rng(+o.seed || 1);
  const code = o.code || 'pictures';
  const pics = shuffle(CODE_PICS, rand).slice(0, 26);
  const custom = listOf(o.custom, 4).map((m) => m.toUpperCase().replace(/[^A-Z ]/g, '').replace(/\s+/g, ' ').trim()).map((m) => (m.length > 40 ? m.slice(0, 41).replace(/\s+\S*$/, '') || m.slice(0, 40) : m)).filter(Boolean);
  const messages = custom.length ? custom : shuffle(CODE_MESSAGES, rand).slice(0, 4);
  const sym = (ch) => code === 'numbers' ? ALPHA26.indexOf(ch) + 1 : code === 'backwards' ? ALPHA26[25 - ALPHA26.indexOf(ch)] : pics[ALPHA26.indexOf(ch)];
  const drawSym = (pg, ch, cx, cy, s) => {
    const v = sym(ch);
    if (code === 'pictures') pg.add(pic(ART(v), cx, cy, s * 0.9));
    else pg.add(txt(cx, cy + s * 0.2, v, s * 0.56, { colour: code === 'numbers' ? '#3a64d8' : '#8a3fd1' }));
  };
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Secret code: answers' : 'Crack the secret code!', { subtitle: answers ? 'Answer key for grown-ups.' : 'Use the code key to find each letter. Write it on the line to read the secret message.', noName: answers });
    // The code key: two rows of 13.
    const kc = pg.width / 13, kh = kc * 1.5;
    pg.add(panel(pg.left - 1, pg.y - 1, pg.width + 2, kh * 2 + 4, '#fff6e0', '#ffb938', 5));
    for (let i = 0; i < 26; i++) {
      const x = pg.left + (i % 13) * kc, y = pg.y + 1 + Math.floor(i / 13) * kh;
      pg.add(`<rect x="${x + 0.6}" y="${y + 0.6}" width="${kc - 1.2}" height="${kh - 1.2}" rx="2" fill="#fff" stroke="#f1d9a0" stroke-width="0.4"/>`);
      pg.add(txt(x + kc / 2, y + 5.2, ALPHA26[i], 4.8, {}));
      drawSym(pg, ALPHA26[i], x + kc / 2, y + kh * 0.62, kc * 0.84);
    }
    pg.y += kh * 2 + 10;
    const maxCells = 16;
    const lines = [];
    messages.forEach((m) => {
      const rows = [];
      let row = '';
      m.split(' ').flatMap((w) => w.match(new RegExp(`.{1,${maxCells}}`, 'g'))).forEach((w) => { if (row && (row + ' ' + w).length > maxCells) { rows.push(row); row = w; } else row = row ? row + ' ' + w : w; });
      if (row) rows.push(row);
      lines.push(rows);
    });
    const total = lines.reduce((a, r) => a + r.length, 0);
    const cell = Math.min(16, (pg.width - 10) / maxCells, (pg.room - 22 - lines.length * 4) / (total * 1.9));
    const rowH = cell * 1.9;
    const gap = Math.max(4, (pg.room - 30 - total * rowH) / Math.max(1, lines.length));
    lines.forEach((rows, mi) => {
      pg.add(`<circle cx="${pg.left + 3}" cy="${pg.y + cell / 2}" r="3.2" fill="${PALETTE[mi % PALETTE.length]}"/>` + txt(pg.left + 3, pg.y + cell / 2 + 1.4, mi + 1, 3.8, { colour: '#fff' }));
      rows.forEach((r) => {
        const x0 = pg.left + 9 + (pg.width - 9 - r.length * cell) / 2;
        [...r].forEach((ch, k) => {
          if (ch === ' ') return;
          const x = x0 + k * cell;
          pg.add(`<rect x="${x + 0.5}" y="${pg.y}" width="${cell - 1}" height="${cell}" rx="2" fill="${TINTS[mi % TINTS.length]}"/>`);
          drawSym(pg, ch, x + cell / 2, pg.y + cell / 2, cell);
          pg.add(`<line x1="${x + 1.5}" x2="${x + cell - 1.5}" y1="${pg.y + cell * 1.72}" y2="${pg.y + cell * 1.72}" stroke="${INK}" stroke-width="0.45"/>`);
          if (answers) pg.add(txt(x + cell / 2, pg.y + cell * 1.6, ch, cell * 0.5, { colour: PINK }));
        });
        pg.y += rowH;
      });
      pg.y += gap;
    });
    const by = pg.bottom - 14;
    pg.add(panel(pg.left, by, pg.width, 13, '#f5edff', '#b06cff', 5));
    pg.add(txt(pg.left + 5, by + 8.2, 'Now write your own secret message in code for someone you love!', 4.4, { anchor: 'start', font: FONT, colour: '#8a3fd1' }));
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ copy the picture (grid drawing)
function makeGridCopy(o, paper) {
  const rand = rng(+o.seed || 1);
  const keys = Object.keys(PIXEL);
  const mirrorOk = (k) => PIXEL[k].rows.every((r) => r === [...r].reverse().join(''));
  const kind = o.kind || 'copy';
  const pool = kind === 'half' ? keys.filter(mirrorOk) : keys;
  const key = pool.includes(o.picture) ? o.picture : pool[Math.floor(rand() * pool.length)];
  const art = PIXEL[key], n = art.rows.length, m = art.rows[0].length;
  const labels = o.labels !== false;
  const colourOf = (ch) => (ch === '.' ? '#fff' : art.colours[ch][1]);
  const pg = new Page(paper, kind === 'half' ? 'Finish the other half' : 'Copy the picture', { subtitle: kind === 'half' ? `Colour the empty squares to match the other side. It makes ${art.name}!` : 'Look at the small picture. Copy it square by square into the big grid.' });
  const grid = (x, y, cell, fill, lab) => {
    for (let r = 0; r < n; r++) for (let c = 0; c < m; c++) {
      const ch = art.rows[r][c];
      pg.add(`<rect x="${x + c * cell}" y="${y + r * cell}" width="${cell}" height="${cell}" fill="${fill(r, c, ch)}" stroke="#b9b3d6" stroke-width="0.3"/>`);
    }
    pg.add(`<rect x="${x}" y="${y}" width="${cell * m}" height="${cell * n}" fill="none" stroke="${INK}" stroke-width="0.8"/>`);
    if (lab) {
      for (let c = 0; c < m; c++) pg.add(txt(x + c * cell + cell / 2, y - 1.6, ALPHA26[c], Math.min(4, cell * 0.45), { colour: SOFT, font: FONT }));
      for (let r = 0; r < n; r++) pg.add(txt(x - 2.4, y + r * cell + cell / 2 + 1.3, r + 1, Math.min(4, cell * 0.45), { colour: SOFT, font: FONT, anchor: 'end' }));
    }
  };
  if (kind === 'half') {
    const cell = Math.min((pg.width - 10) / m, (pg.room - 30) / n);
    const x = pg.left + (pg.width - cell * m) / 2 + 3, y = pg.y + 6;
    grid(x, y, cell, (r, c, ch) => (c < m / 2 ? colourOf(ch) : '#fff'), labels);
    pg.add(`<line x1="${x + cell * m / 2}" x2="${x + cell * m / 2}" y1="${y - 3}" y2="${y + cell * n + 3}" stroke="${PINK}" stroke-width="0.9" stroke-dasharray="2.4 1.6"/>`);
    const ky = y + cell * n + 8;
    Object.entries(art.colours).filter(([ch]) => ch !== '.').forEach(([, [nm, hex]], i) => {
      const kx = pg.left + 4 + i * 36;
      pg.add(`<rect x="${kx}" y="${ky}" width="7" height="7" rx="1.5" fill="${hex}" stroke="${INK}" stroke-width="0.4"/>` + txt(kx + 9, ky + 5.4, nm, 4, { anchor: 'start', font: FONT }));
    });
    return [pg.svg()];
  }
  const small = Math.min(5.2, (pg.width * 0.42) / m);
  const sx = pg.left + 6, sy = pg.y + 5;
  pg.add(panel(pg.left, pg.y, small * m + 12, small * n + 10, '#fff6e0', '#ffb938', 5));
  grid(sx, sy, small, (r, c, ch) => colourOf(ch), false);
  const tx = pg.left + small * m + 18;
  textLines(pg, wrap(`This is ${art.name}. Start at the top left and copy one square at a time. Count the squares to help you.`, 34), tx, pg.y + 9, 4.4, { weight: 700 });
  Object.entries(art.colours).filter(([ch]) => ch !== '.').forEach(([, [nm, hex]], i) => {
    const kx = tx + (i % 2) * 44, ky = pg.y + 30 + Math.floor(i / 2) * 9;
    pg.add(`<rect x="${kx}" y="${ky}" width="7" height="7" rx="1.5" fill="${hex}" stroke="${INK}" stroke-width="0.4"/>` + txt(kx + 9, ky + 5.4, nm, 4, { anchor: 'start', font: FONT }));
  });
  pg.y += small * n + 18;
  const cell = Math.min((pg.width - 10) / m, (pg.room - 4) / n);
  grid(pg.left + (pg.width - cell * m) / 2 + 3, pg.y, cell, () => '#fff', labels);
  return [pg.svg()];
}

// ================================================================ finger puppets
const PUPPET_LINE = ['cat', 'dog', 'bunny', 'owl', 'frog', 'penguin', 'bee', 'ladybird', 'unicorn', 'teddy', 'elephant', 'dino', 'octopus', 'whale', 'turtle', 'snail'];
const PUPPET_BRIGHT = ['lion', 'monkey', 'pig', 'zebra', 'gorilla', 'cat', 'dog', 'chick', 'turtle', 'octopus', 'fish', 'ladybird', 'bear', 'ant'];

function makePuppets(o, paper) {
  const rand = rng(+o.seed || 1);
  const bright = o.style === 'bright';
  const list = shuffle(bright ? PUPPET_BRIGHT : PUPPET_LINE, rand).slice(0, 9);
  const pg = new Page(paper, 'Finger puppets', { subtitle: 'Colour, cut out, then wrap the band around your finger and glue the tab. Put on a puppet show!' });
  const cw = pg.width / 3, ch = (pg.room - 2) / 3;
  list.forEach((a, i) => {
    const x = pg.left + (i % 3) * cw, y = pg.y + Math.floor(i / 3) * ch, cx = x + cw / 2, c = i % PALETTE.length;
    const bandW = Math.min(cw - 6, 54), bandH = 13, size = Math.min(cw - 14, ch - bandH - 12);
    const by = y + 3 + size - 2;
    // Band first so the picture sits on top of it.
    pg.add(`<rect x="${cx - bandW / 2}" y="${by}" width="${bandW}" height="${bandH}" rx="2" fill="${bright ? TINTS[c] : '#fff'}" stroke="${INK}" stroke-width="0.6"/>`);
    pg.add(`<rect x="${cx + bandW / 2 - 9}" y="${by}" width="9" height="${bandH}" fill="#f4f1fb" stroke="${INK}" stroke-width="0.5" stroke-dasharray="1.8 1.2"/>` + txt(cx + bandW / 2 - 4.5, by + bandH / 2 + 1.2, 'glue', 3, { colour: SOFT, font: FONT }));
    pg.add(`<circle cx="${cx}" cy="${y + 3 + size / 2}" r="${size / 2 + 1.5}" fill="${bright ? TINTS[c] : '#fff'}" stroke="#b9b3d6" stroke-width="0.4" stroke-dasharray="2 1.4"/>`);
    if (bright) pg.add(pic(ART(a), cx, y + 3 + size / 2, size * 0.96));
    else pg.add(`<g transform="translate(${cx - size / 2} ${y + 3}) scale(${(size / 200).toFixed(4)})">${colouringArt(a)}</g>`);
    const nm = bright ? a : (COLOURING[a] ? COLOURING[a].name : a);
    pg.add(txt(cx - 4, by + bandH - 3.4, nm, fitFont(nm, 4.8, bandW - 14), { colour: bright ? PALETTE[c] : INK }));
  });
  return [pg.svg()];
}

// ================================================================ handprint keepsakes
function handShape(cx, cy, s, flip, pad, colour) {
  // s = hand height. Palm, four fingers and a thumb, drawn in a 100 x 130 box; pad grows every part.
  const k = s / 130, X = (v) => cx + (flip ? -1 : 1) * (v - 50) * k, Y = (v) => cy + (v - 70) * k;
  const cap = (x1, y1, x2, y2, w) => `<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="${colour}" stroke-width="${w * k + pad}" stroke-linecap="round"/>`;
  return `<ellipse cx="${X(50)}" cy="${Y(88)}" rx="${30 * k + pad / 2}" ry="${34 * k + pad / 2}" fill="${colour}"/>`
    + cap(28, 70, 22, 22, 15) + cap(43, 64, 41, 10, 15.5) + cap(58, 64, 60, 12, 15) + cap(72, 70, 78, 32, 13.5) + cap(76, 100, 96, 80, 15);
}
function handOutline(cx, cy, s, flip, colour = '#b9b3d6') {
  // The same hand drawn slightly bigger in colour, then in white on top: only the outside edge shows.
  return handShape(cx, cy, s, flip, 1.4, colour) + handShape(cx, cy, s, flip, 0, '#fff');
}
function footOutline(cx, cy, s, flip, colour = '#b9b3d6') {
  const k = s / 120, X = (v) => cx + (flip ? -1 : 1) * (v - 40) * k, Y = (v) => cy + (v - 60) * k;
  const shapes = (f, st) => `<path d="M${X(22)} ${Y(40)} C${X(20)} ${Y(20)} ${X(62)} ${Y(18)} ${X(64)} ${Y(42)} C${X(66)} ${Y(70)} ${X(56)} ${Y(86)} ${X(56)} ${Y(104)} C${X(56)} ${Y(122)} ${X(26)} ${Y(122)} ${X(26)} ${Y(104)} C${X(26)} ${Y(84)} ${X(24)} ${Y(66)} ${X(22)} ${Y(40)} Z" fill="${f}" stroke="${st}" stroke-width="${st === '#fff' ? 0.1 : 2.2}"/>`
    + [[26, 12, 7.5], [38, 7, 6], [48, 8, 5.2], [56, 12, 4.6], [62, 19, 4]].map(([x, y, r]) => `<circle cx="${X(x)}" cy="${Y(y)}" r="${r * k}" fill="${f}" stroke="${st}" stroke-width="${st === '#fff' ? 0.1 : 2.2}"/>`).join('');
  return shapes(colour, colour) + shapes('#fff', '#fff');
}

const KEEPSAKES = {
  hands: { title: 'My little hands', poem: ['Here are my hands, so little and small,', 'they wave and they clap and they catch a ball.', 'Keep this and smile when I am grown up and tall,', 'and remember these hands, the smallest of all.'] },
  flower: { title: 'Watch me grow', poem: ['I planted a flower with my own little hand.', 'It will grow up tall, and so will I!'] },
  feet: { title: 'My tiny feet', poem: ['Look at my feet, so tiny today.', 'Soon they will run and dance and play.', 'Wherever they take me, near or far,', 'they will always come home to where you are.'] },
  heart: { title: 'I love you this much', poem: ['Two little hands to make a heart,', 'full of love from the very start.'] },
};

function makeHandprints(o, paper) {
  const kind = KEEPSAKES[o.kind] ? o.kind : 'hands';
  const ks = KEEPSAKES[kind];
  const name = nameOf(o.name, '');
  const pg = new Page(paper, '', { bare: true });
  const cx = pg.w / 2;
  // A soft frame with painted corners.
  pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="9" fill="#fffdf8" stroke="#ffb938" stroke-width="1"/>`);
  pg.add(`<rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${pg.bottom - pg.m - 3}" rx="7" fill="none" stroke="#ffd98a" stroke-width="0.5" stroke-dasharray="2 1.6"/>`);
  ['star', 'heart', 'heart', 'star'].forEach((a, i) => pg.add(pic(ART(a), i % 2 ? pg.right - 8 : pg.left + 8, i < 2 ? pg.m + 8 : pg.bottom - 11, 11)));
  let y = pg.m + 20;
  pg.add(txt(cx, y, ks.title, 13, { colour: INK }));
  y += 10;
  const fs = 5.2;
  ks.poem.forEach((l, i) => pg.add(txt(cx, y + i * fs * 1.45, l, fs, { font: FONT, weight: 700, colour: '#6a5f9a' })));
  y += ks.poem.length * fs * 1.45 + 6;
  const area = pg.bottom - 40 - y;
  if (kind === 'hands') {
    const s = Math.min(area * 0.92, pg.width * 0.42 * 1.3);
    pg.add(handOutline(cx - pg.width * 0.23, y + area / 2, s, true));
    pg.add(handOutline(cx + pg.width * 0.23, y + area / 2, s, false));
    pg.add(txt(cx, y + area - 2, 'Paint your hands and press them here', 4, { font: FONT, colour: SOFT }));
  } else if (kind === 'feet') {
    const s = Math.min(area * 0.9, pg.width * 0.5);
    pg.add(footOutline(cx - pg.width * 0.17, y + area / 2, s, true));
    pg.add(footOutline(cx + pg.width * 0.17, y + area / 2, s, false));
    pg.add(txt(cx, y + area - 2, 'Paint your feet and press them here', 4, { font: FONT, colour: SOFT }));
  } else if (kind === 'flower') {
    const top = y + area * 0.34, potY = y + area - 40;
    pg.add(`<path d="M${cx} ${top + 30} C${cx - 6} ${top + 70} ${cx + 6} ${potY - 40} ${cx} ${potY}" fill="none" stroke="#3fbf60" stroke-width="3" stroke-linecap="round"/>`);
    pg.add(`<path d="M${cx} ${potY - 40} C${cx - 30} ${potY - 60} ${cx - 42} ${potY - 38} ${cx - 34} ${potY - 30} C${cx - 24} ${potY - 28} ${cx - 10} ${potY - 32} ${cx} ${potY - 40} Z M${cx} ${potY - 64} C${cx + 30} ${potY - 84} ${cx + 42} ${potY - 62} ${cx + 34} ${potY - 54} C${cx + 24} ${potY - 52} ${cx + 10} ${potY - 56} ${cx} ${potY - 64} Z" fill="#8bd48f" stroke="#2e9d63" stroke-width="0.8"/>`);
    pg.add(`<path d="M${cx - 30} ${potY} H${cx + 30} L${cx + 23} ${potY + 38} H${cx - 23} Z" fill="#f0a868" stroke="${INK}" stroke-width="0.8"/><rect x="${cx - 34}" y="${potY - 2}" width="68" height="10" rx="2" fill="#e8925a" stroke="${INK}" stroke-width="0.8"/>`);
    // Upside down hand: the fingers become the petals.
    const hs = Math.min(76, area * 0.46), hk = hs / 130;
    pg.add(handOutline(cx, top + 30 - 48 * hk, hs, false, '#ffb3c6'));
    pg.add(txt(cx, y + 4, 'Press your painted hand at the top of the stem. The fingers are the petals!', 4, { font: FONT, colour: SOFT }));
    if (name) pg.add(txt(cx, potY + 24, name, fitFont(name, 9, 40), { colour: '#fff' }));
  } else {
    const r = Math.min(area * 0.44, pg.width * 0.44);
    const hy = y + area * 0.46;
    pg.add(`<path d="M${cx} ${hy + r * 0.95} C${cx - r * 1.7} ${hy - r * 0.05} ${cx - r * 0.75} ${hy - r * 1.2} ${cx} ${hy - r * 0.42} C${cx + r * 0.75} ${hy - r * 1.2} ${cx + r * 1.7} ${hy - r * 0.05} ${cx} ${hy + r * 0.95} Z" fill="#fff0f5" stroke="#ff7eb6" stroke-width="1.2" stroke-dasharray="3 2"/>`);
    pg.add(`<g transform="rotate(-35 ${cx - r * 0.42} ${hy})">${handOutline(cx - r * 0.42, hy, r * 0.9, true, '#ffb3c6')}</g>`);
    pg.add(`<g transform="rotate(35 ${cx + r * 0.42} ${hy})">${handOutline(cx + r * 0.42, hy, r * 0.9, false, '#ffb3c6')}</g>`);
    pg.add(txt(cx, y + area - 2, 'Press both painted hands to make a heart', 4, { font: FONT, colour: SOFT }));
  }
  // Name, age and date lines.
  const ly = pg.bottom - 22, third = pg.width / 3;
  [['Name', name], ['Age', o.age ? String(o.age).slice(0, 12) : ''], ['Date', '']].forEach(([lab, val], i) => {
    const x = pg.left + 8 + i * third;
    pg.add(txt(x, ly, lab, 4.6, { anchor: 'start', font: FONT, colour: SOFT }));
    pg.add(`<line x1="${x + 12}" x2="${x + third - 12}" y1="${ly + 0.6}" y2="${ly + 0.6}" stroke="#b9b3d6" stroke-width="0.4"/>`);
    if (val) pg.add(txt(x + 12 + (third - 24) / 2, ly - 1, val, fitFont(val, 6, third - 26), { colour: INK }));
  });
  pg.footer = () => {};
  return [pg.svg()];
}

// ================================================================ height chart
function makeHeightChart(o, paper) {
  const inches = o.units === 'in';
  const unit = inches ? 25.4 : 10; // mm per unit
  const per = inches ? 10 : 25; // units per strip
  const start = inches ? 20 : +(o.start || 50);
  const strips = 4;
  const name = nameOf(o.name, '');
  const deco = ['monkey', 'lion', 'zebra', 'turtle', 'octopus', 'chick', 'pig', 'gorilla', 'ladybird', 'star', 'rainbow', 'sun'];
  const pages = [];
  for (let p = 0; p < 1; p++) {
    const pg = new Page(paper, '', { bare: true });
    const len = per * unit, top = pg.m + 8, sw = Math.min(44, pg.width / 4 - 3);
    pg.add(txt(pg.w / 2, pg.m + 2, `Print at 100% (actual size). Stick strip 1 with its bottom ${start} ${inches ? 'inches' : 'cm'} above the floor, then each strip above the last.`, 3.5, { font: FONT, colour: SOFT }));
    for (let k = 0; k < strips; k++) {
      const s = k;
      if (s >= strips) break;
      const lo = start + s * per, hi = lo + per, c = s % PALETTE.length;
      const x = pg.left + k * (pg.width / strips) + (pg.width / strips - sw) / 2, yTop = top, yBot = top + len;
      pg.add(`<rect x="${x}" y="${yTop}" width="${sw}" height="${len}" fill="${TINTS[c]}" stroke="#b9b3d6" stroke-width="0.4" stroke-dasharray="2 1.5"/>`);
      pg.add(`<rect x="${x + sw - 12}" y="${yTop}" width="12" height="${len}" fill="${PALETTE[c]}" opacity="0.35"/>`);
      // Ticks: every mm (or eighth inch), bigger each 5, numbered each whole unit.
      const steps = inches ? per * 8 : per * 10;
      for (let t = 0; t <= steps; t++) {
        const yy = yBot - (t / steps) * len;
        const whole = inches ? t % 8 === 0 : t % 10 === 0, half = inches ? t % 4 === 0 : t % 5 === 0;
        const w = whole ? 12 : half ? 7 : 3.5;
        pg.add(`<line x1="${x}" x2="${x + w}" y1="${yy}" y2="${yy}" stroke="${INK}" stroke-width="${whole ? 0.5 : 0.25}"/>`);
        const v = lo + (inches ? t / 8 : t / 10);
        if (whole && t > 0 && t < steps) pg.add(txt(x + 13.5, yy + 1.5, v, 4.2, { anchor: 'start', colour: INK }));
      }
      pg.add(txt(x + sw / 2 - 5, yBot - 3, `${lo} ${inches ? 'in' : 'cm'}`, 3.6, { colour: SOFT, font: FONT }));
      // Writing lines for "Name, age" beside some marks, and a painted friend.
      if (s < strips - 1) for (let d = 0; d < 3; d++) pg.add(pic(ART(deco[(s * 3 + d) % deco.length]), x + sw - 6, yTop + len * (0.2 + d * 0.3), 12));
      pg.add(`<rect x="${x + 2}" y="${yTop + 2}" width="${sw - 16}" height="11" rx="2" fill="#fff" opacity="0.96"/>`);
      pg.add(txt(x + (sw - 12) / 2 + 1, yTop + 6.6, `Strip ${s + 1} of ${strips}`, 4, { colour: PALETTE[c] }));
      pg.add(txt(x + (sw - 12) / 2 + 1, yTop + 11, `${lo} to ${hi} ${inches ? 'inches' : 'cm'}`, 3.2, { colour: SOFT, font: FONT }));
      if (s === strips - 1) {
        const title = name ? `Watch ${name} grow!` : 'Watch me grow!';
        const tfs = fitFont(title, 8.5, len * 0.7), bx = x + sw - 6;
        pg.add(`<text transform="rotate(-90 ${bx} ${yTop + len * 0.5})" x="${bx}" y="${yTop + len * 0.5 + tfs * 0.34}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${tfs.toFixed(2)}" fill="${PALETTE[c]}" stroke="#fff" stroke-width="${(tfs * 0.1).toFixed(2)}" paint-order="stroke">${esc(title)}</text>`);
        pg.add(pic(ART('star'), bx, yTop + 22, 11));
      }
    }
    pg.footer = () => {};
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ days and months
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function dayWeather(kind, cx, cy, s) {
  const st = `stroke="${INK}" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"`;
  const cloud = (dx, dy, k, fill) => `<path d="M${cx + dx - s * 0.36 * k} ${cy + dy + s * 0.14 * k} a${s * 0.16 * k} ${s * 0.16 * k} 0 0 1 ${s * 0.1 * k} ${-s * 0.3 * k} a${s * 0.22 * k} ${s * 0.22 * k} 0 0 1 ${s * 0.4 * k} ${-s * 0.04 * k} a${s * 0.16 * k} ${s * 0.16 * k} 0 0 1 ${s * 0.18 * k} ${s * 0.34 * k} Z" fill="${fill}" ${st}/>`;
  switch (kind) {
    case 'sunny': return `<circle cx="${cx}" cy="${cy}" r="${s * 0.22}" fill="#ffd23f" ${st}/>` + [0, 1, 2, 3, 4, 5, 6, 7].map((k) => { const a = k * Math.PI / 4; return `<line x1="${cx + Math.cos(a) * s * 0.3}" y1="${cy + Math.sin(a) * s * 0.3}" x2="${cx + Math.cos(a) * s * 0.42}" y2="${cy + Math.sin(a) * s * 0.42}" stroke="#ffb938" stroke-width="0.9" stroke-linecap="round"/>`; }).join('');
    case 'cloudy': return cloud(0, 0, 1.1, '#e6eef8');
    case 'rainy': return cloud(0, -s * 0.1, 1, '#cfd8e8') + [-0.16, 0, 0.16].map((a) => `<line x1="${cx + a * s}" y1="${cy + s * 0.14}" x2="${cx + a * s - s * 0.05}" y2="${cy + s * 0.3}" stroke="#3a86ff" stroke-width="0.8" stroke-linecap="round"/>`).join('');
    case 'windy': return `<path d="M${cx - s * 0.36} ${cy - s * 0.12} H${cx + s * 0.16} a${s * 0.1} ${s * 0.1} 0 1 0 ${-s * 0.1} ${-s * 0.1} M${cx - s * 0.36} ${cy + s * 0.04} H${cx + s * 0.26} a${s * 0.1} ${s * 0.1} 0 1 1 ${-s * 0.1} ${s * 0.1} M${cx - s * 0.3} ${cy + s * 0.2} H${cx + s * 0.06}" fill="none" stroke="#35b5e5" stroke-width="0.9" stroke-linecap="round"/>`;
    case 'stormy': return cloud(0, -s * 0.1, 1, '#b8c2d6') + `<path d="M${cx + s * 0.02} ${cy + s * 0.08} L${cx - s * 0.08} ${cy + s * 0.24} H${cx + s * 0.02} L${cx - s * 0.06} ${cy + s * 0.4} L${cx + s * 0.14} ${cy + s * 0.18} H${cx + s * 0.04} L${cx + s * 0.1} ${cy + s * 0.08} Z" fill="#ffd23f" ${st}/>`;
    default: return `<circle cx="${cx}" cy="${cy}" r="${s * 0.22}" fill="#ffd23f" ${st}/>` + cloud(s * 0.1, s * 0.1, 0.9, '#fff');
  }
}

function makeDaysMonths(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'week';
  if (kind === 'today') {
    const pg = new Page(paper, 'My day today', { subtitle: 'Fill this in every morning. Circle the answers and write the rest.' });
    const sec = (title, h, c) => { pg.add(panel(pg.left, pg.y, pg.width, h, TINTS[c], PALETTE[c], 6) + txt(pg.left + 5, pg.y + 7.5, title, 5.6, { anchor: 'start', colour: PALETTE[c] })); const y0 = pg.y; pg.y += h + 5; return y0; };
    let y = sec('Today is...', 30, 0);
    DAYS.forEach((d, i) => { const w = pg.width / 7, x = pg.left + w * i; pg.add(`<rect x="${x + 1.5}" y="${y + 12}" width="${w - 3}" height="12" rx="6" fill="#fff" stroke="${PALETTE[i]}" stroke-width="0.7"/>` + txt(x + w / 2, y + 19.6, d, fitFont(d, 4.6, w - 6), { colour: INK })); });
    y = sec('The date', 26, 3);
    [['Day', 30], ['Month', 60], ['Year', 40]].reduce((x, [lab, w]) => { pg.add(txt(x, y + 20, lab, 4.4, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${x + 14}" x2="${x + w + 10}" y1="${y + 20.6}" y2="${y + 20.6}" stroke="#9a93b8" stroke-width="0.4"/>`); return x + w + 20; }, pg.left + 6);
    y = sec('Yesterday and tomorrow', 32, 2);
    pg.add(txt(pg.left + 6, y + 17, 'Yesterday was', 5, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 42}" x2="${pg.right - 8}" y1="${y + 17.6}" y2="${y + 17.6}" stroke="#9a93b8" stroke-width="0.4"/>`);
    pg.add(txt(pg.left + 6, y + 27, 'Tomorrow will be', 5, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 48}" x2="${pg.right - 8}" y1="${y + 27.6}" y2="${y + 27.6}" stroke="#9a93b8" stroke-width="0.4"/>`);
    y = sec('The weather today is...', 40, 1);
    ['sunny', 'cloudy', 'rainy', 'windy', 'stormy', 'sunny and cloudy'].forEach((w, i) => { const cw = pg.width / 6, cx = pg.left + cw * (i + 0.5); pg.add(`<rect x="${cx - cw / 2 + 2}" y="${y + 11}" width="${cw - 4}" height="26" rx="5" fill="#fff" stroke="#f1d9a0" stroke-width="0.5"/>` + dayWeather(w === 'sunny and cloudy' ? 'mixed' : w, cx, y + 21, 16) + txt(cx, y + 34, w === 'sunny and cloudy' ? 'sunny spells' : w, 3.6, { font: FONT })); });
    y = sec('Today I feel...', 30, 5);
    ['happy', 'calm', 'tired', 'sad', 'silly', 'proud'].forEach((m, i) => { const cw = pg.width / 6, cx = pg.left + cw * (i + 0.5); pg.add(face(cx, y + 18, 6.5, m, true) + txt(cx, y + 28.6, m, 3.8, { font: FONT })); });
    const h = pg.room - 2;
    y = sec('Something I will do today', h, 4);
    for (let l = 1; l <= 3; l++) if (y + 6 + l * 11 < y + h) pg.add(`<line x1="${pg.left + 6}" x2="${pg.right - 6}" y1="${y + 6 + l * 11}" y2="${y + 6 + l * 11}" stroke="#c9b8ef" stroke-width="0.4"/>`);
    return [pg.svg()];
  }
  const week = kind === 'week';
  const list = week ? DAYS : MONTHS;
  const hide = new Set(shuffle(list.map((_, i) => i), rand).slice(0, week ? 3 : 5));
  const qs = [];
  const idx = shuffle(list.map((_, i) => i), rand);
  for (let i = 0; i < 4; i++) {
    const k = idx[i];
    if (i % 2 === 0) qs.push([`What comes after ${list[k]}?`, list[(k + 1) % list.length]]);
    else qs.push([`What comes before ${list[k]}?`, list[(k + list.length - 1) % list.length]]);
  }
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? `${week ? 'Days of the week' : 'Months of the year'}: answers` : week ? 'Days of the week' : 'Months of the year', { subtitle: answers ? 'Answer key for grown-ups.' : week ? 'There are 7 days in a week. Write the missing days, then answer the questions.' : 'There are 12 months in a year. Write the missing months, then answer the questions.', noName: answers });
    const cols = week ? 1 : 3, rows = week ? 7 : 4;
    const areaH = week ? 7 * 13 : 4 * 22, cw = pg.width / cols, ch = areaH / rows;
    list.forEach((d, i) => {
      const x = pg.left + (week ? 0 : (i % cols) * cw), y = pg.y + (week ? i : Math.floor(i / cols)) * ch, c = i % PALETTE.length;
      pg.add(panel(x + 1.5, y + 1.2, cw - 3, ch - 2.4, TINTS[c], PALETTE[c], 5));
      pg.add(`<circle cx="${x + 9}" cy="${y + ch / 2}" r="${Math.min(4.5, ch / 2 - 2)}" fill="${PALETTE[c]}"/>` + txt(x + 9, y + ch / 2 + 1.6, i + 1, 4.4, { colour: '#fff' }));
      const tx = x + (week ? 20 : cw / 2 + 4), ty = y + ch / 2 + 2.6;
      const anchor = week ? 'start' : 'middle';
      if (hide.has(i) && !answers) pg.add(`<line x1="${week ? tx : tx - cw * 0.32}" x2="${week ? tx + 70 : tx + cw * 0.32}" y1="${ty + 1}" y2="${ty + 1}" stroke="#9a93b8" stroke-width="0.45"/>`);
      else pg.add(txt(tx, ty, d, week ? 7 : fitFont(d, 6.4, cw * 0.62), { anchor, colour: hide.has(i) ? PINK : INK }));
      if (week && (i >= 5)) pg.add(txt(pg.right - 6, ty, 'weekend', 4, { anchor: 'end', font: FONT, colour: SOFT }));
    });
    pg.y += areaH + 8;
    qs.forEach(([q, a], i) => {
      const y = pg.y + i * 13;
      pg.add(txt(pg.left + 2, y + 6, q, 5, { anchor: 'start', font: FONT }));
      pg.add(`<line x1="${pg.left + 104}" x2="${pg.right - 4}" y1="${y + 6.6}" y2="${y + 6.6}" stroke="#9a93b8" stroke-width="0.45"/>`);
      if (answers) pg.add(txt(pg.left + 108, y + 5.6, a, 5.2, { anchor: 'start', colour: PINK }));
    });
    pg.y += 4 * 13 + 4;
    const last = week ? ['My favourite day is', 'because'] : ['My birthday is in', 'My favourite month is'];
    last.forEach((l, i) => {
      const y = pg.y + i * 13;
      pg.add(txt(pg.left + 2, y + 6, l, 5, { anchor: 'start', font: FONT, colour: '#8a3fd1' }) + `<line x1="${pg.left + 58}" x2="${pg.right - 4}" y1="${y + 6.6}" y2="${y + 6.6}" stroke="#c9b8ef" stroke-width="0.45"/>`);
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ my body
function bodyFigure(ox, oy, k) {
  // A child drawn in a 120 x 225 box. Returns svg.
  const X = (v) => ox + v * k, Y = (v) => oy + v * k, R = (v) => v * k;
  const st = `stroke="${INK}" stroke-width="${R(1.4)}" stroke-linejoin="round" stroke-linecap="round"`;
  const skin = '#ffe3cf', shirt = '#bfe3ff', shorts = '#ffd0e0';
  const P = (d, fill) => `<path d="${d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (m, a, b) => `${X(+a).toFixed(2)} ${Y(+b).toFixed(2)}`)}" fill="${fill}" ${st}/>`;
  let s = '';
  // Legs and feet
  s += P('M44 146 L44 202 L58 202 L58 146 Z', skin) + P('M62 146 L62 202 L76 202 L76 146 Z', skin);
  s += P('M40 202 Q36 214 50 214 L60 214 Q62 206 58 202 Z', skin) + P('M80 202 Q84 214 70 214 L60 214 Q58 206 62 202 Z', skin);
  [[42, 210], [46, 212.5], [50.5, 213.4], [78, 210], [74, 212.5], [69.5, 213.4]].forEach(([a, b]) => { s += `<circle cx="${X(a)}" cy="${Y(b)}" r="${R(1.5)}" fill="${skin}" stroke="${INK}" stroke-width="${R(0.8)}"/>`; });
  s += `<path d="M${X(46)} ${Y(174)} q${R(5)} ${R(-3)} ${R(10)} 0 M${X(64)} ${Y(174)} q${R(5)} ${R(-3)} ${R(10)} 0" fill="none" stroke="${INK}" stroke-width="${R(0.9)}" stroke-linecap="round"/>`;
  // Arms
  s += P('M34 76 Q20 90 18 110 L16 132 L25 133 L28 112 Q30 98 38 90 Z', skin) + P('M86 76 Q100 90 102 110 L104 132 L95 133 L92 112 Q90 98 82 90 Z', skin);
  s += `<circle cx="${X(20.5)}" cy="${Y(137)}" r="${R(6.5)}" fill="${skin}" stroke="${INK}" stroke-width="${R(1.4)}"/><circle cx="${X(99.5)}" cy="${Y(137)}" r="${R(6.5)}" fill="${skin}" stroke="${INK}" stroke-width="${R(1.4)}"/>`;
  // Shorts and T-shirt
  s += P('M40 124 L80 124 L82 150 L62 150 L60 138 L58 150 L38 150 Z', shorts);
  s += P('M48 66 L72 66 L90 76 L96 94 L84 98 L80 88 L80 128 L40 128 L40 88 L36 98 L24 94 L30 76 Z', shirt);
  s += `<circle cx="${X(60)}" cy="${Y(106)}" r="${R(1.3)}" fill="${INK}"/>`;
  // Neck, ears, head, hair, face
  s += P('M54 56 L66 56 L66 68 L54 68 Z', skin);
  s += `<circle cx="${X(38)}" cy="${Y(38)}" r="${R(6)}" fill="${skin}" ${st}/><circle cx="${X(82)}" cy="${Y(38)}" r="${R(6)}" fill="${skin}" ${st}/>`;
  s += `<circle cx="${X(60)}" cy="${Y(36)}" r="${R(23)}" fill="${skin}" ${st}/>`;
  s += P('M37 34 Q36 10 60 11 Q84 10 83 34 Q78 22 66 22 Q62 28 52 24 Q42 24 37 34 Z', '#8d5524');
  s += `<circle cx="${X(51)}" cy="${Y(37)}" r="${R(2.4)}" fill="${INK}"/><circle cx="${X(69)}" cy="${Y(37)}" r="${R(2.4)}" fill="${INK}"/>`;
  s += `<path d="M${X(47)} ${Y(31)} q${R(4)} ${R(-2.5)} ${R(8)} 0 M${X(65)} ${Y(31)} q${R(4)} ${R(-2.5)} ${R(8)} 0" fill="none" stroke="${INK}" stroke-width="${R(1)}" stroke-linecap="round"/>`;
  s += `<path d="M${X(60)} ${Y(40)} q${R(-2)} ${R(4)} ${R(1)} ${R(5)}" fill="none" stroke="${INK}" stroke-width="${R(1)}" stroke-linecap="round"/>`;
  s += `<path d="M${X(53)} ${Y(49)} Q${X(60)} ${Y(55)} ${X(67)} ${Y(49)}" fill="#fff" stroke="${INK}" stroke-width="${R(1.1)}" stroke-linecap="round"/>`;
  s += `<circle cx="${X(46)}" cy="${Y(45)}" r="${R(3)}" fill="#ffb3c6" opacity="0.7"/><circle cx="${X(74)}" cy="${Y(45)}" r="${R(3)}" fill="#ffb3c6" opacity="0.7"/>`;
  return s;
}
const BODY_PARTS = { hair: [60, 14], eye: [51, 37], ear: [82, 38], nose: [60, 43], mouth: [60, 51], neck: [60, 62], shoulder: [32, 78], elbow: [96, 104], hand: [20, 138], tummy: [60, 108], knee: [69, 174], foot: [48, 208], arm: [22, 112], leg: [51, 186], head: [72, 22] };
const FACE_PARTS = { hair: [60, 14], eyebrow: [69, 31], eye: [51, 37], ear: [38, 40], nose: [60, 43], mouth: [60, 51], cheek: [74, 45], chin: [60, 58] };

function makeMyBody(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'body';
  const pages = [];
  if (kind === 'senses') {
    const senses = [['see', 'eyes', 'rainbow'], ['hear', 'ears', 'popper'], ['smell', 'nose', 'rose'], ['taste', 'tongue', 'strawberry'], ['touch', 'hands', 'bear']];
    const order = shuffle(senses.map((_, i) => i), rand);
    for (const answers of [false, true]) {
      if (answers && o.key === false) break;
      const pg = new Page(paper, answers ? 'My five senses: answers' : 'My five senses', { subtitle: answers ? 'Answer key for grown-ups.' : 'Read each sentence. Draw a line to the picture that matches.', noName: answers });
      const rh = (pg.room - 2) / 5;
      senses.forEach(([verb, part], i) => {
        const y = pg.y + i * rh, cy = y + rh / 2;
        pg.add(panel(pg.left, y + 2, pg.width * 0.62, rh - 4, TINTS[i], PALETTE[i], 6));
        pg.add(txt(pg.left + 6, cy - 2, `I ${verb}`, 7, { anchor: 'start', colour: PALETTE[i] }));
        pg.add(txt(pg.left + 6, cy + 7, `with my ${part}.`, 5, { anchor: 'start', font: FONT }));
        pg.add(`<circle cx="${pg.left + pg.width * 0.62 - 4}" cy="${cy}" r="2" fill="${INK}"/>`);
        const j = order[i], py = pg.y + j * rh + rh / 2, px = pg.right - rh / 2 + 2;
        pg.add(`<rect x="${px - rh / 2 + 3}" y="${pg.y + j * rh + 3}" width="${rh - 6}" height="${rh - 6}" rx="6" fill="#fff" stroke="#e2ddf2" stroke-width="0.6"/>`);
        pg.add(pic(ART(senses[i][2]), px, py, rh - 12));
        pg.add(`<circle cx="${px - rh / 2 + 1}" cy="${py}" r="2" fill="${INK}"/>`);
        if (answers) pg.add(`<line x1="${pg.left + pg.width * 0.62 - 4}" y1="${cy}" x2="${px - rh / 2 + 1}" y2="${py}" stroke="${PINK}" stroke-width="0.9"/>`);
      });
      pages.push(pg.svg());
    }
    return pages;
  }
  const face = kind === 'face';
  const table = face ? FACE_PARTS : BODY_PARTS;
  const names = face ? Object.keys(FACE_PARTS) : shuffle(Object.keys(BODY_PARTS), rand).slice(0, 12);
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? `${face ? 'My face' : 'My body'}: answers` : face ? 'Label my face' : 'Label my body', { subtitle: answers ? 'Answer key for grown-ups.' : 'Use the words in the box to label the picture.', noName: answers });
    // Word bank
    const bank = shuffle(names, rand);
    const perRow = bank.length > 8 ? Math.ceil(bank.length / 2) : bank.length, bRows = Math.ceil(bank.length / perRow);
    pg.add(panel(pg.left, pg.y, pg.width, 6 + bRows * 8, '#fff6e0', '#ffb938', 5));
    bank.forEach((w, i) => pg.add(txt(pg.left + pg.width * ((i % perRow) + 0.5) / perRow, pg.y + 9 + Math.floor(i / perRow) * 8, w, fitFont(w, 5, pg.width / perRow - 3, 0.5), { colour: PALETTE[i % PALETTE.length] })));
    pg.y += 12 + bRows * 8;
    const area = pg.room - 2;
    const fw = face ? 120 : 120, fh = face ? 70 : 225;
    const k = face ? Math.min((pg.width * 0.5) / 60, area / fh) : Math.min(area / fh, (pg.width * 0.46) / fw);
    // For the face we zoom into the head (x 30..90, y 5..65).
    const ox = face ? pg.w / 2 - 60 * k : pg.w / 2 - 60 * k, oy = face ? pg.y - 4 * k + (area - 60 * k) / 2 : pg.y + (area - fh * k) / 2;
    if (face) pg.add(`<defs><clipPath id="faceclip"><rect x="${ox + 24 * k}" y="${oy + 4 * k}" width="${72 * k}" height="${60 * k}"/></clipPath></defs><g clip-path="url(#faceclip)">${bodyFigure(ox, oy, k)}</g>`);
    else pg.add(bodyFigure(ox, oy, k));
    const pts = names.map((n) => [n, ox + table[n][0] * k, oy + table[n][1] * k]);
    const left = pts.filter((p) => p[1] < pg.w / 2 || (p[1] === pg.w / 2 && p[0].length % 2)).sort((a, b) => a[2] - b[2]);
    const right = pts.filter((p) => !left.includes(p)).sort((a, b) => a[2] - b[2]);
    const place = (list, side) => {
      const top = pg.y + 6, span = area - 12;
      list.forEach(([n, px, py], i) => {
        const by = list.length === 1 ? py : top + span * (i + 0.5) / list.length;
        const bw = 38, bx = side < 0 ? pg.left + 2 : pg.right - bw - 2;
        const ex = side < 0 ? bx + bw : bx;
        pg.add(`<line x1="${ex}" y1="${by}" x2="${px}" y2="${py}" stroke="#9a93b8" stroke-width="0.45"/><circle cx="${px}" cy="${py}" r="1.1" fill="${PINK}"/>`);
        pg.add(`<rect x="${bx}" y="${by - 5}" width="${bw}" height="10" rx="3" fill="#fff" stroke="#9a93b8" stroke-width="0.5"/>`);
        if (answers) pg.add(txt(bx + bw / 2, by + 1.8, n, 5, { colour: PINK }));
      });
    };
    place(left, -1); place(right, 1);
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ domino maths
const PIPS = { 0: [], 1: [[0.5, 0.5]], 2: [[0.28, 0.28], [0.72, 0.72]], 3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]], 4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]], 5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]], 6: [[0.28, 0.22], [0.72, 0.22], [0.28, 0.5], [0.72, 0.5], [0.28, 0.78], [0.72, 0.78]] };
function domino(x, y, s, a, b, opts = {}) {
  const { fill = '#fff', pip = INK, hideB = false, ghost = false } = opts;
  let out = `<rect x="${x}" y="${y}" width="${s * 2}" height="${s}" rx="${s * 0.16}" fill="${fill}" stroke="${INK}" stroke-width="0.8"/><line x1="${x + s}" x2="${x + s}" y1="${y + s * 0.12}" y2="${y + s * 0.88}" stroke="${INK}" stroke-width="0.6"/>`;
  PIPS[a].forEach(([u, v]) => { out += `<circle cx="${x + u * s}" cy="${y + v * s}" r="${s * 0.085}" fill="${pip}"/>`; });
  if (!hideB || ghost) PIPS[b].forEach(([u, v]) => { out += `<circle cx="${x + s + u * s}" cy="${y + v * s}" r="${s * 0.085}" fill="${ghost ? PINK : pip}" opacity="${ghost ? 0.8 : 1}"/>`; });
  return out;
}

function makeDominoes(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'add';
  const pages = [];
  if (kind === 'set') {
    const pg = new Page(paper, 'Domino set', { subtitle: 'A full double six set of 28 dominoes. Colour the backs, cut them out and play!', noName: true });
    const cols = 4, rows = 7, cw = pg.width / cols, ch = (pg.room - 2) / rows, s = Math.min(cw / 2.3, ch * 0.8);
    let i = 0;
    for (let a = 0; a <= 6; a++) for (let b = a; b <= 6; b++) {
      const x = pg.left + (i % cols) * cw + (cw - 2 * s) / 2, y = pg.y + Math.floor(i / cols) * ch + (ch - s) / 2;
      pg.add(`<rect x="${x - 1.5}" y="${y - 1.5}" width="${2 * s + 3}" height="${s + 3}" rx="${s * 0.2}" fill="none" stroke="#b9b3d6" stroke-width="0.4" stroke-dasharray="2 1.4"/>`);
      pg.add(domino(x, y, s, a, b, { fill: TINTS[i % TINTS.length] }));
      i++;
    }
    pages.push(pg.svg());
    return pages;
  }
  const max = +o.max === 9 ? 9 : 6;
  const items = [];
  for (let i = 0; i < 10; i++) {
    const a = Math.floor(rand() * (Math.min(max, 6) + 1)), b = Math.floor(rand() * (Math.min(max, 6) + 1));
    items.push(kind === 'missing' ? [a, Math.max(1, b)] : [a, b]);
  }
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const miss = kind === 'missing';
    const pg = new Page(paper, answers ? `Domino ${miss ? 'dots' : 'sums'}: answers` : miss ? 'Draw the missing dots' : 'Domino sums', { subtitle: answers ? 'Answer key for grown-ups.' : miss ? 'Each domino must add up to the number. Draw the missing dots on the empty side.' : 'Count the dots on each side. Write the sum and the answer.', noName: answers });
    const cols = 2, rows = 5, cw = pg.width / cols, ch = (pg.room - 2) / rows, s = Math.min(cw * 0.3, ch * 0.5);
    items.forEach(([a, b], i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, TINTS[i % TINTS.length], '#e2ddf2', 6));
      const dx = x + 8, dy = y + (ch - s) / 2 - (miss ? 0 : 5);
      pg.add(domino(dx, dy, s, a, b, { hideB: miss, ghost: miss && answers }));
      if (miss) {
        pg.add(txt(x + 8 + 2 * s + 8, y + ch / 2 + 2, '=', 9, { anchor: 'start' }));
        pg.add(`<circle cx="${x + 8 + 2 * s + 26}" cy="${y + ch / 2}" r="8" fill="#fff" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="1"/>` + txt(x + 8 + 2 * s + 26, y + ch / 2 + 3.2, a + b, 9, { colour: PALETTE[i % PALETTE.length] }));
      } else {
        const sy = y + ch - 8, bw = 11;
        let sx = x + 8;
        const put = (v) => { pg.add(blankBox(sx, sy - 7, bw, 9)); if (answers) pg.add(txt(sx + bw / 2, sy, v, 6, { colour: PINK })); sx += bw + 2; };
        put(a); pg.add(txt(sx + 2, sy, '+', 6)); sx += 6; put(b); pg.add(txt(sx + 2, sy, '=', 6)); sx += 6; put(a + b);
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

Object.assign(MAKERS, { secretcode: makeSecretCode, gridcopy: makeGridCopy, puppets: makePuppets, handprints: makeHandprints, heightchart: makeHeightChart, daysmonths: makeDaysMonths, mybody: makeMyBody, dominoes: makeDominoes });
