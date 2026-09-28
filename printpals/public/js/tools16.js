// PrintPals batch 16: paper games, scissor skills, ten frames, story sequencing, screen-free coding,
// animal fact files, pet care chart and a holiday diary.

// ================================================================ paper games
function makePaperGames(o, paper) {
  const rand = rng(+o.seed || 1);
  const pages = [];
  if (o.noughts !== false) {
    const pg = new Page(paper, 'Noughts and crosses', { subtitle: 'Take turns to draw X or O. Get three in a row to win! Keep score at the bottom.', noName: true });
    const cols = 3, rows = 4, cw = pg.width / cols, ch = (pg.room - 30) / rows, s = Math.min(cw, ch) - 14;
    for (let i = 0; i < cols * rows; i++) {
      const cx = pg.left + (i % cols) * cw + cw / 2, cy = pg.y + Math.floor(i / cols) * ch + ch / 2, c = PALETTE[i % PALETTE.length], x0 = cx - s / 2, y0 = cy - s / 2;
      for (let k = 1; k < 3; k++) pg.add(`<line x1="${x0 + k * s / 3}" x2="${x0 + k * s / 3}" y1="${y0}" y2="${y0 + s}" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/><line x1="${x0}" x2="${x0 + s}" y1="${y0 + k * s / 3}" y2="${y0 + k * s / 3}" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>`);
    }
    const ty = pg.y + rows * ch + 4, tw = pg.width / 3;
    [['X wins', '#ff6b6b'], ['O wins', '#6c8cff'], ['Draws', '#3fbfa8']].forEach(([t, c], k) => pg.add(panel(pg.left + k * tw + 2, ty, tw - 4, 24, '#fff', c, 6) + txt(pg.left + k * tw + tw / 2, ty + 8, t, 5.4, { colour: c })));
    pages.push(pg.svg());
  }
  if (o.dots !== false) {
    const pg = new Page(paper, 'Dots and boxes', { subtitle: 'Take turns to join two dots with a line. Finish a box? Write your letter in it and have another go!', noName: true });
    pg.add(txt(pg.left, pg.y + 6, 'Player 1:', 5.4, { anchor: 'start', colour: '#ff6b6b' }) + `<line x1="${pg.left + 26}" x2="${pg.left + 70}" y1="${pg.y + 6.5}" y2="${pg.y + 6.5}" stroke="#c9c3e3" stroke-width="0.5"/>`
      + txt(pg.w / 2 + 4, pg.y + 6, 'Player 2:', 5.4, { anchor: 'start', colour: '#6c8cff' }) + `<line x1="${pg.w / 2 + 30}" x2="${pg.right}" y1="${pg.y + 6.5}" y2="${pg.y + 6.5}" stroke="#c9c3e3" stroke-width="0.5"/>`);
    pg.y += 14;
    const n = 9, gap = Math.min(pg.width / (n - 1) - 1, (pg.room - 6) / (n + 1)), gw = gap * (n - 1), x0 = pg.w / 2 - gw / 2;
    const rowsN = Math.floor((pg.room - 4) / gap);
    for (let r = 0; r <= rowsN; r++) for (let c = 0; c < n; c++) pg.add(`<circle cx="${x0 + c * gap}" cy="${pg.y + 2 + r * gap}" r="1.3" fill="${INK}"/>`);
    pages.push(pg.svg());
  }
  if (o.guess !== false) {
    const pg = new Page(paper, 'Guess the word, draw the monster', { subtitle: 'One player thinks of a word and draws a dash for each letter. Every wrong guess adds a part to the silly monster!', noName: true });
    const parts = ['Body', 'Eyes', 'Mouth', 'Arms', 'Legs', 'Hair', 'Hat', 'Shoes'];
    const bh = (pg.room - 4) / 3;
    for (let g = 0; g < 3; g++) {
      const y = pg.y + g * bh, c = PALETTE[g * 2];
      pg.add(panel(pg.left, y + 1, pg.width, bh - 4, '#fff', c, 8));
      pg.add(`<rect x="${pg.right - 56}" y="${y + 6}" width="50" height="${bh - 16}" rx="6" fill="${TINTS[g * 2]}" stroke="${c}" stroke-width="0.5" stroke-dasharray="2 1.5"/>` + txt(pg.right - 31, y + 12, 'Draw the monster', 4, { font: FONT, colour: SOFT }));
      for (let k = 0; k < 8; k++) pg.add(`<line x1="${pg.left + 8 + k * 16}" x2="${pg.left + 20 + k * 16}" y1="${y + 24}" y2="${y + 24}" stroke="${INK}" stroke-width="0.8" stroke-linecap="round"/>`);
      const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lw = (pg.width - 70) / 13;
      [...abc].forEach((l, k) => pg.add(txt(pg.left + 8 + (k % 13) * lw + lw / 2, y + 38 + Math.floor(k / 13) * 9, l, 5.4, { colour: c })));
      pg.add(txt(pg.left + 8, y + bh - 10, parts.map((p, k) => `${k + 1} ${p}`).join('   '), fitFont(parts.join('    ') + '0000000000000000', 4, pg.width - 76, 0.5), { anchor: 'start', font: FONT, colour: SOFT }));
    }
    pages.push(pg.svg());
  }
  if (o.squiggles !== false) {
    const pg = new Page(paper, 'Squiggle pictures', { subtitle: 'What could each squiggle become? Turn it into a picture, then give it a name.', noName: true });
    const cols = 2, rows = 3, cw = pg.width / cols, ch = pg.room / rows;
    for (let i = 0; i < 6; i++) {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch, c = PALETTE[i % PALETTE.length];
      pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, '#fff', c, 8));
      let px = x + cw * (0.3 + rand() * 0.2), py = y + ch * (0.3 + rand() * 0.25), d = `M${px.toFixed(1)} ${py.toFixed(1)}`;
      for (let k = 0; k < 3; k++) {
        const nx = x + cw * (0.25 + rand() * 0.5), ny = y + ch * (0.25 + rand() * 0.4);
        d += ` Q${(x + cw * (0.15 + rand() * 0.7)).toFixed(1)} ${(y + ch * (0.15 + rand() * 0.55)).toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}`;
      }
      pg.add(`<path d="${d}" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>` + txt(x + 8, y + ch - 9, 'It is a', 4.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${x + 24}" x2="${x + cw - 10}" y1="${y + ch - 8.5}" y2="${y + ch - 8.5}" stroke="#c9c3e3" stroke-width="0.45"/>`);
    }
    pages.push(pg.svg());
  }
  if (!pages.length) pages.push(new Page(paper, 'Paper games', { subtitle: 'Tick at least one game to print.', noName: true }).svg());
  return pages;
}

// ================================================================ scissor skills
function makeScissors(o, paper) {
  const level = o.level || 'straight';
  const ends = ['🐶', '🐱', '🐰', '🐸', '🐵', '🐼', '🦊', '🐷'];
  const foods = ['🦴', '🐟', '🥕', '🪰', '🍌', '🎋', '🍇', '🍎'];
  const names = { straight: 'Straight lines', zigzag: 'Zigzag lines', wavy: 'Wavy lines', shapes: 'Cut out the shapes', spiral: 'Spirals' };
  const pg = new Page(paper, `Scissor skills: ${names[level] ? names[level].toLowerCase() : 'straight lines'}`, { subtitle: 'Cut along the dashed lines. Help each animal reach its food! Always use safety scissors, with a grown-up nearby.' });
  const dash = (d, c) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="3 2" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (level === 'shapes') {
    const cols = 2, rows = 3, cw = pg.width / cols, ch = pg.room / rows, r = Math.min(cw, ch) * 0.36;
    const shapes = [
      (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`, (cx, cy) => `<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}"/>`,
      (cx, cy) => `<path d="M${cx} ${cy - r} L${cx + r} ${cy + r * 0.8} L${cx - r} ${cy + r * 0.8} Z"/>`, (cx, cy) => `<path d="M${cx} ${cy + r * 0.9} C${cx - r * 1.5} ${cy - r * 0.1} ${cx - r * 0.6} ${cy - r * 1.2} ${cx} ${cy - r * 0.45} C${cx + r * 0.6} ${cy - r * 1.2} ${cx + r * 1.5} ${cy - r * 0.1} ${cx} ${cy + r * 0.9} Z"/>`,
      (cx, cy) => `<path d="${starPath(cx, cy, r * 1.05, 0.5)}"/>`, (cx, cy) => `<path d="M${cx - r} ${cy + r * 0.9} L${cx - r} ${cy - r * 0.1} L${cx} ${cy - r} L${cx + r} ${cy - r * 0.1} L${cx + r} ${cy + r * 0.9} Z"/>`,
    ];
    const labels = ['Circle', 'Square', 'Triangle', 'Heart', 'Star', 'House'];
    shapes.forEach((f, i) => {
      const cx = pg.left + (i % cols) * cw + cw / 2, cy = pg.y + Math.floor(i / cols) * ch + ch / 2 - 3, c = PALETTE[i % PALETTE.length];
      pg.add(`<g fill="${TINTS[i % TINTS.length]}" stroke="${c}" stroke-width="1" stroke-dasharray="3 2" stroke-linejoin="round">${f(cx, cy)}</g>` + txt(cx, cy + r + 9, labels[i], 5.4, { colour: c }));
    });
    return [pg.svg()];
  }
  if (level === 'spiral') {
    for (let s = 0; s < 2; s++) {
      const cx = pg.w / 2, cy = pg.y + pg.room * (s ? 0.75 : 0.25), R = Math.min(pg.width / 2 - 6, pg.room / 4 - 6), c = PALETTE[s * 3];
      let d = '';
      const turns = 3, steps = 180;
      for (let k = 0; k <= steps; k++) { const t = k / steps, a = t * turns * 2 * Math.PI, rr = R * (1 - t * 0.82); d += `${k ? 'L' : 'M'}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)} `; }
      pg.add(dash(d, c) + emoji('✂️', cx + R + 1, cy - 6, 8) + emoji(s ? '🐌' : '🍭', cx, cy, R * 0.28));
    }
    return [pg.svg()];
  }
  const rows = level === 'straight' ? 8 : 7, rh = pg.room / rows;
  for (let i = 0; i < rows; i++) {
    const cy = pg.y + i * rh + rh / 2, c = PALETTE[i % PALETTE.length], x0 = pg.left + 16, x1 = pg.right - 16, amp = rh * 0.28;
    let d = `M${x0} ${cy}`;
    if (level === 'zigzag') { const n = 8 + (i % 3) * 2, w = (x1 - x0) / n; for (let k = 1; k <= n; k++) d += ` L${(x0 + k * w).toFixed(1)} ${(cy + (k === n ? 0 : (k % 2 ? -amp : amp))).toFixed(1)}`; }
    else if (level === 'wavy') { const n = 4 + (i % 3), w = (x1 - x0) / n; for (let k = 0; k < n; k++) d += ` Q${(x0 + k * w + w / 2).toFixed(1)} ${(cy + (k % 2 ? amp * 2 : -amp * 2)).toFixed(1)} ${(x0 + (k + 1) * w).toFixed(1)} ${cy}`; }
    else d += ` L${x1} ${cy}`;
    pg.add(dash(d, c) + emoji(ends[i % 8], pg.left + 7, cy, Math.min(11, rh * 0.5)) + emoji(foods[i % 8], pg.right - 7, cy, Math.min(10, rh * 0.45)));
  }
  return [pg.svg()];
}

// ================================================================ ten frames
function drawTenFrame(pg, x, y, cell, filled, colour, second = 0, colour2 = '#ffb938') {
  let s = `<rect x="${x}" y="${y}" width="${cell * 5}" height="${cell * 2}" rx="1.5" fill="#fff" stroke="${INK}" stroke-width="0.7"/>`;
  for (let k = 1; k < 5; k++) s += `<line x1="${x + k * cell}" x2="${x + k * cell}" y1="${y}" y2="${y + cell * 2}" stroke="${INK}" stroke-width="0.5"/>`;
  s += `<line x1="${x}" x2="${x + cell * 5}" y1="${y + cell}" y2="${y + cell}" stroke="${INK}" stroke-width="0.5"/>`;
  for (let k = 0; k < filled + second && k < 10; k++) s += `<circle cx="${x + (k % 5) * cell + cell / 2}" cy="${y + Math.floor(k / 5) * cell + cell / 2}" r="${cell * 0.34}" fill="${k < filled ? colour : colour2}"/>`;
  pg.add(s);
}

function makeTenFrames(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'count';
  const R = (a, b) => a + Math.floor(rand() * (b - a + 1));
  const twenty = kind === 'twenty';
  const n = twenty ? 8 : 12;
  const items = [];
  const seen = [];
  for (let i = 0; i < n; i++) { let v; for (let t = 0; t < 20; t++) { v = twenty ? R(11, 20) : kind === 'make10' ? R(1, 9) : R(1, 10); if (!seen.includes(v) || seen.length >= (twenty ? 10 : 9)) break; } seen.push(v); items.push(v); }
  const titles = { count: ['How many?', 'Count the dots in each ten frame. Write the number in the box.'], show: ['Show the number', 'Draw dots in the ten frame to show each number.'], make10: ['Make 10', 'How many more dots make 10? Draw them in, then write the number.'], twenty: ['Count to 20', 'Count the dots in both ten frames. Write how many altogether.'] };
  const [title, sub] = titles[kind] || titles.count;
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && (o.key === false || kind === 'show')) break;
    const pg = new Page(paper, answers ? `${title}: answers` : title, { subtitle: answers ? 'Answer key for grown-ups.' : sub, noName: answers });
    const cols = 2, rows = n / cols, cw = pg.width / cols, ch = pg.room / rows;
    const cell = Math.min((cw - 40) / 5, (twenty ? (ch - 8) / 4.3 : (ch - 8) / 2));
    items.forEach((v, i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch, c = PALETTE[i % PALETTE.length], fh = twenty ? cell * 4.3 : cell * 2;
      const fx = x + 6, fy = y + ch / 2 - fh / 2;
      if (kind === 'show') {
        drawTenFrame(pg, fx, fy, cell, 0, c);
        pg.add(`<circle cx="${x + cw - 17}" cy="${y + ch / 2}" r="9" fill="${TINTS[i % TINTS.length]}" stroke="${c}" stroke-width="0.8"/>` + txt(x + cw - 17, y + ch / 2 + 3.4, v, 10, { colour: c }));
        return;
      }
      if (twenty) { drawTenFrame(pg, fx, fy, cell, 10, c); drawTenFrame(pg, fx, fy + cell * 2.3, cell, v - 10, c); }
      else drawTenFrame(pg, fx, fy, cell, v, c, answers && kind === 'make10' ? 10 - v : 0);
      const ans = kind === 'make10' ? 10 - v : v;
      pg.add(`<rect x="${x + cw - 28}" y="${y + ch / 2 - 8}" width="20" height="16" rx="3" fill="#fff" stroke="${c}" stroke-width="0.8"/>`);
      if (kind === 'make10') pg.add(txt(x + cw - 32, y + ch / 2 + 2, '+', 7, { colour: SOFT }));
      if (answers) pg.add(txt(x + cw - 18, y + ch / 2 + 3.4, ans, 9, { colour: '#e0457b' }));
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ story sequencing
const SEQUENCES = {
  plant: ['Growing a flower', [['🌰', 'Plant a seed'], ['💧', 'Give it water'], ['🌱', 'A shoot grows'], ['🌻', 'A flower opens']]],
  sandwich: ['Making a sandwich', [['🍞', 'Take two slices of bread'], ['🧈', 'Spread the butter'], ['🧀', 'Add the cheese'], ['🥪', 'Time to eat!']]],
  snowman: ['A snowy day', [['🌨️', 'Snow falls'], ['🧤', 'Put on gloves and a hat'], ['⛄', 'Build a snowman'], ['☕', 'Warm up with a hot drink']]],
  morning: ['Getting ready', [['⏰', 'Wake up'], ['🪥', 'Brush teeth'], ['👕', 'Get dressed'], ['🎒', 'Off to school']]],
  chick: ['From egg to hen', [['🥚', 'An egg'], ['🐣', 'The egg cracks'], ['🐥', 'A fluffy chick'], ['🐔', 'A big hen']]],
  rain: ['Rain and rainbow', [['☀️', 'A sunny morning'], ['☁️', 'Grey clouds come'], ['🌧️', 'Rain falls'], ['🌈', 'The sun comes back and a rainbow shines']]],
};

function makeSequencing(o, paper) {
  const rand = rng(+o.seed || 1);
  const keys = Object.keys(SEQUENCES);
  const pick = o.set === 'all' ? keys : o.set && SEQUENCES[o.set] ? [o.set, keys[(keys.indexOf(o.set) + 1) % keys.length]] : keys.slice(0, 2);
  const pages = [];
  const orders = pick.map(() => { let ord; do ord = shuffle([0, 1, 2, 3], rand); while (ord.every((v, i) => v === i)); return ord; });
  for (let p = 0; p < pick.length; p += 2) {
    const pg = new Page(paper, 'What happens next?', { subtitle: 'Cut out the pictures. Put them in order, then glue them in the boxes: first, next, then, last.' });
    const bh = pg.room / 2;
    pick.slice(p, p + 2).forEach((k, s) => {
      const [title, steps] = SEQUENCES[k], y = pg.y + s * bh, cw = pg.width / 4, cardH = (bh - 26) / 2, c = PALETTE[(p + s) * 2 % PALETTE.length];
      pg.add(txt(pg.left, y + 7, title, 6.6, { anchor: 'start', colour: c }));
      orders[p + s].forEach((si, i) => {
        const x = pg.left + i * cw, [e, t] = steps[si];
        pg.add(`<rect x="${x + 2}" y="${y + 11}" width="${cw - 4}" height="${cardH}" rx="4" fill="#fff" stroke="${INK}" stroke-width="0.6" stroke-dasharray="2.5 1.6"/>` + emoji(e, x + cw / 2, y + 11 + cardH * 0.42, cardH * 0.45));
        textLines(pg, wrap(t, 16), x + cw / 2, y + 11 + cardH * 0.8, 4.2, { anchor: 'middle', font: FONT, weight: 700 });
      });
      ['First', 'Next', 'Then', 'Last'].forEach((w, i) => {
        const x = pg.left + i * cw, yy = y + 16 + cardH;
        pg.add(`<rect x="${x + 2}" y="${yy}" width="${cw - 4}" height="${cardH}" rx="4" fill="${TINTS[i]}" stroke="${PALETTE[i]}" stroke-width="0.8"/>` + `<circle cx="${x + 9}" cy="${yy + 7}" r="4" fill="${PALETTE[i]}"/>` + txt(x + 9, yy + 8.6, i + 1, 4.6, { colour: '#fff' }) + txt(x + 16, yy + 8.6, w, 4.8, { anchor: 'start', colour: PALETTE[i] }));
      });
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ screen-free coding
function codingPuzzle(size, walls, rand) {
  for (let tries = 0; tries < 200; tries++) {
    const cells = [...Array(size * size).keys()];
    const start = Math.floor(rand() * size * size);
    let goal = start;
    const dist = (a, b) => Math.abs(a % size - b % size) + Math.abs(Math.floor(a / size) - Math.floor(b / size));
    const far = cells.filter((c) => dist(c, start) >= size);
    goal = far[Math.floor(rand() * far.length)];
    const block = new Set(shuffle(cells.filter((c) => c !== start && c !== goal), rand).slice(0, walls));
    // Breadth first search for the shortest path.
    const prev = new Map([[start, -1]]), queue = [start];
    while (queue.length) {
      const c = queue.shift(); if (c === goal) break;
      const x = c % size, y = Math.floor(c / size);
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const nx = x + dx, ny = y + dy, n = ny * size + nx; if (nx >= 0 && ny >= 0 && nx < size && ny < size && !block.has(n) && !prev.has(n)) { prev.set(n, c); queue.push(n); } });
    }
    if (!prev.has(goal)) continue;
    const path = []; for (let c = goal; c !== -1; c = prev.get(c)) path.unshift(c);
    if (path.length - 1 < size) continue;
    return { start, goal, block, path };
  }
  return null;
}

function makeCoding(o, paper) {
  const rand = rng(+o.seed || 1);
  const level = o.level || 'easy';
  const [size, walls] = { easy: [5, 4], medium: [6, 8], hard: [7, 13] }[level] || [5, 4];
  const themes = [['🤖', '🔋', '🪨'], ['🐰', '🥕', '🌳'], ['🚀', '🌍', '☄️'], ['🐝', '🌻', '🕸️']];
  const puzzles = [0, 1].map((i) => ({ p: codingPuzzle(size, walls, rand), t: themes[(Math.floor(rand() * 4) + i) % 4] }));
  const arrow = (a, b) => b === a + 1 ? '→' : b === a - 1 ? '←' : b > a ? '↓' : '↑';
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Code the robot: answers' : 'Code the robot', { subtitle: answers ? 'Answer key for grown-ups. Other routes can be right too!' : 'Write the arrows to move to the prize, one square at a time. Go around the blocks!', noName: answers });
    const bh = pg.room / 2;
    puzzles.forEach(({ p, t }, k) => {
      if (!p) return;
      const y = pg.y + k * bh, boxRows = 2, gridS = Math.min(pg.width * 0.62, bh - 40), cell = gridS / size, gx = pg.left, gy = y + 4;
      for (let c = 0; c < size * size; c++) {
        const cx = gx + (c % size) * cell, cy = gy + Math.floor(c / size) * cell;
        pg.add(`<rect x="${cx}" y="${cy}" width="${cell}" height="${cell}" fill="${(c % size + Math.floor(c / size)) % 2 ? '#f5f3ff' : '#fff'}" stroke="#c9c3e3" stroke-width="0.5"/>`);
        const e = c === p.start ? t[0] : c === p.goal ? t[1] : p.block.has(c) ? t[2] : '';
        if (e) pg.add(emoji(e, cx + cell / 2, cy + cell / 2, cell * 0.66));
      }
      if (answers) {
        const pts = p.path.map((c) => `${(gx + (c % size) * cell + cell / 2).toFixed(1)},${(gy + Math.floor(c / size) * cell + cell / 2).toFixed(1)}`).join(' ');
        pg.add(`<polyline points="${pts}" fill="none" stroke="#e0457b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>`);
      }
      const kx = gx + gridS + 8, kw = pg.right - kx;
      pg.add(panel(kx, gy, kw, gridS, '#fff6e0', '#ffb938', 7) + txt(kx + kw / 2, gy + 10, 'Arrow key', 5.4, { colour: '#e08a00' }));
      [['↑', 'up'], ['↓', 'down'], ['←', 'left'], ['→', 'right']].forEach(([a, w], i) => pg.add(txt(kx + 12, gy + 24 + i * 12, a, 9, { colour: PALETTE[i] }) + txt(kx + 22, gy + 23 + i * 12, w, 5, { anchor: 'start', font: FONT, colour: INK })));
      pg.add(emoji(t[0], kx + kw / 2 - 9, gy + gridS - 11, 9) + txt(kx + kw / 2, gy + gridS - 9, 'to', 4.6, { font: FONT, colour: SOFT }) + emoji(t[1], kx + kw / 2 + 9, gy + gridS - 11, 9));
      const moves = p.path.slice(1).map((c, i) => arrow(p.path[i], c));
      const nBox = Math.min(24, moves.length + (level === 'easy' ? 0 : 2)), per = Math.ceil(nBox / boxRows), bw = Math.min(11, pg.width / per - 1.5);
      for (let b = 0; b < nBox; b++) {
        const bx = pg.left + (b % per) * (bw + 1.5), by = gy + gridS + 5 + Math.floor(b / per) * (bw + 2);
        pg.add(`<rect x="${bx}" y="${by}" width="${bw}" height="${bw}" rx="2" fill="#fff" stroke="${PALETTE[k * 3]}" stroke-width="0.6"/>`);
        if (answers && moves[b]) pg.add(txt(bx + bw / 2, by + bw * 0.72, moves[b], bw * 0.7, { colour: '#e0457b' }));
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ animal fact files
const FACTS = {
  lion: ['Lion', 'lion', 'Lions live in family groups called prides.', 'A lion\'s roar can be heard 8 kilometres away.'],
  penguin: ['Penguin', '🐧', 'Penguins cannot fly, but they are brilliant swimmers.', 'Emperor penguin dads keep the egg warm on their feet.'],
  elephant: ['Elephant', '🐘', 'Elephants are the biggest animals that live on land.', 'An elephant uses its trunk to drink, smell and even hug.'],
  octopus: ['Octopus', 'octopus', 'An octopus has eight arms and three hearts.', 'It can change colour to hide from danger.'],
  bee: ['Honey bee', '🐝', 'Bees make honey from the nectar in flowers.', 'A bee does a waggle dance to tell its friends where the flowers are.'],
  turtle: ['Sea turtle', 'turtle', 'Sea turtles lived on Earth at the same time as the dinosaurs.', 'Mother turtles lay their eggs in the sand on beaches.'],
  giraffe: ['Giraffe', '🦒', 'Giraffes are the tallest animals in the world.', 'Every giraffe has its own pattern of patches, a bit like a fingerprint.'],
  whale: ['Blue whale', '🐋', 'The blue whale is the biggest animal that has ever lived.', 'Whales breathe air through a blowhole on top of their head.'],
};

function makeFactFile(o, paper) {
  const own = String(o.own || '').trim().slice(0, 24);
  const f = o.animal === 'own' ? null : FACTS[o.animal] || FACTS.lion;
  const title = f ? f[0] : own;
  const pg = new Page(paper, title ? `My fact file: ${title.toLowerCase()}` : 'My fact file', { subtitle: 'Find out about it in books, online with a grown-up, or by asking someone who knows!' });
  const hh = 50;
  pg.add(panel(pg.left, pg.y, pg.width * 0.4, hh, '#fff', '#b06cff', 8));
  if (f) pg.add(f[1].length > 3 ? pic(ART(f[1]), pg.left + pg.width * 0.2, pg.y + hh / 2, hh * 0.8) : emoji(f[1], pg.left + pg.width * 0.2, pg.y + hh / 2, hh * 0.62));
  else pg.add(txt(pg.left + pg.width * 0.2, pg.y + 9, 'Draw it here', 4.6, { font: FONT, colour: SOFT }));
  const dx = pg.left + pg.width * 0.4 + 5, dw = pg.width * 0.6 - 5;
  pg.add(panel(dx, pg.y, dw, hh, '#fff6e0', '#ffb938', 8) + txt(dx + 6, pg.y + 10, 'Did you know?', 6, { anchor: 'start', colour: '#e08a00' }));
  if (f) { let yy = pg.y + 19; [f[2], f[3]].forEach((t) => { yy = textLines(pg, wrap('⭐ ' + t, Math.floor(dw / 2.75)), dx + 6, yy, 4.6, { weight: 700 }) + 2; }); }
  else for (let l = 1; l <= 3; l++) pg.add(`<line x1="${dx + 6}" x2="${dx + dw - 6}" y1="${pg.y + 12 + l * 10}" y2="${pg.y + 12 + l * 10}" stroke="#d9c38f" stroke-width="0.45"/>`);
  pg.y += hh + 5;
  const boxes = [['🌍', 'Where does it live?', '#3fbfa8'], ['🍽️', 'What does it eat?', '#ff6b6b'], ['👀', 'What does it look like?', '#6c8cff'], ['🏃', 'How does it move?', '#ff7eb6'], ['🤩', 'My amazing fact', '#b06cff'], ['❓', 'A question I still have', '#ffb938']];
  const cw = pg.width / 2, bh = pg.room / 3;
  boxes.forEach(([e, t, c], i) => {
    const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * bh;
    pg.add(panel(x + 1.5, y + 1.5, cw - 3, bh - 3, '#fff', c, 7) + emoji(e, x + 11, y + 10, 8) + txt(x + 18, y + 12, t, fitFont(t, 5.4, cw - 26, 0.5), { anchor: 'start', colour: c }));
    const n = Math.floor((bh - 20) / 10);
    for (let l = 1; l <= n; l++) pg.add(`<line x1="${x + 7}" x2="${x + cw - 8}" y1="${y + 14 + l * 10}" y2="${y + 14 + l * 10}" stroke="#d9d4ec" stroke-width="0.45"/>`);
  });
  return [pg.svg()];
}

// ================================================================ pet care chart
const PETS = {
  dog: ['🐶', 'dog', [['🥣', 'Food'], ['💧', 'Fresh water'], ['🦮', 'A walk'], ['🎾', 'Play time'], ['✨', 'Brush fur'], ['🤗', 'Cuddles']]],
  cat: ['🐱', 'cat', [['🥣', 'Food'], ['💧', 'Fresh water'], ['🧶', 'Play time'], ['🧹', 'Litter tray (with a grown-up)'], ['✨', 'Brush fur'], ['🤗', 'Gentle strokes']]],
  fish: ['🐠', 'fish', [['🥄', 'A tiny pinch of food'], ['👀', 'Check the water looks clean'], ['💡', 'Light on in the day, off at night'], ['🧽', 'Clean the tank (with a grown-up)']]],
  rabbit: ['🐰', 'rabbit', [['🥕', 'Food and fresh hay'], ['💧', 'Fresh water'], ['🐇', 'Time to hop about'], ['🧹', 'Clean the hutch (with a grown-up)'], ['🤗', 'Gentle strokes']]],
  hamster: ['🐹', 'hamster', [['🌻', 'Food'], ['💧', 'Fresh water'], ['🧹', 'Clean the cage (with a grown-up)'], ['🤲', 'Gentle handling'], ['🎡', 'Check the wheel']]],
  bird: ['🐦', 'bird', [['🌾', 'Seed'], ['💧', 'Fresh water'], ['🛁', 'Bath water'], ['🎵', 'Talk and sing'], ['🧹', 'Clean the cage (with a grown-up)']]],
};

function makePetCare(o, paper) {
  const [e, kind, jobs] = PETS[o.pet] || PETS.dog;
  const pet = nameOf(o.petname, '');
  const pages = [];
  const pg = new Page(paper, pet ? `Looking after ${pet}` : `Looking after our ${kind}`, { subtitle: 'Pets need us every day. Colour a paw when each job is done!' });
  const lw = 58, hh = 12, dw = (pg.width - lw) / 7, rh = Math.min(30, (pg.room - hh - 30) / jobs.length);
  pg.add(emoji(e, pg.left + lw / 2, pg.y + hh / 2 - 1, 11));
  WEEKDAYS.forEach((d, i) => pg.add(`<rect x="${pg.left + lw + i * dw}" y="${pg.y}" width="${dw}" height="${hh}" fill="${TINTS[i % TINTS.length]}" stroke="#c9c3e3" stroke-width="0.4"/>` + txt(pg.left + lw + i * dw + dw / 2, pg.y + 8, d.slice(0, 3), 5, { colour: PALETTE[i % PALETTE.length] })));
  jobs.forEach(([je, t], j) => {
    const y = pg.y + hh + j * rh, c = PALETTE[j % PALETTE.length];
    pg.add(`<rect x="${pg.left}" y="${y}" width="${lw}" height="${rh}" fill="${TINTS[j % TINTS.length]}" stroke="#c9c3e3" stroke-width="0.4"/>` + emoji(je, pg.left + 8, y + rh / 2, 8));
    textLines(pg, wrap(t, 17), pg.left + 15, y + rh / 2 + 1.6 - (wrap(t, 17).length - 1) * 2.4, 4.4, { weight: 800, colour: c, lh: 1.1 });
    for (let i = 0; i < 7; i++) {
      const cx = pg.left + lw + i * dw + dw / 2, cy = y + rh / 2;
      pg.add(`<rect x="${pg.left + lw + i * dw}" y="${y}" width="${dw}" height="${rh}" fill="#fff" stroke="#c9c3e3" stroke-width="0.4"/>`);
      pg.add(`<g fill="#fff" stroke="${c}" stroke-width="0.6"><ellipse cx="${cx}" cy="${cy + 2}" rx="4" ry="3.3"/><circle cx="${cx - 4.2}" cy="${cy - 2.6}" r="1.5"/><circle cx="${cx - 1.4}" cy="${cy - 4.6}" r="1.5"/><circle cx="${cx + 1.6}" cy="${cy - 4.6}" r="1.5"/><circle cx="${cx + 4.3}" cy="${cy - 2.6}" r="1.5"/></g>`);
    }
  });
  const ty = pg.y + hh + jobs.length * rh + 6;
  pg.add(panel(pg.left, ty, pg.width, 22, '#fff0f5', '#ff7eb6', 7) + txt(pg.left + 7, ty + 9, 'Pet helpers:', 5.4, { anchor: 'start', colour: '#e0457b' }) + `<line x1="${pg.left + 40}" x2="${pg.right - 7}" y1="${ty + 9.5}" y2="${ty + 9.5}" stroke="#e8b9cf" stroke-width="0.45"/>` + txt(pg.left + 7, ty + 18, 'Always wash your hands after touching or feeding a pet.', 4.2, { anchor: 'start', font: FONT, colour: SOFT }));
  pages.push(pg.svg());
  if (o.profile !== false) {
    const p2 = new Page(paper, pet ? `All about ${pet}` : `All about our ${kind}`, { subtitle: 'Stick a photo or draw a picture, then fill in the rest.', noName: true });
    const ph = p2.room * 0.42;
    p2.add(`<rect x="${p2.left + 20}" y="${p2.y}" width="${p2.width - 40}" height="${ph}" rx="10" fill="#fff" stroke="#b06cff" stroke-width="0.8" stroke-dasharray="3 2"/>` + emoji(e, p2.w / 2, p2.y + ph / 2 - 4, 22) + txt(p2.w / 2, p2.y + ph / 2 + 16, 'Photo or drawing', 5, { font: FONT, colour: SOFT }));
    p2.y += ph + 6;
    const rows = [['🏷️', 'Name'], ['🎂', 'Birthday or gotcha day'], ['🍖', 'Favourite food'], ['🎾', 'Favourite game'], ['😴', 'Favourite place to sleep'], ['🌟', 'Clever tricks'], ['😂', 'The funniest thing it does']];
    const rh2 = p2.room / rows.length;
    rows.forEach(([re, t], i) => {
      const y = p2.y + i * rh2, c = PALETTE[i % PALETTE.length];
      p2.add(emoji(re, p2.left + 6, y + rh2 / 2, 8) + txt(p2.left + 14, y + rh2 / 2 + 1.8, t, 5.4, { anchor: 'start', colour: c }) + `<line x1="${p2.left + 18 + t.length * 2.9}" x2="${p2.right}" y1="${y + rh2 / 2 + 2.4}" y2="${y + rh2 / 2 + 2.4}" stroke="#d9d4ec" stroke-width="0.45"/>`);
      if (i === 0 && pet) p2.add(txt(p2.left + 22 + t.length * 2.9, y + rh2 / 2 + 1.6, pet, 6.4, { anchor: 'start', colour: INK }));
    });
    pages.push(p2.svg());
  }
  return pages;
}

// ================================================================ holiday diary
function makeDiary(o, paper) {
  const name = nameOf(o.name, '');
  const where = String(o.where || '').trim().slice(0, 28);
  const n = [3, 7, 14].includes(+o.days) ? +o.days : 7;
  const pages = [];
  pages.push(packCover(paper, name ? `${possessive(name)} holiday diary` : 'My holiday diary', where ? `Adventures in ${where}` : 'My adventures, one day at a time', 'boat', ['Fill in a page every evening. Stick in tickets, leaves and photos too!', 'Made at printpals.web.app'], '#e6f6fc', 'diary'));
  for (let d = 1; d <= n; d++) {
    const pg = new Page(paper, `Day ${d}`, { subtitle: 'Where did you go? What did you see? How did you feel?' });
    const c = PALETTE[d % PALETTE.length];
    pg.add(txt(pg.left, pg.y + 6, 'Date:', 5.4, { anchor: 'start', colour: c }) + `<line x1="${pg.left + 17}" x2="${pg.left + 70}" y1="${pg.y + 6.5}" y2="${pg.y + 6.5}" stroke="#c9c3e3" stroke-width="0.45"/>`);
    pg.add(txt(pg.left + 80, pg.y + 6, 'Weather:', 5.4, { anchor: 'start', colour: c }));
    ['☀️', '⛅', '🌧️', '💨', '❄️'].forEach((e, i) => pg.add(`<circle cx="${pg.left + 112 + i * 14}" cy="${pg.y + 4}" r="5.6" fill="#fff" stroke="#e2ddf2" stroke-width="0.5"/>` + emoji(e, pg.left + 112 + i * 14, pg.y + 4, 7)));
    pg.y += 14;
    const dh = pg.room * 0.42;
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${dh}" rx="8" fill="#fff" stroke="${c}" stroke-width="0.7" stroke-dasharray="3 2"/>` + txt(pg.left + 6, pg.y + 8, 'Draw the best part of today, or stick in a photo or ticket', 4.4, { anchor: 'start', font: FONT, colour: SOFT }));
    pg.y += dh + 6;
    [['Today we went to', 1], ['I saw', 1], ['The best bit was', 2], ['I ate', 1]].forEach(([t, l]) => {
      pg.add(txt(pg.left, pg.y + 6, t, 5.6, { anchor: 'start', colour: INK }));
      for (let k = 0; k < l; k++) pg.add(`<line x1="${k ? pg.left : pg.left + t.length * 2.9 + 4}" x2="${pg.right}" y1="${pg.y + 7 + k * 11}" y2="${pg.y + 7 + k * 11}" stroke="#c9c3e3" stroke-width="0.45"/>`);
      pg.y += 11 * l + 3;
    });
    pg.add(txt(pg.left, pg.y + 8, 'I felt', 5.6, { anchor: 'start', colour: INK }));
    ['😄', '🤩', '😌', '😴', '😢', '😠'].forEach((e, i) => pg.add(`<circle cx="${pg.left + 30 + i * 17}" cy="${pg.y + 6}" r="6.4" fill="#fff" stroke="#e2ddf2" stroke-width="0.5"/>` + emoji(e, pg.left + 30 + i * 17, pg.y + 6, 8.4)));
    pages.push(pg.svg());
  }
  return pages;
}

Object.assign(MAKERS, { papergames: makePaperGames, scissors: makeScissors, tenframes: makeTenFrames, sequencing: makeSequencing, coding: makeCoding, factfile: makeFactFile, petcare: makePetCare, diary: makeDiary });
