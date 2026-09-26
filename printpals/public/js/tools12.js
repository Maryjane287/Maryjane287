// PrintPals batch 12: home language flashcards, ready for school pack, holiday learning plan (Plus),
// milestone signs, story dice, sibling peace pack, screen time tickets and lunchbox notes.

// ================================================================ home language flashcards
const HOME_WORDS = {
  animals: ['cat', 'dog', 'lion', 'monkey', 'pig', 'zebra', 'fish', 'turtle', 'bear', 'chick', 'octopus', 'ladybird'],
  food: ['apple', 'banana', 'orange', 'strawberry', 'cake', 'cookie', 'egg', 'blueberry'],
  things: ['sun', 'star', 'rainbow', 'heart', 'hat', 'balloon', 'present', 'flower'],
};
const HOME_PIC = { flower: 'daisy', bear: 'bear' };
// Each language: English word -> word with its article where the language uses one.
const HOME_LANGS = {
  spanish: { name: 'Spanish', words: { cat: 'el gato', dog: 'el perro', lion: 'el león', monkey: 'el mono', pig: 'el cerdo', zebra: 'la cebra', fish: 'el pez', turtle: 'la tortuga', bear: 'el oso', chick: 'el pollito', octopus: 'el pulpo', ladybird: 'la mariquita',
    apple: 'la manzana', banana: 'el plátano', orange: 'la naranja', strawberry: 'la fresa', cake: 'el pastel', cookie: 'la galleta', egg: 'el huevo', blueberry: 'el arándano',
    sun: 'el sol', star: 'la estrella', rainbow: 'el arcoíris', heart: 'el corazón', hat: 'el sombrero', balloon: 'el globo', present: 'el regalo', flower: 'la flor' } },
  french: { name: 'French', words: { cat: 'le chat', dog: 'le chien', lion: 'le lion', monkey: 'le singe', pig: 'le cochon', zebra: 'le zèbre', fish: 'le poisson', turtle: 'la tortue', bear: "l'ours", chick: 'le poussin', octopus: 'la pieuvre', ladybird: 'la coccinelle',
    apple: 'la pomme', banana: 'la banane', orange: "l'orange", strawberry: 'la fraise', cake: 'le gâteau', cookie: 'le biscuit', egg: "l'œuf", blueberry: 'la myrtille',
    sun: 'le soleil', star: "l'étoile", rainbow: "l'arc-en-ciel", heart: 'le cœur', hat: 'le chapeau', balloon: 'le ballon', present: 'le cadeau', flower: 'la fleur' } },
  german: { name: 'German', words: { cat: 'die Katze', dog: 'der Hund', lion: 'der Löwe', monkey: 'der Affe', pig: 'das Schwein', zebra: 'das Zebra', fish: 'der Fisch', turtle: 'die Schildkröte', bear: 'der Bär', chick: 'das Küken', octopus: 'der Krake', ladybird: 'der Marienkäfer',
    apple: 'der Apfel', banana: 'die Banane', orange: 'die Orange', strawberry: 'die Erdbeere', cake: 'der Kuchen', cookie: 'der Keks', egg: 'das Ei', blueberry: 'die Heidelbeere',
    sun: 'die Sonne', star: 'der Stern', rainbow: 'der Regenbogen', heart: 'das Herz', hat: 'der Hut', balloon: 'der Luftballon', present: 'das Geschenk', flower: 'die Blume' } },
  italian: { name: 'Italian', words: { cat: 'il gatto', dog: 'il cane', lion: 'il leone', monkey: 'la scimmia', pig: 'il maiale', zebra: 'la zebra', fish: 'il pesce', turtle: 'la tartaruga', bear: "l'orso", chick: 'il pulcino', octopus: 'il polpo', ladybird: 'la coccinella',
    apple: 'la mela', banana: 'la banana', orange: "l'arancia", strawberry: 'la fragola', cake: 'la torta', cookie: 'il biscotto', egg: "l'uovo", blueberry: 'il mirtillo',
    sun: 'il sole', star: 'la stella', rainbow: "l'arcobaleno", heart: 'il cuore', hat: 'il cappello', balloon: 'il palloncino', present: 'il regalo', flower: 'il fiore' } },
  portuguese: { name: 'Portuguese (Brazil)', words: { cat: 'o gato', dog: 'o cachorro', lion: 'o leão', monkey: 'o macaco', pig: 'o porco', zebra: 'a zebra', fish: 'o peixe', turtle: 'a tartaruga', bear: 'o urso', chick: 'o pintinho', octopus: 'o polvo', ladybird: 'a joaninha',
    apple: 'a maçã', banana: 'a banana', orange: 'a laranja', strawberry: 'o morango', cake: 'o bolo', cookie: 'o biscoito', egg: 'o ovo', blueberry: 'o mirtilo',
    sun: 'o sol', star: 'a estrela', rainbow: 'o arco-íris', heart: 'o coração', hat: 'o chapéu', balloon: 'o balão', present: 'o presente', flower: 'a flor' } },
  swahili: { name: 'Swahili', words: { cat: 'paka', dog: 'mbwa', lion: 'simba', monkey: 'tumbili', pig: 'nguruwe', zebra: 'punda milia', fish: 'samaki', turtle: 'kobe', bear: 'dubu', chick: 'kifaranga', octopus: 'pweza',
    apple: 'tufaha', banana: 'ndizi', orange: 'chungwa', strawberry: 'stroberi', cake: 'keki', cookie: 'biskuti', egg: 'yai',
    sun: 'jua', star: 'nyota', rainbow: 'upinde wa mvua', heart: 'moyo', hat: 'kofia', balloon: 'puto', present: 'zawadi', flower: 'ua' } },
};
const ALL_PICS = ['album', 'ant', 'apple', 'balloon', 'banana', 'bear', 'blocks', 'bluebell', 'blueberry', 'bowl', 'cake', 'cat', 'chalkboard', 'chick', 'cookie', 'cupcake', 'daisy', 'dog', 'donut', 'egg', 'envelope', 'fish', 'gorilla', 'hat', 'heart', 'ladybird', 'letterbox', 'lion', 'lolly', 'medal', 'monkey', 'mushroom', 'nest', 'octopus', 'orange', 'pig', 'popper', 'present', 'rainbow', 'rose', 'star', 'strawberry', 'sun', 'sunflower', 'tulip', 'turtle', 'zebra'];
const picFor = (w) => { const k = HOME_PIC[w] || w; return ALL_PICS.includes(k) ? ART(k) : ''; };

function makeHomeLang(o, paper) {
  const own = o.language === 'own';
  let pairs = [], langName;
  if (own) {
    langName = String(o.langname || '').trim().slice(0, 24) || 'Our language';
    pairs = listOf(o.custom, 24).map((l) => l.split(/\s*[=:]\s*/)).filter((p) => p.length >= 2 && p[0] && p[1]).map(([en, tr]) => [en.toLowerCase().slice(0, 20), tr.slice(0, 28)]);
    if (!pairs.length) pairs = HOME_WORDS.animals.slice(0, 8).map((w) => [w, '']);
  } else {
    const L = HOME_LANGS[o.language] || HOME_LANGS.spanish;
    langName = L.name;
    pairs = (HOME_WORDS[o.set] || HOME_WORDS.animals).filter((w) => L.words[w]).map((w) => [w, L.words[w]]);
  }
  const pages = [];
  if (o.layout === 'mat') {
    const pg = new Page(paper, `My words in ${langName}`, { subtitle: 'Say each word in both languages. Copy the word on the line.' });
    const rows = Math.min(pairs.length, 10), rh = (pg.room - 2) / rows;
    pairs.slice(0, rows).forEach(([en, tr], i) => {
      const y = pg.y + i * rh, c = i % PALETTE.length, src = picFor(en);
      pg.add(panel(pg.left, y + 1, pg.width, rh - 2, TINTS[c], '#e2ddf2', 6));
      if (src) pg.add(pic(src, pg.left + rh / 2 + 2, y + rh / 2, rh * 0.78));
      pg.add(txt(pg.left + rh + 8, y + rh * 0.42, tr || '________', fitFont(tr || '________', 7, 62, 0.52), { anchor: 'start', colour: PALETTE[c] }));
      pg.add(txt(pg.left + rh + 8, y + rh * 0.42 + 6, en, 4.2, { anchor: 'start', font: FONT, colour: SOFT }));
      pg.add(`<line x1="${pg.left + rh + 80}" x2="${pg.right - 6}" y1="${y + rh * 0.62}" y2="${y + rh * 0.62}" stroke="#b9b3d6" stroke-width="0.45"/>`);
    });
    pages.push(pg.svg());
    return pages;
  }
  // Flashcards: eight on a page, cut along the dashed lines.
  for (let p0 = 0; p0 < pairs.length; p0 += 8) {
    const pg = new Page(paper, '', { bare: true });
    const cw = pg.width / 2, ch = (pg.bottom - pg.m) / 4;
    pairs.slice(p0, p0 + 8).forEach(([en, tr], k) => {
      const i = p0 + k, x = pg.left + (k % 2) * cw, y = pg.m + Math.floor(k / 2) * ch, c = i % PALETTE.length, src = picFor(en);
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="6" fill="${TINTS[c]}" stroke="#b9b3d6" stroke-width="0.4" stroke-dasharray="2 1.5"/>`);
      const size = ch * 0.5;
      if (src) pg.add(pic(src, x + cw / 2, y + 6 + size / 2, size));
      else pg.add(txt(x + cw / 2, y + 6 + size / 2 + 6, en, fitFont(en, 16, cw - 20), { colour: PALETTE[c] }));
      const big = tr || '';
      if (big) pg.add(txt(x + cw / 2, y + ch - 16, big, fitFont(big, 10, cw - 12, 0.55), { colour: PALETTE[c] }));
      else pg.add(`<line x1="${x + 14}" x2="${x + cw - 14}" y1="${y + ch - 16}" y2="${y + ch - 16}" stroke="#9a93b8" stroke-width="0.45"/>`);
      pg.add(txt(x + cw / 2, y + ch - 7, en, 4.6, { font: FONT, colour: SOFT }));
    });
    pg.add(txt(pg.w / 2, pg.bottom + 2, `${langName} and English flashcards. Cut along the dashed lines.`, 3.2, { font: FONT, colour: '#b8b3cc' }));
    pg.footer = () => {};
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ countdown chain (shared)
function chainPage(paper, title, sub, n, endArt, bottomLine) {
  const pg = new Page(paper, title, { subtitle: sub });
  const cols = n <= 10 ? 5 : n <= 21 ? 6 : 7, rows = Math.ceil((n + 1) / cols);
  const cell = Math.min(pg.width / cols, (pg.room - 30) / rows), gx = pg.left + (pg.width - cell * cols) / 2;
  const pos = (i) => { const r = Math.floor(i / cols), c = r % 2 ? cols - 1 - (i % cols) : i % cols; return [gx + c * cell + cell / 2, pg.y + r * cell + cell / 2]; };
  for (let i = 0; i < n; i++) { const [a, b] = pos(i), [c2, d] = pos(i + 1); pg.add(`<line x1="${a}" y1="${b}" x2="${c2}" y2="${d}" stroke="#e2ddf2" stroke-width="2.4" stroke-linecap="round"/>`); }
  for (let i = 0; i < n; i++) { const [x, y] = pos(i); pg.add(`<circle cx="${x}" cy="${y}" r="${cell * 0.36}" fill="#fff" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="1"/>` + txt(x, y + cell * 0.12, n - i, cell * 0.32, { colour: PALETTE[i % PALETTE.length] })); }
  const [hx, hy] = pos(n);
  pg.add(pic(ART(endArt), hx, hy, cell * 0.9));
  const by = pg.y + rows * cell + 6;
  if (bottomLine) pg.add(txt(pg.w / 2, by + 6, bottomLine, 5, { font: FONT }) + `<line x1="${pg.left + 20}" x2="${pg.right - 20}" y1="${by + 18}" y2="${by + 18}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  return pg.svg();
}

function checklistPage(paper, title, sub, items, name) {
  const pg = new Page(paper, title, { subtitle: sub, noName: !!name });
  const rh = (pg.room - 2) / items.length;
  items.forEach(([e, t], k) => {
    const y = pg.y + k * rh, c = PALETTE[k % PALETTE.length];
    pg.add(panel(pg.left, y + 1, pg.width, rh - 2, TINTS[k % TINTS.length], c, 6));
    pg.add(emoji(e, pg.left + rh / 2 + 3, y + rh / 2, Math.min(12, rh * 0.55)));
    pg.add(txt(pg.left + rh + 8, y + rh / 2 + 2, t, fitFont(t, 5.6, pg.width - rh - 30, 0.5), { anchor: 'start', font: FONT, colour: INK }));
    pg.add(`<path d="${starPath(pg.right - 11, y + rh / 2, Math.min(7.5, rh * 0.32), 0.46)}" fill="#fff" stroke="${c}" stroke-width="0.9" stroke-linejoin="round"/>`);
  });
  return pg.svg();
}

// ================================================================ ready for school pack
const SCHOOL_WORDS = { school: 'school', nursery: 'nursery', preschool: 'preschool', kindergarten: 'kindergarten', reception: 'Reception' };

function makeSchoolReady(o, paper) {
  const name = nameOf(o.name, '');
  const where = SCHOOL_WORDS[o.place] || 'school';
  const who = name || 'I';
  const pages = [];
  pages.push(packCover(paper, name ? `${name} is ready for ${where}!` : `Ready for ${where}!`, 'A little pack for a big step', 'owl', ['Do a page or two each day in the weeks before the big day.', 'Made at printpals.web.app'], '#e8f8f4'));
  pages.push(checklistPage(paper, 'I can do it myself!', `Practise each one at home. Colour a star when ${name || 'you'} can do it.`, [
    ['🥪', 'Open my lunchbox and my drink'], ['👟', 'Put on my shoes'], ['🧥', 'Hang up my coat and zip it up'], ['🚽', 'Go to the toilet and wash my hands'],
    ['🙋', 'Put my hand up and ask for help'], ['📛', 'Say my name and my teacher\'s name'], ['🧸', 'Tidy up my things'], ['🤝', 'Share and take turns'],
    ['✏️', 'Hold a pencil and write my name'], ['🎒', 'Carry my own bag'],
  ], name));
  // All about me, for the teacher
  const pg = new Page(paper, name ? `All about ${name}` : 'All about me', { subtitle: `Fill this in together and give it to the ${where === 'Reception' ? 'teacher' : 'teacher'} on the first day.`, noName: true });
  pg.add(`<rect x="${pg.left}" y="${pg.y}" width="62" height="72" rx="6" fill="#fff" stroke="${INK}" stroke-width="0.6" stroke-dasharray="3 2"/>` + txt(pg.left + 31, pg.y + 38, 'Photo or drawing', 4, { font: FONT, colour: SOFT }));
  let y = pg.y + 6;
  const line = (label, x, w) => { pg.add(txt(x, y, label, 4.4, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${x}" x2="${x + w}" y1="${y + 8}" y2="${y + 8}" stroke="#b9b3d6" stroke-width="0.45"/>`); y += 16; };
  ['My name is', 'I like to be called', 'I live with', 'My favourite toy is'].forEach((l) => line(l, pg.left + 70, pg.width - 70));
  y = pg.y + 82;
  ['My favourite food is', 'I am really good at', 'I feel happy when', 'I might need a little help with', 'When I feel sad or worried, it helps if you', 'Something special about me'].forEach((l) => line(l, pg.left, pg.width));
  pg.add(txt(pg.left, y + 2, 'A message from my grown-ups', 4.4, { anchor: 'start', font: FONT, colour: SOFT }));
  pg.add(`<rect x="${pg.left}" y="${y + 5}" width="${pg.width}" height="${Math.max(20, pg.bottom - y - 8)}" rx="6" fill="#fff" stroke="#b9b3d6" stroke-width="0.5"/>`);
  pages.push(pg.svg());
  // School morning routine
  const rt = packRun('routine', { routine: 'custom', layout: 'cards', name, steps: ['⏰ Wake up', '👕 Get dressed', '🥣 Eat breakfast', '🪥 Brush my teeth', '🎒 Get my bag', '👟 Shoes and coat on', '🤗 Big hug goodbye'].join('\n') }, paper, +o.seed || 1);
  if (rt.sheets.length) pages.push(rt.sheets[0]);
  pages.push(checklistPage(paper, 'My bag checklist', 'Pack your bag together the night before. Tick each one as it goes in!', [
    ['💧', 'Water bottle'], ['🥪', 'Lunch or snack'], ['📚', 'Book bag and reading book'], ['🧥', 'Coat or jumper'], ['👕', 'Spare clothes'], ['🧢', 'Sun hat or warm hat'], ['📝', 'Any letters for the teacher'],
  ], name));
  // Feelings about starting
  const fp = new Page(paper, `How I feel about ${where}`, { subtitle: 'Colour the faces that show how you feel. It is fine to feel more than one thing!' });
  const moods = ['happy', 'proud', 'worried', 'scared', 'silly', 'calm'], cw = fp.width / 3;
  moods.forEach((m, i) => { const cx = fp.left + cw * (i % 3 + 0.5), cy = fp.y + 22 + Math.floor(i / 3) * 44; fp.add(face(cx, cy, 15, m, false) + txt(cx, cy + 23, m, 5, { font: FONT })); });
  let fy = fp.y + 110;
  [`I am excited about`, `I am a little bit worried about`, `A grown-up can help me by`].forEach((l, k) => {
    fp.add(panel(fp.left, fy, fp.width, 34, TINTS[k * 2], PALETTE[k * 2], 6) + txt(fp.left + 6, fy + 9, l, 5.2, { anchor: 'start', colour: PALETTE[k * 2] }));
    for (let q = 1; q <= 2; q++) fp.add(`<line x1="${fp.left + 6}" x2="${fp.right - 6}" y1="${fy + 10 + q * 10}" y2="${fy + 10 + q * 10}" stroke="#c9c3e3" stroke-width="0.4"/>`);
    fy += 40;
  });
  pages.push(fp.svg());
  pages.push(chainPage(paper, `Days until ${where} starts!`, 'Colour one circle every night before bed. When you reach the star, it is your big day!', Math.max(5, Math.min(30, +o.days || 14)), 'star', `On my first day, I am most looking forward to`));
  const tr = packRun('names', { names: name || 'My name', case: 'title', size: 'large' }, paper, +o.seed || 1);
  if (name && tr.sheets.length) pages.push(tr.sheets[0]);
  pages.push(...makeSigns({ kind: 'firstday', name, grade: SCHOOL_WORDS[o.place] ? where : '', seed: o.seed }, paper));
  return pages;
}

// ================================================================ holiday learning plan (Plus)
const BUCKET = ['Have a picnic', 'Build a den', 'Go on a nature walk', 'Make a paper boat', 'Bake something yummy', 'Visit the library', 'Have a teddy bears party', 'Paint a big picture',
  'Play a board game', 'Look at the stars', 'Make a card for someone', 'Plant a seed', 'Have a pyjama day', 'Do a puzzle', 'Put on a puppet show', 'Make a fort from cushions',
  'Go on a bike or scooter ride', 'Have a water play day', 'Learn a new song', 'Make a scrapbook of the holiday', 'Play hide and seek', 'Do a treasure hunt', 'Make a paper crown', 'Watch the sunset'];

function makeHolidayPlan(o, paper) {
  const theme = PACK_THEMES[o.theme] || PACK_THEMES.animals;
  const child = packChildren(o)[0];
  const g = ageGroup(child.age);
  const weeks = [2, 4, 6].includes(+o.weeks) ? +o.weeks : 4;
  const opt = { ...o, days: 3, per: +o.per || 1 };
  const who = child.name ? possessive(child.name) : 'My';
  const pages = [packCover(paper, `${who} holiday learning plan`, `${theme.label}, ${ageLabel(g)}`, theme.line[1 % theme.line.length], [`${weeks} weeks of little learning moments, 3 days a week.`, 'Made at printpals.web.app'], '#fff6e0')];
  // Bucket list
  const bl = new Page(paper, 'Our holiday bucket list', { subtitle: 'Tick off the fun things you do together. Add your own ideas at the bottom!', noName: true });
  const items = shuffle(BUCKET, rng(+o.seed || 1)).slice(0, 18), cw = bl.width / 2, rh = (bl.room - 30) / 9;
  items.forEach((t, i) => { const x = bl.left + (i % 2) * cw, y = bl.y + Math.floor(i / 2) * rh; bl.add(`<rect x="${x + 2}" y="${y + rh / 2 - 3.5}" width="7" height="7" rx="1.5" fill="#fff" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="0.8"/>` + txt(x + 13, y + rh / 2 + 2, t, fitFont(t, 5, cw - 18, 0.5), { anchor: 'start', font: FONT })); });
  for (let l = 0; l < 2; l++) bl.add(`<rect x="${bl.left + 2}" y="${bl.bottom - 22 + l * 11}" width="7" height="7" rx="1.5" fill="#fff" stroke="${SOFT}" stroke-width="0.8"/><line x1="${bl.left + 13}" x2="${bl.right - 4}" y1="${bl.bottom - 15 + l * 11}" y2="${bl.bottom - 15 + l * 11}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  pages.push(bl.svg());
  const all = [];
  for (let w = 1; w <= weeks; w++) {
    const lv = w > weeks / 2 ? { words: Math.min(6, g + (w === weeks ? 1 : 0)), numbers: g, fun: g } : { words: g, numbers: g, fun: g };
    all.push(packWeek(child, 0, theme, opt, paper, w, lv));
  }
  const labels = weeks === 2 ? ['Warm up', 'Keep it fresh'] : weeks === 4 ? ['Warm up', 'Keep going', 'Keep it fresh', 'Ready for school'] : ['Warm up', 'Keep going', 'Halfway hooray', 'Keep it fresh', 'Almost there', 'Ready for school'];
  pages.push(monthOverview(paper, child.name, theme, g, all, labels).replace(/learning month/g, 'holiday plan').replace('Four weeks that get a little harder each week.', `${weeks} weeks, 3 days a week.`).replace('When I finish my month, we will celebrate by', 'When I finish my holiday plan, we will celebrate by'));
  all.forEach((w) => pages.push(...w.sheets));
  const log = packRun('readinglog', { name: child.name, log: true, shelf: false, challenge: false }, paper, +o.seed || 1);
  if (log.sheets.length) pages.push(log.sheets[0]);
  if (o.certificate !== false) pages.push(packCertificate(paper, child.name, 'You finished your holiday learning plan! What a brilliant holiday.'));
  if (o.key !== false) all.forEach((w) => pages.push(...w.keys));
  return pages;
}

// ================================================================ milestone signs
const SIGNS = {
  firstday: { top: 'My first day of', fill: (g) => g || 'school', rows: ['I am _ years old', 'My teacher is', 'My favourite colour is', 'My favourite food is', 'When I grow up I want to be'], art: 'star' },
  lastday: { top: 'My last day of', fill: (g) => g || 'school', rows: ['This year I learned', 'My favourite memory is', 'My best friend is', 'Next year I will be in', 'When I grow up I want to be'], art: 'medal' },
  hundred: { top: 'I am 100 days', fill: () => 'smarter!', rows: ['I can now', 'My favourite thing to learn is', 'My teacher is', 'I am _ years old'], art: 'star' },
  birthday: { top: 'Today I am', fill: (g, age) => (age ? `${age} years old!` : 'one year older!'), rows: ['My favourite toy is', 'My favourite food is', 'My best friend is', 'This year I want to learn'], art: 'cake' },
  tooth: { top: 'I lost my', fill: () => 'first tooth!', rows: ['I am _ years old', 'It fell out when I was', 'The tooth fairy brought me'], art: 'star' },
  sibling: { top: 'I am a big', fill: (g) => g || 'sibling!', rows: ['My baby is called', 'I can help by', 'I love my baby because'], art: 'heart' },
};

function makeSigns(o, paper) {
  const sg = SIGNS[o.kind] || SIGNS.firstday;
  const name = nameOf(o.name, '');
  const grade = String(o.grade || '').trim().slice(0, 24);
  const age = String(o.age || '').trim().slice(0, 3);
  const vals = { 'My teacher is': o.teacher, 'My favourite colour is': o.colour, 'My favourite food is': o.food, 'When I grow up I want to be': o.grow };
  const pg = new Page(paper, '', { bare: true, tint: '#fffdf8' });
  const cx = pg.w / 2;
  pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="12" fill="#fff" stroke="#ff7eb6" stroke-width="1.6"/>`);
  for (let i = 0; i < 18; i++) { const x = pg.left + 6 + (i % 9) * ((pg.width - 12) / 8), y = i < 9 ? pg.m + 5 : pg.bottom - 8; pg.add(`<path d="${starPath(x, y, 2.6, 0.45)}" fill="${PALETTE[i % PALETTE.length]}"/>`); }
  let y = pg.m + 30;
  pg.add(txt(cx, y, sg.top, 12, { colour: '#8a3fd1' }));
  y += 26;
  bubbleText(pg, sg.fill(grade, age), cx, y, pg.width - 30, 24);
  y += 18;
  pg.add(pic(ART(sg.art), cx, y + 26, 52));
  y += 62;
  if (name) { bubbleText(pg, name, cx, y + 14, pg.width - 40, 20); y += 22; }
  const dateTxt = String(o.date || '').trim() || new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  pg.add(txt(cx, y + 6, dateTxt, 6, { colour: SOFT, font: FONT }));
  y += 14;
  const rh = Math.min(20, (pg.bottom - 14 - y) / sg.rows.length);
  sg.rows.forEach((r, i) => {
    const val = String(vals[r] || '').trim().slice(0, 30);
    const label = r.replace('_', age || '___');
    pg.add(panel(pg.left + 10, y + i * rh + 1, pg.width - 20, rh - 3, TINTS[i % TINTS.length], PALETTE[i % PALETTE.length], 6));
    pg.add(txt(pg.left + 16, y + i * rh + rh / 2 + 1.5, label, 5, { anchor: 'start', font: FONT, colour: INK }));
    if (val) pg.add(txt(pg.right - 16, y + i * rh + rh / 2 + 1.5, val, fitFont(val, 6.4, pg.width * 0.4), { anchor: 'end', colour: PALETTE[i % PALETTE.length] }));
  });
  pg.footer = () => {};
  return [pg.svg()];
}

// ================================================================ story dice
const DICE_SETS = {
  adventure: [
    ['Who?', ['lion', 'monkey', 'pig', 'cat', 'dog', 'octopus']],
    ['Where?', ['🏰', '🌳', '🏖️', '🚀', '🏠', '🌋']],
    ['What?', ['present', 'balloon', 'hat', 'cake', 'star', 'egg']],
  ],
  feelings: [
    ['Who?', ['zebra', 'turtle', 'bear', 'chick', 'gorilla', 'ladybird']],
    ['Feels?', ['😀', '😢', '😠', '😨', '😲', '🥱']],
    ['Because?', ['present', 'rainbow', 'popper', 'cookie', 'heart', 'mushroom']],
  ],
};

function dieNet(pg, x, y, s, faces, colour, label) {
  const layout = [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]];
  layout.forEach(([c, r], i) => {
    const fx = x + c * s, fy = y + r * s, f = faces[i];
    pg.add(`<rect x="${fx}" y="${fy}" width="${s}" height="${s}" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`);
    pg.add(ALL_PICS.includes(f) ? pic(ART(f), fx + s / 2, fy + s / 2, s * 0.78) : emoji(f, fx + s / 2, fy + s / 2, s * 0.6));
  });
  const tab = (tx, ty, w, h) => pg.add(`<rect x="${tx}" y="${ty}" width="${w}" height="${h}" fill="#f4f1fb" stroke="${INK}" stroke-width="0.4" stroke-dasharray="1.8 1.2"/>`);
  tab(x + s, y - 7, s, 7); tab(x - 7, y + s, 7, s); tab(x + 4 * s, y + s, 7, s); tab(x + s, y + 3 * s, s, 7); tab(x, y + s - 7, s, 7); tab(x + 2 * s, y + s - 7, s, 7);
  pg.add(txt(x + 3 * s, y + s * 0.55, label, 7, { colour }));
}

function makeStoryDice(o, paper) {
  const set = DICE_SETS[o.set] || DICE_SETS.adventure;
  const pages = [];
  for (let d = 0; d < 3; d += 2) {
    const pg = new Page(paper, d ? 'Story dice (page 2)' : 'Story dice', { subtitle: 'Cut out each dice, fold on the lines and glue the grey tabs inside. Roll all three and tell a story!', noName: true });
    const s = Math.min(34, (pg.room - 46) / 6);
    set.slice(d, d + 2).forEach(([label, faces], k) => dieNet(pg, pg.left + 12, pg.y + 12 + k * (s * 3 + 24), s, faces, PALETTE[(d + k) * 2 % PALETTE.length], label));
    pages.push(pg.svg());
  }
  if (o.mat !== false) {
    const pg = new Page(paper, 'My story', { subtitle: 'Roll the dice. Draw and write what happens at the start, in the middle and at the end.' });
    const bh = (pg.room - 6) / 3;
    ['Once upon a time...', 'Then...', 'In the end...'].forEach((t, i) => {
      const y = pg.y + i * bh;
      pg.add(panel(pg.left, y + 1, pg.width, bh - 4, TINTS[i * 2], PALETTE[i * 2], 7) + txt(pg.left + 6, y + 10, t, 6, { anchor: 'start', colour: PALETTE[i * 2] }));
      pg.add(`<rect x="${pg.left + 6}" y="${y + 14}" width="${pg.width * 0.42}" height="${bh - 22}" rx="4" fill="#fff" stroke="#d9d4ec" stroke-width="0.5"/>`);
      for (let l = 1; l <= 4; l++) pg.add(`<line x1="${pg.left + pg.width * 0.42 + 12}" x2="${pg.right - 6}" y1="${y + 14 + l * (bh - 22) / 4.2}" y2="${y + 14 + l * (bh - 22) / 4.2}" stroke="#c9c3e3" stroke-width="0.4"/>`);
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ sibling peace pack
const KIND_COUPONS = ['I will help you tidy up', 'You choose the game today', 'One big hug, any time', 'You can go first', 'I will share my snack', 'I will read you a story', 'You pick the film', 'I will play what you want for 10 minutes'];

function makeSiblings(o, paper) {
  const kids = listOf(o.names, 4).map((n) => nameOf(n, '')).filter(Boolean);
  const names = kids.length >= 2 ? kids : ['Mia', 'Leo'];
  const want = (k) => o[k] !== false;
  const pages = [];
  if (want('turns')) {
    const pg = new Page(paper, 'Whose turn is it?', { subtitle: 'No more arguing! Take turns each day. Write or colour the name of whose turn it is.', noName: true });
    const jobs = listOf(o.jobs, 6).length ? listOf(o.jobs, 6) : ['Goes first', 'Chooses the film', 'Sits in the front', 'Picks the story', 'Presses the lift button'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const lw = 50, cw = (pg.width - lw) / 7, rh = Math.min(36, (pg.room - 20) / jobs.length);
    days.forEach((d, i) => pg.add(txt(pg.left + lw + cw * (i + 0.5), pg.y + 6, d, 4.4, { colour: PALETTE[i] })));
    jobs.forEach((j, r) => {
      const y = pg.y + 10 + r * rh;
      pg.add(panel(pg.left, y, pg.width, rh - 2, TINTS[r % TINTS.length], '#e2ddf2', 5) + txt(pg.left + 4, y + rh / 2 + 1, j, fitFont(j, 4.6, lw - 6, 0.5), { anchor: 'start', font: FONT }));
      days.forEach((d, i) => {
        const n = names[(i + r) % names.length];
        pg.add(`<rect x="${pg.left + lw + cw * i + 1}" y="${y + 2}" width="${cw - 2}" height="${rh - 6}" rx="3" fill="#fff"/>` + txt(pg.left + lw + cw * (i + 0.5), y + rh / 2 + 1, n, fitFont(n, 4.2, cw - 4, 0.52), { colour: PALETTE[names.indexOf(n) % PALETTE.length] }));
      });
    });
    pages.push(pg.svg());
  }
  if (want('spinner')) {
    const pg = new Page(paper, 'Turn spinner', { subtitle: 'Put a pencil through a paperclip on the middle dot and flick the paperclip. Where it stops, that person goes first!', noName: true });
    const cx = pg.w / 2, cy = pg.y + 80, R = 72, n = names.length;
    names.forEach((nm, i) => {
      const a0 = (i / n) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2, mid = (a0 + a1) / 2;
      const d = `M${cx} ${cy} L${cx + Math.cos(a0) * R} ${cy + Math.sin(a0) * R} A${R} ${R} 0 ${n <= 1 ? 1 : 0} 1 ${cx + Math.cos(a1) * R} ${cy + Math.sin(a1) * R} Z`;
      pg.add(`<path d="${d}" fill="${TINTS[i % TINTS.length]}" stroke="${INK}" stroke-width="0.8"/>`);
      pg.add(txt(cx + Math.cos(mid) * R * 0.6, cy + Math.sin(mid) * R * 0.6 + 3, nm, fitFont(nm, 10, R * 0.8), { colour: PALETTE[i % PALETTE.length] }));
    });
    pg.add(`<circle cx="${cx}" cy="${cy}" r="3" fill="${INK}"/>`);
    const ry = cy + R + 16;
    pg.add(txt(cx, ry, 'Good sports cheer for each other!', 7, { colour: '#8a3fd1' }));
    pg.add(pic(ART('star'), cx - 70, ry - 2, 14) + pic(ART('star'), cx + 70, ry - 2, 14));
    pages.push(pg.svg());
  }
  if (want('rules')) {
    const pg = new Page(paper, 'We are a team!', { subtitle: 'Read the team rules together, then everyone signs their name.', noName: true });
    const rules = ['We use kind words, even when we are cross', 'We take turns and share', 'We ask before we borrow', 'We stop when someone says stop', 'We say sorry and try again', 'We cheer each other on'];
    const rh = (pg.room - 60) / rules.length;
    rules.forEach((r, i) => { const y = pg.y + i * rh; pg.add(panel(pg.left, y + 1, pg.width, rh - 3, TINTS[i], PALETTE[i], 6) + pic(ART('heart'), pg.left + 9, y + rh / 2, 9) + txt(pg.left + 18, y + rh / 2 + 2, r, fitFont(r, 5.8, pg.width - 24, 0.5), { anchor: 'start', font: FONT })); });
    const sy = pg.bottom - 42, sw = pg.width / names.length;
    names.forEach((nm, i) => pg.add(txt(pg.left + sw * (i + 0.5), sy + 10, nm, 6, { colour: PALETTE[i % PALETTE.length] }) + `<line x1="${pg.left + sw * i + 8}" x2="${pg.left + sw * (i + 1) - 8}" y1="${sy + 30}" y2="${sy + 30}" stroke="#b9b3d6" stroke-width="0.45"/>` + txt(pg.left + sw * (i + 0.5), sy + 36, 'signed', 3.6, { font: FONT, colour: SOFT })));
    pages.push(pg.svg());
  }
  if (want('coupons')) {
    const pg = new Page(paper, 'Kindness coupons', { subtitle: 'Cut them out and give one to your brother or sister. They can use it whenever they like!', noName: true });
    const cw = pg.width / 2, ch = (pg.room - 2) / 4;
    KIND_COUPONS.forEach((t, i) => {
      const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * ch;
      pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="8" fill="${TINTS[i % TINTS.length]}" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="0.9" stroke-dasharray="3 1.8"/>`);
      pg.add(txt(x + cw / 2, y + 12, 'Kindness coupon', 4.4, { colour: PALETTE[i % PALETTE.length] }));
      textLines(pg, wrap(t, 22), x + cw / 2, y + ch / 2, 6, { anchor: 'middle', weight: 800, font: TITLE_FONT });
      pg.add(txt(x + 8, y + ch - 8, 'From', 3.8, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${x + 18}" x2="${x + cw - 10}" y1="${y + ch - 8}" y2="${y + ch - 8}" stroke="#b9b3d6" stroke-width="0.4"/>`);
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ screen time tickets
const EARN_IDEAS = ['Read a book: 1 ticket', 'Play outside for 30 minutes: 1 ticket', 'Help with a job at home: 1 ticket', 'Finish homework: 1 ticket', 'Tidy my room: 1 ticket', 'Do something kind: 1 ticket', 'Practise an instrument: 1 ticket'];

function makeScreenTime(o, paper) {
  const name = nameOf(o.name, '');
  const mins = [15, 30].includes(+o.minutes) ? +o.minutes : 15;
  const pages = [];
  const pg = new Page(paper, name ? `${possessive(name)} screen time tickets` : 'Screen time tickets', { subtitle: `Earn a ticket, then swap it for ${mins} minutes of screen time. Cut them out and keep them in a jar!`, noName: true });
  const cw = pg.width / 3, ch = (pg.room - 2) / 5;
  for (let i = 0; i < 15; i++) {
    const x = pg.left + (i % 3) * cw, y = pg.y + Math.floor(i / 3) * ch, c = PALETTE[i % PALETTE.length];
    const d = `M${x + 3} ${y + 3} H${x + cw - 3} V${y + ch / 2 - 4} A4 4 0 0 0 ${x + cw - 3} ${y + ch / 2 + 4} V${y + ch - 3} H${x + 3} V${y + ch / 2 + 4} A4 4 0 0 0 ${x + 3} ${y + ch / 2 - 4} Z`;
    pg.add(`<path d="${d}" fill="${TINTS[i % TINTS.length]}" stroke="${c}" stroke-width="0.9" stroke-dasharray="2.5 1.5"/>`);
    pg.add(emoji('📺', x + 14, y + ch / 2, 11));
    pg.add(txt(x + cw / 2 + 7, y + ch / 2 - 1, `${mins} minutes`, 6.2, { colour: c }));
    pg.add(txt(x + cw / 2 + 7, y + ch / 2 + 6, name || 'screen time', fitFont(name || 'screen time', 4.4, cw - 30), { font: FONT, colour: SOFT }));
  }
  pages.push(pg.svg());
  if (o.chart !== false) {
    const p2 = new Page(paper, 'How to earn a ticket', { subtitle: 'Agree these together, then stick this chart on the fridge.', noName: true });
    const earn = listOf(o.earn, 10).length ? listOf(o.earn, 10) : EARN_IDEAS;
    const rh = Math.min(22, (p2.room - 70) / earn.length);
    earn.forEach((t, i) => { const y = p2.y + i * rh; p2.add(panel(p2.left, y + 1, p2.width, rh - 3, TINTS[i % TINTS.length], PALETTE[i % PALETTE.length], 6) + pic(ART('star'), p2.left + 9, y + rh / 2, 9) + txt(p2.left + 18, y + rh / 2 + 2, t, fitFont(t, 5.6, p2.width - 24, 0.5), { anchor: 'start', font: FONT })); });
    const ry = p2.y + earn.length * rh + 8;
    p2.add(panel(p2.left, ry, p2.width, 52, '#fff6e0', '#ffb938', 8) + txt(p2.left + 8, ry + 11, 'Our screen time rules', 6, { anchor: 'start', colour: '#e08a00' }));
    ['Tickets can be used after jobs and homework are done.', `One ticket = ${mins} minutes.`, 'No screens at meal times or an hour before bed.'].forEach((t, i) => p2.add(txt(p2.left + 8, ry + 22 + i * 9, `• ${t}`, 4.8, { anchor: 'start', font: FONT })));
    pages.push(p2.svg());
  }
  return pages;
}

// ================================================================ lunchbox notes
const LOVE_NOTES = ['I am so proud of you!', 'You make my heart smile.', 'Have the best day, {name}!', 'You are brave and kind.', 'I can\'t wait to hear about your day!', 'Try your best. That is all that matters.',
  'Big hugs are waiting for you at home!', 'You are loved more than all the stars.', 'Eat up and grow strong!', 'You can do hard things.', 'Thinking of you right now!', 'You are one of a kind.'];
const JOKES = [['Why did the banana go to the doctor?', 'It was not peeling well!'], ['What do you call a sleeping dinosaur?', 'A dino-snore!'], ['Why are fish so clever?', 'They live in schools!'],
  ['What do you call a bear with no teeth?', 'A gummy bear!'], ['Why can\'t a bicycle stand up by itself?', 'It is two tired!'], ['What did one plate say to the other?', 'Lunch is on me!'],
  ['Why did the cookie go to the doctor?', 'It felt crummy!'], ['What do you call a dog who does magic?', 'A labracadabrador!'], ['Why did the teddy bear say no to pudding?', 'It was already stuffed!'],
  ['What has hands but cannot clap?', 'A clock!'], ['What do you call a fish with no eyes?', 'A fsh!'], ['Why did the student eat their homework?', 'The teacher said it was a piece of cake!']];

function makeLunchNotes(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '');
  const from = String(o.from || '').trim().slice(0, 20);
  const colourIn = o.style === 'colour';
  const kind = o.kind || 'mix';
  const love = shuffle(LOVE_NOTES, rand), jokes = shuffle(JOKES, rand);
  const pg = new Page(paper, '', { bare: true });
  const cw = pg.width / 2, ch = (pg.bottom - pg.m) / 5;
  for (let i = 0; i < 10; i++) {
    const x = pg.left + (i % 2) * cw, y = pg.m + Math.floor(i / 2) * ch, c = PALETTE[i % PALETTE.length];
    pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="8" fill="${colourIn ? '#fff' : TINTS[i % TINTS.length]}" stroke="${colourIn ? INK : c}" stroke-width="0.8" stroke-dasharray="3 1.8"/>`);
    const art = ['heart', 'star', 'sun', 'rainbow', 'present', 'cupcake', 'balloon', 'strawberry', 'ladybird', 'chick'][i];
    if (colourIn) pg.add(`<g transform="translate(${x + 6} ${y + ch / 2 - 11}) scale(0.11)">${colouringArt(['bee', 'owl', 'cat', 'fish', 'snail', 'butterfly', 'bunny', 'ladybird', 'turtle', 'frog'][i])}</g>`);
    else pg.add(pic(ART(art), x + 16, y + ch / 2, 20));
    const tx = x + 32, tw = cw - 40;
    const isJoke = kind === 'jokes' || (kind === 'mix' && i % 2 === 1);
    if (kind === 'blank') {
      pg.add(txt(tx, y + 12, name ? `Dear ${name},` : 'Dear', 5, { anchor: 'start', colour: colourIn ? INK : c }));
      for (let l = 1; l <= 3; l++) pg.add(`<line x1="${tx}" x2="${tx + tw}" y1="${y + 12 + l * 8}" y2="${y + 12 + l * 8}" stroke="#c9c3e3" stroke-width="0.4"/>`);
    } else if (isJoke) {
      const [q, a] = jokes[Math.floor(i / 2) % jokes.length];
      const ql = wrap(q, 26);
      textLines(pg, ql, tx, y + 11, 4.4, { weight: 800 });
      pg.add(`<g transform="rotate(180 ${tx + tw / 2} ${y + ch - 10})">${txt(tx + tw / 2, y + ch - 10, a, fitFont(a, 4.4, tw, 0.5), { colour: colourIn ? INK : c })}</g>`);
      pg.add(txt(tx, y + ch - 17, 'Turn me upside down for the answer!', 3, { anchor: 'start', font: FONT, colour: SOFT }));
    } else {
      const note = love[i % love.length].replace('{name}', name || 'superstar');
      textLines(pg, wrap(note, 22), tx, y + 14, 5.4, { weight: 800, font: TITLE_FONT, colour: colourIn ? INK : c });
    }
    if (from && !isJoke) pg.add(txt(x + cw - 8, y + ch - 7, `Love, ${from}`, 4, { anchor: 'end', font: FONT, colour: SOFT }));
  }
  pg.footer = () => {};
  return [pg.svg()];
}

Object.assign(MAKERS, { homelang: makeHomeLang, schoolready: makeSchoolReady, holidayplan: makeHolidayPlan, signs: makeSigns, storydice: makeStoryDice, siblings: makeSiblings, screentime: makeScreenTime, lunchnotes: makeLunchNotes });
