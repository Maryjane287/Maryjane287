// Magazine cover and page renderer. Shared by the static build (Node) and the
// magazine maker in the browser, so every cover looks the same everywhere.

export const PALETTES = {
  coral:    { bg: '#ff6b5b', ink: '#1d1a2f', accent: '#ffd23f', pop: '#fff4e6' },
  midnight: { bg: '#1d1a2f', ink: '#fff4e6', accent: '#ff6b5b', pop: '#ffd23f' },
  butter:   { bg: '#ffd23f', ink: '#1d1a2f', accent: '#ff4f7b', pop: '#ffffff' },
  mint:     { bg: '#7ee0b5', ink: '#14323a', accent: '#ff6b5b', pop: '#fffbe8' },
  rose:     { bg: '#f7c6cf', ink: '#3a0f1f', accent: '#c2185b', pop: '#ffffff' },
  sky:      { bg: '#6ec6ff', ink: '#10233f', accent: '#ffd23f', pop: '#ffffff' },
  paper:    { bg: '#f3ead8', ink: '#1b1b1b', accent: '#8b1e1e', pop: '#ffffff' },
  cosmos:   { bg: '#2a1f5c', ink: '#fff4e6', accent: '#ffd23f', pop: '#c9b6ff' },
  festive:  { bg: '#0f5c4a', ink: '#fffaf0', accent: '#ff4f5e', pop: '#ffd23f' },
};

const SKIN = ['#f6d5c0', '#e8b48f', '#b97a56', '#7a4a32'];

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Field values fall back to each field's example, so a half filled form still
// shows a complete, lovely magazine.
export function fillValues(mag, values = {}) {
  const out = {};
  for (const f of mag.fields) {
    if (f.type === 'photo') continue;
    const v = (values[f.id] ?? '').toString().trim();
    out[f.id] = v || f.example;
  }
  return out;
}

function vars(p) {
  return `--bg:${p.bg};--ink:${p.ink};--accent:${p.accent};--pop:${p.pop}`;
}

// Font size (in cqw) that lets a word fill a given width without overflowing.
function fit(text, width, perChar, max) {
  const len = Math.max(String(text).length, 1);
  return Math.min(max, width / (len * perChar)).toFixed(2);
}

// A cute pet for the pet magazine examples: a floppy eared dog or a cat.
function petPortrait(opts, p) {
  const fur = opts.fur || '#c98b4f';
  const patch = opts.patch || '#fff1dc';
  const ears = opts.pet === 'cat'
    ? `<path d="M58 96 64 34 104 72zM142 96 136 34 96 72z" fill="${fur}"/><path d="M68 84 71 50 92 70zM132 84 129 50 108 70z" fill="#ff9aa8" opacity=".8"/>`
    : `<ellipse cx="52" cy="112" rx="20" ry="42" transform="rotate(18 52 112)" fill="${opts.ear || '#7a4a2a'}"/><ellipse cx="148" cy="112" rx="20" ry="42" transform="rotate(-18 148 112)" fill="${opts.ear || '#7a4a2a'}"/>`;
  const face = opts.pet === 'cat'
    ? `<path d="M94 132h12l-6 7z" fill="#ff7b8a"/><path d="M100 139v6M100 145q-7 6-13 1M100 145q7 6 13 1" stroke="#2a1a14" stroke-width="2.6" fill="none" stroke-linecap="round"/>
       <path d="M60 136h24M60 146l24-4M140 136h-24M140 146l-24-4" stroke="#2a1a14" stroke-width="1.6" opacity=".55"/>`
    : `<ellipse cx="100" cy="142" rx="26" ry="20" fill="${patch}"/><ellipse cx="100" cy="132" rx="10" ry="7" fill="#2a1a14"/>
       <path d="M100 139v7M100 146q-8 7-15 1M100 146q8 7 15 1" stroke="#2a1a14" stroke-width="2.6" fill="none" stroke-linecap="round"/>
       <path d="M93 152q7 16 14 0z" fill="#ff7b8a"/>`;
  return `<svg class="cv-portrait" viewBox="0 0 200 280" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <circle cx="100" cy="120" r="92" fill="${p.accent}" opacity=".55"/>
    <circle cx="30" cy="44" r="9" fill="${p.pop}" opacity=".7"/><circle cx="172" cy="64" r="6" fill="${p.pop}" opacity=".7"/>
    <path d="M34 280c4-62 30-98 66-98s62 36 66 98z" fill="${fur}"/>
    <path d="M76 280c2-40 10-70 24-70s22 30 24 70z" fill="${patch}"/>
    <path d="M62 196q38 20 76 0l-4 12q-34 16-68 0z" fill="${opts.collar || p.accent}"/><circle cx="100" cy="214" r="7" fill="#ffd23f" stroke="#2a1a14" stroke-width="1.5"/>
    ${ears}
    <ellipse cx="100" cy="118" rx="50" ry="46" fill="${fur}"/>
    ${opts.pet === 'cat' ? '' : `<ellipse cx="118" cy="100" rx="16" ry="14" fill="${patch}" opacity=".6"/>`}
    <path d="M78 112q6-7 12 0M110 112q6-7 12 0" stroke="#2a1a14" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    ${face}
    <circle cx="72" cy="130" r="6" fill="#ff7b8a" opacity=".4"/><circle cx="128" cy="130" r="6" fill="#ff7b8a" opacity=".4"/>
  </svg>`;
}

export function portrait(opts = {}, p = PALETTES.coral) {
  if (opts.pet) return petPortrait(opts, p);
  const skin = SKIN[opts.skin ?? 1] || SKIN[1];
  const hc = opts.hairColor || '#2b1a12';
  const hair = {
    short: `<path d="M62 112c0-34 18-52 38-52s38 18 38 52c-6-14-18-24-38-24s-32 10-38 24z" fill="${hc}"/>`,
    long: `<path d="M56 190c-8-40-6-86 8-106 10-16 22-24 36-24s26 8 36 24c14 20 16 66 8 106-6-28-6-52-10-70-8-16-20-24-34-24s-26 8-34 24c-4 18-4 42-10 70z" fill="${hc}"/>`,
    bun: `<circle cx="100" cy="44" r="18" fill="${hc}"/><path d="M62 114c0-36 18-54 38-54s38 18 38 54c-8-18-20-28-38-28s-30 10-38 28z" fill="${hc}"/>`,
    curly: [[70, 84], [84, 68], [100, 62], [116, 68], [130, 84], [64, 102], [136, 102], [76, 76], [124, 76]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="${hc}"/>`).join(''),
  }[opts.hair || 'short'];
  return `<svg class="cv-portrait" viewBox="0 0 200 280" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <circle cx="100" cy="120" r="92" fill="${p.accent}" opacity=".55"/>
    <circle cx="34" cy="40" r="10" fill="${p.pop}" opacity=".7"/><circle cx="170" cy="70" r="6" fill="${p.pop}" opacity=".7"/>
    <path d="M22 280c4-58 36-86 78-86s74 28 78 86z" fill="${p.ink}" opacity=".92"/>
    <rect x="88" y="150" width="24" height="34" rx="10" fill="${skin}"/>
    <ellipse cx="100" cy="118" rx="38" ry="44" fill="${skin}"/>
    ${hair}
    <path d="M84 118q4-5 8 0M108 118q4-5 8 0" stroke="#2a1a14" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M90 136q10 9 20 0" stroke="#2a1a14" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="80" cy="132" r="6" fill="#ff7b8a" opacity=".45"/><circle cx="120" cy="132" r="6" fill="#ff7b8a" opacity=".45"/>
  </svg>`;
}

function photoOrPortrait(src, opts, p, cls = 'cv-photo') {
  if (src) return `<div class="${cls}"><img src="${esc(src)}" alt=""></div>`;
  return `<div class="${cls}">${portrait(opts, p)}</div>`;
}

const barcode = () => `<div class="cv-barcode"><i></i><span>PRICELESS</span></div>`;

const LAYOUTS = {
  birthday(v, p, photo) {
    const name = v.name.toUpperCase();
    return `
      ${photo}
      <div class="cv-top"><span>The birthday issue</span><span>Special collector's edition</span></div>
      <h2 class="cv-mast cv-anton" style="font-size:${fit(name, 92, 0.46, 40)}cqw">${esc(name)}</h2>
      <div class="cv-lines">
        <p><b class="cv-tag">Exclusive</b>${esc(v.name)} on turning ${esc(v.age)} and looking this good</p>
        <p><b>Secret talent</b>${esc(v.talent)}</p>
        <p><b>Obsessed</b>${esc(v.obsession)}</p>
      </div>
      <div class="cv-sticker"><small>Now</small>${esc(v.age)}<small>and iconic</small></div>
      <div class="cv-bottom"><p>&ldquo;${esc(v.words)}&rdquo;<span>Friends tell all, page 6</span></p>${barcode()}</div>`;
  },
  anniversary(v, p, photo) {
    const n = parseInt(v.years, 10);
    const yrs = `${esc(v.years)} ${n === 1 ? 'year' : 'years'}`;
    return `
      ${photo}
      <div class="cv-top"><span>The anniversary issue</span><span>${yrs} of love</span></div>
      <h2 class="cv-mast cv-serif">Us<em>a love story</em></h2>
      <div class="cv-lines cv-lines-right">
        <p><b>How it all began</b>${esc(v.met)}</p>
        <p><b>Finally explained</b>${esc(v.joke)}</p>
      </div>
      <div class="cv-names"><span class="cv-tag">The exclusive interview</span>${esc(v.names)}</div>
      <div class="cv-hearts" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="cv-bottom">${barcode()}</div>`;
  },
  newspaper(v, p, photo) {
    return `
      <div class="np-in"><div class="np-mast"><span class="np-ear">Family<br>edition</span><h2>The ${esc(v.forWho)} Times</h2><span class="np-ear">Price:<br>one hug</span></div>
      <div class="np-date">Special edition &middot; All the news that matters to us &middot; From ${esc(v.fromWho)}</div>
      <h3 class="np-head">${esc(v.headline)}</h3>
      <div class="np-grid">
        ${photo}
        <div class="np-side">
          <p class="np-kicker">The kids say</p><p class="np-quote">&ldquo;${esc(v.quote)}&rdquo;</p>
          <p class="np-kicker">Weather</p><p class="np-weather"><span aria-hidden="true">&#9728;</span>${esc(v.weather)}</p>
        </div>
      </div>
      <div class="np-cols"><p><b>Missing you:</b> ${esc(v.miss)}. Full story inside, page 2.</p><p><b>Also inside:</b> photo gallery, letters page and a very important announcement.</p></div></div>`;
  },
  kids(v, p, photo) {
    const mast = `${v.name.toUpperCase()}`;
    return `
      <div class="kd-dots" aria-hidden="true"></div>
      <h2 class="cv-mast kd-mast" style="font-size:${fit(mast, 58, 0.7, 22)}cqw">${esc(mast)}<span>Weekly</span></h2>
      ${photo}
      <div class="kd-burst"><small>Age</small>${esc(v.age)}</div>
      <div class="kd-lines">
        <p><b>Top expert in</b>${esc(v.expert)}</p>
        <p><b>When I grow up</b>${esc(v.dream)}</p>
        <p><b>Fun fact</b>${esc(v.fact)}</p>
      </div>
      <div class="kd-free">Free inside: one giant hug</div>`;
  },
  review(v, p, photo) {
    return `
      ${photo}
      <div class="cv-top"><span>Special double issue</span><span>Collector's edition</span></div>
      <div class="rv-mast"><span>The year</span><b class="cv-anton">${esc(v.year)}</b><em>in review</em></div>
      <div class="cv-lines rv-lines">
        <p><b>Biggest adventure</b>${esc(v.adventure)}</p>
        <p><b>Proudest moment</b>${esc(v.proud)}</p>
        <p><b>Word of the year</b>${esc(v.word)}</p>
      </div>
      <div class="rv-star"><span>Awards<br>inside!</span></div>
      <div class="cv-bottom"><p class="rv-family">${esc(v.family)}<span>Our year, all the best bits</span></p>${barcode()}</div>`;
  },
  pet(v, p, photo) {
    const name = v.name.toUpperCase();
    return `
      ${photo}
      <div class="cv-top"><span>The pet issue</span><span>Most wanted edition</span></div>
      <h2 class="cv-mast cv-anton pt-mast" style="font-size:${fit(name, 92, 0.46, 38)}cqw">${esc(name)}</h2>
      <div class="pt-paws" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="cv-lines pt-lines">
        <p><b>Secret talent</b>${esc(v.talent)}</p>
        <p><b>Most wanted for</b>${esc(v.crime)}</p>
        <p><b>Favourite snack</b>${esc(v.snack)}</p>
      </div>
      <div class="pt-award"><small>Winner</small>${esc(v.award)}</div>
      <div class="cv-bottom"><p class="pt-age">Age ${esc(v.age)}<span>Treats accepted as payment</span></p>${barcode()}</div>`;
  },
  stars(v, p, photo) {
    const sign = v.sign.toUpperCase();
    return `
      <div class="st-sky" aria-hidden="true"></div>
      <div class="st-moon" aria-hidden="true"></div>
      <div class="cv-top"><span>The birthday stars issue</span><span>Cosmic edition</span></div>
      <h2 class="cv-mast st-mast" style="font-size:${fit(sign, 90, 0.8, 26)}cqw">${esc(sign)}<em>season</em></h2>
      ${photo}
      <div class="st-lines">
        <p><b>Lucky crystal</b>${esc(v.crystal)}</p>
        <p><b>Cosmic superpower</b>${esc(v.power)}</p>
        <p><b>The stars predict</b>${esc(v.prediction)}</p>
      </div>
      <div class="st-name">${esc(v.name)}<span>Turns ${esc(v.age)} &middot; born ${esc(v.born)}</span></div>`;
  },
};

export function renderCover(mag, values = {}, { palette = 'coral', portraitOpts = {}, photos = {} } = {}) {
  const p = PALETTES[palette] || PALETTES.coral;
  const v = fillValues(mag, values);
  const photoCls = { newspaper: 'np-photo', kids: 'kd-photo', stars: 'st-photo' }[mag.layout] || 'cv-photo';
  const photo = photoOrPortrait(photos.photo1, portraitOpts, p, photoCls);
  const body = (LAYOUTS[mag.layout] || LAYOUTS.birthday)(v, p, photo);
  return `<div class="cv cv-${mag.layout}" style="${vars(p)}">${body}</div>`;
}

// Inside pages for the preview. The printed magazine has more; these show the
// buyer how their answers come to life.
export function renderPages(mag, values = {}, { palette = 'coral', portraitOpts = {}, photos = {} } = {}) {
  const p = PALETTES[palette] || PALETTES.coral;
  const v = fillValues(mag, values);
  const who = v.name || v.names || v.forWho || v.family;
  const from = v.from || v.fromWho || (mag.layout === 'anniversary' ? 'Me' : 'All of us');
  const letterTitle = { newspaper: 'Letters page', kids: 'A letter for you', anniversary: 'What I love about you', stars: 'Your birthday reading', pet: 'A letter to a very good pet', review: 'A note from the editor' }[mag.layout] || "Editor's letter";
  const facts = mag.fields.filter(f => f.type !== 'photo' && f.type !== 'textarea' && !['name', 'names', 'from', 'fromWho', 'forWho', 'family'].includes(f.id));
  const pg = (cls, inner) => `<div class="pg pg-${cls}" style="${vars(p)}"><div class="pg-in">${inner}</div></div>`;
  return [
    pg('letter', `<p class="pg-kicker">${esc(letterTitle)}</p><h3>${mag.layout === 'review' ? 'To' : 'Dear'} ${esc(who)},</h3><p class="pg-body">${esc(v.message)}</p><p class="pg-sign">With love, ${esc(from)}</p>`),
    pg('facts', `<p class="pg-kicker">By the numbers</p><h3>All about ${esc(who)}</h3><dl>${facts.map(f => `<dt>${esc(f.label)}</dt><dd>${esc(v[f.id])}</dd>`).join('')}</dl>`),
    pg('photos', `<p class="pg-kicker">The photo spread</p>${photoOrPortrait(photos.photo2, { ...portraitOpts, hair: portraitOpts.hair }, p, 'pg-ph pg-ph1')}${photoOrPortrait(photos.photo3, portraitOpts, p, 'pg-ph pg-ph2')}<p class="pg-cap">${esc(v.moment || v.trip || v.miss || v.fact || v.prediction || '')}</p>`),
  ];
}

// The complete magazine for the finished PDF: cover, inside pages, a big
// feature page and a back cover.
export function renderFullMagazine(mag, values = {}, opts = {}) {
  const p = PALETTES[opts.palette] || PALETTES.coral;
  const v = fillValues(mag, values);
  const who = v.name || v.names || v.forWho || v.family;
  const from = v.from || v.fromWho || 'all of us';
  const feature = {
    birthday: ['The moment everyone still talks about', v.moment],
    anniversary: ['What I love most about you', v.love],
    newspaper: ['What we miss most', v.miss],
    kids: ['When I grow up I want to be', v.dream],
    review: ['The moment we will laugh about forever', v.moment],
    pet: ['Their most legendary moment', v.moment],
    stars: ['What the stars say about the year ahead', v.prediction],
  }[mag.layout] || ['A moment to remember', v.message];
  const style = `style="${vars(p)}"`;
  return [
    renderCover(mag, values, opts),
    ...renderPages(mag, values, opts),
    `<div class="pg pg-feature" ${style}><div class="pg-in"><p class="pg-kicker">${esc(feature[0])}</p><blockquote>&ldquo;${esc(feature[1])}&rdquo;</blockquote><p class="pg-sign">About ${esc(who)}, with love</p></div></div>`,
    `<div class="pg pg-back" ${style}><div class="pg-in"><p class="pg-kicker">That's a wrap</p><h3>The end.<br>Until the next issue.</h3><p class="pg-body">Made for ${esc(who)} by ${esc(from)}.</p>${barcode()}</div></div>`,
  ];
}
