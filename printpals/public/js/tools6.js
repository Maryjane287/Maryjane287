// PrintPals batch 5: place value, shapes and symmetry, measuring, graphs,
// reading log, handwriting paper, story writing and name labels.

// ================================================================ place value
function baseTen(pg, x, y, n, c) {
  // Hundreds flats, tens rods and ones cubes, left to right.
  const h = Math.floor(n / 100), t = Math.floor((n % 100) / 10), o = n % 10;
  let cx = x;
  const cell = (px, py) => `<rect x="${px}" y="${py}" width="${c}" height="${c}" fill="#fff" stroke="#2d2350" stroke-width="0.25"/>`;
  for (let i = 0; i < h; i++) {
    let s = `<rect x="${cx}" y="${y}" width="${c * 10}" height="${c * 10}" fill="#ffe3ec" stroke="#2d2350" stroke-width="0.5"/>`;
    for (let k = 1; k < 10; k++) s += `<line x1="${cx + k * c}" x2="${cx + k * c}" y1="${y}" y2="${y + c * 10}" stroke="#c7b8d8" stroke-width="0.2"/><line x1="${cx}" x2="${cx + c * 10}" y1="${y + k * c}" y2="${y + k * c}" stroke="#c7b8d8" stroke-width="0.2"/>`;
    pg.add(s);
    cx += c * 10 + c * 0.8;
  }
  for (let i = 0; i < t; i++) {
    let s = `<rect x="${cx}" y="${y}" width="${c}" height="${c * 10}" fill="#dfeaff" stroke="#2d2350" stroke-width="0.5"/>`;
    for (let k = 1; k < 10; k++) s += `<line x1="${cx}" x2="${cx + c}" y1="${y + k * c}" y2="${y + k * c}" stroke="#2d2350" stroke-width="0.2"/>`;
    pg.add(s);
    cx += c * 1.5;
  }
  if (o) cx += c * 0.6;
  for (let i = 0; i < o; i++) pg.add(`<rect x="${cx + Math.floor(i / 5) * c * 1.3}" y="${y + c * 10 - (i % 5 + 1) * c * 1.25}" width="${c}" height="${c}" fill="#fff4cc" stroke="#2d2350" stroke-width="0.5"/>`);
  return cx + (o ? Math.ceil(o / 5) * c * 1.3 : 0) - x;
}

function makePlaceValue(o, paper) {
  const rand = rng(+o.seed || 1);
  const range = o.range || 'to99';
  const kind = o.kind || 'count';
  const lo = range === 'to50' ? 11 : range === 'to99' ? 11 : 100, hi = range === 'to50' ? 50 : range === 'to99' ? 99 : kind === 'count' ? 399 : 999;
  const nums = [];
  while (nums.length < 6) { const n = lo + Math.floor(rand() * (hi - lo + 1)); if (!nums.includes(n)) nums.push(n); }
  const big = hi > 99;
  const titles = { count: 'Count the tens and ones', draw: 'Draw the tens and ones', expand: 'Split the number' };
  const subs = { count: big ? 'Count the hundreds, tens and ones. Write the number.' : 'Each stick is 10. Each little cube is 1. How many altogether?', draw: 'Draw sticks for tens and little squares for ones.', expand: 'Split each number into its parts.' };
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? `${titles[kind]}: answers` : titles[kind], { subtitle: answers ? 'Answer key for grown-ups.' : subs[kind], noName: answers });
    const cols = 2, rows = 3, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    nums.forEach((n, i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      const c = PALETTE[i % PALETTE.length];
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="6" fill="#fff" stroke="${c}" stroke-width="0.7"/>`);
      const h = Math.floor(n / 100), t = Math.floor((n % 100) / 10), on = n % 10;
      const box = (bx, by, v) => `<rect x="${bx}" y="${by}" width="12" height="9" rx="2" fill="#fff" stroke="${answers ? '#e0457b' : '#9a93b8'}" stroke-width="0.5"/>` + (answers ? `<text x="${bx + 6}" y="${by + 6.6}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="#e0457b">${v}</text>` : '');
      if (kind === 'count') {
        const cube = big ? Math.min(3, (cw - 16) / (h * 10.8 + t * 1.5 + 4), (ch - 42) / 10) : Math.min(5, (cw - 16) / (t * 1.5 + 4.5), (ch - 30) / 10);
        baseTen(pg, x + 7, y + 6, n, cube);
        const ly = y + ch - (big ? 28 : 16);
        let lx = x + 7;
        const parts = big ? [[h, 'hundreds'], [t, 'tens'], [on, 'ones']] : [[t, 'tens'], [on, 'ones']];
        parts.forEach(([v, w]) => { pg.add(box(lx, ly, v)); pg.add(`<text x="${lx + 14}" y="${ly + 6.4}" font-family="${FONT}" font-weight="800" font-size="4" fill="${INK}">${w}</text>`); lx += 14 + w.length * 2.2 + 4; });
        if (big) {
          // The whole number goes on its own line so the row fits.
          pg.add(`<text x="${x + 7}" y="${ly + 18.4}" font-family="${FONT}" font-weight="800" font-size="4" fill="${INK}">The number is</text>`);
          pg.add(box(x + 36, ly + 12, n));
        } else {
          pg.add(`<text x="${lx}" y="${ly + 6.4}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">=</text>`);
          pg.add(box(lx + 5, ly, n));
        }
      } else if (kind === 'draw') {
        pg.add(`<text x="${x + 8}" y="${y + 16}" font-family="${TITLE_FONT}" font-weight="800" font-size="14" fill="${INK}">${n}</text>`);
        const cols2 = big ? ['Hundreds', 'Tens', 'Ones'] : ['Tens', 'Ones'];
        const tx = x + 38, tw = cw - 46, colw = tw / cols2.length;
        cols2.forEach((w, k) => {
          pg.add(`<rect x="${tx + k * colw}" y="${y + 6}" width="${colw}" height="${ch - 14}" fill="${TINTS[k]}" stroke="${INK}" stroke-width="0.4"/>`);
          pg.add(`<text x="${tx + k * colw + colw / 2}" y="${y + 11}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${INK}">${w}</text>`);
        });
        if (answers) baseTen(pg, tx + 3, y + 14, n, big ? 1.8 : 2.4);
      } else {
        const fs = 11;
        const parts = big ? [h * 100, t * 10, on] : [t * 10, on];
        let lx = x + 8;
        pg.add(`<text x="${lx}" y="${y + ch / 2 - 4}" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${n} =</text>`);
        lx += (String(n).length + 2) * fs * 0.55;
        parts.forEach((v, k) => {
          pg.add(`<rect x="${lx}" y="${y + ch / 2 - 15}" width="16" height="13" rx="2" fill="#fff" stroke="${answers ? '#e0457b' : '#9a93b8'}" stroke-width="0.5"/>`);
          if (answers) pg.add(`<text x="${lx + 8}" y="${y + ch / 2 - 5.5}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="6.5" fill="#e0457b">${v}</text>`);
          if (k < parts.length - 1) pg.add(`<text x="${lx + 19}" y="${y + ch / 2 - 5}" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="${INK}">+</text>`);
          lx += 26;
        });
        pg.add(`<text x="${x + 8}" y="${y + ch - 12}" font-family="${FONT}" font-weight="700" font-size="4.2" fill="${SOFT}">${big ? `${n} has ${answers ? h : '__'} hundreds, ${answers ? t : '__'} tens and ${answers ? on : '__'} ones.` : `${n} has ${answers ? t : '__'} tens and ${answers ? on : '__'} ones.`}</text>`);
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ shapes and symmetry
const SHAPES2D = [
  ['circle', 0], ['oval', 0], ['square', 4], ['rectangle', 4], ['triangle', 3], ['diamond', 4],
  ['pentagon', 5], ['hexagon', 6], ['octagon', 8], ['star', 10], ['heart', null], ['semicircle', null],
];

function polygonPath(cx, cy, r, n, rot = -Math.PI / 2) {
  let d = '';
  for (let i = 0; i < n; i++) { const a = rot + (i * 2 * Math.PI) / n; d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * r).toFixed(2)} ${(cy + Math.sin(a) * r).toFixed(2)} `; }
  return d + 'Z';
}

function shape2d(kind, cx, cy, r, style) {
  const st = style || `fill="#fff" stroke="${INK}" stroke-width="0.9" stroke-linejoin="round"`;
  switch (kind) {
    case 'circle': return `<circle cx="${cx}" cy="${cy}" r="${r}" ${st}/>`;
    case 'oval': return `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.25}" ry="${r * 0.78}" ${st}/>`;
    case 'square': return `<rect x="${cx - r * 0.85}" y="${cy - r * 0.85}" width="${r * 1.7}" height="${r * 1.7}" ${st}/>`;
    case 'rectangle': return `<rect x="${cx - r * 1.3}" y="${cy - r * 0.7}" width="${r * 2.6}" height="${r * 1.4}" ${st}/>`;
    case 'triangle': return `<path d="M${cx} ${cy - r} L${cx + r * 1.05} ${cy + r * 0.8} L${cx - r * 1.05} ${cy + r * 0.8} Z" ${st}/>`;
    case 'diamond': return `<path d="M${cx} ${cy - r * 1.1} L${cx + r * 0.8} ${cy} L${cx} ${cy + r * 1.1} L${cx - r * 0.8} ${cy} Z" ${st}/>`;
    case 'pentagon': return `<path d="${polygonPath(cx, cy + r * 0.05, r, 5)}" ${st}/>`;
    case 'hexagon': return `<path d="${polygonPath(cx, cy, r, 6, 0)}" ${st}/>`;
    case 'octagon': return `<path d="${polygonPath(cx, cy, r, 8, Math.PI / 8)}" ${st}/>`;
    case 'star': return `<path d="${starPath(cx, cy + r * 0.08, r * 1.1, 0.45)}" ${st}/>`;
    case 'heart': return `<path d="M${cx} ${cy + r} C${cx - r * 1.6} ${cy - r * 0.1} ${cx - r * 0.7} ${cy - r * 1.3} ${cx} ${cy - r * 0.45} C${cx + r * 0.7} ${cy - r * 1.3} ${cx + r * 1.6} ${cy - r * 0.1} ${cx} ${cy + r} Z" ${st}/>`;
    default: return `<path d="M${cx - r * 1.15} ${cy + r * 0.5} A${r * 1.15} ${r * 1.15} 0 0 1 ${cx + r * 1.15} ${cy + r * 0.5} Z" ${st}/>`;
  }
}

function makeShapes(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'name';
  const pages = [];
  if (kind === 'symmetry') {
    const cols = ['#ff6b6b', '#ffb938', '#3fbfa8', '#6c8cff'];
    const grids = [0, 1].map(() => {
      const g = [];
      for (let r = 0; r < 10; r++) { const row = []; for (let c = 0; c < 5; c++) row.push(rand() < 0.42 ? cols[Math.floor(rand() * cols.length)] : null); g.push(row); }
      return g;
    });
    for (const answers of [false, true]) {
      if (answers && o.key === false) break;
      const pg = new Page(paper, answers ? 'Symmetry: answers' : 'Finish the pattern', { subtitle: answers ? 'Answer key for grown-ups.' : 'The dashed line is a mirror. Colour the other side so both sides match.', noName: answers });
      const each = (pg.room - 6) / 2;
      grids.forEach((g, gi) => {
        const cell = Math.min((pg.width - 20) / 10, (each - 8) / 10);
        const gx = pg.left + (pg.width - cell * 10) / 2, gy = pg.y + gi * (each + 6);
        for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
          const src = c < 5 ? g[r][c] : g[r][9 - c];
          const show = c < 5 || answers;
          pg.add(`<rect x="${gx + c * cell}" y="${gy + r * cell}" width="${cell}" height="${cell}" fill="${show && src ? src : '#fff'}" stroke="#b9b3d6" stroke-width="0.3"/>`);
        }
        pg.add(`<rect x="${gx}" y="${gy}" width="${cell * 10}" height="${cell * 10}" fill="none" stroke="${INK}" stroke-width="0.8"/>`);
        pg.add(`<line x1="${gx + cell * 5}" x2="${gx + cell * 5}" y1="${gy - 3}" y2="${gy + cell * 10 + 3}" stroke="#e0457b" stroke-width="1.1" stroke-dasharray="3 2"/>`);
      });
      pages.push(pg.svg());
    }
    return pages;
  }
  const list = shuffle(SHAPES2D, rand);
  for (const answers of [false, true]) {
    if (answers && (o.key === false || kind === 'trace')) break;
    const title = kind === 'trace' ? 'Trace the shapes' : 'Name the shapes';
    const pg = new Page(paper, answers ? `${title}: answers` : title, { subtitle: answers ? 'Answer key for grown-ups.' : kind === 'trace' ? 'Trace each shape and its name, then colour it in.' : 'Write the name of each shape. Count its sides and corners.', noName: answers });
    const cols = 3, rows = 4, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    list.forEach(([name, sides], i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      const c = i % PALETTE.length;
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="6" fill="${TINTS[c]}"/>`);
      const r = Math.min(cw, ch) * 0.2;
      if (kind === 'trace') {
        pg.add(shape2d(name, x + cw / 2, y + ch * 0.4, r, `fill="#fff" stroke="#7d7799" stroke-width="0.8" stroke-dasharray="1.4 1.2" stroke-linejoin="round"`));
        const size = Math.min(7, (cw - 10) / (textWidth(name) / 100 + 0.2));
        pg.add(drawText(name, x + cw / 2 - (textWidth(name) / 200) * size, y + ch - 14, size, 'trace', true));
      } else {
        pg.add(shape2d(name, x + cw / 2, y + ch * 0.36, r, `fill="#fff" stroke="${PALETTE[c]}" stroke-width="1" stroke-linejoin="round"`));
        if (answers) pg.add(`<text x="${x + cw / 2}" y="${y + ch * 0.68}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="#e0457b">${name}</text>`);
        else pg.add(`<line x1="${x + 8}" x2="${x + cw - 8}" y1="${y + ch * 0.7}" y2="${y + ch * 0.7}" stroke="#9a93b8" stroke-width="0.4"/>`);
        if (sides !== null) {
          const ty = y + ch - 7;
          pg.add(`<text x="${x + 6}" y="${ty}" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${INK}">sides</text><rect x="${x + 16}" y="${ty - 4.2}" width="8" height="6" rx="1.2" fill="#fff" stroke="#9a93b8" stroke-width="0.4"/>`);
          pg.add(`<text x="${x + cw / 2 + 1}" y="${ty}" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${INK}">corners</text><rect x="${x + cw / 2 + 15}" y="${ty - 4.2}" width="8" height="6" rx="1.2" fill="#fff" stroke="#9a93b8" stroke-width="0.4"/>`);
          if (answers) pg.add(`<text x="${x + 20}" y="${ty}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.8" fill="#e0457b">${sides}</text><text x="${x + cw / 2 + 19}" y="${ty}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.8" fill="#e0457b">${sides}</text>`);
        }
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ measuring
function ruler(pg, x, y, unit, maxLen) {
  const mm = unit === 'inch' ? 25.4 : 10;
  const len = maxLen * mm;
  let s = `<rect x="${x - 3}" y="${y}" width="${len + 6}" height="11" rx="1.5" fill="#fff6d6" stroke="${INK}" stroke-width="0.5"/>`;
  const steps = unit === 'inch' ? maxLen * 4 : maxLen * 10;
  for (let i = 0; i <= steps; i++) {
    const tx = x + (i * len) / steps;
    const major = unit === 'inch' ? i % 4 === 0 : i % 10 === 0;
    const half = unit === 'inch' ? i % 2 === 0 : i % 5 === 0;
    const h = major ? 4.5 : half ? 3 : 1.8;
    s += `<line x1="${tx}" x2="${tx}" y1="${y}" y2="${y + h}" stroke="${INK}" stroke-width="${major ? 0.4 : 0.25}"/>`;
    if (major) s += `<text x="${tx}" y="${y + 9}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.2" fill="${INK}">${unit === 'inch' ? i / 4 : i / 10}</text>`;
  }
  s += `<text x="${x + len + 1}" y="${y + 9}" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="2.4" fill="${SOFT}">${unit === 'inch' ? 'in' : 'cm'}</text>`;
  pg.add(s);
}

function measureObject(kind, x, y, len, h, c) {
  const k = `stroke="${INK}" stroke-width="0.5" stroke-linejoin="round"`;
  if (kind === 'pencil') {
    const tip = Math.min(9, len * 0.18);
    return `<rect x="${x}" y="${y}" width="4" height="${h}" rx="1.4" fill="#ff9fb8" ${k}/><rect x="${x + 4}" y="${y}" width="3" height="${h}" fill="#cfd4dc" ${k}/>`
      + `<rect x="${x + 7}" y="${y}" width="${len - 7 - tip}" height="${h}" fill="${c}" ${k}/><path d="M${x + len - tip} ${y} L${x + len} ${y + h / 2} L${x + len - tip} ${y + h} Z" fill="#f3d5a8" ${k}/>`
      + `<path d="M${x + len - tip * 0.35} ${y + h * 0.33} L${x + len} ${y + h / 2} L${x + len - tip * 0.35} ${y + h * 0.67} Z" fill="${INK}"/>`;
  }
  if (kind === 'crayon') {
    const tip = Math.min(7, len * 0.15);
    return `<rect x="${x}" y="${y}" width="${len - tip}" height="${h}" rx="1.5" fill="${c}" ${k}/><rect x="${x + (len - tip) * 0.2}" y="${y}" width="${(len - tip) * 0.55}" height="${h}" fill="#fff" ${k}/>`
      + `<path d="M${x + len - tip} ${y + 0.8} L${x + len} ${y + h / 2} L${x + len - tip} ${y + h - 0.8} Z" fill="${c}" ${k}/>`;
  }
  if (kind === 'brush') {
    return `<rect x="${x}" y="${y + h * 0.3}" width="${len * 0.62}" height="${h * 0.4}" rx="1.5" fill="${c}" ${k}/><rect x="${x + len * 0.62}" y="${y + h * 0.2}" width="${len * 0.12}" height="${h * 0.6}" fill="#cfd4dc" ${k}/>`
      + `<path d="M${x + len * 0.74} ${y + h * 0.2} Q${x + len * 0.95} ${y + h * 0.2} ${x + len} ${y + h / 2} Q${x + len * 0.95} ${y + h * 0.8} ${x + len * 0.74} ${y + h * 0.8} Z" fill="#8d5524" ${k}/>`;
  }
  // caterpillar
  const n = Math.max(3, Math.round(len / h)), d = len / n;
  let s = '';
  for (let i = 0; i < n; i++) s += `<circle cx="${x + d * (i + 0.5)}" cy="${y + h / 2}" r="${d / 2}" fill="${i === n - 1 ? '#8bc34a' : i % 2 ? '#a5d86b' : '#c5e89b'}" ${k}/>`;
  const hx = x + d * (n - 0.5);
  return s + `<circle cx="${hx + d * 0.15}" cy="${y + h * 0.4}" r="${d * 0.08}" fill="${INK}"/><path d="M${hx} ${y + h / 2 - d / 2} l-1 -3 M${hx + d * 0.2} ${y + h / 2 - d / 2} l1 -3" stroke="${INK}" stroke-width="0.4"/>`;
}

function makeMeasuring(o, paper) {
  const rand = rng(+o.seed || 1);
  const unit = o.unit === 'inch' ? 'inch' : o.unit === 'cubes' ? 'cubes' : 'cm';
  const maxLen = unit === 'inch' ? 5 : 14;
  const kinds = ['pencil', 'crayon', 'brush', 'caterpillar'];
  const items = [];
  for (let i = 0; i < 6; i++) {
    const L = unit === 'inch' ? 2 + Math.floor(rand() * 4) : unit === 'cubes' ? 3 + Math.floor(rand() * 10) : 4 + Math.floor(rand() * 10);
    items.push({ L, kind: kinds[i % kinds.length], c: PALETTE[Math.floor(rand() * PALETTE.length)] });
  }
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const title = unit === 'cubes' ? 'How many cubes long?' : `Measure in ${unit === 'inch' ? 'inches' : 'centimetres'}`;
    const pg = new Page(paper, answers ? `${title}: answers` : title, { subtitle: answers ? 'Answer key for grown-ups.' : unit === 'cubes' ? 'Count the cubes under each picture. How long is it?' : 'Print at actual size (100%). Line the ruler up at 0 and read the length.', noName: answers });
    const rowH = (pg.room - 2) / items.length;
    items.forEach((it, i) => {
      const y = pg.y + i * rowH, x0 = pg.left + 8;
      const mm = unit === 'inch' ? it.L * 25.4 : it.L * 10;
      pg.add(measureObject(it.kind, x0, y + 5, mm, 8, it.c));
      if (unit === 'cubes') {
        for (let k = 0; k < it.L; k++) pg.add(`<rect x="${x0 + k * 10}" y="${y + 15}" width="10" height="10" fill="${TINTS[k % TINTS.length]}" stroke="${INK}" stroke-width="0.4"/>`);
      } else ruler(pg, x0, y + 15, unit, maxLen);
      const bx = pg.right - 30;
      const label = unit === 'cubes' ? 'cubes' : unit === 'inch' ? 'in' : 'cm';
      pg.add(`<rect x="${bx}" y="${y + 6}" width="14" height="10" rx="2" fill="#fff" stroke="${answers ? '#e0457b' : '#9a93b8'}" stroke-width="0.5"/><text x="${bx + 16}" y="${y + 13}" font-family="${FONT}" font-weight="800" font-size="4.4" fill="${INK}">${label}</text>`);
      if (answers) pg.add(`<text x="${bx + 7}" y="${y + 13.4}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="#e0457b">${it.L}</text>`);
      if (i < items.length - 1) pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${y + rowH - 1}" y2="${y + rowH - 1}" stroke="#ece9f6" stroke-width="0.4"/>`);
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ graphs
const GRAPH_SETS = {
  fruit: [['apples', 'apple'], ['bananas', 'banana'], ['strawberries', 'strawberry'], ['oranges', 'orange']],
  animals: [['cats', 'cat'], ['dogs', 'dog'], ['pigs', 'pig'], ['chicks', 'chick']],
  toys: [['balloons', 'balloon'], ['teddies', 'bear'], ['blocks', 'blocks'], ['stars', 'star']],
  treats: [['cupcakes', 'cupcake'], ['doughnuts', 'donut'], ['lollies', 'lolly'], ['cookies', 'cookie']],
};

function makeGraphs(o, paper) {
  const rand = rng(+o.seed || 1);
  const set = GRAPH_SETS[o.theme] || GRAPH_SETS.fruit;
  let counts;
  do { counts = set.map(() => 1 + Math.floor(rand() * 8)); } while (new Set(counts).size < counts.length);
  const kind = o.kind === 'tally' ? 'tally' : 'bar';
  // Scatter the pictures without overlaps.
  const slots = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 8; c++) slots.push([c, r]);
  const spots = shuffle(slots, rand);
  const placed = [];
  set.forEach(([, art], k) => { for (let i = 0; i < counts[k]; i++) placed.push({ art, slot: spots[placed.length] }); });
  const most = counts.indexOf(Math.max(...counts)), fewest = counts.indexOf(Math.min(...counts));
  const [a, b] = shuffle([0, 1, 2, 3], rand);
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Count and graph: answers' : kind === 'bar' ? 'Count and colour the graph' : 'Count and tally', { subtitle: answers ? 'Answer key for grown-ups.' : kind === 'bar' ? 'Count each picture. Colour one square for each one you count.' : 'Count each picture. Draw a tally mark for each one, then write the total.', noName: answers });
    const sceneH = 62;
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${sceneH}" rx="8" fill="#f4fbf1" stroke="#cfe6c4" stroke-width="0.6"/>`);
    const cw = pg.width / 8, rh = sceneH / 5;
    placed.forEach(({ art, slot: [c, r] }) => pg.add(pic(ART(art), pg.left + cw * (c + 0.5) + (rand() - 0.5) * 3, pg.y + rh * (r + 0.5), rh * 0.95)));
    let y = pg.y + sceneH + 6;
    if (kind === 'bar') {
      const gh = 8, cell = Math.min(11, (pg.room - sceneH - 60) / gh);
      const colW = 26, gx = pg.left + 14;
      for (let r = 0; r < gh; r++) {
        pg.add(`<text x="${gx - 3}" y="${y + (gh - r - 0.5) * cell + 1.5}" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${SOFT}">${r + 1}</text>`);
        set.forEach((_, k) => pg.add(`<rect x="${gx + k * colW + 4}" y="${y + (gh - r - 1) * cell}" width="${colW - 8}" height="${cell}" fill="${answers && r < counts[k] ? PALETTE[k * 2 % PALETTE.length] : '#fff'}" stroke="#9a93b8" stroke-width="0.35"/>`));
      }
      set.forEach(([name, art], k) => {
        pg.add(pic(ART(art), gx + k * colW + colW / 2, y + gh * cell + 7, 10));
        pg.add(`<text x="${gx + k * colW + colW / 2}" y="${y + gh * cell + 16}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${INK}">${name}</text>`);
      });
      y += gh * cell + 22;
    } else {
      set.forEach(([name, art], k) => {
        const ry = y + k * 16;
        pg.add(`<rect x="${pg.left}" y="${ry}" width="${pg.width}" height="14" rx="3" fill="${TINTS[k]}"/>`);
        pg.add(pic(ART(art), pg.left + 9, ry + 7, 11));
        pg.add(`<text x="${pg.left + 18}" y="${ry + 8.6}" font-family="${FONT}" font-weight="800" font-size="4.2" fill="${INK}">${name}</text>`);
        pg.add(`<rect x="${pg.right - 18}" y="${ry + 2}" width="14" height="10" rx="2" fill="#fff" stroke="#9a93b8" stroke-width="0.4"/>`);
        if (answers) {
          const n = counts[k];
          for (let i = 0; i < n; i++) {
            const grp = Math.floor(i / 5), inG = i % 5, tx = pg.left + 60 + grp * 16 + inG * 2.6;
            if (inG === 4) pg.add(`<line x1="${tx - 12}" y1="${ry + 10.5}" x2="${tx + 1}" y2="${ry + 3.5}" stroke="#e0457b" stroke-width="0.6"/>`);
            else pg.add(`<line x1="${tx}" y1="${ry + 3}" x2="${tx}" y2="${ry + 11}" stroke="#e0457b" stroke-width="0.6"/>`);
          }
          pg.add(`<text x="${pg.right - 11}" y="${ry + 9}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="#e0457b">${n}</text>`);
        }
      });
      y += 4 * 16 + 6;
    }
    const qs = [[`Which is there the most of?`, set[most][0]], [`Which is there the fewest of?`, set[fewest][0]], [`How many ${set[a][0]} and ${set[b][0]} altogether?`, counts[a] + counts[b]]];
    qs.forEach(([q, ans], i) => {
      const qy = y + i * 11;
      if (qy + 8 > pg.bottom) return;
      pg.add(`<text x="${pg.left}" y="${qy + 5}" font-family="${FONT}" font-weight="800" font-size="4.4" fill="${INK}">${i + 1}. ${esc(q)}</text>`);
      if (answers) pg.add(`<text x="${pg.right}" y="${qy + 5}" text-anchor="end" font-family="${TITLE_FONT}" font-weight="800" font-size="5" fill="#e0457b">${ans}</text>`);
      else pg.add(`<line x1="${pg.right - 40}" x2="${pg.right}" y1="${qy + 6}" y2="${qy + 6}" stroke="#9a93b8" stroke-width="0.4"/>`);
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ reading log
const READ_CHALLENGES = [['img/dog.webp', 'Read to a pet or a teddy'], ['🏕️', 'Read in a den'], ['🔦', 'Read with a torch'], ['img/star.webp', 'Read a book about space'],
  ['🌳', 'Read outside'], ['😂', 'Read a funny book'], ['👵', 'Read to a grandparent'], ['📜', 'Read a poem'],
  ['img/lion.webp', 'Read about animals'], ['💬', 'Read a comic'], ['🔁', 'Read a book twice'], ['🧁', 'Read a recipe'],
  ['🛏️', 'Read before bed'], ['🤝', 'Read with a friend'], ['🎨', 'Draw your favourite part'], ['📚', 'Choose a new library book']];

function makeReadingLog(o, paper) {
  const name = nameOf(o.name, '');
  const pages = [];
  if (o.log !== false) {
    const pg = new Page(paper, name ? `${possessive(name)} Reading Log` : 'My Reading Log', { subtitle: 'Write down every book you read. Circle how much you liked it!', noName: true });
    const cols = [['Date', 22], ['Book title', 0], ['Minutes', 20], ['Did I like it?', 36], ['Grown-up', 22]];
    const fixed = cols.reduce((s, [, w]) => s + w, 0);
    cols[1][1] = pg.width - fixed;
    let x = pg.left;
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="9" rx="3" fill="#6c8cff"/>`);
    cols.forEach(([h, w]) => { pg.add(`<text x="${x + w / 2}" y="${pg.y + 6.2}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.8" fill="#fff">${h}</text>`); x += w; });
    const rows = Math.floor((pg.room - 12) / 13);
    for (let r = 0; r < rows; r++) {
      const y = pg.y + 11 + r * 13;
      pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="12" rx="2" fill="${r % 2 ? '#fff' : '#f6f4ff'}" stroke="#e3def3" stroke-width="0.3"/>`);
      let fx = pg.left;
      cols.forEach(([h, w], k) => {
        if (k) pg.add(`<line x1="${fx}" x2="${fx}" y1="${y}" y2="${y + 12}" stroke="#e3def3" stroke-width="0.3"/>`);
        if (h === 'Did I like it?') ['happy', 'calm', 'sad'].forEach((m, j) => pg.add(face(fx + 7 + j * 11, y + 6, 4, m, false)));
        fx += w;
      });
    }
    pages.push(pg.svg());
  }
  if (o.shelf !== false) {
    const pg = new Page(paper, name ? `${possessive(name)} Bookshelf` : 'My Bookshelf', { subtitle: 'Each time you finish a book, write its title on a spine and colour it in.', noName: true });
    const shelves = 4, sh = (pg.room - 30) / shelves;
    const rand = rng(7);
    for (let s = 0; s < shelves; s++) {
      const y = pg.y + s * sh;
      let x = pg.left + 4;
      while (x < pg.right - 14) {
        const w = 11 + rand() * 7, h = sh - 10 - rand() * 12;
        if (x + w > pg.right - 4) break;
        const lean = rand() < 0.1 && x > pg.left + 30;
        pg.add(`<g ${lean ? `transform="rotate(-8 ${x} ${y + sh - 4})"` : ''}><rect x="${x}" y="${y + sh - 4 - h}" width="${w}" height="${h}" rx="1.5" fill="#fff" stroke="${INK}" stroke-width="0.5"/><line x1="${x + 2}" x2="${x + w - 2}" y1="${y + sh - 4 - h + 5}" y2="${y + sh - 4 - h + 5}" stroke="${INK}" stroke-width="0.3"/><line x1="${x + 2}" x2="${x + w - 2}" y1="${y + sh - 10}" y2="${y + sh - 10}" stroke="${INK}" stroke-width="0.3"/></g>`);
        x += w + 1.2;
      }
      pg.add(`<rect x="${pg.left}" y="${y + sh - 4}" width="${pg.width}" height="4" rx="1" fill="#e8c9a0" stroke="${INK}" stroke-width="0.5"/>`);
    }
    const fy = pg.bottom - 24;
    pg.add(`<rect x="${pg.left}" y="${fy}" width="${pg.width}" height="22" rx="6" fill="#fff6e0" stroke="#ffb938" stroke-width="0.6" stroke-dasharray="2.5 1.5"/>`);
    pg.add(pic(ART('present'), pg.left + 12, fy + 11, 14));
    pg.add(`<text x="${pg.left + 24}" y="${fy + 9}" font-family="${FONT}" font-weight="800" font-size="4" fill="${SOFT}">When my shelf is full, I get:</text><line x1="${pg.left + 24}" x2="${pg.right - 6}" y1="${fy + 17}" y2="${fy + 17}" stroke="#9a93b8" stroke-width="0.4"/>`);
    pages.push(pg.svg());
  }
  if (o.challenge !== false) {
    const pg = new Page(paper, 'Reading challenge', { subtitle: 'Tick a box each time you do one. Can you do them all?', noName: !!name });
    const cols = 4, rows = 4, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    READ_CHALLENGES.forEach(([src, label], i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      const c = i % PALETTE.length;
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="7" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
      pg.add(pic(P(src), x + cw / 2, y + ch * 0.34, Math.min(cw, ch) * 0.36));
      textLines(pg, wrap(label, 15), x + cw / 2, y + ch * 0.66, 4.2, { anchor: 'middle', weight: 800 });
      pg.add(`<rect x="${x + cw - 10}" y="${y + ch - 10}" width="6" height="6" rx="1.4" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`);
    });
    pages.push(pg.svg());
  }
  if (!pages.length) pages.push(new Page(paper, 'Reading log', { subtitle: 'Tick at least one page.', noName: true }).svg());
  return pages;
}

// ================================================================ handwriting paper
function makePaper(o, paper) {
  const size = { big: 18, medium: 13, small: 9 }[o.lines] || 13;
  const style = o.style || 'rainbow';
  const pg = new Page(paper, (o.title || '').trim() || 'My writing', { subtitle: '' });
  if (o.picture === true) {
    const ph = Math.min(100, pg.room * 0.42);
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${ph}" rx="6" fill="#fff" stroke="${INK}" stroke-width="0.7"/>`);
    pg.y += ph + 8;
  }
  const rh = rowHeight(size) * (style === 'plain' ? 0.62 : 0.95);
  while (pg.room >= rh) {
    if (style === 'plain') {
      pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${pg.y + rh * 0.9}" y2="${pg.y + rh * 0.9}" stroke="#9a93b8" stroke-width="0.4"/>`);
    } else if (style === 'rainbow') {
      const y = pg.y, base = y + size;
      pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${y}" y2="${y}" stroke="#6c8cff" stroke-width="0.5"/>`);
      pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${y + size / 2}" y2="${y + size / 2}" stroke="#8bc34a" stroke-width="0.4" stroke-dasharray="1.8 1.4"/>`);
      pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${base}" y2="${base}" stroke="#ff6b6b" stroke-width="0.6"/>`);
      pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${base + size / 2}" y2="${base + size / 2}" stroke="#e8e4f3" stroke-width="0.35"/>`);
    } else pg.guides(pg.y, size);
    pg.y += rh;
  }
  if (o.border === true) {
    pg.add(`<rect x="${pg.m - 5}" y="${pg.m - 5}" width="${pg.w - 2 * pg.m + 10}" height="${pg.h - 2 * pg.m + 6}" rx="8" fill="none" stroke="#ffb938" stroke-width="1" stroke-dasharray="4 3"/>`);
  }
  return [pg.svg()];
}

// ================================================================ story writing
const STORY_PROMPTS = {
  dragon: { title: 'The Dragon at the Door', pic: '🐉', starter: 'One morning there was a knock at the door. It was a dragon!', words: ['dragon', 'door', 'fire', 'friend', 'fly'] },
  seed: { title: 'The Magic Seed', pic: '🌱', starter: 'I planted a tiny seed, and in the night it grew and grew...', words: ['seed', 'magic', 'tall', 'climb', 'giant'] },
  moon: { title: 'My Trip to the Moon', pic: '🚀', starter: 'I climbed into my rocket and counted: 3, 2, 1, blast off!', words: ['rocket', 'moon', 'stars', 'float', 'planet'] },
  cat: { title: 'The Talking Cat', pic: 'img/cat.webp', starter: 'My cat looked up at me and said...', words: ['cat', 'talk', 'secret', 'whisper', 'surprise'] },
  sea: { title: 'Under the Sea', pic: 'img/octopus.webp', starter: 'I put on my flippers and dived into the blue sea.', words: ['fish', 'shell', 'octopus', 'bubbles', 'swim'] },
  birthday: { title: 'The Best Birthday', pic: 'img/cake.webp', starter: 'When I woke up on my birthday, I could not believe my eyes!', words: ['cake', 'party', 'present', 'balloon', 'friends'] },
  puppy: { title: 'The Lost Puppy', pic: 'img/dog.webp', starter: 'I found a little puppy all alone in the park.', words: ['puppy', 'lost', 'home', 'help', 'happy'] },
  power: { title: 'If I Had a Superpower', pic: '🦸', starter: 'If I could have one superpower, I would choose...', words: ['fly', 'strong', 'invisible', 'fast', 'help'] },
};

function makeStoryWriting(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '');
  const key = STORY_PROMPTS[o.prompt] ? o.prompt : Object.keys(STORY_PROMPTS)[Math.floor(rand() * Object.keys(STORY_PROMPTS).length)];
  const pr = STORY_PROMPTS[key];
  const size = o.lines === 'small' ? 8 : 10.5;
  const pages = [];
  if (o.layout === 'comic') {
    const pg = new Page(paper, name ? `${possessive(name)} comic: ${pr.title}` : `My comic: ${pr.title}`, { subtitle: 'Draw what happens in each box. Write words in the speech bubbles and on the lines.', noName: !!name });
    const cols = 2, rows = 3, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    for (let i = 0; i < 6; i++) {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      const bh = ch - 16;
      pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${bh}" rx="3" fill="#fff" stroke="${INK}" stroke-width="0.9"/>`);
      pg.add(`<circle cx="${x + 9}" cy="${y + 9}" r="4" fill="${PALETTE[i]}"/><text x="${x + 9}" y="${y + 10.6}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4" fill="#fff">${i + 1}</text>`);
      const bx = x + cw - 42, by = y + 7;
      pg.add(`<path d="M${bx} ${by + 7} Q${bx} ${by} ${bx + 18} ${by} Q${bx + 36} ${by} ${bx + 36} ${by + 7} Q${bx + 36} ${by + 14} ${bx + 18} ${by + 14} L${bx + 10} ${by + 20} L${bx + 12} ${by + 14} Q${bx} ${by + 14} ${bx} ${by + 7} Z" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`);
      pg.add(`<line x1="${x + 4}" x2="${x + cw - 4}" y1="${y + bh + 8}" y2="${y + bh + 8}" stroke="#9a93b8" stroke-width="0.4"/>`);
    }
    return [pg.svg()];
  }
  const pg = new Page(paper, pr.title, { subtitle: name ? `A story by ${name}` : 'A story by ____________________', noName: true });
  const topH = 58;
  pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width * 0.58}" height="${topH}" rx="6" fill="#fff" stroke="${INK}" stroke-width="0.7"/>`);
  pg.add(pic(P(pr.pic), pg.left + 18, pg.y + 18, 24));
  pg.add(`<text x="${pg.left + pg.width * 0.29 + 10}" y="${pg.y + topH - 5}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="3.4" fill="${SOFT}">Draw your story here</text>`);
  const wx = pg.left + pg.width * 0.58 + 5, ww = pg.width * 0.42 - 5;
  pg.add(`<rect x="${wx}" y="${pg.y}" width="${ww}" height="${topH}" rx="6" fill="#fff6e0" stroke="#ffb938" stroke-width="0.6"/>`);
  pg.add(`<text x="${wx + 5}" y="${pg.y + 8}" font-family="${FONT}" font-weight="800" font-size="4" fill="${SOFT}">Words to help you</text>`);
  pr.words.forEach((w, i) => pg.add(`<text x="${wx + 8}" y="${pg.y + 17 + i * 8.5}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="${INK}">• ${w}</text>`));
  pg.y += topH + 8;
  const lines = wrap(pr.starter, Math.floor((pg.width - 6) / (size * 0.46)));
  pg.add(`<text x="${pg.left}" y="${pg.y + 3}" font-family="${FONT}" font-weight="800" font-size="3.8" fill="${SOFT}">Start like this, then carry on:</text>`);
  pg.y += 7;
  const rh = rowHeight(size) * 0.92;
  let li = 0;
  while (pg.room >= rh) {
    pg.guides(pg.y, size);
    if (li < lines.length) pg.add(`<text x="${pg.left + 2}" y="${pg.y + size - 0.5}" font-family="${FONT}" font-weight="700" font-size="${size * 0.95}" fill="#b0aac8">${esc(lines[li])}</text>`);
    li++;
    pg.y += rh;
  }
  pages.push(pg.svg());
  return pages;
}

// ================================================================ name labels
const ALPHA_LINE = 'Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz';

function makeLabels(o, paper) {
  const names = listOf(o.names, 40).map((n) => nameOf(n, ''));
  if (!names.length) names.push('Mia', 'Leo', 'Emma', 'Sam');
  const arts = ['cat', 'dog', 'lion', 'turtle', 'monkey', 'octopus', 'pig', 'zebra', 'bear', 'chick', 'fish', 'ladybird', 'gorilla', 'star', 'rainbow', 'sunflower'];
  const kind = o.kind || 'desk';
  const pages = [];
  if (kind === 'desk') {
    for (let i = 0; i < names.length; i += 3) {
      const pg = new Page(paper, '', { bare: true });
      const h = (pg.bottom - pg.m) / 3;
      names.slice(i, i + 3).forEach((n, j) => {
        const y = pg.m + j * h, c = (i + j) % PALETTE.length;
        pg.add(`<rect x="${pg.left}" y="${y + 2}" width="${pg.width}" height="${h - 6}" rx="8" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="1"/>`);
        pg.add(pic(ART(arts[(i + j) % arts.length]), pg.left + 20, y + 26, 30));
        pg.add(`<text x="${pg.left + 42}" y="${y + 34}" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(n, 22, pg.width - 60, 0.55).toFixed(2)}" fill="${INK}">${esc(n)}</text>`);
        pg.add(`<text x="${pg.w / 2}" y="${y + h - 26}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${Math.min(4.4, (pg.width - 10) / (ALPHA_LINE.length * 0.56)).toFixed(2)}" fill="${INK}">${ALPHA_LINE}</text>`);
        // Number line 0 to 20
        const nx = pg.left + 8, nw = pg.width - 16, ny = y + h - 15;
        pg.add(`<line x1="${nx}" x2="${nx + nw}" y1="${ny}" y2="${ny}" stroke="${INK}" stroke-width="0.5"/>`);
        for (let k = 0; k <= 20; k++) {
          const tx = nx + (k * nw) / 20;
          pg.add(`<line x1="${tx}" x2="${tx}" y1="${ny - 1.6}" y2="${ny + 1.6}" stroke="${INK}" stroke-width="0.4"/><text x="${tx}" y="${ny + 6}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${INK}">${k}</text>`);
        }
      });
      pages.push(pg.svg());
    }
    return pages;
  }
  // Book and peg labels, 12 to a page
  const per = 12;
  for (let i = 0; i < Math.max(names.length, 1); i += per) {
    const pg = new Page(paper, '', { bare: true });
    const cols = 3, rows = 4, cw = pg.width / cols, ch = (pg.bottom - pg.m) / rows;
    const list = names.length >= per || o.repeat === false ? names.slice(i, i + per) : [...Array(per)].map((_, k) => names[k % names.length]);
    list.forEach((n, k) => {
      const x = pg.left + (k % cols) * cw, y = pg.m + Math.floor(k / cols) * ch, c = (i + k) % PALETTE.length;
      pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="9" fill="#fff" stroke="${PALETTE[c]}" stroke-width="1"/>`);
      pg.add(`<rect x="${x + 4.5}" y="${y + 4.5}" width="${cw - 9}" height="${ch - 9}" rx="7" fill="${TINTS[c]}"/>`);
      pg.add(pic(ART(arts[(names.indexOf(n) + arts.length) % arts.length]), x + cw / 2, y + ch * 0.38, ch * 0.42));
      pg.add(`<text x="${x + cw / 2}" y="${y + ch * 0.82}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(n, 9, cw - 14, 0.55).toFixed(2)}" fill="${INK}">${esc(n)}</text>`);
    });
    pages.push(pg.svg());
  }
  return pages;
}

Object.assign(MAKERS, { placevalue: makePlaceValue, shapes: makeShapes, measuring: makeMeasuring, graphs: makeGraphs, readinglog: makeReadingLog, writingpaper: makePaper, storywriting: makeStoryWriting, labels: makeLabels });
