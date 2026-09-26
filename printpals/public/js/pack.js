// PrintPals packs: a personalised learning week, quick packs for busy moments,
// and a pack that keeps children close to family far away. Built from the other makers.

const PACK_THEMES = {
  animals: { label: 'Animals', line: ['elephant', 'giraffe', 'cat', 'owl', 'bunny', 'penguin', 'dog', 'frog'], draw: ['cat', 'owl', 'dog', 'bunny', 'frog', 'penguin'], words: ['LION', 'ZEBRA', 'TIGER', 'MONKEY', 'PANDA', 'HIPPO', 'CAMEL', 'SNAKE'] },
  space: { label: 'Space', line: ['rocket', 'robot', 'plane', 'rocket', 'robot'], draw: ['rocket', 'robot'], words: ['MOON', 'STAR', 'ROCKET', 'PLANET', 'COMET', 'SUN', 'ALIEN', 'ORBIT'] },
  sea: { label: 'Under the sea', line: ['whale', 'fish', 'octopus', 'turtle', 'boat'], draw: ['fish', 'penguin', 'frog'], words: ['FISH', 'CRAB', 'WHALE', 'SHELL', 'WAVE', 'BOAT', 'SHARK', 'SAND'] },
  go: { label: 'Things that go', line: ['train', 'car', 'plane', 'boat', 'rocket'], draw: ['rocket', 'robot'], words: ['CAR', 'BUS', 'TRAIN', 'PLANE', 'BOAT', 'BIKE', 'TRUCK', 'ROCKET'] },
  magic: { label: 'Magic and unicorns', line: ['unicorn', 'castle', 'butterfly', 'rainbow', 'icecream'], draw: ['unicorn', 'ladybird', 'bunny'], words: ['MAGIC', 'WAND', 'FAIRY', 'CASTLE', 'CROWN', 'STAR', 'WISH', 'DRAGON'] },
  garden: { label: 'Bugs and gardens', line: ['ladybird', 'bee', 'snail', 'butterfly', 'sunflower'], draw: ['ladybird', 'frog', 'owl'], words: ['BEE', 'ANT', 'SNAIL', 'WORM', 'LEAF', 'FLOWER', 'SEED', 'SLUG'] },
};
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const RAINBOW_COLOURS = ['red', 'blue', 'yellow', 'green', 'orange', 'purple', 'pink'];

/** The age group a child's age falls into. */
function ageGroup(age) {
  const a = +age || 4;
  return a <= 3 ? 3 : a >= 6 ? 6 : a;
}

// Each activity: (ctx) => [maker id, options, short title, tip for grown-ups]
const CURRICULUM = {
  3: {
    words: [
      (c) => ['prewriting', { guide: 'thick', type: ['straight', 'wave', 'bumps', 'zigzag', 'loops'][c.day % 5] }, 'Pencil paths', 'Go along the first path with your finger together before using a pencil. Wobbly lines are perfect: this builds the hand control for writing.'],
      (c) => c.name ? ['names', { names: c.name, case: 'title', size: 'large' }, `Writing ${c.name}`, 'Say each letter as they trace it. Their own name is the most exciting word in the world to them.'] : ['letters', { letter: 'ABCDE'[c.day % 5], size: 'large' }, `Letter ${'ABCDE'[c.day % 5]}`, 'Say the sound the letter makes, not just its name.'],
      (c) => ['letters', { letter: c.letter(c.day), size: 'large' }, `Letter ${c.letter(c.day)}`, 'Say the letter sound together, then hunt for 3 things at home that start with it.'],
      (c) => ['colourwords', { kind: 'learn', colour: RAINBOW_COLOURS[c.day % 7] }, `The colour ${RAINBOW_COLOURS[c.day % 7]}`, 'Find things around the room in this colour. Point and say the word together.'],
      (c) => ['matching', { kind: 'shadow', pairs: '4' }, 'Match the shadow', 'Ask "which shadow is the same shape?" before they draw the line. Looking closely is an early reading skill.'],
    ],
    numbers: [
      (c) => ['numbers', { from: String(1 + (c.day % 5)), to: String(1 + (c.day % 5)), size: 'large' }, `Number ${1 + (c.day % 5)}`, 'Count real things too: spoons, toys or claps. Touch each one as you count.'],
      (c) => ['patterns', { kind: 'pictures', level: 'easy' }, 'What comes next?', 'Say the pattern out loud together, like a song: "apple, banana, apple, banana..."'],
      (c) => ['compare', { kind: 'pictures' }, 'Which has more?', 'Let them count both sides. The crocodile always eats the bigger number!'],
      (c) => ['shapes', { kind: 'trace' }, 'Shapes', 'Look for circles, squares and triangles around the house after the page is done.'],
      (c) => ['matching', { kind: 'count', pairs: '4' }, 'Count and match', 'Touch each picture as you count. Saying the last number tells you how many.'],
    ],
    fun: [
      (c) => ['colouring', { book: 'one', picture: c.pic(c.day), name: c.name }, 'Colouring', 'Ask them to tell you a story about their picture while they colour.'],
      (c) => ['mazes', { level: 'easy', per: '1', theme: 'mix' }, 'Maze', 'Let them trace the way with a finger first, then with a crayon.'],
      (c) => ['dots', { dots: '10', count: '1', puzzles: '1', layout: 'one' }, 'Dot to dot', 'Say each number out loud as they join the dots.'],
      (c) => ['oddone', { level: 'easy' }, 'Odd one out', 'Ask "why is that one different?" and let them explain in their own words.'],
      (c) => ['hunt', { theme: 'home' }, 'Treasure hunt', 'A reason to get moving! Tick things off together as you find them.'],
    ],
  },
  4: {
    words: [
      (c) => c.name ? ['names', { names: c.name, case: 'title', size: 'medium' }, `Writing ${c.name}`, 'Start at the green dot each time. Praise the tries, not only the neat ones.'] : ['letters', { letter: c.letter(c.day), size: 'large' }, `Letter ${c.letter(c.day)}`, 'Say the sound, then find it in a book.'],
      (c) => ['letters', { letter: c.letter(c.day), size: 'medium' }, `Letter ${c.letter(c.day)}`, 'Say the letter sound and hunt for things that start with it.'],
      (c) => ['cvc', { vowel: 'aeiou'[c.day % 5], activity: 'sound' }, 'Sound it out', 'Touch each dot and say the sounds slowly, then say them fast to hear the word pop out.'],
      (c) => ['rhyming', { kind: 'match' }, 'Rhyme time', 'Rhyming words sound the same at the end. Make up silly ones together: cat, hat, splat!'],
      (c) => ['syllables', { kind: 'count' }, 'Clap the beats', 'Clap each word together. Stamping or jumping the beats works too.'],
      (c) => ['abcorder', { kind: 'missing', case: 'lower' }, 'Missing letters', 'Sing the alphabet song slowly to find each missing letter.'],
    ],
    numbers: [
      (c) => ['numbers', { from: String(5 + (c.day % 6)), to: String(5 + (c.day % 6)), size: 'medium' }, `Number ${5 + (c.day % 6)}`, 'Count out that many real things: pasta, buttons or toy cars.'],
      (c) => ['patterns', { kind: 'pictures', level: 'medium' }, 'What comes next?', 'Say the pattern like a chant. The answer usually jumps out.'],
      (c) => ['bonds', { to: '5', missing: 'part', pictures: true }, 'Number bonds to 5', 'Use 5 real objects in two hands: "3 here, so how many there?"'],
      (c) => ['doubles', { kind: 'ladybird', max: '5' }, 'Ladybird doubles', 'Doubles are the same on both sides, like our two hands.'],
      (c) => ['dominoes', { kind: 'add' }, 'Domino sums', 'Count one side, then keep counting on from that number.'],
    ],
    fun: [
      (c) => ['colouring', { book: 'one', picture: c.pic(c.day), name: c.name }, 'Colouring', 'Colouring inside shapes builds strong fingers for writing.'],
      (c) => ['howtodraw', { picture: c.draw(c.day) }, 'How to draw', 'Do it side by side: you draw one too. Children love a grown-up who has a go.'],
      (c) => ['spotdiff', { level: 'easy' }, 'Spot the difference', 'Look at one part of the picture at a time, top to bottom.'],
      (c) => ['dots', { dots: '20', count: '1', puzzles: '1', layout: 'one' }, 'Dot to dot', 'Say each number as they join it. Guess the picture before it is finished!'],
      (c) => ['oddone', { level: 'medium' }, 'Odd one out', 'The best part is "why". Let them explain their thinking.'],
      (c) => ['rolldraw', { theme: 'monster', name: c.name }, 'Roll and draw', 'Play too! Roll the same and compare your silly monsters.'],
    ],
  },
  5: {
    words: [
      (c) => ['sight', { list: 'dolch-primer', count: '8', order: 'mix', size: 'big' }, 'Sight words', 'These words appear in every book. Spot them together at bedtime story time.'],
      (c) => ['cvc', { vowel: 'mix', activity: ['build', 'middle', 'first'][c.day % 3] }, 'Build the word', 'Say the word slowly and stretch it like chewing gum: c-a-t.'],
      (c) => ['families', { family: ['at', 'an', 'ig', 'op', 'ug', 'en'][c.day % 6] }, 'Word families', 'Change the first letter and read the new word. It feels like magic!'],
      (c) => ['sentences', { kind: 'fix' }, 'Fix the sentence', 'Every sentence starts with a capital letter and ends with a full stop.'],
      (c) => ['syllables', { kind: 'split' }, 'Break it into beats', 'Clap the word first, then write one beat in each box.'],
      (c) => ['position', { kind: 'circle' }, 'Where is it?', 'Play it for real afterwards: hide a teddy under, on and behind things.'],
    ],
    numbers: [
      (c) => ['maths', { op: 'add', within: '10', count: '10', layout: 'horizontal', pictures: true }, 'Adding to 10', 'Use fingers or small toys. Counting on from the bigger number is quicker.'],
      (c) => ['bonds', { to: '10', missing: 'part', pictures: true }, 'Number bonds to 10', 'Pairs that make 10 are a maths superpower. Try them with 10 fingers.'],
      (c) => ['clocks', { level: 'oclock', mode: 'read', style: 'words' }, 'O\'clock', 'Look at a real clock together at each o\'clock today.'],
      (c) => ['hundred', { kind: 'missing', level: 'easy' }, 'Hundred square', 'Numbers going down go up by 10 each time. Can they spot it?'],
      (c) => ['doubles', { kind: 'facts', max: '5' }, 'Doubles and halves', 'Halving is sharing fairly between two. Use snacks to check!'],
      (c) => ['numberlines', { kind: 'missing', range: '20' }, 'Number lines', 'Hop along the line with a finger, saying each number.'],
    ],
    fun: [
      (c) => ['wordsearch', { size: '8', level: 'easy', words: c.words.join('\n'), title: `${c.themeLabel} word search` }, 'Word search', 'Find the first letter of each word, then look around it.'],
      (c) => ['secretcode', { code: 'pictures' }, 'Secret code', 'Write them a secret coded note back afterwards. They will love it.'],
      (c) => ['sudoku', { size: '4', symbols: 'pictures', level: 'easy', pages: '1' }, 'Picture sudoku', 'Each row and column has every picture once. Start with the row missing just one.'],
      (c) => ['colournum', { mode: 'add' }, 'Colour by sums', 'Work out each sum first, then colour. A picture appears!'],
      (c) => ['howtodraw', { picture: c.draw(c.day) }, 'How to draw', 'Draw side by side. Talk about the shapes you use: circle, oval, triangle.'],
      (c) => ['gridcopy', { kind: 'half' }, 'Finish the half', 'Count the squares across from the middle line to find each one.'],
    ],
  },
  6: {
    words: [
      (c) => ['sight', { list: 'dolch-first', count: '12', order: 'mix', size: 'medium' }, 'Sight words', 'Read the words, then use each one in a silly sentence out loud.'],
      (c) => ['sentences', { kind: 'unscramble' }, 'Mixed up sentences', 'Find the word with the capital letter first: that one starts the sentence.'],
      (c) => ['storywriting', { layout: 'story', lines: 'big', prompt: ['dragon', 'seed', 'moon', 'cat', 'sea', 'puppy'][c.day % 6], name: c.name }, 'Story writing', 'Let them tell the story out loud first, then write. Spelling can wait: ideas come first.'],
      (c) => ['story', { text: 'small', answers: 'write', story: ['balloon', 'kitten', 'picnic', 'rocket', 'turtle', 'beach'][c.day % 6], name: c.name }, 'Read and answer', 'Take turns reading a line each. Point to the words as you read.'],
      (c) => ['sounds', { set: 'blends' }, 'Blends', 'Two letters, two sounds squished together: s-t, st!'],
      (c) => ['spelling', { words: c.words.slice(0, 6).join('\n').toLowerCase(), size: 'medium', title: `${c.themeLabel} words` }, 'Spelling', 'Look, say, cover, write, check. Then use the word in a sentence.'],
    ],
    numbers: [
      (c) => ['maths', { op: 'mix', within: '20', count: '20', layout: 'horizontal', pictures: false }, 'Adding and taking away', 'For take away, start at the big number and count back.'],
      (c) => ['wordproblems', { op: 'add', within: '20', count: '6', theme: 'mix', pictures: true, names: c.name }, 'Story sums', 'Read the story, then draw it. A quick picture makes the answer easy to see.'],
      (c) => ['times', { mode: 'practice', count: '20', t1: false, t2: true, t3: false, t4: false, t5: true, t6: false, t7: false, t8: false, t9: false, t10: true, t11: false, t12: false, missing: false, certificate: false, name: c.name }, 'Times tables', 'Count in 2s, 5s and 10s out loud while jumping or clapping.'],
      (c) => ['clocks', { level: 'half', mode: 'mix', style: 'words' }, 'Half past', 'Half past means the big hand points down to the 6.'],
      (c) => ['placevalue', { kind: 'count', range: 'to50' }, 'Tens and ones', 'Bundle real straws or pasta into tens to see it for real.'],
      (c) => ['fractions', { kind: 'colour', level: 'halves' }, 'Fractions', 'Cut a real sandwich or pizza into halves and quarters at lunch.'],
    ],
    fun: [
      (c) => ['wordsearch', { size: '10', level: 'medium', words: c.words.join('\n'), title: `${c.themeLabel} word search` }, 'Word search', 'Words can go across and down. Look for unusual letters first.'],
      (c) => ['secretcode', { code: 'numbers' }, 'Number code', 'A is 1, B is 2... Crack the message, then write one back.'],
      (c) => ['sudoku', { size: '4', symbols: 'numbers', level: 'medium', pages: '1' }, 'Sudoku', 'Every row, column and box needs 1, 2, 3 and 4.'],
      (c) => ['mazes', { level: 'hard', per: '1', theme: 'mix' }, 'Maze', 'Hard mazes: it is fine to start from the end and work backwards!'],
      (c) => ['gridcopy', { kind: 'copy' }, 'Copy the picture', 'Use the letters and numbers like a map to find each square.'],
      (c) => ['rolldraw', { theme: 'robot', name: c.name }, 'Roll and draw', 'Everyone rolls and draws, then give your robots names!'],
    ],
  },
};

/** Runs another maker and returns its first worksheet (portrait) and its answer page. */
function packRun(id, opts, paper, seed, all) {
  if (!MAKERS[id]) return { sheets: [], key: null };
  let pages = [];
  try { pages = MAKERS[id]({ seed, ...opts }, paper) || []; } catch (e) { return { sheets: [], key: null }; }
  const isKey = (s) => /Answer key for grown-ups|: answers?<\/text>/.test(s);
  const ok = pages.filter((s) => !isKey(s) && !/data-orient="landscape"/.test(s));
  return { sheets: all ? ok : ok.slice(0, 1), key: pages.find(isKey) || null };
}

/** Adds a small coloured label in the top corner of a finished page. */
function packBadge(svg, label, colour) {
  const w = +(/data-w="([\d.]+)"/.exec(svg) || [0, 210])[1];
  const bw = Math.max(20, label.length * 2.2 + 8);
  const g = `<g><rect x="${w - 13 - bw}" y="3.2" width="${bw}" height="6.6" rx="3.3" fill="${colour}"/><text x="${w - 13 - bw / 2}" y="7.8" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="3.8" fill="#fff">${esc(label)}</text></g>`;
  return svg.replace(/<\/svg>$/, `${g}</svg>`);
}

function packCover(paper, title, sub, lineArt, extra, tint, owner = 'pack') {
  const pg = new Page(paper, '', { bare: true, tint: tint || '#fffdf8' });
  const cx = pg.w / 2;
  pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="10" fill="#fff" stroke="#ffb938" stroke-width="1.2"/>`);
  pg.add(`<rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${pg.bottom - pg.m - 3}" rx="8" fill="none" stroke="#ffd98a" stroke-width="0.5" stroke-dasharray="2 1.6"/>`);
  ['star', 'heart', 'rainbow', 'sun'].forEach((a, i) => pg.add(pic(ART(a), i % 2 ? pg.right - 10 : pg.left + 10, i < 2 ? pg.m + 10 : pg.bottom - 13, 14)));
  const lines = wrap(title, 16);
  let y = pg.m + 34;
  lines.forEach((l) => { bubbleText(pg, l, cx, y, pg.width - 30, 20); y += 20; });
  pg.add(txt(cx, y + 2, sub, 6, { colour: '#8a3fd1' }));
  const size = Math.min(pg.width - 40, pg.bottom - y - 70);
  pg.add(`<g transform="translate(${cx - size / 2} ${y + 10}) scale(${(size / 200).toFixed(4)})">${colouringArt(lineArt)}</g>`);
  const ly = pg.bottom - 38;
  (extra || []).forEach((l, i) => pg.add(txt(cx, ly + i * 7, l, 4.6, { font: FONT, colour: SOFT })));
  pg.add(txt(pg.left + 12, pg.bottom - 16, `This ${owner} belongs to`, 4.6, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 56}" x2="${pg.right - 12}" y1="${pg.bottom - 15.4}" y2="${pg.bottom - 15.4}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  pg.footer = () => {};
  return pg.svg();
}

function packTracker(paper, name, days, titles) {
  const pg = new Page(paper, name ? `${possessive(name)} star chart` : 'My star chart', { subtitle: 'Colour a star every time you finish a page. Fill every star to earn your certificate!' });
  const rh = Math.min(34, (pg.room - 30) / days.length);
  days.forEach((d, i) => {
    const y = pg.y + i * rh, c = i % PALETTE.length;
    pg.add(panel(pg.left, y + 1.5, pg.width, rh - 3, TINTS[c], PALETTE[c], 6));
    pg.add(txt(pg.left + 6, y + rh / 2 + 2, d, 6, { anchor: 'start', colour: PALETTE[c] }));
    const items = titles[i], cw = (pg.width - 46) / Math.max(1, items.length);
    items.forEach((t, k) => {
      const cx = pg.left + 44 + cw * (k + 0.5);
      pg.add(`<path d="${starPath(cx, y + rh / 2 - 3, Math.min(8, rh * 0.26), 0.46)}" fill="#fff" stroke="${PALETTE[c]}" stroke-width="0.8" stroke-linejoin="round"/>`);
      pg.add(txt(cx, y + rh - 5, t, fitFont(t, 3.6, cw - 4, 0.5), { font: FONT, colour: INK }));
    });
  });
  const by = pg.bottom - 22;
  pg.add(panel(pg.left, by, pg.width, 20, '#fff6e0', '#ffb938', 6) + pic(ART('present'), pg.left + 12, by + 10, 14));
  pg.add(txt(pg.left + 24, by + 12, 'When my stars are full, my treat is', 5, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 110}" x2="${pg.right - 8}" y1="${by + 12.6}" y2="${by + 12.6}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  return pg.svg();
}

function packGuide(paper, name, ageText, plan) {
  const pg = new Page(paper, 'Grown-up guide', { subtitle: `A plan for ${name || 'your child'} (${ageText}). About 10 to 15 minutes a day is plenty.`, noName: true });
  const intro = ['Little and often beats long sessions. Stop while it is still fun.', 'Sit beside them, talk out loud, and praise effort: "you kept trying!"', 'Too hard? Do it together. Too easy? Every sheet has a Harder button at printpals.web.app.'];
  intro.forEach((l, i) => pg.add(pic(ART(['heart', 'star', 'sun'][i]), pg.left + 3, pg.y + i * 6.4 - 1.3, 5) + txt(pg.left + 8, pg.y + i * 6.4, l, 4, { anchor: 'start', font: FONT, weight: 700 })));
  pg.y += 3 * 6.4 + 3;
  // Each page: its name in bold on one line, the tip below. The size shrinks only if a long pack needs it.
  const room = pg.room - 4;
  const fit = (fs) => plan.reduce((h, d) => h + fs * 1.6 + 2 + d.items.reduce((a, it) => a + fs * 1.35 + wrap(it.tip, Math.floor((pg.width - 8) / (fs * 0.5))).length * fs * 1.3 + 1.2, 0) + 2, 0);
  let fs = 4.6;
  while (fs > 2.8 && fit(fs) > room) fs -= 0.1;
  plan.forEach((d, i) => {
    const c = PALETTE[i % PALETTE.length];
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${fs * 1.6}" rx="${fs * 0.8}" fill="${TINTS[i % TINTS.length]}"/>` + txt(pg.left + 4, pg.y + fs * 1.15, d.day, fs * 1.1, { anchor: 'start', colour: c }));
    pg.y += fs * 1.6 + 2;
    d.items.forEach((it) => {
      pg.add(txt(pg.left + 4, pg.y + fs, it.title, fs, { anchor: 'start', colour: INK }));
      pg.y += fs * 1.35;
      const lines = wrap(it.tip, Math.floor((pg.width - 8) / (fs * 0.5)));
      lines.forEach((l, k) => pg.add(txt(pg.left + 4, pg.y + fs * 0.95 + k * fs * 1.3, l, fs, { anchor: 'start', font: FONT, weight: 600, colour: '#5d5680' })));
      pg.y += lines.length * fs * 1.3 + 1.2;
    });
    pg.y += 2;
  });
  return pg.svg();
}

function packCertificate(paper, name, line) {
  const pg = new Page(paper, '', { bare: true, tint: '#fffaf0' });
  const cx = pg.w / 2;
  pg.add(`<rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${pg.bottom - pg.m}" rx="10" fill="#fff" stroke="#ffb938" stroke-width="2"/>`);
  pg.add(`<rect x="${pg.left + 5}" y="${pg.m + 5}" width="${pg.width - 10}" height="${pg.bottom - pg.m - 10}" rx="7" fill="none" stroke="#ff7eb6" stroke-width="0.6" stroke-dasharray="2.4 1.6"/>`);
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; pg.add(`<path d="${starPath(cx + Math.cos(a) * 62, pg.m + 78 + Math.sin(a) * 50, 3.2, 0.45)}" fill="${PALETTE[i % PALETTE.length]}"/>`); }
  pg.add(pic(ART('medal'), cx, pg.m + 76, 60));
  pg.add(txt(cx, pg.m + 146, 'Well done,', 12, { colour: '#8a3fd1' }));
  bubbleText(pg, name || 'Superstar', cx, pg.m + 172, pg.width - 40, 26);
  wrap(line, 34).forEach((l, i) => pg.add(txt(cx, pg.m + 196 + i * 9, l, 7, { colour: INK })));
  const ly = pg.bottom - 26;
  pg.add(txt(pg.left + 20, ly, 'Signed', 4.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${pg.left + 38}" x2="${cx - 8}" y1="${ly + 0.6}" y2="${ly + 0.6}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  pg.add(txt(cx + 8, ly, 'Date', 4.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${cx + 22}" x2="${pg.right - 20}" y1="${ly + 0.6}" y2="${ly + 0.6}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  pg.footer = () => {};
  return pg.svg();
}

/** Reads "Leo 6" style lines into children. */
function packChildren(o) {
  const kids = [{ name: nameOf(o.name, ''), age: +o.age || 4 }];
  listOf(o.siblings, 3).forEach((l) => {
    const m = /^(.*?)[\s,:.-]*(\d{1,2})\s*$/.exec(l);
    if (m && m[1].trim()) kids.push({ name: nameOf(m[1], ''), age: +m[2] });
    else if (l.trim()) kids.push({ name: nameOf(l, ''), age: kids[0].age });
  });
  return kids;
}

function packCtx(child, theme, day, rand) {
  const letters = (child.name ? child.name.toUpperCase().replace(/[^A-Z]/g, '') : '') + 'SATPIN';
  const uniq = [...new Set(letters)];
  return {
    name: child.name, day, themeLabel: theme.label, words: theme.words,
    letter: (d) => uniq[d % uniq.length],
    pic: (d) => theme.line[d % theme.line.length],
    draw: (d) => theme.draw[d % theme.draw.length],
    rand,
  };
}

function ageLabel(group) {
  return group === 3 ? 'ages 3 to 4' : group === 6 ? 'ages 6 to 8' : `ages ${group} to ${group + 1}`;
}

/** One week of pages for one child. levels says which age group each area uses (a stretch week can go one up). */
function packWeek(child, ci, theme, o, paper, week, levels) {
  const days = Math.max(1, Math.min(5, +o.days || 5));
  const per = Math.max(1, Math.min(3, +o.per || 2));
  const rand = rng((+o.seed || 1) + week * 7919 + ci * 31);
  const areas = ['words', 'numbers', 'fun'];
  const titles = [], plan = [], keys = [], sheets = [], dayNames = [];
  const offset = Math.floor(rand() * 6) + week * 2;
  for (let d = 0; d < days; d++) {
    const ctx = packCtx(child, theme, d + offset, rand);
    const dayLabel = week ? `Week ${week}, Day ${d + 1}` : `Day ${d + 1}`;
    dayNames.push(week ? `Day ${d + 1}` : dayLabel);
    const today = [], tips = [];
    // One page from each area, rotating which areas come first so every day feels different.
    const order = per === 3 ? areas : per === 2 ? (d % 3 === 0 ? ['words', 'numbers'] : d % 3 === 1 ? ['numbers', 'fun'] : ['words', 'fun']) : [areas[d % 3]];
    order.forEach((area, k) => {
      const list = CURRICULUM[levels[area]][area];
      const [id, opts, title, tip] = list[(d + offset + k * 2) % list.length](ctx);
      const res = packRun(id, { key: true, ...opts }, paper, (+o.seed || 1) + d * 97 + k * 13 + ci * 1009 + week * 4099);
      if (!res.sheets.length) return;
      const label = child.name ? `${child.name}, ${dayLabel}` : dayLabel;
      sheets.push(packBadge(res.sheets[0], label, PALETTE[(d + week) % PALETTE.length]));
      if (res.key) keys.push(packBadge(res.key, `Answers: ${dayLabel}`, SOFT));
      today.push(title); tips.push({ title, tip });
    });
    titles.push(today); plan.push({ day: dayLabel, items: tips });
  }
  return { sheets, keys, titles, plan, dayNames, offset };
}

function makePack(o, paper) {
  const theme = PACK_THEMES[o.theme] || PACK_THEMES.animals;
  const pages = [];
  packChildren(o).forEach((child, ci) => {
    const g = ageGroup(child.age);
    const w = packWeek(child, ci, theme, o, paper, 0, { words: g, numbers: g, fun: g });
    const who = child.name ? `${possessive(child.name)}` : 'My';
    if (o.cover !== false) pages.push(packCover(paper, `${who} learning week`, `${theme.label}, ${ageLabel(g)}`, theme.line[(w.offset + ci) % theme.line.length], ['One day at a time. Colour a star for every page you finish!', 'Made at printpals.web.app'], TINTS[ci % TINTS.length]));
    if (o.stars !== false) pages.push(packTracker(paper, child.name, w.dayNames, w.titles));
    pages.push(...w.sheets);
    if (o.certificate !== false) pages.push(packCertificate(paper, child.name, `You finished your whole learning week! We are so proud of you.`));
    if (o.guide !== false) pages.push(packGuide(paper, child.name, ageLabel(g), w.plan));
    if (o.key !== false) pages.push(...w.keys);
  });
  return pages;
}

// ================================================================ monthly learning plan (Plus)
function monthOverview(paper, name, theme, g, weeks) {
  const pg = new Page(paper, name ? `${possessive(name)} learning month` : 'My learning month', { subtitle: `${theme.label}, ${ageLabel(g)}. Four weeks that get a little harder each week. Colour a star for each day you finish!` });
  const rh = (pg.room - 26) / weeks.length;
  const focus = ['Getting started', 'Growing strong', 'A little stretch', 'Super stretch'];
  weeks.forEach((w, i) => {
    const y = pg.y + i * rh, c = PALETTE[i % PALETTE.length];
    pg.add(panel(pg.left, y + 1.5, pg.width, rh - 3, TINTS[i % TINTS.length], c, 7));
    pg.add(txt(pg.left + 6, y + 10, `Week ${i + 1}`, 7, { anchor: 'start', colour: c }) + txt(pg.left + 6, y + 16.5, focus[i], 4, { anchor: 'start', font: FONT, colour: SOFT }));
    const cw = (pg.width - 44) / w.titles.length;
    w.titles.forEach((ts, d) => {
      const cx = pg.left + 42 + cw * (d + 0.5);
      pg.add(`<path d="${starPath(cx, y + 11, 6, 0.46)}" fill="#fff" stroke="${c}" stroke-width="0.8" stroke-linejoin="round"/>` + txt(cx, y + 22, `Day ${d + 1}`, 3.8, { colour: INK }));
      ts.forEach((t, k) => pg.add(txt(cx, y + 27.5 + k * 4.2, t, fitFont(t, 3.2, cw - 3, 0.5), { font: FONT, weight: 700, colour: '#5d5680' })));
    });
  });
  const by = pg.bottom - 20;
  pg.add(panel(pg.left, by, pg.width, 18, '#fff6e0', '#ffb938', 6) + pic(ART('medal'), pg.left + 11, by + 9, 13));
  pg.add(txt(pg.left + 22, by + 11, 'When I finish my month, we will celebrate by', 4.6, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 112}" x2="${pg.right - 8}" y1="${by + 11.6}" y2="${by + 11.6}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  return pg.svg();
}

function makeMonthPlan(o, paper) {
  const theme = PACK_THEMES[o.theme] || PACK_THEMES.animals;
  const child = packChildren(o)[0];
  const g = ageGroup(child.age), up = Math.min(6, g + 1);
  // Weeks 1 and 2 at their level, then a gentle stretch: words go up in week 3, words and numbers in week 4.
  const levels = [{ words: g, numbers: g, fun: g }, { words: g, numbers: g, fun: g }, { words: up, numbers: g, fun: g }, { words: up, numbers: up, fun: g }];
  const weeks = levels.map((lv, i) => packWeek(child, 0, theme, o, paper, i + 1, lv));
  const who = child.name ? possessive(child.name) : 'My';
  const pages = [];
  pages.push(packCover(paper, `${who} learning month`, `${theme.label}, ${ageLabel(g)}`, theme.line[0], ['Four weeks of learning, a little harder each week.', 'Made at printpals.web.app'], '#fff6e0'));
  pages.push(monthOverview(paper, child.name, theme, g, weeks));
  weeks.forEach((w, i) => {
    if (o.guide !== false) pages.push(packGuide(paper, child.name, `${ageLabel(g)}, week ${i + 1}`, w.plan));
    pages.push(...w.sheets);
    if (o.certificate !== false && i === weeks.length - 1) pages.push(packCertificate(paper, child.name, 'You finished a whole month of learning! You worked so hard and we are so proud of you.'));
  });
  if (o.key !== false) weeks.forEach((w) => pages.push(...w.keys));
  return pages;
}

// ================================================================ personalised activity book (Plus)
const BOOK_ACTS = {
  3: [['mazes', { level: 'easy', per: '1', theme: 'mix' }], ['dots', { dots: '10', count: '1', puzzles: '1', layout: 'one' }], ['matching', { kind: 'shadow', pairs: '4' }], ['oddone', { level: 'easy' }], ['prewriting', { guide: 'thick', type: 'mixed' }], ['patterns', { kind: 'pictures', level: 'easy', key: false }], ['spotdiff', { level: 'easy' }], ['shapes', { kind: 'trace' }]],
  4: [['mazes', { level: 'easy', per: '1', theme: 'mix' }], ['dots', { dots: '20', count: '1', puzzles: '1', layout: 'one' }], ['spotdiff', { level: 'easy' }], ['oddone', { level: 'medium' }], ['howtodraw', {}], ['colournum', { mode: 'numbers' }], ['patterns', { kind: 'pictures', level: 'medium' }], ['rolldraw', { theme: 'monster' }], ['gridcopy', { kind: 'half' }], ['matching', { kind: 'count', pairs: '5' }]],
  5: [['mazes', { level: 'medium', per: '1', theme: 'mix' }], ['dots', { dots: '30', count: '1', puzzles: '1', layout: 'one' }], ['spotdiff', { level: 'medium' }], ['oddone', { level: 'medium' }], ['secretcode', { code: 'pictures' }], ['wordsearch', { size: '8', level: 'easy' }], ['sudoku', { size: '4', symbols: 'pictures', level: 'easy', pages: '1' }], ['colournum', { mode: 'add' }], ['gridcopy', { kind: 'half' }], ['howtodraw', {}], ['rolldraw', { theme: 'monster' }]],
  6: [['mazes', { level: 'hard', per: '1', theme: 'mix' }], ['dots', { dots: '50', count: '1', puzzles: '1', layout: 'one' }], ['spotdiff', { level: 'hard' }], ['oddone', { level: 'hard' }], ['secretcode', { code: 'numbers' }], ['wordsearch', { size: '10', level: 'medium' }], ['sudoku', { size: '4', symbols: 'numbers', level: 'medium', pages: '1' }], ['colournum', { mode: 'sub' }], ['gridcopy', { kind: 'copy' }], ['howtodraw', {}], ['rolldraw', { theme: 'robot' }], ['crossword', { bank: true }]],
};
const FOOTER_RE = /<text[^>]*>Free printable worksheets at printpals\.web\.app<\/text>/;

/** Puts a page number at the bottom of a finished page (and keeps or drops our web address). */
function pageNumber(svg, n, credit) {
  const w = +(/data-w="([\d.]+)"/.exec(svg) || [0, 210])[1], h = +(/data-h="([\d.]+)"/.exec(svg) || [0, 297])[1];
  const num = `<text x="${w / 2}" y="${h - 6.5}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="4.2" fill="#b8b3cc">${n}</text>`;
  return svg.replace(FOOTER_RE, '').replace(/<\/svg>$/, `${num}</svg>`).replace(credit ? /$^/ : /Made at printpals\.web\.app/g, '');
}

function bookMe(paper, name) {
  const pg = new Page(paper, 'This book belongs to', { noName: true });
  const cx = pg.w / 2;
  pg.add(`<rect x="${cx - 55}" y="${pg.y + 4}" width="110" height="110" rx="12" fill="#fff" stroke="#ffb938" stroke-width="1" stroke-dasharray="3 2"/>` + txt(cx, pg.y + 64, 'Draw yourself here!', 5, { font: FONT, colour: SOFT }));
  let y = pg.y + 132;
  const row = (label, val) => { pg.add(txt(pg.left + 10, y, label, 5.4, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 70}" x2="${pg.right - 10}" y1="${y + 0.8}" y2="${y + 0.8}" stroke="#b9b3d6" stroke-width="0.45"/>`); if (val) pg.add(txt(pg.left + 72, y - 1, val, 7, { anchor: 'start', colour: INK })); y += 15; };
  row('My name', name); row('I am this old', ''); row('My favourite colour', ''); row('My favourite animal', ''); row('I love to', '');
  return pg.svg();
}

function makeActivityBook(o, paper) {
  const theme = PACK_THEMES[o.theme] || PACK_THEMES.animals;
  const name = nameOf(o.name, '');
  const g = ageGroup(o.age);
  const total = Math.max(10, Math.min(40, +o.pages || 24));
  const credit = o.credit !== false;
  const acts = BOOK_ACTS[g];
  const inner = [], keys = [];
  let i = 0, guard = 0;
  while (inner.length < total && guard++ < total * 3) {
    const seed = (+o.seed || 1) + i * 211;
    // Every third page is colouring from the theme; the rest cycle through the puzzles.
    let res;
    if (i % 3 === 2) res = packRun('colouring', { book: 'one', picture: theme.line[Math.floor(i / 3) % theme.line.length], name }, paper, seed);
    else {
      const [id, opts] = acts[(i - Math.floor(i / 3)) % acts.length];
      const extra = id === 'howtodraw' ? { picture: theme.draw[i % theme.draw.length] } : id === 'wordsearch' ? { words: theme.words.join('\n'), title: `${theme.label} word search` } : {};
      res = packRun(id, { key: true, name, ...opts, ...extra }, paper, seed);
      if (res.key) keys.push(res.key);
    }
    if (res.sheets.length) inner.push(res.sheets[0]);
    i++;
  }
  const who = name ? possessive(name) : 'My';
  const pages = [packCover(paper, `${who} big activity book`, `${theme.label}, ${ageLabel(g)}`, theme.line[(+o.seed || 1) % theme.line.length], ['Puzzles, mazes, colouring and more!', credit ? 'Made at printpals.web.app' : ''], '#fff6e0', 'book')];
  pages.push(bookMe(paper, name), ...inner);
  if (o.certificate !== false) pages.push(packCertificate(paper, name, 'You finished your whole activity book! Brilliant work!'));
  if (o.key !== false) pages.push(...keys);
  return pages.map((svg, k) => (k === 0 ? svg.replace(credit ? /$^/ : /Made at printpals\.web\.app/g, '') : pageNumber(svg, k, credit)));
}

// ================================================================ learning passport
const SKILLS = {
  3: ['Hold a pencil or crayon', 'Draw a line and a circle', 'Say my whole name', 'Count to 5', 'Name 4 colours', 'Find the first letter of my name', 'Name a circle, square and triangle', 'Say a nursery rhyme', 'Tidy my toys away', 'Wash my hands by myself'],
  4: ['Write my name', 'Count to 10', 'Know 10 letter sounds', 'Name 8 colours', 'Spot two words that rhyme', 'Clap the beats in my name', 'Make a pattern', 'Count 10 things carefully', 'Draw a person', 'Put my coat on by myself'],
  5: ['Read 20 sight words', 'Sound out cat, dog and sun', 'Write a sentence', 'Count to 100', 'Add numbers to 10', 'Know my pairs that make 10', 'Tell the time to the hour', 'Count in 2s', 'Say the days of the week', 'Write numbers to 20'],
  6: ['Read a short book by myself', 'Write 3 sentences', 'Spell 20 words', 'Add and take away to 20', 'Count in 2s, 5s and 10s', 'Tell the time to half past', 'Know my 2, 5 and 10 times tables', 'Find a half and a quarter', 'Say the months of the year', 'Tie my shoelaces'],
};

function makePassport(o, paper) {
  const name = nameOf(o.name, '');
  const g = ageGroup(o.age);
  const pages = [];
  // Cover
  const c = new Page(paper, '', { bare: true, tint: '#2d2350' });
  const cx = c.w / 2;
  c.add(`<rect x="${c.left}" y="${c.m}" width="${c.width}" height="${c.bottom - c.m}" rx="12" fill="none" stroke="#ffc93c" stroke-width="1.2"/><rect x="${c.left + 4}" y="${c.m + 4}" width="${c.width - 8}" height="${c.bottom - c.m - 8}" rx="9" fill="none" stroke="#ffc93c" stroke-width="0.4" stroke-dasharray="2 1.5"/>`);
  c.add(txt(cx, c.m + 40, 'LEARNING', 16, { colour: '#ffc93c' }) + txt(cx, c.m + 58, 'PASSPORT', 16, { colour: '#ffc93c' }));
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; c.add(`<path d="${starPath(cx + Math.cos(a) * 52, c.m + 125 + Math.sin(a) * 52, 4, 0.45)}" fill="#ffc93c"/>`); }
  c.add(`<circle cx="${cx}" cy="${c.m + 125}" r="36" fill="none" stroke="#ffc93c" stroke-width="1.2"/>` + pic(ART('medal'), cx, c.m + 125, 50));
  if (name) c.add(txt(cx, c.m + 205, name, fitFont(name, 16, c.width - 40), { colour: '#fff' }));
  c.add(txt(cx, c.bottom - 30, 'Stamp it. Grow it. Be proud of it.', 5.4, { font: FONT, colour: '#d8d3ee' }));
  c.footer = () => {};
  pages.push(c.svg());
  // Identity page
  const p1 = new Page(paper, 'This passport belongs to', { noName: true });
  p1.add(`<rect x="${p1.left}" y="${p1.y}" width="70" height="86" rx="6" fill="#fff" stroke="${INK}" stroke-width="0.6" stroke-dasharray="3 2"/>` + txt(p1.left + 35, p1.y + 46, 'Photo or drawing', 4.2, { font: FONT, colour: SOFT }));
  let y = p1.y + 8;
  [['Name', name], ['Age', ''], ['Birthday', ''], ['I live in', ''], ['Favourite food', ''], ['Favourite animal', ''], ['When I grow up I want to be', '']].forEach(([l, v], k) => {
    const x = k < 5 ? p1.left + 78 : p1.left, x2 = p1.right;
    if (k === 5) y = p1.y + 102;
    p1.add(txt(x, y, l, 4.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${x}" x2="${x2}" y1="${y + 9}" y2="${y + 9}" stroke="#b9b3d6" stroke-width="0.45"/>`);
    if (v) p1.add(txt(x + 2, y + 7.5, v, 7, { anchor: 'start', colour: INK }));
    y += 17;
  });
  const fy = y + 6;
  p1.add(`<rect x="${p1.left}" y="${fy}" width="60" height="60" rx="8" fill="#fff" stroke="${INK}" stroke-width="0.6"/>` + txt(p1.left + 30, fy + 66, 'My thumbprint', 4.2, { font: FONT, colour: SOFT }));
  p1.add(`<rect x="${p1.left + 70}" y="${fy}" width="${p1.width - 70}" height="60" rx="8" fill="#fff" stroke="${INK}" stroke-width="0.6"/>` + txt(p1.left + 70 + (p1.width - 70) / 2, fy + 66, 'My signature', 4.2, { font: FONT, colour: SOFT }));
  pages.push(p1.svg());
  // Stamp pages
  const stamps = +o.stamps === 24 ? 24 : 12;
  for (let s0 = 0; s0 < stamps; s0 += 12) {
    const p2 = new Page(paper, 'My learning stamps', { subtitle: 'Finished a pack or a week of learning? Colour a stamp or add a sticker, and write the date.', noName: true });
    const cw = p2.width / 3, ch = (p2.room - 2) / 4;
    for (let k = 0; k < 12; k++) {
      const x = p2.left + (k % 3) * cw + cw / 2, yy = p2.y + Math.floor(k / 3) * ch + ch / 2 - 4, r = Math.min(cw, ch) * 0.36, col = PALETTE[(s0 + k) % PALETTE.length];
      p2.add(`<circle cx="${x}" cy="${yy}" r="${r}" fill="#fff" stroke="${col}" stroke-width="1.2" stroke-dasharray="3 2"/><circle cx="${x}" cy="${yy}" r="${r - 4}" fill="none" stroke="${col}" stroke-width="0.4"/>`);
      p2.add(txt(x, yy - r * 0.2, `Stamp ${s0 + k + 1}`, 4.6, { colour: col }) + `<path d="${starPath(x, yy + r * 0.3, r * 0.28, 0.46)}" fill="none" stroke="${col}" stroke-width="0.6"/>`);
      p2.add(`<line x1="${x - r}" x2="${x + r}" y1="${yy + r + 7}" y2="${yy + r + 7}" stroke="#c9c3e3" stroke-width="0.4"/>` + txt(x, yy + r + 11.5, 'date', 3.2, { font: FONT, colour: SOFT }));
    }
    pages.push(p2.svg());
  }
  // Skills
  const p3 = new Page(paper, 'I can do it!', { subtitle: `Colour a star when you can do each one. (${ageLabel(g)})`, noName: true });
  const list = SKILLS[g], rh = (p3.room - 2) / list.length;
  list.forEach((t, k) => {
    const yy = p3.y + k * rh, col = PALETTE[k % PALETTE.length];
    p3.add(panel(p3.left, yy + 1, p3.width, rh - 2, TINTS[k % TINTS.length], col, 6) + txt(p3.left + 7, yy + rh / 2 + 2, t, 5.6, { anchor: 'start', font: FONT, colour: INK }));
    p3.add(`<path d="${starPath(p3.right - 12, yy + rh / 2, Math.min(8, rh * 0.32), 0.46)}" fill="#fff" stroke="${col}" stroke-width="0.9" stroke-linejoin="round"/>`);
  });
  pages.push(p3.svg());
  return pages;
}

// ================================================================ class packs for teachers (Plus)
function makeClassPack(o, paper) {
  const names = listOf(o.names, 40).map((n) => nameOf(n, '')).filter(Boolean);
  const list = names.length ? names : ['Mia', 'Leo', 'Emma', 'Sam'];
  const all = list.join('\n');
  const pages = [];
  const seed = +o.seed || 1;
  const add = (res) => pages.push(...res.sheets);
  if (o.trace !== false) add(packRun('names', { names: all, case: 'title', size: 'medium' }, paper, seed, true));
  if (o.labels !== false) add(packRun('labels', { kind: 'desk', names: all }, paper, seed, true));
  if (o.bookmarks !== false) add(packRun('bookmarks', { style: 'colour', names: all }, paper, seed, true));
  if (o.reward !== false) list.forEach((n, i) => add(packRun('reward', { name: n, goal: String(o.goal || '').trim() || 'I can do it!', theme: ['stars', 'hearts', 'rockets', 'flowers', 'dinos'][i % 5], spaces: '15' }, paper, seed + i)));
  if (o.story !== false) list.forEach((n, i) => add(packRun('story', { name: n, text: 'big', answers: 'tick', story: ['balloon', 'kitten', 'picnic', 'rocket', 'rain', 'turtle', 'beach', 'teddy'][i % 8] }, paper, seed + i)));
  if (o.certificates !== false) list.forEach((n) => pages.push(packCertificate(paper, n, String(o.reason || '').trim() || 'for being a superstar in our class!')));
  return pages;
}

// ================================================================ quick packs for busy moments
const QUICK = {
  waiting: { title: 'Busy quiet pack', sub: 'For restaurants, waiting rooms and quiet times', art: 'owl',
    list: (g) => [['mazes', { level: g <= 4 ? 'easy' : 'medium', per: g <= 4 ? '1' : '2', theme: 'mix' }], ['dots', { dots: g <= 3 ? '10' : g <= 5 ? '20' : '30', count: '1', puzzles: '1', layout: 'one' }], g <= 4 ? ['matching', { kind: 'shadow', pairs: '4' }] : ['secretcode', { code: g <= 5 ? 'pictures' : 'numbers' }], ['oddone', { level: g <= 3 ? 'easy' : g <= 5 ? 'medium' : 'hard' }], ['spotdiff', { level: g <= 4 ? 'easy' : 'medium' }], ['colouring', { book: 'one', picture: 'owl' }]] },
  rainy: { title: 'Rainy day pack', sub: 'Crafts and games for a day indoors', art: 'snail',
    list: (g) => [['puppets', { style: 'colour' }], ['rolldraw', { theme: g <= 4 ? 'monster' : 'robot' }], ['howtodraw', { picture: 'frog' }], ['snakes', { extras: true }, true], ['hunt', { theme: 'home' }], ['doorhangers', { set: 'play', style: 'colour' }]] },
  sick: { title: 'Cosy sick day pack', sub: 'Gentle, calm things to do in bed', art: 'teddy',
    list: (g) => [['colouring', { book: 'one', picture: 'teddy' }], ['dots', { dots: g <= 3 ? '10' : '20', count: '1', puzzles: '1', layout: 'one' }], ['story', { text: g <= 4 ? 'big' : 'small', answers: 'tick', story: 'teddy' }], ['gridcopy', { kind: 'half' }], ['spotdiff', { level: 'easy' }], ['feelings', { faces: 'colour', chart: true, week: false, calm: true }]] },
  bedtime: { title: 'Calm before bed pack', sub: 'Slow, soothing pages to wind down', art: 'owl',
    list: (g) => [['colouring', { book: 'one', picture: 'owl' }], ['prewriting', { guide: 'dots', type: 'loops' }], ['gridcopy', { kind: 'half' }], ['feelings', { faces: 'colour-in', chart: true, week: false, calm: true }], ['routine', { routine: 'bedtime', layout: 'cards' }]] },
  outside: { title: 'Outdoor adventure pack', sub: 'Get outside and explore', art: 'butterfly',
    list: (g) => [['hunt', { theme: 'park' }], ['hunt', { theme: 'colours' }], ['weather', { week: true, month: false }], ['lifecycle', { cycle: 'plant', kind: 'learn' }], ['challenge', { theme: 'outdoors', days: '14' }]] },
};

function makeQuickPack(o, paper) {
  const q = QUICK[o.occasion] || QUICK.waiting;
  const name = nameOf(o.name, '');
  const g = ageGroup(o.age);
  const pages = [];
  if (o.cover !== false) pages.push(packCover(paper, name ? `${possessive(name)} ${q.title.toLowerCase()}` : q.title, q.sub, q.art, ['Pick any page you like. There is no wrong order!', 'Made at printpals.web.app']));
  const keys = [];
  q.list(g).forEach(([id, opts, all], i) => {
    const res = packRun(id, { key: true, name, ...opts }, paper, (+o.seed || 1) + i * 131, all);
    res.sheets.forEach((s) => pages.push(packBadge(s, `${i + 1}`, PALETTE[i % PALETTE.length])));
    if (res.key) keys.push(res.key);
  });
  if (o.key !== false) pages.push(...keys);
  return pages;
}

// ================================================================ family far away
const CALL_BINGO = [['👋', 'Someone waves'], ['❤️', 'Someone says "I love you"'], ['😂', 'Someone laughs'], ['🐶', 'You see a pet'], ['🎩', 'Someone wears a hat'], ['🍰', 'Someone eats or drinks'],
  ['🎨', 'You show a drawing'], ['🎵', 'Someone sings'], ['😘', 'Someone blows a kiss'], ['🌻', 'You see a plant'], ['🧸', 'Someone shows a toy'], ['☀️', 'You talk about the weather'],
  ['📚', 'Someone asks about school'], ['🤪', 'Someone pulls a funny face'], ['👕', 'Someone wears blue'], ['🌙', 'You say goodnight or good morning']];
const INTERVIEW = ['What was your favourite toy when you were little?', 'What games did you play with your friends?', 'What food do you love the most?', 'What made you laugh when you were my age?',
  'What was your school like?', 'What is your favourite song? Can you sing it?', 'What is one thing you love about me?', 'If you could go anywhere with me, where would we go?'];

function makeFarAway(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'all';
  const who = String(o.family || '').trim().slice(0, 24) || 'Grandma';
  const name = nameOf(o.name, '');
  const me = name || 'me';
  const pages = [];
  const want = (k) => kind === 'all' || kind === k;

  if (want('postcards')) {
    const pg = new Page(paper, `Postcards for ${who}`, { subtitle: `Draw on the front and write on the back. Take a photo and send it to ${who}, or post it!`, noName: true });
    const h = (pg.room - 10) / 2;
    [0, 1].forEach((k) => {
      const y = pg.y + k * (h + 10);
      // Front
      const fw = pg.width / 2 - 3;
      pg.add(`<rect x="${pg.left}" y="${y}" width="${fw}" height="${h}" rx="4" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`);
      pg.add(txt(pg.left + fw / 2, y + 12, k ? `I miss you, ${who}!` : `Hello from ${name || 'me'}!`, fitFont(k ? `I miss you, ${who}!` : `Hello from ${name || 'me'}!`, 7, fw - 10), { colour: PALETTE[k * 4] }));
      pg.add(`<rect x="${pg.left + 6}" y="${y + 17}" width="${fw - 12}" height="${h - 24}" rx="3" fill="${TINTS[k * 4]}" stroke="#d9d4ec" stroke-width="0.5" stroke-dasharray="2 1.4"/>`);
      pg.add(txt(pg.left + fw / 2, y + h / 2 + 6, 'Draw something for them here', 4, { font: FONT, colour: SOFT }));
      pg.add(pic(ART(k ? 'heart' : 'sun'), pg.left + fw - 12, y + h - 13, 12));
      // Back
      const bx = pg.left + fw + 6;
      pg.add(`<rect x="${bx}" y="${y}" width="${fw}" height="${h}" rx="4" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`);
      pg.add(`<rect x="${bx + fw - 26}" y="${y + 6}" width="20" height="24" rx="1.5" fill="#fff" stroke="${PALETTE[k * 3 + 1]}" stroke-width="0.7" stroke-dasharray="1.4 1"/>` + txt(bx + fw - 16, y + 20, 'stamp', 3.4, { font: FONT, colour: SOFT }));
      pg.add(txt(bx + 6, y + 14, `Dear ${who},`, 6, { anchor: 'start', colour: INK }));
      for (let l = 0; l < 6; l++) pg.add(`<line x1="${bx + 6}" x2="${bx + fw - (l < 1 ? 30 : 6)}" y1="${y + 26 + l * ((h - 44) / 5)}" y2="${y + 26 + l * ((h - 44) / 5)}" stroke="#c9c3e3" stroke-width="0.4"/>`);
      pg.add(txt(bx + 6, y + h - 7, `Love from ${me} ❤`, 5, { anchor: 'start', colour: '#e0457b' }));
    });
    pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${pg.y + h + 5}" y2="${pg.y + h + 5}" stroke="#b9b3d6" stroke-width="0.35" stroke-dasharray="2.2 1.6"/>`);
    pages.push(pg.svg());
  }

  if (want('bingo')) {
    const pg = new Page(paper, 'Video call bingo', { subtitle: `Play while you talk to ${who}! Cross off each thing when it happens. Shout BINGO for a whole line.` });
    const items = shuffle(CALL_BINGO, rand).slice(0, 9);
    const size = Math.min(pg.width, pg.room - 30), cell = size / 3, gx = pg.left + (pg.width - size) / 2;
    items.forEach(([e, t], i) => {
      const x = gx + (i % 3) * cell, y = pg.y + Math.floor(i / 3) * cell;
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cell - 3}" height="${cell - 3}" rx="6" fill="${TINTS[i % TINTS.length]}" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="0.8"/>`);
      pg.add(emoji(e, x + cell / 2, y + cell * 0.4, cell * 0.36));
      wrap(t, 16).forEach((l, k) => pg.add(txt(x + cell / 2, y + cell * 0.74 + k * 5.4, l, 4.4, { font: FONT, colour: INK })));
    });
    const by = pg.y + size + 8;
    pg.add(panel(pg.left, by, pg.width, 16, '#fff0f5', '#ff7eb6', 6) + txt(pg.w / 2, by + 10, `Something I want to tell ${who} today:`, 5, { font: FONT, colour: '#e0457b' }));
    pages.push(pg.svg());
  }

  if (want('interview')) {
    const pg = new Page(paper, `Interview ${who}`, { subtitle: `Ask ${who} these questions on your next call. Write or draw the answers.` });
    const qs = shuffle(INTERVIEW, rand).slice(0, 6);
    const rh = (pg.room - 44) / qs.length;
    qs.forEach((q, i) => {
      const y = pg.y + i * rh;
      pg.add(`<circle cx="${pg.left + 4}" cy="${y + 4}" r="3.6" fill="${PALETTE[i % PALETTE.length]}"/>` + txt(pg.left + 4, y + 5.5, i + 1, 4, { colour: '#fff' }));
      pg.add(txt(pg.left + 11, y + 5.6, q, fitFont(q, 5, pg.width - 14, 0.5), { anchor: 'start', font: FONT, colour: INK }));
      for (let l = 1; l <= 2; l++) pg.add(`<line x1="${pg.left + 11}" x2="${pg.right}" y1="${y + 6 + l * (rh - 9) / 2}" y2="${y + 6 + l * (rh - 9) / 2}" stroke="#c9c3e3" stroke-width="0.4"/>`);
    });
    const by = pg.y + qs.length * rh + 2;
    pg.add(`<rect x="${pg.left}" y="${by}" width="${pg.width}" height="40" rx="6" fill="#fffdf5" stroke="#ffb938" stroke-width="0.7" stroke-dasharray="2.4 1.6"/>` + txt(pg.left + 5, by + 7, `Draw ${who} here`, 4.6, { anchor: 'start', font: FONT, colour: SOFT }));
    pages.push(pg.svg());
  }

  if (want('news')) {
    const pg = new Page(paper, `${name ? possessive(name) : 'My'} news for ${who}`, { subtitle: `Fill it in, then take a photo and send it to ${who}. They will love it!`, noName: true });
    const boxes = [['This week I...', '#ff6b6b'], ['My favourite thing was...', '#ffb938'], ['I learned how to...', '#3fbfa8'], ['Next week I can\'t wait to...', '#6c8cff']];
    const cw = pg.width / 2, bh = (pg.room - 70) / 2;
    boxes.forEach(([t, c], i) => {
      const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * bh;
      pg.add(panel(x + 1.5, y + 1.5, cw - 3, bh - 3, TINTS[i * 2 % TINTS.length], c, 6) + txt(x + 7, y + 10, t, 5, { anchor: 'start', colour: c }));
      for (let l = 1; l <= 4; l++) { const ly = y + 10 + l * (bh - 16) / 4.4; if (ly < y + bh - 5) pg.add(`<line x1="${x + 7}" x2="${x + cw - 7}" y1="${ly}" y2="${ly}" stroke="#c9c3e3" stroke-width="0.4"/>`); }
    });
    const py = pg.y + 2 * bh + 3;
    pg.add(`<rect x="${pg.left}" y="${py}" width="${pg.width}" height="${pg.bottom - py - 12}" rx="6" fill="#fff" stroke="${INK}" stroke-width="0.6" stroke-dasharray="3 2"/>` + txt(pg.left + 5, py + 7, 'A picture of my week', 4.6, { anchor: 'start', font: FONT, colour: SOFT }));
    pg.add(txt(pg.right, pg.bottom - 4, `Love from ${me} ❤`, 6, { anchor: 'end', colour: '#e0457b' }));
    pages.push(pg.svg());
  }

  if (want('countdown')) {
    const n = Math.max(3, Math.min(30, +o.days || 14));
    const pg = new Page(paper, `Days until I see ${who}!`, { subtitle: 'Colour one circle every night before bed. When you reach the heart, it is time for a big hug!' });
    const cols = n <= 10 ? 5 : n <= 21 ? 6 : 7;
    const rows = Math.ceil((n + 1) / cols);
    const cell = Math.min(pg.width / cols, (pg.room - 30) / rows);
    const gx = pg.left + (pg.width - cell * cols) / 2;
    const pos = (i) => { const r = Math.floor(i / cols), c = r % 2 ? cols - 1 - (i % cols) : i % cols; return [gx + c * cell + cell / 2, pg.y + r * cell + cell / 2]; };
    for (let i = 0; i < n; i++) {
      const [x1, y1] = pos(i), [x2, y2] = pos(i + 1);
      pg.add(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e2ddf2" stroke-width="2.4" stroke-linecap="round"/>`);
    }
    for (let i = 0; i < n; i++) {
      const [x, y] = pos(i);
      pg.add(`<circle cx="${x}" cy="${y}" r="${cell * 0.36}" fill="#fff" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="1"/>` + txt(x, y + cell * 0.12, n - i, cell * 0.32, { colour: PALETTE[i % PALETTE.length] }));
    }
    const [hx, hy] = pos(n);
    pg.add(pic(ART('heart'), hx, hy, cell * 0.9));
    const by = pg.y + rows * cell + 6;
    pg.add(txt(pg.w / 2, by + 6, `When I see ${who}, the first thing I will do is`, 5, { font: FONT }) + `<line x1="${pg.left + 20}" x2="${pg.right - 20}" y1="${by + 18}" y2="${by + 18}" stroke="#b9b3d6" stroke-width="0.4"/>`);
    pages.push(pg.svg());
  }
  return pages;
}

Object.assign(MAKERS, { pack: makePack, quickpack: makeQuickPack, faraway: makeFarAway, monthplan: makeMonthPlan, activitybook: makeActivityBook, passport: makePassport, classpack: makeClassPack });
