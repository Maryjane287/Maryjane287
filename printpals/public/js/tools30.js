// PrintPals batch 30 (Plus editions): Science Month, Spelling Month, Calm and Happy Month, Reading Adventure Month.

// Lined boxes with a label, used by several monthly pages.
function linedBox(pg, x, y, w, h, label, c, emo) {
  pg.add(panel(x, y, w, h, '#fff', c, 9) + (emo ? emoji(emo, x + 9, y + 9, 8) : '') + txt(x + (emo ? 17 : 7), y + 11, label, 6, { anchor: 'start', colour: c }));
  for (let ly = y + 20; ly < y + h - 4; ly += 9) pg.add(`<line x1="${x + 7}" x2="${x + w - 7}" y1="${ly}" y2="${ly}" stroke="#d9d4ec" stroke-width="0.45"/>`);
}

// ================================================================ Science Month (Plus edition)
const SCI_EXP = [
  ['🥚', 'Sink or float?', ['A bowl of water', 'An apple, a coin, a spoon, a cork, a crayon'], 'Guess if each thing will sink or float, then drop them in one at a time.', 'Things float when they are light for their size.'],
  ['🌈', 'Walking water rainbow', ['3 cups', 'Paper towels', 'Water and food colouring'], 'Put coloured water in two cups with an empty cup between. Bridge them with folded paper towels. Wait an hour!', 'Water climbs up tiny gaps in the paper.'],
  ['🌋', 'Fizzy volcano', ['Bicarbonate of soda', 'Vinegar', 'A tray and a cup'], 'Put 2 spoons of bicarbonate in the cup on a tray, then pour in vinegar. Stand back!', 'The two mix and make a gas full of bubbles.'],
  ['🧲', 'Magnet hunt', ['A magnet', 'Things around the house'], 'Test 10 things. Does the magnet stick or not?', 'Magnets pull on some metals, like iron.'],
  ['🧊', 'Ice melt race', ['3 ice cubes', '3 plates', 'Salt, sugar, nothing'], 'Sprinkle salt on one cube, sugar on one, nothing on the last. Which melts first?', 'Salt makes ice melt faster.'],
  ['🌱', 'Bean in a jar', ['A jar', 'Kitchen paper', 'A dried bean'], 'Push the bean between damp paper and the jar. Check it every day.', 'Seeds need water and warmth to grow.'],
  ['🎈', 'Balloon rocket', ['A balloon', 'String', 'A straw and tape'], 'Thread the straw on a long string. Tape a blown up balloon to it, then let go!', 'Air rushing out pushes the balloon forward.'],
  ['🥛', 'Magic milk', ['A plate of milk', 'Food colouring', 'Washing up liquid', 'A cotton bud'], 'Drop colours in the milk, then touch it with a soapy cotton bud.', 'Soap makes the milk move and swirl.'],
  ['🌞', 'Shadow tracker', ['Chalk', 'A sunny day'], 'Stand in the same spot at breakfast, lunch and tea. Draw round your shadow.', 'Shadows move as the Sun moves across the sky.'],
  ['🥕', 'Coloured celery', ['A celery stick', 'A glass of coloured water'], 'Stand the celery in the water overnight. Look at the leaves in the morning.', 'Plants drink water up their stems.'],
  ['🔊', 'String telephone', ['2 paper cups', 'A long string'], 'Poke the string through both cups. Pull it tight and talk!', 'Sound travels along the string.'],
  ['🍋', 'Invisible ink', ['Lemon juice', 'A cotton bud', 'Paper', 'A grown-up with a lamp'], 'Write a secret message in lemon juice. Let it dry, then a grown-up warms it.', 'Heat turns the lemon juice brown.'],
  ['🧽', 'Which soaks up most?', ['A sponge, a sock, paper, foil', 'A cup of water'], 'Dip each one in water and squeeze it into a cup. Which held the most?', 'Some materials have tiny holes that hold water.'],
  ['🪞', 'Mirror writing', ['A small mirror', 'Paper and pencil'], 'Write your name, then look at it in the mirror. Can you write it backwards?', 'Mirrors flip things the other way round.'],
  ['🥤', 'Straw pan pipes', ['6 straws', 'Tape and scissors'], 'Cut the straws to different lengths, tape them in a row and blow across the tops.', 'Short straws make high sounds, long ones make low sounds.'],
  ['🍪', 'Melting chocolate', ['3 chocolate buttons', 'Sunny window, hand, fridge'], 'Put one in the sun, hold one in your hand, one in the fridge. Which melts first?', 'Heat melts chocolate from solid to liquid.'],
];

function makeScienceMonth(o, paper) {
  const name = nameOf(o.name, '') || '';
  const lk = edLook(o.look);
  const pages = [seriesCover(paper, 'PRINTPALS PLUS EDITION', name ? `${possessive(name)} Science Month` : 'My Science Month', '16 kitchen experiments in 4 weeks', ['🧪', '🌋', '🧲', lk.corner, '🔬', '🏆'], lk.ring, lk.tint, 'lab book', ['16 easy experiments', 'Things you already have', 'Predict and observe', 'Draw what happened', 'Friday science report', 'Young Scientist award'])];
  pages.push(monthPlanPage(paper, lk, 'My science month plan', 'One experiment a day, Monday to Thursday. Friday is report day! Always with a grown-up.', SCI_EXP.reduce((a, e, i) => { a.push(e[1]); if (i % 4 === 3) a.push('My report'); return a; }, []), 'My science reward'));
  for (let w = 1; w <= 4; w++) {
    for (let d = 1; d <= 4; d++) {
      const [e, title, kit, how, why] = SCI_EXP[(w - 1) * 4 + d - 1];
      const pg = new Page(paper, `Experiment: ${title}`, { subtitle: 'Read it with a grown-up, guess what will happen, then try it and draw what you see!' });
      dayStrip(pg, lk, w, d);
      pg.add(panel(pg.left, pg.y, 44, 44, lk.tint, lk.ring, 10) + emoji(e, pg.left + 22, pg.y + 22, 26));
      pg.add(panel(pg.left + 48, pg.y, pg.width - 48, 44, '#fff', '#e2ddf2', 10) + txt(pg.left + 56, pg.y + 10, 'You need', 6, { anchor: 'start', colour: lk.ring }));
      kit.forEach((k, j) => pg.add(`<rect x="${pg.left + 56}" y="${pg.y + 15 + j * 7.4}" width="4.4" height="4.4" rx="1" fill="#fff" stroke="${lk.ring}" stroke-width="0.5"/>` + txt(pg.left + 64, pg.y + 19 + j * 7.4, k, fitFont(k, 5.6, pg.width - 70, 0.5), { anchor: 'start', font: FONT, weight: 700, colour: INK })));
      pg.y += 50;
      const steps = wrap(how, 60).slice(0, 3), sh = 14 + steps.length * 6.6;
      pg.add(panel(pg.left, pg.y, pg.width, sh, '#fffaf0', '#ffb938', 9) + txt(pg.left + 8, pg.y + 9, 'What to do', 6, { anchor: 'start', colour: '#e08a00' }));
      steps.forEach((l, j) => pg.add(txt(pg.left + 8, pg.y + 17 + j * 6.6, l, 5.8, { anchor: 'start', font: FONT, weight: 700, colour: INK })));
      pg.y += sh + 6;
      const hw = (pg.width - 6) / 2, bh = (pg.bottom - 50 - pg.y);
      linedBox(pg, pg.left, pg.y, hw, 34, 'I think it will...', PALETTE[3], '🤔');
      pg.add(`<rect x="${pg.left + hw + 6}" y="${pg.y}" width="${hw}" height="${bh}" rx="9" fill="#fff" stroke="${PALETTE[0]}" stroke-width="0.9"/>` + emoji('👀', pg.left + hw + 15, pg.y + 9, 8) + txt(pg.left + hw + 23, pg.y + 11, 'Draw what happened', 6, { anchor: 'start', colour: PALETTE[0] }));
      linedBox(pg, pg.left, pg.y + 38, hw, bh - 38, 'I saw...', PALETTE[2], '✏️');
      pg.y += bh + 6;
      pg.add(panel(pg.left, pg.y, pg.width, 18, lk.tint, lk.ring, 8) + emoji('💡', pg.left + 9, pg.y + 9, 8) + txt(pg.left + 18, pg.y + 11.4, `Why? ${why}`, fitFont(`Why? ${why}`, 6, pg.width - 26, 0.5), { anchor: 'start', colour: lk.ring }));
      howDidIDo(pg, lk);
      pages.push(pg.svg());
    }
    const pg = new Page(paper, `Friday science report: week ${w}`, { subtitle: 'Choose your favourite experiment this week and report it like a real scientist!' });
    dayStrip(pg, lk, w, 5);
    const hw = (pg.width - 6) / 2, bh = (pg.bottom - 22 - pg.y) / 3;
    linedBox(pg, pg.left, pg.y, pg.width, bh - 4, 'My experiment was called...', PALETTE[0], '🧪');
    pg.add(`<rect x="${pg.left}" y="${pg.y + bh}" width="${hw}" height="${bh * 2 - 6}" rx="9" fill="#fff" stroke="${PALETTE[1]}" stroke-width="0.9"/>` + txt(pg.left + 8, pg.y + bh + 11, 'A diagram with labels', 6, { anchor: 'start', colour: PALETTE[1] }));
    linedBox(pg, pg.left + hw + 6, pg.y + bh, hw, bh - 4, 'What happened', PALETTE[2], '👀');
    linedBox(pg, pg.left + hw + 6, pg.y + bh * 2, hw, bh - 6, 'Next time I will try...', PALETTE[3], '🔁');
    howDidIDo(pg, lk);
    pages.push(pg.svg());
  }
  pages.push(seriesCert(paper, 'SCIENCE MONTH COMPLETE', 'Young Scientist', name, 'for 16 brilliant experiments and asking why!', 'Next: the Little Gardener kit or Space Academy!', lk.ring));
  return pages;
}

// ================================================================ Spelling Month (Plus edition)
const SP_LISTS = {
  1: [['cat', 'dog', 'sun', 'hat', 'pig', 'bed'], ['ship', 'shop', 'fish', 'dish', 'shed', 'wish'], ['chip', 'chop', 'much', 'rich', 'chin', 'lunch'], ['moon', 'soon', 'food', 'book', 'look', 'cook']],
  2: [['rain', 'train', 'paint', 'snail', 'wait', 'tail'], ['play', 'day', 'say', 'stay', 'way', 'tray'], ['night', 'light', 'right', 'bright', 'fight', 'might'], ['coat', 'boat', 'goat', 'road', 'soap', 'toast']],
  3: [['happy', 'funny', 'sunny', 'puppy', 'jolly', 'silly'], ['jumped', 'played', 'helped', 'looked', 'walked', 'called'], ['careful', 'helpful', 'playful', 'thankful', 'colourful', 'hopeful'], ['kindness', 'sadness', 'darkness', 'fitness', 'illness', 'goodness']],
};
const SP_RULE = { 1: ['short vowel words', 'sh words', 'ch words', 'oo words'], 2: ['ai words', 'ay words', 'igh words', 'oa words'], 3: ['y at the end', 'ed endings', 'ful endings', 'ness endings'] };

function makeSpellMonth(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const lk = edLook(o.look), level = SP_LISTS[+o.level] ? +o.level : 1, lists = SP_LISTS[level], rules = SP_RULE[level];
  const custom = listOf(o.words, 24).map((w) => w.toLowerCase().replace(/[^a-z]/g, '')).filter(Boolean);
  const weeks = custom.length >= 6 ? [0, 1, 2, 3].map((k) => { const s = custom.slice(k * 6, k * 6 + 6); return s.length ? s : custom.slice(0, 6); }) : lists;
  const titles = custom.length >= 6 ? ['my words', 'my words', 'my words', 'my words'] : rules;
  const pages = [seriesCover(paper, 'PRINTPALS PLUS EDITION', name ? `${possessive(name)} Spelling Month` : 'My Spelling Month', '24 words in 4 weeks', weeks[0].slice(0, 6), lk.ring, lk.tint, 'workbook', ['6 words a week', 'Look, say, cover, write', 'Word hunts', 'Sentences', 'Friday spelling test', 'Spelling Star award'])];
  pages.push(monthPlanPage(paper, lk, 'My spelling month plan', 'Monday: look, say, cover, write, check. Tuesday: hunt. Wednesday: build. Thursday: use. Friday: test!', weeks.flatMap(() => ['Look and write', 'Word hunt', 'Build it', 'Use it', 'Test!']), 'My spelling reward'));
  weeks.forEach((ws, wi) => {
    const w = wi + 1;
    // Monday: look, say, cover, write, check.
    {
      const pg = new Page(paper, `This week: ${titles[wi]}`, { subtitle: 'Look at the word and say it. Fold the page to cover it. Write it. Unfold and check. Tick if right!' });
      dayStrip(pg, lk, w, 1);
      const cols = ['Look and say', 'Write it', 'Write it again', 'Check ✓'], lw = pg.width * 0.28, cw = (pg.width - lw) / 3, rh = (pg.room - 40) / 6;
      cols.forEach((c, k) => pg.add(`<rect x="${k ? pg.left + lw + (k - 1) * cw : pg.left}" y="${pg.y}" width="${k ? cw : lw}" height="10" fill="${TINTS[k]}" stroke="#d9d4ec" stroke-width="0.4"/>` + txt((k ? pg.left + lw + (k - 1) * cw + cw / 2 : pg.left + lw / 2), pg.y + 7, c, 5.4, { colour: PALETTE[k] })));
      ws.forEach((wd, j) => { const y = pg.y + 10 + j * rh; pg.add(`<rect x="${pg.left}" y="${y}" width="${lw}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.4"/>` + txt(pg.left + lw / 2, y + rh * 0.62, wd, Math.min(12, rh * 0.5), { colour: INK })); for (let k = 0; k < 3; k++) pg.add(`<rect x="${pg.left + lw + k * cw}" y="${y}" width="${cw}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.4"/>` + (k < 2 ? `<line x1="${pg.left + lw + k * cw + 4}" x2="${pg.left + lw + (k + 1) * cw - 4}" y1="${y + rh * 0.72}" y2="${y + rh * 0.72}" stroke="#c9c3e3" stroke-width="0.45"/>` : `<rect x="${pg.left + lw + k * cw + cw / 2 - 5}" y="${y + rh / 2 - 5}" width="10" height="10" rx="2" fill="#fff" stroke="${PALETTE[3]}" stroke-width="0.7"/>`)); });
      pg.add(`<line x1="${pg.left + lw}" x2="${pg.left + lw}" y1="${pg.y - 2}" y2="${pg.y + 10 + 6 * rh + 2}" stroke="${lk.ring}" stroke-width="0.6" stroke-dasharray="3 2"/>` + txt(pg.left + lw + 2, pg.y + 10 + 6 * rh + 7, '✂ fold here to cover', 4.6, { anchor: 'start', font: FONT, colour: SOFT }));
      howDidIDo(pg, lk);
      pages.push(pg.svg());
    }
    // Tuesday: word hunt.
    pages.push(packBadge((packRun('wordsearch', { words: ws.join(', '), size: ws.some((x) => x.length > 8) ? '10' : '8', level: 'easy', title: `Word hunt: week ${w}` }, paper, (+o.seed || 1) * 13 + w).sheets[0] || ''), `Week ${w} · Tuesday`, lk.ring));
    // Wednesday: build it (missing letters and rainbow writing).
    {
      const pg = new Page(paper, `Build the words: week ${w}`, { subtitle: 'Fill in the missing letters. Then write each word three times in three different colours!' });
      dayStrip(pg, lk, w, 3);
      const rh = (pg.room - 22) / 6;
      ws.forEach((wd, j) => { const y = pg.y + j * rh, miss = wd.split('').map((c, k) => (k % 2 === (j % 2) && k < wd.length ? '_' : c)).join(' '); pg.add(panel(pg.left, y + 1, pg.width * 0.36, rh - 3, TINTS[j % TINTS.length], PALETTE[j % PALETTE.length], 7) + txt(pg.left + pg.width * 0.18, y + rh * 0.62, miss, Math.min(9, rh * 0.42), { colour: INK })); for (let k = 0; k < 3; k++) pg.add(`<line x1="${pg.left + pg.width * 0.4 + k * pg.width * 0.2}" x2="${pg.left + pg.width * 0.4 + (k + 1) * pg.width * 0.2 - 6}" y1="${y + rh * 0.72}" y2="${y + rh * 0.72}" stroke="${PALETTE[(j + k) % PALETTE.length]}" stroke-width="0.8"/>`); });
      howDidIDo(pg, lk);
      pages.push(pg.svg());
    }
    // Thursday: use it.
    {
      const pg = new Page(paper, `Use your words: week ${w}`, { subtitle: 'Write a sentence using each word. Can you fit two spelling words into one sentence?' });
      dayStrip(pg, lk, w, 4);
      const rh = (pg.room - 22) / 6;
      ws.forEach((wd, j) => { const y = pg.y + j * rh; pg.add(`<rect x="${pg.left}" y="${y + 2}" width="36" height="12" rx="6" fill="${TINTS[j % TINTS.length]}" stroke="${PALETTE[j % PALETTE.length]}" stroke-width="0.6"/>` + txt(pg.left + 18, y + 10.4, wd, fitFont(wd, 6.6, 32, 0.56), { colour: INK }) + `<line x1="${pg.left + 40}" x2="${pg.right}" y1="${y + 12}" y2="${y + 12}" stroke="#c9c3e3" stroke-width="0.5"/><line x1="${pg.left}" x2="${pg.right}" y1="${y + rh - 4}" y2="${y + rh - 4}" stroke="#c9c3e3" stroke-width="0.5"/>`); });
      howDidIDo(pg, lk);
      pages.push(pg.svg());
    }
    // Friday: test.
    {
      const pg = new Page(paper, `Friday spelling test: week ${w}`, { subtitle: 'A grown-up reads each word. Write it carefully. Check together and colour a star for each one right!' });
      dayStrip(pg, lk, w, 5);
      const rh = Math.min(18, (pg.room - 70) / 6);
      for (let j = 0; j < 6; j++) { const y = pg.y + j * rh; pg.add(txt(pg.left + 4, y + rh * 0.66, `${j + 1}.`, 7, { anchor: 'start', colour: lk.ring }) + `<line x1="${pg.left + 16}" x2="${pg.right - 20}" y1="${y + rh * 0.72}" y2="${y + rh * 0.72}" stroke="#9a93b8" stroke-width="0.6"/><path d="${starPath(pg.right - 8, y + rh / 2, 5, 0.45)}" fill="#fff" stroke="${PALETTE[j]}" stroke-width="0.8"/>`); }
      pg.y += 6 * rh + 8;
      pg.add(panel(pg.left, pg.y, pg.width, 20, lk.tint, lk.ring, 9) + txt(pg.left + 10, pg.y + 12.6, 'My score:', 7, { anchor: 'start', colour: lk.ring }) + `<rect x="${pg.left + 44}" y="${pg.y + 4}" width="22" height="12" rx="3" fill="#fff" stroke="${lk.ring}" stroke-width="0.8"/>` + txt(pg.left + 72, pg.y + 12.6, 'out of 6', 6.4, { anchor: 'start', colour: INK }));
      pg.y += 26;
      pg.add(txt(pg.left, pg.y + 4, 'For the grown-up: read these words out loud', 5.4, { anchor: 'start', font: FONT, colour: SOFT }) + txt(pg.left, pg.y + 12, shuffle(ws, rand).join(',   '), 6.4, { anchor: 'start', colour: SOFT }));
      howDidIDo(pg, lk);
      pages.push(pg.svg());
    }
  });
  pages.push(seriesCert(paper, 'SPELLING MONTH COMPLETE', 'Spelling Star', name, 'for learning 24 new spellings this month!', level < 3 ? 'Next month: the next spelling level!' : 'You are a spelling superstar!', lk.ring));
  return pages;
}

// ================================================================ Calm and Happy Month (Plus edition)
const CALM_BREATH = [['🌸', 'Smell the flower, blow the candle', 'Breathe in through your nose like smelling a flower. Blow out slowly like a candle. 5 times.'], ['🐝', 'Bumblebee breath', 'Breathe in, then hum like a bee as you breathe out. Feel the buzz!'], ['⭐', 'Star breathing', 'Trace the star with your finger: breathe in going up, out coming down.'], ['🎈', 'Balloon belly', 'Hands on your tummy. Fill it like a balloon, then let it slowly go down.'], ['🐢', 'Turtle breath', 'Tuck in your head like a turtle, breathe slowly 3 times, then pop out!']];
const CALM_ACTS = ['Listen to 5 sounds with your eyes shut', 'Squeeze and relax your hands 5 times', 'Draw slow swirls on paper', 'Cuddle a soft toy for one minute', 'Stretch up tall like a tree', 'Look for 5 blue things', 'Lie down and feel your heartbeat', 'Hum your favourite song softly', 'Give yourself a big hug', 'Tidy one small space slowly', 'Watch the clouds for 2 minutes', 'Colour a pattern slowly', 'Drink a glass of water slowly', 'Count 10 slow breaths', 'Sit quietly and notice your toes', 'Stroke your arm gently like a feather'];
const CALM_THANKS = ['someone who helped me', 'something yummy I ate', 'a place I love', 'something that made me laugh', 'a friend', 'my body, which can', 'something in nature', 'a toy or thing I love', 'someone at home', 'something I learned', 'a kind thing someone said', 'the weather today', 'something I am good at', 'a happy memory', 'someone far away', 'today'];

function makeCalmMonth(o, paper) {
  const name = nameOf(o.name, '') || '';
  const lk = edLook(o.look);
  const feelings = ['😄', '😌', '😢', '😠', '😟', '🤩', '😴', '🥰'];
  const pages = [seriesCover(paper, 'PRINTPALS PLUS EDITION', name ? `${possessive(name)} Calm and Happy Month` : 'My Calm and Happy Month', 'Five calm minutes a day', ['🌈', '🧘', '💛', lk.corner, '🌸', '☁️'], lk.ring, lk.tint, 'journal', ['A feelings check-in', 'A breathing game', 'A calm activity', 'A daily thank you', 'Friday: my week', 'Calm Champion award'])];
  pages.push(monthPlanPage(paper, lk, 'My calm month plan', 'A few calm minutes every day, maybe after school or before bed. Colour a star each time!', Array.from({ length: 20 }, (_, i) => (i % 5 === 4 ? 'My week' : CALM_BREATH[i % 5][1].split(',')[0].split(' ').slice(0, 2).join(' '))), 'My calm reward'));
  let a = 0;
  for (let w = 1; w <= 4; w++) for (let d = 1; d <= 5; d++) {
    if (d === 5) {
      const pg = new Page(paper, `My week: week ${w}`, { subtitle: 'Look back at your week. Every feeling is welcome. Share this page with someone you love.' });
      dayStrip(pg, lk, w, 5);
      const bh = (pg.bottom - 22 - pg.y) / 4;
      [['🌟', 'The best part of my week'], ['🌧️', 'Something that was hard'], ['🤝', 'Someone who helped me'], ['🎯', 'Next week I want to']].forEach(([e, t], k) => linedBox(pg, pg.left, pg.y + k * bh, pg.width, bh - 4, t, PALETTE[k], e));
      howDidIDo(pg, lk);
      pages.push(pg.svg());
      continue;
    }
    const [be, bt, bd] = CALM_BREATH[(w + d) % 5], act = CALM_ACTS[a], thank = CALM_THANKS[a]; a++;
    const pg = new Page(paper, `Calm time: day ${(w - 1) * 5 + d}`, { subtitle: 'Find a quiet cosy spot. Take your time. There are no wrong answers here.' });
    dayStrip(pg, lk, w, d);
    pg.add(txt(pg.left, pg.y + 4, '1. How do I feel today? Circle it.', 6.4, { anchor: 'start', colour: PALETTE[0] }));
    feelings.forEach((f, k) => pg.add(`<circle cx="${pg.left + 12 + k * (pg.width - 24) / 7}" cy="${pg.y + 16}" r="7.4" fill="#fff" stroke="#e2ddf2" stroke-width="0.6"/>` + emoji(f, pg.left + 12 + k * (pg.width - 24) / 7, pg.y + 16, 10)));
    pg.y += 28;
    pg.add(panel(pg.left, pg.y, pg.width, 50, lk.tint, lk.ring, 10) + txt(pg.left + 8, pg.y + 10, `2. Breathing game: ${bt}`, 6.4, { anchor: 'start', colour: lk.ring }) + emoji(be, pg.right - 22, pg.y + 26, 22));
    wrap(bd, 52).forEach((l, k) => pg.add(txt(pg.left + 8, pg.y + 20 + k * 7, l, 6, { anchor: 'start', font: FONT, weight: 700, colour: INK })));
    for (let k = 0; k < 5; k++) pg.add(`<circle cx="${pg.left + 12 + k * 12}" cy="${pg.y + 42}" r="4" fill="#fff" stroke="${lk.ring}" stroke-width="0.7"/>`);
    pg.add(txt(pg.left + 76, pg.y + 44, 'colour a circle for each breath', 5, { anchor: 'start', font: FONT, colour: SOFT }));
    pg.y += 56;
    pg.add(panel(pg.left, pg.y, pg.width, 20, '#fff', PALETTE[2], 9) + emoji('🍃', pg.left + 10, pg.y + 10, 9) + txt(pg.left + 20, pg.y + 12.4, `3. Calm activity: ${act}`, fitFont(`3. Calm activity: ${act}`, 6.4, pg.width - 30, 0.5), { anchor: 'start', colour: PALETTE[2] }));
    pg.y += 26;
    const th = pg.bottom - 22 - pg.y;
    linedBox(pg, pg.left, pg.y, pg.width, th, `4. Thank you for ${thank}...`, PALETTE[5], '💛');
    howDidIDo(pg, lk);
    pages.push(pg.svg());
  }
  pages.push(seriesCert(paper, 'CALM AND HAPPY MONTH', 'Calm Champion', name, 'for a whole month of breathing, noticing and being kind to yourself!', 'Keep your calm tools with you every day!', lk.ring));
  return pages;
}

// ================================================================ Reading Adventure Month (Plus edition)
const RA_TASKS = [
  ['🎨', 'Draw your favourite character', 'draw'], ['⭐', 'Give the book a star rating and say why', 'rate'], ['🔤', 'Find 3 new or tricky words', 'words'], ['🔮', 'What do you think will happen next?', 'lines'],
  ['🗺️', 'Draw where the story happens', 'draw'], ['😂', 'The funniest part was...', 'lines'], ['💬', 'Write what a character might say', 'lines'], ['🎭', 'Change the ending! What happens instead?', 'lines'],
  ['📖', 'Draw the book cover in your own way', 'draw'], ['❓', 'Write a question you would ask the author', 'lines'], ['🔍', 'Find 3 describing words', 'words'], ['❤️', 'Who would you give this book to, and why?', 'lines'],
  ['🦸', 'Draw yourself inside the story', 'draw'], ['🔢', 'How many pages did you read today?', 'rate'], ['🎵', 'Find 3 words that rhyme or sound fun', 'words'], ['🌟', 'The best sentence in the book', 'lines'],
];

function makeReadAdventure(o, paper) {
  const name = nameOf(o.name, '') || '';
  const nm = name || 'Mia';
  const lk = edLook(o.look);
  const pages = [seriesCover(paper, 'PRINTPALS PLUS EDITION', name ? `${possessive(name)} Reading Adventure` : 'My Reading Adventure', '20 days, 20 stops on the reading map', ['📚', '🗺️', '⭐', lk.corner, '🦉', '🏆'], lk.ring, lk.tint, 'reading journal', ['Reading map', 'A mini task every day', 'Bookmarks to colour', 'Friday book review', 'Reading log', 'Reading Explorer award'])];
  // Reading map: a winding path with 20 stops.
  {
    const pg = new Page(paper, 'My reading map', { subtitle: 'Read every day and colour a stop on the map. Can you reach the treasure?' });
    const pts = [], rows = 5, perRow = 4, rh = (pg.room - 20) / rows;
    for (let k = 0; k < 20; k++) { const r = Math.floor(k / perRow), c = k % perRow, cc = r % 2 ? perRow - 1 - c : c; pts.push([pg.left + 20 + cc * (pg.width - 40) / (perRow - 1), pg.y + 14 + r * rh]); }
    let d = `M${pts[0][0]} ${pts[0][1]}`; for (let k = 1; k < 20; k++) d += ` L${pts[k][0]} ${pts[k][1]}`;
    pg.add(`<path d="${d}" fill="none" stroke="#e6d6b8" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#c9a96a" stroke-width="0.8" stroke-dasharray="3 2"/>`);
    const scen = ['🏰', '🌲', '🐉', '🏝️', '🌋', '🦄', '⛵', '🏔️'];
    pts.forEach(([x, y], k) => pg.add(`<circle cx="${x}" cy="${y}" r="9" fill="#fff" stroke="${PALETTE[k % PALETTE.length]}" stroke-width="1.2"/>` + txt(x, y + 3, `${k + 1}`, 7.4, { colour: PALETTE[k % PALETTE.length] })));
    for (let k = 0; k < 8; k++) pg.add(emoji(scen[k], pg.left + 8 + (k % 2) * (pg.width - 16), pg.y + 30 + k * (rh * 0.55), 10));
    pg.add(emoji('💰', pts[19][0], pts[19][1] + 20, 16) + emoji('🧒', pts[0][0] - 2, pts[0][1] - 16, 12));
    pages.push(pg.svg());
  }
  // Bookmarks.
  pages.push(tagsPage(paper, 'My bookmarks', 'Colour, cut out and use them in your books. Fold along the middle to make them strong!', 4, 4, (pg, x, y, w, h, i) => { const c = PALETTE[i]; pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="6" fill="${TINTS[i]}" stroke="${c}" stroke-width="1"/>` + emoji(['📚', '🦉', '🚀', '🌈'][i], x + w / 2, y + 24, 20) + [['Keep', 'reading!'], ['Books', 'are', 'magic'], ['Read', 'to the', 'stars'], ['Just', 'one more', 'page!']][i].map((l, k) => txt(x + w / 2, y + 48 + k * 9, l, fitFont(l, 8, w - 14, 0.58), { colour: c })).join('') + txt(x + w / 2, y + h - 18, 'This book', 4.4, { font: FONT, colour: SOFT }) + txt(x + w / 2, y + h - 13.4, 'belongs to', 4.4, { font: FONT, colour: SOFT }) + txt(x + w / 2, y + h - 8, nm, 6, { colour: INK })); }));
  let t = 0;
  for (let w = 1; w <= 4; w++) for (let d = 1; d <= 5; d++) {
    const pg = new Page(paper, d === 5 ? `Friday book review: week ${w}` : `Reading day ${(w - 1) * 5 + d}`, { subtitle: d === 5 ? 'Tell everyone about a book you read this week. Would you recommend it?' : 'Read for at least 10 minutes, then do today\'s mini task!' });
    dayStrip(pg, lk, w, d);
    if (d === 5) {
      pg.add(panel(pg.left, pg.y, pg.width, 26, lk.tint, lk.ring, 10) + txt(pg.left + 8, pg.y + 10, 'Title:', 6.4, { anchor: 'start', colour: lk.ring }) + `<line x1="${pg.left + 28}" x2="${pg.right - 8}" y1="${pg.y + 10.6}" y2="${pg.y + 10.6}" stroke="#b9b3d6" stroke-width="0.5"/>` + txt(pg.left + 8, pg.y + 21, 'Author:', 6.4, { anchor: 'start', colour: lk.ring }) + `<line x1="${pg.left + 32}" x2="${pg.right - 8}" y1="${pg.y + 21.6}" y2="${pg.y + 21.6}" stroke="#b9b3d6" stroke-width="0.5"/>`);
      pg.y += 32;
      const hw = (pg.width - 6) / 2, bh = pg.bottom - 50 - pg.y;
      pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${hw}" height="${bh}" rx="9" fill="#fff" stroke="${PALETTE[1]}" stroke-width="0.9"/>` + txt(pg.left + 8, pg.y + 10, 'My favourite picture from it', 6, { anchor: 'start', colour: PALETTE[1] }));
      linedBox(pg, pg.left + hw + 6, pg.y, hw, bh / 2 - 3, 'It was about...', PALETTE[2], '📖');
      linedBox(pg, pg.left + hw + 6, pg.y + bh / 2 + 3, hw, bh / 2 - 3, 'I liked it because...', PALETTE[3], '💛');
      pg.y += bh + 6;
      pg.add(txt(pg.left, pg.y + 8, 'My rating:', 6.4, { anchor: 'start', colour: lk.ring }));
      for (let k = 0; k < 5; k++) pg.add(`<path d="${starPath(pg.left + 44 + k * 14, pg.y + 6, 5.4, 0.45)}" fill="#fff" stroke="${lk.accent}" stroke-width="0.9"/>`);
    } else {
      const [e, task, kind] = RA_TASKS[t++ % RA_TASKS.length];
      pg.add(panel(pg.left, pg.y, pg.width, 26, lk.tint, lk.ring, 10) + txt(pg.left + 8, pg.y + 10, 'Today I read:', 6.4, { anchor: 'start', colour: lk.ring }) + `<line x1="${pg.left + 50}" x2="${pg.right - 8}" y1="${pg.y + 10.6}" y2="${pg.y + 10.6}" stroke="#b9b3d6" stroke-width="0.5"/>` + txt(pg.left + 8, pg.y + 21, 'Minutes:', 6.4, { anchor: 'start', colour: lk.ring }) + `<rect x="${pg.left + 36}" y="${pg.y + 15}" width="18" height="9" rx="2" fill="#fff" stroke="${lk.ring}" stroke-width="0.6"/>` + txt(pg.left + 64, pg.y + 21, 'I read with:', 6.4, { anchor: 'start', colour: lk.ring }) + `<line x1="${pg.left + 104}" x2="${pg.right - 8}" y1="${pg.y + 21.6}" y2="${pg.y + 21.6}" stroke="#b9b3d6" stroke-width="0.5"/>`);
      pg.y += 32;
      pg.add(panel(pg.left, pg.y, pg.width, 18, '#fff', PALETTE[t % PALETTE.length], 9) + emoji(e, pg.left + 10, pg.y + 9, 9) + txt(pg.left + 20, pg.y + 11.6, `Mini task: ${task}`, fitFont(`Mini task: ${task}`, 6.6, pg.width - 28, 0.5), { anchor: 'start', colour: PALETTE[t % PALETTE.length] }));
      pg.y += 24;
      const bh = pg.bottom - 22 - pg.y;
      if (kind === 'draw') pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${bh}" rx="10" fill="#fff" stroke="${lk.ring}" stroke-width="0.8" stroke-dasharray="3 2"/>`);
      else if (kind === 'words') [0, 1, 2].forEach((k) => { const y = pg.y + k * (bh / 3); pg.add(panel(pg.left, y + 2, pg.width, bh / 3 - 6, TINTS[k], PALETTE[k], 9) + txt(pg.left + 8, y + 12, `Word ${k + 1}:`, 6.4, { anchor: 'start', colour: PALETTE[k] }) + `<line x1="${pg.left + 34}" x2="${pg.left + pg.width * 0.45}" y1="${y + 12.6}" y2="${y + 12.6}" stroke="#b9b3d6" stroke-width="0.5"/>` + txt(pg.left + pg.width * 0.5, y + 12, 'It means:', 6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${pg.left + pg.width * 0.5 + 30}" x2="${pg.right - 8}" y1="${y + 12.6}" y2="${y + 12.6}" stroke="#b9b3d6" stroke-width="0.5"/>`); });
      else if (kind === 'rate') { for (let k = 0; k < 5; k++) pg.add(`<path d="${starPath(pg.left + pg.width / 2 - 48 + k * 24, pg.y + 18, 10, 0.45)}" fill="#fff" stroke="${lk.accent}" stroke-width="1"/>`); linedBox(pg, pg.left, pg.y + 36, pg.width, bh - 36, 'Because...', PALETTE[3], '💭'); }
      else linedBox(pg, pg.left, pg.y, pg.width, bh, 'My answer', PALETTE[4], '✏️');
    }
    howDidIDo(pg, lk);
    pages.push(pg.svg());
  }
  pages.push(seriesCert(paper, 'READING ADVENTURE COMPLETE', 'Reading Explorer', name, 'for reading every day and reaching the treasure!', 'Next adventure: a brand new reading map!', lk.ring));
  return pages;
}

Object.assign(MAKERS, { sciencemonth: makeScienceMonth, spellmonth: makeSpellMonth, calmmonth: makeCalmMonth, readadventure: makeReadAdventure });
