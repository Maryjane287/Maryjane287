// PrintPals batch 35 (Plus): Autumn Explorer kit, Little Shop kit, Pet Vet Clinic, Road Trip Adventure Book.

// A busy scene page (owner rule: colouring pages are full scenes).
function scenePage(paper, title, sub, scene, rand) {
  const pg = new Page(paper, title, { subtitle: sub });
  const sn = cmScene(scene, rand), boxH = pg.room - 4, s2 = Math.min((pg.width - 6) / 200, (boxH - 6) / 240);
  pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${boxH}" rx="8" fill="#fff" stroke="#1f1b2e" stroke-width="1"/><g transform="translate(${pg.left + (pg.width - 200 * s2) / 2} ${pg.y + (boxH - 240 * s2) / 2}) scale(${s2.toFixed(4)})">${sn.svg}</g>`);
  return pg.svg();
}

// Autumn scene for colouring: leaves, trees, hedgehog-free line art from our set.
CM_SCENES.autumn = { name: 'An autumn walk', main: ['owl', 'snail', 'bunny', 'dog', 'house'], extra: ['snail', 'owl', 'ladybird', 'bunny', 'frog', 'cat'] };
const _cmBg = cmBackground;
cmBackground = function (scene, rand) {
  if (scene !== 'autumn') return _cmBg(scene, rand);
  const H = 240, g = [`<path d="M0 ${H - 40} Q60 ${H - 58} 120 ${H - 44} T200 ${H - 46}" ${LN}/>`, cmTree(22, H - 40, 0.8), cmTree(180, H - 42, 0.7), cCloud(100, 26, 0.6)];
  for (let k = 0; k < 14; k++) { const x = 10 + rand() * 180, y = 20 + rand() * 170, a = rand() * 360; g.push(`<g transform="rotate(${a.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"><path d="M${x} ${y - 6} Q${x + 6} ${y} ${x} ${y + 6} Q${x - 6} ${y} ${x} ${y - 6} Z" fill="#fff" stroke="#1f1b2e" stroke-width="1.4" stroke-linejoin="round"/><path d="M${x} ${y - 5} V${y + 8}" fill="none" stroke="#1f1b2e" stroke-width="1"/></g>`); }
  for (let k = 0; k < 4; k++) { const x = 30 + k * 45 + rand() * 10; g.push(`<ellipse cx="${x}" cy="${H - 14}" rx="7" ry="5" ${LW}/><path d="M${x} ${H - 19} q1 -4 3 -5" ${LT}/>`); }
  return g.join('');
};

// ================================================================ Autumn Explorer kit (Plus)
function makeAutumnKit(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const ring = '#d9822b', tint = '#fff4e6';
  const pages = [seriesCover(paper, 'AUTUMN EXPLORER', name ? `${possessive(name)} autumn book` : 'My autumn book', 'Crunchy leaves and cosy days', ['🍂', '🎃', '🦔', '🌰', '🍎', '🌧️'], ring, tint, 'explorer book', ['Autumn leaf hunt', 'Busy autumn scenes', 'Pumpkin maths', 'Conker counting', 'Autumn words', 'Autumn Explorer award'])];
  pages.push(picGridPage(paper, 'Autumn nature hunt', 'Go for a crunchy walk and cross off everything you find. Collect a few treasures to bring home!', [['🍂', 'Brown leaf'], ['🍁', 'Red leaf'], ['🟡', 'Yellow leaf'], ['🌰', 'Conker'], ['🥜', 'Acorn'], ['🍄', 'Mushroom'], ['🦔', 'Hedgehog signs'], ['🐿️', 'Squirrel'], ['🕸️', 'Spider web'], ['🍎', 'Apple'], ['🎃', 'Pumpkin'], ['🌧️', 'Puddle'], ['🪵', 'Stick'], ['🐦', 'Bird'], ['🌾', 'Seed head'], ['🌳', 'Bare branch']]));
  pages.push(scenePage(paper, 'Colour the autumn walk', 'Autumn colours: red, orange, yellow and brown. Can you use them all?', 'autumn', rand));
  pages.push(scenePage(paper, 'Colour the cosy garden', 'Add falling leaves, a pumpkin and a puddle of your own!', 'garden', rand));
  // Leaf rubbing / leaf sort.
  {
    const pg = new Page(paper, 'Leaf lab', { subtitle: 'Lay a leaf under the paper and rub over it with the side of a crayon. Then sort your leaves by size and colour.' });
    const cw = pg.width / 3, ch = (pg.room - 60) / 2;
    for (let k = 0; k < 6; k++) { const x = pg.left + (k % 3) * cw, y = pg.y + Math.floor(k / 3) * ch; pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, '#fff', PALETTE[k], 10) + txt(x + cw / 2, y + ch - 8, `Leaf ${k + 1}`, 6, { colour: PALETTE[k] })); }
    pg.y += 2 * ch + 8;
    pg.add(panel(pg.left, pg.y, pg.width, pg.room - 4, tint, ring, 10) + txt(pg.left + 10, pg.y + 12, 'My biggest leaf was number ______', 6.4, { anchor: 'start', colour: INK }) + txt(pg.left + 10, pg.y + 24, 'My favourite leaf colour was ______________', 6.4, { anchor: 'start', colour: INK }) + txt(pg.left + 10, pg.y + 36, 'The tree it fell from: __________________', 6.4, { anchor: 'start', colour: INK }));
    pages.push(pg.svg());
  }
  // Pumpkin maths.
  {
    const pg = new Page(paper, 'Pumpkin maths', { subtitle: 'Count the pumpkins and seeds, then solve the pumpkin sums!' });
    const rh = (pg.room - 10) / 6;
    for (let k = 0; k < 6; k++) { const a = 1 + Math.floor(rand() * 5), b = 1 + Math.floor(rand() * 4), y = pg.y + k * rh, c = PALETTE[k]; pg.add(panel(pg.left, y + 2, pg.width, rh - 4, TINTS[k], c, 9)); for (let j = 0; j < a; j++) pg.add(emoji('🎃', pg.left + 12 + j * 11, y + rh / 2, 9)); pg.add(txt(pg.left + 72, y + rh / 2 + 3, '+', 10, { colour: c })); for (let j = 0; j < b; j++) pg.add(emoji('🎃', pg.left + 86 + j * 11, y + rh / 2, 9)); pg.add(txt(pg.left + 136, y + rh / 2 + 3, '=', 10, { colour: c }) + `<rect x="${pg.left + 146}" y="${y + rh / 2 - 8}" width="22" height="16" rx="4" fill="#fff" stroke="${c}" stroke-width="0.8"/>`); }
    pages.push(pg.svg());
  }
  pages.push(countRowsPage(paper, 'Conker and acorn counting', ['🌰', '🥜', '🍂', '🍄', '🍎', '🦔'], rand));
  pages.push(traceWordsPage(paper, 'Trace the autumn words', [['leaf', '🍂'], ['acorn', '🥜'], ['rain', '🌧️'], ['cosy', '🧣']]));
  pages.push(drawAndTellPage(paper, 'My autumn diary', 'Draw your favourite autumn day. Where did you go? What did you see, hear and smell?', ['Today I went to', 'I saw', 'I heard', 'It smelled like'], ring));
  pages.push(seriesCert(paper, 'AUTUMN EXPLORER', 'Autumn Explorer', name, 'for exploring autumn with curious eyes and muddy boots!', 'Next seasonal drop: the Winter Wonderland pack!', ring));
  return pages;
}

// ================================================================ Little Shop kit (Plus)
const SHOP_ITEMS = [['🍎', 'Apple'], ['🍌', 'Banana'], ['🥕', 'Carrot'], ['🍞', 'Bread'], ['🥛', 'Milk'], ['🧀', 'Cheese'], ['🍪', 'Cookie'], ['🧃', 'Juice'], ['🥚', 'Eggs'], ['🍓', 'Strawberries'], ['🧸', 'Teddy'], ['🎈', 'Balloon'], ['📚', 'Book'], ['🖍️', 'Crayons'], ['⚽', 'Ball'], ['🍦', 'Ice cream']];

function makeShopKit(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const cur = CURRENCIES[o.currency] || CURRENCIES.GBP, shop = String(o.shop || '').trim().slice(0, 22) || (name ? `${possessive(name)} Shop` : 'The Little Shop');
  const lvl = o.level === 'harder' ? 'harder' : 'easy';
  const priceOf = () => { const opts = cur.whole ? (lvl === 'easy' ? [1, 2, 3, 4, 5] : [5, 10, 15, 20, 50]) : (lvl === 'easy' ? [1, 2, 3, 4, 5, 10] : [10, 20, 25, 50, 75, 100]); return opts[Math.floor(rand() * opts.length)]; };
  const items = SHOP_ITEMS.map(([e, n]) => [e, n, priceOf()]);
  const ring = '#2e9d62', tint = '#f1f8e6';
  const pages = [seriesCover(paper, 'LITTLE SHOP KIT', shop, 'Open for business!', ['🛒', '🍎', '🪙', '🧾', '🛍️', '⭐'], ring, tint, 'shop kit', ['Shop sign', '16 price tags', 'Coins to cut out', 'Shopping lists', 'Receipts', 'Money sums'])];
  // Shop sign.
  {
    const pg = new Page(paper, '', { bare: true, landscape: true });
    pg.add(`<rect x="${pg.m}" y="${pg.m}" width="${pg.w - pg.m * 2}" height="${pg.h - pg.m * 2}" rx="16" fill="#fff" stroke="${ring}" stroke-width="3"/>`);
    for (let k = 0; k < 10; k++) pg.add(`<path d="M${pg.m + k * (pg.w - pg.m * 2) / 10} ${pg.m} h${(pg.w - pg.m * 2) / 10} v18 q-${(pg.w - pg.m * 2) / 20} 10 -${(pg.w - pg.m * 2) / 10} 0 Z" fill="${k % 2 ? '#fff' : '#ff6b6b'}" stroke="${ring}" stroke-width="0.8"/>`);
    bubbleText(pg, shop, pg.w / 2, pg.h / 2 + 8, pg.w - 60, 44);
    pg.add(txt(pg.w / 2, pg.h - pg.m - 26, '🛒 OPEN 🛒', 20, { colour: ring }));
    pg.footer = () => {}; pages.push(pg.svg());
  }
  // Price tags.
  for (let s = 0; s < 16; s += 8) pages.push(tagsPage(paper, s ? 'Price tags (more)' : 'Price tags', 'Cut out and stick on your toys and pretend food. Change the prices any time!', 8, 2, (pg, x, y, w, h, i) => { const [e, n, p] = items[s + i], c = PALETTE[(s + i) % PALETTE.length]; pg.add(`<path d="M${x + 16} ${y + 6} H${x + w - 6} V${y + h - 6} H${x + 16} L${x + 6} ${y + h / 2} Z" fill="${TINTS[(s + i) % TINTS.length]}" stroke="${c}" stroke-width="1"/><circle cx="${x + 16}" cy="${y + h / 2}" r="2.4" fill="#fff" stroke="#1f1b2e" stroke-width="0.6"/>` + emoji(e, x + w * 0.34, y + h / 2, h * 0.4) + txt(x + w * 0.7, y + h * 0.42, n, fitFont(n, 7, w * 0.44, 0.56), { colour: INK }) + txt(x + w * 0.7, y + h * 0.72, cur.fmt(p), 13, { colour: c })); }));
  // Coins to cut out.
  {
    const vals = [...new Set([...(cur.coins || []), ...(cur.notes || [])])].sort((a, b) => a - b).slice(0, 6);
    const pg = new Page(paper, 'Coins and notes to cut out', { subtitle: `Colour and cut out your pretend ${cur.name.toLowerCase()}. Keep them in an envelope next to the till!`, noName: true });
    const cols = 6, cw = pg.width / cols, ch = Math.min(28, pg.room / 8);
    for (let r = 0; r < 8; r++) vals.forEach((v, k) => { const cx = pg.left + k * cw + cw / 2, cy = pg.y + r * ch + ch / 2, big = v >= (cur.notes && cur.notes[0] || 1e9); pg.add(big ? `<rect x="${cx - cw * 0.44}" y="${cy - ch * 0.36}" width="${cw * 0.88}" height="${ch * 0.72}" rx="3" fill="#fff" stroke="${PALETTE[k]}" stroke-width="0.8"/>` : `<circle cx="${cx}" cy="${cy}" r="${Math.min(cw, ch) * 0.4}" fill="#fff" stroke="${PALETTE[k]}" stroke-width="0.8"/>`); pg.add(txt(cx, cy + 2.4, cur.fmt(v), fitFont(cur.fmt(v), 7, cw * 0.7, 0.56), { colour: PALETTE[k] })); });
    pages.push(pg.svg());
  }
  // Shopping lists.
  pages.push(tagsPage(paper, 'Shopping lists', 'Customers: draw or write what you want to buy. Shopkeeper: add up the total!', 4, 2, (pg, x, y, w, h, i) => { pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="8" fill="#fff" stroke="${PALETTE[i]}" stroke-width="1"/>` + txt(x + w / 2, y + 16, '🛍️ My shopping list', 8, { colour: PALETTE[i] })); for (let l = 0; l < 6; l++) pg.add(`<rect x="${x + 12}" y="${y + 24 + l * 12}" width="6" height="6" rx="1" fill="#fff" stroke="${PALETTE[i]}" stroke-width="0.6"/><line x1="${x + 22}" x2="${x + w - 14}" y1="${y + 30 + l * 12}" y2="${y + 30 + l * 12}" stroke="#d9d4ec" stroke-width="0.5"/>`); pg.add(txt(x + 12, y + h - 12, 'Total:', 7, { anchor: 'start', colour: INK }) + `<rect x="${x + 36}" y="${y + h - 20}" width="34" height="11" rx="3" fill="#fff" stroke="${PALETTE[i]}" stroke-width="0.8"/>`); }));
  // Receipts.
  pages.push(tagsPage(paper, 'Receipts', 'The shopkeeper fills in a receipt for every customer. Thank you for shopping!', 6, 3, (pg, x, y, w, h, i) => { pg.add(`<path d="M${x + 6} ${y + 4} H${x + w - 6} V${y + h - 8} l-4 4 l-4 -4 l-4 4 l-4 -4 l-4 4 l-4 -4 l-4 4 l-4 -4 l-4 4 l-4 -4 l-4 4 l-4 -4 L${x + 6} ${y + h - 8} Z" fill="#fff" stroke="#9a93b8" stroke-width="0.7"/>` + txt(x + w / 2, y + 14, shop, fitFont(shop, 6.4, w - 16, 0.56), { colour: ring }) + txt(x + w / 2, y + 21, 'RECEIPT', 4.6, { font: FONT, colour: SOFT })); for (let l = 0; l < 4; l++) pg.add(`<line x1="${x + 12}" x2="${x + w - 12}" y1="${y + 32 + l * 10}" y2="${y + 32 + l * 10}" stroke="#e2ddf2" stroke-width="0.5" stroke-dasharray="1.5 1.5"/>`); pg.add(txt(x + 12, y + h - 20, 'TOTAL', 6, { anchor: 'start', colour: INK }) + txt(x + w / 2, y + h - 12, 'Thank you!', 5.4, { font: FONT, colour: SOFT })); }));
  // Money sums.
  {
    const pg = new Page(paper, 'Shop sums', { subtitle: 'Add up what each customer buys. Use your pretend coins to help!' });
    const rh = (pg.room - 4) / 6;
    for (let k = 0; k < 6; k++) { const a = items[Math.floor(rand() * 16)], b = items[Math.floor(rand() * 16)], y = pg.y + k * rh, c = PALETTE[k]; pg.add(panel(pg.left, y + 2, pg.width, rh - 4, TINTS[k], c, 9) + emoji(a[0], pg.left + 14, y + rh / 2, rh * 0.4) + txt(pg.left + 26, y + rh / 2 + 3, cur.fmt(a[2]), 8, { anchor: 'start', colour: INK }) + txt(pg.left + 62, y + rh / 2 + 3, '+', 10, { colour: c }) + emoji(b[0], pg.left + 80, y + rh / 2, rh * 0.4) + txt(pg.left + 92, y + rh / 2 + 3, cur.fmt(b[2]), 8, { anchor: 'start', colour: INK }) + txt(pg.left + 128, y + rh / 2 + 3, '=', 10, { colour: c }) + `<rect x="${pg.left + 138}" y="${y + rh / 2 - 8}" width="34" height="16" rx="4" fill="#fff" stroke="${c}" stroke-width="0.8"/>`); }
    pages.push(pg.svg());
  }
  pages.push(tagsPage(paper, 'Shop badges', 'Pin them on! Take turns to be the shopkeeper.', 6, 3, (pg, x, y, w, h, i) => { const cx = x + w / 2, cy = y + h / 2, r = Math.min(w, h) * 0.4; pg.add(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${TINTS[i]}" stroke="${PALETTE[i]}" stroke-width="1.4"/>` + emoji(i < 3 ? '🧑‍🍳' : '🛒', cx, cy - r * 0.32, r * 0.6) + txt(cx, cy + r * 0.28, i < 3 ? 'Shop' : 'Happy', 6.4, { colour: INK }) + txt(cx, cy + r * 0.6, i < 3 ? 'Keeper' : 'Customer', 7, { colour: PALETTE[i] })); }));
  pages.push(seriesCert(paper, 'LITTLE SHOP KIT', 'Super Shopkeeper', name, 'for counting money, adding prices and serving customers with a smile!', 'Next: try the harder prices!', ring));
  return pages;
}

// ================================================================ Pet Vet Clinic (Plus)
const VET_PETS = [['🐶', 'Puppy', 'a sore paw'], ['🐱', 'Kitten', 'a sneezy nose'], ['🐰', 'Bunny', 'a wobbly tooth'], ['🐹', 'Hamster', 'a tummy ache'], ['🐢', 'Tortoise', 'a scratched shell'], ['🦜', 'Parrot', 'a croaky voice'], ['🐴', 'Pony', 'a tired leg'], ['🐟', 'Goldfish', 'the hiccups']];

function makeVetKit(o, paper) {
  const name = nameOf(o.name, '') || '';
  const nm = name || 'Mia';
  const ring = '#3a8fd8', tint = '#eef6ff';
  const pages = [seriesCover(paper, 'PET VET CLINIC', `Dr ${nm}'s Pet Clinic`, 'Every pet gets the best care', ['🩺', '🐶', '🐱', '🐰', '💊', '❤️'], ring, tint, 'vet kit', ['Vet ID badge', '8 patient cards', 'Check-up forms', 'Prescription pads', 'Pet care charts', 'Super Vet certificate'])];
  pages.push(tagsPage(paper, 'My vet ID badge', 'Fill it in, cut it out and clip it on. The clinic is open!', 2, 1, (pg, x, y, w, h, i) => { const c = i ? '#e0457b' : ring; pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="10" fill="${i ? '#fff0f5' : tint}" stroke="${c}" stroke-width="1.4"/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="18" rx="10" fill="${c}"/>` + txt(x + w / 2, y + 16.4, i ? 'VET NURSE' : 'PET DOCTOR', 8, { colour: '#fff' }).replace('<text ', '<text letter-spacing="2" ') + `<rect x="${x + 14}" y="${y + 30}" width="${h * 0.55}" height="${h * 0.62}" rx="6" fill="#fff" stroke="${c}" stroke-width="0.8" stroke-dasharray="2 1.5"/>` + emoji('🩺', x + 14 + h * 0.275, y + 30 + h * 0.31, 20) + txt(x + 22 + h * 0.55, y + 44, i ? 'Nurse' : 'Dr', 7, { anchor: 'start', colour: SOFT }) + txt(x + 22 + h * 0.55, y + 60, nm, fitFont(nm, 16, w - h * 0.55 - 36, 0.58), { anchor: 'start', colour: c }) + txt(x + 22 + h * 0.55, y + 76, 'Kind to every animal', 6.4, { anchor: 'start', font: FONT, colour: INK })); }));
  pages.push(factCardsPage(paper, 'Patient cards', 'Pick a card to see who is coming to the clinic today. What is wrong with them?', VET_PETS.slice(0, 4).map(([e, n, p]) => [e, n, `Today ${n.toLowerCase()} has ${p}.`, 'Patient']), ring, tint));
  pages.push(factCardsPage(paper, 'Patient cards (more)', 'Take turns being the pet owner and the vet!', VET_PETS.slice(4).map(([e, n, p]) => [e, n, `Today ${n.toLowerCase()} has ${p}.`, 'Patient']), ring, tint));
  pages.push(tagsPage(paper, 'Check-up forms', 'Fill one in for every patient. Tick each check!', 2, 1, (pg, x, y, w, h, i) => { pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="8" fill="#fff" stroke="${ring}" stroke-width="1"/>` + txt(x + 12, y + 16, `🩺 Dr ${nm}'s check-up`, 8, { anchor: 'start', colour: ring }) + txt(x + 12, y + 28, 'Pet name: ______________   Animal: ______________', 6, { anchor: 'start', colour: INK })); ['👀 Eyes', '👂 Ears', '👃 Nose', '🦷 Teeth', '❤️ Heartbeat', '🐾 Paws', '⚖️ Weight', '🌡️ Temperature'].forEach((t, k) => pg.add(`<rect x="${x + 12 + (k % 2) * (w / 2 - 8)}" y="${y + 34 + Math.floor(k / 2) * 10}" width="6" height="6" rx="1" fill="#fff" stroke="${PALETTE[k]}" stroke-width="0.7"/>` + txt(x + 22 + (k % 2) * (w / 2 - 8), y + 39 + Math.floor(k / 2) * 10, t, 6, { anchor: 'start', colour: INK }))); pg.add(txt(x + 12, y + h - 12, 'The vet says: ________________________________', 6, { anchor: 'start', colour: INK })); }));
  pages.push(tagsPage(paper, 'Prescription pad', 'Write what the pet needs to feel better. Hugs count as medicine!', 6, 2, (pg, x, y, w, h, i) => { pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="6" fill="#fff" stroke="${ring}" stroke-width="0.9"/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="12" rx="6" fill="${tint}"/>` + txt(x + 10, y + 12.4, `Rx  Dr ${nm}'s Pet Clinic`, fitFont(`Rx  Dr ${nm}'s Pet Clinic`, 6, w - 22, 0.55), { anchor: 'start', colour: ring }) + txt(x + 10, y + 24, 'For:', 5.6, { anchor: 'start', font: FONT, colour: SOFT })); for (let l = 0; l < 3; l++) pg.add(`<line x1="${x + 10}" x2="${x + w - 10}" y1="${y + 34 + l * 9}" y2="${y + 34 + l * 9}" stroke="#d9d4ec" stroke-width="0.5"/>`); pg.add(emoji(['💊', '🩹', '🥕', '🤗', '💧', '😴'][i], x + w - 16, y + h - 14, 10)); }));
  pages.push(checklistPage(paper, 'Pet care every day', 'Real vets know pets need these things. Colour a star for each one you do for a pet or a soft toy!', [['💧', 'Fresh water'], ['🥣', 'The right food'], ['🏠', 'A cosy, clean bed'], ['🦮', 'Exercise and play'], ['🪮', 'Brushing and grooming'], ['🤗', 'Gentle cuddles'], ['🩺', 'Visits to the vet'], ['💛', 'Lots of love']], name));
  pages.push(scenePage(paper, 'Colour the busy pet clinic garden', 'The animals are waiting to see the vet. Colour them all in!', 'garden', rng(+o.seed || 7)));
  pages.push(seriesCert(paper, 'PET VET CLINIC', 'Super Vet', name, 'for caring for every animal with kindness and gentle hands!', 'Next: the Farm Friends and Safari kits!', ring));
  return pages;
}

// ================================================================ Road Trip Adventure Book (Plus)
function makeRoadTrip(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const dest = String(o.dest || '').trim().slice(0, 22);
  const ring = '#e0602b', tint = '#fff3ea';
  const pages = [seriesCover(paper, 'ROAD TRIP ADVENTURE', name ? `${possessive(name)} road trip` : 'My road trip', dest ? `Off to ${dest}!` : 'Are we there yet?', ['🚗', '🗺️', '⛽', '🌳', '🏖️', '⭐'], ring, tint, 'travel book', ['Car bingo', 'Journey map', 'Are we there yet? games', 'Number plate hunt', 'Travel diary', 'Super Traveller award'])];
  for (let b = 0; b < 2; b++) pages.push(picGridPage(paper, b ? 'Car bingo: card 2' : 'Car bingo', 'Cross off everything you see from the window. Get four in a row and shout BINGO!', shuffle([['🚗', 'Red car'], ['🚌', 'Bus'], ['🚚', 'Lorry'], ['🏍️', 'Motorbike'], ['🐄', 'Cow'], ['🐑', 'Sheep'], ['🌉', 'Bridge'], ['⛽', 'Petrol station'], ['🚦', 'Traffic lights'], ['🌳', 'Big tree'], ['🏠', 'Blue door'], ['🚜', 'Tractor'], ['🚲', 'Bicycle'], ['🐴', 'Horse'], ['🌊', 'River'], ['⛪', 'Tall tower'], ['🚓', 'Police car'], ['🚑', 'Ambulance'], ['🏔️', 'Hill'], ['🌈', 'Rainbow']], rand).slice(0, 16)));
  // Journey map.
  {
    const pg = new Page(paper, 'My journey map', { subtitle: 'Draw the road from home to where you are going. Add what you see on the way!' });
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${pg.room - 4}" rx="12" fill="#fffdf6" stroke="${ring}" stroke-width="1"/>` + emoji('🏠', pg.left + 20, pg.bottom - 24, 18) + txt(pg.left + 20, pg.bottom - 8, 'Home', 6.4, { colour: ring }) + emoji('🏁', pg.right - 20, pg.y + 20, 18) + txt(pg.right - 20, pg.y + 38, dest || 'Here!', fitFont(dest || 'Here!', 6.4, 44, 0.55), { colour: ring }) + `<path d="M${pg.left + 30} ${pg.bottom - 30} C${pg.left + 80} ${pg.bottom - 90} ${pg.right - 110} ${pg.y + 150} ${pg.right - 30} ${pg.y + 30}" fill="none" stroke="#c9a96a" stroke-width="1" stroke-dasharray="4 3"/>`);
    pages.push(pg.svg());
  }
  // Games.
  pages.push(checklistPage(paper, 'Are we there yet? games', 'Games to play in the car with no paper at all. Tick the ones you played!', [['🔤', 'I spy with my little eye'], ['🎵', 'Name that tune: hum a song'], ['🐄', 'Count the cows'], ['🔢', 'Find the numbers 1 to 10 on signs'], ['🅰️', 'Alphabet game: find A to Z on signs'], ['🤫', 'Quiet mouse: who can stay silent the longest?'], ['❓', 'Twenty questions'], ['📖', 'Make up a story, one sentence each']], name));
  {
    const pg = new Page(paper, 'Number plate hunt', { subtitle: 'Spot letters and numbers on car number plates. Colour each one when you find it!' });
    const all = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(''), cols = 6, cw = pg.width / cols, ch = pg.room / 6;
    all.forEach((l, k) => { const x = pg.left + (k % cols) * cw, y = pg.y + Math.floor(k / cols) * ch, c = PALETTE[k % PALETTE.length]; pg.add(`<rect x="${x + 3}" y="${y + ch * 0.2}" width="${cw - 6}" height="${ch * 0.6}" rx="4" fill="#fffbe6" stroke="${c}" stroke-width="0.9"/>` + txt(x + cw / 2, y + ch * 0.62, l, 16, { colour: INK })); });
    pages.push(pg.svg());
  }
  pages.push(...packRun('mazes', { level: 'medium' }, paper, +o.seed || 1).sheets);
  pages.push(drawAndTellPage(paper, 'My travel diary', 'What was the best part of the journey? Draw it, then tell the story!', ['We travelled to', 'The journey took', 'We stopped at', 'The best part was'], ring));
  pages.push(scenePage(paper, 'Colour the busy town', 'Look at all the cars, planes and boats. Colour a road trip picture!', 'town', rand));
  pages.push(seriesCert(paper, 'ROAD TRIP ADVENTURE', 'Super Traveller', name, dest ? `for travelling all the way to ${dest} like a star!` : 'for being a brilliant travel buddy!', 'Next trip: the Flying Adventure kit!', ring));
  return pages;
}

Object.assign(MAKERS, { autumnkit: makeAutumnKit, shopkit: makeShopKit, vetkit: makeVetKit, roadtrip: makeRoadTrip });
