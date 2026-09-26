// PrintPals batch 2: photo colouring pages, story sheets, bingo, birthday party pack,
// certificates, dot to dot, picture sudoku and b/d letter mix-ups.

/** A picture centred on (cx, cy): one of our painted pictures or an emoji. */
function pic(src, cx, cy, size) {
  if (src.startsWith('img/')) return `<image href="${src}" x="${(cx - size / 2).toFixed(2)}" y="${(cy - size / 2).toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" preserveAspectRatio="xMidYMid meet"/>`;
  return emoji(src, cx, cy, size * 0.84);
}

function shuffle(list, rand) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function nameOf(v, fallback) {
  const n = String(v || '').trim().replace(/\s+/g, ' ').slice(0, 24);
  return n ? n[0].toUpperCase() + n.slice(1) : fallback;
}

function listOf(text, max = 30) {
  return String(text || '').split(/[\n,]/).map((s) => s.trim().replace(/\s+/g, ' ')).filter(Boolean).slice(0, max);
}

function starPath(cx, cy, r, inner = 0.45) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * inner : r;
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(2)} ${(cy + Math.sin(a) * rr).toFixed(2)} `;
  }
  return d + 'Z';
}

/** Font size so [text] fits in [width] (rough, for rounded sans fonts). */
function fitFont(text, want, width, k = 0.56) {
  return Math.min(want, width / (Math.max(1, String(text).length) * k));
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function scissors(pg, y) {
  pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${y}" y2="${y}" stroke="#b9b3d6" stroke-width="0.35" stroke-dasharray="2.2 1.6"/>`);
  pg.add(emoji('✂️', pg.left + 4, y - 0.2, 5));
}

// ================================================================ pictures
const SETS = {
  animals: [['Cat', 'img/cat.webp'], ['Dog', 'img/dog.webp'], ['Fish', 'img/fish.webp'], ['Gorilla', 'img/gorilla.webp'], ['Lion', 'img/lion.webp'],
    ['Monkey', 'img/monkey.webp'], ['Octopus', 'img/octopus.webp'], ['Pig', 'img/pig.webp'], ['Turtle', 'img/turtle.webp'], ['Zebra', 'img/zebra.webp'],
    ['Rabbit', '🐰'], ['Frog', '🐸'], ['Owl', '🦉'], ['Elephant', '🐘'], ['Giraffe', '🦒'], ['Bee', '🐝'], ['Duck', '🦆'], ['Penguin', '🐧'],
    ['Butterfly', '🦋'], ['Snail', '🐌'], ['Bear', '🐻'], ['Chick', '🐥'], ['Ladybird', '🐞'], ['Ant', '🐜']],
  food: [['Apple', 'img/apple.webp'], ['Egg', 'img/egg.webp'], ['Banana', '🍌'], ['Strawberry', '🍓'], ['Carrot', '🥕'], ['Cake', '🎂'],
    ['Cookie', '🍪'], ['Pizza', '🍕'], ['Ice cream', '🍦'], ['Grapes', '🍇'], ['Pear', '🍐'], ['Cheese', '🧀'], ['Bread', '🍞'],
    ['Watermelon', '🍉'], ['Cupcake', '🧁'], ['Lemon', '🍋'], ['Corn', '🌽'], ['Cherries', '🍒'], ['Orange', '🍊'], ['Blueberries', '🫐'], ['Doughnut', '🍩'], ['Mushroom', '🍄']],
  things: [['Balloon', 'img/balloon.webp'], ['Hat', 'img/hat.webp'], ['Rainbow', 'img/rainbow.webp'], ['Star', 'img/star.webp'], ['Sun', 'img/sun.webp'],
    ['Nest', 'img/nest.webp'], ['Kite', '🪁'], ['Ball', '⚽'], ['Car', '🚗'], ['Rocket', '🚀'], ['Umbrella', '☂️'], ['Book', '📚'], ['Teddy', '🧸'],
    ['Crayon', '🖍️'], ['Bike', '🚲'], ['Boat', '⛵'], ['Moon', '🌙'], ['Tree', '🌳'], ['Sunflower', '🌻'], ['Tulip', '🌷'], ['Drum', '🥁'], ['Blocks', 'img/blocks.webp'], ['Heart', '❤️'], ['Medal', '🏅']],
  party: [['Cake', '🎂'], ['Balloon', 'img/balloon.webp'], ['Present', '🎁'], ['Popper', '🎉'], ['Cupcake', '🧁'], ['Party hat', 'img/hat.webp'],
    ['Sweets', '🍬'], ['Lollipop', '🍭'], ['Star', 'img/star.webp'], ['Crown', '👑'], ['Music', '🎵'], ['Juice', '🧃'], ['Ice cream', '🍦'],
    ['Teddy', '🧸'], ['Confetti', '🎊'], ['Doughnut', '🍩'], ['Rainbow', 'img/rainbow.webp'], ['Games', '🎲']],
};
// Use our painted pictures wherever we have one.
for (const k in SETS) SETS[k] = SETS[k].map(([n, src]) => [n, artFor(src) || src]);
const PAINTED = [...SETS.animals, ...SETS.food, ...SETS.things].filter(([, s]) => s.startsWith('img/'));
const SIGHT_WORDS = ['the', 'and', 'is', 'it', 'in', 'to', 'my', 'you', 'we', 'see', 'look', 'can', 'go', 'said', 'was', 'play', 'like', 'come', 'here', 'big', 'little', 'up', 'down', 'said', 'yes', 'no', 'for', 'at'];

// ================================================================ photo colouring page
const PHOTO = { img: null, demo: false, loading: false, error: false, cache: {} };

function loadPhoto(src, demo) {
  const im = new Image();
  PHOTO.loading = true;
  im.onload = () => { Object.assign(PHOTO, { img: im, demo, loading: false, error: false, cache: {} }); if (window.PrintPals) window.PrintPals.render(); };
  im.onerror = () => { Object.assign(PHOTO, { loading: false, error: true }); if (window.PrintPals) window.PrintPals.render(); };
  im.src = src;
}

(function watchPhotoInput() {
  const input = typeof document !== 'undefined' && document.querySelector('#maker[data-tool=photo] input[type=file]');
  if (!input) return;
  input.addEventListener('change', () => {
    const f = input.files && input.files[0];
    if (!f) return;
    loadPhoto(URL.createObjectURL(f), false); // stays on this device
  });
})();

function boxBlur(src, w, h, r) {
  if (r < 1) return src.slice();
  const tmp = new Float32Array(w * h), out = new Float32Array(w * h), d = 2 * r + 1;
  for (let y = 0; y < h; y++) {
    const row = y * w;
    let acc = 0;
    for (let x = -r; x <= r; x++) acc += src[row + Math.min(w - 1, Math.max(0, x))];
    for (let x = 0; x < w; x++) {
      tmp[row + x] = acc / d;
      acc += src[row + Math.min(w - 1, x + r + 1)] - src[row + Math.max(0, x - r)];
    }
  }
  for (let x = 0; x < w; x++) {
    let acc = 0;
    for (let y = -r; y <= r; y++) acc += tmp[Math.min(h - 1, Math.max(0, y)) * w + x];
    for (let y = 0; y < h; y++) {
      out[y * w + x] = acc / d;
      acc += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x];
    }
  }
  return out;
}
const smooth = (a, w, h, r) => boxBlur(boxBlur(a, w, h, r), w, h, r);

/** Turns a photo into clean black line art, all inside the browser. */
function lineArt(img, detail) {
  const set = { simple: { r1: 2, r2: 7, t: 5.5, min: 260 }, medium: { r1: 1, r2: 4, t: 4, min: 120 }, detailed: { r1: 1, r2: 3, t: 3, min: 50 } }[detail] || { r1: 1, r2: 4, t: 4, min: 120 };
  const long = 1400;
  const k = long / Math.max(img.naturalWidth, img.naturalHeight);
  const w = Math.round(img.naturalWidth * k), h = Math.round(img.naturalHeight * k);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, w, h);
  x.imageSmoothingQuality = 'high';
  x.drawImage(img, 0, 0, w, h);
  const data = x.getImageData(0, 0, w, h);
  const px = data.data;
  // Edges in brightness and in each colour, so an orange mane on a cream face still gets a line.
  const ink = new Float32Array(w * h);
  const mask = new Uint8Array(w * h);
  for (let ch = 0; ch < 4; ch++) {
    const g = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) g[i] = ch < 3 ? px[i * 4 + ch] : px[i * 4] * 0.299 + px[i * 4 + 1] * 0.587 + px[i * 4 + 2] * 0.114;
    const a = smooth(g, w, h, set.r1), b = smooth(g, w, h, set.r2);
    const t = ch < 3 ? set.t * 1.3 : set.t;
    for (let i = 0; i < w * h; i++) {
      const v = Math.max(0, Math.min(1, (b[i] - a[i] - t) / (t * 1.1)));
      if (v > ink[i]) ink[i] = v;
    }
  }
  for (let i = 0; i < w * h; i++) if (ink[i] > 0.2) mask[i] = 1;
  // Tidy away little specks so the page is calm and easy to colour.
  const seen = new Uint8Array(w * h), stack = new Int32Array(w * h);
  const minArea = set.min * (w * h) / (1400 * 1050);
  for (let i = 0; i < w * h; i++) {
    if (!mask[i] || seen[i]) continue;
    let top = 0, n = 0;
    const blob = [];
    stack[top++] = i; seen[i] = 1;
    while (top) {
      const p = stack[--top];
      blob.push(p); n++;
      const py = (p / w) | 0, pxx = p - py * w;
      if (pxx > 0 && mask[p - 1] && !seen[p - 1]) { seen[p - 1] = 1; stack[top++] = p - 1; }
      if (pxx < w - 1 && mask[p + 1] && !seen[p + 1]) { seen[p + 1] = 1; stack[top++] = p + 1; }
      if (py > 0 && mask[p - w] && !seen[p - w]) { seen[p - w] = 1; stack[top++] = p - w; }
      if (py < h - 1 && mask[p + w] && !seen[p + w]) { seen[p + w] = 1; stack[top++] = p + w; }
    }
    if (n < minArea) for (const p of blob) ink[p] = 0;
  }
  for (let i = 0; i < w * h; i++) {
    const v = mask[i] || ink[i] > 0.05 ? 255 - Math.round(Math.min(1, ink[i] * 1.25) * 225) : 255;
    px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = v; px[i * 4 + 3] = 255;
  }
  x.putImageData(data, 0, 0);
  return { src: c.toDataURL('image/png'), w, h };
}

function makePhoto(o, paper) {
  if (!PHOTO.img && !PHOTO.loading && !PHOTO.error) loadPhoto('img/lion.webp', true);
  const name = String(o.name || '').trim();
  const title = (o.title || '').trim() || (name ? `${possessive(nameOf(name))} Colouring Page` : 'My Colouring Page');
  if (!PHOTO.img) {
    const pg = new Page(paper, title, { subtitle: 'Colour me in!', noName: true });
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${pg.room}" rx="8" fill="#fbfaff" stroke="#d9d4ec" stroke-width="0.6" stroke-dasharray="3 2"/>`);
    pg.add(`<text x="${pg.w / 2}" y="${pg.y + pg.room / 2}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="6" fill="${SOFT}">${PHOTO.error ? 'That photo would not open. Please try another one.' : 'Choose a photo to begin'}</text>`);
    return [pg.svg()];
  }
  const detail = o.detail || 'medium';
  if (!PHOTO.cache[detail]) PHOTO.cache[detail] = lineArt(PHOTO.img, detail);
  const art = PHOTO.cache[detail];
  const landscape = art.w > art.h * 1.15;
  const pg = new Page(paper, title, { subtitle: PHOTO.demo ? 'A sample. Choose your own photo to make yours.' : 'Colour me in!', noName: true, landscape });
  const frame = o.frame !== false;
  const pad = frame ? 7 : 0;
  const bx = pg.left + 4, by = pg.y + 3, bw = pg.width - 8, bh = pg.room - 5;
  if (frame) {
    pg.add(`<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="7" fill="none" stroke="${INK}" stroke-width="1.1"/>`);
    pg.add(`<rect x="${bx + 2.2}" y="${by + 2.2}" width="${bw - 4.4}" height="${bh - 4.4}" rx="5.5" fill="none" stroke="${INK}" stroke-width="0.35"/>`);
    for (const [cx, cy] of [[bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh]]) {
      pg.add(`<path d="${starPath(cx, cy, 6.5, 0.48)}" fill="#fff" stroke="${INK}" stroke-width="0.8" stroke-linejoin="round"/>`);
    }
  }
  const aw = bw - pad * 2, ah = bh - pad * 2;
  const s = Math.min(aw / art.w, ah / art.h);
  const iw = art.w * s, ih = art.h * s;
  pg.add(`<image href="${art.src}" x="${bx + pad + (aw - iw) / 2}" y="${by + pad + (ah - ih) / 2}" width="${iw}" height="${ih}" preserveAspectRatio="xMidYMid meet"/>`);
  return [pg.svg()];
}

// ================================================================ story sheets
const STORIES = {
  balloon: {
    title: '{name} and the Big Red Balloon', pic: 'img/balloon.webp', words: ['balloon', 'wind', 'tree'],
    text: ['{name} has a big red balloon.', 'Whoosh! The wind blows it away.', '{name} and {friend} run and run.', 'The balloon is stuck in a tall tree.',
      '{friend} climbs up and gets it down.', '{name} gives {friend} a big hug and says, "Thank you!"'],
    q: [['What colour is the balloon?', '🔴 red', '🔵 blue', '🟢 green'], ['Where does the balloon get stuck?', '🌳 in a tree', '🏠 on a roof', '🌊 in the sea'],
      ['What does {name} say?', '"Thank you!"', '"Good night!"', '"Go away!"']],
  },
  kitten: {
    title: '{name} Finds a Kitten', pic: 'img/cat.webp', words: ['kitten', 'lost', 'door'],
    text: ['{name} hears a little sound. Meow!', 'It is a small grey kitten.', 'The kitten is lost and sad.', '{name} and {friend} look for its home.',
      'They find a house with a blue door.', 'A man opens the door and smiles. "My kitten!"', 'The kitten purrs and purrs.'],
    q: [['What animal does {name} find?', '🐱 a kitten', '🐶 a puppy', '🦆 a duck'], ['How does the kitten feel at first?', '😢 sad', '😄 happy', '😴 sleepy'],
      ['What colour is the door?', '🔵 blue', '🔴 red', '🟡 yellow']],
  },
  picnic: {
    title: "{name}'s Picnic in the Park", pic: 'img/apple.webp', words: ['picnic', 'park', 'sandwich'],
    text: ['{name} and {friend} go to the park.', 'They have a picnic on a big rug.', 'They have apples, sandwiches and juice.', 'A cheeky dog runs up to the rug.',
      'Snap! The dog takes a sandwich!', 'Everyone laughs, and the dog wags its tail.'],
    q: [['Where do they have the picnic?', '🌳 at the park', '🏖️ at the beach', '🏫 at school'], ['What does the dog take?', '🥪 a sandwich', '🍎 an apple', '⚽ a ball'],
      ['What does everyone do?', '😄 laugh', '😢 cry', '😴 sleep']],
  },
  rocket: {
    title: '{name} Goes to the Moon', pic: '🚀', words: ['rocket', 'moon', 'jump'],
    text: ['{name} makes a rocket from a big box.', '3, 2, 1, blast off!', 'The rocket zooms up to the moon.', 'The moon is quiet and grey.',
      '{name} can jump very, very high!', 'Then {name} flies home for tea.'],
    q: [['What is the rocket made from?', '📦 a box', '🌳 a tree', '🚗 a car'], ['Where does the rocket go?', '🌙 the moon', '🌊 the sea', '🦁 the zoo'],
      ['What can {name} do on the moon?', '🦘 jump high', '🏊 swim', '🎂 bake a cake']],
  },
  rain: {
    title: '{name} and the Rainy Day', pic: 'img/rainbow.webp', words: ['rain', 'puddle', 'rainbow'],
    text: ['Drip, drop! It is raining.', '{name} puts on boots and a coat.', '{name} and {friend} go outside.', 'They jump in big puddles. Splash!',
      'Then the sun comes out.', 'They see a rainbow in the sky.'],
    q: [['What is the weather at the start?', '🌧️ rainy', '❄️ snowy', '☀️ sunny'], ['What do they jump in?', '💦 puddles', '🍂 leaves', '🏖️ sand'],
      ['What do they see at the end?', '🌈 a rainbow', '✈️ a plane', '🐦 a bird']],
  },
  turtle: {
    title: "{name}'s Turtle Wins the Race", pic: 'img/turtle.webp', words: ['turtle', 'race', 'slow'],
    text: ['{name} has a pet turtle called Speedy.', 'Speedy is very, very slow.', 'One day there is a race in the park.', 'The rabbit runs fast, then stops for a nap.',
      'Speedy keeps going, step by step.', 'Speedy wins the race! {name} and {friend} cheer.'],
    q: [['What is the turtle called?', 'Speedy', 'Sleepy', 'Spot'], ['Who stops for a nap?', '🐰 the rabbit', '🐢 Speedy', '🐶 the dog'],
      ['Who wins the race?', '🐢 Speedy', '🐰 the rabbit', '🦊 the fox']],
  },
};

function makeStory(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, 'Mia'), friend = nameOf(o.friend, 'Leo');
  const fill = (s) => s.replace(/\{name\}/g, name).replace(/\{friend\}/g, friend);
  const keys = o.story === 'all' ? Object.keys(STORIES) : [STORIES[o.story] ? o.story : 'balloon'];
  const big = o.text !== 'small';
  const pages = [];
  keys.forEach((key, si) => {
    const st = STORIES[key];
    const c = si % PALETTE.length;
    const pg = new Page(paper, fill(st.title), { subtitle: 'Read the story, then answer the questions.', noName: false });
    // Words to know
    let x = pg.left;
    pg.add(`<text x="${x}" y="${pg.y + 4}" font-family="${FONT}" font-weight="800" font-size="4" fill="${SOFT}">Words to know:</text>`);
    x += 33;
    for (const w of st.words) {
      const ww = w.length * 2.6 + 8;
      pg.add(`<rect x="${x}" y="${pg.y - 0.8}" width="${ww}" height="7" rx="3.5" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.4"/>`);
      pg.add(`<text x="${x + ww / 2}" y="${pg.y + 4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.4" fill="${INK}">${esc(w)}</text>`);
      x += ww + 3;
    }
    pg.y += 13;
    // The story
    const fs = big ? 6.4 : 5.2, lh = 1.62;
    const artW = big ? 44 : 38;
    const perLine = Math.floor((pg.width - artW - 16) / (fs * 0.5));
    const lines = [];
    st.text.map(fill).forEach((sen) => lines.push(...wrap(sen, perLine)));
    const boxH = Math.max(artW + 10, lines.length * fs * lh + 10);
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${boxH}" rx="7" fill="${TINTS[c]}"/>`);
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="2.4" height="${boxH}" rx="1.2" fill="${PALETTE[c]}"/>`);
    pg.add(pic(st.pic, pg.right - artW / 2 - 4, pg.y + artW / 2 + 5, artW));
    textLines(pg, lines, pg.left + 8, pg.y + 6 + fs, fs, { weight: 700, lh, font: FONT });
    pg.y += boxH + 5;
    pg.add(`<text x="${pg.left}" y="${pg.y + 3}" font-family="${FONT}" font-weight="700" font-size="4" fill="${SOFT}">Read it again and draw a ring around ${esc(name)} every time you see the name!</text>`);
    pg.y += 11;
    // Questions
    pg.add(`<text x="${pg.left}" y="${pg.y}" font-family="${TITLE_FONT}" font-weight="800" font-size="6.5" fill="${INK}">Questions</text>`);
    pg.y += 5;
    const write = o.answers === 'write';
    st.q.forEach(([q, ...opts], i) => {
      const qc = PALETTE[(c + i + 1) % PALETTE.length];
      pg.add(`<circle cx="${pg.left + 4}" cy="${pg.y + 4}" r="4" fill="${qc}"/><text x="${pg.left + 4}" y="${pg.y + 5.6}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.4" fill="#fff">${i + 1}</text>`);
      pg.add(`<text x="${pg.left + 11}" y="${pg.y + 5.6}" font-family="${FONT}" font-weight="800" font-size="5" fill="${INK}">${esc(fill(q))}</text>`);
      if (write) {
        pg.add(`<line x1="${pg.left + 11}" x2="${pg.right}" y1="${pg.y + 17}" y2="${pg.y + 17}" stroke="#7f78a8" stroke-width="0.4"/>`);
        pg.y += 23;
      } else {
        const order = shuffle(opts, rand);
        const cw = (pg.width - 11) / 3;
        order.forEach((t, k) => {
          const ox = pg.left + 11 + k * cw;
          pg.add(`<rect x="${ox}" y="${pg.y + 9.5}" width="5.5" height="5.5" rx="1.4" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`);
          pg.add(`<text x="${ox + 8}" y="${pg.y + 14}" font-family="${FONT}" font-weight="700" font-size="4.8" fill="${INK}">${esc(fill(t))}</text>`);
        });
        pg.y += 22;
      }
    });
    // Draw your favourite part
    const dh = pg.bottom - pg.y - 2;
    if (dh > 30) {
      pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${dh}" rx="6" fill="#fff" stroke="#b9b3d6" stroke-width="0.6" stroke-dasharray="2.5 1.6"/>`);
      pg.add(`<text x="${pg.left + 5}" y="${pg.y + 7}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${SOFT}">🖍️ Draw your favourite part of the story</text>`);
    }
    pages.push(pg.svg());
  });
  return pages;
}

// ================================================================ bingo
function bingoPool(o) {
  if (o.theme === 'words') {
    const w = [...new Set(listOf(o.words, 40).map((s) => s.slice(0, 14)))];
    for (const s of SIGHT_WORDS) if (w.length < 12 && !w.includes(s)) w.push(s);
    return w.map((s) => [s, '']);
  }
  if (o.theme === 'mix') return [...SETS.animals, ...SETS.food, ...SETS.things];
  return SETS[o.theme] || SETS.animals;
}

function bingoCard(pg, x, y, w, h, n, cells, opts) {
  const c = opts.colour;
  pg.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.9"/>`);
  const letters = 'BINGO';
  letters.split('').forEach((L, i) => {
    const cx = x + 12 + i * 13.5, cy = y + 11.5;
    pg.add(`<circle cx="${cx}" cy="${cy}" r="6" fill="${PALETTE[(c + i) % PALETTE.length]}"/>`);
    pg.add(`<text x="${cx}" y="${cy + 2.9}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="#fff">${L}</text>`);
  });
  if (opts.name) {
    const fs = fitFont(opts.name, 7.5, w - 90);
    pg.add(`<text x="${x + w - 8}" y="${y + 14}" text-anchor="end" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${esc(opts.name)}</text>`);
  } else {
    pg.add(`<text x="${x + 80}" y="${y + 14}" font-family="${FONT}" font-weight="700" font-size="3.8" fill="${SOFT}">Name</text>`);
    pg.add(`<line x1="${x + 92}" x2="${x + w - 8}" y1="${y + 14.5}" y2="${y + 14.5}" stroke="${SOFT}" stroke-width="0.3"/>`);
  }
  const top = y + 23;
  const cell = Math.min((w - 14) / n, (h - 29) / n);
  const gx = x + (w - cell * n) / 2;
  const free = opts.free && n % 2 === 1;
  const mid = Math.floor(n / 2);
  let k = 0;
  for (let r = 0; r < n; r++) {
    for (let q = 0; q < n; q++) {
      const cx = gx + q * cell, cy = top + r * cell;
      pg.add(`<rect x="${cx + 0.7}" y="${cy + 0.7}" width="${cell - 1.4}" height="${cell - 1.4}" rx="2.5" fill="#fff" stroke="${INK}" stroke-width="0.45"/>`);
      if (free && r === mid && q === mid) {
        pg.add(`<path d="${starPath(cx + cell / 2, cy + cell * 0.44, cell * 0.3)}" fill="#ffc93c"/>`);
        pg.add(`<text x="${cx + cell / 2}" y="${cy + cell * 0.88}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${cell * 0.15}" fill="${INK}">FREE</text>`);
        continue;
      }
      const [label, src] = cells[k++];
      if (src) {
        pg.add(pic(src, cx + cell / 2, cy + cell * (opts.words ? 0.42 : 0.5), cell * (opts.words ? 0.56 : 0.68)));
        if (opts.words) {
          const fs = fitFont(label, cell * 0.13, cell * 0.9, 0.55);
          pg.add(`<text x="${cx + cell / 2}" y="${cy + cell * 0.87}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${esc(label)}</text>`);
        }
      } else {
        const fs = fitFont(label, cell * 0.3, cell * 0.86, 0.56);
        pg.add(`<text x="${cx + cell / 2}" y="${cy + cell / 2 + fs * 0.35}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${esc(label)}</text>`);
      }
    }
  }
}

function makeBingo(o, paper) {
  const rand = rng(+o.seed || 1);
  const n = o.grid === '4' ? 4 : o.grid === '5' ? 5 : 3;
  const free = o.free !== false && n % 2 === 1;
  const need = n * n - (free ? 1 : 0);
  let pool = bingoPool(o);
  if (pool.length < need + 2) {
    const extra = o.theme === 'words' ? SIGHT_WORDS.map((s) => [s, '']) : [...SETS.animals, ...SETS.food, ...SETS.things];
    const have = new Set(pool.map(([l]) => l.toLowerCase()));
    for (const it of shuffle(extra, rand)) if (pool.length < need + 6 && !have.has(it[0].toLowerCase())) { pool = [...pool, it]; have.add(it[0].toLowerCase()); }
  }
  const names = listOf(o.names, 40).map((s) => nameOf(s, ''));
  const count = names.length || Math.max(1, Math.min(40, +o.cards || 6));
  const seen = new Set(), cards = [];
  for (let i = 0; i < count; i++) {
    let pick;
    for (let t = 0; t < 60; t++) {
      pick = shuffle(pool, rand).slice(0, need);
      const key = pick.map(([l]) => l).sort().join('|');
      if (!seen.has(key)) { seen.add(key); break; }
    }
    cards.push(pick);
  }
  const pages = [];
  const words = o.theme === 'words' ? false : o.labels !== false;
  for (let i = 0; i < cards.length; i += 2) {
    const pg = new Page(paper, '', { bare: true });
    const h = (pg.bottom - pg.m - 10) / 2;
    [0, 1].forEach((j) => {
      if (!cards[i + j]) return;
      bingoCard(pg, pg.left, pg.m + j * (h + 10), pg.width, h, n, cards[i + j], { name: names[i + j] || o.cardName || '', colour: (i + j) % PALETTE.length, free, words });
    });
    if (cards[i + 1]) scissors(pg, pg.m + h + 5);
    pages.push(pg.svg());
  }
  // Calling cards: every picture that is on a card
  const used = [];
  const got = new Set();
  for (const card of cards) for (const it of card) if (!got.has(it[0])) { got.add(it[0]); used.push(it); }
  if (o.caller !== false) {
    const pg = new Page(paper, 'Bingo calling cards', { subtitle: 'Cut out the cards, put them in a bag and pull out one at a time.', noName: true });
    let cols = 4;
    let cw, ch, rows;
    for (;; cols++) { cw = pg.width / cols; ch = cw * 0.86; rows = Math.ceil(used.length / cols); if (rows * ch <= pg.room || cols >= 8) break; }
    used.forEach(([label, src], i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      pg.add(`<rect x="${x + 0.6}" y="${y + 0.6}" width="${cw - 1.2}" height="${ch - 1.2}" rx="3" fill="${TINTS[i % TINTS.length]}" stroke="#c9c3e3" stroke-width="0.35" stroke-dasharray="2 1.4"/>`);
      if (src) {
        pg.add(pic(src, x + cw / 2, y + ch * 0.42, ch * 0.52));
        pg.add(`<text x="${x + cw / 2}" y="${y + ch * 0.86}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fitFont(label, ch * 0.12, cw * 0.9)}" fill="${INK}">${esc(label)}</text>`);
      } else {
        const fs = fitFont(label, ch * 0.3, cw * 0.86);
        pg.add(`<text x="${x + cw / 2}" y="${y + ch / 2 + fs * 0.35}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${esc(label)}</text>`);
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ birthday party pack
function balloonShape(cx, cy, r, colour) {
  const s = `<path d="M${cx} ${cy + r * 1.18} Q${cx - r * 0.5} ${cy + r * 1.6} ${cx + r * 0.1} ${cy + r * 2.1} T${cx} ${cy + r * 2.9}" fill="none" stroke="#9a93b8" stroke-width="0.45"/>`;
  return s + `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 1.18}" fill="${colour}"/>`
    + `<path d="M${cx - r * 0.16} ${cy + r * 1.3} L${cx + r * 0.16} ${cy + r * 1.3} L${cx} ${cy + r * 1.12} Z" fill="${colour}"/>`
    + `<ellipse cx="${cx - r * 0.38}" cy="${cy - r * 0.45}" rx="${r * 0.2}" ry="${r * 0.32}" fill="#fff" opacity="0.45" transform="rotate(-25 ${cx - r * 0.38} ${cy - r * 0.45})"/>`;
}

function bunting(pg, y, rand) {
  const x1 = pg.left - 4, x2 = pg.right + 4, sag = 9;
  pg.add(`<path d="M${x1} ${y} Q${(x1 + x2) / 2} ${y + sag * 2} ${x2} ${y}" fill="none" stroke="${INK}" stroke-width="0.4"/>`);
  const n = 13;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const x = x1 + (x2 - x1) * t, yy = y + 2 * sag * t * (1 - t) * 2;
    pg.add(`<path d="M${x - 5.5} ${yy} L${x + 5.5} ${yy} L${x} ${yy + 11} Z" fill="${PALETTE[i % PALETTE.length]}"/>`);
  }
}

function partyPoster(o, paper, name, age, rand) {
  const pg = new Page(paper, '', { bare: true });
  bunting(pg, pg.m + 2, rand);
  for (let i = 0; i < 70; i++) {
    const x = pg.left + rand() * pg.width, y = pg.m + 30 + rand() * (pg.h - 60);
    const c = PALETTE[Math.floor(rand() * PALETTE.length)];
    if (x > pg.left + 30 && x < pg.right - 30 && y > pg.m + 45 && y < pg.h - 70) continue;
    pg.add(rand() < 0.5 ? `<circle cx="${x}" cy="${y}" r="${0.8 + rand() * 1.2}" fill="${c}" opacity="0.8"/>` : `<rect x="${x}" y="${y}" width="2.6" height="1.2" rx="0.5" fill="${c}" opacity="0.8" transform="rotate(${Math.floor(rand() * 180)} ${x} ${y})"/>`);
  }
  const cx = pg.w / 2;
  pg.add(`<text x="${cx}" y="${pg.m + 52}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="20" fill="${PALETTE[0]}">Happy</text>`);
  const bd = `${age ? ordinal(age) + ' ' : ''}Birthday`;
  pg.add(`<text x="${cx}" y="${pg.m + 74}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(bd, 20, pg.width - 10, 0.5)}" fill="${PALETTE[3]}">${esc(bd)}</text>`);
  // Balloons with the age
  const digits = age ? String(age).split('') : ['★'];
  const r = 17, gap = r * 2.3;
  const start = cx - ((digits.length - 1) * gap) / 2;
  const by = pg.m + 112;
  pg.add(balloonShape(start - gap - 4, by + 12, r * 0.8, PALETTE[4]));
  pg.add(balloonShape(start + (digits.length - 1) * gap + gap + 4, by + 12, r * 0.8, PALETTE[2]));
  digits.forEach((d, i) => {
    const x = start + i * gap;
    pg.add(balloonShape(x, by, r, PALETTE[[0, 1, 3, 5][i % 4]]));
    pg.add(`<text x="${x}" y="${by + r * 0.52}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${r * 1.5}" fill="#fff">${esc(d)}</text>`);
  });
  const nfs = fitFont(name, 24, pg.width - 20, 0.52);
  pg.add(`<text x="${cx}" y="${by + 72}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${nfs}" fill="${INK}">${esc(name)}</text>`);
  pg.add(`<path d="M${cx - 45} ${by + 77} Q${cx} ${by + 85} ${cx + 45} ${by + 77}" fill="none" stroke="${PALETTE[1]}" stroke-width="1.4" stroke-linecap="round"/>`);
  pg.add(`<text x="${cx}" y="${by + 95}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="6" fill="${SOFT}">Today is a very special day!</text>`);
  pg.add(emoji('🎂', cx, by + 124, 34));
  pg.add(emoji('🎁', cx - 42, by + 128, 20));
  pg.add(emoji('🎉', cx + 42, by + 128, 20));
  return pg.svg();
}

function aboutMe(o, paper, name, age) {
  const pg = new Page(paper, `All about me at ${age || 'my birthday'}`, { subtitle: 'Fill it in, draw and keep it to remember this birthday.', noName: true });
  const gap = 4, colW = (pg.width - gap) / 2;
  const box = (x, y, w, h, label, icon, c, fillText) => {
    pg.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
    pg.add(emoji(icon, x + 7, y + 7, 7));
    pg.add(`<text x="${x + 13}" y="${y + 9}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">${esc(label)}</text>`);
    if (fillText) pg.add(`<text x="${x + w / 2}" y="${y + h / 2 + 6}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(fillText, 11, w - 10, 0.52)}" fill="${PALETTE[c]}">${esc(fillText)}</text>`);
    else pg.add(`<line x1="${x + 6}" x2="${x + w - 6}" y1="${y + h - 7}" y2="${y + h - 7}" stroke="#9a93b8" stroke-width="0.4"/>`);
  };
  let y = pg.y;
  // Draw me + name and age
  const bigH = 88;
  pg.add(`<rect x="${pg.left}" y="${y}" width="${colW}" height="${bigH}" rx="6" fill="#fff" stroke="${PALETTE[0]}" stroke-width="0.8" stroke-dasharray="2.5 1.5"/>`);
  pg.add(`<text x="${pg.left + 5}" y="${y + 8}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">🖍️ This is me!</text>`);
  box(pg.left + colW + gap, y, colW, 26, 'My name is', '✏️', 3, name);
  box(pg.left + colW + gap, y + 30, colW, 26, 'I am this many years old', '🎂', 1, age ? String(age) : '');
  // Candles to colour
  const cy = y + 60, cx0 = pg.left + colW + gap;
  pg.add(`<rect x="${cx0}" y="${cy}" width="${colW}" height="28" rx="5" fill="#fff" stroke="${PALETTE[5]}" stroke-width="0.6"/>`);
  pg.add(`<text x="${cx0 + 5}" y="${cy + 7}" font-family="${FONT}" font-weight="800" font-size="4" fill="${INK}">Colour one candle for every year</text>`);
  const nC = Math.max(1, Math.min(12, age || 5));
  const cw = Math.min(7, (colW - 12) / nC);
  for (let i = 0; i < nC; i++) {
    const x = cx0 + (colW - nC * cw) / 2 + i * cw + cw / 2;
    pg.add(`<rect x="${x - cw * 0.22}" y="${cy + 13}" width="${cw * 0.44}" height="11" rx="1" fill="#fff" stroke="${INK}" stroke-width="0.4"/>`);
    pg.add(`<path d="M${x} ${cy + 8.5} Q${x + 1.6} ${cy + 11} ${x} ${cy + 12.6} Q${x - 1.6} ${cy + 11} ${x} ${cy + 8.5} Z" fill="#fff" stroke="${INK}" stroke-width="0.35"/>`);
  }
  y += bigH + gap;
  const items = [['My favourite colour', '🎨'], ['My favourite food', '🍕'], ['My favourite animal', '🐾'], ['My favourite toy', '🧸'],
    ['My best friends', '🤝'], ['I am really good at', '⭐'], ['When I grow up I want to be', '🚀'], ['This year I want to learn', '📚']];
  const rowH = 21;
  items.forEach(([label, icon], i) => {
    const x = pg.left + (i % 2) * (colW + gap), yy = y + Math.floor(i / 2) * (rowH + gap);
    box(x, yy, colW, rowH, label, icon, (i + 2) % PALETTE.length);
  });
  y += Math.ceil(items.length / 2) * (rowH + gap);
  const hh = pg.bottom - y - 1;
  if (hh > 30) {
    pg.add(`<rect x="${pg.left}" y="${y}" width="${colW}" height="${hh}" rx="6" fill="#fff" stroke="${PALETTE[2]}" stroke-width="0.8" stroke-dasharray="2.5 1.5"/>`);
    pg.add(`<text x="${pg.left + 5}" y="${y + 8}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">🖐️ My hand print</text>`);
    box(pg.left + colW + gap, y, colW, hh / 2 - 2, 'How tall I am', '📏', 6);
    box(pg.left + colW + gap, y + hh / 2 + 2, colW, hh / 2 - 2, 'The best thing about today', '🎉', 0);
  }
  return pg.svg();
}

function thankYouCards(o, paper, name, guests) {
  const pages = [];
  const list = guests.length ? guests : ['', '', '', ''];
  for (let i = 0; i < list.length; i += 4) {
    const pg = new Page(paper, '', { bare: true });
    const w = pg.width / 2, h = (pg.bottom - pg.m) / 2;
    for (let j = 0; j < 4; j++) {
      const g = list[i + j];
      if (g === undefined) break;
      const x = pg.left + (j % 2) * w, y = pg.m + Math.floor(j / 2) * h;
      const c = (i + j) % PALETTE.length;
      pg.add(`<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="7" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.9"/>`);
      pg.add(`<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="8" fill="none" stroke="#c9c3e3" stroke-width="0.3" stroke-dasharray="2 1.5"/>`);
      pg.add(`<text x="${x + w / 2}" y="${y + 28}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="13" fill="${PALETTE[c]}">Thank you</text>`);
      pg.add(`<text x="${x + w / 2}" y="${y + 38}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">for coming to my party!</text>`);
      pg.add(balloonShape(x + w / 2 - 26, y + 55, 6.5, PALETTE[(c + 2) % PALETTE.length]));
      pg.add(balloonShape(x + w / 2 + 26, y + 55, 6.5, PALETTE[(c + 4) % PALETTE.length]));
      pg.add(emoji('🎂', x + w / 2, y + 62, 20));
      const gy = y + h - 36;
      pg.add(`<text x="${x + 12}" y="${gy}" font-family="${FONT}" font-weight="700" font-size="4.4" fill="${SOFT}">Dear</text>`);
      if (g) pg.add(`<text x="${x + 25}" y="${gy}" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(nameOf(g, ''), 6, w - 40)}" fill="${INK}">${esc(nameOf(g, ''))}</text>`);
      else pg.add(`<line x1="${x + 24}" x2="${x + w - 12}" y1="${gy + 0.5}" y2="${gy + 0.5}" stroke="#9a93b8" stroke-width="0.35"/>`);
      pg.add(`<line x1="${x + 12}" x2="${x + w - 12}" y1="${gy + 10}" y2="${gy + 10}" stroke="#d9d4ec" stroke-width="0.35"/>`);
      pg.add(`<text x="${x + 12}" y="${gy + 22}" font-family="${FONT}" font-weight="700" font-size="4.4" fill="${SOFT}">Love from</text>`);
      pg.add(`<text x="${x + 34}" y="${gy + 22}" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(name, 6, w - 49)}" fill="${INK}">${esc(name)}</text>`);
    }
    pages.push(pg.svg());
  }
  return pages;
}

function makeParty(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, 'Emma');
  const age = Math.max(0, Math.min(12, +o.age || 0));
  const guests = listOf(o.guests, 30).map((g) => nameOf(g, ''));
  const pages = [];
  if (o.poster !== false) pages.push(partyPoster(o, paper, name, age, rand));
  if (o.aboutme !== false) pages.push(aboutMe(o, paper, name, age));
  if (o.search !== false) {
    const words = [name, ...guests].map((g) => cleanText(g).toUpperCase()).filter((g) => g.length >= 2 && g.length <= 11);
    for (const w of ['CAKE', 'PARTY', 'GIFT', 'BALLOON', 'CANDLE', 'GAMES', 'FRIENDS', 'HAPPY']) if (words.length < 12 && !words.includes(w)) words.push(w);
    pages.push(...makeWordSearch({ seed: o.seed, words: [...new Set(words)].slice(0, 14).join(','), title: `${possessive(name)} Party Word Search`, size: '12', level: 'easy', key: false }, paper));
  }
  if (o.bingo !== false) pages.push(...makeBingo({ seed: o.seed, theme: 'party', grid: '3', cards: '4', names: guests.join('\n'), free: true, labels: true }, paper));
  if (o.thanks !== false) pages.push(...thankYouCards(o, paper, name, guests));
  if (!pages.length) {
    const pg = new Page(paper, 'Birthday party pack', { subtitle: 'Tick at least one page to include.', noName: true });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ certificates
const AWARDS = {
  star: ['Star of the Week', 'for shining brightly all week long'],
  reading: ['Super Reader', 'for reading every day and loving books'],
  writing: ['Wonderful Writer', 'for beautiful writing and great ideas'],
  maths: ['Maths Whizz', 'for brilliant counting and clever thinking'],
  kindness: ['Kindness Award', 'for always being kind and helpful to others'],
  listening: ['Great Listener', 'for listening so well and trying so hard'],
  brave: ['Bravery Award', 'for being so brave'],
  helper: ['Super Helper', 'for being such a wonderful helper'],
  potty: ['Potty Champion', 'for learning to use the potty like a big kid'],
  sports: ['Sports Star', 'for amazing effort and great teamwork'],
  times: ['Times Tables Champion', 'for learning the times tables'],
  custom: ['Well Done', ''],
};
const CERT_STYLES = {
  rainbow: { a: '#ff6b6b', b: '#6c8cff', bg: '#fffaf3', deco: ['🌈', '⭐', '🎈', '✨'] },
  gold: { a: '#d9a21b', b: '#8a5a00', bg: '#fffdf4', deco: ['⭐', '🏆', '⭐', '✨'] },
  space: { a: '#7b61ff', b: '#35b5e5', bg: '#f6f5ff', deco: ['🚀', '🪐', '⭐', '🌙'] },
  nature: { a: '#2fae94', b: '#8bc34a', bg: '#f4fbf3', deco: ['🌸', '🦋', '🌼', '🐝'] },
};

function rosette(cx, cy, r, st) {
  let s = `<path d="M${cx - r * 0.35} ${cy + r * 0.5} L${cx - r * 0.95} ${cy + r * 2.1} L${cx - r * 0.55} ${cy + r * 1.85} L${cx - r * 0.3} ${cy + r * 2.25} L${cx + r * 0.05} ${cy + r * 0.6} Z" fill="${st.b}"/>`;
  s += `<path d="M${cx + r * 0.35} ${cy + r * 0.5} L${cx + r * 0.95} ${cy + r * 2.1} L${cx + r * 0.55} ${cy + r * 1.85} L${cx + r * 0.3} ${cy + r * 2.25} L${cx - r * 0.05} ${cy + r * 0.6} Z" fill="${st.a}"/>`;
  let d = '';
  for (let i = 0; i < 48; i++) {
    const a = (i * Math.PI) / 24, rr = i % 2 ? r * 0.9 : r;
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(2)} ${(cy + Math.sin(a) * rr).toFixed(2)} `;
  }
  s += `<path d="${d}Z" fill="${st.a}"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="#fff"/><circle cx="${cx}" cy="${cy}" r="${r * 0.64}" fill="none" stroke="${st.a}" stroke-width="0.5"/>`;
  s += `<path d="${starPath(cx, cy, r * 0.46, 0.46)}" fill="#ffc93c" stroke="${st.b}" stroke-width="0.35"/>`;
  return s;
}

function makeCertificate(o, paper) {
  const [defTitle, defReason] = AWARDS[o.award] || AWARDS.star;
  const title = (o.award === 'custom' && o.title ? o.title : defTitle).slice(0, 36);
  const reason = String(o.reason || '').trim() || defReason;
  const names = listOf(o.names, 40).map((n) => nameOf(n, ''));
  if (!names.length) names.push('');
  const st = CERT_STYLES[o.style] || CERT_STYLES.rainbow;
  const date = String(o.date || '').trim() || new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  const from = String(o.from || '').trim().slice(0, 40);
  return names.map((name, i) => {
    const pg = new Page(paper, '', { bare: true, landscape: true, tint: st.bg });
    pg.footer = () => {};
    const W = pg.w, H = pg.h, cx = W / 2, id = `g${i}`;
    pg.add(`<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${st.a}"/><stop offset="1" stop-color="${st.b}"/></linearGradient></defs>`);
    pg.add(`<rect x="8" y="8" width="${W - 16}" height="${H - 16}" rx="7" fill="none" stroke="url(#${id})" stroke-width="3.2"/>`);
    pg.add(`<rect x="13" y="13" width="${W - 26}" height="${H - 26}" rx="4" fill="none" stroke="${st.a}" stroke-width="0.4" stroke-dasharray="1.2 1.2"/>`);
    [[24, 25], [W - 24, 25], [24, H - 25], [W - 24, H - 25]].forEach(([x, y], k) => pg.add(emoji(st.deco[k], x, y, 12)));
    const sc = H / 210;
    pg.add(rosette(cx, 32 * sc, 14 * sc, st));
    pg.add(`<text x="${cx}" y="${76 * sc}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.6" letter-spacing="2" fill="${SOFT}">CERTIFICATE OF ACHIEVEMENT</text>`);
    pg.add(`<text x="${cx}" y="${96 * sc}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(title, 17, W - 80, 0.5)}" fill="url(#${id})">${esc(title)}</text>`);
    pg.add(`<text x="${cx}" y="${108 * sc}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="5" fill="${SOFT}">is proudly awarded to</text>`);
    if (name) pg.add(`<text x="${cx}" y="${130 * sc}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(name, 22, W - 90, 0.52)}" fill="${INK}">${esc(name)}</text>`);
    pg.add(`<path d="M${cx - 62} ${136 * sc} Q${cx} ${143 * sc} ${cx + 62} ${136 * sc}" fill="none" stroke="${st.a}" stroke-width="0.9" stroke-linecap="round"/>`);
    wrap(reason, 70).slice(0, 2).forEach((l, k) => pg.add(`<text x="${cx}" y="${(151 + k * 7) * sc}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="5.4" fill="${INK}">${esc(l)}</text>`));
    const ly = 178 * sc;
    pg.add(`<line x1="${W * 0.16}" x2="${W * 0.4}" y1="${ly}" y2="${ly}" stroke="${INK}" stroke-width="0.35"/>`);
    pg.add(`<line x1="${W * 0.6}" x2="${W * 0.84}" y1="${ly}" y2="${ly}" stroke="${INK}" stroke-width="0.35"/>`);
    if (from) pg.add(`<text x="${W * 0.28}" y="${ly - 2.5}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="700" font-size="6" fill="${INK}">${esc(from)}</text>`);
    pg.add(`<text x="${W * 0.72}" y="${ly - 2.5}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="700" font-size="6" fill="${INK}">${esc(date)}</text>`);
    pg.add(`<text x="${W * 0.28}" y="${ly + 5}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="3.6" fill="${SOFT}">From</text>`);
    pg.add(`<text x="${W * 0.72}" y="${ly + 5}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="3.6" fill="${SOFT}">Date</text>`);
    [[W * 0.12, 70], [W * 0.88, 70], [W * 0.1, 120], [W * 0.9, 120], [W * 0.18, 150], [W * 0.82, 150]].forEach(([x, y], k) => {
      pg.add(`<path d="${starPath(x, y * sc, 2.4 + (k % 2), 0.45)}" fill="${k % 2 ? st.a : st.b}" opacity="0.5"/>`);
    });
    return pg.svg();
  });
}

// ================================================================ dot to dot
const DOT_SHAPES = {
  star: { name: 'star', path: 'M50 4 L61 37 L96 37 L68 58 L79 92 L50 71 L21 92 L32 58 L4 37 L39 37 Z' },
  heart: { name: 'heart', path: 'M50 28 C50 8 14 2 7 28 C2 48 24 70 50 92 C76 70 98 48 93 28 C86 2 50 8 50 28 Z' },
  house: { name: 'house', path: 'M18 94 L18 50 L8 50 L50 10 L62 21 L62 10 L73 10 L73 32 L92 50 L82 50 L82 94 Z',
    decor: 'M42 94 L42 70 L58 70 L58 94 M26 58 L37 58 L37 68 L26 68 Z M63 58 L74 58 L74 68 L63 68 Z' },
  fish: { name: 'fish', path: 'M6 50 C22 22 58 20 74 44 L94 24 L90 50 L94 76 L74 56 C58 80 22 78 6 50 Z',
    decor: 'M19 45 A3 3 0 1 0 25 45 A3 3 0 1 0 19 45 M42 36 Q50 50 42 64' },
  rocket: { name: 'rocket', path: 'M50 3 C64 14 70 34 68 60 L82 74 L80 93 L65 82 L35 82 L20 93 L18 74 L32 60 C30 34 36 14 50 3 Z',
    decor: 'M42 36 A8 8 0 1 0 58 36 A8 8 0 1 0 42 36 M40 60 L60 60' },
  apple: { name: 'apple', path: 'M50 28 C36 14 7 18 9 50 C11 80 34 97 50 88 C66 97 89 80 91 50 C93 18 64 14 50 28 Z',
    decor: 'M50 28 Q49 16 54 6 M53 16 Q66 4 76 12 Q64 22 53 16' },
  cat: { name: 'cat', path: 'M14 34 L20 4 L40 22 C46 20 54 20 60 22 L80 4 L86 34 C96 56 88 88 50 92 C12 88 4 56 14 34 Z',
    decor: 'M29 50 A4 4 0 1 0 37 50 A4 4 0 1 0 29 50 M63 50 A4 4 0 1 0 71 50 A4 4 0 1 0 63 50 M46 63 L54 63 L50 68 Z M50 68 Q45 75 39 71 M50 68 Q55 75 61 71 M31 64 L12 60 M31 68 L12 71 M69 64 L88 60 M69 68 L88 71' },
  umbrella: { name: 'umbrella', path: 'M4 52 C10 12 90 12 96 52 Q85 42 73 52 Q62 42 50 52 Q38 42 27 52 Q16 42 4 52 Z',
    decor: 'M50 52 L50 86 Q50 94 42 94 Q35 94 35 87' },
  balloon: { name: 'balloon', path: 'M50 4 C78 4 90 32 82 54 C75 70 60 78 54 80 L57 87 L43 87 L46 80 C40 78 25 70 18 54 C10 32 22 4 50 4 Z',
    decor: 'M50 87 Q44 91 50 95 Q56 99 50 102' },
  crown: { name: 'crown', path: 'M10 80 L6 28 L30 52 L50 16 L70 52 L94 28 L90 80 Z',
    decor: 'M9 70 L91 70 M27 75 A3 3 0 1 0 33 75 A3 3 0 1 0 27 75 M47 75 A3 3 0 1 0 53 75 A3 3 0 1 0 47 75 M67 75 A3 3 0 1 0 73 75 A3 3 0 1 0 67 75' },
  moon: { name: 'moon', path: 'M62 4 C30 8 12 32 14 54 C17 80 42 97 70 94 C50 86 36 70 36 50 C36 30 46 14 62 4 Z',
    decor: 'M24 52 A2.5 2.5 0 1 0 29 52 A2.5 2.5 0 1 0 24 52' },
  butterfly: { name: 'butterfly', path: 'M50 34 C44 12 18 4 8 16 C0 28 14 46 42 48 C18 52 8 68 16 82 C26 94 44 82 50 62 C56 82 74 94 84 82 C92 68 82 52 58 48 C86 46 100 28 92 16 C82 4 56 12 50 34 Z',
    decor: 'M50 34 L50 62 M50 34 Q46 20 40 14 M50 34 Q54 20 60 14 M24 26 A4 4 0 1 0 32 26 A4 4 0 1 0 24 26 M68 26 A4 4 0 1 0 76 26 A4 4 0 1 0 68 26' },
};

function flattenPath(d) {
  const tok = d.match(/[MLCQZ]|-?[\d.]+/g);
  const segs = [];
  let i = 0, cur = null, start = null;
  const num = () => parseFloat(tok[i++]);
  const bez = (p0, pts, steps = 40) => {
    const out = [];
    for (let k = 0; k <= steps; k++) {
      const t = k / steps, u = 1 - t;
      if (pts.length === 3) out.push([u * u * u * p0[0] + 3 * u * u * t * pts[0][0] + 3 * u * t * t * pts[1][0] + t * t * t * pts[2][0], u * u * u * p0[1] + 3 * u * u * t * pts[0][1] + 3 * u * t * t * pts[1][1] + t * t * t * pts[2][1]]);
      else out.push([u * u * p0[0] + 2 * u * t * pts[0][0] + t * t * pts[1][0], u * u * p0[1] + 2 * u * t * pts[0][1] + t * t * pts[1][1]]);
    }
    return out;
  };
  while (i < tok.length) {
    const c = tok[i++];
    if (c === 'M') { cur = [num(), num()]; start = cur; }
    else if (c === 'L') { const p = [num(), num()]; segs.push([cur, p]); cur = p; }
    else if (c === 'C') { const pts = [[num(), num()], [num(), num()], [num(), num()]]; segs.push(bez(cur, pts)); cur = pts[2]; }
    else if (c === 'Q') { const pts = [[num(), num()], [num(), num()]]; segs.push(bez(cur, pts)); cur = pts[1]; }
    else if (c === 'Z') { if (Math.hypot(cur[0] - start[0], cur[1] - start[1]) > 0.01) segs.push([cur, start]); cur = start; }
  }
  return segs;
}

function dotPoints(shape, want) {
  let segs;
  if (shape.param) {
    const pts = [];
    for (let k = 0; k <= 600; k++) pts.push(shape.param((k / 600) * Math.PI * 2));
    segs = [pts];
  } else segs = flattenPath(shape.path);
  const lens = segs.map((s) => { let L = 0; for (let k = 1; k < s.length; k++) L += Math.hypot(s[k][0] - s[k - 1][0], s[k][1] - s[k - 1][1]); return L; });
  const N = Math.max(want, segs.length, shape.min || 0);
  const total = lens.reduce((a, b) => a + b, 0);
  const extra = N - segs.length;
  const raw = lens.map((L) => (extra * L) / total);
  const alloc = raw.map(Math.floor);
  let left = extra - alloc.reduce((a, b) => a + b, 0);
  raw.map((r, k) => [r - alloc[k], k]).sort((a, b) => b[0] - a[0]).slice(0, left).forEach(([, k]) => alloc[k]++);
  const out = [];
  segs.forEach((s, si) => {
    out.push(s[0]);
    const L = lens[si], m = alloc[si];
    let acc = 0, k = 1;
    for (let j = 1; j <= m; j++) {
      const target = (L * j) / (m + 1);
      while (k < s.length) {
        const d = Math.hypot(s[k][0] - s[k - 1][0], s[k][1] - s[k - 1][1]);
        if (acc + d >= target) { const t = (target - acc) / d; out.push([s[k - 1][0] + (s[k][0] - s[k - 1][0]) * t, s[k - 1][1] + (s[k][1] - s[k - 1][1]) * t]); break; }
        acc += d; k++;
      }
    }
  });
  return { pts: out, segs };
}

function dotLabel(i, mode) {
  if (mode === 'abc') return String.fromCharCode(65 + (i % 26));
  const step = { '2': 2, '5': 5, '10': 10 }[mode] || 1;
  return String((i + 1) * step);
}

function drawDots(pg, shape, want, mode, x, y, w, h, solved) {
  const n = mode === 'abc' ? Math.min(want, 26) : want;
  const { pts, segs } = dotPoints(shape, n);
  const all = segs.flat();
  const minX = Math.min(...all.map((p) => p[0])), maxX = Math.max(...all.map((p) => p[0]));
  const minY = Math.min(...all.map((p) => p[1])), maxY = Math.max(...all.map((p) => p[1]));
  const s = Math.min((w - 16) / (maxX - minX), (h - 16) / (maxY - minY));
  const ox = x + (w - (maxX - minX) * s) / 2 - minX * s, oy = y + (h - (maxY - minY) * s) / 2 - minY * s;
  const P = pts.map(([px, py]) => [ox + px * s, oy + py * s]);
  const T = `translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${s.toFixed(4)})`;
  const sw = (mm) => (mm / s).toFixed(3);
  if (solved) {
    const d = 'M' + P.map((p) => p.map((v) => v.toFixed(2)).join(' ')).join(' L') + ' Z';
    pg.add(`<path d="${d}" fill="#fff4d6" stroke="${INK}" stroke-width="0.7" stroke-linejoin="round"/>`);
  }
  if (shape.decor) pg.add(`<path d="${shape.decor}" transform="${T}" fill="none" stroke="${INK}" stroke-width="${sw(0.5)}" stroke-linecap="round" stroke-linejoin="round"/>`);
  if (solved) return;
  const cx = P.reduce((a, p) => a + p[0], 0) / P.length, cy = P.reduce((a, p) => a + p[1], 0) / P.length;
  const fs = Math.max(2.6, Math.min(3.8, w / 55));
  const placed = [];
  P.forEach((p, i) => {
    const prev = P[(i - 1 + P.length) % P.length], next = P[(i + 1) % P.length];
    let nx = -(next[1] - prev[1]), ny = next[0] - prev[0];
    const len = Math.hypot(nx, ny) || 1;
    nx /= len; ny /= len;
    if ((p[0] - cx) * nx + (p[1] - cy) * ny < 0) { nx = -nx; ny = -ny; }
    const label = dotLabel(i, mode);
    const lw = label.length * fs * 0.55;
    let best = null;
    for (const turn of [0, 0.5, -0.5, 1, -1, 1.5, -1.5, Math.PI]) {
      const ax = nx * Math.cos(turn) - ny * Math.sin(turn), ay = nx * Math.sin(turn) + ny * Math.cos(turn);
      const lx = p[0] + ax * (fs * 0.9 + lw * 0.3), ly = p[1] + ay * fs * 0.9;
      const clash = placed.some(([qx, qy, qw]) => Math.abs(qx - lx) < (qw + lw) / 2 + 0.4 && Math.abs(qy - ly) < fs * 0.95)
        || P.some((q) => Math.abs(q[0] - lx) < lw / 2 + 0.9 && Math.abs(q[1] - ly) < fs * 0.55 + 0.9);
      if (!clash) { best = [lx, ly]; break; }
      if (!best) best = [lx, ly];
    }
    placed.push([best[0], best[1], lw]);
    pg.add(`<text x="${best[0].toFixed(2)}" y="${(best[1] + fs * 0.35).toFixed(2)}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fs.toFixed(2)}" fill="${i === 0 ? '#2e9d63' : '#5b5580'}">${label}</text>`);
  });
  P.forEach((p, i) => pg.add(`<circle cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="${i === 0 ? 1.4 : 0.85}" fill="${i === 0 ? '#3fbf7f' : INK}"/>`));
  const first = P[0];
  pg.add(`<text x="${first[0].toFixed(2)}" y="${(first[1] - 3.2).toFixed(2)}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${(fs * 0.85).toFixed(2)}" fill="#2e9d63">start</text>`);
}

function makeDots(o, paper) {
  const rand = rng(+o.seed || 1);
  const want = Math.max(10, Math.min(60, +o.dots || 20));
  const mode = o.count || '1';
  const howMany = Math.max(1, Math.min(6, +o.puzzles || 1));
  let keys = o.shape && DOT_SHAPES[o.shape] ? [o.shape] : [];
  const pool = shuffle(Object.keys(DOT_SHAPES), rand);
  while (keys.length < howMany) keys.push(pool[keys.length % pool.length]);
  keys = keys.slice(0, howMany);
  const per = o.layout === 'two' ? 2 : 1;
  const sub = { '1': 'Join the dots from 1, then colour it in!', '2': 'Count in twos to join the dots: 2, 4, 6...', '5': 'Count in fives to join the dots: 5, 10, 15...', '10': 'Count in tens to join the dots: 10, 20, 30...', abc: 'Join the letters from A to Z, then colour it in!' }[mode];
  const pages = [];
  for (let i = 0; i < keys.length; i += per) {
    const pg = new Page(paper, 'Dot to dot: what will it be?', { subtitle: sub });
    const each = (pg.room - 2) / per;
    for (let j = 0; j < per && keys[i + j]; j++) {
      const y = pg.y + j * each;
      drawDots(pg, DOT_SHAPES[keys[i + j]], want, mode, pg.left, y, pg.width, each - 14, false);
      pg.add(`<text x="${pg.left + 4}" y="${y + each - 6}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${SOFT}">It is a</text>`);
      pg.add(`<line x1="${pg.left + 21}" x2="${pg.left + 80}" y1="${y + each - 5.5}" y2="${y + each - 5.5}" stroke="#9a93b8" stroke-width="0.4"/>`);
      if (j < per - 1 && keys[i + j + 1]) pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${y + each - 1}" y2="${y + each - 1}" stroke="#ece9f6" stroke-width="0.4"/>`);
    }
    pages.push(pg.svg());
  }
  if (o.key !== false) {
    const pg = new Page(paper, 'Dot to dot: answers', { subtitle: 'What each picture turns into.', noName: true });
    const cols = keys.length > 1 ? 2 : 1, rows = Math.ceil(keys.length / cols);
    const cw = pg.width / cols, chh = Math.min(90, (pg.room - 4) / rows);
    keys.forEach((k, i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * chh;
      drawDots(pg, DOT_SHAPES[k], want, mode, x, y, cw, chh - 10, true);
      pg.add(`<text x="${x + cw / 2}" y="${y + chh - 4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="5" fill="${INK}">a ${DOT_SHAPES[k].name}</text>`);
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ picture sudoku
function sudokuCount(g, n, bw, bh, limit) {
  const i = g.indexOf(0);
  if (i < 0) return 1;
  const r = Math.floor(i / n), c = i % n;
  let count = 0;
  for (let v = 1; v <= n && count < limit; v++) {
    if (!sudokuOk(g, n, bw, bh, r, c, v)) continue;
    g[i] = v;
    count += sudokuCount(g, n, bw, bh, limit - count);
    g[i] = 0;
  }
  return count;
}

function sudokuOk(g, n, bw, bh, r, c, v) {
  for (let k = 0; k < n; k++) if (g[r * n + k] === v || g[k * n + c] === v) return false;
  const br = r - (r % bh), bc = c - (c % bw);
  for (let y = br; y < br + bh; y++) for (let x = bc; x < bc + bw; x++) if (g[y * n + x] === v) return false;
  return true;
}

function sudokuFill(g, n, bw, bh, rand) {
  const i = g.indexOf(0);
  if (i < 0) return true;
  const r = Math.floor(i / n), c = i % n;
  for (const v of shuffle([...Array(n)].map((_, k) => k + 1), rand)) {
    if (!sudokuOk(g, n, bw, bh, r, c, v)) continue;
    g[i] = v;
    if (sudokuFill(g, n, bw, bh, rand)) return true;
    g[i] = 0;
  }
  return false;
}

function sudokuPuzzle(n, bw, bh, givens, rand) {
  const full = Array(n * n).fill(0);
  sudokuFill(full, n, bw, bh, rand);
  const puzzle = [...full];
  let filled = n * n;
  for (const i of shuffle([...Array(n * n).keys()], rand)) {
    if (filled <= givens) break;
    const keep = puzzle[i];
    puzzle[i] = 0;
    if (sudokuCount([...puzzle], n, bw, bh, 2) !== 1) puzzle[i] = keep;
    else filled--;
  }
  return { full, puzzle };
}

function drawSudoku(pg, x, y, size, n, bw, bh, grid, symbols, small) {
  const cell = size / n;
  pg.add(`<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="2.5" fill="#fff"/>`);
  for (let k = 1; k < n; k++) {
    const thickV = k % bw === 0, thickH = k % bh === 0;
    pg.add(`<line x1="${x + k * cell}" x2="${x + k * cell}" y1="${y}" y2="${y + size}" stroke="${thickV ? INK : '#b9b3d6'}" stroke-width="${thickV ? 0.9 : 0.35}"/>`);
    pg.add(`<line x1="${x}" x2="${x + size}" y1="${y + k * cell}" y2="${y + k * cell}" stroke="${thickH ? INK : '#b9b3d6'}" stroke-width="${thickH ? 0.9 : 0.35}"/>`);
  }
  pg.add(`<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="2.5" fill="none" stroke="${INK}" stroke-width="1.1"/>`);
  grid.forEach((v, i) => {
    if (!v) return;
    const cx = x + (i % n + 0.5) * cell, cy = y + (Math.floor(i / n) + 0.5) * cell;
    const sym = symbols[v - 1];
    if (sym.src) pg.add(pic(sym.src, cx, cy, cell * 0.74));
    else pg.add(`<text x="${cx}" y="${cy + cell * 0.2}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${cell * 0.56}" fill="${small ? '#e0457b' : INK}">${v}</text>`);
  });
}

function makeSudoku(o, paper) {
  const rand = rng(+o.seed || 1);
  const n = o.size === '6' ? 6 : 4;
  const bw = n === 6 ? 3 : 2, bh = 2;
  const level = o.level || 'easy';
  const givens = n === 4 ? { easy: 10, medium: 8, hard: 6 }[level] : { easy: 24, medium: 20, hard: 16 }[level];
  const perPage = n === 4 ? 4 : 2;
  const count = perPage * Math.max(1, Math.min(4, +o.pages || 1));
  const pictures = o.symbols !== 'numbers';
  const pages = [];
  const puzzles = [];
  for (let p = 0; p < count; p++) {
    const symbols = pictures ? shuffle(PAINTED, rand).slice(0, n).map(([name, src]) => ({ name, src })) : [...Array(n)].map((_, k) => ({ name: String(k + 1) }));
    puzzles.push({ ...sudokuPuzzle(n, bw, bh, givens, rand), symbols });
  }
  const rule = n === 4 ? 'Each row, column and box of 4 has every picture once.' : 'Each row, column and box of 6 has every one once.';
  for (let p = 0; p < puzzles.length; p += perPage) {
    const pg = new Page(paper, n === 4 ? 'Picture sudoku' : 'Sudoku 6 by 6', { subtitle: pictures ? `${rule} Draw it, or write its number.` : rule.replace('picture', 'number') });
    const cols = n === 4 ? 2 : 1;
    const slotW = pg.width / cols, slotH = (pg.room - 2) / (perPage / cols);
    puzzles.slice(p, p + perPage).forEach((pz, k) => {
      const sx = pg.left + (k % cols) * slotW, sy = pg.y + Math.floor(k / cols) * slotH;
      const keyH = pictures ? 20 : 0;
      const size = Math.min(slotW - 12, slotH - keyH - 8);
      const gx = sx + (slotW - size) / 2;
      if (pictures) {
        const kw = Math.min(26, (slotW - 8) / n);
        const kx = sx + (slotW - kw * n) / 2;
        pz.symbols.forEach((sym, j) => {
          pg.add(`<rect x="${kx + j * kw + 1}" y="${sy}" width="${kw - 2}" height="16" rx="3" fill="${TINTS[j % TINTS.length]}"/>`);
          pg.add(pic(sym.src, kx + j * kw + kw / 2 - 3, sy + 8, 11));
          pg.add(`<text x="${kx + j * kw + kw - 5}" y="${sy + 10}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="${PALETTE[j % PALETTE.length]}">${j + 1}</text>`);
        });
      }
      drawSudoku(pg, gx, sy + keyH, size, n, bw, bh, pz.puzzle, pz.symbols, false);
    });
    pages.push(pg.svg());
  }
  if (o.key !== false) {
    const pg = new Page(paper, 'Sudoku answers', { subtitle: 'Answer key for grown-ups.', noName: true });
    const cols = n === 4 ? 4 : 3;
    const size = Math.min(pg.width / cols - 8, 44);
    puzzles.forEach((pz, k) => {
      const x = pg.left + (k % cols) * (pg.width / cols) + (pg.width / cols - size) / 2, y = pg.y + 6 + Math.floor(k / cols) * (size + 12);
      pg.add(`<text x="${x}" y="${y - 2}" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${SOFT}">Puzzle ${k + 1}</text>`);
      drawSudoku(pg, x, y, size, n, bw, bh, pz.full, pz.symbols, true);
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ b d p q letter mix-ups
const MIXUP_WORDS = {
  b: [['balloon', 'img/balloon.webp'], ['ball', '⚽'], ['bee', '🐝'], ['bus', '🚌'], ['book', '📚'], ['banana', '🍌'], ['bear', '🐻'], ['bed', '🛏️'], ['bike', '🚲'], ['boat', '⛵']],
  d: [['dog', 'img/dog.webp'], ['duck', '🦆'], ['drum', '🥁'], ['door', '🚪'], ['dice', '🎲'], ['dinosaur', '🦕'], ['deer', '🦌'], ['dolphin', '🐬']],
  p: [['pig', 'img/pig.webp'], ['pen', '🖊️'], ['pizza', '🍕'], ['pear', '🍐'], ['panda', '🐼'], ['penguin', '🐧'], ['pumpkin', '🎃'], ['parrot', '🦜']],
  q: [['queen', '👸'], ['question', '❓']],
};
const PAPER_TINTS = { white: '#fff', cream: '#fdf6e3', blue: '#eaf3fb', green: '#eef7ea' };

function mixupLearn(pg, pair, top) {
  const [l1, l2] = pair;
  const bd = pair === 'bd';
  let y = top;
  // The tip panel
  const ph = 62;
  pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${ph}" rx="7" fill="#fff" stroke="#d9d4ec" stroke-width="0.6"/>`);
  if (bd) {
    // "bed" with a real little bed drawn on it
    const size = 30, x0 = pg.left + 12, ty = y + 14;
    const w = (textWidth('bed') / 100) * size;
    const bStem = x0, dStem = x0 + ((textWidth('bed') - 42 + 40.5) / 100) * size;
    pg.add(`<rect x="${bStem}" y="${ty + size * 0.5}" width="${dStem - bStem}" height="${size * 0.14}" rx="1.4" fill="#ffd6e4"/>`);
    pg.add(`<ellipse cx="${bStem + 7}" cy="${ty + size * 0.43}" rx="5" ry="2.6" fill="#cfe3ff"/>`);
    pg.add(drawText('bed', x0, ty, size, 'model'));
    pg.add(`<text x="${x0 + w + 12}" y="${y + 16}" font-family="${TITLE_FONT}" font-weight="800" font-size="7" fill="${INK}">The bed trick</text>`);
    textLines(pg, ['Write the word bed. It looks like a bed!', 'b is the headboard at the start,', 'd is the footboard at the end.', 'Thumbs up 👍👍 and make a bed with your hands.'], x0 + w + 12, y + 25, 4.6, { weight: 700, lh: 1.5 });
  } else {
    pg.add(pic('img/pig.webp', pg.left + 22, y + 30, 34));
    pg.add(`<text x="${pg.left + 46}" y="${y + 16}" font-family="${TITLE_FONT}" font-weight="800" font-size="7" fill="${INK}">p and q tips</text>`);
    textLines(pg, ['p is for pig. Its tail goes down on the left side.', 'q almost always has u after it: qu, like queen.', 'Say the sound as you write: p p p, qu qu qu.', 'Trace them slowly with your finger first.'], pg.left + 46, y + 25, 4.6, { weight: 700, lh: 1.5 });
  }
  y += ph + 8;
  // Big letters with a picture
  [l1, l2].forEach((L, i) => {
    const [word, src] = MIXUP_WORDS[L][0];
    const x = pg.left + i * (pg.width / 2);
    const c = [0, 3, 2, 4][i + (bd ? 0 : 2)];
    pg.add(`<rect x="${x + (i ? 2 : 0)}" y="${y}" width="${pg.width / 2 - 2}" height="44" rx="7" fill="${TINTS[c]}"/>`);
    pg.add(drawText(L, x + 12, y + 6, 22, 'model', true));
    pg.add(pic(src, x + 46, y + 22, 28));
    pg.add(`<text x="${x + 63}" y="${y + 20}" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="${PALETTE[c]}">${L} is for</text>`);
    pg.add(`<text x="${x + 63}" y="${y + 29}" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="${INK}">${word}</text>`);
  });
  y += 52;
  // Trace rows
  const size = 14;
  const rows = bd ? ['b', 'd', 'bdbd', 'bed', 'dad', 'bib', 'bd'] : ['p', 'q', 'pqpq', 'pig', 'queen', 'pup', 'pq'];
  for (const L of rows) {
    if (y + rowHeight(size) > pg.bottom) break;
    pg.guides(y, size);
    fillRow(pg, L, y, size, 'trace', L.length === 1);
    y += rowHeight(size);
  }
  return y;
}

function mixupFind(o, paper, letters, rand, tint) {
  const pg = new Page(paper, `Find and colour: ${letters.join(' ')}`, { subtitle: 'Colour each letter with its own colour. Go slowly and check each one!', tint });
  const cols = ['#ff6b6b', '#6c8cff', '#3fbfa8', '#ffb938'];
  const cname = ['red', 'blue', 'green', 'yellow'];
  let x = pg.left;
  letters.forEach((L, i) => {
    pg.add(`<circle cx="${x + 5}" cy="${pg.y + 3}" r="5" fill="${cols[i]}"/>`);
    pg.add(drawText(L, x + 2.6, pg.y - 0.5, 5.5, 'model'));
    pg.add(`<text x="${x + 13}" y="${pg.y + 5}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">${cname[i]}</text>`);
    x += 38;
  });
  pg.y += 16;
  const C = 7, R = 8;
  const cell = Math.min(pg.width / C, (pg.room - 30) / R);
  const gx = pg.left + (pg.width - cell * C) / 2;
  const counts = {};
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    const L = letters[Math.floor(rand() * letters.length)];
    counts[L] = (counts[L] || 0) + 1;
    const cx = gx + c * cell + cell / 2, cy = pg.y + r * cell + cell / 2;
    pg.add(`<circle cx="${cx}" cy="${cy}" r="${cell * 0.42}" fill="#fff" stroke="#b9b3d6" stroke-width="0.45"/>`);
    const size = cell * 0.36;
    const top = ['p', 'q'].includes(L) ? cy - size * 0.78 : cy - size * 0.55;
    pg.add(drawText(L, cx - (GLYPHS[L].w / 100) * size / 2, top, size, 'model'));
  }
  pg.y += R * cell + 8;
  letters.forEach((L, i) => {
    const bx = pg.left + i * (pg.width / letters.length);
    pg.add(`<text x="${bx}" y="${pg.y + 6}" font-family="${FONT}" font-weight="800" font-size="4.8" fill="${INK}">How many</text>`);
    pg.add(drawText(L, bx + 26.5, pg.y + 1.5, 5, 'model'));
    pg.add(`<text x="${bx + 30.5}" y="${pg.y + 6}" font-family="${FONT}" font-weight="800" font-size="4.8" fill="${INK}">?</text>`);
    pg.add(`<rect x="${bx + 35}" y="${pg.y}" width="10" height="9" rx="2" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`);
  });
  pg.add(`<text x="${pg.right}" y="${pg.bottom - 1}" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="3" fill="#c9c3e3">${letters.map((L) => `${L}: ${counts[L] || 0}`).join('   ')}</text>`);
  return pg.svg();
}

function mixupMissing(o, paper, letters, rand, tint) {
  const pg = new Page(paper, 'Which letter is missing?', { subtitle: `Say the word. Is it ${letters.join(' or ')}? Write the missing letter in the box.`, tint });
  let words = [];
  letters.forEach((L) => words.push(...MIXUP_WORDS[L].map(([w, s]) => ({ w, s, L }))));
  words = shuffle(words, rand).slice(0, 12);
  const cols = 3, rows = Math.ceil(words.length / cols);
  const cw = pg.width / cols, ch = Math.min(58, (pg.room - 2) / rows);
  words.forEach((it, i) => {
    const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
    pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="6" fill="#fff" stroke="#d9d4ec" stroke-width="0.5"/>`);
    pg.add(pic(it.s, x + cw / 2, y + ch * 0.34, ch * 0.4));
    const size = Math.min(8, (cw - 22) / ((textWidth(it.w.slice(1)) / 100) + 1.6));
    const rest = (textWidth(it.w.slice(1)) / 100) * size;
    const bw = size * 1.15;
    const total = bw + 2 + rest;
    const sx = x + (cw - total) / 2, ty = y + ch * 0.66;
    pg.add(`<rect x="${sx}" y="${ty - size * 0.1}" width="${bw}" height="${size * 1.25}" rx="1.6" fill="#fff" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="0.7"/>`);
    pg.add(drawText(it.w.slice(1), sx + bw + 2, ty, size, 'model'));
  });
  pg.add(`<text x="${pg.right}" y="${pg.bottom - 1}" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="3" fill="#c9c3e3">Answers: ${words.map((w, i) => `${i + 1} ${w.L}`).join(', ')}</text>`);
  return pg.svg();
}

function makeMixups(o, paper) {
  const rand = rng(+o.seed || 1);
  const tint = PAPER_TINTS[o.tint] || '#fff';
  const pairs = o.letters === 'pq' ? ['pq'] : o.letters === 'all' ? ['bd', 'pq'] : ['bd'];
  const letters = pairs.join('').split('');
  const pages = [];
  for (const pair of pairs) {
    const pg = new Page(paper, `Learning ${pair[0]} and ${pair[1]}`, { subtitle: 'Read the tip, then trace every letter from the green dot.', tint });
    mixupLearn(pg, pair, pg.y);
    pages.push(pg.svg());
  }
  pages.push(mixupFind(o, paper, letters, rand, tint));
  pages.push(mixupMissing(o, paper, letters, rand, tint));
  return pages;
}

Object.assign(MAKERS, { photo: makePhoto, story: makeStory, bingo: makeBingo, party: makeParty, certificate: makeCertificate, dots: makeDots, sudoku: makeSudoku, mixups: makeMixups });
