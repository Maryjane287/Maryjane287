// PrintPals batch 9: odd one out, roll and draw, patterns, syllables, door hangers,
// 30 day challenges, doubles and halves, and position words.

const txt = (x, y, s, fs, opts = {}) => {
  const { weight = 800, colour = INK, anchor = 'middle', font = TITLE_FONT } = opts;
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${font}" font-weight="${weight}" font-size="${fs}" fill="${colour}">${esc(s)}</text>`;
};
const panel = (x, y, w, h, fill = '#fff', stroke = '#d9d4ec', rx = 5) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="0.6"/>`;

// ================================================================ odd one out
const ODD_GROUPS = {
  animals: ['cat', 'dog', 'lion', 'monkey', 'pig', 'zebra', 'gorilla', 'bear', 'chick', 'turtle', 'octopus', 'fish'],
  fruit: ['apple', 'banana', 'orange', 'strawberry', 'blueberry'],
  treats: ['cake', 'cupcake', 'cookie', 'donut', 'lolly'],
  flowers: ['daisy', 'rose', 'tulip', 'sunflower', 'bluebell'],
  party: ['balloon', 'present', 'popper'],
  sky: ['sun', 'star', 'rainbow'],
};
// Groups that are too close to mix (a cake is also a party thing, a strawberry is also food).
const ODD_CLASH = { fruit: ['treats'], treats: ['fruit', 'party'], party: ['treats'] };
const ODD_WHY = { animals: 'animals', fruit: 'fruit', treats: 'sweet treats', flowers: 'flowers', party: 'party things', sky: 'things in the sky' };

function makeOddOne(o, paper) {
  const rand = rng(+o.seed || 1);
  const level = o.level || 'medium';
  const per = level === 'hard' ? 5 : 4, rowsN = 6;
  const rows = [];
  const groups = Object.keys(ODD_GROUPS);
  for (let r = 0; r < rowsN; r++) {
    if (level === 'easy') {
      const all = Object.values(ODD_GROUPS).flat();
      const [a, b] = shuffle(all, rand);
      const items = Array(per - 1).fill(a).concat([b]);
      const order = shuffle(items.map((v, i) => [v, i === per - 1]), rand);
      rows.push({ items: order, why: '' });
    } else {
      const pool = level === 'hard' ? groups.filter((g) => ODD_GROUPS[g].length >= per - 1) : groups;
      const g = pool[(r + Math.floor(rand() * pool.length)) % pool.length];
      const others = groups.filter((x) => x !== g && !(ODD_CLASH[g] || []).includes(x));
      const og = others[Math.floor(rand() * others.length)];
      const same = shuffle(ODD_GROUPS[g], rand).slice(0, per - 1);
      const odd = ODD_GROUPS[og][Math.floor(rand() * ODD_GROUPS[og].length)];
      rows.push({ items: shuffle([...same.map((v) => [v, false]), [odd, true]], rand), why: `The others are all ${ODD_WHY[g]}.` });
    }
  }
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Odd one out: answers' : 'Odd one out', { subtitle: answers ? 'Answer key for grown-ups.' : level === 'easy' ? 'Look carefully. Circle the picture that is different.' : 'Which one does not belong? Circle it, then say why.', noName: answers });
    const rh = (pg.room - 2) / rowsN, cw = pg.width / per;
    rows.forEach((row, r) => {
      const y = pg.y + r * rh;
      pg.add(panel(pg.left, y + 1.5, pg.width, rh - 3, TINTS[r % TINTS.length], '#e2ddf2', 7));
      pg.add(`<circle cx="${pg.left + 6}" cy="${y + 8}" r="4" fill="${PALETTE[r % PALETTE.length]}"/>` + txt(pg.left + 6, y + 9.6, r + 1, 4.6, { colour: '#fff' }));
      const size = Math.min(cw - 8, rh - (level === 'easy' ? 10 : 16));
      row.items.forEach(([name, odd], i) => {
        const cx = pg.left + cw * (i + 0.5), cy = y + 3 + size / 2 + 2;
        pg.add(`<rect x="${cx - size / 2 - 1}" y="${cy - size / 2 - 1}" width="${size + 2}" height="${size + 2}" rx="5" fill="#fff" stroke="#e2ddf2" stroke-width="0.5"/>`);
        pg.add(pic(ART(name), cx, cy, size * 0.9));
        if (answers && odd) pg.add(`<ellipse cx="${cx}" cy="${cy}" rx="${size / 2 + 3}" ry="${size / 2 + 2}" fill="none" stroke="#e0457b" stroke-width="1.2"/>`);
      });
      if (level !== 'easy') {
        const ly = y + rh - 5.5;
        if (answers) pg.add(txt(pg.left + 14, ly, row.why, 4, { anchor: 'start', colour: '#e0457b', font: FONT }));
        else pg.add(txt(pg.left + 14, ly, 'Why?', 4, { anchor: 'start', colour: SOFT, font: FONT }) + `<line x1="${pg.left + 26}" x2="${pg.right - 6}" y1="${ly}" y2="${ly}" stroke="#b9b3d6" stroke-width="0.35"/>`);
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ roll and draw
const RD_S = 'fill="#fff" stroke="#2d2350" stroke-width="0.7" stroke-linejoin="round" stroke-linecap="round"';
const RD_N = 'fill="none" stroke="#2d2350" stroke-width="0.7" stroke-linejoin="round" stroke-linecap="round"';
const RD_F = 'fill="#2d2350"';
const rdEye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" ${RD_S}/><circle cx="${x + r * 0.2}" cy="${y + r * 0.1}" r="${r * 0.45}" ${RD_F}/>`;
// Each part: [label, [six little drawings (cx, cy, s) => svg]]
const ROLL_THEMES = {
  monster: { title: 'Roll and draw a monster', parts: [
    ['Body', [
      (x, y, s) => `<circle cx="${x}" cy="${y}" r="${s * 0.42}" ${RD_S}/>`,
      (x, y, s) => `<rect x="${x - s * 0.4}" y="${y - s * 0.4}" width="${s * 0.8}" height="${s * 0.8}" rx="${s * 0.14}" ${RD_S}/>`,
      (x, y, s) => `<path d="M${x} ${y - s * 0.45} L${x + s * 0.45} ${y + s * 0.4} L${x - s * 0.45} ${y + s * 0.4} Z" ${RD_S}/>`,
      (x, y, s) => `<ellipse cx="${x}" cy="${y}" rx="${s * 0.3}" ry="${s * 0.45}" ${RD_S}/>`,
      (x, y, s) => `<path d="M${x - s * 0.4} ${y + s * 0.35} Q${x - s * 0.5} ${y - s * 0.2} ${x - s * 0.15} ${y - s * 0.4} Q${x + s * 0.1} ${y - s * 0.5} ${x + s * 0.35} ${y - s * 0.25} Q${x + s * 0.55} ${y + s * 0.05} ${x + s * 0.4} ${y + s * 0.35} Z" ${RD_S}/>`,
      (x, y, s) => `<path d="${starPath(x, y + s * 0.04, s * 0.48, 0.55)}" ${RD_S}/>`,
    ]],
    ['Eyes', [
      (x, y, s) => rdEye(x, y, s * 0.24),
      (x, y, s) => rdEye(x - s * 0.16, y, s * 0.13) + rdEye(x + s * 0.16, y, s * 0.13),
      (x, y, s) => rdEye(x - s * 0.24, y + s * 0.05, s * 0.1) + rdEye(x, y - s * 0.1, s * 0.1) + rdEye(x + s * 0.24, y + s * 0.05, s * 0.1),
      (x, y, s) => `<path d="M${x - s * 0.12} ${y + s * 0.3} L${x - s * 0.2} ${y - s * 0.1} M${x + s * 0.12} ${y + s * 0.3} L${x + s * 0.2} ${y - s * 0.1}" ${RD_N}/>` + rdEye(x - s * 0.2, y - s * 0.2, s * 0.1) + rdEye(x + s * 0.2, y - s * 0.2, s * 0.1),
      (x, y, s) => `<path d="M${x - s * 0.32} ${y} Q${x - s * 0.18} ${y + s * 0.12} ${x - s * 0.04} ${y} M${x + s * 0.04} ${y} Q${x + s * 0.18} ${y + s * 0.12} ${x + s * 0.32} ${y}" ${RD_N}/>`,
      (x, y, s) => [[-0.2, -0.12], [0.2, -0.12], [-0.2, 0.14], [0.2, 0.14]].map(([a, b]) => rdEye(x + a * s, y + b * s, s * 0.08)).join(''),
    ]],
    ['Mouth', [
      (x, y, s) => `<path d="M${x - s * 0.3} ${y - s * 0.08} Q${x} ${y + s * 0.3} ${x + s * 0.3} ${y - s * 0.08}" ${RD_N}/>`,
      (x, y, s) => `<path d="M${x - s * 0.3} ${y - s * 0.1} Q${x} ${y + s * 0.3} ${x + s * 0.3} ${y - s * 0.1} Z" ${RD_S}/><path d="M${x - s * 0.16} ${y - s * 0.02} l${s * 0.05} ${s * 0.12} l${s * 0.05} ${-s * 0.1} M${x + s * 0.06} ${y - s * 0.02} l${s * 0.05} ${s * 0.12} l${s * 0.05} ${-s * 0.11}" ${RD_N}/>`,
      (x, y, s) => `<ellipse cx="${x}" cy="${y}" rx="${s * 0.14}" ry="${s * 0.18}" ${RD_S}/>`,
      (x, y, s) => `<path d="M${x - s * 0.34} ${y} L${x - s * 0.22} ${y - s * 0.1} L${x - s * 0.11} ${y} L${x} ${y - s * 0.1} L${x + s * 0.11} ${y} L${x + s * 0.22} ${y - s * 0.1} L${x + s * 0.34} ${y}" ${RD_N}/>`,
      (x, y, s) => `<path d="M${x - s * 0.3} ${y - s * 0.06} H${x + s * 0.3}" ${RD_N}/><path d="M${x - s * 0.08} ${y - s * 0.06} V${y + s * 0.14} A${s * 0.08} ${s * 0.08} 0 0 0 ${x + s * 0.08} ${y + s * 0.14} V${y - s * 0.06}" ${RD_S}/>`,
      (x, y, s) => `<path d="M${x - s * 0.34} ${y - s * 0.12} Q${x} ${y + s * 0.34} ${x + s * 0.34} ${y - s * 0.12} Z" ${RD_S}/><rect x="${x - s * 0.05}" y="${y - s * 0.07}" width="${s * 0.1}" height="${s * 0.11}" ${RD_S}/>`,
    ]],
    ['Arms', [
      (x, y, s) => `<path d="M${x - s * 0.12} ${y} L${x - s * 0.42} ${y - s * 0.2} M${x + s * 0.12} ${y} L${x + s * 0.42} ${y - s * 0.2}" ${RD_N}/><circle cx="${x - s * 0.42}" cy="${y - s * 0.2}" r="${s * 0.05}" ${RD_S}/><circle cx="${x + s * 0.42}" cy="${y - s * 0.2}" r="${s * 0.05}" ${RD_S}/>`,
      (x, y, s) => `<path d="M${x - s * 0.12} ${y - s * 0.08} L${x - s * 0.42} ${y - s * 0.28} M${x + s * 0.12} ${y - s * 0.08} L${x + s * 0.42} ${y - s * 0.28} M${x - s * 0.12} ${y + s * 0.1} L${x - s * 0.42} ${y + s * 0.26} M${x + s * 0.12} ${y + s * 0.1} L${x + s * 0.42} ${y + s * 0.26}" ${RD_N}/>`,
      (x, y, s) => `<path d="M${x - s * 0.1} ${y} Q${x - s * 0.3} ${y - s * 0.3} ${x - s * 0.42} ${y} T${x - s * 0.4} ${y + s * 0.3} M${x + s * 0.1} ${y} Q${x + s * 0.3} ${y - s * 0.3} ${x + s * 0.42} ${y} T${x + s * 0.4} ${y + s * 0.3}" ${RD_N}/>`,
      (x, y, s) => `<path d="M${x - s * 0.08} ${y} Q${x - s * 0.4} ${y - s * 0.4} ${x - s * 0.46} ${y - s * 0.05} Q${x - s * 0.34} ${y - s * 0.02} ${x - s * 0.36} ${y + s * 0.12} Q${x - s * 0.22} ${y + s * 0.02} ${x - s * 0.08} ${y} Z M${x + s * 0.08} ${y} Q${x + s * 0.4} ${y - s * 0.4} ${x + s * 0.46} ${y - s * 0.05} Q${x + s * 0.34} ${y - s * 0.02} ${x + s * 0.36} ${y + s * 0.12} Q${x + s * 0.22} ${y + s * 0.02} ${x + s * 0.08} ${y} Z" ${RD_S}/>`,
      (x, y, s) => `<path d="M${x - s * 0.1} ${y} L${x - s * 0.36} ${y} M${x - s * 0.36} ${y} l-${s * 0.08} -${s * 0.1} M${x - s * 0.36} ${y} l-${s * 0.1} 0 M${x - s * 0.36} ${y} l-${s * 0.08} ${s * 0.1} M${x + s * 0.1} ${y} L${x + s * 0.36} ${y} M${x + s * 0.36} ${y} l${s * 0.08} -${s * 0.1} M${x + s * 0.36} ${y} l${s * 0.1} 0 M${x + s * 0.36} ${y} l${s * 0.08} ${s * 0.1}" ${RD_N}/>`,
      (x, y, s) => `<path d="M${x - s * 0.1} ${y} Q${x - s * 0.3} ${y + s * 0.02} ${x - s * 0.3} ${y - s * 0.24} M${x + s * 0.1} ${y} Q${x + s * 0.3} ${y + s * 0.02} ${x + s * 0.3} ${y - s * 0.24}" ${RD_N}/><circle cx="${x - s * 0.3}" cy="${y - s * 0.3}" r="${s * 0.08}" ${RD_S}/><circle cx="${x + s * 0.3}" cy="${y - s * 0.3}" r="${s * 0.08}" ${RD_S}/>`,
    ]],
    ['Legs', [
      (x, y, s) => `<path d="M${x - s * 0.12} ${y - s * 0.3} V${y + s * 0.25} M${x + s * 0.12} ${y - s * 0.3} V${y + s * 0.25}" ${RD_N}/><ellipse cx="${x - s * 0.17}" cy="${y + s * 0.28}" rx="${s * 0.1}" ry="${s * 0.05}" ${RD_S}/><ellipse cx="${x + s * 0.17}" cy="${y + s * 0.28}" rx="${s * 0.1}" ry="${s * 0.05}" ${RD_S}/>`,
      (x, y, s) => [-0.3, -0.1, 0.1, 0.3].map((a) => `<path d="M${x + a * s} ${y - s * 0.3} V${y + s * 0.28}" ${RD_N}/>`).join(''),
      (x, y, s) => `<path d="M${x} ${y - s * 0.3} V${y + s * 0.18}" ${RD_N}/><ellipse cx="${x}" cy="${y + s * 0.26}" rx="${s * 0.22}" ry="${s * 0.08}" ${RD_S}/>`,
      (x, y, s) => `<path d="M${x - s * 0.12} ${y - s * 0.3} v${s * 0.08} l${s * 0.08} ${s * 0.06} l-${s * 0.16} ${s * 0.06} l${s * 0.16} ${s * 0.06} l-${s * 0.16} ${s * 0.06} l${s * 0.08} ${s * 0.06} v${s * 0.08} M${x + s * 0.14} ${y - s * 0.3} v${s * 0.08} l${s * 0.08} ${s * 0.06} l-${s * 0.16} ${s * 0.06} l${s * 0.16} ${s * 0.06} l-${s * 0.16} ${s * 0.06} l${s * 0.08} ${s * 0.06} v${s * 0.08}" ${RD_N}/>`,
      (x, y, s) => `<path d="M${x - s * 0.14} ${y - s * 0.3} V${y + s * 0.1} M${x + s * 0.14} ${y - s * 0.3} V${y + s * 0.1}" ${RD_N}/><path d="M${x - s * 0.36} ${y + s * 0.3} Q${x - s * 0.36} ${y + s * 0.08} ${x - s * 0.14} ${y + s * 0.1} Q${x - s * 0.04} ${y + s * 0.2} ${x - s * 0.06} ${y + s * 0.3} Z M${x + s * 0.36} ${y + s * 0.3} Q${x + s * 0.36} ${y + s * 0.08} ${x + s * 0.14} ${y + s * 0.1} Q${x + s * 0.04} ${y + s * 0.2} ${x + s * 0.06} ${y + s * 0.3} Z" ${RD_S}/>`,
      (x, y, s) => `<path d="M${x - s * 0.3} ${y - s * 0.3} Q${x - s * 0.4} ${y} ${x - s * 0.24} ${y + s * 0.3} M${x - s * 0.1} ${y - s * 0.3} Q${x - s * 0.18} ${y} ${x - s * 0.04} ${y + s * 0.3} M${x + s * 0.1} ${y - s * 0.3} Q${x + s * 0.18} ${y} ${x + s * 0.04} ${y + s * 0.3} M${x + s * 0.3} ${y - s * 0.3} Q${x + s * 0.4} ${y} ${x + s * 0.24} ${y + s * 0.3}" ${RD_N}/>`,
    ]],
    ['Extra', [
      (x, y, s) => `<path d="M${x - s * 0.3} ${y + s * 0.2} Q${x - s * 0.4} ${y - s * 0.2} ${x - s * 0.2} ${y - s * 0.36} Q${x - s * 0.22} ${y - s * 0.04} ${x - s * 0.12} ${y + s * 0.2} Z M${x + s * 0.3} ${y + s * 0.2} Q${x + s * 0.4} ${y - s * 0.2} ${x + s * 0.2} ${y - s * 0.36} Q${x + s * 0.22} ${y - s * 0.04} ${x + s * 0.12} ${y + s * 0.2} Z" ${RD_S}/>`,
      (x, y, s) => `<path d="M${x - s * 0.1} ${y + s * 0.3} Q${x - s * 0.14} ${y - s * 0.05} ${x - s * 0.24} ${y - s * 0.22} M${x + s * 0.1} ${y + s * 0.3} Q${x + s * 0.14} ${y - s * 0.05} ${x + s * 0.24} ${y - s * 0.22}" ${RD_N}/><circle cx="${x - s * 0.26}" cy="${y - s * 0.28}" r="${s * 0.07}" ${RD_S}/><circle cx="${x + s * 0.26}" cy="${y - s * 0.28}" r="${s * 0.07}" ${RD_S}/>`,
      (x, y, s) => `<rect x="${x - s * 0.18}" y="${y - s * 0.34}" width="${s * 0.36}" height="${s * 0.44}" ${RD_S}/><rect x="${x - s * 0.34}" y="${y + s * 0.1}" width="${s * 0.68}" height="${s * 0.08}" rx="${s * 0.03}" ${RD_S}/>`,
      (x, y, s) => [[-0.2, -0.14, 0.09], [0.16, -0.2, 0.07], [0.02, 0.06, 0.1], [-0.22, 0.24, 0.06], [0.24, 0.18, 0.08]].map(([a, b, r]) => `<circle cx="${x + a * s}" cy="${y + b * s}" r="${r * s}" ${RD_S}/>`).join(''),
      (x, y, s) => `<path d="M${x - s * 0.3} ${y + s * 0.2} Q${x - s * 0.32} ${y - s * 0.3} ${x - s * 0.1} ${y - s * 0.1} Q${x} ${y - s * 0.44} ${x + s * 0.1} ${y - s * 0.1} Q${x + s * 0.32} ${y - s * 0.3} ${x + s * 0.3} ${y + s * 0.2}" ${RD_N}/>`,
      (x, y, s) => `<path d="M${x} ${y} L${x - s * 0.32} ${y - s * 0.18} L${x - s * 0.32} ${y + s * 0.18} Z M${x} ${y} L${x + s * 0.32} ${y - s * 0.18} L${x + s * 0.32} ${y + s * 0.18} Z" ${RD_S}/><circle cx="${x}" cy="${y}" r="${s * 0.07}" ${RD_S}/>`,
    ]],
  ] },
};
// A robot shares the monster's eyes, mouths and extras, with its own body, arms and legs.
ROLL_THEMES.robot = { title: 'Roll and draw a robot', parts: [
  ['Head', [
    (x, y, s) => `<rect x="${x - s * 0.36}" y="${y - s * 0.3}" width="${s * 0.72}" height="${s * 0.6}" rx="${s * 0.06}" ${RD_S}/>`,
    (x, y, s) => `<circle cx="${x}" cy="${y}" r="${s * 0.36}" ${RD_S}/>`,
    (x, y, s) => `<path d="${polygonPath(x, y, s * 0.4, 6, 0)}" ${RD_S}/>`,
    (x, y, s) => `<path d="M${x - s * 0.36} ${y + s * 0.3} V${y - s * 0.05} A${s * 0.36} ${s * 0.36} 0 0 1 ${x + s * 0.36} ${y - s * 0.05} V${y + s * 0.3} Z" ${RD_S}/>`,
    (x, y, s) => `<path d="M${x - s * 0.24} ${y - s * 0.34} H${x + s * 0.24} L${x + s * 0.36} ${y + s * 0.3} H${x - s * 0.36} Z" ${RD_S}/>`,
    (x, y, s) => `<rect x="${x - s * 0.24}" y="${y - s * 0.4}" width="${s * 0.48}" height="${s * 0.8}" rx="${s * 0.05}" ${RD_S}/>`,
  ]],
  ['Eyes', [
    (x, y, s) => `<rect x="${x - s * 0.3}" y="${y - s * 0.08}" width="${s * 0.6}" height="${s * 0.16}" rx="${s * 0.08}" ${RD_S}/><circle cx="${x}" cy="${y}" r="${s * 0.05}" ${RD_F}/>`,
    ROLL_THEMES.monster.parts[1][1][1], ROLL_THEMES.monster.parts[1][1][0],
    (x, y, s) => `<rect x="${x - s * 0.3}" y="${y - s * 0.1}" width="${s * 0.2}" height="${s * 0.2}" ${RD_S}/><rect x="${x + s * 0.1}" y="${y - s * 0.1}" width="${s * 0.2}" height="${s * 0.2}" ${RD_S}/>`,
    ROLL_THEMES.monster.parts[1][1][2],
    (x, y, s) => `<path d="M${x - s * 0.3} ${y - s * 0.1} l${s * 0.2} ${s * 0.2} M${x - s * 0.1} ${y - s * 0.1} l-${s * 0.2} ${s * 0.2} M${x + s * 0.1} ${y - s * 0.1} l${s * 0.2} ${s * 0.2} M${x + s * 0.3} ${y - s * 0.1} l-${s * 0.2} ${s * 0.2}" ${RD_N}/>`,
  ]],
  ['Body', [
    (x, y, s) => `<rect x="${x - s * 0.34}" y="${y - s * 0.38}" width="${s * 0.68}" height="${s * 0.76}" rx="${s * 0.06}" ${RD_S}/><rect x="${x - s * 0.2}" y="${y - s * 0.22}" width="${s * 0.4}" height="${s * 0.26}" ${RD_S}/>`,
    (x, y, s) => `<rect x="${x - s * 0.42}" y="${y - s * 0.3}" width="${s * 0.84}" height="${s * 0.6}" rx="${s * 0.08}" ${RD_S}/><circle cx="${x - s * 0.18}" cy="${y}" r="${s * 0.08}" ${RD_S}/><circle cx="${x + s * 0.02}" cy="${y}" r="${s * 0.08}" ${RD_S}/><circle cx="${x + s * 0.22}" cy="${y}" r="${s * 0.08}" ${RD_S}/>`,
    (x, y, s) => `<circle cx="${x}" cy="${y}" r="${s * 0.4}" ${RD_S}/><path d="${starPath(x, y, s * 0.16)}" ${RD_S}/>`,
    (x, y, s) => `<path d="M${x - s * 0.24} ${y - s * 0.38} H${x + s * 0.24} L${x + s * 0.38} ${y + s * 0.38} H${x - s * 0.38} Z" ${RD_S}/><path d="M${x - s * 0.14} ${y} H${x + s * 0.14} M${x - s * 0.18} ${y + s * 0.14} H${x + s * 0.18}" ${RD_N}/>`,
    (x, y, s) => `<rect x="${x - s * 0.34}" y="${y - s * 0.38}" width="${s * 0.68}" height="${s * 0.76}" rx="${s * 0.2}" ${RD_S}/><path d="M${x} ${y - s * 0.12} C${x - s * 0.22} ${y - s * 0.3} ${x - s * 0.22} ${y} ${x} ${y + s * 0.14} C${x + s * 0.22} ${y} ${x + s * 0.22} ${y - s * 0.3} ${x} ${y - s * 0.12} Z" ${RD_S}/>`,
    (x, y, s) => `<path d="${polygonPath(x, y, s * 0.42, 8, Math.PI / 8)}" ${RD_S}/><rect x="${x - s * 0.16}" y="${y - s * 0.1}" width="${s * 0.32}" height="${s * 0.2}" ${RD_S}/>`,
  ]],
  ['Arms', [
    (x, y, s) => `<path d="M${x - s * 0.1} ${y} H${x - s * 0.34} V${y - s * 0.2} M${x + s * 0.1} ${y} H${x + s * 0.34} V${y - s * 0.2}" ${RD_N}/><path d="M${x - s * 0.42} ${y - s * 0.3} A${s * 0.08} ${s * 0.08} 0 1 0 ${x - s * 0.26} ${y - s * 0.3}" ${RD_N}/><path d="M${x + s * 0.26} ${y - s * 0.3} A${s * 0.08} ${s * 0.08} 0 1 0 ${x + s * 0.42} ${y - s * 0.3}" ${RD_N}/>`,
    ROLL_THEMES.monster.parts[3][1][4],
    (x, y, s) => `<path d="M${x - s * 0.1} ${y} l-${s * 0.06} -${s * 0.06} l-${s * 0.06} ${s * 0.06} l-${s * 0.06} -${s * 0.06} l-${s * 0.06} ${s * 0.06} l-${s * 0.06} -${s * 0.06} M${x + s * 0.1} ${y} l${s * 0.06} -${s * 0.06} l${s * 0.06} ${s * 0.06} l${s * 0.06} -${s * 0.06} l${s * 0.06} ${s * 0.06} l${s * 0.06} -${s * 0.06}" ${RD_N}/><circle cx="${x - s * 0.44}" cy="${y - s * 0.04}" r="${s * 0.06}" ${RD_S}/><circle cx="${x + s * 0.44}" cy="${y - s * 0.04}" r="${s * 0.06}" ${RD_S}/>`,
    (x, y, s) => `<rect x="${x - s * 0.44}" y="${y - s * 0.07}" width="${s * 0.32}" height="${s * 0.14}" rx="${s * 0.04}" ${RD_S}/><rect x="${x + s * 0.12}" y="${y - s * 0.07}" width="${s * 0.32}" height="${s * 0.14}" rx="${s * 0.04}" ${RD_S}/>`,
    ROLL_THEMES.monster.parts[3][1][0],
    (x, y, s) => `<path d="M${x - s * 0.1} ${y} H${x - s * 0.3}" ${RD_N}/><rect x="${x - s * 0.44}" y="${y - s * 0.1}" width="${s * 0.14}" height="${s * 0.2}" ${RD_S}/><path d="M${x + s * 0.1} ${y} H${x + s * 0.3}" ${RD_N}/><rect x="${x + s * 0.3}" y="${y - s * 0.1}" width="${s * 0.14}" height="${s * 0.2}" ${RD_S}/>`,
  ]],
  ['Legs', [
    (x, y, s) => `<circle cx="${x - s * 0.2}" cy="${y + s * 0.1}" r="${s * 0.16}" ${RD_S}/><circle cx="${x + s * 0.2}" cy="${y + s * 0.1}" r="${s * 0.16}" ${RD_S}/><circle cx="${x - s * 0.2}" cy="${y + s * 0.1}" r="${s * 0.04}" ${RD_F}/><circle cx="${x + s * 0.2}" cy="${y + s * 0.1}" r="${s * 0.04}" ${RD_F}/>`,
    (x, y, s) => `<rect x="${x - s * 0.4}" y="${y - s * 0.04}" width="${s * 0.8}" height="${s * 0.28}" rx="${s * 0.14}" ${RD_S}/>` + [-0.26, -0.09, 0.09, 0.26].map((a) => `<circle cx="${x + a * s}" cy="${y + s * 0.1}" r="${s * 0.06}" ${RD_S}/>`).join(''),
    ROLL_THEMES.monster.parts[4][1][3],
    (x, y, s) => `<rect x="${x - s * 0.22}" y="${y - s * 0.3}" width="${s * 0.12}" height="${s * 0.46}" ${RD_S}/><rect x="${x + s * 0.1}" y="${y - s * 0.3}" width="${s * 0.12}" height="${s * 0.46}" ${RD_S}/><rect x="${x - s * 0.3}" y="${y + s * 0.16}" width="${s * 0.24}" height="${s * 0.1}" ${RD_S}/><rect x="${x + s * 0.06}" y="${y + s * 0.16}" width="${s * 0.24}" height="${s * 0.1}" ${RD_S}/>`,
    (x, y, s) => `<path d="M${x - s * 0.22} ${y - s * 0.2} L${x - s * 0.1} ${y - s * 0.2} L${x - s * 0.08} ${y + s * 0.06} L${x - s * 0.24} ${y + s * 0.06} Z M${x + s * 0.1} ${y - s * 0.2} L${x + s * 0.22} ${y - s * 0.2} L${x + s * 0.24} ${y + s * 0.06} L${x + s * 0.08} ${y + s * 0.06} Z" ${RD_S}/><path d="M${x - s * 0.22} ${y + s * 0.08} Q${x - s * 0.16} ${y + s * 0.4} ${x - s * 0.1} ${y + s * 0.08} M${x + s * 0.1} ${y + s * 0.08} Q${x + s * 0.16} ${y + s * 0.4} ${x + s * 0.22} ${y + s * 0.08}" ${RD_N}/>`,
    (x, y, s) => `<path d="M${x} ${y - s * 0.3} V${y + s * 0.02}" ${RD_N}/><circle cx="${x}" cy="${y + s * 0.18}" r="${s * 0.16}" ${RD_S}/><circle cx="${x}" cy="${y + s * 0.18}" r="${s * 0.05}" ${RD_F}/>`,
  ]],
  ['Extra', [
    ROLL_THEMES.monster.parts[5][1][1],
    (x, y, s) => `<path d="M${x} ${y + s * 0.3} V${y - s * 0.1}" ${RD_N}/><path d="${starPath(x, y - s * 0.22, s * 0.14)}" ${RD_S}/>`,
    (x, y, s) => `<path d="M${x} ${y} C${x - s * 0.1} ${y - s * 0.2} ${x - s * 0.36} ${y - s * 0.1} ${x - s * 0.2} ${y + s * 0.14} L${x} ${y + s * 0.32} L${x + s * 0.2} ${y + s * 0.14} C${x + s * 0.36} ${y - s * 0.1} ${x + s * 0.1} ${y - s * 0.2} ${x} ${y} Z" ${RD_S}/>`,
    (x, y, s) => `<rect x="${x - s * 0.3}" y="${y - s * 0.24}" width="${s * 0.6}" height="${s * 0.48}" rx="${s * 0.04}" ${RD_S}/><path d="M${x - s * 0.22} ${y + s * 0.08} L${x - s * 0.1} ${y - s * 0.06} L${x} ${y + s * 0.1} L${x + s * 0.08} ${y - s * 0.02} L${x + s * 0.2} ${y + s * 0.08}" ${RD_N}/>`,
    (x, y, s) => `<circle cx="${x}" cy="${y}" r="${s * 0.24}" ${RD_S}/><circle cx="${x}" cy="${y}" r="${s * 0.08}" ${RD_S}/>` + [0, 1, 2, 3, 4, 5, 6, 7].map((k) => { const a = k * Math.PI / 4; return `<path d="M${x + Math.cos(a) * s * 0.24} ${y + Math.sin(a) * s * 0.24} L${x + Math.cos(a) * s * 0.34} ${y + Math.sin(a) * s * 0.34}" ${RD_N}/>`; }).join(''),
    ROLL_THEMES.monster.parts[5][1][5],
  ]],
] };

function dieFace(pg, x, y, s, n) {
  const pips = { 1: [[0.5, 0.5]], 2: [[0.28, 0.28], [0.72, 0.72]], 3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]], 4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]], 5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]], 6: [[0.28, 0.22], [0.72, 0.22], [0.28, 0.5], [0.72, 0.5], [0.28, 0.78], [0.72, 0.78]] };
  pg.add(`<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.18}" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`);
  pips[n].forEach(([a, b]) => pg.add(`<circle cx="${x + a * s}" cy="${y + b * s}" r="${s * 0.09}" fill="${INK}"/>`));
}

function makeRollDraw(o, paper) {
  const theme = ROLL_THEMES[o.theme] || ROLL_THEMES.monster;
  const name = nameOf(o.name, '');
  const pg = new Page(paper, name ? `${possessive(name)} ${theme.title.replace('Roll and draw a ', '')}` : theme.title, { subtitle: 'Roll the dice for each row and circle what you rolled. Then draw your creation in the big box!' });
  const labelW = 22, cw = (pg.width - labelW) / 6, head = 11;
  const rh = Math.min(19, (pg.room * 0.52 - head) / theme.parts.length);
  for (let n = 1; n <= 6; n++) dieFace(pg, pg.left + labelW + cw * (n - 1) + cw / 2 - 4, pg.y, 8, n);
  theme.parts.forEach(([label, draws], r) => {
    const y = pg.y + head + r * rh;
    pg.add(panel(pg.left, y, pg.width, rh - 1.5, TINTS[r % TINTS.length], '#e2ddf2', 4));
    pg.add(txt(pg.left + labelW / 2, y + rh / 2 + 1, label, 4.6, { colour: PALETTE[r % PALETTE.length] }));
    draws.forEach((d, i) => {
      const cx = pg.left + labelW + cw * (i + 0.5);
      pg.add(`<rect x="${cx - cw / 2 + 1}" y="${y + 1}" width="${cw - 2}" height="${rh - 3.5}" rx="3" fill="#fff"/>`);
      pg.add(d(cx, y + (rh - 1.5) / 2, rh - 5));
    });
  });
  pg.y += head + theme.parts.length * rh + 4;
  const boxH = pg.room - 10;
  pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${boxH}" rx="8" fill="#fff" stroke="${INK}" stroke-width="0.6" stroke-dasharray="3 2"/>`);
  pg.add(txt(pg.left + 5, pg.y + 7, '✏️ Draw it here', 4.4, { anchor: 'start', colour: SOFT, font: FONT }));
  const ly = pg.y + boxH + 7;
  pg.add(txt(pg.left, ly, `My ${o.theme === 'robot' ? 'robot' : 'monster'} is called`, 4.4, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 46}" x2="${pg.right}" y1="${ly}" y2="${ly}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  return [pg.svg()];
}

// ================================================================ patterns
const PATTERN_RULES = { easy: ['AB'], medium: ['AAB', 'ABB', 'AABB', 'AB'], hard: ['ABC', 'AABC', 'ABCC', 'ABBC'] };
const PATTERN_PICS = ['apple', 'banana', 'strawberry', 'orange', 'star', 'heart', 'sun', 'cat', 'dog', 'fish', 'daisy', 'tulip', 'balloon', 'present', 'cupcake', 'chick', 'ladybird', 'turtle'];
const PATTERN_SHAPES = [['circle', '#ff6b6b'], ['square', '#6c8cff'], ['triangle', '#ffb938'], ['star', '#b06cff'], ['heart', '#ff7eb6'], ['diamond', '#3fbfa8']];

function makePatterns(o, paper) {
  const rand = rng(+o.seed || 1);
  const level = o.level || 'medium', kind = o.kind || 'pictures';
  const rowsN = 7, show = level === 'hard' ? 7 : 6, blanks = 3;
  const rows = [];
  for (let r = 0; r < rowsN; r++) {
    const rule = PATTERN_RULES[level][(r + Math.floor(rand() * 4)) % PATTERN_RULES[level].length];
    const letters = [...new Set(rule)];
    const pool = kind === 'shapes' ? PATTERN_SHAPES.map((_, i) => i) : PATTERN_PICS;
    const chosen = shuffle(pool, rand).slice(0, letters.length);
    const map = Object.fromEntries(letters.map((l, i) => [l, chosen[i]]));
    const seq = [];
    for (let i = 0; i < show + blanks; i++) seq.push(map[rule[i % rule.length]]);
    // Hard level sometimes hides a gap in the middle as well as at the end.
    const gaps = new Set([show, show + 1, show + 2]);
    if (level === 'hard' && r % 2 === 1) { gaps.delete(show + 2); gaps.add(2 + Math.floor(rand() * 3)); }
    rows.push({ seq, gaps });
  }
  const draw = (pg, item, cx, cy, s, colour) => {
    if (kind === 'shapes') {
      const [shape, hex] = PATTERN_SHAPES[item];
      return shape2d(shape, cx, cy, s * 0.34, `fill="${colour ? hex : '#fff'}" stroke="${INK}" stroke-width="0.8" stroke-linejoin="round"`);
    }
    return pic(ART(item), cx, cy, s * 0.86);
  };
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const sub = kind === 'shapes' ? 'What comes next? Draw and colour the missing shapes.' : 'What comes next? Draw the missing pictures in the empty boxes.';
    const pg = new Page(paper, answers ? 'What comes next: answers' : 'What comes next?', { subtitle: answers ? 'Answer key for grown-ups.' : sub, noName: answers });
    const total = show + blanks, rh = (pg.room - 2) / rowsN, cell = Math.min((pg.width - 12) / total, rh - 6);
    rows.forEach(({ seq, gaps }, r) => {
      const y = pg.y + r * rh, cy = y + rh / 2;
      pg.add(panel(pg.left, y + 1.5, pg.width, rh - 3, TINTS[r % TINTS.length], '#e2ddf2', 6));
      pg.add(`<circle cx="${pg.left + 5.5}" cy="${cy}" r="3.6" fill="${PALETTE[r % PALETTE.length]}"/>` + txt(pg.left + 5.5, cy + 1.5, r + 1, 4.2, { colour: '#fff' }));
      const x0 = pg.left + 11 + (pg.width - 12 - cell * total) / 2;
      seq.forEach((item, i) => {
        const cx = x0 + cell * (i + 0.5);
        if (gaps.has(i)) {
          pg.add(`<rect x="${cx - cell / 2 + 1}" y="${cy - cell / 2 + 1}" width="${cell - 2}" height="${cell - 2}" rx="3" fill="#fff" stroke="#9a93b8" stroke-width="0.5" stroke-dasharray="1.6 1.2"/>`);
          if (answers) pg.add(`<g opacity="0.9">${draw(pg, item, cx, cy, cell - 2, true)}</g>`);
        } else pg.add(draw(pg, item, cx, cy, cell - 2, true));
      });
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ syllables
const SYLLABLES = [['ant', 'ant'], ['bear', 'bear'], ['cake', 'cake'], ['cat', 'cat'], ['chick', 'chick'], ['dog', 'dog'], ['egg', 'egg'], ['fish', 'fish'],
  ['hat', 'hat'], ['heart', 'heart'], ['nest', 'nest'], ['pig', 'pig'], ['rose', 'rose'], ['star', 'star'], ['sun', 'sun'],
  ['apple', 'ap-ple'], ['balloon', 'bal-loon'], ['cookie', 'cook-ie'], ['cupcake', 'cup-cake'], ['daisy', 'dai-sy'], ['donut', 'do-nut'],
  ['lion', 'li-on'], ['lolly', 'lol-ly'], ['medal', 'med-al'], ['monkey', 'mon-key'], ['mushroom', 'mush-room'], ['orange', 'or-ange'],
  ['present', 'pres-ent'], ['rainbow', 'rain-bow'], ['tulip', 'tu-lip'], ['turtle', 'tur-tle'], ['zebra', 'ze-bra'],
  ['banana', 'ba-na-na'], ['blueberry', 'blue-ber-ry'], ['envelope', 'en-ve-lope'], ['gorilla', 'go-ril-la'], ['ladybird', 'la-dy-bird'],
  ['octopus', 'oc-to-pus'], ['strawberry', 'straw-ber-ry'], ['sunflower', 'sun-flow-er']];

function drum(x, y, s) {
  return `<ellipse cx="${x}" cy="${y - s * 0.3}" rx="${s * 0.5}" ry="${s * 0.16}" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`
    + `<path d="M${x - s * 0.5} ${y - s * 0.3} V${y + s * 0.28} A${s * 0.5} ${s * 0.16} 0 0 0 ${x + s * 0.5} ${y + s * 0.28} V${y - s * 0.3}" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`
    + `<path d="M${x - s * 0.5} ${y - s * 0.12} L${x - s * 0.25} ${y + s * 0.3} L${x} ${y - s * 0.12} L${x + s * 0.25} ${y + s * 0.3} L${x + s * 0.5} ${y - s * 0.12}" fill="none" stroke="#e0457b" stroke-width="0.45"/>`
    + `<path d="M${x - s * 0.1} ${y - s * 0.55} L${x + s * 0.5} ${y - s * 0.95} M${x + s * 0.1} ${y - s * 0.55} L${x - s * 0.5} ${y - s * 0.95}" stroke="#8d5524" stroke-width="0.6" stroke-linecap="round"/>`;
}

function makeSyllables(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'count';
  const pages = [];
  if (kind === 'sort') {
    const by = [1, 2, 3].map((n) => shuffle(SYLLABLES.filter(([, s]) => s.split('-').length === n), rand).slice(0, 3));
    const words = shuffle(by.flat(), rand);
    const pg = new Page(paper, 'Clap and sort', { subtitle: 'Say each word and clap the beats. Cut out the pictures and stick them in the right column.' });
    const colW = pg.width / 3, colH = pg.room * 0.56;
    [1, 2, 3].forEach((n, i) => {
      const x = pg.left + colW * i;
      pg.add(panel(x + 2, pg.y, colW - 4, colH, TINTS[i * 2], PALETTE[i * 2], 6));
      for (let d = 0; d < n; d++) pg.add(drum(x + colW / 2 + (d - (n - 1) / 2) * 11, pg.y + 9, 8));
      pg.add(txt(x + colW / 2, pg.y + 22, `${n} clap${n > 1 ? 's' : ''}`, 6, { colour: PALETTE[i * 2] }));
    });
    const ty = pg.y + colH + 12;
    scissors(pg, ty - 5);
    const tile = Math.min(34, (pg.width - 10) / 5.2), gap = (pg.width - tile * 5) / 4;
    words.forEach(([w], i) => {
      const x = pg.left + (i % 5) * (tile + gap), y = ty + Math.floor(i / 5) * (tile + 8);
      cutTile(pg, x, y, tile, pic(ART(w), x + tile / 2, y + tile / 2 - 2.5, tile * 0.7) + txt(x + tile / 2, y + tile - 2.5, w, fitFont(w, 4.4, tile - 4)), i);
    });
    pages.push(pg.svg());
    return pages;
  }
  const count = 8;
  const list = shuffle(SYLLABLES, rand).slice(0, count);
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const split = kind === 'split';
    const pg = new Page(paper, answers ? 'Clap the syllables: answers' : split ? 'Break the word into beats' : 'Clap the syllables', { subtitle: answers ? 'Answer key for grown-ups.' : split ? 'Say the word slowly and clap. Write each beat in its own box.' : 'Say the word and clap the beats. Colour one drum for every clap.', noName: answers });
    const cols = 2, rows = count / cols, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    list.forEach(([w, s], i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch, parts = s.split('-');
      pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, '#fff', '#e2ddf2', 6));
      const size = Math.min(ch - 12, cw * (split ? 0.3 : 0.4));
      pg.add(`<rect x="${x + 6}" y="${y + 6}" width="${size}" height="${size}" rx="5" fill="${TINTS[i % TINTS.length]}"/>`);
      pg.add(pic(ART(w), x + 6 + size / 2, y + 6 + size / 2, size * 0.86));
      const tx = x + size + 12, room = cw - size - 18;
      pg.add(txt(tx + room / 2, y + 14, w, fitFont(w, 8, room), {}));
      if (split) {
        const bw = Math.min((room - 4) / 3, 26);
        for (let b = 0; b < 3; b++) {
          const bx = tx + room / 2 + (b - 1) * (bw + 2) - bw / 2, by = y + ch / 2 + 2;
          pg.add(`<rect x="${bx}" y="${by}" width="${bw}" height="12" rx="2.5" fill="#fff" stroke="#9a93b8" stroke-width="0.5"/>`);
          if (answers && parts[b]) pg.add(txt(bx + bw / 2, by + 8.4, parts[b], fitFont(parts[b], 6, bw - 2), { colour: '#e0457b' }));
        }
      } else {
        for (let d = 0; d < 3; d++) {
          const dx = tx + room / 2 + (d - 1) * Math.min(14, room / 3), dy = y + ch / 2 + 6;
          pg.add(drum(dx, dy, 10));
          if (answers && d < parts.length) pg.add(`<circle cx="${dx}" cy="${dy}" r="7.4" fill="none" stroke="#e0457b" stroke-width="1"/>`);
        }
        if (answers) pg.add(txt(tx + room / 2, y + ch - 7, parts.join(' • '), 4.4, { colour: '#e0457b', font: FONT }));
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ door hangers
const HANGER_SETS = {
  sleep: { sides: ['Shh! Sleeping', 'Good morning! Come in'], line: ['owl', 'teddy'], bright: ['star', 'sun'] },
  reading: { sides: ['Do not disturb. I am reading!', 'Come in! Let\'s read together'], line: ['cat', 'bunny'], bright: ['monkey', 'lion'] },
  play: { sides: ['Genius at work', 'Knock knock! Come in'], line: ['robot', 'rocket'], bright: ['popper', 'rainbow'] },
  tidy: { sides: ['Tidying up! Nearly done', 'All tidy! Come and see'], line: ['penguin', 'unicorn'], bright: ['chick', 'present'] },
};

function makeDoorHangers(o, paper) {
  const set = HANGER_SETS[o.set] || HANGER_SETS.sleep;
  const bright = o.style === 'bright';
  const name = nameOf(o.name, '');
  const custom = listOf(o.custom, 2);
  const sides = o.set === 'custom' && custom.length ? [custom[0], custom[1] || custom[0]] : set.sides;
  const pg = new Page(paper, '', { bare: true });
  const w = (pg.width - 8) / 2, h = pg.bottom - pg.m - 8, R = w * 0.2;
  pg.add(txt(pg.w / 2, pg.m + 4, 'Cut out both sides and glue them back to back. Colour, then hang it on your door!', 3.8, { font: FONT, colour: SOFT }));
  for (let k = 0; k < 2; k++) {
    const x = pg.left + k * (w + 8), y = pg.m + 9, c = k ? 2 : 4;
    const hx = x + w / 2, hy = y + R + 8;
    const shape = `M${x + 6} ${y} H${x + w - 6} Q${x + w} ${y} ${x + w} ${y + 6} V${y + h - 8} Q${x + w} ${y + h} ${x + w - 8} ${y + h} H${x + 8} Q${x} ${y + h} ${x} ${y + h - 8} V${y + 6} Q${x} ${y} ${x + 6} ${y} Z`;
    pg.add(`<path d="${shape}" fill="${bright ? TINTS[c] : '#fff'}" stroke="${bright ? PALETTE[c] : INK}" stroke-width="1"/>`);
    // The hole for the door handle, with a slit to slide it on.
    pg.add(`<circle cx="${hx}" cy="${hy}" r="${R}" fill="#fff" stroke="${INK}" stroke-width="0.8" stroke-dasharray="2 1.4"/><path d="M${hx} ${hy - R} V${y}" stroke="${INK}" stroke-width="0.8" stroke-dasharray="2 1.4"/>`);
    let ty = hy + R + 12;
    if (name) {
      const label = `${possessive(name)} room`;
      const fs = Math.min(11, (w - 10) / (label.length * 0.56));
      pg.add(`<text x="${hx}" y="${ty}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs.toFixed(2)}" fill="${bright ? PALETTE[c] : '#fff'}" stroke="${bright ? '#fff' : INK}" stroke-width="${(fs * (bright ? 0.12 : 0.07)).toFixed(2)}" paint-order="stroke">${esc(label)}</text>`);
      ty += 6;
    }
    const size = Math.min(w - 10, h * 0.42);
    if (bright) pg.add(pic(ART(set.bright[k]), hx, ty + size / 2, size));
    else pg.add(`<g transform="translate(${hx - size / 2} ${ty}) scale(${(size / 200).toFixed(4)})">${colouringArt(set.line[k])}</g>`);
    const words = wrap(sides[k], 12);
    const fs = Math.min(13, (w - 10) / (Math.max(...words.map((l) => l.length)) * 0.58));
    const lh = fs * 1.12, top = ty + size + 4, room = y + h - 14 - top;
    const by = top + (room - lh * words.length) / 2 + fs * 0.9;
    words.forEach((l, i) => pg.add(`<text x="${hx}" y="${by + i * lh}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs.toFixed(2)}" fill="${bright ? PALETTE[c] : '#fff'}" stroke="${INK}" stroke-width="${bright ? 0 : (fs * 0.05).toFixed(2)}" paint-order="stroke">${esc(l)}</text>`));
    for (let s = 0; s < 3; s++) pg.add(`<path d="${starPath(x + 10 + s * (w - 20) / 2, y + h - 8, 3, 0.45)}" fill="${bright ? PALETTE[(c + s) % PALETTE.length] : '#fff'}" stroke="${INK}" stroke-width="0.5" stroke-linejoin="round"/>`);
  }
  pg.footer = () => {};
  return [pg.svg()];
}

// ================================================================ 30 day challenges
const CHALLENGES = {
  kindness: { title: '30 days of kindness', items: ['Give someone a big smile', 'Say thank you to a helper', 'Draw a picture for a friend', 'Help set the table', 'Share a toy', 'Give a hug to someone you love',
    'Tell someone why they are great', 'Tidy up without being asked', 'Make a card for a grandparent', 'Help a friend who is sad', 'Say good morning to a neighbour', 'Feed the birds',
    'Hold the door open', 'Let someone else go first', 'Help make dinner', 'Pick up litter (with a grown-up)', 'Read a story to a toy or a sibling', 'Water a plant',
    'Say sorry and mean it', 'Play with someone new', 'Leave a kind note', 'Help carry the shopping', 'Give 3 compliments today', 'Call someone you miss',
    'Make someone laugh', 'Share your snack', 'Thank your teacher', 'Help fold the washing', 'Be kind to yourself today', 'Plan a surprise for your family'] },
  reading: { title: '30 day reading challenge', items: ['Read in a blanket fort', 'Read to a teddy', 'Read a book about animals', 'Read with a torch', 'Read a funny book', 'Read outside',
    'Read a book with no words', 'Read in a silly voice', 'Read a book about space', 'Read to a grown-up', 'Read a poem', 'Read a recipe and cook it',
    'Read a book from the library', 'Read in the bath (carefully!)', 'Read a book twice', 'Draw your favourite page', 'Read a book about a friend', 'Read a fairy tale',
    'Read a book about the sea', 'Act out a story', 'Read a book about dinosaurs', 'Read under the table', 'Read a comic', 'Read a book about a big feeling',
    'Swap books with a friend', 'Read a book about a job', 'Read in the car', 'Read a book at bedtime', 'Make up your own story', 'Read your favourite book again'] },
  outdoors: { title: '30 days outdoors', items: ['Find 5 different leaves', 'Jump in a puddle', 'Watch the clouds', 'Find a snail or a worm', 'Collect 10 stones', 'Listen for birds',
    'Draw a picture with chalk', 'Look for a rainbow', 'Plant a seed', 'Go on a colour hunt', 'Hug a tree', 'Have a picnic',
    'Make a leaf crown', 'Race a friend', 'Look at the moon', 'Find something round', 'Make a mud pie', 'Count 20 flowers',
    'Blow bubbles', 'Build a stick tower', 'Find a feather', 'Walk like 5 animals', 'Feel the wind', 'Spot a bee or a butterfly',
    'Play hide and seek', 'Make a nature picture', 'Find your shadow', 'Splash some water', 'Look for a nest', 'Watch the sunset'] },
  helper: { title: '30 days of being a helper', items: ['Make my bed', 'Put my clothes away', 'Feed a pet', 'Water the plants', 'Put my shoes away', 'Help unpack the shopping',
    'Wipe the table', 'Sort the socks', 'Tidy my toys', 'Help wash the car', 'Put my plate away', 'Help make a sandwich',
    'Sweep the floor', 'Carry the bags', 'Fold the towels', 'Clean my teeth well', 'Pack my school bag', 'Help with the recycling',
    'Wash some fruit', 'Dust a shelf', 'Tidy the books', 'Help make a cake', 'Line up the shoes', 'Match the lids and boxes',
    'Help plant something', 'Put the washing in', 'Set the table', 'Help a sibling', 'Get ready by myself', 'Tidy the whole room!'] },
};

function makeChallenge(o, paper) {
  const rand = rng(+o.seed || 1);
  const ch = CHALLENGES[o.theme] || CHALLENGES.kindness;
  const days = +o.days === 14 ? 14 : 30;
  const name = nameOf(o.name, '');
  const items = (o.order === 'shuffle' ? shuffle(ch.items, rand) : ch.items).slice(0, days);
  const title = name ? `${possessive(name)} ${ch.title}` : ch.title[0].toUpperCase() + ch.title.slice(1);
  const pg = new Page(paper, title, { subtitle: 'Do one each day, then colour the star. You can do them in any order!', noName: !!name });
  const cols = days === 14 ? 4 : 5, rows = Math.ceil(days / cols);
  const cw = pg.width / cols, chh = (pg.room - 16) / rows;
  items.forEach((t, i) => {
    const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * chh, c = i % PALETTE.length;
    pg.add(panel(x + 1.2, y + 1.2, cw - 2.4, chh - 2.4, TINTS[c], PALETTE[c], 4));
    pg.add(`<circle cx="${x + 6.5}" cy="${y + 6.5}" r="3.8" fill="${PALETTE[c]}"/>` + txt(x + 6.5, y + 8, i + 1, 3.8, { colour: '#fff' }));
    const fs = days === 14 ? 4.6 : 3.7;
    const lines = wrap(t, Math.floor((cw - 6) / (fs * 0.52)));
    const ty = y + 13 + fs;
    textLines(pg, lines, x + cw / 2, ty, fs, { anchor: 'middle', weight: 800 });
    const sr = Math.min(5.5, (y + chh - 3 - (ty + lines.length * fs * 1.32)) / 2.2);
    if (sr > 2) pg.add(`<path d="${starPath(x + cw / 2, y + chh - 3.5 - sr, sr * 1.1, 0.46)}" fill="#fff" stroke="${PALETTE[c]}" stroke-width="0.7" stroke-linejoin="round"/>`);
  });
  const by = pg.bottom - 6;
  pg.add(pic(ART('medal'), pg.left + 6, by - 1, 11));
  pg.add(txt(pg.left + 14, by + 1, `I finished on`, 4.4, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 40}" x2="${pg.left + 100}" y1="${by + 1}" y2="${by + 1}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  pg.add(txt(pg.right, by + 1, 'Well done, superstar!', 5, { anchor: 'end', colour: '#e0457b' }));
  return [pg.svg()];
}

// ================================================================ doubles and halves
function ladybird(cx, cy, r, spots, rand) {
  let s = `<path d="M${cx - r * 0.12} ${cy - r * 0.98} Q${cx - r * 0.3} ${cy - r * 1.35} ${cx - r * 0.42} ${cy - r * 1.3} M${cx + r * 0.12} ${cy - r * 0.98} Q${cx + r * 0.3} ${cy - r * 1.35} ${cx + r * 0.42} ${cy - r * 1.3}" fill="none" stroke="${INK}" stroke-width="0.6" stroke-linecap="round"/>`;
  s += `<path d="M${cx - r * 0.42} ${cy - r * 0.78} A${r * 0.44} ${r * 0.36} 0 0 1 ${cx + r * 0.42} ${cy - r * 0.78} Z" fill="${INK}"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ff6b6b" stroke="${INK}" stroke-width="0.8"/><line x1="${cx}" x2="${cx}" y1="${cy - r}" y2="${cy + r}" stroke="${INK}" stroke-width="0.8"/>`;
  const spotsAt = [[-0.5, -0.45], [-0.3, -0.05], [-0.6, 0.2], [-0.35, 0.5], [-0.7, -0.15], [-0.18, 0.72], [-0.16, -0.62], [-0.55, 0.62], [-0.15, 0.3], [-0.75, 0.35]];
  for (let i = 0; i < spots; i++) { const [a, b] = spotsAt[i]; s += `<circle cx="${cx + a * r}" cy="${cy + b * r}" r="${r * 0.12}" fill="${INK}"/>`; }
  return s;
}

function makeDoubles(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'ladybird', max = +o.max || 5;
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const r2 = rng(+o.seed || 1);
    const nums = shuffle([...Array(max).keys()].map((k) => k + 1), r2);
    const pick = (i) => nums[i % nums.length];
    if (kind === 'ladybird') {
      const pg = new Page(paper, answers ? 'Ladybird doubles: answers' : 'Ladybird doubles', { subtitle: answers ? 'Answer key for grown-ups.' : 'Draw the same number of spots on the other wing. How many spots now?', noName: answers });
      const cw = pg.width / 2, ch = (pg.room - 2) / 3;
      for (let i = 0; i < 6; i++) {
        const n = Math.min(pick(i), 10), x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * ch;
        pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, TINTS[i % TINTS.length], '#e2ddf2', 6));
        const r = Math.min(cw * 0.26, ch * 0.3);
        pg.add(ladybird(x + cw / 2, y + 12 + r * 1.2, r, n, r2));
        if (answers) pg.add(`<g transform="translate(${2 * (x + cw / 2)} 0) scale(-1 1)" opacity="0.55">${Array.from({ length: n }, (_, k) => { const at = [[-0.5, -0.45], [-0.3, -0.05], [-0.6, 0.2], [-0.35, 0.5], [-0.7, -0.15], [-0.18, 0.72], [-0.16, -0.62], [-0.55, 0.62], [-0.15, 0.3], [-0.75, 0.35]][k]; return `<circle cx="${x + cw / 2 + at[0] * r}" cy="${y + 12 + r * 1.2 + at[1] * r}" r="${r * 0.12}" fill="${INK}"/>`; }).join('')}</g>`);
        const sy = y + ch - 9;
        const sum = `${n} + ${n} = `;
        pg.add(txt(x + cw / 2 - 4, sy, sum, 8, { anchor: 'end' }));
        pg.add(`<rect x="${x + cw / 2 - 2}" y="${sy - 7}" width="16" height="9.5" rx="2.5" fill="#fff" stroke="#9a93b8" stroke-width="0.5"/>`);
        if (answers) pg.add(txt(x + cw / 2 + 6, sy, n * 2, 7, { colour: '#e0457b' }));
      }
      pages.push(pg.svg());
      continue;
    }
    if (kind === 'halves') {
      const pg = new Page(paper, answers ? 'Share it fairly: answers' : 'Share it fairly', { subtitle: answers ? 'Answer key for grown-ups.' : 'Share the treats between the two friends so they get the same. Draw them on the plates.', noName: answers });
      const treats = shuffle(['cookie', 'strawberry', 'cupcake', 'donut', 'apple', 'blueberry', 'orange', 'lolly'], r2);
      const ch = (pg.room - 2) / 4;
      for (let i = 0; i < 4; i++) {
        const half = Math.min(pick(i), 6), n = half * 2, y = pg.y + i * ch, t = treats[i];
        pg.add(panel(pg.left, y + 2, pg.width, ch - 4, TINTS[i % TINTS.length], '#e2ddf2', 6));
        const s = Math.min(11, (pg.width * 0.46) / n);
        for (let k = 0; k < n; k++) pg.add(pic(ART(t), pg.left + 8 + s * (k + 0.5), y + 10 + s / 2, s * 0.95));
        pg.add(txt(pg.left + 8, y + ch - 9, `Share ${n}. Each friend gets`, 5, { anchor: 'start', font: FONT }));
        pg.add(`<rect x="${pg.left + 76}" y="${y + ch - 16}" width="14" height="9.5" rx="2.5" fill="#fff" stroke="#9a93b8" stroke-width="0.5"/>`);
        if (answers) pg.add(txt(pg.left + 83, y + ch - 9, half, 7, { colour: '#e0457b' }));
        ['lion', 'monkey'].forEach((a, j) => {
          const px = pg.left + pg.width * (0.66 + j * 0.2), py = y + ch / 2 + 2, pr = Math.min(pg.width * 0.085, ch * 0.3);
          pg.add(pic(ART(i % 2 ? ['pig', 'zebra'][j] : a), px, y + 9, 12));
          pg.add(`<ellipse cx="${px}" cy="${py + 4}" rx="${pr}" ry="${pr * 0.72}" fill="#fff" stroke="${INK}" stroke-width="0.6"/><ellipse cx="${px}" cy="${py + 4}" rx="${pr * 0.72}" ry="${pr * 0.5}" fill="none" stroke="#e2ddf2" stroke-width="0.5"/>`);
          if (answers) for (let k = 0; k < half; k++) pg.add(pic(ART(t), px + ((k % 3) - 1) * pr * 0.44, py + 4 + (Math.floor(k / 3) - 0.5) * pr * 0.44, pr * 0.42));
        });
      }
      pages.push(pg.svg());
      continue;
    }
    // Double and half number facts
    const pg = new Page(paper, answers ? 'Doubles and halves: answers' : 'Doubles and halves', { subtitle: answers ? 'Answer key for grown-ups.' : 'Double means two lots of the same. Half means share into two equal parts.', noName: answers });
    const cw = pg.width / 2, rows = Math.min(10, max), rh = (pg.room - 16) / Math.max(rows, 7);
    pg.add(panel(pg.left + 1, pg.y, cw - 2, 12, '#ffe8ef', '#ff7eb6', 5) + txt(pg.left + cw / 2, pg.y + 8.2, 'Double it!', 6.4, { colour: '#e0457b' }));
    pg.add(panel(pg.left + cw + 1, pg.y, cw - 2, 12, '#e6f1ff', '#6c8cff', 5) + txt(pg.left + cw * 1.5, pg.y + 8.2, 'Halve it!', 6.4, { colour: '#3a64d8' }));
    const top = max;
    const dbl = shuffle([...Array(top).keys()].map((k) => k + 1), r2).slice(0, rows);
    const hlf = shuffle([...Array(top).keys()].map((k) => (k + 1) * 2), r2).slice(0, rows);
    for (let i = 0; i < rows; i++) {
      const y = pg.y + 18 + i * rh + rh * 0.6;
      pg.add(txt(pg.left + cw / 2 - 2, y, `Double ${dbl[i]} =`, 6, { anchor: 'end', font: FONT }));
      pg.add(`<rect x="${pg.left + cw / 2 + 1}" y="${y - 6.5}" width="16" height="9" rx="2.5" fill="#fff" stroke="#9a93b8" stroke-width="0.5"/>`);
      if (answers) pg.add(txt(pg.left + cw / 2 + 9, y, dbl[i] * 2, 6, { colour: '#e0457b' }));
      pg.add(txt(pg.left + cw * 1.5 - 2, y, `Half of ${hlf[i]} =`, 6, { anchor: 'end', font: FONT }));
      pg.add(`<rect x="${pg.left + cw * 1.5 + 1}" y="${y - 6.5}" width="16" height="9" rx="2.5" fill="#fff" stroke="#9a93b8" stroke-width="0.5"/>`);
      if (answers) pg.add(txt(pg.left + cw * 1.5 + 9, y, hlf[i] / 2, 6, { colour: '#e0457b' }));
    }
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ position words
const POSITIONS = ['in', 'on', 'under', 'next to', 'behind', 'in front of', 'above', 'between'];
const POS_PETS = ['cat', 'dog', 'monkey', 'chick', 'pig', 'bear', 'turtle', 'lion'];

function crate(x, y, w, h, open) {
  const d = w * 0.22;
  let s = `<path d="M${x} ${y} L${x + d} ${y - d * 0.7} H${x + w + d} L${x + w} ${y} Z" fill="${open ? '#8d5524' : '#f4c27a'}" stroke="${INK}" stroke-width="0.6" stroke-linejoin="round"/>`;
  s += `<path d="M${x + w} ${y} L${x + w + d} ${y - d * 0.7} V${y + h - d * 0.7} L${x + w} ${y + h} Z" fill="#d99a4e" stroke="${INK}" stroke-width="0.6" stroke-linejoin="round"/>`;
  return s;
}
const boxFront = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f0b565" stroke="${INK}" stroke-width="0.6"/><path d="M${x + w * 0.1} ${y + h * 0.3} H${x + w * 0.9}" stroke="#c88a3e" stroke-width="0.6"/>`;

function scene(pos, pet, cx, cy, s) {
  // s is the scene size; the box sits in the middle.
  const bw = s * 0.4, bh = s * 0.3, bx = cx - bw / 2 - s * 0.04, by = cy + s * 0.08, a = s * 0.36;
  const P2 = (x, y, size = a) => pic(ART(pet), x, y, size);
  const ground = `<line x1="${cx - s * 0.46}" x2="${cx + s * 0.46}" y1="${by + bh}" y2="${by + bh}" stroke="#b9b3d6" stroke-width="0.6"/>`;
  const whole = () => crate(bx, by, bw, bh, false) + boxFront(bx, by, bw, bh);
  switch (pos) {
    case 'in': return ground + crate(bx, by, bw, bh, true) + P2(bx + bw * 0.55, by - a * 0.12) + boxFront(bx, by, bw, bh);
    case 'on': return ground + whole() + P2(bx + bw * 0.55, by - a * 0.62);
    case 'under': {
      const tw = s * 0.6, ty = cy - s * 0.12, tx = cx - tw / 2, leg = by + bh - ty;
      return ground + `<rect x="${tx}" y="${ty - 3}" width="${tw}" height="4" rx="1" fill="#c88a3e" stroke="${INK}" stroke-width="0.6"/><rect x="${tx + 3}" y="${ty + 1}" width="3" height="${leg - 1}" fill="#c88a3e" stroke="${INK}" stroke-width="0.5"/><rect x="${tx + tw - 6}" y="${ty + 1}" width="3" height="${leg - 1}" fill="#c88a3e" stroke="${INK}" stroke-width="0.5"/>` + P2(cx, by + bh - a * 0.46);
    }
    case 'next to': return ground + whole() + P2(bx + bw + bw * 0.22 + a * 0.62, by + bh - a * 0.46);
    case 'behind': return ground + P2(bx + bw * 0.9, by - a * 0.14, a * 0.95) + whole();
    case 'in front of': return ground + crate(bx - s * 0.02, by - s * 0.08, bw, bh, false) + boxFront(bx - s * 0.02, by - s * 0.08, bw, bh) + P2(bx + bw * 0.45, by + bh - a * 0.4, a * 1.05);
    case 'above': return ground + whole() + P2(bx + bw * 0.55, by - s * 0.34) + `<path d="M${bx + bw * 0.55 - 5} ${by - s * 0.34 + a * 0.5 + 2} q2 2 4 0 t4 0" fill="none" stroke="${SOFT}" stroke-width="0.4"/>`;
    case 'between': {
      const w2 = bw * 0.62, h2 = bh * 0.8, y2 = by + bh - h2;
      return ground + crate(cx - s * 0.42, y2, w2, h2, false) + boxFront(cx - s * 0.42, y2, w2, h2) + crate(cx + s * 0.42 - w2 - w2 * 0.22, y2, w2, h2, false) + boxFront(cx + s * 0.42 - w2 - w2 * 0.22, y2, w2, h2) + P2(cx - s * 0.02, by + bh - a * 0.46);
    }
    default: return '';
  }
}

function makePosition(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'circle';
  const pages = [];
  const list = shuffle(POSITIONS, rand).slice(0, 6).map((p, i) => [p, POS_PETS[(i + Math.floor(rand() * 8)) % POS_PETS.length]]);
  if (kind === 'draw') {
    const pg = new Page(paper, 'Where is it? Draw it!', { subtitle: 'Read each sentence with a grown-up and draw the picture.' });
    const cw = pg.width / 2, ch = (pg.room - 2) / 3;
    const things = ['a ball', 'a star', 'a flower', 'a cake', 'a sun', 'a fish'];
    list.forEach(([p], i) => {
      const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * ch;
      const thing = things[i], table = p === 'under';
      pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, '#fff', '#e2ddf2', 6));
      const sentence = `Draw ${thing} ${p} the ${p === 'between' ? 'boxes' : table ? 'table' : 'box'}.`;
      pg.add(txt(x + cw / 2, y + 10, sentence, fitFont(sentence, 5, cw - 10, 0.5), { font: FONT }));
      const s = Math.min(cw - 10, ch - 18), cx = x + cw / 2, cy = y + 14 + s / 2;
      const bw = s * 0.36, bh = s * 0.28, bx = cx - bw / 2 - s * 0.03, by = cy + s * 0.08;
      if (table) {
        const tw = s * 0.6, ty = cy - s * 0.12, tx = cx - tw / 2, leg = by + bh - ty;
        pg.add(`<line x1="${cx - s * 0.46}" x2="${cx + s * 0.46}" y1="${by + bh}" y2="${by + bh}" stroke="#b9b3d6" stroke-width="0.6"/><rect x="${tx}" y="${ty - 3}" width="${tw}" height="4" rx="1" fill="#fff" stroke="${INK}" stroke-width="0.6"/><rect x="${tx + 3}" y="${ty + 1}" width="3" height="${leg - 1}" fill="#fff" stroke="${INK}" stroke-width="0.5"/><rect x="${tx + tw - 6}" y="${ty + 1}" width="3" height="${leg - 1}" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`);
      } else if (p === 'between') {
        const w2 = bw * 0.62, h2 = bh * 0.8, y2 = by + bh - h2;
        pg.add(`<line x1="${cx - s * 0.46}" x2="${cx + s * 0.46}" y1="${by + bh}" y2="${by + bh}" stroke="#b9b3d6" stroke-width="0.6"/>` + crate(cx - s * 0.42, y2, w2, h2, false) + boxFront(cx - s * 0.42, y2, w2, h2) + crate(cx + s * 0.42 - w2 - w2 * 0.22, y2, w2, h2, false) + boxFront(cx + s * 0.42 - w2 - w2 * 0.22, y2, w2, h2));
      } else {
        pg.add(`<line x1="${cx - s * 0.46}" x2="${cx + s * 0.46}" y1="${by + bh}" y2="${by + bh}" stroke="#b9b3d6" stroke-width="0.6"/>` + crate(bx, by, bw, bh, p === 'in') + boxFront(bx, by, bw, bh));
      }
    });
    pages.push(pg.svg());
    return pages;
  }
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Where is it? Answers' : 'Where is it?', { subtitle: answers ? 'Answer key for grown-ups.' : kind === 'write' ? 'Look at each picture. Write the missing word from the word bank.' : 'Look at each picture. Circle the word that tells you where the animal is.', noName: answers });
    if (kind === 'write') {
      pg.add(panel(pg.left, pg.y, pg.width, 12, '#fff6e0', '#ffb938', 5));
      const bank = shuffle(list.map(([p]) => p), rand);
      bank.forEach((p, i) => pg.add(txt(pg.left + pg.width * (i + 0.5) / bank.length, pg.y + 8.2, p, 5.4, { colour: PALETTE[i % PALETTE.length] })));
      pg.y += 16;
    }
    const cw = pg.width / 2, ch = (pg.room - 2) / 3;
    list.forEach(([p, pet], i) => {
      const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * ch;
      pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, TINTS[i % TINTS.length], '#e2ddf2', 6));
      const s = Math.min(cw - 8, ch - 16);
      pg.add(scene(p, pet, x + cw / 2, y + 3 + s / 2, s));
      const ay = y + ch - 8;
      if (kind === 'write') {
        const pre = `The ${pet} is`, post = p === 'between' ? 'the boxes.' : p === 'under' ? 'the table.' : 'the box.';
        const fs = 4.8;
        pg.add(txt(x + 7, ay, pre, fs, { anchor: 'start', font: FONT }));
        const lx = x + 7 + pre.length * fs * 0.5 + 2;
        pg.add(`<line x1="${lx}" x2="${lx + 26}" y1="${ay + 0.6}" y2="${ay + 0.6}" stroke="#9a93b8" stroke-width="0.4"/>`);
        if (answers) pg.add(txt(lx + 13, ay - 0.6, p, fs, { colour: '#e0457b' }));
        pg.add(txt(lx + 28, ay, post, fs, { anchor: 'start', font: FONT }));
      } else {
        const opts = shuffle([p, ...shuffle(POSITIONS.filter((q) => q !== p), rand).slice(0, 2)], rand);
        opts.forEach((q, k) => {
          const ox = x + cw * (k + 0.5) / 3;
          pg.add(txt(ox, ay, q, fitFont(q, 5.2, cw / 3 - 4, 0.5), { colour: INK, font: FONT }));
          if (answers && q === p) pg.add(`<ellipse cx="${ox}" cy="${ay - 1.7}" rx="${cw / 6 - 2}" ry="4.4" fill="none" stroke="#e0457b" stroke-width="1"/>`);
        });
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

Object.assign(MAKERS, { oddone: makeOddOne, rolldraw: makeRollDraw, patterns: makePatterns, syllables: makeSyllables, doorhangers: makeDoorHangers, challenge: makeChallenge, doubles: makeDoubles, position: makePosition });
