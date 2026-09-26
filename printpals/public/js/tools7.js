// PrintPals batch 6: pre-writing lines, cut and paste, homework planner, crowns and masks,
// weather chart and cards to colour.

// ================================================================ pre-writing lines
const PRE_PAIRS = [['🐝', ART('sunflower')], [ART('dog'), '🦴'], ['🐰', '🥕'], [ART('monkey'), ART('banana')], ['🐭', '🧀'], ['🚗', '🏠'],
  [ART('fish'), '🐚'], [ART('ladybird'), '🍃'], ['🚀', '🌙'], [ART('bear'), '🍯'], [ART('cat'), '🧶'], [ART('chick'), ART('egg')]];
const PRE_TYPES = ['straight', 'bumps', 'wave', 'zigzag', 'castle', 'loops'];

function prePath(type, x0, x1, y, amp) {
  const pts = [];
  const w = x1 - x0;
  const N = 240;
  for (let i = 0; i <= N; i++) {
    const u = i / N, x = x0 + u * w;
    const cycles = Math.max(3, Math.round(w / (amp * 3.2)));
    const ph = u * cycles * 2 * Math.PI;
    let yy = y;
    if (type === 'wave') yy = y - Math.sin(ph) * amp;
    else if (type === 'zigzag') { const f = (u * cycles * 2) % 2; yy = y - (f < 1 ? f : 2 - f) * amp * 2 + amp; }
    else if (type === 'bumps') yy = y - Math.abs(Math.sin(ph / 2)) * amp * 2 + amp;
    else if (type === 'castle') { const f = (u * cycles) % 1; yy = f < 0.5 ? y - amp : y + amp; }
    else if (type === 'loops') {
      const t = u * cycles * 2 * Math.PI;
      pts.push([x0 + (t - 1.9 * Math.sin(t)) * (w / (cycles * 2 * Math.PI)), y + amp - amp * (1 - Math.cos(t))]);
      continue;
    }
    pts.push([x, yy]);
  }
  if (type === 'castle') {
    // Square steps need sharp corners.
    const cycles = Math.max(3, Math.round(w / (amp * 3.2)));
    let d = `M${x0} ${y + amp}`;
    for (let k = 0; k < cycles; k++) {
      const a = x0 + (k * w) / cycles, b = x0 + ((k + 0.5) * w) / cycles, c = x0 + ((k + 1) * w) / cycles;
      d += ` L${a} ${y - amp} L${b} ${y - amp} L${b} ${y + amp} L${c} ${y + amp}`;
    }
    return d;
  }
  return 'M' + pts.map(([px, py]) => `${px.toFixed(2)} ${py.toFixed(2)}`).join(' L');
}

function makePrewriting(o, paper) {
  const rand = rng(+o.seed || 1);
  const pairs = shuffle(PRE_PAIRS, rand);
  const single = PRE_TYPES.includes(o.type);
  const pages = [];
  const rowsPer = 6;
  const pageCount = single ? 1 : 2;
  for (let p = 0; p < pageCount; p++) {
    const pg = new Page(paper, single ? `Trace the ${o.type === 'straight' ? 'lines' : o.type}` : 'Trace the lines', { subtitle: 'Start at the green dot and follow the dots without lifting your pencil.' });
    const rowH = (pg.room - 2) / rowsPer;
    for (let r = 0; r < rowsPer; r++) {
      const type = single ? o.type : PRE_TYPES[(p * rowsPer + r) % PRE_TYPES.length];
      const [a, b] = pairs[(p * rowsPer + r) % pairs.length];
      const y = pg.y + r * rowH + rowH / 2;
      const ps = Math.min(18, rowH * 0.6);
      pg.add(pic(a, pg.left + ps / 2 + 1, y, ps));
      pg.add(pic(b, pg.right - ps / 2 - 1, y, ps));
      const amp = Math.min(rowH * 0.28, single ? 4 + r * 1.1 : 7);
      const x0 = pg.left + ps + 5, x1 = pg.right - ps - 5;
      const d = prePath(type, x0, x1, y, amp);
      const thick = o.guide === 'thick';
      if (thick) pg.add(`<path d="${d}" fill="none" stroke="#efeaf9" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`);
      pg.add(`<path d="${d}" fill="none" stroke="#8d86ad" stroke-width="1.2" stroke-dasharray="0 2.6" stroke-linecap="round" stroke-linejoin="round"/>`);
      const m = /M([\d.]+) ([\d.]+)/.exec(d);
      pg.add(`<circle cx="${m[1]}" cy="${m[2]}" r="2.2" fill="#3fbf7f"/>`);
    }
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ cut and paste
const SORTS = {
  land: { title: 'Land or water?', a: ['Lives on land', '🌳'], b: ['Lives in water', '🌊'],
    itemsA: [['lion', ART('lion')], ['zebra', ART('zebra')], ['dog', ART('dog')], ['cat', ART('cat')], ['monkey', ART('monkey')], ['pig', ART('pig')], ['bear', ART('bear')], ['gorilla', ART('gorilla')]],
    itemsB: [['fish', ART('fish')], ['octopus', ART('octopus')], ['whale', '🐳'], ['crab', '🦀'], ['dolphin', '🐬'], ['shark', '🦈'], ['seal', '🦭'], ['turtle', ART('turtle')]] },
  food: { title: 'Fruit or vegetable?', a: ['Fruit', ART('apple')], b: ['Vegetable', '🥕'],
    itemsA: [['apple', ART('apple')], ['banana', ART('banana')], ['strawberry', ART('strawberry')], ['orange', ART('orange')], ['grapes', '🍇'], ['pear', '🍐'], ['cherries', '🍒'], ['watermelon', '🍉']],
    itemsB: [['carrot', '🥕'], ['broccoli', '🥦'], ['corn', '🌽'], ['cucumber', '🥒'], ['potato', '🥔'], ['pepper', '🫑'], ['onion', '🧅'], ['aubergine', '🍆']] },
  temp: { title: 'Hot or cold?', a: ['Hot', ART('sun')], b: ['Cold', '❄️'],
    itemsA: [['sun', ART('sun')], ['fire', '🔥'], ['hot drink', '☕'], ['soup', '🍲'], ['desert', '🏜️'], ['oven', '🧑‍🍳'], ['beach', '🏖️'], ['chilli', '🌶️']],
    itemsB: [['snow', '❄️'], ['snowman', '⛄'], ['ice', '🧊'], ['ice cream', '🍦'], ['penguin', '🐧'], ['gloves', '🧤'], ['igloo', '🏔️'], ['scarf', '🧣']] },
};
const LETTER_PICS = [['A', 'apple'], ['B', 'balloon'], ['C', 'cat'], ['D', 'dog'], ['E', 'egg'], ['F', 'fish'], ['H', 'hat'], ['L', 'lion'], ['M', 'monkey'], ['O', 'octopus'], ['P', 'pig'], ['S', 'sun'], ['T', 'turtle'], ['Z', 'zebra']];

function cutTile(pg, x, y, s, inner, c) {
  pg.add(`<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="3" fill="${TINTS[c % TINTS.length]}" stroke="#9a93b8" stroke-width="0.45" stroke-dasharray="2 1.4"/>`);
  pg.add(inner);
}

function makeCutPaste(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'sort';
  const pages = [];
  let key = [];
  const pg = new Page(paper, 'Cut and stick', { subtitle: 'Cut out the pictures at the bottom and stick each one in the right place.' });
  const tile = 30;
  if (kind === 'sort') {
    const set = SORTS[o.sort] || SORTS.land;
    const A = shuffle(set.itemsA, rand).slice(0, 4), B = shuffle(set.itemsB, rand).slice(0, 4);
    pg.add(`<text x="${pg.w / 2}" y="${pg.y + 4}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="${INK}">${set.title}</text>`);
    pg.y += 10;
    const bw = (pg.width - 6) / 2, bh = 2 * tile + 30;
    [[set.a, 0], [set.b, 1]].forEach(([[label, icon], k]) => {
      const x = pg.left + k * (bw + 6);
      pg.add(`<rect x="${x}" y="${pg.y}" width="${bw}" height="${bh}" rx="8" fill="${TINTS[k * 3]}" stroke="${PALETTE[k * 3]}" stroke-width="1"/>`);
      pg.add(pic(icon, x + 12, pg.y + 11, 13));
      pg.add(`<text x="${x + 22}" y="${pg.y + 13}" font-family="${TITLE_FONT}" font-weight="800" font-size="6.5" fill="${INK}">${label}</text>`);
      for (let i = 0; i < 4; i++) pg.add(`<rect x="${x + bw / 2 - tile - 2 + (i % 2) * (tile + 4)}" y="${pg.y + 22 + Math.floor(i / 2) * (tile + 4)}" width="${tile}" height="${tile}" rx="3" fill="#fff" stroke="#c9c3e3" stroke-width="0.4"/>`);
    });
    pg.y += bh + 10;
    const pieces = shuffle([...A, ...B], rand);
    key = [`${set.a[0]}: ${A.map((i) => i[0]).join(', ')}`, `${set.b[0]}: ${B.map((i) => i[0]).join(', ')}`];
    scissors(pg, pg.y);
    pg.y += 6;
    const gap = (pg.width - 4 * tile) / 5;
    pieces.forEach(([name, src], i) => {
      const x = pg.left + gap + (i % 4) * (tile + gap), y = pg.y + Math.floor(i / 4) * (tile + 8);
      cutTile(pg, x, y, tile, pic(src, x + tile / 2, y + tile / 2 - 2, tile * 0.64) + `<text x="${x + tile / 2}" y="${y + tile - 2.5}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.2" fill="${INK}">${name}</text>`, i);
    });
  } else if (kind === 'count') {
    const arts = ['apple', 'star', 'strawberry', 'ladybird', 'cupcake', 'balloon', 'orange', 'chick', 'heart', 'cookie'];
    pg.add(`<text x="${pg.w / 2}" y="${pg.y + 4}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="${INK}">Count and stick</text>`);
    pg.y += 10;
    const cw = pg.width / 5;
    for (let n = 1; n <= 10; n++) {
      const x = pg.left + ((n - 1) % 5) * cw, y = pg.y + Math.floor((n - 1) / 5) * (tile + 20);
      pg.add(`<text x="${x + cw / 2}" y="${y + 8}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="9" fill="${PALETTE[(n - 1) % PALETTE.length]}">${n}</text>`);
      pg.add(`<rect x="${x + (cw - tile) / 2}" y="${y + 11}" width="${tile}" height="${tile}" rx="3" fill="#fff" stroke="#c9c3e3" stroke-width="0.4"/>`);
    }
    pg.y += 2 * (tile + 20) + 6;
    scissors(pg, pg.y);
    pg.y += 6;
    const order = shuffle([...Array(10).keys()].map((k) => k + 1), rand);
    const gap = (pg.width - 5 * tile) / 6;
    order.forEach((n, i) => {
      const x = pg.left + gap + (i % 5) * (tile + gap), y = pg.y + Math.floor(i / 5) * (tile + 6);
      const art = ART(arts[n - 1]);
      let inner = '';
      const cols = n > 4 ? Math.ceil(n / 2) > 3 ? 4 : 3 : n, rows = Math.ceil(n / cols), s = Math.min((tile - 4) / cols, (tile - 4) / rows);
      for (let k = 0; k < n; k++) inner += pic(art, x + tile / 2 - ((Math.min(cols, n) - 1) * s) / 2 + (k % cols) * s, y + tile / 2 - ((rows - 1) * s) / 2 + Math.floor(k / cols) * s, s * 0.9);
      cutTile(pg, x, y, tile, inner, i);
    });
    key = ['Each box gets the picture with that many things in it.'];
  } else {
    const picks = shuffle(LETTER_PICS, rand).slice(0, 6);
    pg.add(`<text x="${pg.w / 2}" y="${pg.y + 4}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="${INK}">Which letter does it start with?</text>`);
    pg.y += 10;
    const cw = pg.width / 3;
    picks.forEach(([L], i) => {
      const x = pg.left + (i % 3) * cw, y = pg.y + Math.floor(i / 3) * (tile + 22);
      pg.add(`<text x="${x + cw / 2}" y="${y + 9}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="10" fill="${PALETTE[i]}">${L} ${L.toLowerCase()}</text>`);
      pg.add(`<rect x="${x + (cw - tile) / 2}" y="${y + 12}" width="${tile}" height="${tile}" rx="3" fill="#fff" stroke="#c9c3e3" stroke-width="0.4"/>`);
    });
    pg.y += 2 * (tile + 22) + 6;
    scissors(pg, pg.y);
    pg.y += 6;
    const gap = (pg.width - 6 * tile) / 7;
    shuffle(picks, rand).forEach(([L, art], i) => {
      const x = pg.left + gap + i * (tile + gap), y = pg.y;
      cutTile(pg, x, y, tile, pic(ART(art), x + tile / 2, y + tile / 2 - 2, tile * 0.66) + `<text x="${x + tile / 2}" y="${y + tile - 2.5}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.2" fill="${INK}">${art}</text>`, i);
    });
    key = picks.map(([L, art]) => `${L}: ${art}`);
  }
  pg.add(`<text x="${pg.right}" y="${pg.bottom - 1}" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="2.8" fill="#c9c3e3">${esc(key.join('   '))}</text>`);
  pages.push(pg.svg());
  return pages;
}

// ================================================================ homework planner
function makeHomework(o, paper) {
  const name = nameOf(o.name, '');
  const pg = new Page(paper, name ? `${possessive(name)} Homework Planner` : 'My Homework Planner', { subtitle: 'Week of: ______________________', noName: true });
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const rowH = 20;
  pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="8" rx="3" fill="#6c8cff"/>`);
  pg.add(`<text x="${pg.left + 4}" y="${pg.y + 5.6}" font-family="${FONT}" font-weight="800" font-size="3.8" fill="#fff">Day</text><text x="${pg.left + 34}" y="${pg.y + 5.6}" font-family="${FONT}" font-weight="800" font-size="3.8" fill="#fff">My homework</text><text x="${pg.right - 12}" y="${pg.y + 5.6}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.8" fill="#fff">Done</text>`);
  days.forEach((d, i) => {
    const y = pg.y + 10 + i * rowH;
    pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${rowH - 2}" rx="4" fill="${TINTS[i]}"/>`);
    pg.add(`<text x="${pg.left + 4}" y="${y + rowH / 2 + 1}" font-family="${TITLE_FONT}" font-weight="800" font-size="5" fill="${INK}">${d}</text>`);
    pg.add(`<line x1="${pg.left + 34}" x2="${pg.right - 26}" y1="${y + 8}" y2="${y + 8}" stroke="#9a93b8" stroke-width="0.35"/><line x1="${pg.left + 34}" x2="${pg.right - 26}" y1="${y + 15}" y2="${y + 15}" stroke="#9a93b8" stroke-width="0.35"/>`);
    pg.add(`<path d="${starPath(pg.right - 12, y + rowH / 2 - 1, 5.5, 0.47)}" fill="#fff" stroke="${PALETTE[i]}" stroke-width="0.7" stroke-linejoin="round"/>`);
  });
  let y = pg.y + 10 + days.length * rowH + 4;
  const bw = (pg.width - 5) / 2, bh = 66;
  // Spellings
  pg.add(`<rect x="${pg.left}" y="${y}" width="${bw}" height="${bh}" rx="6" fill="#fff" stroke="${PALETTE[0]}" stroke-width="0.7"/>`);
  pg.add(`<text x="${pg.left + 5}" y="${y + 8}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.2" fill="${INK}">✏️ Spellings this week</text>`);
  for (let i = 0; i < 8; i++) pg.add(`<text x="${pg.left + 5}" y="${y + 17 + i * 6.3}" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${SOFT}">${i + 1}.</text><line x1="${pg.left + 11}" x2="${pg.left + bw - 5}" y1="${y + 17.5 + i * 6.3}" y2="${y + 17.5 + i * 6.3}" stroke="#d9d4ec" stroke-width="0.35"/>`);
  // Reading
  const rx = pg.left + bw + 5;
  pg.add(`<rect x="${rx}" y="${y}" width="${bw}" height="${bh}" rx="6" fill="#fff" stroke="${PALETTE[3]}" stroke-width="0.7"/>`);
  pg.add(`<text x="${rx + 5}" y="${y + 8}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.2" fill="${INK}">📚 Reading</text>`);
  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((d, i) => {
    const yy = y + 16 + i * 7;
    pg.add(`<text x="${rx + 5}" y="${yy + 1.2}" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${INK}">${d}</text><circle cx="${rx + 20}" cy="${yy}" r="2.4" fill="#fff" stroke="${INK}" stroke-width="0.4"/><line x1="${rx + 26}" x2="${rx + bw - 5}" y1="${yy + 1.5}" y2="${yy + 1.5}" stroke="#d9d4ec" stroke-width="0.35"/>`);
  });
  y += bh + 5;
  // Things to bring
  const items = [['👟', 'PE kit'], ['📚', 'Library book'], ['📁', 'Reading folder'], ['💧', 'Water bottle'], ['✏️', 'Homework'], ['🎒', 'School bag']];
  const th = Math.min(34, pg.bottom - y - 30);
  if (th > 22) {
    pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${th}" rx="6" fill="#fff6e0" stroke="#ffb938" stroke-width="0.6"/>`);
    pg.add(`<text x="${pg.left + 5}" y="${y + 8}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.2" fill="${INK}">Remember to bring</text>`);
    const iw = pg.width / 3;
    items.forEach(([ic, label], i) => {
      const x = pg.left + 5 + (i % 3) * iw, yy = y + 16 + Math.floor(i / 3) * 9;
      pg.add(`<rect x="${x}" y="${yy - 3.6}" width="4.4" height="4.4" rx="1" fill="#fff" stroke="${INK}" stroke-width="0.4"/>`);
      pg.add(emoji(ic, x + 9, yy - 1.4, 4.6));
      pg.add(`<text x="${x + 13}" y="${yy}" font-family="${FONT}" font-weight="800" font-size="3.8" fill="${INK}">${label}</text>`);
    });
    y += th + 5;
  }
  const nh = pg.bottom - y - 1;
  if (nh > 14) {
    pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${nh}" rx="6" fill="#fff" stroke="#d9d4ec" stroke-width="0.6"/>`);
    pg.add(`<text x="${pg.left + 5}" y="${y + 7}" font-family="${FONT}" font-weight="800" font-size="4" fill="${SOFT}">Notes for home and school</text>`);
  }
  return [pg.svg()];
}

// ================================================================ crowns and masks
const MASKS = {
  cat: { name: 'cat', draw: () => [
    `<path d="M40 70 L34 12 L86 46 Z" ${LW}/><path d="M160 70 L166 12 L114 46 Z" ${LW}/><path d="M46 60 L42 26 L74 46" ${LT}/><path d="M154 60 L158 26 L126 46" ${LT}/>`,
    `<ellipse cx="100" cy="98" rx="76" ry="62" ${LW}/>`] , nose: 'cat' },
  bear: { name: 'bear', draw: () => [
    `<circle cx="46" cy="44" r="24" ${LW}/><circle cx="46" cy="44" r="12" ${LW}/><circle cx="154" cy="44" r="24" ${LW}/><circle cx="154" cy="44" r="12" ${LW}/>`,
    `<ellipse cx="100" cy="98" rx="76" ry="62" ${LW}/>`, `<ellipse cx="100" cy="128" rx="30" ry="20" ${LW}/>`], nose: 'bear' },
  lion: { name: 'lion', draw: () => {
    let d = '';
    for (let i = 0; i <= 16; i++) { const a = (i * 2 * Math.PI) / 16, b = ((i + 0.5) * 2 * Math.PI) / 16; const x = 100 + Math.cos(a) * 84, y = 96 + Math.sin(a) * 74; d += i ? ` Q${100 + Math.cos(b - Math.PI / 16) * 104} ${96 + Math.sin(b - Math.PI / 16) * 92} ${x} ${y}` : `M${x} ${y}`; }
    return [`<path d="${d} Z" ${LW}/>`, `<circle cx="52" cy="42" r="12" ${LW}/><circle cx="148" cy="42" r="12" ${LW}/>`, `<ellipse cx="100" cy="100" rx="64" ry="56" ${LW}/>`, `<ellipse cx="100" cy="128" rx="26" ry="18" ${LW}/>`];
  }, nose: 'cat' },
  bunny: { name: 'bunny', draw: () => [
    `<ellipse cx="66" cy="34" rx="16" ry="40" transform="rotate(-10 66 34)" ${LW}/><ellipse cx="66" cy="36" rx="7" ry="28" transform="rotate(-10 66 36)" ${LW}/>`,
    `<ellipse cx="134" cy="34" rx="16" ry="40" transform="rotate(10 134 34)" ${LW}/><ellipse cx="134" cy="36" rx="7" ry="28" transform="rotate(10 134 36)" ${LW}/>`,
    `<ellipse cx="100" cy="104" rx="72" ry="58" ${LW}/>`], nose: 'cat' },
  frog: { name: 'frog', draw: () => [
    `<circle cx="62" cy="58" r="30" ${LW}/><circle cx="138" cy="58" r="30" ${LW}/>`,
    `<ellipse cx="100" cy="106" rx="84" ry="54" ${LW}/>`], nose: 'frog' },
};

function maskFace(kind, nose) {
  const holes = `<ellipse cx="68" cy="${kind === 'frog' ? 64 : 88}" rx="15" ry="11" fill="#fff" stroke="#1f1b2e" stroke-width="1.4" stroke-dasharray="3 2"/><ellipse cx="132" cy="${kind === 'frog' ? 64 : 88}" rx="15" ry="11" fill="#fff" stroke="#1f1b2e" stroke-width="1.4" stroke-dasharray="3 2"/>`;
  let face = '';
  if (nose === 'cat') face = `<path d="M92 116 L108 116 L100 124 Z" ${LW}/><path d="M100 124 Q92 134 84 128 M100 124 Q108 134 116 128" ${LN}/><path d="M70 118 L34 110 M70 126 L34 132 M130 118 L166 110 M130 126 L166 132" ${LT}/>`;
  else if (nose === 'bear') face = `<ellipse cx="100" cy="120" rx="10" ry="7" ${INKF}/><path d="M100 127 V134 M100 134 Q92 142 86 136 M100 134 Q108 142 114 136" ${LN}/>`;
  else face = `<path d="M40 112 Q100 160 160 112" ${LN}/><circle cx="88" cy="96" r="2" ${INKF}/><circle cx="112" cy="96" r="2" ${INKF}/><circle cx="46" cy="118" r="7" ${LT}/><circle cx="154" cy="118" r="7" ${LT}/>`;
  const strings = `<circle cx="${kind === 'frog' ? 22 : 30}" cy="100" r="2.6" fill="#fff" stroke="#1f1b2e" stroke-width="1"/><circle cx="${kind === 'frog' ? 178 : 170}" cy="100" r="2.6" fill="#fff" stroke="#1f1b2e" stroke-width="1"/>`;
  return face + holes + strings;
}

function makeCrafts(o, paper) {
  const name = nameOf(o.name, '');
  if (o.kind === 'mask') {
    const keys = MASKS[o.animal] ? [o.animal] : Object.keys(MASKS);
    return keys.map((k) => {
      const m = MASKS[k];
      const pg = new Page(paper, `${m.name[0].toUpperCase()}${m.name.slice(1)} mask`, { subtitle: 'Colour it in. A grown-up cuts it out and the eye holes, then ties string through the little holes.', noName: true });
      const size = Math.min(pg.width, pg.room - 10);
      const s = size / 200;
      pg.add(`<g transform="translate(${pg.left + (pg.width - size) / 2} ${pg.y + 6}) scale(${s.toFixed(4)})">${m.draw().join('')}${maskFace(k, m.nose)}</g>`);
      pg.add(`<text x="${pg.w / 2}" y="${pg.bottom - 3}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="3.6" fill="${SOFT}">✂️ Dashed lines: cut out the eye holes. Little circles: make a hole for the string.</text>`);
      return pg.svg();
    });
  }
  // Crown: two strips on a landscape page, glued into a band.
  const pg = new Page(paper, '', { bare: true, landscape: true });
  const W = pg.w, x0 = 12, bw = W - 24;
  const age = +o.age || 0;
  const text = o.crown === 'star' ? 'Star of the Day' : o.crown === 'name' ? (name || 'Super Star') : `Happy ${age ? ordinal(age) + ' ' : ''}Birthday`;
  // Front strip with points
  const top = 14, bandTop = 58, bandBot = 96;
  let d = `M${x0} ${bandBot} L${x0} ${bandTop}`;
  const pts = 7;
  for (let i = 0; i < pts; i++) {
    const a = x0 + (i * bw) / pts, m = x0 + ((i + 0.5) * bw) / pts, b = x0 + ((i + 1) * bw) / pts;
    d += ` L${a} ${bandTop} L${m} ${top + (i % 2 ? 12 : 0)} L${b} ${bandTop}`;
  }
  d += ` L${x0 + bw} ${bandBot} Z`;
  pg.add(`<path d="${d}" ${LW}/>`);
  for (let i = 0; i < pts; i++) {
    const m = x0 + ((i + 0.5) * bw) / pts;
    pg.add(`<circle cx="${m}" cy="${top + (i % 2 ? 12 : 0) + 12}" r="5" ${LW}/>`);
    pg.add(`<path d="${starPath(m, bandTop - 12, 5, 0.45)}" ${LW}/>`);
  }
  pg.add(`<line x1="${x0}" x2="${x0 + bw}" y1="${bandTop + 4}" y2="${bandTop + 4}" ${LT}/><line x1="${x0}" x2="${x0 + bw}" y1="${bandBot - 4}" y2="${bandBot - 4}" ${LT}/>`);
  const fs = Math.min(22, (bw - 20) / (text.length * 0.56));
  pg.add(`<text x="${W / 2}" y="${(bandTop + bandBot) / 2 + fs * 0.34}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs.toFixed(2)}" fill="#fff" stroke="#1f1b2e" stroke-width="${(fs * 0.06).toFixed(2)}" stroke-linejoin="round" paint-order="stroke">${esc(text)}</text>`);
  // Back strip
  const by = 120, bh = 38;
  pg.add(`<rect x="${x0}" y="${by}" width="${bw - 20}" height="${bh}" ${LW}/><rect x="${x0 + bw - 20}" y="${by}" width="20" height="${bh}" fill="#f4f1fb" stroke="#1f1b2e" stroke-width="1" stroke-dasharray="3 2"/>`);
  pg.add(`<text x="${x0 + bw - 10}" y="${by + bh / 2 + 1.5}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4" fill="${SOFT}">glue</text>`);
  for (let i = 0; i < 8; i++) pg.add(`<path d="${starPath(x0 + 16 + i * ((bw - 40) / 7), by + bh / 2, 7, 0.45)}" ${LW}/>`);
  pg.add(`<text x="${W / 2}" y="${pg.h - 18}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="4" fill="${SOFT}">✂️ Colour both strips, cut them out, then glue the strips together to fit around your head.</text>`);
  pg.footer = () => {};
  return [pg.svg()];
}

// ================================================================ weather chart
function weatherIcon(kind, cx, cy, s) {
  const k = s / 46; // every icon is about 46 units wide at scale 1
  const g = (inner) => `<g transform="translate(${cx} ${cy}) scale(${k.toFixed(4)})">${inner}</g>`;
  const cloud = cCloud(0, 0, 0.62);
  switch (kind) {
    case 'sunny': return g(cSun(0, 0, 9));
    case 'cloudy': return g(cloud);
    case 'rainy': return g(`<path d="M-10 10 l-3 7 M0 10 l-3 7 M10 10 l-3 7" ${LN}/>` + cCloud(0, -4, 0.62));
    case 'windy': return g(`<path d="M-18 -6 H6 Q14 -6 14 -12 Q14 -18 8 -16 M-18 2 H12 Q20 2 20 8 Q20 14 14 12 M-18 10 H0" ${LN}/>`);
    case 'snowy': return g(`<path d="M0 -16 V16 M-14 -8 L14 8 M-14 8 L14 -8 M-4 -13 L0 -9 L4 -13 M-4 13 L0 9 L4 13" ${LN}/>`);
    default: return g(cCloud(0, -6, 0.62) + `<path d="M2 4 L-6 14 L0 14 L-4 22 L8 10 L2 10 Z" ${LW}/>`);
  }
}
const WEATHERS = ['sunny', 'cloudy', 'rainy', 'windy', 'snowy', 'stormy'];

function makeWeather(o, paper) {
  const name = nameOf(o.name, '');
  const pages = [];
  if (o.week !== false) {
    const pg = new Page(paper, name ? `${possessive(name)} Weather Week` : 'My Weather Week', { subtitle: 'Look outside each day. Circle the weather and how it feels.', noName: true });
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const rowH = (pg.room - 12) / days.length;
    const iw = (pg.width - 36 - 42) / WEATHERS.length;
    WEATHERS.forEach((w, i) => pg.add(`<text x="${pg.left + 36 + i * iw + iw / 2}" y="${pg.y + 4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${SOFT}">${w}</text>`));
    pg.add(`<text x="${pg.right - 21}" y="${pg.y + 4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${SOFT}">it feels</text>`);
    days.forEach((d, r) => {
      const y = pg.y + 8 + r * rowH;
      pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${rowH - 2}" rx="5" fill="${TINTS[r]}"/>`);
      pg.add(`<text x="${pg.left + 3}" y="${y + rowH / 2 + 1}" font-family="${TITLE_FONT}" font-weight="800" font-size="4.8" fill="${INK}">${d}</text>`);
      WEATHERS.forEach((w, i) => pg.add(weatherIcon(w, pg.left + 36 + i * iw + iw / 2, y + (rowH - 2) / 2, Math.min(iw * 0.86, rowH * 0.9))));
      ['hot', 'warm', 'cold'].forEach((t, k) => pg.add(`<text x="${pg.right - 38 + k * 13}" y="${y + rowH / 2 + 1}" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${INK}">${t}</text>`));
    });
    pages.push(pg.svg());
  }
  if (o.month !== false) {
    const pg = new Page(paper, 'Weather this month', { subtitle: 'Draw the weather in each day\'s box. At the end, count how many of each.', noName: !!name });
    pg.add(`<text x="${pg.left}" y="${pg.y + 4}" font-family="${FONT}" font-weight="800" font-size="4.2" fill="${INK}">Month: ______________________</text>`);
    pg.y += 9;
    const cols = 7, cw = pg.width / cols, ch = 26;
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((d, i) => pg.add(`<text x="${pg.left + i * cw + cw / 2}" y="${pg.y + 3}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${SOFT}">${d}</text>`));
    pg.y += 5;
    for (let r = 0; r < 5; r++) for (let c = 0; c < cols; c++) pg.add(`<rect x="${pg.left + c * cw + 0.8}" y="${pg.y + r * ch}" width="${cw - 1.6}" height="${ch - 1.6}" rx="3" fill="#fff" stroke="#c9c3e3" stroke-width="0.4"/><text x="${pg.left + c * cw + 3}" y="${pg.y + r * ch + 5}" font-family="${FONT}" font-weight="700" font-size="2.8" fill="#c9c3e3">__</text>`);
    pg.y += 5 * ch + 6;
    const tw = pg.width / 6;
    WEATHERS.forEach((w, i) => {
      const x = pg.left + i * tw;
      pg.add(`<rect x="${x + 1}" y="${pg.y}" width="${tw - 2}" height="36" rx="5" fill="${TINTS[i]}"/>`);
      pg.add(weatherIcon(w, x + tw / 2, pg.y + 10, 17));
      pg.add(`<text x="${x + tw / 2}" y="${pg.y + 23}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${INK}">${w}</text>`);
      pg.add(`<rect x="${x + tw / 2 - 6}" y="${pg.y + 25}" width="12" height="8" rx="2" fill="#fff" stroke="#9a93b8" stroke-width="0.4"/>`);
    });
    pages.push(pg.svg());
  }
  if (!pages.length) pages.push(new Page(paper, 'Weather', { subtitle: 'Tick at least one page.', noName: true }).svg());
  return pages;
}

// ================================================================ cards to colour
function xmasTree() {
  return [`<rect x="90" y="160" width="20" height="24" ${LW}/>`, `<path d="M100 40 L150 100 L126 100 L162 140 L134 140 L170 166 L30 166 L66 140 L38 140 L74 100 L50 100 Z" ${LW}/>`,
    cStar(100, 34, 14), `<circle cx="84" cy="96" r="6" ${LW}/><circle cx="116" cy="118" r="6" ${LW}/><circle cx="78" cy="140" r="6" ${LW}/><circle cx="124" cy="152" r="6" ${LW}/><circle cx="100" cy="72" r="5" ${LW}/>`,
    `<rect x="40" y="170" width="30" height="24" ${LW}/><path d="M55 170 V194 M40 182 H70" ${LT}/><rect x="132" y="172" width="26" height="22" ${LW}/><path d="M145 172 V194" ${LT}/>`].join('');
}
function eidArt() {
  return '<g transform="translate(100 100) scale(1.25) translate(-100 -100)">' + [`<path d="M86 30 A56 56 0 1 0 150 118 A44 44 0 1 1 86 30 Z" ${LW}/>`, cStar(134, 50, 12), cStar(160, 84, 7), cStar(40, 150, 8),
    `<path d="M126 110 V122" ${LN}/><path d="M112 122 H140 L136 132 H116 Z" ${LW}/><rect x="116" y="132" width="20" height="36" rx="3" ${LW}/><path d="M112 168 H140 L136 178 H116 Z" ${LW}/><path d="M126 138 Q134 150 126 160 Q118 150 126 138 Z" ${LW}/>`].join('') + '</g>';
}
function diyaArt() {
  return [`<path d="M40 130 Q100 200 160 130 Z" ${LW}/><path d="M40 130 Q100 144 160 130" ${LN}/>`, `<path d="M58 150 q8 6 16 0 q8 6 16 0 q8 6 16 0 q8 6 16 0" ${LT}/>`,
    `<path d="M100 128 Q84 104 100 70 Q116 104 100 128 Z" ${LW}/><path d="M100 122 Q92 108 100 90 Q108 108 100 122 Z" ${LW}/>`,
    cStar(40, 50, 9), cStar(160, 44, 10), cStar(150, 90, 6), cStar(52, 94, 6), `<path d="M20 190 H180" ${LN}/>`].join('');
}
const CARDS = {
  mum: { title: "Happy Mother's Day", art: () => colouringArt('sunflower'), msg: 'To the best mum in the world' },
  dad: { title: "Happy Father's Day", art: () => colouringArt('car'), msg: 'To the best dad in the world' },
  birthday: { title: 'Happy Birthday!', art: () => colouringArt('cake'), msg: 'Have the best birthday ever!' },
  thanks: { title: 'Thank You!', art: () => colouringArt('rainbow'), msg: 'Thank you so much for' },
  teacher: { title: 'Thank You, Teacher!', art: () => colouringArt('owl'), msg: 'Thank you for helping me learn' },
  getwell: { title: 'Get Well Soon', art: () => colouringArt('teddy'), msg: 'I hope you feel better very soon' },
  christmas: { title: 'Merry Christmas', art: xmasTree, msg: 'Wishing you a happy Christmas' },
  eid: { title: 'Eid Mubarak', art: eidArt, msg: 'Wishing you a happy Eid' },
  diwali: { title: 'Happy Diwali', art: diyaArt, msg: 'Wishing you a bright and happy Diwali' },
  love: { title: 'You Are Amazing', art: () => colouringArt('unicorn'), msg: 'I just wanted to say' },
};

function makeCards(o, paper) {
  const card = CARDS[o.card] || CARDS.birthday;
  const name = nameOf(o.name, '');
  const to = nameOf(o.to, '');
  const pg = new Page(paper, '', { bare: true });
  const mid = pg.h / 2;
  // Inside (top half, upside down so it reads the right way once folded)
  let inside = '';
  const ix = pg.left + 10, iw = pg.width - 20;
  inside += `<text x="${ix}" y="${pg.m + 26}" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="${INK}">To ${to ? esc(to) : '____________________'}</text>`;
  inside += `<text x="${ix}" y="${pg.m + 42}" font-family="${FONT}" font-weight="700" font-size="5.5" fill="${INK}">${esc(card.msg)}</text>`;
  for (let i = 0; i < 4; i++) inside += `<line x1="${ix}" x2="${ix + iw}" y1="${pg.m + 56 + i * 12}" y2="${pg.m + 56 + i * 12}" stroke="#c9c3e3" stroke-width="0.4"/>`;
  inside += `<text x="${ix}" y="${mid - 22}" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="${INK}">Love from ${name ? esc(name) : '____________'}</text>`;
  inside += `<path d="${starPath(ix + iw - 10, mid - 25, 7, 0.45)}" ${LW}/>`;
  pg.add(`<g transform="rotate(180 ${pg.w / 2} ${mid / 2 + pg.m / 2})">${inside}</g>`);
  // Fold line
  pg.add(`<line x1="${pg.left - 6}" x2="${pg.right + 6}" y1="${mid}" y2="${mid}" stroke="#b9b3d6" stroke-width="0.5" stroke-dasharray="3 2"/><text x="${pg.right}" y="${mid - 1.5}" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="3" fill="${SOFT}">fold here</text>`);
  // Front (bottom half)
  pg.add(`<rect x="${pg.left}" y="${mid + 6}" width="${pg.width}" height="${pg.bottom - mid - 6}" rx="8" fill="#fff" stroke="#1f1b2e" stroke-width="0.9"/>`);
  const fs = Math.min(15, (pg.width - 20) / (card.title.length * 0.56));
  pg.add(`<text x="${pg.w / 2}" y="${mid + 24}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs.toFixed(2)}" fill="#fff" stroke="#1f1b2e" stroke-width="${(fs * 0.06).toFixed(2)}" stroke-linejoin="round" paint-order="stroke">${esc(card.title)}</text>`);
  const size = Math.min(pg.width - 30, pg.bottom - mid - 40);
  pg.add(`<g transform="translate(${pg.left + (pg.width - size) / 2} ${mid + 30}) scale(${(size / 200).toFixed(4)})">${card.art()}</g>`);
  pg.footer = () => {};
  pg.add(`<text x="${pg.w / 2}" y="${pg.h - 6}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="3" fill="#b8b3cc">Colour the front, write inside, then fold along the dashed line.</text>`);
  return [pg.svg()];
}

Object.assign(MAKERS, { prewriting: makePrewriting, cutpaste: makeCutPaste, homework: makeHomework, crafts: makeCrafts, weather: makeWeather, cards: makeCards });
