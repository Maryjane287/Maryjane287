// PrintPals batch 24 (Plus): My Sight Word Readers, Dinosaur Explorer kit, Space Academy, Winter Wonderland pack.

// A grid of picture squares to cross off (bingo, spotting games).
function picGridPage(paper, title, sub, items, cols) {
  const pg = new Page(paper, title, { subtitle: sub });
  const n = cols || 4, rows = Math.ceil(items.length / n), s = Math.min(pg.width / n, (pg.room - 4) / rows), x0 = pg.w / 2 - (s * n) / 2;
  items.forEach(([e, t], i) => { const x = x0 + (i % n) * s, y = pg.y + Math.floor(i / n) * s; pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${s - 3}" height="${s - 3}" rx="8" fill="${TINTS[i % TINTS.length]}" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="0.9"/>` + emoji(e, x + s / 2, y + s * 0.42, s * 0.4) + txt(x + s / 2, y + s - 7, t, fitFont(t, 4.8, s - 8, 0.5), { font: FONT, colour: INK })); });
  return pg.svg();
}

// A sentence in big print with some words picked out in colour. Returns the height used.
function colourSentence(pg, text, cx, y, fs, hi, colour, maxW) {
  const words = text.split(' '), cw = fs * 0.56, sp = cw * 0.9;
  const lines = [[]];
  let w = 0;
  words.forEach((wd) => { const ww = wd.length * cw; if (w && w + sp + ww > maxW) { lines.push([]); w = 0; } lines[lines.length - 1].push(wd); w += (w ? sp : 0) + ww; });
  lines.forEach((ln, li) => {
    const tw = ln.reduce((a, wd) => a + wd.length * cw, 0) + sp * (ln.length - 1);
    let x = cx - tw / 2;
    ln.forEach((wd) => {
      const bare = wd.replace(/[^A-Za-z']/g, '').toLowerCase(), on = hi.includes(bare) || (bare === 'i' && hi.includes('I'));
      pg.add(txt(x, y + li * fs * 1.3, wd, fs, { anchor: 'start', colour: on ? colour : INK }) + (on ? `<line x1="${x}" x2="${x + wd.replace(/[^A-Za-z']/g, '').length * cw}" y1="${y + li * fs * 1.3 + 2}" y2="${y + li * fs * 1.3 + 2}" stroke="${colour}" stroke-width="0.6" stroke-dasharray="1.5 1"/>` : ''));
      x += wd.length * cw + sp;
    });
  });
  return lines.length * fs * 1.3;
}

// ================================================================ My Sight Word Readers (Plus)
const READERS = {
  1: { title: 'I can see', ring: '#ff7eb6', tint: '#fff0f5', words: ['I', 'see', 'a', 'the', 'can'],
    story: [['I can see a cat.', '🐱'], ['I see the sun.', '☀️'], ['{n} can see a dog.', '🐶'], ['I can see the moon.', '🌙']] },
  2: { title: 'We go to the park', ring: '#3fbfa8', tint: '#e8f8f4', words: ['and', 'is', 'it', 'to', 'go'],
    story: [['{n} and I go to the park.', '🌳'], ['It is a big slide!', '🛝'], ['We go up and down.', '🎢'], ['It is fun to go to the park.', '😄']] },
  3: { title: 'Look at my kite', ring: '#6c8cff', tint: '#eef2ff', words: ['we', 'like', 'my', 'look', 'here'],
    story: [['Look at my kite!', '🪁'], ['Here is my red kite.', '❤️'], ['We like the wind.', '🌬️'], ['{n} and I like my kite.', '😊']] },
  4: { title: 'Come and play', ring: '#e08a00', tint: '#fff6e0', words: ['said', 'was', 'come', 'you', 'they'],
    story: [['"Come and play!" said {n}.', '⚽'], ['"You can play too," said Sam.', '🤝'], ['They play in the sun.', '☀️'], ['It was a happy day.', '🌈']] },
};

function makeReaders(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const n = READERS[+o.book] ? +o.book : 1, bk = READERS[n], c = bk.ring;
  const pages = [seriesCover(paper, `MY SIGHT WORD READER ${n} OF 4`, name ? `${possessive(name)} reader` : 'My reader', bk.title, bk.words.map((w) => w), c, bk.tint, 'book', ['Five new words', 'Trace and write', 'Find the words', 'A story about me', 'Draw the pictures', 'Super Reader award'])];
  // One page per word: see it, trace it, find it.
  const others = Object.values(READERS).flatMap((b) => b.words);
  bk.words.forEach((w, i) => {
    const col = PALETTE[i % PALETTE.length];
    const pg = new Page(paper, `My word: ${w}`, { subtitle: `Say it, trace it, write it, then find every "${w}" and colour it in!` });
    pg.add(panel(pg.left, pg.y, pg.width, 46, TINTS[i % TINTS.length], col, 12));
    const big = Math.min(34, (pg.width - 20) / (textWidth(w) / 100 + 0.1));
    pg.add(drawText(w, pg.w / 2 - (textWidth(w) / 100) * big / 2, pg.y + (46 - big) / 2 - (/[gjpqy]/.test(w) ? 4 : 0), big, 'trace', true));
    pg.y += 54;
    const row = `${w}   ${w}   ${w}   ${w}`, size = Math.min(18, (pg.width - 6) / (textWidth(row) / 100 + 0.1));
    for (let r = 0; r < 3; r++) {
      pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${pg.y + size}" y2="${pg.y + size}" stroke="#9a93b8" stroke-width="0.5"/><line x1="${pg.left}" x2="${pg.right}" y1="${pg.y + size * 0.45}" y2="${pg.y + size * 0.45}" stroke="#d9d4ec" stroke-width="0.4" stroke-dasharray="2 2"/>`);
      if (r < 2) pg.add(drawText(row, pg.left + 2, pg.y, size, r ? 'ghost' : 'trace', false));
      pg.y += size * 1.6;
    }
    pg.add(txt(pg.left, pg.y + 6, `Colour every bubble that says "${w}"`, 6.4, { anchor: 'start', colour: col }));
    pg.y += 12;
    const decoys = others.filter((x) => x !== w), cells = [];
    for (let k = 0; k < 16; k++) cells.push(k < 6 ? w : decoys[Math.floor(rand() * decoys.length)]);
    const mixed = shuffle(cells, rand);
    const cw = pg.width / 4, ch = Math.min(26, (pg.room - 2) / 4);
    mixed.forEach((t, k) => { const x = pg.left + (k % 4) * cw + cw / 2, y = pg.y + Math.floor(k / 4) * ch + ch / 2; pg.add(`<ellipse cx="${x}" cy="${y}" rx="${cw * 0.42}" ry="${ch * 0.4}" fill="#fff" stroke="${PALETTE[k % PALETTE.length]}" stroke-width="0.9"/>` + txt(x, y + 3, t, 9, { colour: INK })); });
    pages.push(pg.svg());
  });
  // The story: two pages, two scenes each.
  const hi = bk.words.map((w) => w.toLowerCase());
  for (let p = 0; p < 4; p += 2) {
    const pg = new Page(paper, p ? `${bk.title} (part 2)` : bk.title, { subtitle: p ? 'Keep reading! Point to each word as you say it.' : 'Read the story. The coloured words are your new words! Then draw a picture for each page.', noName: true });
    const bh = pg.room / 2;
    bk.story.slice(p, p + 2).forEach(([s, e], k) => {
      const y = pg.y + k * bh, text = s.replace('{n}', name || 'Mia');
      pg.add(panel(pg.left, y + 2, pg.width, bh - 6, '#fff', c, 12));
      pg.add(`<rect x="${pg.left + 8}" y="${y + 10}" width="${pg.width - 16}" height="${bh - 48}" rx="8" fill="${bk.tint}" stroke="${c}" stroke-width="0.5" stroke-dasharray="3 2"/>` + emoji(e, pg.right - 20, y + 22, 14));
      colourSentence(pg, text, pg.w / 2, y + bh - 24, 11, hi, c, pg.width - 20);
      pg.add(txt(pg.left + 10, y + bh - 10, `${p + k + 1}`, 5, { anchor: 'start', font: FONT, colour: SOFT }));
    });
    pages.push(pg.svg());
  }
  const next = n < 4 ? `Next: Reader ${n + 1}, ${READERS[n + 1].title}` : 'You finished all four readers. What a star reader!';
  pages.push(seriesCert(paper, `SIGHT WORD READER ${n} COMPLETE`, 'Super Reader!', name, `for reading ${bk.words.map((w) => `"${w}"`).join(', ')} all by myself!`, next, c));
  return pages;
}

// ================================================================ Dinosaur Explorer kit (Plus)
const DINOS = [
  ['Tyrannosaurus rex', 'tie-RAN-oh-SORE-us', 'meat', 12, 'Its teeth were as long as bananas!'],
  ['Triceratops', 'try-SER-a-tops', 'plants', 9, 'It had three horns and a giant frill.'],
  ['Stegosaurus', 'STEG-oh-SORE-us', 'plants', 9, 'It had big plates all along its back.'],
  ['Brachiosaurus', 'BRAK-ee-oh-SORE-us', 'plants', 26, 'It was as tall as a four storey house.'],
  ['Velociraptor', 'vel-OSS-ee-rap-tor', 'meat', 2, 'It was about the size of a turkey, with feathers!'],
  ['Ankylosaurus', 'an-KY-loh-SORE-us', 'plants', 8, 'It had a tail like a big club.'],
  ['Pteranodon', 'ter-AN-oh-don', 'fish', 7, 'It flew over the sea. Its wings were 7 metres wide!'],
  ['Diplodocus', 'dih-PLOD-oh-kus', 'plants', 27, 'Its long tail cracked like a whip.'],
];

function makeDinoKit(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const lk = { jungle: { ring: '#2e9d62', tint: '#f1f8e6' }, volcano: { ring: '#e0602b', tint: '#fff3ea' } }[o.look] || { ring: '#2e9d62', tint: '#f1f8e6' };
  const pages = [seriesCover(paper, 'DINOSAUR EXPLORER', name ? `${possessive(name)} dinosaur book` : 'My dinosaur book', 'Roar into the past!', ['🦖', '🦕', '🦴', '🥚', '🌋', '🌿'], lk.ring, lk.tint, 'explorer book', ['8 dinosaur cards', 'How long was it?', 'Dig site counting', 'Design a dinosaur', 'Dino words and maze', 'Palaeontologist award'])];
  for (let p = 0; p < 8; p += 4) pages.push(tagsPage(paper, p ? 'Dinosaur cards (more)' : 'Dinosaur cards', 'Read each card together, say the name out loud, then cut them out and play!', 4, 2, (pg, x, y, w, h, i) => {
    const [nm, say, eats, len, fact] = DINOS[p + i], c = PALETTE[(p + i) % PALETTE.length];
    pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="9" fill="${TINTS[(p + i) % TINTS.length]}" stroke="${c}" stroke-width="1.1"/>`);
    pg.add(emoji(eats === 'plants' ? '🦕' : '🦖', x + w / 2, y + h * 0.3, h * 0.26));
    pg.add(txt(x + w / 2, y + h * 0.54, nm, fitFont(nm, 8, w - 16, 0.55), { colour: c }));
    pg.add(txt(x + w / 2, y + h * 0.54 + 7, `Say it: ${say}`, 4.4, { font: FONT, colour: SOFT }));
    wrap(fact, 30).forEach((l, k) => pg.add(txt(x + w / 2, y + h * 0.54 + 15 + k * 6.4, l, 5.2, { font: FONT, weight: 700, colour: INK })));
    const diet = eats === 'meat' ? 'Meat eater' : eats === 'fish' ? 'Fish eater' : 'Plant eater', bw2 = (w - 24) / 2;
    [[diet, 0], [`${len} metres long`, 1]].forEach(([t, k]) => pg.add(`<rect x="${x + 10 + k * (bw2 + 4)}" y="${y + h - 19}" width="${bw2}" height="10" rx="5" fill="#fff" stroke="${c}" stroke-width="0.6"/>` + txt(x + 10 + k * (bw2 + 4) + bw2 / 2, y + h - 12.3, t, fitFont(t, 4.8, bw2 - 4, 0.52), { colour: c })));
  }));
  // How long was it?
  {
    const pg = new Page(paper, 'How long was it?', { subtitle: 'Each square is 1 metre, about as long as you are tall! Count the squares for each dinosaur.' });
    const list = DINOS.slice().sort((a, b) => a[3] - b[3]), max = 27, lw = 46, sq = (pg.width - lw - 4) / max, rh = Math.min(24, (pg.room - 30) / (list.length + 1));
    [['You!', '', '', 1]].concat(list).forEach((d, i) => {
      const y = pg.y + i * rh, c = i ? PALETTE[i % PALETTE.length] : lk.ring;
      pg.add(txt(pg.left, y + rh / 2 + 2, d[0], fitFont(d[0], 5.4, lw - 4, 0.55), { anchor: 'start', colour: c }));
      for (let k = 0; k < d[3]; k++) pg.add(`<rect x="${pg.left + lw + k * sq}" y="${y + rh * 0.22}" width="${sq}" height="${rh * 0.56}" fill="${k % 2 ? '#fff' : TINTS[i % TINTS.length]}" stroke="${c}" stroke-width="0.5"/>`);
      if (!i) pg.add(emoji('🧒', pg.left + lw + sq + 6, y + rh / 2, rh * 0.5));
    });
    pg.y += (list.length + 1) * rh + 8;
    pg.add(txt(pg.left, pg.y + 4, 'The longest dinosaur here is', 6, { anchor: 'start', colour: lk.ring }) + `<line x1="${pg.left + 86}" x2="${pg.right}" y1="${pg.y + 4.6}" y2="${pg.y + 4.6}" stroke="#c9c3e3" stroke-width="0.5"/>`);
    pg.add(txt(pg.left, pg.y + 16, 'How many of you would fit along a Brachiosaurus?', 6, { anchor: 'start', colour: lk.ring }) + `<rect x="${pg.right - 24}" y="${pg.y + 8}" width="22" height="12" rx="3" fill="#fff" stroke="${lk.ring}" stroke-width="0.8"/>`);
    pages.push(pg.svg());
  }
  pages.push(countRowsPage(paper, 'Dig site counting', ['🦴', '🥚', '🦖', '🦕', '🌋', '🌿'], rand));
  // Design a dinosaur.
  {
    const pg = new Page(paper, 'Design your own dinosaur', { subtitle: 'Invent a brand new dinosaur! Give it horns, spikes, wings or anything you like.' });
    const bh = pg.room * 0.62;
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${bh}" rx="12" fill="#fff" stroke="${lk.ring}" stroke-width="1" stroke-dasharray="3 2"/>`);
    pg.y += bh + 8;
    const qs = ['My dinosaur is called', 'It eats', 'It is this long', 'Its special power is'], rh = pg.room / qs.length;
    qs.forEach((q, i) => pg.add(txt(pg.left, pg.y + i * rh + rh * 0.6, q, 6, { anchor: 'start', colour: PALETTE[i % PALETTE.length] }) + `<line x1="${pg.left + q.length * 3 + 6}" x2="${pg.right}" y1="${pg.y + i * rh + rh * 0.62}" y2="${pg.y + i * rh + rh * 0.62}" stroke="#c9c3e3" stroke-width="0.5"/>`));
    pages.push(pg.svg());
  }
  pages.push(traceWordsPage(paper, 'Trace the dinosaur words', [['dinosaur', '🦖'], ['fossil', '🦴'], ['egg', '🥚'], ['roar', '🦕']]));
  pages.push(seasonColour(paper, 'dino', name));
  pages.push(...packRun('mazes', { level: 'easy' }, paper, +o.seed || 1).sheets);
  pages.push(seriesCert(paper, 'DINOSAUR EXPLORER', 'Junior Palaeontologist', name, 'for discovering amazing dinosaurs!', 'Next: find a real dinosaur at a museum!', lk.ring));
  return pages;
}

// ================================================================ Space Academy (Plus)
const PLANETS = [
  ['Mercury', '#b7a99a', 3, 'The closest planet to the Sun.'], ['Venus', '#e8c170', 4.6, 'The hottest planet of all.'],
  ['Earth', '#3a8fd8', 4.8, 'Our home, with water, air and life.'], ['Mars', '#d8643a', 3.8, 'The red planet, with dusty red rocks.'],
  ['Jupiter', '#d9a066', 11, 'The biggest planet, with a giant storm.'], ['Saturn', '#e8cf8a', 9.5, 'It has beautiful rings made of ice.'],
  ['Uranus', '#7fd1d8', 7, 'It spins round on its side.'], ['Neptune', '#3a64d8', 6.8, 'The windiest planet, far, far away.'],
];
const CONSTELLATIONS = [
  ['The Plough', [[0.05, 0.3], [0.22, 0.26], [0.38, 0.36], [0.5, 0.5], [0.55, 0.78], [0.84, 0.82], [0.9, 0.52], [0.5, 0.5]]],
  ['Cassiopeia', [[0.05, 0.3], [0.28, 0.75], [0.5, 0.4], [0.72, 0.78], [0.95, 0.25]]],
  ['Orion', [[0.25, 0.1], [0.4, 0.5], [0.28, 0.92], [0.78, 0.88], [0.6, 0.54], [0.75, 0.15], [0.25, 0.1]]],
];

function planetArt(p, cx, cy, r) {
  const ring = p[0] === 'Saturn' ? `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.8}" ry="${r * 0.45}" fill="none" stroke="#c9a96a" stroke-width="${Math.max(0.6, r * 0.14)}" transform="rotate(-14 ${cx} ${cy})"/>` : '';
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${p[1]}" stroke="#1f1b2e" stroke-width="0.5"/><ellipse cx="${cx - r * 0.3}" cy="${cy - r * 0.35}" rx="${r * 0.35}" ry="${r * 0.2}" fill="#fff" opacity="0.35"/>${ring}`;
}

function makeSpaceKit(o, paper) {
  const name = nameOf(o.name, '') || '';
  const ring = '#3a3fb8', tint = '#eef0ff';
  const pages = [seriesCover(paper, 'SPACE ACADEMY', name ? `${possessive(name)} space mission` : 'My space mission', '3, 2, 1, blast off!', ['🚀', '🪐', '🌙', '⭐', '👩‍🚀', '☄️'], ring, tint, 'mission file', ['8 planet cards', 'Planet order rhyme', 'Countdown tracing', 'Join the stars', 'Astronaut training', 'Space Cadet award'])];
  for (let p = 0; p < 8; p += 4) pages.push(tagsPage(paper, p ? 'Planet cards (more)' : 'Planet cards', 'Read each planet card, then cut them out and put them in order from the Sun!', 4, 2, (pg, x, y, w, h, i) => {
    const pl = PLANETS[p + i];
    pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="9" fill="#1f2350"/>`);
    for (let k = 0; k < 14; k++) pg.add(`<circle cx="${x + 10 + ((k * 37) % (w - 20))}" cy="${y + 10 + ((k * 23) % (h * 0.5))}" r="0.6" fill="#fff"/>`);
    pg.add(planetArt(pl, x + w / 2, y + h * 0.32, Math.min(h * 0.2, 6 + pl[2] * 1.3)));
    pg.add(txt(x + w / 2, y + h * 0.62, pl[0], 9, { colour: '#ffd66b' }));
    wrap(pl[3], 28).forEach((l, k) => pg.add(txt(x + w / 2, y + h * 0.62 + 9 + k * 6.4, l, 5.2, { font: FONT, weight: 700, colour: '#fff' })));
    pg.add(txt(x + w - 12, y + h - 10, `Planet ${p + i + 1} from the Sun`, 4.4, { anchor: 'end', font: FONT, colour: '#b9c0ff' }));
  }));
  // Planet order.
  {
    const pg = new Page(paper, 'The planets in order', { subtitle: 'Say the rhyme to remember the order: My Very Easy Method Just Speeds Up Naming!' });
    const h = 70, y = pg.y;
    pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${h}" rx="10" fill="#1f2350"/><path d="M${pg.left + 4} ${y + 3} A${h / 2 - 2} ${h / 2 - 2} 0 0 1 ${pg.left + 4} ${y + h - 3} Z" fill="#ffc83d"/>`);
    const x0 = pg.left + 30, step = (pg.width - 38) / 8;
    PLANETS.forEach((pl, i) => { pg.add(planetArt(pl, x0 + i * step + step / 2, y + h / 2, pl[2] * 0.95)); pg.add(txt(x0 + i * step + step / 2, y + h - 5, pl[0][0], 5.5, { colour: '#ffd66b' })); });
    pg.y += h + 10;
    const rh = (pg.room - 2) / 8, words = ['My', 'Very', 'Easy', 'Method', 'Just', 'Speeds', 'Up', 'Naming'];
    PLANETS.forEach((pl, i) => { const yy = pg.y + i * rh; pg.add(panel(pg.left, yy + 1.5, pg.width, rh - 3, TINTS[i % TINTS.length], PALETTE[i % PALETTE.length], 7) + txt(pg.left + 8, yy + rh / 2 + 2, `${i + 1}`, 7, { anchor: 'start', colour: PALETTE[i % PALETTE.length] }) + txt(pg.left + 20, yy + rh / 2 + 2, words[i], 6.4, { anchor: 'start', colour: INK })); pg.add(drawText(pl[0], pg.left + 70, yy + rh * 0.24, rh * 0.42, 'trace', false)); });
    pages.push(pg.svg());
  }
  // Countdown.
  {
    const pg = new Page(paper, 'Countdown to blast off!', { subtitle: 'Trace the numbers from 10 down to 1, saying each one out loud. Then shout BLAST OFF!' });
    const cw = pg.width / 2, rh = (pg.room - 30) / 5;
    for (let k = 0; k < 10; k++) { const nmb = 10 - k, x = pg.left + Math.floor(k / 5) * cw, y = pg.y + (k % 5) * rh, c = PALETTE[k % PALETTE.length]; pg.add(panel(x + 3, y + 2, cw - 6, rh - 4, TINTS[k % TINTS.length], c, 10)); const s = rh * 0.6; pg.add(drawText(String(nmb), x + 14, y + rh * 0.2, s, 'trace', true)); pg.add(emoji('🚀', x + cw - 22, y + rh / 2, rh * 0.36)); pg.add(txt(x + cw * 0.58, y + rh / 2 + 2, NUMBER_WORDS[nmb], 6.4, { colour: c })); }
    bubbleText(pg, 'BLAST OFF!', pg.w / 2, pg.bottom - 6, pg.width - 60, 20);
    pages.push(pg.svg());
  }
  // Join the stars.
  {
    const pg = new Page(paper, 'Join the stars', { subtitle: 'Join the numbered stars in order to find famous star pictures in the night sky. Look for them on a clear night!' });
    const bh = pg.room / 3;
    CONSTELLATIONS.forEach(([nm, pts], i) => {
      const y = pg.y + i * bh, bx = pg.left, bw = pg.width, x0 = bx + 30, y0 = y + 14, w = bw - 60, h = bh - 30;
      pg.add(`<rect x="${bx}" y="${y + 2}" width="${bw}" height="${bh - 6}" rx="10" fill="#1f2350"/>` + txt(bx + 10, y + 12, nm, 7, { anchor: 'start', colour: '#ffd66b' }));
      for (let k = 0; k < 18; k++) pg.add(`<circle cx="${bx + 8 + ((k * 53 + i * 17) % (bw - 16))}" cy="${y + 8 + ((k * 29 + i * 11) % (bh - 20))}" r="0.5" fill="#8f96d8"/>`);
      const seen = [];
      pts.forEach(([px, py], k) => { const sx = x0 + px * w, sy = y0 + py * h; if (seen.some(([a, b]) => a === px && b === py)) return; seen.push([px, py]); pg.add(`<path d="${starPath(sx, sy, 3.4, 0.45)}" fill="#ffd66b"/>` + txt(sx + 5, sy - 3, `${k + 1}`, 5, { anchor: 'start', font: FONT, colour: '#fff' })); });
      if (nm === 'Orion') pg.add(`<path d="${starPath(x0 + 0.5 * w, y0 + 0.52 * h, 3.4, 0.45)}" fill="#ffd66b"/>`);
    });
    pages.push(pg.svg());
  }
  pages.push(checklistPage(paper, 'Astronaut training', 'Astronauts train hard! Colour the star when you finish each mission.', [['🦘', 'Jump like you are on the Moon, 10 times'], ['🧘', 'Float slowly like there is no gravity'], ['🍎', 'Eat a healthy snack, like astronauts do'], ['🔭', 'Look at the Moon tonight and draw it'], ['🧩', 'Solve a puzzle as a team'], ['💪', 'Hold a star shape for 10 seconds'], ['📏', 'Measure how far you can jump'], ['⭐', 'Count the stars you can see from your window']], name));
  pages.push(seasonColour(paper, 'rocket', name));
  pages.push(seriesCert(paper, 'SPACE ACADEMY', 'Space Cadet', name, 'for completing astronaut training and exploring the planets!', 'Next: look up at the Moon tonight!', ring));
  return pages;
}

// ================================================================ Winter Wonderland pack (Plus)
function makeWinter(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const lk = { snowy: { ring: '#3a8fd8', tint: '#eef6ff' }, frosty: { ring: '#8a3fd1', tint: '#f5edff' } }[o.look] || { ring: '#3a8fd8', tint: '#eef6ff' };
  const yr = new Date().getMonth() >= 9 ? new Date().getFullYear() + 1 : new Date().getFullYear();
  const pages = [seriesCover(paper, 'WINTER WONDERLAND', name ? `${possessive(name)} winter book` : 'My winter book', 'Cosy days and snowy fun', ['❄️', '⛄', '🧤', '☕', '🐧', '🧣'], lk.ring, lk.tint, 'book', ['Winter counting', 'Winter words', 'Finish the snowflake', 'Roll a snowman', 'Winter bingo', `My goals for ${yr}`])];
  pages.push(countRowsPage(paper, 'Winter counting', ['❄️', '⛄', '🧤', '☕', '🐧', '🧣'], rand));
  pages.push(traceWordsPage(paper, 'Trace the winter words', [['snow', '❄️'], ['cold', '🧤'], ['scarf', '🧣'], ['cosy', '☕']]));
  // Finish the snowflake.
  {
    const pg = new Page(paper, 'Finish the snowflake', { subtitle: 'Every snowflake has six arms. Copy the finished arm onto all the others. No two snowflakes are the same!' });
    const r = Math.min(pg.width, pg.room) * 0.42, cx = pg.w / 2, cy = pg.y + pg.room / 2;
    pg.add(`<circle cx="${cx}" cy="${cy}" r="${r + 6}" fill="${lk.tint}" stroke="${lk.ring}" stroke-width="0.8"/>`);
    for (let k = 0; k < 6; k++) {
      const a = -Math.PI / 2 + (k * Math.PI) / 3, ex = cx + Math.cos(a) * r, ey = cy + Math.sin(a) * r;
      pg.add(`<line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="${k ? '#b9b3d6' : lk.ring}" stroke-width="${k ? 0.5 : 1.6}" ${k ? 'stroke-dasharray="2 2"' : ''} stroke-linecap="round"/>`);
      if (!k) for (const f of [0.35, 0.6, 0.82]) { const bx = cx + Math.cos(a) * r * f, by = cy + Math.sin(a) * r * f, l = r * (0.24 - f * 0.12); [-1, 1].forEach((s) => pg.add(`<line x1="${bx}" y1="${by}" x2="${bx + Math.cos(a + s * 0.8) * l}" y2="${by + Math.sin(a + s * 0.8) * l}" stroke="${lk.ring}" stroke-width="1.4" stroke-linecap="round"/>`)); }
    }
    pg.add(`<circle cx="${cx}" cy="${cy}" r="3" fill="${lk.ring}"/>`);
    pages.push(pg.svg());
  }
  // Roll a snowman.
  {
    const pg = new Page(paper, 'Roll a snowman', { subtitle: 'Take turns to roll a dice and draw that part. The first to finish their snowman wins!' });
    const parts = [['⚪', '1', 'Body'], ['⚪', '2', 'Head'], ['👀', '3', 'Two eyes'], ['🥕', '4', 'Carrot nose'], ['🎩', '5', 'Hat'], ['🧣', '6', 'Scarf']];
    const kh = 16, cw = pg.width / 6;
    parts.forEach(([e, d, t], i) => { const x = pg.left + i * cw; pg.add(panel(x + 1.5, pg.y, cw - 3, kh + 8, TINTS[i % TINTS.length], PALETTE[i % PALETTE.length], 7) + txt(x + 8, pg.y + 10, d, 9, { colour: PALETTE[i % PALETTE.length] }) + emoji(e, x + cw - 11, pg.y + 9, 9) + txt(x + cw / 2, pg.y + kh + 4, t, fitFont(t, 5, cw - 6, 0.52), { font: FONT, colour: INK })); });
    pg.y += kh + 14;
    const bw = pg.width / 2;
    for (let p = 0; p < 2; p++) pg.add(`<rect x="${pg.left + p * bw + 3}" y="${pg.y}" width="${bw - 6}" height="${pg.room - 4}" rx="10" fill="#fff" stroke="${lk.ring}" stroke-width="0.8" stroke-dasharray="3 2"/>` + txt(pg.left + p * bw + 10, pg.y + 9, p ? 'Player 2' : 'Player 1', 5.6, { anchor: 'start', colour: lk.ring }) + `<path d="M${pg.left + p * bw + 10} ${pg.bottom - 14} Q${pg.left + p * bw + bw / 2} ${pg.bottom - 22} ${pg.left + (p + 1) * bw - 10} ${pg.bottom - 14}" fill="none" stroke="#c9c3e3" stroke-width="0.6"/>`);
    pages.push(pg.svg());
  }
  pages.push(picGridPage(paper, 'Winter bingo', 'Cross off each thing you spot this winter. Four in a row is BINGO!', [['❄️', 'Snowflake'], ['⛄', 'Snowman'], ['🧤', 'Gloves'], ['🐦', 'A robin'], ['🌲', 'Evergreen tree'], ['☕', 'Hot drink'], ['🧣', 'Scarf'], ['🥾', 'Muddy boots'], ['🌬️', 'Frosty breath'], ['🕯️', 'Candle'], ['🦊', 'Animal tracks'], ['🧊', 'Ice'], ['🌙', 'Dark by teatime'], ['🍲', 'Warm soup'], ['📚', 'Cosy story'], ['🛷', 'Sledge']]));
  pages.push(checklistPage(paper, 'My cosy winter bucket list', 'Winter is full of little joys. Colour the star for each one you do!', [['⛄', 'Build a snowman (or a sock snowman!)'], ['☕', 'Drink hot chocolate with marshmallows'], ['🏕️', 'Make a blanket den'], ['🐦', 'Put out food for the birds'], ['🍪', 'Bake winter cookies'], ['🔦', 'Go on a torchlight walk'], ['🎬', 'Have a cosy film night'], ['🧊', 'Freeze an ice decoration'], ['👣', 'Follow footprints in frost or snow'], ['💌', 'Send a card to someone far away']], name));
  // Goals for the new year.
  {
    const pg = new Page(paper, `My goals for ${yr}`, { subtitle: 'A brand new year! What would you like to learn, try and do? Ask a grown-up to help you write.' });
    const boxes = [['📚', 'I want to learn'], ['🌟', 'I want to try'], ['💛', 'I will be kind by'], ['🎉', 'Something fun I want to do'], ['🏆', 'I am proud that last year I']], bh = pg.room / boxes.length;
    boxes.forEach(([e, t], i) => { const y = pg.y + i * bh, c = PALETTE[i % PALETTE.length]; pg.add(panel(pg.left, y + 2, pg.width, bh - 5, TINTS[i % TINTS.length], c, 10) + emoji(e, pg.left + 12, y + 14, 10) + txt(pg.left + 24, y + 16, t, 7, { anchor: 'start', colour: c })); for (let l = 1; l <= 2; l++) pg.add(`<line x1="${pg.left + 10}" x2="${pg.right - 10}" y1="${y + 16 + l * (bh - 24) / 2.4}" y2="${y + 16 + l * (bh - 24) / 2.4}" stroke="#c9c3e3" stroke-width="0.45"/>`); });
    pages.push(pg.svg());
  }
  pages.push(seasonColour(paper, 'snowman', name));
  pages.push(seasonColour(paper, 'penguin', name));
  pages.push(seasonCert(paper, 'Winter Wonder Star', name, 'for filling winter with fun, kindness and cosy adventures!', 'snowman', lk.ring));
  return pages;
}

Object.assign(MAKERS, { readers: makeReaders, dinokit: makeDinoKit, spacekit: makeSpaceKit, winter: makeWinter });
