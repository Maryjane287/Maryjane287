// PrintPals batch 21 (Plus): Tooth Fairy kit, Big Sibling kit, Treasure Hunt maker, My Phonics Books series, Boredom Buster jar.

Object.assign(SEASON_ART, {
  tooth: { name: 'Happy tooth', draw: () => [
    `<path d="M60 40 Q60 20 84 22 Q100 26 116 22 Q140 20 140 40 Q146 80 132 110 Q126 150 118 176 Q110 186 106 170 Q102 140 100 134 Q98 140 94 170 Q90 186 82 176 Q74 150 68 110 Q54 80 60 40 Z" ${LW}/>`,
    `<circle cx="86" cy="66" r="6" ${INKF}/><circle cx="114" cy="66" r="6" ${INKF}/><circle cx="88" cy="63" r="2" fill="#fff"/><circle cx="116" cy="63" r="2" fill="#fff"/>`,
    `<path d="M88 84 Q100 96 112 84" ${LN}/><ellipse cx="74" cy="80" rx="7" ry="4" ${LT}/><ellipse cx="126" cy="80" rx="7" ry="4" ${LT}/>`,
    cStar(30, 40, 10), cStar(170, 50, 8), cStar(160, 150, 6), cStar(36, 140, 7), `<path d="M150 22 l4 8 l8 4 l-8 4 l-4 8 l-4 -8 l-8 -4 l8 -4 z" ${LW}/>`,
  ].join('') },
  chest: { name: 'Treasure chest', draw: () => [
    `<path d="M20 186 Q100 178 180 186" ${LN}/>`,
    `<path d="M36 96 Q36 52 100 52 Q164 52 164 96 Z" ${LW}/><path d="M60 58 V96 M140 58 V96" ${LN}/>`,
    `<rect x="36" y="96" width="128" height="80" rx="6" ${LW}/><path d="M60 96 V176 M140 96 V176" ${LN}/>`,
    `<rect x="88" y="88" width="24" height="30" rx="4" ${LW}/><circle cx="100" cy="100" r="4" ${INKF}/><path d="M100 104 V112" ${LN}/>`,
    cStar(100, 30, 10), cStar(58, 36, 6), cStar(144, 34, 7), `<circle cx="28" cy="170" r="8" ${LW}/><circle cx="176" cy="168" r="7" ${LW}/><circle cx="170" cy="182" r="6" ${LW}/>`,
  ].join('') },
});

// ================================================================ Tooth Fairy kit (Plus)
function makeToothFairy(o, paper) {
  const name = nameOf(o.name, '') || '';
  const who = name || 'my friend';
  const lk = { sparkle: { ring: '#b06cff', tint: '#f5edff', corners: ['✨', '🧚', '⭐', '🦷'] }, rainbow: { ring: '#ff7eb6', tint: '#fff0f5', corners: ['🌈', '🧚', '💖', '🦷'] }, starry: { ring: '#3a64d8', tint: '#eef2ff', corners: ['🌙', '⭐', '🧚', '🦷'] } }[o.look] || { ring: '#b06cff', tint: '#f5edff', corners: ['✨', '🧚', '⭐', '🦷'] };
  const pages = [];
  // A letter from the Tooth Fairy.
  {
    const pg = new Page(paper, '', { bare: true, tint: '#fffdf8' });
    pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="14" fill="#fff" stroke="${lk.ring}" stroke-width="1.4"/><rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${pg.bottom - pg.m - 3}" rx="11" fill="none" stroke="${lk.ring}" stroke-width="0.5" stroke-dasharray="1.5 1.8"/>`);
    lk.corners.forEach((e, i) => pg.add(emoji(e, i % 2 ? pg.right - 12 : pg.left + 12, i < 2 ? pg.m + 12 : pg.bottom - 13, 13)));
    pg.add(txt(pg.w / 2, pg.m + 18, 'Official post from Fairyland', 5, { font: FONT, colour: SOFT }).replace('<text ', '<text letter-spacing="1.5" '));
    bubbleText(pg, `Dear ${who},`, pg.w / 2, pg.m + 40, pg.width - 40, 18);
    const msg = `Last night I flew all the way to your window to collect your tooth. It was one of the shiniest, cleanest teeth I have ever seen! You must be brushing twice a day, just like a superstar. I will use your tooth to build a sparkly new tower in my castle. Keep smiling, keep brushing, and remember: you are growing up to be wonderful.`;
    textLines(pg, wrap(msg, 46), pg.left + 16, pg.m + 60, 7, { font: TITLE_FONT, weight: 700, lh: 1.6 });
    pg.add(`<g transform="translate(${pg.w / 2 - 36} ${pg.bottom - 118}) scale(0.36)">${seasonArt('tooth')}</g>`);
    pg.add(txt(pg.right - 18, pg.bottom - 34, 'With fairy sparkles,', 7, { anchor: 'end', colour: lk.ring }) + txt(pg.right - 18, pg.bottom - 20, 'The Tooth Fairy ✨', 11, { anchor: 'end', colour: lk.ring }));
    pg.footer = () => {};
    pages.push(pg.svg());
  }
  // Brave Tooth certificate.
  pages.push(seasonCert(paper, 'Brave Tooth Award', name, 'for losing a tooth like a true champion!', 'tooth', lk.ring));
  // Lost tooth tracker: 20 baby teeth.
  {
    const pg = new Page(paper, name ? `${possessive(name)} tooth tracker` : 'My tooth tracker', { subtitle: 'Children have 20 baby teeth. Colour each tooth when it falls out, then write the date below.', noName: !!name });
    const cx = pg.w / 2, top = pg.y + 8, arcW = pg.width * 0.4, arcH = 34;
    const tooth = (x, y, n, up) => `<g transform="translate(${x} ${y}) scale(${up ? 1 : 1} ${up ? 1 : -1})"><path d="M-5 -6 Q-5 -9 -2 -8.5 Q0 -8 2 -8.5 Q5 -9 5 -6 Q5.6 0 3.6 5 Q2.6 8 1.4 5 Q0 3 -1.4 5 Q-2.6 8 -3.6 5 Q-5.6 0 -5 -6 Z" fill="#fff" stroke="${lk.ring}" stroke-width="0.8"/></g>` + txt(x, up ? y - 11 : y + 15, n, 4.4, { font: FONT, colour: SOFT });
    for (let k = 0; k < 10; k++) {
      const u = -1 + (2 * k) / 9, x = cx + u * arcW;
      pg.add(tooth(x, top + 16 + arcH * u * u, k + 1, true));
      pg.add(tooth(x, top + 104 - arcH * u * u, k + 11, false));
    }
    pg.add(txt(cx, top + 40, 'Top teeth', 5, { colour: lk.ring }) + txt(cx, top + 86, 'Bottom teeth', 5, { colour: lk.ring }));
    pg.y = top + 138;
    const rh = Math.min(11, (pg.room - 4) / 11);
    [0, 1].forEach((half) => {
      const tx = pg.left + half * (pg.width / 2 + 2), tw = pg.width / 2 - 2;
      [['Tooth', 'Date', 'Fairy left']].concat([...Array(10)].map((_, i) => [`#${half * 10 + i + 1}`, '', ''])).forEach((row, r) => {
        const ws = [0.22, 0.39, 0.39]; let x = tx;
        row.forEach((cell, k) => { const w = tw * ws[k]; pg.add(`<rect x="${x}" y="${pg.y + r * rh}" width="${w}" height="${rh}" fill="${r ? '#fff' : lk.tint}" stroke="#d9d4ec" stroke-width="0.4"/>` + (cell ? txt(x + 3, pg.y + r * rh + rh * 0.68, cell, 4.2, { anchor: 'start', font: FONT, colour: r ? SOFT : lk.ring }) : '')); x += w; });
      });
    });
    pages.push(pg.svg());
  }
  // Tiny tooth envelopes and a note to leave for the fairy.
  pages.push(tagsPage(paper, 'Tooth envelopes and fairy notes', 'Cut out, fold on the dotted lines and glue. Pop the tooth inside and leave it under the pillow!', 4, 2, (pg, x, y, w, h, i) => {
    if (i < 2) {
      const cx = x + w / 2, ew = w * 0.62, eh = h * 0.42, ey = y + h * 0.3;
      pg.add(`<path d="M${cx - ew / 2} ${ey} L${cx} ${ey - eh * 0.55} L${cx + ew / 2} ${ey} Z" fill="${lk.tint}" stroke="#1f1b2e" stroke-width="0.6" stroke-dasharray="2 1.4"/><rect x="${cx - ew / 2}" y="${ey}" width="${ew}" height="${eh}" fill="#fff" stroke="#1f1b2e" stroke-width="0.7"/><path d="M${cx - ew / 2} ${ey + eh} L${cx - ew / 2 - 8} ${ey + eh - 6} L${cx - ew / 2 - 8} ${ey + 6} L${cx - ew / 2} ${ey} M${cx + ew / 2} ${ey + eh} L${cx + ew / 2 + 8} ${ey + eh - 6} L${cx + ew / 2 + 8} ${ey + 6} L${cx + ew / 2} ${ey}" fill="#f4f1fb" stroke="#1f1b2e" stroke-width="0.5" stroke-dasharray="2 1.4"/>`);
      pg.add(emoji('🦷', cx, ey + eh * 0.4, 12) + txt(cx, ey + eh * 0.82, name ? `${possessive(name)} tooth` : 'My tooth', 5, { colour: lk.ring }) + txt(cx, y + h - 8, 'Fold the side flaps in, then the top down', 3.8, { font: FONT, colour: SOFT }));
    } else {
      pg.add(emoji('🧚', x + w - 14, y + 14, 12) + txt(x + 8, y + 14, 'Dear Tooth Fairy,', 7, { anchor: 'start', colour: lk.ring }));
      for (let l = 0; l < 5; l++) pg.add(`<line x1="${x + 8}" x2="${x + w - 8}" y1="${y + 28 + l * 11}" y2="${y + 28 + l * 11}" stroke="#c9c3e3" stroke-width="0.45"/>`);
      pg.add(txt(x + w - 8, y + h - 10, name ? `Love from ${name}` : 'Love from', 6, { anchor: 'end', colour: lk.ring }));
    }
  }));
  // Colour the happy tooth.
  pages.push(seasonColour(paper, 'tooth', name));
  return pages;
}

// ================================================================ Big Sibling kit (Plus)
function makeBigSibling(o, paper) {
  const name = nameOf(o.name, '') || '';
  const role = o.role === 'brother' ? 'brother' : o.role === 'sibling' ? 'sibling' : 'sister';
  const baby = String(o.baby || '').trim().slice(0, 20);
  const lk = { soft: { ring: '#ff7eb6', tint: '#fff0f5', art: 'teddy', corners: ['🍼', '💖', '⭐', '🧸'] }, sky: { ring: '#3a8fd8', tint: '#eef6ff', art: 'teddy', corners: ['🍼', '💙', '⭐', '🧸'] }, sunny: { ring: '#e08a00', tint: '#fff6e0', art: 'rainbow', corners: ['🍼', '🌈', '⭐', '🐣'] } }[o.look] || { ring: '#ff7eb6', tint: '#fff0f5', art: 'teddy', corners: ['🍼', '💖', '⭐', '🧸'] };
  const bb = baby || 'the baby';
  const pages = [];
  pages.push(seasonCover(paper, name ? `${name} is a big ${role}!` : `I am a big ${role}!`, 'My big sibling book', lk.art, lk.tint, lk.ring, lk.corners, 'book'));
  pages.push(seasonCert(paper, `Big ${role[0].toUpperCase() + role.slice(1)} Award`, name, `for being the most loving big ${role} in the whole world!`, lk.art, lk.ring));
  // All about my new baby.
  {
    const pg = new Page(paper, baby ? `All about ${baby}` : 'All about my new baby', { subtitle: 'Fill this in together when the baby arrives. Stick in a photo or draw the baby!', noName: true });
    const fh = pg.room * 0.44;
    pg.add(`<rect x="${pg.left + 20}" y="${pg.y}" width="${pg.width - 40}" height="${fh}" rx="14" fill="#fff" stroke="${lk.ring}" stroke-width="1.2"/>` + emoji('📸', pg.w / 2, pg.y + fh / 2 - 4, 16) + txt(pg.w / 2, pg.y + fh / 2 + 14, 'Photo or drawing of the baby', 5, { font: FONT, colour: SOFT }));
    pg.y += fh + 8;
    const rows = [['👶', 'Name', baby], ['📅', 'Born on', ''], ['⚖️', 'Weight', ''], ['🕐', 'Time', ''], ['👀', 'Eye colour', ''], ['💬', 'The first thing I said to the baby', '']];
    const rh = pg.room / rows.length;
    rows.forEach(([e, l, v], i) => {
      const y = pg.y + i * rh, c = PALETTE[i % PALETTE.length];
      pg.add(emoji(e, pg.left + 6, y + rh / 2, 8) + txt(pg.left + 14, y + rh / 2 + 2, l, 5.8, { anchor: 'start', colour: c }) + `<line x1="${pg.left + 18 + l.length * 2.9}" x2="${pg.right}" y1="${y + rh / 2 + 2.6}" y2="${y + rh / 2 + 2.6}" stroke="#d9d4ec" stroke-width="0.45"/>`);
      if (v) pg.add(txt(pg.left + 22 + l.length * 2.9, y + rh / 2 + 1.6, v, 6.4, { anchor: 'start', colour: lk.ring }));
    });
    pages.push(pg.svg());
  }
  // Big sibling helper chart.
  pages.push(checklistPage(paper, `Big ${role} helper`, `Colour a star each time you help. ${bb[0].toUpperCase() + bb.slice(1)} is lucky to have you!`, [
    ['🧷', 'Fetch a nappy'], ['🎵', `Sing a song to ${bb}`], ['📚', `Read ${bb} a story`], ['🧸', 'Share a soft toy'], ['🤫', 'Be quiet while the baby sleeps'], ['🤗', 'Give gentle hugs'], ['🧦', 'Find the tiny socks'], ['😄', `Make ${bb} smile`]], name));
  // Things I can teach the baby.
  {
    const pg = new Page(paper, `Things I will teach ${bb}`, { subtitle: `Big ${role}s know so much! Draw or write something you will teach the baby in each box.`, noName: true });
    const cw = pg.width / 2, ch = pg.room / 3, ideas = ['How to clap', 'My favourite song', 'How to build a tower', 'Funny faces', 'The names of animals', 'My own idea'];
    ideas.forEach((t, i) => { const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * ch; pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, '#fff', PALETTE[i % PALETTE.length], 9) + txt(x + 9, y + 12, t, 5.8, { anchor: 'start', colour: PALETTE[i % PALETTE.length] })); });
    pages.push(pg.svg());
  }
  // A card for the baby.
  {
    const pg = new Page(paper, '', { bare: true });
    const mid = pg.h / 2;
    pg.add(`<line x1="0" x2="${pg.w}" y1="${mid}" y2="${mid}" stroke="#b9b3d6" stroke-width="0.5" stroke-dasharray="3 2"/>`);
    pg.add(`<g transform="rotate(180 ${pg.w / 2} ${mid / 2})">${txt(pg.w / 2, 40, baby ? `Dear ${baby},` : 'Dear baby,', 10, { colour: lk.ring })}${[...Array(5)].map((_, l) => `<line x1="${pg.left + 16}" x2="${pg.right - 16}" y1="${58 + l * 13}" y2="${58 + l * 13}" stroke="#d9d4ec" stroke-width="0.45"/>`).join('')}${txt(pg.w / 2, mid - 20, name ? `Love from your big ${role}, ${name}` : `Love from your big ${role}`, 7, { colour: lk.ring })}</g>`);
    bubbleText(pg, 'Welcome to the world!', pg.w / 2, mid + 30, pg.width - 40, 18);
    pg.add(`<g transform="translate(${pg.w / 2 - 50} ${mid + 40}) scale(0.5)">${seasonArt(lk.art)}</g>`);
    pg.add(txt(pg.w / 2, pg.h - 16, 'Fold along the dotted line to make a card', 4.4, { font: FONT, colour: SOFT }));
    pg.footer = () => {};
    pages.push(pg.svg());
  }
  // My family now.
  {
    const pg = new Page(paper, 'My family now', { subtitle: 'Draw everyone in your family, with the new baby too!', noName: true });
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${pg.room - 4}" rx="14" fill="#fff" stroke="${lk.ring}" stroke-width="1" stroke-dasharray="3 2"/>`);
    lk.corners.forEach((e, i) => pg.add(emoji(e, i % 2 ? pg.right - 12 : pg.left + 12, i < 2 ? pg.y + 12 : pg.bottom - 12, 11)));
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ Treasure Hunt maker (Plus)
const HUNT_CLUES = {
  indoor: EGG_HUNT,
  garden: [
    ['Where the flowers like to grow,', 'look beneath them, down below!'], ['It sits outside and fills with rain.', 'Peek inside, then look again!'],
    ['Where the birds all stop to eat,', 'look nearby for your next treat!'], ['It has handles and a wheel that goes round,', 'look by the wheelbarrow on the ground!'],
    ['A tree stands tall, so strong and wide.', 'Walk around it, look behind!'], ['It opens and closes, it keeps things in,', 'look by the gate, and you will win!'],
    ['Where you sit when the sun is high,', 'look under the chair, and do not be shy!'], ['It is round and it bounces, you kick it too.', 'Find the ball for your next clue!'],
    ['Where the washing blows in the breeze,', 'look near the line, if you please!'], ['Buckets and spades, a trowel as well,', 'look in the shed, and ring the bell!'],
    ['Green and prickly, it grows in a pot,', 'look by the plant, but touch it not!'],
  ],
};

function makeTreasureHunt(o, paper) {
  const name = nameOf(o.name, '') || '';
  const place = o.place === 'garden' ? 'garden' : 'indoor';
  const lk = { pirate: { ring: '#c0662b', tint: '#fff6ec', art: 'chest', word: 'Ahoy, treasure hunter!', award: 'Master Treasure Hunter', corners: ['🏴‍☠️', '🦜', '⚓', '🗝️'] },
    birthday: { ring: '#e0457b', tint: '#fff0f5', art: 'presents', word: 'Happy birthday, hunter!', award: 'Birthday Treasure Hunter', corners: ['🎈', '🎁', '🎉', '🎂'] },
    fairy: { ring: '#8a3fd1', tint: '#f5edff', art: 'chest', word: 'Hello, little explorer!', award: 'Magical Treasure Finder', corners: ['🧚', '✨', '🌸', '🦄'] } }[o.look] || { ring: '#c0662b', tint: '#fff6ec', art: 'chest', word: 'Ahoy, treasure hunter!', award: 'Master Treasure Hunter', corners: ['🏴‍☠️', '🦜', '⚓', '🗝️'] };
  const clues = HUNT_CLUES[place];
  const pages = [];
  pages.push(seasonCover(paper, name ? `${possessive(name)} treasure hunt` : 'The great treasure hunt', place === 'garden' ? 'An adventure in the garden' : 'An adventure around the house', lk.art, lk.tint, lk.ring, lk.corners, 'treasure map'));
  // Grown-up guide.
  {
    const g = new Page(paper, 'How to set up the hunt', { subtitle: 'For grown-ups: ten minutes of hiding, an hour of excitement!', noName: true });
    ['Cut out the clue cards.', 'Give your child clue 1 (read it together if they are little).', 'Hide clue 2 where clue 1 says, clue 3 where clue 2 says...', 'Write the treasure\'s hiding place on the last card.', 'Skip any clue for a place you do not have.', 'Treasure can be tiny: a sticker, a note or a special snack.'].forEach((t, i) => {
      g.add(`<circle cx="${g.left + 10}" cy="${g.y + 10 + i * 16}" r="5" fill="${PALETTE[i]}"/>` + txt(g.left + 10, g.y + 12 + i * 16, i + 1, 5.4, { colour: '#fff' }) + txt(g.left + 20, g.y + 12.4 + i * 16, t, fitFont(t, 6.2, g.width - 24, 0.5), { anchor: 'start', font: FONT, weight: 700 }));
    });
    g.y += 104;
    const s = Math.min(g.width, g.room - 6);
    g.add(`<g transform="translate(${g.w / 2 - s / 2} ${g.y}) scale(${(s / 200).toFixed(4)})">${seasonArt(lk.art)}</g>`);
    pages.push(g.svg());
  }
  // Clue cards.
  for (let p = 0; p < 12; p += 6) {
    pages.push(tagsPage(paper, p ? 'Clue cards (more)' : 'Clue cards', 'Cut out each card along the dashed lines.', 6, 2, (pg, x, y, w, h, i) => {
      const k = p + i, c = PALETTE[k % PALETTE.length];
      pg.add(`<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="5" fill="${TINTS[k % TINTS.length]}"/>`);
      pg.add(`<circle cx="${x + 14}" cy="${y + 14}" r="7" fill="${c}"/>` + txt(x + 14, y + 16.6, k + 1, 7, { colour: '#fff' }) + txt(x + 25, y + 16, k ? `Clue ${k + 1}` : lk.word, fitFont(k ? `Clue ${k + 1}` : lk.word, 6.4, w - 50, 0.5), { anchor: 'start', colour: c }) + emoji(lk.corners[k % 4], x + w - 14, y + 14, 10));
      if (k < clues.length) { const per = Math.floor((w - 16) / 2.7); textLines(pg, [...wrap(clues[k][0], per), ...wrap(clues[k][1], per)], x + 8, y + 32, 5.2, { weight: 800, lh: 1.45 }); }
      else { pg.add(txt(x + 10, y + 34, 'Last clue! The treasure is...', 5.6, { anchor: 'start' })); for (let l = 0; l < 3; l++) pg.add(`<line x1="${x + 10}" x2="${x + w - 10}" y1="${y + 48 + l * 11}" y2="${y + 48 + l * 11}" stroke="#c9c3e3" stroke-width="0.45"/>`); }
    }));
  }
  // Draw your own treasure map.
  {
    const pg = new Page(paper, 'My treasure map', { subtitle: 'Draw your home or garden from above. Mark where you found each clue, and put a big X on the treasure!' });
    const h = pg.room - 6;
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${h}" rx="10" fill="${lk.tint}" stroke="${lk.ring}" stroke-width="1.2"/>`);
    for (let gx = 1; gx < 8; gx++) pg.add(`<line x1="${pg.left + gx * pg.width / 8}" x2="${pg.left + gx * pg.width / 8}" y1="${pg.y + 4}" y2="${pg.y + h - 4}" stroke="${lk.ring}" stroke-width="0.25" stroke-dasharray="1 2"/>`);
    for (let gy = 1; gy < 10; gy++) pg.add(`<line x1="${pg.left + 4}" x2="${pg.right - 4}" y1="${pg.y + gy * h / 10}" y2="${pg.y + gy * h / 10}" stroke="${lk.ring}" stroke-width="0.25" stroke-dasharray="1 2"/>`);
    const cx = pg.right - 24, cy = pg.y + 24;
    pg.add(`<circle cx="${cx}" cy="${cy}" r="15" fill="#fff" stroke="${lk.ring}" stroke-width="0.8"/><path d="M${cx} ${cy - 13} L${cx + 3} ${cy} L${cx} ${cy + 13} L${cx - 3} ${cy} Z" fill="${lk.ring}"/>` + ['N', 'E', 'S', 'W'].map((d, i) => txt(cx + [0, 19, 0, -19][i], cy + [-17, 1.6, 21, 1.6][i], d, 4.6, { colour: lk.ring })).join(''));
    pages.push(pg.svg());
  }
  pages.push(seasonCert(paper, lk.award, name, 'for solving every clue and finding the treasure!', lk.art, lk.ring));
  return pages;
}

// ================================================================ My Phonics Books (Plus)
const PHONICS_BOOKS = {
  1: { title: 'First sounds', ring: '#ff6b6b', tint: '#fff0f0', sounds: [['s', [['sun', '☀️'], ['sock', '🧦'], ['snake', '🐍']]], ['a', [['apple', '🍎'], ['ant', '🐜'], ['alligator', '🐊']]], ['t', [['tiger', '🐯'], ['tent', '⛺'], ['tap', '🚰']]], ['p', [['pig', '🐷'], ['pizza', '🍕'], ['pen', '🖊️']]], ['i', [['insect', '🐛'], ['igloo', '🧊'], ['ink', '🖋️']]], ['n', [['nest', '🪺'], ['nose', '👃'], ['net', '🥅']]]], words: ['sat', 'pin', 'tap', 'nap', 'tin', 'pit', 'sip', 'pan'] },
  2: { title: 'More sounds', ring: '#ffb938', tint: '#fff6e0', sounds: [['m', [['moon', '🌙'], ['mouse', '🐭'], ['milk', '🥛']]], ['d', [['dog', '🐶'], ['duck', '🦆'], ['drum', '🥁']]], ['g', [['goat', '🐐'], ['gift', '🎁'], ['grapes', '🍇']]], ['o', [['octopus', '🐙'], ['orange', '🍊'], ['otter', '🦦']]], ['c', [['cat', '🐱'], ['car', '🚗'], ['cake', '🎂']]], ['k', [['kite', '🪁'], ['key', '🔑'], ['king', '🤴']]]], words: ['dog', 'cat', 'mop', 'dig', 'kid', 'cot', 'pot', 'mad'] },
  3: { title: 'Sound explorer', ring: '#3fbfa8', tint: '#e8f8f4', sounds: [['e', [['egg', '🥚'], ['elephant', '🐘'], ['elf', '🧝']]], ['u', [['umbrella', '☂️'], ['up', '⬆️'], ['under', '👇']]], ['r', [['rabbit', '🐰'], ['rain', '🌧️'], ['rocket', '🚀']]], ['h', [['hat', '🎩'], ['horse', '🐴'], ['house', '🏠']]], ['b', [['ball', '⚽'], ['bear', '🐻'], ['bus', '🚌']]], ['f', [['fish', '🐟'], ['frog', '🐸'], ['fox', '🦊']]], ['l', [['lion', '🦁'], ['leaf', '🍃'], ['lemon', '🍋']]]], words: ['bed', 'run', 'hut', 'fun', 'leg', 'bus', 'red', 'hen'] },
  4: { title: 'Sound superstar', ring: '#8a3fd1', tint: '#f5edff', sounds: [['sh', [['ship', '🚢'], ['shell', '🐚'], ['sheep', '🐑']]], ['ch', [['chick', '🐤'], ['cheese', '🧀'], ['chair', '🪑']]], ['th', [['thumb', '👍'], ['three', '3️⃣'], ['think', '🤔']]], ['ng', [['ring', '💍'], ['king', '🤴'], ['swing', '🛝']]], ['ck', [['duck', '🦆'], ['sock', '🧦'], ['clock', '⏰']]], ['qu', [['queen', '👸'], ['question', '❓'], ['quack', '🦆']]]], words: ['shop', 'chip', 'thin', 'ring', 'duck', 'much', 'moth', 'song'] },
};

function makePhonicsBook(o, paper) {
  const name = nameOf(o.name, '') || '';
  const n = PHONICS_BOOKS[+o.book] ? +o.book : 1, bk = PHONICS_BOOKS[n];
  const pages = [];
  // Cover: the book's sounds in big bubbles.
  {
    const pg = new Page(paper, '', { bare: true, tint: bk.tint });
    pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="14" fill="#fff" stroke="${bk.ring}" stroke-width="1.6"/>`);
    pg.add(txt(pg.w / 2, pg.m + 22, `MY PHONICS BOOK ${n} OF 4`, 6, { font: FONT, colour: SOFT }).replace('<text ', '<text letter-spacing="2" '));
    bubbleText(pg, name ? `${possessive(name)} sounds` : 'My sounds', pg.w / 2, pg.m + 48, pg.width - 40, 24);
    pg.add(txt(pg.w / 2, pg.m + 64, bk.title, 9, { colour: bk.ring }));
    const cols = 3, rr = 22, sx = pg.width / cols;
    bk.sounds.forEach(([s], i) => { const x = pg.left + (i % cols) * sx + sx / 2, y = pg.m + 100 + Math.floor(i / cols) * 54; pg.add(`<circle cx="${x}" cy="${y}" r="${rr}" fill="${TINTS[i % TINTS.length]}" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="1.2"/>` + txt(x, y + 7, s, 22, { colour: PALETTE[i % PALETTE.length] })); });
    pg.add(txt(pg.left + 24, pg.bottom - 16, 'This book belongs to', 4.8, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 70}" x2="${pg.right - 24}" y1="${pg.bottom - 15.4}" y2="${pg.bottom - 15.4}" stroke="#b9b3d6" stroke-width="0.4"/>`);
    pg.footer = () => {};
    pages.push(pg.svg());
  }
  // A page for every sound.
  bk.sounds.forEach(([s, words], i) => {
    const c = PALETTE[i % PALETTE.length];
    const pg = new Page(paper, `The "${s}" sound`, { subtitle: `Say the sound "${s}". Say each picture word and listen for "${s}" at the start. Trace, then write!` });
    const bh = 70;
    pg.add(panel(pg.left, pg.y, pg.width * 0.4, bh, TINTS[i % TINTS.length], c, 12));
    const ls = bh - 20, lw = (textWidth(s) / 100) * ls;
    pg.add(drawText(s, pg.left + pg.width * 0.2 - lw / 2, pg.y + 8, ls, 'trace', true));
    const tw = (pg.width * 0.6 - 6) / 3;
    words.forEach(([w, e], k) => {
      const x = pg.left + pg.width * 0.4 + 6 + k * tw;
      pg.add(panel(x, pg.y, tw - 4, bh, '#fff', '#e2ddf2', 10) + emoji(e, x + (tw - 4) / 2, pg.y + bh * 0.4, bh * 0.4));
      pg.add(`<text x="${x + (tw - 4) / 2}" y="${pg.y + bh - 9}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(w, 7, tw - 10, 0.55)}"><tspan fill="${c}">${esc(w.slice(0, s.length))}</tspan><tspan fill="${INK}">${esc(w.slice(s.length))}</tspan></text>`);
    });
    pg.y += bh + 10;
    const size = Math.min(26, (pg.width - 8) / (textWidth(`${s}  ${s}  ${s}  ${s}  ${s}`) / 100 + 0.1));
    for (let r = 0; r < 3; r++) {
      pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${pg.y + size}" y2="${pg.y + size}" stroke="#c9c3e3" stroke-width="0.45"/>`);
      if (r < 2) pg.add(drawText(`${s}  ${s}  ${s}  ${s}  ${s}`, pg.left + 2, pg.y, size, 'trace', r === 0));
      pg.y += size * 1.6;
    }
    const word = words[0][0], ws = Math.min(24, (pg.width * 0.6) / (textWidth(word) / 100 + 0.1));
    pg.add(txt(pg.left, pg.y + 6, 'Trace the word:', 5.4, { anchor: 'start', colour: c }));
    pg.add(drawText(word, pg.left + 44, pg.y - 4, ws, 'trace', true));
    pg.y += ws * 1.5 + 4;
    if (pg.room > 30) pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${pg.room - 4}" rx="10" fill="#fff" stroke="${c}" stroke-width="0.6" stroke-dasharray="3 2"/>` + txt(pg.left + 6, pg.y + 9, `Draw something else that starts with "${s}"`, 5, { anchor: 'start', font: FONT, colour: SOFT }));
    pages.push(pg.svg());
  });
  // Read the words: sound buttons under each letter sound.
  {
    const pg = new Page(paper, 'I can read!', { subtitle: 'Press each sound button with your finger and say the sound, then blend them together to read the word. Tick each one you read!' });
    const cols = 2, rh = pg.room / 4, cw = pg.width / cols;
    bk.words.forEach((w, i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * rh, c = PALETTE[i % PALETTE.length];
      pg.add(panel(x + 2, y + 2, cw - 4, rh - 4, TINTS[i % TINTS.length], c, 10));
      const parts = w.match(/sh|ch|th|ng|ck|qu|./g), fs = 20, gap = fs * 0.72;
      const total = parts.reduce((a, p) => a + p.length * fs * 0.52 + 6, 0), sx = x + cw / 2 - total / 2;
      let px = sx;
      parts.forEach((p) => { const pw = p.length * fs * 0.52; pg.add(txt(px + pw / 2, y + rh * 0.52, p, fs, { colour: INK })); pg.add(p.length > 1 ? `<line x1="${px}" x2="${px + pw}" y1="${y + rh * 0.52 + 6}" y2="${y + rh * 0.52 + 6}" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>` : `<circle cx="${px + pw / 2}" cy="${y + rh * 0.52 + 7}" r="2" fill="${c}"/>`); px += pw + 6; });
      pg.add(`<rect x="${x + cw - 18}" y="${y + 8}" width="9" height="9" rx="2" fill="#fff" stroke="${c}" stroke-width="0.8"/>`);
    });
    pages.push(pg.svg());
  }
  // Completion certificate that points to the next book.
  {
    const pg = new Page(paper, '', { bare: true, tint: '#fffaf0' });
    const cx = pg.w / 2;
    pg.add(`<rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${pg.bottom - pg.m}" rx="10" fill="#fff" stroke="${bk.ring}" stroke-width="2"/>`);
    pg.add(txt(cx, pg.m + 24, `PHONICS BOOK ${n} COMPLETE`, 6, { font: FONT, colour: SOFT }).replace('<text ', '<text letter-spacing="2" '));
    bubbleText(pg, 'Sound Superstar!', cx, pg.m + 52, pg.width - 40, 22);
    pg.add(txt(cx, pg.m + 76, 'I know these sounds:', 7, { font: FONT, colour: SOFT }));
    pg.add(txt(cx, pg.m + 100, bk.sounds.map((x) => x[0]).join('  '), 20, { colour: bk.ring }));
    if (name) bubbleText(pg, name, cx, pg.m + 140, pg.width - 40, 26);
    else pg.add(`<line x1="${cx - 60}" x2="${cx + 60}" y1="${pg.m + 140}" y2="${pg.m + 140}" stroke="#b9b3d6" stroke-width="0.5"/>`);
    for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; pg.add(`<path d="${starPath(cx + Math.cos(a) * 52, pg.m + 176 + Math.sin(a) * 18, 3, 0.45)}" fill="${PALETTE[i % PALETTE.length]}"/>`); }
    if (n < 4) { const nx = PHONICS_BOOKS[n + 1]; pg.add(panel(pg.left + 24, pg.m + 204, pg.width - 48, 28, nx.tint, nx.ring, 9) + txt(cx, pg.m + 221, `Next: Book ${n + 1}, ${nx.title}: ${nx.sounds.map((x) => x[0]).join(' ')}`, 6.4, { colour: nx.ring })); }
    else pg.add(txt(cx, pg.m + 220, 'You finished all four phonics books. Amazing!', 7, { colour: bk.ring }));
    pg.footer = () => {};
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ Boredom Buster jar (Plus)
const BUSTERS = [
  ['Get moving', '#ff6b6b', '🏃', ['Dance to 5 songs in a row', 'Hop like a frog to the door and back', 'Build an obstacle course', 'Play musical statues', 'Do 10 star jumps', 'Walk like 5 different animals', 'Play hopscotch', 'Throw and catch 20 times', 'Have a balloon keepy-uppy game', 'Do a yoga pose for each colour', 'Race to touch something red', 'Make up a new dance']],
  ['Make something', '#ffb938', '✂️', ['Build a den with blankets', 'Make a paper aeroplane', 'Draw a comic about your day', 'Build the tallest tower', 'Make a puppet from a sock', 'Make yourself a crown', 'Design a new animal', 'Make a card for someone', 'Build a boat that floats', 'Make a paper chain', 'Draw your dream bedroom', 'Invent a board game']],
  ['Quiet time', '#6c8cff', '📚', ['Read a book in a cosy spot', 'Do a jigsaw puzzle', 'Look at clouds and find shapes', 'Listen to calm music and draw', 'Make up a story about a toy', 'Count all the circles in a room', 'Play I spy', 'Look through old photos', 'Sort your pencils by colour', 'Write a list of 10 happy things', 'Do a dot to dot', 'Do some colouring']],
  ['Be kind', '#3fbfa8', '💛', ['Draw a picture for a neighbour', 'Help lay the table', 'Tidy one shelf as a surprise', 'Call someone you love', 'Give three compliments', 'Water the plants', 'Get someone a glass of water', 'Write a thank you note', 'Share a toy with someone', 'Help sort the washing', 'Make someone laugh', 'Give a big hug']],
];

function makeBusters(o, paper) {
  const name = nameOf(o.name, '') || '';
  const pages = [];
  // Jar label.
  {
    const pg = new Page(paper, 'Jar label', { subtitle: 'Cut out the label and stick it on a big jar. Fold the activity sticks and drop them in!', noName: true });
    const w = pg.width - 20, h = 90, x = pg.left + 10, y = pg.y + 10;
    pg.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#fffaf0" stroke="#1f1b2e" stroke-width="0.8" stroke-dasharray="3 2"/>`);
    bubbleText(pg, name ? `${possessive(name)}` : 'My', pg.w / 2, y + 32, w - 40, 20);
    bubbleText(pg, 'Boredom Buster Jar', pg.w / 2, y + 56, w - 30, 20);
    BUSTERS.forEach(([t, c, e], i) => pg.add(`<circle cx="${x + 40 + i * (w - 80) / 3}" cy="${y + 76}" r="7" fill="${c}"/>` + emoji(e, x + 40 + i * (w - 80) / 3, y + 76, 8)));
    pg.y = y + h + 14;
    pg.add(txt(pg.left, pg.y + 6, 'How to play', 7, { anchor: 'start', colour: '#e0457b' }));
    ['When someone says "I\'m bored!", pull out one stick.', 'Do the activity on it. No swapping!', 'Colour-coded: red to move, yellow to make, blue for quiet, green to be kind.', 'Need to calm down? Only pick blue. Full of energy? Pick red!'].forEach((t, i) => pg.add(`<circle cx="${pg.left + 4}" cy="${pg.y + 17 + i * 11}" r="2.2" fill="${PALETTE[i]}"/>` + txt(pg.left + 10, pg.y + 18.6 + i * 11, t, fitFont(t, 5.6, pg.width - 12, 0.5), { anchor: 'start', font: FONT, weight: 700 })));
    pages.push(pg.svg());
  }
  BUSTERS.forEach(([t, c, e, ideas]) => {
    pages.push(tagsPage(paper, `${t} sticks`, 'Cut out each stick, fold in half on the dotted line and pop it in the jar.', 12, 2, (pg, x, y, w, h, i) => {
      pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" rx="4" fill="${c}22"/><line x1="${x + w / 2}" x2="${x + w / 2}" y1="${y + 3}" y2="${y + h - 3}" stroke="${c}" stroke-width="0.4" stroke-dasharray="1.5 1.2"/>`);
      pg.add(emoji(e, x + w * 0.25, y + h / 2, Math.min(14, h * 0.5)) + txt(x + w * 0.25, y + h - 5, t, 3.8, { font: FONT, colour: c }));
      const ln = wrap(ideas[i], 15); textLines(pg, ln, x + w * 0.52, y + h / 2 - (ln.length - 1) * 2.8 + 1.6, 4.5, { weight: 800, lh: 1.25 });
    }));
  });
  return pages;
}

Object.assign(MAKERS, { toothfairy: makeToothFairy, bigsibling: makeBigSibling, treasure: makeTreasureHunt, phonicsbook: makePhonicsBook, busters: makeBusters });
