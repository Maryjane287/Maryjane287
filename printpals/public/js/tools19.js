// PrintPals batch 19 (Plus stage 3): Easter and spring pack with an egg hunt, and the My Journal series (Volumes 1 to 4).

Object.assign(SEASON_ART, {
  eggs: { name: 'Eggs', draw: () => [
    `<path d="M10 188 Q100 176 190 188" ${LN}/>`,
    `<ellipse cx="60" cy="126" rx="36" ry="48" ${LW}/><path d="M26 112 Q60 100 94 112 M25 132 Q60 144 95 132" ${LN}/><path d="M34 122 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6" ${LT}/>`,
    `<ellipse cx="140" cy="118" rx="38" ry="52" ${LW}/><circle cx="128" cy="96" r="6" ${LW}/><circle cx="152" cy="110" r="6" ${LW}/><circle cx="130" cy="130" r="6" ${LW}/><circle cx="154" cy="148" r="6" ${LW}/><path d="M104 112 Q140 124 176 112" ${LN}/>`,
    `<ellipse cx="100" cy="160" rx="26" ry="30" ${LW}/><path d="M76 156 Q100 166 124 156" ${LN}/>`, cStar(100, 50, 9), cStar(30, 50, 6), cStar(172, 44, 7),
  ].join('') },
  basket: { name: 'Egg basket', draw: () => [
    `<path d="M40 100 Q100 10 160 100" fill="none" stroke="#1f1b2e" stroke-width="6" stroke-linecap="round"/><path d="M40 100 Q100 10 160 100" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,
    `<ellipse cx="72" cy="96" rx="16" ry="21" ${LW}/><ellipse cx="100" cy="90" rx="17" ry="23" ${LW}/><ellipse cx="128" cy="96" rx="16" ry="21" ${LW}/>`,
    `<path d="M88 84 Q100 90 112 84 M60 94 Q72 100 84 94" ${LT}/>`,
    `<path d="M30 100 H170 L156 178 Q100 188 44 178 Z" ${LW}/>`,
    `<path d="M36 124 Q100 134 164 124 M40 150 Q100 160 160 150" ${LN}/><path d="M60 104 V176 M100 106 V182 M140 104 V176" ${LT}/>`,
    `<path d="M20 190 q6 -14 12 0 q6 -14 12 0 M156 190 q6 -14 12 0 q6 -14 12 0" ${LN}/>`,
  ].join('') },
  chick: { name: 'Chick', draw: () => [
    `<path d="M10 186 Q100 174 190 186" ${LN}/>`,
    `<circle cx="100" cy="84" r="36" ${LW}/><path d="M92 50 Q96 36 104 44 Q108 34 112 48" ${LN}/>`,
    `<circle cx="88" cy="80" r="5" ${INKF}/><circle cx="112" cy="80" r="5" ${INKF}/><path d="M92 94 L108 94 L100 106 Z" ${LW}/><ellipse cx="76" cy="96" rx="7" ry="4" ${LT}/><ellipse cx="124" cy="96" rx="7" ry="4" ${LT}/>`,
    `<path d="M52 120 L62 106 L74 122 L86 106 L100 124 L114 106 L126 122 L138 106 L148 120 Q148 176 100 180 Q52 176 52 120 Z" ${LW}/>`,
    `<path d="M40 96 Q48 86 62 96 M160 96 Q152 86 138 96" ${LN}/>`, cStar(30, 40, 7), cStar(168, 40, 8),
  ].join('') },
});

// ================================================================ Easter and spring pack with an egg hunt (Plus)
const EGG_HUNT = [
  ['Where do you snuggle and rest your head?', 'Go and look under your cosy bed!'],
  ['It is cold inside and keeps food cool.', 'Open the door, that is the rule!'],
  ['Splish, splash, bubbles galore!', 'Look where you wash, and find some more!'],
  ['Before you go out, they go on your feet.', 'Look inside for a little treat!'],
  ['Stories live here, row by row.', 'Look behind the books, and off you go!'],
  ['Where the family sits to watch TV,', 'look under a cushion and you will see!'],
  ['It is green and it grows, it drinks water too.', 'Look near a plant for your next clue!'],
  ['Where your toys go at the end of the day,', 'look inside where the toys all stay!'],
  ['Where we eat our breakfast and our tea,', 'look under the table, what do you see?'],
  ['Wipe your feet before you come in.', 'Lift up the mat and look within!'],
  ['You brush your teeth here, morning and night.', 'Look by the sink, left or right!'],
];

function makeEaster(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '');
  const age = +o.age || 5;
  const lvl = age <= 4 ? 'easy' : age <= 6 ? 'medium' : 'hard';
  const easter = o.occasion !== 'spring', word = easter ? 'Easter' : 'Spring';
  const lk = { pastel: { ring: '#b06cff', tint: '#f5edff', art: 'eggs', corners: ['🐣', '🌷', '🥚', '🐰'], cols: ['#b06cff', '#ff7eb6', '#3fbfa8'] },
    meadow: { ring: '#2e9d62', tint: '#f1f8e6', art: 'basket', corners: ['🌼', '🐝', '🌷', '🦋'], cols: ['#2e9d62', '#ffb938', '#ff7eb6'] },
    sunny: { ring: '#e08a00', tint: '#fff6e0', art: 'chick', corners: ['🐥', '☀️', '🌻', '🥚'], cols: ['#e08a00', '#ff7eb6', '#6c8cff'] } }[o.look] || { ring: '#b06cff', tint: '#f5edff', art: 'eggs', corners: ['🐣', '🌷', '🥚', '🐰'], cols: ['#b06cff', '#ff7eb6', '#3fbfa8'] };
  const pages = [];
  pages.push(seasonCover(paper, name ? `${possessive(name)} ${word} fun pack` : `My ${word} fun pack`, easter ? 'Hop into spring!' : 'Everything is growing!', lk.art, lk.tint, lk.ring, lk.corners, 'pack'));
  if (o.hunt !== false) {
    // Grown-up guide, then clue cards.
    const g = new Page(paper, `${word} egg hunt`, { subtitle: 'A treasure hunt around your home, with rhyming clues. For grown-ups: read this first!', noName: true });
    g.add(panel(g.left, g.y, g.width, 80, '#fff6e0', '#ffb938', 10) + emoji('🧺', g.right - 16, g.y + 16, 18));
    ['Cut out the clue cards.', 'Give your child clue 1 to read (or read it together).', 'Hide clue 2 where clue 1 says, clue 3 where clue 2 says...', 'Write the treasure\'s hiding place on the last card.', 'Leave out any clue for a place you do not have.'].forEach((t, i) => {
      g.add(`<circle cx="${g.left + 10}" cy="${g.y + 14 + i * 13}" r="4" fill="${lk.cols[i % 3]}"/>` + txt(g.left + 10, g.y + 15.6 + i * 13, i + 1, 4.6, { colour: '#fff' }) + txt(g.left + 18, g.y + 16 + i * 13, t, fitFont(t, 5.4, g.width - 50, 0.5), { anchor: 'start', font: FONT, weight: 700 }));
    });
    g.y += 88;
    const s = Math.min(g.width, g.room - 10);
    g.add(`<g transform="translate(${g.w / 2 - s / 2} ${g.y}) scale(${(s / 200).toFixed(4)})">${seasonArt('basket')}</g>`);
    pages.push(g.svg());
    const clues = EGG_HUNT.slice();
    for (let p = 0; p < 12; p += 6) {
      pages.push(tagsPage(paper, p ? 'Egg hunt clues (more)' : 'Egg hunt clues', 'Cut out each card along the dashed lines.', 6, 2, (pg, x, y, w, h, i) => {
        const k = p + i, c = lk.cols[k % 3];
        pg.add(`<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="5" fill="${TINTS[k % TINTS.length]}"/>`);
        pg.add(`<circle cx="${x + 14}" cy="${y + 14}" r="7" fill="${c}"/>` + txt(x + 14, y + 16.6, k + 1, 7, { colour: '#fff' }) + txt(x + 25, y + 16, `Clue ${k + 1}`, 6.4, { anchor: 'start', colour: c }) + emoji('🥚', x + w - 14, y + 14, 10));
        if (k < clues.length) { const per = Math.floor((w - 16) / 2.7); textLines(pg, [...wrap(clues[k][0], per), ...wrap(clues[k][1], per)], x + 8, y + 32, 5.2, { weight: 800, lh: 1.45 }); }
        else {
          pg.add(txt(x + 10, y + 34, 'Last clue! Your treasure is...', 5.6, { anchor: 'start' }));
          for (let l = 0; l < 3; l++) pg.add(`<line x1="${x + 10}" x2="${x + w - 10}" y1="${y + 48 + l * 11}" y2="${y + 48 + l * 11}" stroke="#c9c3e3" stroke-width="0.45"/>`);
        }
      }));
    }
  }
  // Decorate your own eggs.
  {
    const pg = new Page(paper, 'Decorate the eggs', { subtitle: 'Give each egg its own pattern: stripes, spots, zigzags, flowers or hearts!' });
    const cw = pg.width / 3, ch = pg.room / 2, labels = ['Stripes', 'Spots', 'Zigzags', 'Flowers', 'Hearts', 'My own idea'];
    labels.forEach((l, i) => {
      const cx = pg.left + (i % 3) * cw + cw / 2, cy = pg.y + Math.floor(i / 3) * ch + ch / 2 - 6, rx = cw * 0.36, ry = ch * 0.38;
      pg.add(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" stroke="#1f1b2e" stroke-width="1.1"/>` + txt(cx, cy + ry + 9, l, 5.4, { colour: lk.cols[i % 3] }));
    });
    pages.push(pg.svg());
  }
  ['eggs', 'chick', 'basket'].forEach((k) => pages.push(seasonColour(paper, k, name)));
  pages.push(seasonColour(paper, 'bunny', name));
  pages.push(countRowsPage(paper, `Count the ${word.toLowerCase()} things`, ['🥚', '🐣', '🌷', '🐰', '🦋', '🐝'], rand));
  pages.push(traceWordsPage(paper, `Trace the ${word.toLowerCase()} words`, easter ? [['egg', '🥚'], ['bunny', '🐰'], ['chick', '🐣'], ['spring', '🌷']] : [['seed', '🌱'], ['grow', '🌷'], ['bee', '🐝'], ['nest', '🪺']]));
  pages.push(...packRun('wordsearch', { title: `${word} word search`, words: age <= 4 ? 'EGG, HEN, BEE, SUN, NEST, LAMB' : 'BUNNY, CHICK, BASKET, FLOWERS, SPRING, BUTTERFLY, LAMB, NEST, EGGS, TULIP', size: age <= 4 ? '8' : age <= 6 ? '10' : '12', level: lvl }, paper, +o.seed || 1).sheets);
  pages.push(...packRun('mazes', { level: lvl }, paper, (+o.seed || 1) + 7).sheets);
  pages.push(...buntingPages(paper, easter ? 'Happy Easter' : 'Hello Spring', lk.cols));
  pages.push(seasonCert(paper, easter ? 'Egg Hunt Champion' : 'Spring Explorer', name, easter ? 'for finding every clue and every egg!' : 'for exploring, growing and learning this spring!', lk.art, lk.ring));
  return pages;
}

// ================================================================ My Journal series (Plus)
const JOURNALS = {
  1: { title: 'All about my world', ring: '#e0457b', tint: '#fff0f5', art: 'house', corners: ['🏠', '❤️', '⭐', '🌈'], prompts: ['This is my home', 'My favourite place in my home', 'The people I love', 'What I can see from my window', 'My favourite food', 'A day out I loved', 'My best toy, and why', 'Something that makes me laugh', 'The street where I live', 'A place I would love to visit'] },
  2: { title: 'Nature explorer', ring: '#2e9d62', tint: '#f1f8e6', art: 'sunflower', corners: ['🌿', '🐞', '🌻', '🦋'], prompts: ['A leaf I found outside', 'The sky today looks like...', 'A bug I spotted', 'My favourite animal and where it lives', 'A tree near my home', 'Sounds I can hear outside', 'Shapes I can see in the clouds', 'A flower I found (count its petals!)', 'If I were an animal, I would be...', 'How I can help look after nature'] },
  3: { title: 'Big dreams', ring: '#6c3fd1', tint: '#f5edff', art: 'rocket', corners: ['🚀', '⭐', '🌙', '✨'], prompts: ['When I grow up, I want to be...', 'My dream house', 'If I could fly, I would go to...', 'An invention that would help everyone', 'My very own superhero', 'A place I want to explore', 'If I had a magic wand...', 'A book I want to write (draw the cover!)', 'Something I really want to learn', 'My dream day, from morning to night'] },
  4: { title: 'Kind and brave', ring: '#e08a00', tint: '#fff6e0', art: 'rainbow', corners: ['🌈', '💛', '🦁', '🤗'], prompts: ['Someone who is kind to me', 'A time I was brave', 'Things that help me feel calm', 'How I can cheer up a friend', 'Something I am proud of', 'A kind thing I did today', 'When I feel worried, I can...', 'What makes a good friend?', 'Three things I love about myself', 'A thank you note to someone special'] },
};

function makeJournal(o, paper) {
  const name = nameOf(o.name, '');
  const vol = JOURNALS[+o.volume] ? +o.volume : 1, j = JOURNALS[vol];
  const pages = [];
  // Cover with a volume badge.
  let cover = seasonCover(paper, name ? `${possessive(name)} Journal` : 'My Journal', `Volume ${vol}: ${j.title}`, j.art, j.tint, j.ring, j.corners, 'journal');
  pages.push(cover);
  j.prompts.forEach((p, i) => {
    const c = PALETTE[(i + vol) % PALETTE.length];
    const pg = new Page(paper, `${i + 1}. ${p}`, { subtitle: `My Journal, Volume ${vol}: ${j.title}. Draw it, then write about it.` });
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${pg.room * 0.6}" rx="12" fill="#fff" stroke="${j.ring}" stroke-width="0.8" stroke-dasharray="3 2"/>`);
    pg.add(emoji(j.corners[i % 4], pg.right - 10, pg.y + 10, 10));
    pg.y += pg.room * 0.6 + 6;
    const n = Math.floor((pg.room - 18) / 11);
    for (let l = 0; l < n; l++) pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${pg.y + 8 + l * 11}" y2="${pg.y + 8 + l * 11}" stroke="#d9d4ec" stroke-width="0.45"/>`);
    const fy = pg.y + 8 + n * 11 + 4;
    pg.add(txt(pg.left, fy, 'Today I feel', 5.2, { anchor: 'start', colour: c }));
    ['😄', '😌', '🤩', '😴', '😢', '😠'].forEach((e, k) => pg.add(`<circle cx="${pg.left + 40 + k * 13}" cy="${fy - 1.6}" r="5" fill="#fff" stroke="#e2ddf2" stroke-width="0.5"/>` + emoji(e, pg.left + 40 + k * 13, fy - 1.6, 6.6)));
    pg.add(`<path d="${starPath(pg.right - 8, fy - 2, 5.5, 0.45)}" fill="#fff" stroke="${c}" stroke-width="0.8"/>` + txt(pg.right - 16, fy, 'Done!', 4.4, { anchor: 'end', font: FONT, colour: SOFT }));
    pages.push(pg.svg());
  });
  // Completion page that points to the next volume.
  const next = JOURNALS[vol % 4 + 1];
  const pg = new Page(paper, '', { bare: true, tint: j.tint });
  pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="12" fill="#fff" stroke="${j.ring}" stroke-width="1.4"/>`);
  bubbleText(pg, 'Journal complete!', pg.w / 2, pg.m + 34, pg.width - 30, 22);
  pg.add(`<g transform="translate(${pg.w / 2 - 50} ${pg.m + 46}) scale(0.5)">${colouringArt(j.art)}</g>`);
  pg.add(txt(pg.w / 2, pg.m + 164, name ? `Well done, ${name}!` : 'Well done!', 11, { colour: j.ring }));
  pg.add(txt(pg.w / 2, pg.m + 178, `You filled every page of Volume ${vol}: ${j.title}.`, 6, { font: FONT, colour: INK }));
  pg.add(panel(pg.left + 16, pg.m + 192, pg.width - 32, 40, next.tint, next.ring, 10) + emoji(next.corners[0], pg.left + 32, pg.m + 212, 16));
  pg.add(txt(pg.left + 46, pg.m + 206, 'Next adventure', 5, { anchor: 'start', font: FONT, colour: SOFT }) + txt(pg.left + 46, pg.m + 219, `Volume ${vol % 4 + 1}: ${next.title}`, 8, { anchor: 'start', colour: next.ring }));
  pg.add(txt(pg.w / 2, pg.bottom - 14, 'Collect all four journals at printpals.web.app', 5, { font: FONT, colour: SOFT }));
  pg.footer = () => {};
  pages.push(pg.svg());
  return pages;
}

Object.assign(MAKERS, { easter: makeEaster, journal: makeJournal });
