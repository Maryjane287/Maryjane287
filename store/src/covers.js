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

// Designs: every magazine can be made in any of these styles. "signature" is
// the magazine's own layout above; the rest read the magazine's `cover` slots
// (masthead, lines, badge, quote), so one design works for every category.
export const DESIGNS = {
  signature: { label: 'Signature', palettes: null },
  glossy: { label: 'Glossy celebrity', palettes: ['coral', 'midnight'] },
  fashion: { label: 'High fashion', palettes: ['midnight', 'rose'] },
  retro: { label: 'Retro 70s', palettes: ['coral', 'butter'] },
  scrapbook: { label: 'Scrapbook', palettes: ['mint', 'rose'] },
  minimal: { label: 'Minimal', palettes: ['sky', 'butter'] },
  comic: { label: 'Comic book', palettes: ['butter', 'coral'] },
};

// Example covers for a design: signature uses the magazine's own examples, other
// designs reuse the first two examples in colours that suit the design.
// Magazines with their own layout offer it as "signature"; newer ones start
// from the glossy design. The first design in the list is the main product.
export const designsFor = mag => Object.keys(DESIGNS).filter(d => d !== (mag.layout ? 'glossy' : 'signature') && !(mag.skipDesigns || []).includes(d));
export const baseDesign = mag => designsFor(mag)[0];

export function designExamples(mag, design = baseDesign(mag)) {
  const d = DESIGNS[design];
  if (!d || !d.palettes || design === baseDesign(mag)) return mag.examples;
  return mag.examples.slice(0, 2).map((ex, i) => ({ ...ex, palette: d.palettes[i % d.palettes.length] }));
}

const fill = (t, v) => String(t || '').replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '');

function slots(mag, v) {
  const c = mag.cover;
  const raw = fill(c.mast, v);
  return {
    raw, mast: esc(raw), up: esc(raw.toUpperCase()),
    issue: esc(fill(c.issue, v)), edition: esc(fill(c.edition, v)),
    lines: c.lines.map(([l, t]) => [esc(l), esc(fill(t, v))]),
    badge: c.badge.map(b => esc(fill(b, v))), big: fill(c.badge[1], v),
    quote: esc(fill(c.quote, v)), credit: esc(fill(c.credit, v)),
  };
}

const DESIGN_LAYOUTS = {
  glossy(s, photo) {
    return `
      ${photo}
      <div class="cv-top"><span>${s.issue}</span><span>${s.edition}</span></div>
      <h2 class="cv-mast cv-anton" style="font-size:${fit(s.raw, 90, 0.52, 40)}cqw">${s.up}</h2>
      <div class="cv-lines">${s.lines.map(([l, t], i) => `<p><b${i ? '' : ' class="cv-tag"'}>${l}</b>${t}</p>`).join('')}</div>
      <div class="cv-sticker" style="font-size:${fit(s.big, 20, 0.5, 10)}cqw"><small>${s.badge[0]}</small>${s.badge[1]}<small>${s.badge[2]}</small></div>
      <div class="cv-bottom"><p>&ldquo;${s.quote}&rdquo;<span>${s.credit}</span></p>${barcode()}</div>`;
  },
  fashion(s, photo) {
    return `
      ${photo}
      <div class="fs-top">${s.issue} &middot; ${s.edition}</div>
      <h2 class="fs-mast" style="font-size:${fit(s.raw, 94, 0.8, 30)}cqw">${s.up}</h2>
      <div class="fs-left">${s.lines.slice(0, 2).map(([l, t]) => `<p><b>${l}</b>${t}</p>`).join('')}</div>
      <div class="fs-right"><p class="fs-num" style="font-size:${fit(s.big, 30, 0.62, 16)}cqw">${s.badge[1]}</p><small>${s.badge[0]} ${s.badge[2]}</small><p><b>${s.lines[2][0]}</b>${s.lines[2][1]}</p></div>
      <div class="fs-quote"><em>&ldquo;${s.quote}&rdquo;</em><span>${s.credit}</span></div>`;
  },
  retro(s, photo) {
    return `
      <div class="rt-rays" aria-hidden="true"></div>
      <div class="rt-top"><span>${s.issue}</span><span>${s.edition}</span></div>
      <h2 class="rt-mast" style="font-size:${fit(s.raw, 90, 0.6, 22)}cqw">${s.mast}</h2>
      <div class="rt-arch">${photo}</div>
      <div class="rt-stripes" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="rt-lines">${s.lines.map(([l, t]) => `<p><b>${l}</b>${t}</p>`).join('')}</div>
      <div class="rt-flower"><span style="font-size:${fit(s.big, 18, 0.62, 9)}cqw"><small>${s.badge[0]}</small>${s.badge[1]}<small>${s.badge[2]}</small></span></div>
      <div class="rt-quote">&ldquo;${s.quote}&rdquo;</div>`;
  },
  scrapbook(s, photo) {
    return `
      <div class="sb-paper" aria-hidden="true"></div>
      <div class="sb-top">${s.issue}</div>
      <h2 class="sb-mast" style="font-size:${fit(s.raw, 86, 0.42, 26)}cqw">${s.mast}</h2>
      <div class="sb-polaroid"><i class="sb-tape"></i><i class="sb-tape sb-tape2"></i>${photo}<span>${s.edition}</span></div>
      <div class="sb-notes">${s.lines.map(([l, t]) => `<p><b>${l}</b>${t}</p>`).join('')}</div>
      <div class="sb-sticker"><small>${s.badge[0]}</small>${s.badge[1]}<small>${s.badge[2]}</small></div>
      <div class="sb-quote">${s.quote} <span>&hearts;</span></div>
      <div class="sb-doodles" aria-hidden="true"><i>&#10022;</i><i>&#10022;</i><i>&hearts;</i></div>`;
  },
  minimal(s, photo) {
    return `
      <div class="mn-top"><span>${s.issue}</span><span>No. ${s.badge[1]}</span></div>
      <div class="mn-frame">${photo}</div>
      <h2 class="mn-mast" style="font-size:${fit(s.raw, 88, 0.6, 22)}cqw">${s.mast}</h2>
      <ol class="mn-lines">${s.lines.map(([l, t], i) => `<li><i>0${i + 1}</i><b>${l}</b>${t}</li>`).join('')}</ol>
      <div class="mn-foot"><span>${s.edition}</span><span>&ldquo;${s.quote}&rdquo;</span></div>`;
  },
  comic(s, photo) {
    return `
      <div class="cm-dots" aria-hidden="true"></div>
      <div class="cm-box"><small>No.</small><span style="font-size:${fit(s.big, 12, 0.5, 7)}cqw">${s.badge[1]}</span></div>
      <div class="cm-top">${s.issue}</div>
      <h2 class="cm-mast" style="font-size:${fit(s.raw, 72, 0.5, 26)}cqw">${s.up}</h2>
      <div class="cm-panel">${photo}</div>
      <div class="cm-bubble">${s.quote}!</div>
      <div class="cm-pow"><span>Wow!</span></div>
      <div class="cm-caps">${s.lines.slice(0, 2).map(([l, t]) => `<p><b>${l}</b>${t}</p>`).join('')}</div>
      <div class="cm-strip">${s.edition} &middot; ${s.lines[2][0]}: ${s.lines[2][1]}</div>`;
  },
};

export function renderCover(mag, values = {}, { palette = 'coral', portraitOpts = {}, photos = {}, design = 'signature' } = {}) {
  const p = PALETTES[palette] || PALETTES.coral;
  const v = fillValues(mag, values);
  if (design === 'signature' && !mag.layout) design = 'glossy';
  if (design !== 'signature' && DESIGN_LAYOUTS[design] && mag.cover) {
    const photo = photoOrPortrait(photos.photo1, portraitOpts, p, design === 'glossy' ? 'cv-photo' : 'dz-photo');
    const cls = design === 'glossy' ? 'cv-birthday cv-glossy' : `cv-${design}`;
    return `<div class="cv ${cls}" style="${vars(p)}">${DESIGN_LAYOUTS[design](slots(mag, v), photo)}</div>`;
  }
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
  const who = v.name || v.names || v.forWho || v.family || v.who;
  const from = v.from || v.fromWho || (mag.layout === 'anniversary' ? 'Me' : 'All of us');
  const letterTitle = mag.letterTitle || { newspaper: 'Letters page', kids: 'A letter for you', anniversary: 'What I love about you', stars: 'Your birthday reading', pet: 'A letter to a very good pet', review: 'A note from the editor' }[mag.layout] || "Editor's letter";
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
// The complete 24 page magazine for the finished PDF. Printers bind in
// multiples of four, so it is always exactly 24 pages.
const WORD_DIRS = [[1, 0], [0, 1], [1, 1], [1, -1]];

function seeded(str) {
  let h = 2166136261;
  for (const c of String(str)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
}

// A 12 by 12 word search hiding their name and words from their answers.
function wordSearch(words, seed) {
  const N = 12, rnd = seeded(seed), grid = Array.from({ length: N }, () => Array(N).fill(''));
  const placed = [];
  for (const w of words) {
    for (let t = 0; t < 200; t++) {
      const [dx, dy] = WORD_DIRS[Math.floor(rnd() * WORD_DIRS.length)];
      const x0 = Math.floor(rnd() * N), y0 = Math.floor(rnd() * N);
      const cells = [...w].map((_, i) => [x0 + dx * i, y0 + dy * i]);
      if (cells.some(([x, y]) => x < 0 || y < 0 || x >= N || y >= N)) continue;
      if (cells.some(([x, y], i) => grid[y][x] && grid[y][x] !== w[i])) continue;
      cells.forEach(([x, y], i) => { grid[y][x] = w[i]; });
      placed.push({ w, cells });
      break;
    }
  }
  const abc = 'ABCDEFGHIJKLMNOPRSTUWY';
  const letters = grid.map(r => r.map(c => c || abc[Math.floor(rnd() * abc.length)]));
  return { letters, placed };
}

function searchWords(v, facts, who) {
  const out = new Set();
  String(who).toUpperCase().split(/[^A-Z]+/).filter(w => w.length >= 3 && w.length <= 10).forEach(w => out.add(w));
  const skip = new Set(['THAT', 'WITH', 'THEY', 'THEIR', 'FROM', 'THIS', 'EVERY', 'ANYTHING', 'NEVER', 'ALWAYS', 'THREE', 'WHEN', 'WHAT', 'THEN', 'THAN', 'OBVIOUSLY']);
  const pool = facts.flatMap(f => String(v[f.id] || '').toUpperCase().split(/[^A-Z]+/)).filter(w => w.length >= 4 && w.length <= 9 && !skip.has(w));
  pool.sort((a, b) => b.length - a.length);
  for (const w of pool) { if (out.size >= 8) break; out.add(w); }
  for (const w of ['LOVE', 'SMILE', 'LEGEND', 'MAGIC', 'HAPPY', 'STAR']) { if (out.size >= 8) break; out.add(w); }
  return [...out];
}

export function renderFullMagazine(mag, values = {}, opts = {}) {
  const p = PALETTES[opts.palette] || PALETTES.coral;
  const photos = opts.photos || {};
  const po = opts.portraitOpts || {};
  const v = fillValues(mag, values);
  const who = v.name || v.names || v.forWho || v.family || v.who;
  const from = v.from || v.fromWho || 'all of us';
  const gentle = mag.slug === 'pet-memorial-magazine';
  const s = mag.cover ? slots(mag, v) : { lines: [], quote: '', credit: '', badge: ['', '', ''] };
  const facts = mag.fields.filter(f => f.type !== 'photo' && f.type !== 'textarea' && !['name', 'names', 'from', 'fromWho', 'forWho', 'family'].includes(f.id));
  const legacy = {
    birthday: ['The moment everyone still talks about', v.moment], anniversary: ['What I love most about you', v.love],
    newspaper: ['What we miss most', v.miss], kids: ['When I grow up I want to be', v.dream],
    review: ['The moment we will laugh about forever', v.moment], pet: ['Their most legendary moment', v.moment],
    stars: ['What the stars say about the year ahead', v.prediction],
  };
  const feature = mag.feature ? [mag.feature[0], v[mag.feature[1]]] : legacy[mag.layout] || ['A moment to remember', v.message];
  const style = `style="${vars(p)}"`;
  const page = (cls, inner, n) => `<div class="pg pg-${cls}" ${style}><div class="pg-in">${inner}</div>${n ? `<span class="pg-num">${n}</span>` : ''}</div>`;
  const ph = (k, cls) => photoOrPortrait(photos[k], po, p, cls);
  const rnd = seeded(who + mag.slug);
  // The buyer's own answers for the fun pages (optional; warm defaults fill any gaps).
  const mine = (k, n) => String(values[k] || '').split(/\n|,|;/).map(x => x.trim()).filter(Boolean).slice(0, n);
  const pad = (own, fallback, n) => [...own, ...fallback.slice(own.length)].slice(0, n);

  const contents = [
    [3, 'The editor\'s letter'], [5, 'The cover story'], [6, 'The big interview'],
    [8, gentle ? 'In a word' : 'The fragrance'], [9, feature[0]], [10, 'Front page news'], [11, `Ten reasons we love ${who}`], [13, `The recipe for ${who}`],
    [14, gentle ? 'How well did you know them?' : `The ${who} quiz`], [16, 'The pull out poster'], [17, 'The awards'], [18, 'Official certificate'],
    [20, 'The passport'], [22, 'Now showing: the movie'], [23, 'The collector\'s card'],
  ];

  const qa = s.lines.length ? s.lines : facts.slice(0, 3).map(f => [esc(f.label), esc(v[f.id])]);
  const reasons = [
    ...mine('x_reasons', 10).map(esc),
    ...facts.map(f => String(v[f.id])).filter(x => x.length > 8 && !/^\d/.test(x)).slice(0, 4).map(esc),
    'Every laugh they have ever started', 'How they make ordinary days feel special', 'The stories we will be telling for years',
    'Being exactly, completely themselves', 'The love they give without even trying', 'All the little moments nobody else saw',
    'Making the world a warmer place', 'Simply, wonderfully, being ours',
  ].slice(0, 10);

  const quizFacts = facts.filter(f => String(v[f.id]).length > 1).slice(0, 3);
  const quiz = quizFacts.map((f, i) => {
    const right = String(v[f.id]);
    const others = [...new Set(mag.examples.map(e => e.values?.[f.id]).filter(x => x && x !== right))];
    const picks = [right, ...others.slice(0, 2)];
    while (picks.length < 3) picks.push(['None of the above', 'Nobody knows'][picks.length - 1]);
    const opts3 = picks.map(x => [x, rnd()]).sort((a, b) => a[1] - b[1]).map(x => x[0]);
    return { q: f.label, opts: opts3, a: 'ABC'[opts3.indexOf(right)], n: i + 1 };
  });

  const words = searchWords(v, facts, who);
  const ws = wordSearch(words, who + mag.slug);
  const solved = new Set(ws.placed.flatMap(x => x.cells.map(([a, b]) => `${a},${b}`)));
  const gridHtml = (mark) => `<div class="ws-grid${mark ? ' ws-mini' : ''}">${ws.letters.map((r, y) => r.map((c, x) => `<i${mark && solved.has(`${x},${y}`) ? ' class="on"' : ''}>${c}</i>`).join('')).join('')}</div>`;

  const notes = `Top notes of ${esc(String(s.quote || v.words || 'pure joy').replace(/&[^;]+;/g, '').split(/,\s*|\s+and\s+/).filter(Boolean).slice(0, 3).join(', ').toLowerCase())}. A heart of pure ${gentle ? 'love' : 'mischief'}.`;
  const reviews = gentle
    ? [['Heartwarming', 'Everyone who knew them'], ['Forever loved', 'The family'], ['A true friend', 'The sofa']]
    : [['An absolute triumph', 'The Daily Hug'], ['I laughed, I cried', 'Family Times'], ['Iconic from start to finish', 'The Group Chat']];
  const stats = ['Charm', 'Kindness', 'Humour', gentle ? 'Cuddles' : 'Chaos', 'Legend status'].map(k => [k, 84 + Math.floor(rnd() * 16)]);
  stats[stats.length - 1][1] = 100;
  const move = String(v[facts.find(f => String(v[f.id]).length > 8 && !/^\d/.test(String(v[f.id])))?.id] || mag.short);
  const treatNotes = ['Redeemable any time, forever', 'No questions asked', 'Valid on any day you like', 'Just show this voucher'];
  const vouchers = gentle
    ? ['Their favourite spot', v.spot, 'Their sweetest habit', v.habit, 'The silliest moment', v.silly, 'Three words', v.words]
    : pad(mine('x_treats', 4).map((t, i) => [t, treatNotes[i]]), [['One enormous hug', 'Redeemable any time, forever'], ['A cup of tea made just right', 'Served with biscuits'], ['Film night, your choice', 'No complaints allowed'], ['One favour', 'No questions asked']], 4).flat();
  const vPairs = [];
  for (let i = 0; i < vouchers.length; i += 2) vPairs.push([vouchers[i], vouchers[i + 1]]);

  const first = String(who).split(/\s*(?:&|and)\s*|\s+/)[0] || who;
  const short = facts.map(f => [f.label, String(v[f.id] || '')]).filter(([, x]) => x.length > 3 && x.length <= 30 && !/^\d/.test(x));
  const briefs = facts.map(f => [f.label, String(v[f.id] || '')]).filter(([, x]) => x.length > 1 && x.length <= 48).slice(0, 3);
  const plural = /&| and /i.test(String(who));
  const headline = gentle ? `A life full of love` : `${who} ${plural ? 'do' : 'does'} it again`;
  const paper = plural ? 'The Daily News' : `The Daily ${first}`;
  const amounts = ['A big cup of', 'Two spoons of', 'A generous pinch of', 'A sprinkle of', 'A splash of'];
  const ownRecipe = mine('x_recipe', 5);
  const recipeTail = [gentle ? 'the softest cuddles' : 'pure mischief', 'love, straight from the heart'];
  const ingredients = (ownRecipe.length
    ? [...ownRecipe, ...recipeTail].slice(0, Math.max(ownRecipe.length, 4))
    : [...short.reduce((acc, [, x]) => (acc.length < 3 && acc.join('').length + x.length <= 62 ? [...acc, x] : acc), []), ...recipeTail]
  ).slice(0, 5).map((x, i) => [amounts[i], x]);
  const method = gentle
    ? ['Gather everyone who loved them.', 'Mix in every walk, cuddle and silly moment.', 'Let it rest in your heart forever.', 'Share the stories often.']
    : ['Mix everything together with a big smile.', 'Add a laugh whenever it looks too serious.', 'Bake slowly with lots of love.', 'Serve warm, with hugs on the side.'];
  const awardNotes = ['By a landslide', 'Unanimous', 'Ten years running', 'No contest'];
  const awards = pad(mine('x_awards', 4).map((t, i) => [esc(t), awardNotes[i]]), gentle
    ? [['Best cuddles', 'Every single day'], ['Most loyal friend', 'Undefeated'], ['Best at making us smile', 'Year after year'], ['Lifetime achievement', 'In being loved']]
    : [['Best smile', 'By a landslide'], ['Funniest person in the room', 'Unanimous'], ['World\'s best hugs', 'Ten years running'], ['Lifetime achievement', 'In being wonderful']], 4);
  const friendNotes = [1, 2, 3, 4].map(i => [String(values[`note${i}_from`] || '').trim(), String(values[`note${i}_msg`] || '').trim()]).filter(([, m]) => m);
  const noteBox = ([f, m]) => `<div class="note-full"><p>${esc(m)}</p><b>${f ? esc(f) : 'With love'}</b></div>`;
  const notesHtml = [...friendNotes.map(noteBox), ...Array(4 - friendNotes.length).fill('<div><i></i><i></i><i></i></div>')].join('');
  const mrz = s => String(s).toUpperCase().replace(/[^A-Z]+/g, '<').replace(/^<|<$/g, '');
  const mrzLine1 = (`P<CVS${mrz(who)}<<${mrz(from)}`.slice(0, 40)).padEnd(40, '<');
  const mrzLine2 = (`${mrz(mag.title)}<<ONE<OF<A<KIND<<001`.slice(0, 40)).padEnd(40, '<');

  return [
    renderCover(mag, values, opts),
    page('contents', `<p class="pg-kicker">Inside this issue</p><h3>Contents</h3><ol class="toc">${contents.map(([n, t]) => `<li><b>${n}</b><span>${esc(t)}</span></li>`).join('')}</ol><p class="toc-note">A one of a kind issue, made for ${esc(who)} by ${esc(from)}.</p>`, 2),
    ...renderPages(mag, values, opts).map((html, i) => html.replace(/<\/div>$/, `<span class="pg-num">${[3, 4, 7][i]}</span></div>`)).slice(0, 2),
    `<div class="pg pg-opener" ${style}>${ph('photo1', 'op-photo')}<div class="op-shade"></div><div class="pg-in"><p class="pg-kicker">The cover story</p><h3>${esc(who)}</h3><p class="op-dek">${s.lines[0] ? s.lines[0][1] : esc(mag.short)}</p></div><span class="pg-num">5</span></div>`,
    page('interview', `<p class="pg-kicker">The big interview</p><h3>We asked. The answers were iconic.</h3>${qa.map(([q, a]) => `<div class="iv"><p class="iv-q">${q}</p><p class="iv-a">${a}</p></div>`).join('')}<p class="pg-sign">Interview by ${esc(from)}</p>`, 6),
    renderPages(mag, values, opts)[2].replace(/<\/div>$/, `<span class="pg-num">7</span></div>`),
    gentle
      ? page('quote', `<p class="pg-kicker">In a word</p><p class="big-quote">&ldquo;${s.quote || esc(v.words || who)}&rdquo;</p><p class="pg-sign">${s.credit}</p>`, 8)
      : `<div class="pg pg-ad" ${style}><div class="ad-glow"></div><p class="ad-kicker">The new fragrance</p><div class="ad-bottle"><i class="ad-cap"></i><b class="ad-glass"><span>${esc(String(who).toUpperCase())}</span><small>Eau de parfum</small></b></div><h3 class="ad-name">Eau de ${esc(who)}</h3><p class="ad-line">&ldquo;${s.quote || esc(v.words || '')}&rdquo;</p><p class="ad-notes">${notes}</p><p class="ad-foot">Available nowhere. Absolutely priceless.</p><span class="pg-num">8</span></div>`,
    `<div class="pg pg-feature" ${style}><div class="pg-in"><p class="pg-kicker">${esc(feature[0])}</p><blockquote>&ldquo;${esc(feature[1])}&rdquo;</blockquote><p class="pg-sign">About ${esc(who)}, with love</p></div><span class="pg-num">9</span></div>`,
    `<div class="pg pg-news" ${style}><div class="pg-in"><div class="nw-mast"><span>Special edition</span><b style="font-size:${fit(paper, 48, 0.52, 9)}cqw">${esc(paper)}</b><span>Priceless</span></div><p class="nw-date">${gentle ? 'Remembering, with love' : 'Extra! Extra! Read all about it'}</p><h3 class="nw-head" style="font-size:${fit(headline, 84, 0.5, 9.6)}cqw">${esc(headline)}</h3><div class="nw-grid">${ph('photo2', 'nw-photo')}<div class="nw-lead${String(feature[1] || '').length > 150 ? ' nw-long' : ''}"><p class="nw-by">By ${esc(from)}</p><p>${esc(feature[1])}</p></div></div><div class="nw-briefs">${briefs.map(([l, x]) => `<div><b>${esc(l)}</b><p>${esc(x)}</p></div>`).join('')}</div><p class="nw-weather">${gentle ? 'Forecast: warm memories, all day long' : 'Weather: 100% chance of hugs'}</p></div><span class="pg-num">10</span></div>`,
    page('reasons', `<p class="pg-kicker">The list</p><h3>Ten reasons we love ${esc(who)}</h3><ol class="reasons">${reasons.map(r => `<li>${r}</li>`).join('')}</ol>`, 11),
    page('collage', `<p class="pg-kicker">The scrapbook</p>${ph('photo1', 'cl cl1')}${ph('photo2', 'cl cl2')}${ph('photo3', 'cl cl3')}<p class="cl-cap">${esc(v.words || s.quote || '')}</p>`, 12),
    page('recipe', `<div class="rc"><p class="pg-kicker">From the family kitchen</p><h3>The recipe for ${esc(who)}</h3><p class="rc-serves">Serves: everyone lucky enough to know them &middot; Prep time: a lifetime</p><div class="rc-cols"><div><p class="rc-sub">Ingredients</p><ul>${ingredients.map(([a, x]) => `<li><i>${a}</i>${esc(x)}</li>`).join('')}</ul></div><div><p class="rc-sub">Method</p><ol>${method.map(x => `<li>${x}</li>`).join('')}</ol></div></div><p class="rc-tip">Chef's tip: there is only one ${esc(who)}. This recipe cannot be copied.</p></div>`, 13),
    page('quiz', `<p class="pg-kicker">Test yourself</p><h3>${gentle ? `How well did you know ${esc(who)}?` : `How well do you know ${esc(who)}?`}</h3>${quiz.map(q => `<div class="qz"><p class="qz-q"><b>${q.n}</b>${esc(q.q)}</p><ul>${q.opts.map((o, i) => `<li><i>${'ABC'[i]}</i>${esc(o)}</li>`).join('')}</ul></div>`).join('')}<p class="qz-key">Answers: ${quiz.map(q => `${q.n}${q.a}`).join(' &middot; ')}</p>`, 14),
    page('puzzle', `<p class="pg-kicker">Puzzle page</p><h3>Find the words</h3>${gridHtml(false)}<ul class="ws-words">${ws.placed.map(x => `<li>${x.w}</li>`).join('')}</ul>`, 15),
    `<div class="pg pg-poster" ${style}>${ph('photo1', 'po-photo')}<div class="po-name" style="font-size:${fit(String(who).toUpperCase(), 88, 0.5, 30)}cqw">${esc(String(who).toUpperCase())}</div><div class="po-badge"><small>${s.badge[0]}</small>${s.badge[1]}<small>${s.badge[2]}</small></div><span class="pg-num">16</span></div>`,
    page('awards', `<p class="pg-kicker">Live from the red carpet</p><h3>The ${esc(first)} Awards</h3><div class="aw">${awards.map(([t, n]) => `<div class="aw-item"><svg class="aw-cup" viewBox="0 0 24 24" aria-hidden="true"><path fill="#f3d67a" d="M7 3h10v2h3a1 1 0 0 1 1 1c0 3.2-2 5.6-4.8 6A5 5 0 0 1 13 14.9V18h3v3H8v-3h3v-3.1A5 5 0 0 1 7.8 12C5 11.6 3 9.2 3 6a1 1 0 0 1 1-1h3V3zm10 4v3.8c1.3-.5 2.1-1.8 2.3-3.8H17zM7 7H4.7c.2 2 1 3.3 2.3 3.8V7z"/></svg><p class="aw-cat">${t}</p><p class="aw-win">Winner: ${esc(who)}</p><p class="aw-note">${n}</p></div>`).join('')}</div><p class="aw-foot">The envelope, please. It was never in doubt.</p>`, 17),
    page('cert', `<div class="cert"><p class="pg-kicker">Official certificate</p><p class="cert-small">This certifies that</p><p class="cert-name">${esc(who)}</p><p class="cert-small">is officially, undeniably and forever</p><p class="cert-title">${s.quote || 'Iconic'}</p><div class="cert-foot"><span>${esc(from)}</span><i class="cert-seal">&#9733;</i><span>${esc(mag.title)}</span></div></div>`, 18),
    page('vouchers', `<p class="pg-kicker">${gentle ? 'Favourite things' : 'Cut out and keep'}</p><h3>${gentle ? 'The little things we will always remember' : `Vouchers for ${esc(who)}`}</h3><div class="vch${gentle ? ' vch-gentle' : ''}">${vPairs.map(([a, b]) => `<div><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('')}</div>`, 19),
    page('passport', `<p class="pg-kicker">Official documents</p><h3>The ${esc(first)} passport</h3><div class="pp"><div class="pp-head"><span>${gentle ? 'Passport to our hearts' : 'Passport to everywhere fun'}</span><span>No. 001</span></div><div class="pp-body">${ph('photo1', 'pp-photo')}<dl class="pp-data"><dt>Name</dt><dd>${esc(who)}</dd><dt>Nationality</dt><dd>${gentle ? 'Loved, everywhere' : 'Citizen of the world'}</dd><dt>Occupation</dt><dd>${values.x_job ? esc(String(values.x_job).trim()) : s.quote || 'Professional legend'}</dd><dt>Issued by</dt><dd>${esc(from)}</dd><dt>Valid until</dt><dd>Forever</dd></dl></div><div class="pp-stamps">${pad(mine('x_places', 3).map(esc), ['Adored', 'Approved', 'One of a kind'], 3).map(x => `<span>${x}</span>`).join('')}</div><div class="pp-mrz"><p>${esc(mrzLine1)}</p><p>${esc(mrzLine2)}</p></div></div>`, 20),
    page('notes', `<p class="pg-kicker">Notes from everyone</p><h3>${friendNotes.length ? `Messages for ${esc(who)}` : 'Leave a little message'}</h3><div class="notes">${notesHtml}</div><p class="pg-kicker ws-ans">Puzzle answers</p>${gridHtml(true)}`, 21),
    `<div class="pg pg-movie" ${style}>${ph('photo2', 'mv-photo')}<div class="mv-shade"></div><p class="mv-presents">${esc(from)} presents</p><div class="mv-stars">${reviews.map(([q, src]) => `<p>&#9733;&#9733;&#9733;&#9733;&#9733;<b>&ldquo;${q}&rdquo;</b><small>${src}</small></p>`).join('')}</div><div class="mv-title"><h3 style="font-size:${fit(String(who).toUpperCase(), 86, 0.5, 24)}cqw">${esc(String(who).toUpperCase())}</h3><p class="mv-sub">${gentle ? 'A true story of love' : 'The movie'}</p><p class="mv-tag">&ldquo;${s.lines[0] ? s.lines[0][1] : esc(mag.short)}&rdquo;</p><p class="mv-credits">Starring ${esc(who)} &middot; Directed by ${esc(from)} &middot; Written with love &middot; Music by the whole family &middot; Filmed on location at home</p><p class="mv-soon">${gentle ? 'Forever showing in our hearts' : 'Coming soon to a living room near you'}</p></div><span class="pg-num">22</span></div>`,
    page('card', `<p class="pg-kicker">Collector's edition</p><h3>The ${esc(who)} card</h3><div class="tc"><div class="tc-in"><div class="tc-top"><b>${esc(who)}</b><span>${s.badge[1] || '&#9733;'}</span></div>${ph('photo3', 'tc-photo')}<p class="tc-type">${s.quote || 'Legendary'}</p><div class="tc-stats">${stats.map(([k, n]) => `<p><span>${k}</span><i><em style="width:${n}%"></em></i><b>${n}</b></p>`).join('')}</div><p class="tc-move"><b>Special move</b>${esc(move)}</p><div class="tc-foot"><span>Rarity: one of a kind</span><span>No. 001 of 001</span></div></div></div>`, 23),
    `<div class="pg pg-back" ${style}><div class="pg-in"><p class="pg-kicker">That's a wrap</p><h3>The end.<br>Until the next issue.</h3><p class="pg-body">Made for ${esc(who)} by ${esc(from)}.</p>${barcode()}</div></div>`,
  ];
}

// The printable card set that comes with the "PDF plus card set" edition: two
// message cards to cut out, then gift tags and bookmarks, all in the same
// colours and design as their magazine.
export function renderCardSet(mag, values = {}, opts = {}) {
  const p = PALETTES[opts.palette] || PALETTES.coral;
  const v = fillValues(mag, values);
  const who = v.name || v.names || v.forWho || v.family || v.who;
  const from = v.from || v.fromWho || 'all of us';
  const gentle = mag.slug === 'pet-memorial-magazine';
  const s = mag.cover ? slots(mag, v) : { quote: '', badge: ['', '', ''] };
  const quote = s.quote || esc(v.words || 'One of a kind');
  const style = `style="${vars(p)}"`;
  const cover = `<div class="cs-cover">${renderCover(mag, values, opts)}</div>`;
  const msg = String(v.message || '').trim();
  const short = msg.length > 220 ? `${msg.slice(0, 217).replace(/\s+\S*$/, '')}...` : msg;
  const tags = gentle
    ? [['For', who], ['With love', `from ${from}`], ['Forever', 'loved'], ['Always', 'in our hearts'], ['A little', 'keepsake'], ['Remembering', who]]
    : [['For', who], ['With love', `from ${from}`], ['Hot off', 'the press'], ['Read all', 'about it'], ['Open me', 'first'], ['Starring', who]];
  const up = esc(String(who).toUpperCase());
  return [
    `<div class="pg pg-cards" ${style}>
      <div class="cs-half cs-front">${cover}<div class="cs-front-txt"><p class="cs-kicker">${gentle ? 'Forever in our hearts' : 'Stop the press!'}</p><h3 style="font-size:${fit(String(who), 46, 0.5, 11)}cqw">${esc(who)}</h3><p class="cs-sub">${gentle ? 'A little keepsake, made with love' : /&| and /i.test(String(who)) ? 'are on the front page' : 'is on the front page'}</p><p class="cs-quote">&ldquo;${quote}&rdquo;</p></div></div>
      <div class="cs-cut" aria-hidden="true"><span>&#9986; cut here</span></div>
      <div class="cs-half cs-inside"><p class="cs-kicker">A little message</p><p class="cs-dear">Dear ${esc(who)},</p><p class="cs-msg" style="font-size:${short.length > 150 ? 4.3 : 5.2}cqw">${esc(short)}</p><p class="cs-sign" style="font-size:${String(from).length > 18 ? 4.4 : 5.6}cqw">With love, ${esc(from)}</p><i class="cs-heart" aria-hidden="true">&hearts;</i></div>
      <p class="cs-note">Print on card, cut along the line, and pop them in an envelope with the magazine.</p>
    </div>`,
    `<div class="pg pg-cards pg-tags" ${style}>
      <p class="cs-kicker cs-head">Gift tags and bookmarks</p>
      <div class="cs-tags">${tags.map(([a, b], i) => `<div class="cs-tag cs-tag${i % 3}"><i class="cs-hole" aria-hidden="true"></i><small>${esc(a)}</small><b style="font-size:${String(b).length > 16 ? 4 : 5.4}cqw">${esc(b)}</b></div>`).join('')}</div>
      <div class="cs-marks">${[0, 1].map(i => `<div class="cs-mark cs-mark${i}"><span class="cs-mark-name" style="font-size:${fit(String(who).toUpperCase(), 40, 0.55, 7)}cqw">${up}</span><span class="cs-mark-q">${String(who).length > 10 ? '' : `&ldquo;${quote}&rdquo;`}</span><span class="cs-mark-foot">${esc(mag.title)} &middot; ${i ? 'No. 002' : 'No. 001'}</span></div>`).join('')}</div>
      <p class="cs-note">Cut out the tags and bookmarks. A ribbon through the little hole finishes the tags.</p>
    </div>`,
  ];
}
