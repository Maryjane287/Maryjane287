// PrintPals batch 28 (Plus editions): Colouring Month, Puzzle Month, Writing Month and the teachers' Morning Work Month.

// ================================================================ Colouring Month (Plus edition)
// Every page is a whole scene: a background world, one big star picture and friends around it.
const CM_SCENES = {
  garden: { name: 'In the garden', main: ['bunny', 'cat', 'dog', 'sunflower', 'house', 'snail', 'frog', 'teddy'], extra: ['butterfly', 'bee', 'ladybird', 'snail', 'owl', 'frog'] },
  sea: { name: 'Under the sea', main: ['whale', 'octopus', 'turtle', 'fish'], extra: ['fish', 'turtle', 'octopus', 'boat', 'fish'] },
  space: { name: 'In space', main: ['rocket', 'robot', 'unicorn'], extra: ['rocket', 'robot', 'owl'] },
  town: { name: 'In town', main: ['train', 'car', 'house', 'castle'], extra: ['car', 'plane', 'dog', 'cat', 'boat'] },
  party: { name: 'Party time', main: ['cake', 'teddy', 'unicorn', 'icecream'], extra: ['icecream', 'cake', 'teddy', 'balloons', 'bunny'] },
  fairy: { name: 'Fairy tale land', main: ['castle', 'unicorn', 'owl'], extra: ['owl', 'butterfly', 'bunny', 'snail', 'frog'] },
  safari: { name: 'On safari', main: ['elephant', 'giraffe', 'dino'], extra: ['giraffe', 'elephant', 'bee', 'butterfly', 'turtle'] },
  winter: { name: 'Snowy day', main: ['penguin', 'snowman'], extra: ['penguin', 'owl', 'bunny', 'dog'] },
};
const CM_ORDER = ['garden', 'sea', 'space', 'town', 'party', 'fairy', 'safari', 'winter'];

function cmFlower(x, y, r) { let o = ''; for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2; o += `<circle cx="${x + Math.cos(a) * r}" cy="${y + Math.sin(a) * r}" r="${r * 0.7}" ${LW}/>`; } return `<path d="M${x} ${y + r} V${y + r * 4}" ${LN}/>` + o + `<circle cx="${x}" cy="${y}" r="${r * 0.6}" ${LW}/>`; }
function cmTree(x, y, s) { return `<rect x="${x - 5 * s}" y="${y - 30 * s}" width="${10 * s}" height="${30 * s}" ${LW}/><circle cx="${x}" cy="${y - 44 * s}" r="${22 * s}" ${LW}/><circle cx="${x - 14 * s}" cy="${y - 34 * s}" r="${12 * s}" ${LW}/><circle cx="${x + 14 * s}" cy="${y - 34 * s}" r="${12 * s}" ${LW}/>`; }
function cmSun(x, y, r) { let o = `<circle cx="${x}" cy="${y}" r="${r}" ${LW}/>`; for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; o += `<path d="M${x + Math.cos(a) * (r + 3)} ${y + Math.sin(a) * (r + 3)} L${x + Math.cos(a) * (r + 9)} ${y + Math.sin(a) * (r + 9)}" ${LN}/>`; } return o; }
function cmGrass(y, rand) { let o = ''; for (let x = 6; x < 196; x += 16 + rand() * 12) o += `<path d="M${x} ${y} q-1 -6 -4 -9 M${x} ${y} q0 -8 1 -12 M${x} ${y} q2 -6 5 -8" ${LT}/>`; return o; }

function cmBackground(scene, rand) {
  const H = 240, g = [];
  if (scene === 'garden' || scene === 'fairy' || scene === 'safari') {
    g.push(`<path d="M0 ${H - 44} Q50 ${H - 64} 100 ${H - 48} T200 ${H - 50}" ${LN}/>`, cmGrass(H - 8, rand));
    if (scene === 'garden') { g.push(cmSun(100, 26, 11), cCloud(56, 40, 0.6), cCloud(150, 34, 0.55)); [16, 40, 162, 186].forEach((x) => g.push(cmFlower(x, H - 30, 3.4))); }
    if (scene === 'fairy') { g.push(`<path d="M112 14 A18 18 0 1 0 128 42 A14 14 0 1 1 112 14 Z" ${LW}/>`, cStar(70, 24, 5), cStar(150, 50, 4), cStar(40, 60, 4), cmTree(20, H - 40, 0.7), cmTree(182, H - 42, 0.7)); }
    if (scene === 'safari') { g.push(cmSun(100, 26, 11), `<path d="M160 ${H - 50} V${H - 90} M140 ${H - 92} Q160 ${H - 104} 184 ${H - 92} Z" ${LW}/>`, `<path d="M26 ${H - 48} V${H - 84} M8 ${H - 86} Q26 ${H - 98} 46 ${H - 86} Z" ${LW}/>`); }
  } else if (scene === 'sea') {
    g.push(`<path d="M0 12 Q12 4 25 12 T50 12 T75 12 T100 12 T125 12 T150 12 T175 12 T200 12" ${LN}/>`, `<path d="M0 ${H - 16} Q40 ${H - 28} 80 ${H - 18} T160 ${H - 20} T200 ${H - 16}" ${LN}/>`);
    [[18, H - 18], [60, H - 20], [140, H - 20], [184, H - 18]].forEach(([x, y]) => g.push(`<path d="M${x} ${y} Q${x - 6} ${y - 14} ${x} ${y - 26} Q${x + 6} ${y - 38} ${x} ${y - 50}" ${LN}/>`));
    for (let k = 0; k < 9; k++) g.push(`<circle cx="${20 + rand() * 160}" cy="${30 + rand() * 60}" r="${1.5 + rand() * 3}" ${LW}/>`);
    g.push(`<path d="M100 ${H - 12} l6 -6 l6 6 l-6 3 Z" ${LW}/>`, cStar(120, H - 10, 5));
  } else if (scene === 'space') {
    for (let k = 0; k < 14; k++) g.push(cStar(8 + rand() * 184, 8 + rand() * 224, 2 + rand() * 3));
    g.push(`<circle cx="30" cy="${H - 40}" r="16" ${LW}/><ellipse cx="30" cy="${H - 40}" rx="26" ry="6" ${LT}/>`, `<circle cx="176" cy="${H - 60}" r="10" ${LW}/><circle cx="172" cy="${H - 63}" r="2.5" ${LT}/><circle cx="180" cy="${H - 56}" r="2" ${LT}/>`, `<path d="M92 12 A16 16 0 1 0 108 36 A12 12 0 1 1 92 12 Z" ${LW}/>`);
  } else if (scene === 'town') {
    g.push(`<path d="M0 ${H - 60} Q30 ${H - 90} 60 ${H - 64} Q100 ${H - 96} 140 ${H - 66} Q170 ${H - 88} 200 ${H - 62}" ${LN}/>`, `<rect x="0" y="${H - 26}" width="200" height="18" ${LW}/>`, `<path d="M8 ${H - 17} h12 M40 ${H - 17} h12 M72 ${H - 17} h12 M104 ${H - 17} h12 M136 ${H - 17} h12 M168 ${H - 17} h12" ${LN}/>`, cCloud(100, 26, 0.6), cmSun(22, 64, 8));
  } else if (scene === 'party') {
    let bunt = `<path d="M0 8 Q100 30 200 8" ${LN}/>`; for (let k = 0; k < 9; k++) { const x = 12 + k * 22, y = 8 + Math.sin((k / 8) * Math.PI) * 18; bunt += `<path d="M${x - 7} ${y - 1} L${x + 7} ${y + 1} L${x} ${y + 14} Z" ${LW}/>`; }
    g.push(bunt, `<path d="M0 ${H - 30} H200" ${LN}/>`);
    for (let k = 0; k < 10; k++) { const x = 10 + rand() * 180, y = 50 + rand() * 60; g.push(k % 2 ? `<circle cx="${x}" cy="${y}" r="2" ${LW}/>` : `<path d="M${x} ${y} l5 3 l-2 2 l-5 -3 Z" ${LW}/>`); }
  } else if (scene === 'winter') {
    g.push(`<path d="M0 ${H - 40} Q60 ${H - 60} 120 ${H - 44} T200 ${H - 46}" ${LN}/>`, cmTree(22, H - 40, 0.7).replace(/<circle/g, '<circle'), cCloud(150, 30, 0.6));
    for (let k = 0; k < 16; k++) { const x = 8 + rand() * 184, y = 8 + rand() * 150, r = 1.6 + rand() * 2; g.push(`<path d="M${x - r} ${y} H${x + r} M${x} ${y - r} V${y + r} M${x - r * 0.7} ${y - r * 0.7} L${x + r * 0.7} ${y + r * 0.7} M${x - r * 0.7} ${y + r * 0.7} L${x + r * 0.7} ${y - r * 0.7}" ${LT}/>`); }
  }
  return g.join('');
}

function cmScene(scene, rand, W, H) {
  const S = CM_SCENES[scene], main = S.main[Math.floor(rand() * S.main.length)], pool = shuffle(S.extra.filter((k) => k !== main), rand);
  const place = (key, x, y, sz) => `<g transform="translate(${x} ${y}) scale(${(sz / 200).toFixed(4)})">${seasonArt(key)}</g>`;
  let out = cmBackground(scene, rand);
  const slots = [[4, 58, 58], [138, 58, 58], [6, 150, 48], [146, 150, 48], [0, 108, 40], [160, 108, 40]];
  pool.concat(shuffle(S.main.filter((k) => k !== main), rand)).slice(0, 6).forEach((k, i) => { out += place(k, ...slots[i]); });
  out += place(main, 42, 76, 116);
  return { svg: out, main };
}

const CM_CHALLENGES = [
  ['🖍️', 'Use only 3 colours today!'], ['🌈', 'Make something rainbow coloured'], ['🔵', 'Colour the sky using dots'], ['〰️', 'Fill the ground with stripes and zigzags'], ['❤️', 'Hide 5 little hearts in the picture'],
  ['🌙', 'Make it a night time picture'], ['🎨', 'Use a colour you never use'], ['☀️', 'Make it bright and sunny'], ['🧊', 'Only cool colours: blue, green, purple'], ['🔥', 'Only warm colours: red, orange, yellow'],
  ['✨', 'Add sparkles and stars'], ['🤝', 'Colour it with someone else'], ['🎵', 'Colour while listening to music'], ['🌸', 'Add three more flowers'], ['🖊️', 'Go slowly and stay inside the lines'],
  ['🎁', 'Give it to someone when you finish'], ['🦄', 'Make it magical'], ['🐾', 'Draw one more animal friend'], ['💭', 'Add a speech bubble: what are they saying?'], ['🏆', 'Your best colouring yet!'],
  ['👀', 'Give everyone the same colour eyes'], ['🌧️', 'Draw rain or snow falling'], ['🟢', 'Colour something green in every corner'], ['🎭', 'Give one friend a funny hat'], ['🪄', 'Use light colours first, then dark'],
  ['🔴', 'Find and colour 5 circles red'], ['🎉', 'Make it a party!'], ['🌳', 'Add a tree somewhere'], ['🌟', 'Colour the biggest thing last'], ['📏', 'Colour everything in the same direction'],
  ['😂', 'Make someone laugh with your colours'], ['🐞', 'Add tiny spots to something'], ['🧁', 'Colour it in sweet pastel colours'], ['🌊', 'Add wavy patterns'], ['🏠', 'Draw where they live'],
  ['⚡', 'Colour it super fast, then add details slowly'], ['🧩', 'Use a different colour for every shape'], ['🍃', 'Draw leaves blowing in the wind'], ['🌅', 'Make the sky a sunset'], ['👑', 'Your masterpiece: take your time!'],
];

function makeColourMonth(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const lk = edLook(o.look);
  const pages = [seriesCover(paper, 'PRINTPALS PLUS EDITION', name ? `${possessive(name)} Colouring Month` : 'My Colouring Month', '40 busy scenes, 40 fun challenges', ['🎨', '🌳', '🐙', '🚀', '🎉', '🦒'], lk.ring, lk.tint, 'colouring book', ['40 full scenes', '8 different worlds', 'A challenge on every page', 'Two pictures a day', 'Draw my own scene', 'Gallery and certificate'])];
  const scenes = [];
  for (let i = 0; i < 40; i++) scenes.push(CM_ORDER[(i + Math.floor(i / 8)) % CM_ORDER.length]);
  // Plan: 40 stars.
  {
    const pg = new Page(paper, 'My colouring month plan', { subtitle: 'Two pictures a day for 20 days. Colour a star for each finished picture!' });
    const cols = 8, cw = pg.width / cols, ch = Math.min(34, (pg.room - 40) / 5);
    scenes.forEach((sc, i) => { const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch, c = PALETTE[i % PALETTE.length]; pg.add(`<rect x="${x + 1}" y="${y + 1}" width="${cw - 2}" height="${ch - 2}" rx="6" fill="${TINTS[Math.floor(i / 8) % TINTS.length]}" stroke="#d9d4ec" stroke-width="0.4"/><path d="${starPath(x + cw / 2, y + ch * 0.42, ch * 0.24, 0.45)}" fill="#fff" stroke="${c}" stroke-width="0.8"/>` + txt(x + cw / 2, y + ch - 4, `${i + 1}`, 5, { colour: c })); });
    pg.y += 5 * ch + 10;
    pg.add(panel(pg.left, pg.y, pg.width, 26, lk.tint, lk.ring, 10) + emoji('🎁', pg.left + 14, pg.y + 13, 12) + txt(pg.left + 28, pg.y + 11, 'My colouring reward', 6.4, { anchor: 'start', colour: lk.ring }) + txt(pg.left + 28, pg.y + 20, 'When all 40 stars are coloured, my treat is:', 5.2, { anchor: 'start', font: FONT, colour: INK }) + `<line x1="${pg.left + 142}" x2="${pg.right - 10}" y1="${pg.y + 20.6}" y2="${pg.y + 20.6}" stroke="#b9b3d6" stroke-width="0.5"/>`);
    pages.push(pg.svg());
  }
  scenes.forEach((sc, i) => {
    const [e, ch] = CM_CHALLENGES[i], sn = cmScene(sc, rand), title = CM_SCENES[sc].name;
    const pg = new Page(paper, '', { bare: true });
    const top = pg.m + 2;
    pg.add(panel(pg.left, top, pg.width, 18, lk.tint, lk.ring, 9) + txt(pg.left + 8, top + 11.6, `${i + 1}. ${title}`, 7.4, { anchor: 'start', colour: lk.ring }) + txt(pg.right - 8, top + 11.6, `Picture ${i + 1} of 40`, 5.2, { anchor: 'end', font: FONT, colour: INK }));
    pg.add(panel(pg.left, top + 21, pg.width, 14, '#fff', '#e2ddf2', 7) + emoji(e, pg.left + 9, top + 28, 8) + txt(pg.left + 18, top + 30.6, `Challenge: ${ch}`, fitFont(`Challenge: ${ch}`, 6, pg.width - 26, 0.52), { anchor: 'start', colour: INK }));
    const boxY = top + 39, boxH = pg.bottom - boxY - 14, boxW = pg.width;
    pg.add(`<rect x="${pg.left}" y="${boxY}" width="${boxW}" height="${boxH}" rx="8" fill="#fff" stroke="#1f1b2e" stroke-width="1"/>`);
    const sc2 = Math.min((boxW - 6) / 200, (boxH - 6) / 240);
    pg.add(`<g transform="translate(${pg.left + (boxW - 200 * sc2) / 2} ${boxY + (boxH - 240 * sc2) / 2}) scale(${sc2.toFixed(4)})">${sn.svg}</g>`);
    const y = pg.bottom - 5;
    pg.add(txt(pg.left, y, 'Colours I used:', 5.4, { anchor: 'start', colour: lk.ring }));
    for (let k = 0; k < 6; k++) pg.add(`<rect x="${pg.left + 46 + k * 13}" y="${y - 7}" width="10" height="8" rx="2" fill="#fff" stroke="#9a93b8" stroke-width="0.6"/>`);
    pg.add(txt(pg.right - 14, y, name ? `Coloured by ${name}` : 'Coloured by ________', 5.4, { anchor: 'end', font: FONT, colour: SOFT }) + `<path d="${starPath(pg.right - 5, y - 2, 4.6, 0.45)}" fill="#fff" stroke="${lk.accent}" stroke-width="0.7"/>`);
    pg.footer = () => {};
    pages.push(pg.svg());
  });
  // Draw my own scene.
  {
    const pg = new Page(paper, 'Draw your own scene!', { subtitle: 'You are the artist now. Pick a world: the seaside, the jungle, a castle, space or your own street. Fill it with lots of things!' });
    const bh = pg.room - 30;
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${bh}" rx="10" fill="#fff" stroke="${lk.ring}" stroke-width="1.2"/>`);
    pg.y += bh + 8;
    pg.add(txt(pg.left, pg.y + 6, 'My scene is called', 6.4, { anchor: 'start', colour: lk.ring }) + `<line x1="${pg.left + 60}" x2="${pg.right}" y1="${pg.y + 6.6}" y2="${pg.y + 6.6}" stroke="#c9c3e3" stroke-width="0.5"/>`);
    pages.push(pg.svg());
  }
  // Gallery.
  {
    const pg = new Page(paper, 'My colouring gallery', { subtitle: 'Draw a tiny copy of your 4 favourite pictures in the frames. Which one was the very best?' });
    const cw = pg.width / 2, ch = (pg.room - 30) / 2;
    for (let k = 0; k < 4; k++) { const x = pg.left + (k % 2) * cw, y = pg.y + Math.floor(k / 2) * ch; pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${cw - 8}" height="${ch - 8}" rx="4" fill="#fff5e0" stroke="#c9a96a" stroke-width="3"/><rect x="${x + 10}" y="${y + 10}" width="${cw - 20}" height="${ch - 28}" fill="#fff" stroke="#c9a96a" stroke-width="0.6"/>` + txt(x + cw / 2, y + ch - 10, `Favourite number ${k + 1}`, 5.4, { font: FONT, colour: SOFT })); }
    pg.y += 2 * ch + 6;
    pg.add(panel(pg.left, pg.y, pg.width, 22, lk.tint, lk.ring, 10) + emoji('🏆', pg.left + 12, pg.y + 11, 10) + txt(pg.left + 24, pg.y + 13.4, 'My very best picture was number', 6.4, { anchor: 'start', colour: lk.ring }) + `<rect x="${pg.left + 124}" y="${pg.y + 5}" width="22" height="12" rx="3" fill="#fff" stroke="${lk.ring}" stroke-width="0.8"/>`);
    pages.push(pg.svg());
  }
  pages.push(seriesCert(paper, 'COLOURING MONTH COMPLETE', 'Amazing Artist', name, 'for colouring 40 whole scenes with care and imagination!', 'Next month: a brand new set of scenes and challenges!', lk.ring));
  return pages;
}

// ================================================================ Puzzle Month (Plus edition)
const PM_PLAN = {
  easy: [['mazes', { level: 'easy' }, 'Maze'], ['dots', { dots: '20', puzzles: '1' }, 'Dot to dot'], ['spotdiff', { level: 'easy' }, 'Spot the difference'], ['oddone', { level: 'easy' }, 'Odd one out'], ['sudoku', { size: '4', symbols: 'pictures', level: 'easy' }, 'Picture sudoku']],
  medium: [['mazes', { level: 'medium' }, 'Maze'], ['dots', { dots: '30', puzzles: '1' }, 'Dot to dot'], ['wordsearch', { size: '8', level: 'easy' }, 'Word search'], ['sudoku', { size: '4', symbols: 'numbers', level: 'medium' }, 'Sudoku'], ['coding', { level: 'easy' }, 'Coding puzzle']],
  hard: [['mazes', { level: 'hard' }, 'Maze'], ['wordsearch', { size: '10', level: 'medium' }, 'Word search'], ['sudoku', { size: '6', symbols: 'numbers', level: 'medium' }, 'Sudoku'], ['secretcode', { code: 'numbers' }, 'Secret code'], ['coding', { level: 'medium' }, 'Coding puzzle']],
};

function makePuzzleMonth(o, paper) {
  const name = nameOf(o.name, '') || '';
  const lk = edLook(o.look), level = PM_PLAN[o.level] ? o.level : 'medium', plan = PM_PLAN[level];
  const base = +o.seed || 1, days = [], keys = [];
  for (let i = 0; i < 20; i++) days.push(plan[i % plan.length].concat([i]));
  const pages = [seriesCover(paper, 'PRINTPALS PLUS EDITION', name ? `${possessive(name)} Puzzle Month` : 'My Puzzle Month', `A new puzzle every day for 4 weeks`, ['🧩', '🌀', '🔍', lk.corner, '🧠', '🏆'], lk.ring, lk.tint, 'puzzle book', ['20 daily puzzles', '5 kinds of puzzle', 'Puzzle passport', 'Friday badges', 'Answers for grown-ups', 'Puzzle Master award'])];
  // Passport.
  {
    const pg = new Page(paper, 'My puzzle passport', { subtitle: 'Stamp or colour a badge each time you finish a puzzle. How fast can you fill it?' });
    const cols = 5, cw = pg.width / cols, ch = (pg.room - 10) / 4;
    days.forEach(([, , lab], i) => { const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch, c = PALETTE[i % PALETTE.length]; pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, TINTS[i % TINTS.length], c, 9) + txt(x + cw / 2, y + 11, `Day ${i + 1}`, 6.4, { colour: c }) + `<circle cx="${x + cw / 2}" cy="${y + ch / 2 + 2}" r="${Math.min(cw, ch) * 0.24}" fill="#fff" stroke="${c}" stroke-width="0.8" stroke-dasharray="2 1.5"/>` + txt(x + cw / 2, y + ch - 8, lab, fitFont(lab, 5, cw - 8, 0.5), { font: FONT, weight: 700, colour: INK })); });
    pages.push(pg.svg());
  }
  days.forEach(([id, opts, lab, i]) => {
    const w = Math.floor(i / 5) + 1, d = (i % 5) + 1;
    const run = packRun(id, opts, paper, base * 31 + i * 7 + 1);
    if (!run.sheets.length) return;
    pages.push(packBadge(run.sheets[0], `Week ${w} · Day ${i + 1}${d === 5 ? ' · Friday!' : ''}`, lk.ring));
    if (run.key) keys.push(packBadge(run.key, `Answers: day ${i + 1}`, SOFT));
  });
  pages.push(...keys);
  pages.push(seriesCert(paper, 'PUZZLE MONTH COMPLETE', 'Puzzle Master', name, 'for solving 20 puzzles with patience and clever thinking!', level === 'hard' ? 'Next: the Detective Academy!' : 'Next month: try the next level up!', lk.ring));
  return pages;
}

// ================================================================ Writing Month (Plus edition)
const WM_PROMPTS = [
  ['🐉', 'A dragon comes to your school', ['dragon', 'wings', 'fire', 'friendly', 'teacher'], 'One day a dragon'],
  ['🏝️', 'You find a secret island', ['island', 'treasure', 'palm tree', 'map', 'waves'], 'I sailed to a tiny island and'],
  ['🎂', 'The best birthday ever', ['cake', 'presents', 'friends', 'balloons', 'games'], 'On my birthday'],
  ['🐶', 'If my pet could talk', ['pet', 'talk', 'funny', 'secret', 'walk'], 'If my pet could talk, it would say'],
  ['🚀', 'A trip to the Moon', ['rocket', 'Moon', 'stars', 'float', 'alien'], 'We blasted off and'],
  ['🌧️', 'A rainy day adventure', ['puddles', 'umbrella', 'wellies', 'splash', 'rainbow'], 'It was raining so'],
  ['🦸', 'I have a superpower!', ['power', 'fly', 'help', 'brave', 'cape'], 'My superpower is'],
  ['🍕', 'The silliest meal ever', ['pizza', 'jelly', 'giant', 'yummy', 'yuck'], 'For dinner we had'],
  ['🧚', 'A tiny fairy in the garden', ['fairy', 'tiny', 'flowers', 'magic', 'wish'], 'Under the leaves I found'],
  ['🌙', 'When everyone is asleep', ['night', 'toys', 'quiet', 'moon', 'tiptoe'], 'When everyone was asleep'],
  ['🦁', 'A day at the zoo', ['lion', 'monkey', 'keeper', 'feed', 'roar'], 'At the zoo I saw'],
  ['❄️', 'The day it snowed', ['snow', 'snowman', 'cold', 'sledge', 'mittens'], 'I woke up and everything was'],
  ['🧸', 'My favourite toy comes alive', ['toy', 'alive', 'play', 'dance', 'hide'], 'My toy opened its eyes and'],
  ['🏰', 'I am a king or queen for a day', ['castle', 'crown', 'rule', 'feast', 'kind'], 'If I ruled the land for a day'],
  ['🐙', 'Under the sea', ['octopus', 'shells', 'swim', 'coral', 'bubbles'], 'I dived under the waves and'],
  ['🎈', 'The runaway balloon', ['balloon', 'float', 'sky', 'chase', 'town'], 'My balloon floated away and'],
  ['🤖', 'My robot helper', ['robot', 'beep', 'tidy', 'buttons', 'clever'], 'My robot can'],
  ['🌳', 'A tree house adventure', ['tree house', 'ladder', 'friends', 'secret', 'view'], 'We climbed up to the tree house'],
  ['👻', 'The friendly ghost', ['ghost', 'giggle', 'hide', 'surprise', 'friend'], 'The ghost was not scary at all because'],
  ['💌', 'A letter to someone I love', ['love', 'thank you', 'hug', 'miss', 'special'], 'Dear'],
];

function makeWriteMonth(o, paper) {
  const name = nameOf(o.name, '') || '';
  const lk = edLook(o.look), big = o.level !== 'writer';
  const pages = [seriesCover(paper, 'PRINTPALS PLUS EDITION', name ? `${possessive(name)} Writing Month` : 'My Writing Month', big ? 'Starter: a sentence or two a day' : 'Writer: a little story a day', ['✍️', '📖', '💡', lk.corner, '🌟', '🏆'], lk.ring, lk.tint, 'writing journal', ['20 story prompts', 'A word bank each day', 'Sentence starters', 'Pictures to draw', 'Friday: my best story', 'Author certificate'])];
  pages.push(monthPlanPage(paper, lk, 'My writing month plan', 'Write a little every day. On Friday, choose your best piece and make it beautiful!', ['Dragon', 'Island', 'Birthday', 'Talking pet', 'Best story', 'Rainy day', 'Superpower', 'Silly meal', 'Fairy', 'Best story', 'Zoo', 'Snow day', 'Toy alive', 'Royal day', 'Best story', 'Balloon', 'Robot', 'Tree house', 'Ghost', 'Best story'], 'My writing reward'));
  for (let w = 1; w <= 4; w++) for (let d = 1; d <= 5; d++) {
    const i = (w - 1) * 5 + d - 1;
    if (d === 5) {
      const pg = new Page(paper, `Friday: my best story of week ${w}`, { subtitle: 'Choose your favourite piece from this week. Write it out in your neatest writing and draw a big picture!' });
      dayStrip(pg, lk, w, d);
      pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${pg.bottom - pg.y - 2}" rx="12" fill="#fff" stroke="${lk.ring}" stroke-width="2"/><rect x="${pg.left + 4}" y="${pg.y + 4}" width="${pg.width - 8}" height="${pg.bottom - pg.y - 10}" rx="9" fill="none" stroke="${lk.accent}" stroke-width="0.6" stroke-dasharray="3 2"/>`);
      pg.add(txt(pg.left + 12, pg.y + 16, 'Title:', 7, { anchor: 'start', colour: lk.ring }) + `<line x1="${pg.left + 32}" x2="${pg.right - 44}" y1="${pg.y + 16.6}" y2="${pg.y + 16.6}" stroke="#b9b3d6" stroke-width="0.6"/>`);
      weekBadge(pg, lk, w, pg.right - 22, pg.y + 20);
      const ph = (pg.bottom - pg.y) * 0.38;
      pg.add(`<rect x="${pg.left + 12}" y="${pg.y + 38}" width="${pg.width - 24}" height="${ph}" rx="8" fill="${lk.tint}" stroke="${lk.ring}" stroke-width="0.5" stroke-dasharray="3 2"/>`);
      const ly = pg.y + 38 + ph + 10, lh = big ? 13 : 10;
      for (let y = ly; y < pg.bottom - 22; y += lh) pg.add(`<line x1="${pg.left + 12}" x2="${pg.right - 12}" y1="${y}" y2="${y}" stroke="#c9c3e3" stroke-width="0.5"/>`);
      pg.add(txt(pg.right - 14, pg.bottom - 10, `By ${name || '________________'}`, 6, { anchor: 'end', colour: lk.ring }));
      pages.push(pg.svg());
      continue;
    }
    const [e, prompt, bank, start] = WM_PROMPTS[i];
    const pg = new Page(paper, prompt, { subtitle: 'Read the prompt, look at the word bank, then write! Spelling does not need to be perfect. Ideas matter most.' });
    dayStrip(pg, lk, w, d);
    pg.add(panel(pg.left, pg.y, 50, 44, lk.tint, lk.ring, 10) + emoji(e, pg.left + 25, pg.y + 22, 28));
    pg.add(panel(pg.left + 54, pg.y, pg.width - 54, 44, '#fff', '#e2ddf2', 10) + txt(pg.left + 62, pg.y + 10, 'Word bank', 6, { anchor: 'start', colour: lk.ring }));
    bank.forEach((b, k) => { const bw = (pg.width - 70) / 3, x = pg.left + 62 + (k % 3) * bw, y = pg.y + 16 + Math.floor(k / 3) * 13; pg.add(`<rect x="${x}" y="${y}" width="${bw - 4}" height="10" rx="5" fill="${TINTS[k]}" stroke="${PALETTE[k]}" stroke-width="0.5"/>` + txt(x + (bw - 4) / 2, y + 7, b, fitFont(b, 6, bw - 8, 0.55), { colour: INK })); });
    pg.y += 52;
    const dh = big ? pg.room * 0.36 : pg.room * 0.26;
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${dh}" rx="10" fill="#fff" stroke="${lk.ring}" stroke-width="0.6" stroke-dasharray="3 2"/>` + txt(pg.left + 8, pg.y + 9, 'Draw it first!', 5.4, { anchor: 'start', font: FONT, colour: SOFT }));
    pg.y += dh + 8;
    const lh = big ? 16 : 11;
    pg.add(txt(pg.left, pg.y + 6, `${start}...`, big ? 9 : 7.4, { anchor: 'start', colour: lk.ring }));
    pg.y += big ? 10 : 8;
    for (let y = pg.y + lh; y < pg.bottom - 22; y += lh) pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${y}" y2="${y}" stroke="#9a93b8" stroke-width="0.5"/>` + (big ? `<line x1="${pg.left}" x2="${pg.right}" y1="${y - lh * 0.45}" y2="${y - lh * 0.45}" stroke="#e2ddf2" stroke-width="0.4" stroke-dasharray="2 2"/>` : ''));
    howDidIDo(pg, lk);
    pages.push(pg.svg());
  }
  pages.push(seriesCert(paper, 'WRITING MONTH COMPLETE', 'Brilliant Author', name, 'for writing 16 stories and 4 best pieces this month!', 'Next: turn your favourite into a whole book!', lk.ring));
  return pages;
}

// ================================================================ Morning Work Month (teachers, Plus edition)
const MW_WORDS = { r: ['cat', 'dog', 'sun', 'hat', 'pig', 'bed', 'cup', 'map', 'hen', 'bus', 'fox', 'jam', 'red', 'log', 'nut', 'van', 'web', 'zip', 'kit', 'yes'],
  y1: ['ship', 'chip', 'moon', 'rain', 'frog', 'stop', 'tree', 'fish', 'duck', 'star', 'milk', 'jump', 'sand', 'book', 'boat', 'coat', 'shop', 'lunch', 'green', 'play'],
  y2: ['happy', 'friend', 'school', 'little', 'garden', 'water', 'sister', 'rabbit', 'jumped', 'playing', 'yellow', 'window', 'animal', 'sunny', 'rocket', 'dinner', 'kitten', 'pencil', 'ladder', 'bright'] };
const MW_DRAW = ['something red', 'your favourite animal', 'the weather today', 'your family', 'a happy face', 'a monster', 'your lunch', 'a flower', 'your shoes', 'a rocket', 'a tree', 'your best friend', 'a fish', 'a house', 'a car', 'a rainbow', 'a snowman', 'a cake', 'a butterfly', 'yourself'];

function makeMorningWork(o, paper) {
  const rand = rng(+o.seed || 1);
  const names = listOf(o.names, 40).map((n) => nameOf(n, '')).filter(Boolean);
  const level = MW_WORDS[o.level] ? o.level : 'y1', lk = edLook(o.look);
  const teacher = String(o.teacher || '').trim().slice(0, 30), cls = String(o.cls || '').trim().slice(0, 24);
  const mlev = level === 'r' ? 'counting' : level === 'y1' ? 'adding' : 'bigger';
  const pages = [seriesCover(paper, 'PRINTPALS PLUS FOR TEACHERS', cls ? `${cls}: Morning Work` : 'Morning Work Month', `${{ r: 'Reception, ages 4 to 5', y1: 'Year 1, ages 5 to 6', y2: 'Year 2, ages 6 to 7' }[level]}: 20 days`, ['🍎', '✏️', '🔢', lk.corner, '📚', '🏆'], lk.ring, lk.tint, 'class set', ['20 daily sheets', 'Word, maths, read, draw', 'Class tracker', 'Photocopy friendly', 'A certificate for each child', 'Answers for teachers'])];
  const answers = [];
  for (let i = 0; i < 20; i++) {
    const w = Math.floor(i / 5) + 1, d = (i % 5) + 1, word = MW_WORDS[level][i];
    const pg = new Page(paper, `Morning work: day ${i + 1}`, { subtitle: `${DAYS5[d - 1]}, week ${w}. Settle in, work quietly, and do your best!` });
    const bw = pg.width / 2, bh = (pg.room - 6) / 2;
    const box = (k, title, e) => { const x = pg.left + (k % 2) * bw, y = pg.y + Math.floor(k / 2) * bh, c = PALETTE[k]; pg.add(panel(x + 2, y + 2, bw - 4, bh - 4, '#fff', c, 10) + `<rect x="${x + 2}" y="${y + 2}" width="${bw - 4}" height="12" rx="6" fill="${TINTS[k]}"/>` + emoji(e, x + 10, y + 8, 7) + txt(x + 18, y + 10.4, title, 6.4, { anchor: 'start', colour: c })); return [x + 8, y + 18, bw - 16, bh - 22]; };
    // Word.
    { const [x, y, ww, hh] = box(0, 'Word of the day', '✏️'), size = Math.min(16, ww / (textWidth(word) / 100 + 0.2)); for (let r = 0; r < 3; r++) { const yy = y + r * (hh / 3); pg.add(`<line x1="${x}" x2="${x + ww}" y1="${yy + size}" y2="${yy + size}" stroke="#9a93b8" stroke-width="0.5"/>`); if (r < 2) pg.add(drawText(word, x + 2, yy, size, r ? 'ghost' : 'trace', r === 0)); } }
    // Maths.
    { const [x, y, ww, hh] = box(1, 'Maths', '🔢'), rh = hh / 4, a = []; for (let k = 0; k < 4; k++) { const [q, ans] = mathsDayProblem(mlev, i + 1, rand); pg.add(txt(x + 2, y + k * rh + rh * 0.62, q, 8, { anchor: 'start', colour: INK }) + `<rect x="${x + ww - 22}" y="${y + k * rh + 2}" width="20" height="${rh - 5}" rx="3" fill="#fff" stroke="${PALETTE[1]}" stroke-width="0.7"/>`); a.push(ans); } answers.push(a); }
    // Read.
    { const [x, y, ww, hh] = box(2, 'Read and circle', '📖'), opts = shuffle([word, MW_WORDS[level][(i + 3) % 20], MW_WORDS[level][(i + 7) % 20]], rand); pg.add(txt(x + ww / 2, y + 10, `Circle the word "${word}"`, 6, { font: FONT, weight: 700, colour: INK })); opts.forEach((t, k) => pg.add(`<ellipse cx="${x + ww / 2}" cy="${y + 22 + k * ((hh - 24) / 3)}" rx="${ww * 0.36}" ry="7" fill="#fff" stroke="#d9d4ec" stroke-width="0.6"/>` + txt(x + ww / 2, y + 25 + k * ((hh - 24) / 3), t, 9, { colour: INK }))); }
    // Draw.
    { const [x, y, ww, hh] = box(3, `Draw ${MW_DRAW[i]}`, '🎨'); pg.add(`<rect x="${x}" y="${y}" width="${ww}" height="${hh - 2}" rx="6" fill="#fff" stroke="#e2ddf2" stroke-width="0.5" stroke-dasharray="2 1.6"/>`); }
    pages.push(pg.svg());
  }
  // Class tracker.
  const roster = names.length ? names : Array(20).fill('');
  for (let s = 0; s < roster.length; s += 20) {
    const part = roster.slice(s, s + 20), pg = new Page(paper, s ? 'Class tracker (continued)' : `${cls || 'Class'} morning work tracker`, { subtitle: 'Tick each day a child finishes their morning work. Celebrate full weeks!', noName: true });
    const lw = 44, cw = (pg.width - lw) / 20, hh = 10, rh = Math.min(12, (pg.room - hh - 4) / Math.max(part.length, 12));
    for (let k = 0; k < 20; k++) pg.add(`<rect x="${pg.left + lw + k * cw}" y="${pg.y}" width="${cw}" height="${hh}" fill="${TINTS[Math.floor(k / 5)]}" stroke="#d9d4ec" stroke-width="0.3"/>` + txt(pg.left + lw + k * cw + cw / 2, pg.y + 7, `${k + 1}`, 4.4, { colour: PALETTE[Math.floor(k / 5)] }));
    part.forEach((n, j) => { const y = pg.y + hh + j * rh; pg.add(`<rect x="${pg.left}" y="${y}" width="${lw}" height="${rh}" fill="${j % 2 ? '#fff' : '#faf8ff'}" stroke="#d9d4ec" stroke-width="0.3"/>` + (n ? txt(pg.left + 3, y + rh * 0.68, n, fitFont(n, 5.4, lw - 6, 0.55), { anchor: 'start', colour: INK }) : '')); for (let k = 0; k < 20; k++) pg.add(`<rect x="${pg.left + lw + k * cw}" y="${y}" width="${cw}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.3"/>`); });
    pages.push(pg.svg());
  }
  // Answers.
  {
    const pg = new Page(paper, 'Morning work: maths answers', { subtitle: 'Answer key for teachers.', noName: true });
    const rh = pg.room / 20;
    answers.forEach((a, i) => pg.add(txt(pg.left, pg.y + i * rh + rh * 0.7, `Day ${i + 1}`, 5.6, { anchor: 'start', colour: lk.ring }) + txt(pg.left + 26, pg.y + i * rh + rh * 0.7, a.join(',   '), 6, { anchor: 'start', font: FONT, colour: INK })));
    pages.push(pg.svg());
  }
  // A certificate for each child.
  (names.length ? names : ['']).forEach((n) => pages.push(seriesCert(paper, cls ? `${cls.toUpperCase()}` : 'MORNING WORK', 'Morning Work Star', n, 'for 20 days of focus, effort and super morning work!', teacher ? `Well done from ${teacher}` : 'Well done from your teacher!', lk.ring)));
  return pages;
}

Object.assign(MAKERS, { colourmonth: makeColourMonth, puzzlemonth: makePuzzleMonth, writemonth: makeWriteMonth, morningwork: makeMorningWork });
