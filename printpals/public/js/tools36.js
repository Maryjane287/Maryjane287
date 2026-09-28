// PrintPals batch 36: Class Halloween Party Kit, Class Book Week Kit (teachers), Pocket Money Month, My Pet Diary (Plus).

const SPOOKY = { ring: '#ff8a3d', tint: '#fff6ec', accent: '#8a3fd1' };

// ================================================================ Class Halloween Party Kit (teachers)
function makeClassHalloween(o, paper) {
  const kids = classNames(o), { cls, teacher } = teacherBits(o), lk = SPOOKY;
  const pages = [seriesCover(paper, 'PRINTPALS PLUS FOR TEACHERS', cls ? `${cls} Halloween Party` : 'Class Halloween Party', 'Friendly, not frightening!', ['🎃', '👻', '🦇', '🍬', '🌙', '🕸️'], lk.ring, lk.tint, 'party kit', ['Pumpkin name tags', 'Party letter home', 'Halloween class bingo', 'Named treat bag toppers', 'Costume parade awards', `${kids.length} children, all named`])];
  // Pumpkin name tags.
  for (let s = 0; s < kids.length; s += 8) pages.push(tagsPage(paper, s ? 'Pumpkin name tags (more)' : 'Pumpkin name tags', 'Colour, cut out and stick on jumpers for the party!', 8, 2, (pg, x, y, w, h, i) => { const n = kids[s + i]; if (!n) return; const cx = x + w / 2, cy = y + h / 2 + 3, rx = w * 0.4, ry = h * 0.36; pg.add(`<path d="M${cx} ${cy - ry} q3 -8 8 -9" fill="none" stroke="#2e9d62" stroke-width="1.6"/><ellipse cx="${cx - rx * 0.45}" cy="${cy}" rx="${rx * 0.55}" ry="${ry}" fill="#fff6ec" stroke="${lk.ring}" stroke-width="1"/><ellipse cx="${cx + rx * 0.45}" cy="${cy}" rx="${rx * 0.55}" ry="${ry}" fill="#fff6ec" stroke="${lk.ring}" stroke-width="1"/><ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.6}" ry="${ry}" fill="#fff" stroke="${lk.ring}" stroke-width="1.2"/>` + txt(cx, cy + 3.4, n, fitFont(n, 11, rx * 1.3, 0.58), { colour: INK })); }));
  // Party letter.
  {
    const pg = new Page(paper, "We're having a Halloween party!", { subtitle: 'Send one home with every child.', noName: true });
    const lines = ['Dear families,', '', `${cls || 'Our class'} is having a friendly Halloween party!`, '', 'Date: ____________________', '', 'Children are welcome to come in a costume. Home-made costumes are wonderful, and nothing needs to be bought. Please keep it friendly, not frightening.', '', 'We will play games, have a costume parade and share a treat. Please tell us about any allergies below.', '', 'Allergies or notes: ____________________________', '', teacher ? `Thank you! ${teacher}` : 'Thank you!'];
    pg.add(panel(pg.left, pg.y, pg.width, pg.room - 4, lk.tint, lk.ring, 12));
    let y = pg.y + 16; lines.forEach((l) => { if (!l) { y += 5; return; } wrap(l, 50).forEach((ll) => { pg.add(txt(pg.left + 12, y, ll, 7, { anchor: 'start', colour: INK })); y += 9; }); });
    pg.add(emoji('🎃', pg.right - 24, pg.bottom - 24, 22));
    pages.push(pg.svg());
  }
  // Bingo: 4 different cards.
  const bingo = [['🎃', 'Pumpkin'], ['👻', 'Ghost'], ['🦇', 'Bat'], ['🕷️', 'Spider'], ['🧙', 'Witch hat'], ['🍬', 'Sweet'], ['🌙', 'Moon'], ['⭐', 'Star'], ['🐈‍⬛', 'Black cat'], ['🦉', 'Owl'], ['🕸️', 'Web'], ['🍭', 'Lolly'], ['🧹', 'Broom'], ['🍎', 'Apple'], ['🏰', 'Castle'], ['🔮', 'Magic ball'], ['🍂', 'Leaf'], ['🕯️', 'Candle'], ['🎭', 'Mask'], ['🧛', 'Vampire']];
  const rand = rng(+o.seed || 1);
  for (let b = 1; b <= 4; b++) pages.push(picGridPage(paper, `Halloween bingo: card ${b}`, 'The teacher calls out a picture. Cover it with a sweet or a counter. Get four in a row and shout BOO!', shuffle(bingo, rand).slice(0, 16)));
  // Treat bag toppers.
  for (let s = 0; s < kids.length; s += 6) pages.push(tagsPage(paper, 'Treat bag toppers', 'Fold along the middle and staple over a little paper bag.', 6, 2, (pg, x, y, w, h, i) => { const n = kids[s + i]; if (!n) return; pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="8" fill="#fff" stroke="${i % 2 ? lk.accent : lk.ring}" stroke-width="1"/><line x1="${x + 6}" x2="${x + w - 6}" y1="${y + h / 2}" y2="${y + h / 2}" stroke="#b9b3d6" stroke-width="0.5" stroke-dasharray="3 2"/>` + emoji(['🎃', '👻', '🦇', '🍬', '🌙', '🐈‍⬛'][i], x + 20, y + h * 0.75, h * 0.24) + txt(x + w / 2 + 10, y + h * 0.7, 'Happy Halloween', 6.4, { colour: i % 2 ? lk.accent : lk.ring }) + txt(x + w / 2 + 10, y + h * 0.86, n, fitFont(n, 10, w - 50, 0.58), { colour: INK })); }));
  pages.push(seasonColour(paper, 'pumpkin', ''));
  kids.forEach((n, i) => pages.push(awardPage(paper, ['🎭', ['Most Creative Costume', 'Spookiest Smile', 'Best Home-made Costume', 'Friendliest Monster', 'Most Magical Costume', 'Super Party Star'][i % 6], 'for joining in our Halloween party with a big smile!'], n, cls, teacher, i % 2 ? lk.accent : lk.ring, lk.tint)));
  return pages;
}

// ================================================================ Class Book Week Kit (teachers)
function makeBookWeek(o, paper) {
  const kids = classNames(o), lk = edLook(o.look), { cls, teacher } = teacherBits(o);
  const pages = [seriesCover(paper, 'PRINTPALS PLUS FOR TEACHERS', cls ? `${cls} Book Week` : 'Class Book Week', 'Celebrate stories together', ['📚', '🦸', '🧙', lk.corner, '🐉', '⭐'], lk.ring, lk.tint, 'book week kit', ['My favourite book page', 'A named bookmark each', 'Class reading challenge', 'Book quiz', 'Costume day awards', 'Letter home'])];
  {
    const pg = new Page(paper, "It's Book Week!", { subtitle: 'Send one home with every child.', noName: true });
    const lines = ['Dear families,', '', `${cls || 'Our class'} is celebrating Book Week! On costume day, children can dress as a favourite book character.`, '', 'Costume day: ____________________', '', 'Costumes can be very simple: a hat, a scarf or a drawing pinned to a jumper is perfect. Nothing needs to be bought.', '', 'Please help your child bring in their favourite book to share with the class.', '', teacher ? `Happy reading! ${teacher}` : 'Happy reading!'];
    pg.add(panel(pg.left, pg.y, pg.width, pg.room - 4, lk.tint, lk.ring, 12));
    let y = pg.y + 16; lines.forEach((l) => { if (!l) { y += 5; return; } wrap(l, 50).forEach((ll) => { pg.add(txt(pg.left + 12, y, ll, 7, { anchor: 'start', colour: INK })); y += 9; }); });
    pages.push(pg.svg());
  }
  kids.forEach((n, i) => pages.push(drawAndTellPage(paper, `${possessive(n)} favourite book`, 'Draw the cover of your favourite book, then tell us all about it!', ['The book is called', 'It was written by', 'My favourite character is', 'I love it because'], PALETTE[i % PALETTE.length], 0.55)));
  for (let s = 0; s < kids.length; s += 4) pages.push(tagsPage(paper, 'Named bookmarks', 'Colour, cut out and fold along the middle to make them strong.', 4, 4, (pg, x, y, w, h, i) => { const n = kids[s + i]; if (!n) return; const c = PALETTE[(s + i) % PALETTE.length]; pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="6" fill="${TINTS[(s + i) % TINTS.length]}" stroke="${c}" stroke-width="1"/>` + emoji(T_EMOJI[(s + i) % T_EMOJI.length], x + w / 2, y + 24, 20) + txt(x + w / 2, y + 50, 'Book', 8, { colour: c }) + txt(x + w / 2, y + 59, 'Week', 8, { colour: c }) + emoji('📚', x + w / 2, y + h * 0.6, 18) + txt(x + w / 2, y + h - 18, 'This book', 4.4, { font: FONT, colour: SOFT }) + txt(x + w / 2, y + h - 13, 'belongs to', 4.4, { font: FONT, colour: SOFT }) + txt(x + w / 2, y + h - 6, n, fitFont(n, 6, w - 12, 0.55), { colour: INK })); }));
  pages.push(...classGrid(paper, `${cls || 'Class'} reading challenge`, 'Colour a box for every story each child reads or hears this week. Can the class reach 100 stories?', kids, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Total'], lk));
  pages.push(checklistPage(paper, 'Class book quiz', 'Read the clues aloud. Can the class guess the story? Tick each one you get!', [['🐻', 'Three bears, three bowls of porridge and one hungry girl'], ['🐷', 'Three little pigs and a wolf who huffs and puffs'], ['🐛', 'A very hungry creature who eats and eats, then turns into a butterfly'], ['👠', 'A glass slipper and a pumpkin that turns into a coach'], ['🌱', 'A boy trades a cow for magic beans'], ['🦆', 'A little bird who feels different, then grows into a swan'], ['🐺', 'A girl in a red hood visits her grandma'], ['🍪', 'Run, run, as fast as you can!']], ''));
  kids.forEach((n, i) => pages.push(awardPage(paper, ['📚', 'Book Week Star', 'for dressing up, sharing stories and loving books!'], n, cls, teacher, PALETTE[i % PALETTE.length], TINTS[i % TINTS.length])));
  return pages;
}

// ================================================================ Pocket Money Month (Plus)
function makePocketMoney(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const nm = name || 'Mia';
  const lk = edLook(o.look), cur = CURRENCIES[o.currency] || CURRENCIES.GBP;
  const goal = String(o.goal || '').trim().slice(0, 30) || 'something special';
  const small = cur.whole ? [5, 10, 20] : [5, 10, 20, 50];
  const jobs = [['🛏️', 'Make my bed'], ['🧸', 'Tidy my toys'], ['🍽️', 'Set the table'], ['🌱', 'Water the plants'], ['🧺', 'Sort the washing'], ['🐶', 'Feed the pet'], ['🧽', 'Wipe the table'], ['🗑️', 'Help with recycling']].map(([e, t]) => [e, t, small[Math.floor(rand() * small.length)]]);
  const pages = [seriesCover(paper, 'PRINTPALS PLUS', `${possessive(nm)} Pocket Money Month`, `Saving up for ${goal}`, ['💰', '🐷', '🪙', lk.corner, '🎯', '⭐'], lk.ring, lk.tint, 'money book', ['Jobs that earn', 'Weekly money chart', 'Spend, save, share', 'Savings goal tracker', 'Money sums', 'Money Wizard award'])];
  // Jobs chart for 4 weeks.
  for (let w = 1; w <= 4; w++) {
    const pg = new Page(paper, `${possessive(nm)} jobs: week ${w}`, { subtitle: 'Tick each job when it is done. Add up what you earned on Sunday!', noName: true });
    const lw = 70, cw = (pg.width - lw - 24) / 7, hh = 11, rh = Math.min(22, (pg.room - hh - 40) / jobs.length);
    WEEKDAYS.forEach((d, k) => pg.add(`<rect x="${pg.left + lw + k * cw}" y="${pg.y}" width="${cw}" height="${hh}" fill="${lk.tint}" stroke="#d9d4ec" stroke-width="0.4"/>` + txt(pg.left + lw + k * cw + cw / 2, pg.y + 7.6, d.slice(0, 3), 5.2, { colour: lk.ring })));
    pg.add(`<rect x="${pg.right - 24}" y="${pg.y}" width="24" height="${hh}" fill="${lk.tint}" stroke="#d9d4ec" stroke-width="0.4"/>` + txt(pg.right - 12, pg.y + 7.6, 'Pay', 5.2, { colour: lk.ring }));
    jobs.forEach(([e, t, p], j) => { const y = pg.y + hh + j * rh; pg.add(`<rect x="${pg.left}" y="${y}" width="${lw}" height="${rh}" fill="${TINTS[j % TINTS.length]}" stroke="#d9d4ec" stroke-width="0.4"/>` + emoji(e, pg.left + 8, y + rh / 2, rh * 0.5) + txt(pg.left + 16, y + rh / 2 + 2, t, fitFont(t, 5.6, lw - 18, 0.55), { anchor: 'start', colour: INK })); for (let k = 0; k < 7; k++) pg.add(`<rect x="${pg.left + lw + k * cw}" y="${y}" width="${cw}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.4"/><rect x="${pg.left + lw + k * cw + cw / 2 - 3.5}" y="${y + rh / 2 - 3.5}" width="7" height="7" rx="1.5" fill="#fff" stroke="${PALETTE[j % PALETTE.length]}" stroke-width="0.6"/>`); pg.add(`<rect x="${pg.right - 24}" y="${y}" width="24" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.4"/>` + txt(pg.right - 12, y + rh / 2 + 2, cur.fmt(p), 5.4, { colour: PALETTE[j % PALETTE.length] })); });
    pg.y += hh + jobs.length * rh + 8;
    pg.add(panel(pg.left, pg.y, pg.width, 24, lk.tint, lk.ring, 10) + txt(pg.left + 10, pg.y + 15, 'This week I earned:', 7, { anchor: 'start', colour: lk.ring }) + `<rect x="${pg.left + 70}" y="${pg.y + 6}" width="34" height="12" rx="3" fill="#fff" stroke="${lk.ring}" stroke-width="0.8"/>` + txt(pg.left + 112, pg.y + 15, 'Pay per tick, as shown', 5.6, { anchor: 'start', font: FONT, colour: SOFT }));
    pages.push(pg.svg());
  }
  // Spend, save, share jars.
  {
    const pg = new Page(paper, 'Spend, save and share', { subtitle: 'Split your money into three jars. Colour a coin in the jar each time you add money!' });
    const jw = pg.width / 3;
    [['🛍️', 'Spend', 'Little treats now'], ['🐷', 'Save', `For ${goal}`], ['💛', 'Share', 'To help others']].forEach(([e, t, d], k) => { const x = pg.left + k * jw, c = PALETTE[k], h = pg.room - 48, y = pg.y + 30; pg.add(txt(x + jw / 2, pg.y + 12, t, 12, { colour: c }) + txt(x + jw / 2, pg.y + 22, d, fitFont(d, 5.6, jw - 10, 0.5), { font: FONT, colour: INK }) + `<path d="M${x + 12} ${y + 14} Q${x + 8} ${y + h} ${x + 18} ${y + h} H${x + jw - 18} Q${x + jw - 8} ${y + h} ${x + jw - 12} ${y + 14} Z" fill="${TINTS[k]}" stroke="${c}" stroke-width="1.2"/><rect x="${x + 14}" y="${y}" width="${jw - 28}" height="14" rx="4" fill="#fff" stroke="${c}" stroke-width="1"/>` + emoji(e, x + jw / 2, y + 7, 9)); for (let r = 0; r < 10; r++) for (let q = 0; q < 3; q++) pg.add(`<circle cx="${x + jw / 2 + (q - 1) * 14}" cy="${y + h - 12 - r * ((h - 30) / 10)}" r="5" fill="#fff" stroke="${c}" stroke-width="0.6"/>`); });
    pages.push(pg.svg());
  }
  // Goal tracker thermometer.
  {
    const pg = new Page(paper, `Saving for ${goal}`, { subtitle: 'Colour up the thermometer as your savings grow. You are nearly there!' });
    const cx = pg.left + 50, top = pg.y + 10, h = pg.room - 60;
    pg.add(`<rect x="${cx - 12}" y="${top}" width="24" height="${h}" rx="12" fill="#fff" stroke="${lk.ring}" stroke-width="1.4"/><circle cx="${cx}" cy="${top + h + 14}" r="20" fill="#fff" stroke="${lk.ring}" stroke-width="1.4"/>`);
    for (let k = 0; k <= 10; k++) { const y = top + h - (k / 10) * h; pg.add(`<line x1="${cx + 14}" x2="${cx + 22}" y1="${y}" y2="${y}" stroke="${lk.ring}" stroke-width="0.6"/>` + txt(cx + 26, y + 2, `${k * 10}%`, 5.4, { anchor: 'start', font: FONT, colour: SOFT })); }
    const bx = pg.left + 110, bw = pg.width - 110;
    pg.add(panel(bx, pg.y + 10, bw, 70, lk.tint, lk.ring, 12) + txt(bx + 10, pg.y + 24, 'My goal:', 7, { anchor: 'start', colour: lk.ring }) + txt(bx + 10, pg.y + 38, goal, fitFont(goal, 10, bw - 20, 0.56), { anchor: 'start', colour: INK }) + txt(bx + 10, pg.y + 56, 'It costs: ________', 7, { anchor: 'start', colour: INK }) + txt(bx + 10, pg.y + 68, 'I still need: ______', 7, { anchor: 'start', colour: INK }));
    pg.add(`<rect x="${bx}" y="${pg.y + 90}" width="${bw}" height="${h - 90}" rx="12" fill="#fff" stroke="${lk.ring}" stroke-width="0.8" stroke-dasharray="3 2"/>` + txt(bx + bw / 2, pg.y + 104, 'Draw it here!', 6.4, { font: FONT, colour: SOFT }));
    pages.push(pg.svg());
  }
  pages.push(...packRun('money', { currency: o.currency || 'GBP', level: 'easy' }, paper, +o.seed || 1).sheets);
  pages.push(checklistPage(paper, 'Money wise', 'Talk about these with a grown-up. Colour a star when you understand!', [['🪙', 'I can name all the coins'], ['🐷', 'Saving means waiting for something bigger'], ['🤔', 'Needs come before wants'], ['🏷️', 'I check the price before I choose'], ['💛', 'Sharing money can help others'], ['🧾', 'I keep track of what I spend']], nm));
  pages.push(seriesCert(paper, 'POCKET MONEY MONTH', 'Money Wizard', name, `for working hard, saving well and planning for ${goal}!`, 'Next: open your own shop with the Little Shop kit!', lk.ring));
  return pages;
}

// ================================================================ My Pet Diary (Plus)
function makePetDiary(o, paper) {
  const name = nameOf(o.name, '') || '';
  const pet = String(o.pet || '').trim().replace(/[<>]/g, '').slice(0, 18) || 'my pet';
  const kind = String(o.kind || 'dog');
  const e = { dog: '🐶', cat: '🐱', rabbit: '🐰', hamster: '🐹', fish: '🐟', bird: '🦜', other: '🐾' }[kind] || '🐾';
  const lk = edLook(o.look), Pet = pet.charAt(0).toUpperCase() + pet.slice(1);
  const pages = [seriesCover(paper, 'MY PET DIARY', `${Pet} and ${name || 'me'}`, 'Best friends forever', [e, '💛', '🦴', lk.corner, '🏠', '⭐'], lk.ring, lk.tint, 'pet diary', ['Pet profile', 'Feeding chart', 'Walk and play log', 'Vet visits', 'A day in the life', 'Best Pet Carer award'])];
  {
    const pg = new Page(paper, `All about ${Pet}`, { subtitle: 'Stick a photo or draw your pet, then fill in the profile!' });
    const fh = pg.room * 0.42;
    pg.add(`<rect x="${pg.left + pg.width * 0.2}" y="${pg.y}" width="${pg.width * 0.6}" height="${fh}" rx="14" fill="${lk.tint}" stroke="${lk.ring}" stroke-width="2"/><rect x="${pg.left + pg.width * 0.2 + 6}" y="${pg.y + 6}" width="${pg.width * 0.6 - 12}" height="${fh - 12}" rx="10" fill="#fff" stroke="${lk.ring}" stroke-width="0.5" stroke-dasharray="3 2"/>` + emoji(e, pg.left + pg.width * 0.12, pg.y + 16, 16));
    pg.y += fh + 8;
    const qs = [['🎂', 'Birthday or age'], ['🎨', 'Colour and markings'], ['🍖', 'Favourite food'], ['🎾', 'Favourite toy or game'], ['😴', 'Favourite sleeping spot'], ['😂', 'Funniest habit']], bh = pg.room / 3, bw = pg.width / 2;
    qs.forEach(([ee, t], k) => { const x = pg.left + (k % 2) * bw, y = pg.y + Math.floor(k / 2) * bh; pg.add(panel(x + 2, y + 2, bw - 4, bh - 4, '#fff', PALETTE[k], 9) + emoji(ee, x + 11, y + 11, 8) + txt(x + 20, y + 13, t, 6, { anchor: 'start', colour: PALETTE[k] }) + `<line x1="${x + 8}" x2="${x + bw - 8}" y1="${y + bh - 9}" y2="${y + bh - 9}" stroke="#d9d4ec" stroke-width="0.5"/>`); });
    pages.push(pg.svg());
  }
  for (let w = 1; w <= 2; w++) {
    const pg = new Page(paper, `${Pet}'s care chart: weeks ${w * 2 - 1} and ${w * 2}`, { subtitle: 'Tick every time you help. Pets need care every single day!', noName: true });
    const tasks = kind === 'fish' ? [['🍤', 'Feed'], ['👀', 'Check the water'], ['🧽', 'Clean the tank'], ['💛', 'Say hello']] : [['🥣', 'Breakfast'], ['🍽️', 'Dinner'], ['💧', 'Fresh water'], [kind === 'dog' ? '🦮' : '🎾', kind === 'dog' ? 'Walk' : 'Play time'], ['🪮', 'Brush or groom'], ['🤗', 'Cuddles']];
    for (let half = 0; half < 2; half++) {
      const top = pg.y + 4 + half * (pg.room / 2), lw = 58, cw = (pg.width - lw) / 7, hh = 10, rh = Math.min(16, (pg.room / 2 - hh - 12) / tasks.length);
      pg.add(txt(pg.left, top + 6, `Week ${w * 2 - 1 + half}`, 6.4, { anchor: 'start', colour: PALETTE[half] }));
      WEEKDAYS.forEach((d, k) => pg.add(`<rect x="${pg.left + lw + k * cw}" y="${top + 9}" width="${cw}" height="${hh}" fill="${lk.tint}" stroke="#d9d4ec" stroke-width="0.4"/>` + txt(pg.left + lw + k * cw + cw / 2, top + 16, d.slice(0, 3), 5, { colour: lk.ring })));
      tasks.forEach(([ee, t], j) => { const y = top + 9 + hh + j * rh; pg.add(`<rect x="${pg.left}" y="${y}" width="${lw}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.4"/>` + emoji(ee, pg.left + 7, y + rh / 2, rh * 0.55) + txt(pg.left + 14, y + rh / 2 + 2, t, 5.6, { anchor: 'start', colour: INK })); for (let k = 0; k < 7; k++) pg.add(`<rect x="${pg.left + lw + k * cw}" y="${y}" width="${cw}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.4"/>` + emoji('🐾', pg.left + lw + k * cw + cw / 2, y + rh / 2, rh * 0.36).replace('<text', '<text opacity="0.25"')); });
    }
    pages.push(pg.svg());
  }
  {
    const pg = new Page(paper, `${Pet}'s vet and health log`, { subtitle: 'Write down vet visits, injections and weigh-ins. Real pet owners keep records!', noName: true });
    const cols = [['Date', 0.18], ['What happened', 0.44], ['Weight', 0.14], ['Notes', 0.24]], rh = (pg.room - 12) / 12;
    let x = pg.left; cols.forEach(([t, f], k) => { pg.add(`<rect x="${x}" y="${pg.y}" width="${pg.width * f}" height="12" fill="${TINTS[k]}" stroke="#d9d4ec" stroke-width="0.4"/>` + txt(x + pg.width * f / 2, pg.y + 8, t, 5.6, { colour: PALETTE[k] })); x += pg.width * f; });
    for (let r = 0; r < 12; r++) { let xx = pg.left; cols.forEach(([t, f]) => { pg.add(`<rect x="${xx}" y="${pg.y + 12 + r * rh}" width="${pg.width * f}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.4"/>`); xx += pg.width * f; }); }
    pages.push(pg.svg());
  }
  pages.push(drawAndTellPage(paper, `A day in the life of ${Pet}`, `Draw ${pet} doing their favourite thing, then tell the story of their day!`, ['In the morning', 'In the afternoon', 'At night', `${Pet} loves`], lk.ring, 0.5));
  pages.push(drawAndTellPage(paper, `If ${Pet} could talk`, `What would ${pet} say? Draw a speech bubble and write it in!`, [`${Pet} would say`, `${Pet} thinks I am`, 'Our best adventure was'], lk.ring, 0.55));
  pages.push(checklistPage(paper, 'Good pet owner promise', 'Read each promise with a grown-up and colour a star when you keep it.', [['💧', 'Fresh water every day'], ['🥣', 'The right food, not too much'], ['🤲', 'Gentle hands, always'], ['🧼', 'Wash my hands after touching my pet'], ['🏠', 'A clean, cosy home'], ['🩺', 'Tell a grown-up if my pet seems poorly'], ['💛', 'Love and attention every day']], name));
  pages.push(seriesCert(paper, 'MY PET DIARY', 'Best Pet Carer', name, `for looking after ${pet} with love every single day!`, 'Next: play vets with the Pet Vet Clinic!', lk.ring));
  return pages;
}

Object.assign(MAKERS, { halloweenclass: makeClassHalloween, bookweek: makeBookWeek, pocketmoney: makePocketMoney, petdiary: makePetDiary });
