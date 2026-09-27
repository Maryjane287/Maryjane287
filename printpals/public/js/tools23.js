// PrintPals batch 23 (Plus): My Handwriting Books, Superhero Academy, Flying Adventure kit, My Feelings Book.

// A cover shared by the book series: title, subtitle and a row of bubbles.
function seriesCover(paper, kicker, title, sub, bubbles, ring, tint, owner, inside) {
  const pg = new Page(paper, '', { bare: true, tint });
  pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="14" fill="#fff" stroke="${ring}" stroke-width="1.6"/>`);
  pg.add(txt(pg.w / 2, pg.m + 22, kicker, 6, { font: FONT, colour: SOFT }).replace('<text ', '<text letter-spacing="2" '));
  bubbleText(pg, title, pg.w / 2, pg.m + 48, pg.width - 40, 24);
  pg.add(txt(pg.w / 2, pg.m + 64, sub, fitFont(sub, 9, pg.width - 40, 0.55), { colour: ring }));
  const cols = bubbles.length > 6 ? 4 : 3, r = bubbles.length > 6 ? 17 : 20;
  bubbles.forEach((s, i) => { const x = pg.left + ((i % cols) + 0.5) * pg.width / cols, y = pg.m + 100 + Math.floor(i / cols) * (r * 2 + 10); pg.add(`<circle cx="${x}" cy="${y}" r="${r}" fill="${TINTS[i % TINTS.length]}" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="1.2"/>` + (/^\p{Extended_Pictographic}/u.test(s) ? emoji(s, x, y, r * 1.1) : txt(x, y + r * 0.36, s, fitFont(s, r, r * 1.6, 0.6), { colour: PALETTE[i % PALETTE.length] }))); });
  if (inside && inside.length) {
    const rows = Math.ceil(inside.length / 2), y0 = pg.m + 100 + Math.ceil(bubbles.length / cols) * (r * 2 + 10) - 4, ch = 13, bw = (pg.width - 60) / 2;
    pg.add(txt(pg.w / 2, y0, 'INSIDE THIS ' + owner.toUpperCase(), 5, { font: FONT, colour: SOFT }).replace('<text ', '<text letter-spacing="1.6" '));
    inside.forEach((t, i) => { const x = pg.left + 30 + (i % 2) * bw, y = y0 + 6 + Math.floor(i / 2) * ch; pg.add(`<rect x="${x + 2}" y="${y}" width="${bw - 4}" height="${ch - 3}" rx="${(ch - 3) / 2}" fill="${tint}" stroke="${ring}" stroke-width="0.5"/>` + txt(x + bw / 2, y + (ch - 3) / 2 + 1.8, t, fitFont(t, 5, bw - 12, 0.52), { colour: INK })); });
  }
  pg.add(txt(pg.left + 24, pg.bottom - 16, `This ${owner} belongs to`, 4.8, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 70}" x2="${pg.right - 24}" y1="${pg.bottom - 15.4}" y2="${pg.bottom - 15.4}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  pg.footer = () => {};
  return pg.svg();
}

// ================================================================ My Handwriting Books (Plus)
const HAND_BOOKS = {
  1: { title: 'Pencil power', ring: '#3fbfa8', tint: '#e8f8f4', show: ['✏️', '⭕', '🔺', '⭐', '➰', '🌈'], inside: ['Straight lines', 'Waves and bumps', 'Zigzags', 'Castles and loops', 'Circles and squares', 'Triangles and stars'] },
  2: { title: 'Letters a to m', ring: '#ff7eb6', tint: '#fff0f5', letters: 'abcdefghijklm', inside: ['13 letter pages', 'A picture for every letter', 'Green start dots', 'Trace, fade, then write', 'A word to trace', 'Super Writer award'] },
  3: { title: 'Letters n to z', ring: '#6c8cff', tint: '#eef2ff', letters: 'nopqrstuvwxyz', inside: ['13 letter pages', 'A picture for every letter', 'Green start dots', 'Trace, fade, then write', 'A word to trace', 'Super Writer award'] },
  4: { title: 'Capitals and my name', ring: '#e08a00', tint: '#fff6e0', inside: ['Capitals A to Z', 'Writing my name', 'My first sentences', 'Finger spaces', 'Full stops', 'Super Writer award'] },
};

function handLetterPage(paper, L, c) {
  const U = L.toUpperCase(), [thing] = NAME_BOOK[U];
  const isE = /^\S+ /.test(thing) && !ALL_PICS.includes(thing), label = isE ? thing.split(' ').slice(1).join(' ') : thing;
  const pg = new Page(paper, `Letter ${L}`, { subtitle: `${label.startsWith(L) ? `${L} is for ${label}.` : `Can you find ${L} in ${label}?`} Start at the green dot, follow the numbers, then write it on your own!` });
  const bh = 74;
  pg.add(panel(pg.left, pg.y, pg.width * 0.5, bh, TINTS[L.charCodeAt(0) % TINTS.length], c, 12));
  const tail = /[gjpqy]/.test(L), ls = tail ? (bh - 14) / 1.5 : bh - 18, lw = (textWidth(L) / 100) * ls;
  pg.add(drawText(L, pg.left + pg.width * 0.25 - lw / 2, pg.y + (tail ? 6 : 8), ls, 'trace', true));
  const px = pg.left + pg.width * 0.5 + 6, pw = pg.width * 0.5 - 6;
  pg.add(panel(px, pg.y, pw, bh, '#fff', '#e2ddf2', 12) + (isE ? emoji(thing.split(' ')[0], px + pw / 2, pg.y + bh * 0.42, bh * 0.46) : pic(ART(thing), px + pw / 2, pg.y + bh * 0.42, bh * 0.62)));
  pg.add(`<text x="${px + pw / 2}" y="${pg.y + bh - 7}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="8">${(() => { const k = Math.max(0, label.indexOf(L)); return `<tspan fill="${INK}">${esc(label.slice(0, k))}</tspan><tspan fill="${c}">${esc(label[k])}</tspan><tspan fill="${INK}">${esc(label.slice(k + 1))}</tspan>`; })()}</text>`);
  pg.y += bh + 10;
  const row = `${L}  ${L}  ${L}  ${L}  ${L}  ${L}  ${L}`, size = Math.min(19, (pg.width - 6) / (textWidth(row) / 100 + 0.1));
  for (let r = 0; r < 4; r++) {
    pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${pg.y + size}" y2="${pg.y + size}" stroke="#9a93b8" stroke-width="0.5"/><line x1="${pg.left}" x2="${pg.right}" y1="${pg.y + size * 0.45}" y2="${pg.y + size * 0.45}" stroke="#d9d4ec" stroke-width="0.4" stroke-dasharray="2 2"/>`);
    if (r < 3) pg.add(drawText(row, pg.left + 2, pg.y, size, r === 2 ? 'ghost' : 'trace', r === 0));
    pg.y += size * 1.55;
  }
  const w2 = label.toLowerCase(), ws = Math.min(22, (pg.room - 16) / 1.4, (pg.width * 0.55) / (textWidth(w2) / 100 + 0.1));
  if (ws >= 12) {
    pg.add(txt(pg.left, pg.y + 4, 'Trace the word, then write it on the line', 5.4, { anchor: 'start', colour: c }));
    pg.y += 10;
    pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${pg.y + ws}" y2="${pg.y + ws}" stroke="#9a93b8" stroke-width="0.5"/>`);
    pg.add(drawText(w2, pg.left + 4, pg.y, ws, 'trace', false));
    const lx = pg.left + 12 + (textWidth(w2) / 100) * ws;
    if (pg.right - lx > 20) pg.add(`<line x1="${lx}" x2="${pg.right}" y1="${pg.y + ws * 0.45}" y2="${pg.y + ws * 0.45}" stroke="#d9d4ec" stroke-width="0.4" stroke-dasharray="2 2"/>`);
  }
  return pg.svg();
}

function makeHandwritingBook(o, paper) {
  const name = nameOf(o.name, '') || '';
  const n = HAND_BOOKS[+o.book] ? +o.book : 1, bk = HAND_BOOKS[n], c = bk.ring;
  const pages = [seriesCover(paper, `MY HANDWRITING BOOK ${n} OF 4`, name ? `${possessive(name)} handwriting` : 'My handwriting', bk.title, bk.show || [...(bk.letters || 'ABCDEF')].slice(0, 6), c, bk.tint, 'book', bk.inside)];
  if (n === 1) {
    pages.push(...packRun('prewriting', { type: 'mixed' }, paper, +o.seed || 1, true).sheets);
    ['zigzag', 'castle', 'loops'].forEach((t) => pages.push(...packRun('prewriting', { type: t }, paper, +o.seed || 1).sheets));
    // Trace the shapes.
    const pg = new Page(paper, 'Trace the shapes', { subtitle: 'Start at the green dot and go all the way round. Then try one on your own in the empty space!' });
    const shapes = [(cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`, (cx, cy, r) => `<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}"/>`, (cx, cy, r) => `<path d="M${cx} ${cy - r} L${cx + r} ${cy + r * 0.8} L${cx - r} ${cy + r * 0.8} Z"/>`, (cx, cy, r) => `<path d="${starPath(cx, cy, r * 1.1, 0.5)}"/>`];
    const rh = pg.room / 4;
    shapes.forEach((f, i) => { const cy = pg.y + i * rh + rh / 2, r = rh * 0.34; for (let k = 0; k < 3; k++) { const cx = pg.left + 26 + k * 50; pg.add(`<g fill="none" stroke="${k === 2 ? '#e6e2f2' : '#9a93b8'}" stroke-width="1.2" stroke-dasharray="${k === 2 ? '1 2' : '3 2'}" stroke-linejoin="round">${f(cx, cy, r)}</g>`); if (!k) pg.add(`<circle cx="${cx + (i === 0 ? r : i === 3 ? 0 : 0) * 0 + (i === 0 ? r : 0)}" cy="${i === 0 ? cy : cy - r}" r="2" fill="#3fbf6f"/>`); } pg.add(`<rect x="${pg.left + 180}" y="${cy - rh * 0.4}" width="${pg.width - 180}" height="${rh * 0.8}" rx="8" fill="#fff" stroke="#e2ddf2" stroke-width="0.6" stroke-dasharray="3 2"/>`); });
    pages.push(pg.svg());
  }
  if (n === 2 || n === 3) [...bk.letters].forEach((L, i) => pages.push(handLetterPage(paper, L, PALETTE[i % PALETTE.length])));
  if (n === 4) {
    const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let p = 0; p < 26; p += 7) {
      const pg = new Page(paper, p ? 'Capital letters (more)' : 'Capital letters', { subtitle: 'Capitals start names, places and sentences. Trace each one, then write it on your own.' });
      const rh = pg.room / 7;
      [...abc.slice(p, p + 7)].forEach((L, i) => {
        const y = pg.y + i * rh, size = rh * 0.62, c2 = PALETTE[(p + i) % PALETTE.length];
        pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${y + rh * 0.12 + size}" y2="${y + rh * 0.12 + size}" stroke="#9a93b8" stroke-width="0.5"/>` + txt(pg.left + 6, y + rh * 0.12 + size * 0.8, L, size * 0.9, { colour: c2 }));
        pg.add(drawText(`${L}  ${L}  ${L}  ${L}`, pg.left + 26, y + rh * 0.12, size, 'trace', true));
      });
      pages.push(pg.svg());
    }
    // My name.
    {
      const nm = name || 'Mia';
      const pg = new Page(paper, name ? `${name} can write ${name}!` : 'I can write my name!', { subtitle: 'Your name starts with a capital letter. Trace it, then write it all by yourself!' });
      const size = Math.min(34, (pg.width - 10) / (textWidth(nm) / 100 + 0.1)), rh = size * 1.6;
      for (let r = 0; r < Math.floor((pg.room - 4) / rh); r++) { const y = pg.y + r * rh; pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${y + size}" y2="${y + size}" stroke="#9a93b8" stroke-width="0.5"/><line x1="${pg.left}" x2="${pg.right}" y1="${y + size * 0.45}" y2="${y + size * 0.45}" stroke="#d9d4ec" stroke-width="0.4" stroke-dasharray="2 2"/>`); if (r < 4) pg.add(drawText(nm, pg.left + 4, y, size, r === 3 ? 'ghost' : 'trace', r === 0)); }
      pages.push(pg.svg());
    }
    // My first sentences.
    {
      const nm = name || 'Mia';
      const sents = [`My name is ${nm}.`, 'I can write.', 'I like to play.', 'I am kind.', 'The sun is hot.'];
      const pg = new Page(paper, 'My first sentences', { subtitle: 'A capital letter at the start, a full stop at the end, and finger spaces between the words!' });
      const rh = pg.room / sents.length;
      sents.forEach((s, i) => { const y = pg.y + i * rh, size = Math.min(rh * 0.3, (pg.width - 10) / (textWidth(s) / 100 + 0.1)); pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${y + size + 2}" y2="${y + size + 2}" stroke="#9a93b8" stroke-width="0.5"/>`); pg.add(drawText(s, pg.left + 2, y + 2, size, 'trace', false)); pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${y + size * 2.6}" y2="${y + size * 2.6}" stroke="#c9c3e3" stroke-width="0.45"/>`); });
      pages.push(pg.svg());
    }
  }
  const next = n < 4 ? `Next: Handwriting Book ${n + 1}, ${HAND_BOOKS[n + 1].title}` : 'You finished all four handwriting books. Amazing!';
  pages.push(seriesCert(paper, `HANDWRITING BOOK ${n} COMPLETE`, 'Super Writer!', name, `for beautiful work in ${bk.title.toLowerCase()}!`, next, c));
  return pages;
}

// ================================================================ Superhero Academy (Plus)
const HERO_MISSIONS = [
  ['💛', 'Help someone without being asked'], ['🦁', 'Try a food you have never tasted'], ['🧹', 'Tidy your room in 5 minutes flat'], ['🤝', 'Make someone new feel welcome'], ['💪', 'Do 20 super jumps'],
  ['📚', 'Read a story to someone'], ['😊', 'Give 3 people a compliment'], ['🦷', 'Brush your teeth for 2 whole minutes'], ['🌱', 'Water a plant or feed a pet'], ['🎨', 'Make a card for a superhero in your life'],
  ['🙋', 'Be brave and ask a question'], ['🧘', 'Take 5 slow hero breaths when you are cross'], ['🍎', 'Eat a rainbow of fruit and veg today'], ['🧦', 'Get dressed all by yourself'], ['🗣️', 'Say sorry, even when it is hard'],
  ['🧺', 'Help with the washing'], ['🏃', 'Race around the garden 3 times'], ['🤗', 'Give someone a big hero hug'], ['🎁', 'Share something special'], ['⭐', 'Do something brave you were scared of'],
];

function makeSuperhero(o, paper) {
  const name = nameOf(o.name, '') || '';
  const lk = { red: { ring: '#e0453b', tint: '#fff0f0', cols: ['#e0453b', '#ffb938', '#3a64d8'] }, blue: { ring: '#3a64d8', tint: '#eef2ff', cols: ['#3a64d8', '#ffb938', '#e0453b'] }, purple: { ring: '#8a3fd1', tint: '#f5edff', cols: ['#8a3fd1', '#3fbfa8', '#ff7eb6'] } }[o.look] || { ring: '#e0453b', tint: '#fff0f0', cols: ['#e0453b', '#ffb938', '#3a64d8'] };
  const pages = [];
  pages.push(seriesCover(paper, 'TOP SECRET HERO FILE', name ? `${possessive(name)} Superhero Academy` : 'Superhero Academy', 'Every hero starts somewhere!', ['🦸', '⚡', '💪', '❤️', '⭐', '🛡️'], lk.ring, lk.tint, 'hero file', ['My hero ID card', 'Design your hero', '20 hero missions', 'Hero training week', 'Mask and badges', 'Superhero award']));
  // Hero ID card.
  pages.push(tagsPage(paper, 'My hero ID card', 'Fill it in, cut it out and keep it in your pocket. Heroes carry ID!', 2, 1, (pg, x, y, w, h, i) => {
    const c = lk.cols[i];
    pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="10" fill="${lk.tint}" stroke="${c}" stroke-width="1.4"/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="18" rx="10" fill="${c}"/>`);
    pg.add(txt(x + w / 2, y + 16.4, i ? 'HERO ACADEMY PASS' : 'OFFICIAL HERO ID', 8, { colour: '#fff' }).replace('<text ', '<text letter-spacing="2" '));
    pg.add(`<rect x="${x + 14}" y="${y + 30}" width="${h * 0.55}" height="${h * 0.62}" rx="6" fill="#fff" stroke="${c}" stroke-width="0.8" stroke-dasharray="2 1.5"/>` + txt(x + 14 + h * 0.275, y + 30 + h * 0.31, 'Draw your hero face', 3.8, { font: FONT, colour: SOFT }));
    const fx = x + 22 + h * 0.55;
    [['Hero name', ''], ['Real name', name], ['Superpower', ''], ['Hero sign', '']].forEach(([l, v], k) => { const yy = y + 38 + k * (h * 0.62 - 8) / 4; pg.add(txt(fx, yy, l, 5, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${fx + l.length * 2.6 + 4}" x2="${x + w - 16}" y1="${yy + 0.8}" y2="${yy + 0.8}" stroke="#c9c3e3" stroke-width="0.5"/>` + (v ? txt(fx + l.length * 2.6 + 7, yy - 0.4, v, 6.4, { anchor: 'start', colour: c }) : '')); });
  }));
  // Design your superhero.
  {
    const pg = new Page(paper, 'Design your superhero', { subtitle: 'Draw yourself as a superhero. What does your cape look like? What is on your chest?' });
    const bh = pg.room * 0.66;
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${bh}" rx="12" fill="#fff" stroke="${lk.ring}" stroke-width="1" stroke-dasharray="3 2"/>`);
    pg.y += bh + 8;
    const qs = ['My superpower is', 'I use it to help', 'My hero weakness is', 'My sidekick is'], rh = pg.room / qs.length;
    qs.forEach((q, i) => pg.add(txt(pg.left, pg.y + i * rh + rh * 0.6, q, 6, { anchor: 'start', colour: lk.cols[i % 3] }) + `<line x1="${pg.left + q.length * 3 + 6}" x2="${pg.right}" y1="${pg.y + i * rh + rh * 0.62}" y2="${pg.y + i * rh + rh * 0.62}" stroke="#c9c3e3" stroke-width="0.5"/>`));
    pages.push(pg.svg());
  }
  // Hero missions.
  for (let p = 0; p < 20; p += 10) pages.push(checklistPage(paper, p ? 'Hero missions (more)' : 'Hero missions', 'Every hero mission makes the world better. Colour the star when you complete one!', HERO_MISSIONS.slice(p, p + 10), name));
  // Training chart.
  {
    const pg = new Page(paper, 'Hero training week', { subtitle: 'Heroes train every day! Tick each exercise when you do it.' });
    const ex = [['🦘', '10 hero jumps'], ['🏃', 'Run on the spot for 30 seconds'], ['🧘', 'Balance on one leg for 10'], ['💨', '5 slow hero breaths'], ['🤸', 'Touch your toes 10 times'], ['⭐', 'One kind act']];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], lw = 64, cw = (pg.width - lw) / 7, hh = 12, rh = Math.min(28, (pg.room - hh - 4) / ex.length);
    days.forEach((d, i) => pg.add(`<rect x="${pg.left + lw + i * cw}" y="${pg.y}" width="${cw}" height="${hh}" fill="${lk.tint}" stroke="#d9d4ec" stroke-width="0.4"/>` + txt(pg.left + lw + i * cw + cw / 2, pg.y + 8, d, 5, { colour: lk.ring })));
    ex.forEach(([e, t], j) => { const y = pg.y + hh + j * rh; pg.add(`<rect x="${pg.left}" y="${y}" width="${lw}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.4"/>` + emoji(e, pg.left + 8, y + rh / 2, 8)); textLines(pg, wrap(t, 16), pg.left + 15, y + rh / 2 + 1.6 - (wrap(t, 16).length - 1) * 2.4, 4.4, { weight: 800, lh: 1.1 }); for (let i = 0; i < 7; i++) pg.add(`<rect x="${pg.left + lw + i * cw}" y="${y}" width="${cw}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.4"/><path d="${starPath(pg.left + lw + i * cw + cw / 2, y + rh / 2, 5, 0.46)}" fill="#fff" stroke="${lk.cols[j % 3]}" stroke-width="0.7"/>`); });
    pages.push(pg.svg());
  }
  // Mask and badges to cut out.
  {
    const pg = new Page(paper, 'Hero mask and badges', { subtitle: 'Colour the mask and cut it out, with eye holes cut by a grown-up. Stick a badge on your top!', noName: true });
    const cx = pg.w / 2, y = pg.y + 10, W = pg.width * 0.8, H = 60;
    pg.add(`<path d="M${cx - W / 2} ${y + H * 0.35} Q${cx - W / 2} ${y} ${cx - W * 0.2} ${y + 4} Q${cx} ${y + 12} ${cx + W * 0.2} ${y + 4} Q${cx + W / 2} ${y} ${cx + W / 2} ${y + H * 0.35} Q${cx + W / 2} ${y + H} ${cx + W * 0.18} ${y + H * 0.8} Q${cx} ${y + H * 0.6} ${cx - W * 0.18} ${y + H * 0.8} Q${cx - W / 2} ${y + H} ${cx - W / 2} ${y + H * 0.35} Z" fill="#fff" stroke="#1f1b2e" stroke-width="1"/>`);
    [-1, 1].forEach((s) => pg.add(`<ellipse cx="${cx + s * W * 0.2}" cy="${y + H * 0.42}" rx="${W * 0.11}" ry="${H * 0.17}" fill="#fff" stroke="#1f1b2e" stroke-width="0.8" stroke-dasharray="2.5 1.6"/><circle cx="${cx + s * W * 0.47}" cy="${y + H * 0.36}" r="2" fill="#fff" stroke="#1f1b2e" stroke-width="0.6"/>`));
    const by = y + H + 20, bs = pg.width / 4, marks = ['⚡', '⭐', '❤️', '🛡️', '🔥', '💎', '🌈', '👑'];
    marks.forEach((m, i) => { const bx = pg.left + (i % 4) * bs + bs / 2, bcy = by + Math.floor(i / 4) * (bs + 6) + bs / 2, r = bs * 0.42; pg.add(`<circle cx="${bx}" cy="${bcy}" r="${r}" fill="#fff" stroke="#1f1b2e" stroke-width="0.8" stroke-dasharray="2.5 1.6"/><circle cx="${bx}" cy="${bcy}" r="${r * 0.82}" fill="${TINTS[i % TINTS.length]}" stroke="${lk.cols[i % 3]}" stroke-width="0.8"/>` + emoji(m, bx, bcy, r)); });
    pages.push(pg.svg());
  }
  pages.push(seriesCert(paper, 'SUPERHERO ACADEMY', 'Official Superhero', name, 'for completing hero training with kindness and courage!', 'Next: keep doing one hero mission every day!', lk.ring));
  return pages;
}

// ================================================================ Flying Adventure kit (Plus)
function makeFlying(o, paper) {
  const name = nameOf(o.name, '') || '';
  const dest = String(o.dest || '').trim().slice(0, 22);
  const who = String(o.who || '').trim().slice(0, 22);
  const ring = '#3a8fd8', tint = '#eef6ff';
  const pages = [];
  pages.push(seriesCover(paper, 'MY FLYING ADVENTURE', name ? `${possessive(name)} big trip` : 'My big trip', dest ? `Flying to ${dest}${who ? ' to see ' + who : ''}!` : 'Up, up and away!', ['✈️', '☁️', '🧳', '🌍', '🛫', '⭐'], ring, tint, 'travel book', ['Boarding passes', 'Travel passport', 'Airport bingo', 'Window and flight log', 'Hand luggage list', 'Brave Flyer award']));
  // Boarding passes.
  pages.push(tagsPage(paper, 'My boarding pass', 'Fill in your boarding pass and keep it safe. Show it to your grown-up at the gate!', 2, 1, (pg, x, y, w, h, i) => {
    const c = i ? '#e0457b' : ring;
    pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="8" fill="#fff" stroke="${c}" stroke-width="1.2"/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="16" rx="8" fill="${c}"/><line x1="${x + w * 0.72}" x2="${x + w * 0.72}" y1="${y + 22}" y2="${y + h - 6}" stroke="${c}" stroke-width="0.6" stroke-dasharray="2 1.5"/>`);
    pg.add(txt(x + 12, y + 15, i ? 'RETURN FLIGHT' : 'BOARDING PASS', 7.4, { anchor: 'start', colour: '#fff' }).replace('<text ', '<text letter-spacing="2" ') + emoji('✈️', x + w - 16, y + 12, 9));
    const f = [['Passenger', name], ['From', ''], ['To', i ? '' : dest], ['Date', ''], ['Flight', ''], ['Seat', '']];
    f.forEach(([l, v], k) => { const fx = x + 12 + (k % 2) * (w * 0.33), fy = y + 34 + Math.floor(k / 2) * ((h - 44) / 3); pg.add(txt(fx, fy, l, 4.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${fx}" x2="${fx + w * 0.3}" y1="${fy + 9}" y2="${fy + 9}" stroke="#c9c3e3" stroke-width="0.5"/>` + (v ? txt(fx + 1, fy + 7.4, v, 6.4, { anchor: 'start', colour: c }) : '')); });
    pg.add(txt(x + w * 0.86, y + 36, 'GATE', 5, { font: FONT, colour: SOFT }) + `<rect x="${x + w * 0.86 - 14}" y="${y + 40}" width="28" height="16" rx="4" fill="${TINTS[i]}" stroke="${c}" stroke-width="0.7"/>`);
    for (let b = 0; b < 26; b++) pg.add(`<rect x="${x + w * 0.76 + b * 1.4}" y="${y + h - 30}" width="${b % 3 ? 0.6 : 1}" height="18" fill="${INK}"/>`);
  }));
  // Travel passport.
  {
    const pg = new Page(paper, 'My travel passport', { subtitle: 'Collect a stamp or a sticker at every step of your journey!', noName: true });
    const steps = [['🏠', 'Leaving home'], ['🚗', 'Going to the airport'], ['🧳', 'Checking in my bag'], ['🛂', 'Showing my passport'], ['🛫', 'Take off!'], ['☁️', 'Above the clouds'], ['🍽️', 'Eating on the plane'], ['🛬', 'Landing'], ['🤗', dest ? `Hello ${dest}!` : 'We made it!']];
    const cw = pg.width / 3, ch = pg.room / 3;
    steps.forEach(([e, t], i) => { const x = pg.left + (i % 3) * cw, y = pg.y + Math.floor(i / 3) * ch, c = PALETTE[i % PALETTE.length]; pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, '#fff', c, 10) + emoji(e, x + 14, y + 14, 12) + txt(x + cw / 2, y + ch - 10, t, fitFont(t, 5.6, cw - 12, 0.5), { colour: c }) + `<circle cx="${x + cw / 2}" cy="${y + ch / 2 + 2}" r="${Math.min(cw, ch) * 0.24}" fill="none" stroke="${c}" stroke-width="0.8" stroke-dasharray="2 1.5"/>`); });
    pages.push(pg.svg());
  }
  // Plane spotting bingo.
  {
    const pg = new Page(paper, 'Airport and plane bingo', { subtitle: 'Cross off each thing you spot on your journey. Can you get them all?' });
    const pics = [['🧳', 'Suitcase'], ['👩‍✈️', 'Pilot'], ['🛫', 'Plane taking off'], ['🚌', 'Airport bus'], ['🛂', 'Passport'], ['🥤', 'A drink'], ['☁️', 'Cloud'], ['🌅', 'Sunrise or sunset'], ['🗺️', 'Map screen'], ['🎧', 'Headphones'], ['🛗', 'Moving walkway'], ['🧸', 'A cuddly toy'], ['🏔️', 'Mountains below'], ['🌊', 'Sea below'], ['🍪', 'A snack'], ['😴', 'Someone sleeping']];
    const n = 4, s = Math.min(pg.width, pg.room - 4) / n, x0 = pg.w / 2 - (s * n) / 2;
    pics.forEach(([e, t], i) => { const x = x0 + (i % n) * s, y = pg.y + Math.floor(i / n) * s; pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${s - 3}" height="${s - 3}" rx="8" fill="${TINTS[i % TINTS.length]}" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="0.9"/>` + emoji(e, x + s / 2, y + s * 0.42, s * 0.4) + txt(x + s / 2, y + s - 7, t, fitFont(t, 4.6, s - 8, 0.5), { font: FONT, colour: INK })); });
    pages.push(pg.svg());
  }
  // Window view and flight log.
  {
    const pg = new Page(paper, 'Out of my window', { subtitle: 'What can you see out of the plane window? Draw it inside the window!' });
    const cx = pg.w / 2, h = pg.room * 0.58, w = h * 0.7, y = pg.y + 4;
    pg.add(`<rect x="${cx - w / 2 - 10}" y="${y - 4}" width="${w + 20}" height="${h + 8}" rx="${w * 0.42}" fill="#e6ecf5" stroke="#1f1b2e" stroke-width="1"/><rect x="${cx - w / 2}" y="${y + 4}" width="${w}" height="${h - 8}" rx="${w * 0.4}" fill="#fff" stroke="#1f1b2e" stroke-width="0.8"/>`);
    pg.y += h + 14;
    pg.add(txt(pg.left, pg.y, 'My flight log', 7, { anchor: 'start', colour: ring }));
    pg.y += 6;
    const rows = [['🕐', 'We took off at'], ['🛬', 'We landed at'], ['⏳', 'The flight took'], ['🍽️', 'On the plane I ate'], ['🎬', 'I watched or played'], ['⭐', 'The best part was']], rh = (pg.room - 2) / rows.length;
    rows.forEach(([e, l], i) => pg.add(emoji(e, pg.left + 5, pg.y + i * rh + rh / 2, 7) + txt(pg.left + 13, pg.y + i * rh + rh / 2 + 2, l, 5.6, { anchor: 'start', colour: PALETTE[i % PALETTE.length] }) + `<line x1="${pg.left + 16 + l.length * 2.8}" x2="${pg.right}" y1="${pg.y + i * rh + rh / 2 + 2.6}" y2="${pg.y + i * rh + rh / 2 + 2.6}" stroke="#d9d4ec" stroke-width="0.45"/>`));
    pages.push(pg.svg());
  }
  pages.push(checklistPage(paper, 'My hand luggage', 'Pack your own little bag for the plane. Colour the star for each thing you pack!', [['🎧', 'Headphones'], ['📚', 'A book or two'], ['🖍️', 'Crayons and this activity book'], ['🧸', 'My cuddly toy'], ['🍎', 'Snacks'], ['💧', 'An empty water bottle'], ['🧦', 'Cosy socks'], ['🧥', 'A jumper for the cold plane'], ['🍭', 'A sweet for take off (for popping ears!)']], name));
  pages.push(seasonColour(paper, 'plane', name));
  pages.push(...packRun('mazes', { level: 'easy' }, paper, +o.seed || 1).sheets);
  pages.push(seriesCert(paper, 'FLIGHT COMPLETE', 'Brave Flyer Award', name, dest ? `for flying all the way to ${dest} like a superstar!` : 'for flying like a superstar!', 'Next: tell someone all about your trip!', ring));
  return pages;
}

// ================================================================ My Feelings Book (Plus)
const FEELINGS_BOOK = [
  ['Happy', '😄', '#ffb938', ['Share it with someone', 'Dance!', 'Draw a happy picture']],
  ['Sad', '😢', '#3a8fd8', ['A big hug', 'Talk to someone I love', 'Cuddle my toy']],
  ['Angry', '😠', '#e0453b', ['Take 5 slow breaths', 'Squeeze a cushion', 'Walk away and come back']],
  ['Scared', '😨', '#8a3fd1', ['Hold a grown-up\'s hand', 'Turn on a light', 'Say "I am brave"']],
  ['Worried', '😟', '#6c8cff', ['Tell someone my worry', 'Write it in the worry jar', 'Think of a happy place']],
  ['Excited', '🤩', '#ff7eb6', ['Jump up and down', 'Tell everyone!', 'Count down the days']],
  ['Calm', '😌', '#3fbfa8', ['Notice how my body feels', 'Read a quiet book', 'Listen to soft music']],
  ['Proud', '🥳', '#e08a00', ['Tell someone what I did', 'Give myself a high five', 'Put it on the fridge!']],
  ['Silly', '🤪', '#b06cff', ['Tell a joke', 'Make funny faces', 'Have a giggle']],
  ['Loved', '🥰', '#e0457b', ['Say "I love you" back', 'Give a hug', 'Draw a heart for someone']],
];

function makeFeelingsBook(o, paper) {
  const name = nameOf(o.name, '') || '';
  const pages = [];
  pages.push(seriesCover(paper, 'ALL MY FEELINGS ARE OK', name ? `${possessive(name)} feelings book` : 'My feelings book', 'Every feeling is welcome here', FEELINGS_BOOK.slice(0, 8).map((f) => f[1]), '#e0457b', '#fff0f5', 'book', ['Ten feelings', 'My body clues', 'Things that help me', 'Draw my faces', 'Weekly check-in', 'Feelings Explorer award']));
  FEELINGS_BOOK.forEach(([f, e, c, helps]) => {
    const pg = new Page(paper, `When I feel ${f.toLowerCase()}`, { subtitle: `It is OK to feel ${f.toLowerCase()}. All feelings come and go, like clouds in the sky.` });
    pg.add(panel(pg.left, pg.y, pg.width * 0.34, 60, '#fff', c, 12) + emoji(e, pg.left + pg.width * 0.17, pg.y + 26, 36) + txt(pg.left + pg.width * 0.17, pg.y + 54, f, 8, { colour: c }));
    const bx = pg.left + pg.width * 0.34 + 6, bw = pg.width * 0.66 - 6;
    pg.add(panel(bx, pg.y, bw, 60, TINTS[FEELINGS_BOOK.findIndex((x) => x[0] === f) % TINTS.length], c, 12) + txt(bx + 8, pg.y + 12, `I feel ${f.toLowerCase()} when...`, 6.4, { anchor: 'start', colour: c }));
    for (let l = 1; l <= 3; l++) pg.add(`<line x1="${bx + 8}" x2="${bx + bw - 8}" y1="${pg.y + 12 + l * 13}" y2="${pg.y + 12 + l * 13}" stroke="#c9c3e3" stroke-width="0.45"/>`);
    pg.y += 68;
    pg.add(txt(pg.left, pg.y + 6, 'In my body it feels like...', 6.4, { anchor: 'start', colour: c }));
    const body = ['Warm', 'Wobbly', 'Tight', 'Fizzy', 'Heavy', 'Light'];
    body.forEach((b, i) => { const x = pg.left + (i % 6) * (pg.width / 6); pg.add(`<rect x="${x + 2}" y="${pg.y + 11}" width="${pg.width / 6 - 4}" height="14" rx="7" fill="#fff" stroke="${c}" stroke-width="0.6"/>` + txt(x + pg.width / 12, pg.y + 20.4, b, 5, { font: FONT, colour: INK })); });
    pg.y += 34;
    pg.add(txt(pg.left, pg.y + 6, 'Things that help me', 6.4, { anchor: 'start', colour: c }));
    helps.concat(['My own idea: ____________']).forEach((h, i) => pg.add(`<rect x="${pg.left + 2}" y="${pg.y + 12 + i * 12}" width="7" height="7" rx="1.6" fill="#fff" stroke="${c}" stroke-width="0.7"/>` + txt(pg.left + 14, pg.y + 18 + i * 12, h, 5.6, { anchor: 'start', font: FONT, weight: 700 })));
    pg.y += 64;
    if (pg.room > 30) pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${pg.room - 4}" rx="10" fill="#fff" stroke="${c}" stroke-width="0.6" stroke-dasharray="3 2"/>` + txt(pg.left + 6, pg.y + 9, `Draw your ${f.toLowerCase()} face`, 5, { anchor: 'start', font: FONT, colour: SOFT }));
    pages.push(pg.svg());
  });
  // Weekly check-in.
  {
    const pg = new Page(paper, 'My feelings this week', { subtitle: 'Each evening, circle how you felt today. Talk about it with someone you love.' });
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], rh = pg.room / 7, fw = (pg.width - 40) / 8;
    days.forEach((d, i) => { const y = pg.y + i * rh; pg.add(panel(pg.left, y + 1.5, pg.width, rh - 3, TINTS[i % TINTS.length], PALETTE[i % PALETTE.length], 7) + txt(pg.left + 6, y + rh / 2 + 2, d.slice(0, 3), 6, { anchor: 'start', colour: PALETTE[i % PALETTE.length] })); FEELINGS_BOOK.slice(0, 8).forEach(([, e], k) => pg.add(emoji(e, pg.left + 36 + k * fw + fw / 2, y + rh / 2, Math.min(11, rh * 0.5)))); });
    pages.push(pg.svg());
  }
  pages.push(seriesCert(paper, 'ALL MY FEELINGS ARE OK', 'Feelings Explorer', name, 'for being brave enough to talk about feelings!', 'Keep checking in with your feelings every day.', '#e0457b'));
  return pages;
}

Object.assign(MAKERS, { handwritingbook: makeHandwritingBook, superhero: makeSuperhero, flying: makeFlying, feelingsbook: makeFeelingsBook });
