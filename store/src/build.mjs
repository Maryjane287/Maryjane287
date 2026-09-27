// Builds the whole shop into dist/ as plain HTML. No dependencies: run `npm run build`.
// Every page is real HTML so Pinterest can read titles, prices and images (rich pins).
import { readFile, writeFile, mkdir, rm, cp, readdir } from 'node:fs/promises';
import { renderCover, renderPages, renderFullMagazine, esc, DESIGNS, designExamples, designsFor, baseDesign } from './covers.js';

const root = new URL('..', import.meta.url);
const dist = new URL('dist/', root);
const read = async p => readFile(new URL(p, root), 'utf8');
const site = JSON.parse(await read('data/site.json'));
const mags = JSON.parse(await read('data/magazines.json'));
const ideas = await loadIdeas();
const abs = p => site.url.replace(/\/$/, '') + p;
// The first design of each magazine is its main product and keeps the plain URLs.
const isBase = (mag, design) => !design || design === baseDesign(mag);
const pinSrc = (mag, ex, design) => `/pins/${mag.slug}-${isBase(mag, design) ? '' : design + '-'}${ex.id}.jpg`;
const magPath = (mag, design) => `/${mag.slug}/${isBase(mag, design) ? '' : design + '/'}`;
// Tiers marked "soon" (printed copies) stay hidden until printing is set up.
const tiers = site.tiers.filter(t => !t.soon);
const from = tiers[0];

// ---------- helpers ----------

const money = n => (Number.isInteger(n) ? String(n) : n.toFixed(2));
const price = t => `<span class="price" data-gbp="£${money(t.gbp)}" data-usd="$${money(t.usd)}">£${money(t.gbp)}</span>`;
const fromPrice = `<span class="price" data-gbp="£${from.gbp}" data-usd="$${from.usd}">£${from.gbp}</span>`;

function saveImg(src, alt, desc, cls = '') {
  return `<img class="${cls}" src="${src}" alt="${esc(alt)}" loading="lazy" width="1000" height="1500" data-pin-description="${esc(desc)}" data-pin-media="${abs(src)}">`;
}

function coverFor(mag, ex, design = baseDesign(mag)) {
  return renderCover(mag, ex.values, { palette: ex.palette, portraitOpts: ex.portrait, design });
}

function layout({ title, description, path, body, og = {}, jsonld, bodyClass = '', scripts = '' }) {
  const fullTitle = path === '/' ? `${site.name}: ${site.tagline}` : `${title} | ${site.name}`;
  const image = og.image || abs('/pins/birthday-magazine-mia.jpg');
  const ogTags = {
    'og:site_name': site.name,
    'og:title': title,
    'og:description': description,
    'og:url': abs(path),
    'og:image': image,
    'og:type': og.type || 'website',
    ...og.extra,
  };
  const nav = mags.slice(0, 4).map(m => `<a href="/${m.slug}/">${esc(m.occasion.split(' ')[0])}</a>`).join('') + '<a href="/#magazines">More</a>';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${abs(path)}">
${Object.entries(ogTags).map(([k, v]) => `<meta property="${k}" content="${esc(v)}">`).join('\n')}
<meta name="twitter:card" content="summary_large_image">
${site.pinterestDomainVerify ? `<meta name="p:domain_verify" content="${esc(site.pinterestDomainVerify)}">` : ''}
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/Outfit-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/fonts.css">
<link rel="stylesheet" href="/assets/covers.css">
<link rel="stylesheet" href="/assets/style.css">
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <a class="logo" href="/" aria-label="${esc(site.name)} home"><span class="logo-mag" aria-hidden="true"></span>${esc(site.name)}</a>
  <nav class="nav">${nav}<a href="/ideas/">Ideas</a></nav>
  <a class="btn btn-small" href="/make/">Make yours</a>
</header>
<main id="main">
${body}
</main>
<footer class="foot">
  <div class="foot-grid">
    <div>
      <a class="logo" href="/"><span class="logo-mag" aria-hidden="true"></span>${esc(site.name)}</a>
      <p>Personalised magazines for the people you love. Made in minutes, kept forever.</p>
      <p class="currency">Prices in <button type="button" data-cur="gbp">£ GBP</button> <button type="button" data-cur="usd">$ USD</button></p>
    </div>
    <div><h4>Magazines</h4>${mags.map(m => `<a href="/${m.slug}/">${esc(m.title)}</a>`).join('')}</div>
    <div><h4>Help</h4><a href="/help/">Delivery and FAQ</a><a href="/ideas/">Gift ideas</a><a href="/about/">About us</a><a href="mailto:${esc(site.email)}">Contact</a></div>
    <div><h4>The small print</h4><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></div>
  </div>
  <p class="legal">&copy; ${new Date().getFullYear()} ${esc(site.name)} is a trading name of ${esc(site.company)}, a company registered in the United Kingdom, number ${esc(site.companyNumber)}.</p>
</footer>
<script src="/assets/site.js" type="module"></script>
${scripts}
<script async defer src="https://assets.pinterest.com/js/pinit.js" data-pin-hover="true" data-pin-tall="true"></script>
${site.pinterestTagId ? `<script>window.PIN_TAG_ID=${JSON.stringify(site.pinterestTagId)}</script>` : ''}
</body>
</html>
`;
}

async function page(path, html) {
  const file = new URL('.' + (path.endsWith('/') ? path + 'index.html' : path), dist);
  await mkdir(new URL('.', file), { recursive: true });
  await writeFile(file, html);
}

async function loadIdeas() {
  const dir = new URL('ideas/', root);
  const out = [];
  for (const f of (await readdir(dir)).filter(f => f.endsWith('.html')).sort()) {
    const raw = await readFile(new URL(f, dir), 'utf8');
    const [, head, body] = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    const meta = Object.fromEntries(head.split('\n').map(l => [l.slice(0, l.indexOf(':')).trim(), l.slice(l.indexOf(':') + 1).trim()]));
    out.push({ ...meta, slug: f.replace(/^\d+-/, '').replace(/\.html$/, ''), body });
  }
  return out;
}

const tierCards = (magSlug = '') => `
  <div class="tiers">
    ${tiers.map(t => `
    <div class="tier${t.popular ? ' tier-pop' : ''}">
      ${t.popular ? '<span class="tier-badge">Most loved</span>' : ''}
      <h3>${esc(t.label)}</h3>
      <p class="tier-price">${price(t)}</p>
      <p>${esc(t.blurb)}</p>
      <a class="btn ${t.popular ? '' : 'btn-ghost'}" href="/make/${magSlug ? `?m=${magSlug}&amp;t=${t.id}` : `?t=${t.id}`}">Choose</a>
    </div>`).join('')}
  </div>
  ${site.tiers.some(t => t.soon && t.id === 'print') ? '<p class="tiers-soon">Printed, posted copies are coming soon.</p>' : ''}
  ${trustStrip}`;

// The promises every premium gift shop makes, shown under the prices and at checkout.
const trustStrip = `
  <ul class="trust">
    <li><span aria-hidden="true">&#128156;</span><b>Love it or we make it right</b><small>Spotted a typo or a printing fault? We fix it free.</small></li>
    <li><span aria-hidden="true">&#128274;</span><b>Safe, secure checkout</b><small>Pay by card or PayPal. We never see your card details.</small></li>
    <li><span aria-hidden="true">&#9889;</span><b>Ready in minutes</b><small>Download straight after paying, and a copy by email.</small></li>
    <li><span aria-hidden="true">&#127757;</span><b>Sent anywhere in the world</b><small>By email in seconds, or printed near them and posted.</small></li>
  </ul>`;

// "See it for real": the buyer's actual design shown as a printed magazine,
// an open spread and on a phone, all drawn from the same pages as the PDF.
const realLife = (mag, pages, name) => {
  const gentle = mag.slug === 'pet-memorial-magazine';
  const [say, reply] = gentle ? ['Made this for you, thinking of you &#128156;', 'Oh, this is so beautiful. Thank you &#129402;'] : ["You're on the cover! &#127881;", 'WHAT?! I love it &#128557;&#10084;&#65039;'];
  return `
<section class="section real">
  <div class="section-head"><p class="kicker">See it for real</p><h2>Made to be held, shared and kept</h2><p>This is exactly what they get: their own magazine, as a glossy printed copy or on their phone in seconds.</p></div>
  <div class="real-grid">
    <figure class="real-scene real-print">
      <div class="real-stage"><div class="mock-mag"><div class="mock-pages"></div><div class="mock-cover">${pages[0]}</div></div><div class="mock-tag">${gentle ? 'Forever loved' : `For you, ${esc(name)}`} <span>&#9829;</span></div></div>
      <figcaption><b>Printed and posted</b>A4 glossy or matte, printed near them.</figcaption>
    </figure>
    <figure class="real-scene real-open">
      <div class="real-stage"><div class="mock-spread"><div class="mock-left">${pages[9]}</div><div class="mock-right">${pages[10]}</div></div></div>
      <figcaption><b>24 pages all about them</b>Their own newspaper, awards night, passport and more.</figcaption>
    </figure>
    <figure class="real-scene real-phone">
      <div class="real-stage"><div class="mock-phone"><div class="mock-screen"><p class="mock-bubble">${say}</p><div class="mock-file">${pages[0]}</div><p class="mock-bubble mock-reply">${reply}</p></div></div></div>
      <figcaption><b>Sent in seconds</b>By email or message, anywhere in the world.</figcaption>
    </figure>
  </div>
</section>`;
};

// Real buyers' reviews, filled in by /assets/reviews.js. Until the first ones
// arrive it invites people to be among the first (we never invent reviews).
const reviewsSection = (magSlug = '', tint = false) => `
<section class="section${tint ? ' section-tint' : ''} reviews-sec" data-reviews="${magSlug}">
  <div class="section-head"><p class="kicker">Real buyers, real reactions</p><h2>What people are saying</h2><p class="rev-summary" hidden></p></div>
  <div class="rev-list" hidden></div>
  <div class="rev-empty">
    <p class="rev-empty-stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
    <h3>Be one of our very first reviewers</h3>
    <p>We are a brand new shop, so there are no reviews here yet, and we will never make any up. After your magazine arrives we will ask how it went. Your words and a photo of the big moment will appear right here.</p>
  </div>
</section>`;

const steps = `
  <ol class="steps">
    <li><span class="step-ico" aria-hidden="true">&#9998;</span><h3>Answer a few fun questions</h3><p>Their nickname, their secret talent, the moment you will never forget. Every question comes with an example, so nobody gets stuck.</p></li>
    <li><span class="step-ico" aria-hidden="true">&#128247;</span><h3>Add your favourite photos</h3><p>Three photos is all it takes. Watch the cover come alive as you type.</p></li>
    <li><span class="step-ico" aria-hidden="true">&#127873;</span><h3>Give the best gift of the year</h3><p>Their 24 page magazine lands in your inbox, ready to send by message, share on screen or print at home, anywhere in the world.</p></li>
  </ol>`;

const faq = [
  ['How long does it take?', 'About five minutes to fill in. Your finished 24 page magazine is ready to download as soon as you have paid, and we email it to you too.'],
  ['What is the hardcover keepsake book like?', 'It is the same 24 pages as the magazine, bound as a thick A4 hardcover book with a square spine, printed on heavy glossy photo paper. It stands on a shelf like a real book, so it is perfect for grandparents, weddings, new babies and memories you want to keep forever. It is printed near them and posted, with shipping added at checkout.'],
  ['Can you send it straight to them as a surprise?', 'Yes. Tick "It\'s a gift, send it to them for me" when you order, add their name and email, and pick the day. We email the finished magazine to them with your name on it, and you get your own copy first so you can see it. For a printed copy, just type their address at the printer\'s checkout.'],
  ['Where do you deliver?', 'Everywhere. Your magazine arrives by email, so you can send it to anyone in the world in seconds. Want it printed? Choose a printed magazine and it is printed near them and posted to their door, with shipping added at checkout.'],
  ['Can I see it before I pay?', 'Yes. You see a live preview of the cover and pages while you fill in the form.'],
  ['What happens to my photos?', 'They are used only to make your magazine and are deleted 30 days after your order (or 30 days after your gift is delivered). We never share or post them anywhere.'],
  ['What if something is wrong?', 'If anything in your magazine is not right, email us and we will fix it for free.'],
];
const faqHtml = `<div class="faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`;
const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

const ticker = [
  'BREAKING: Chris still cannot fold a fitted sheet',
  'EXCLUSIVE: Mia turns 30, remains iconic',
  'Grandma voted Best Pancakes for 12th year running',
  'Leo, 6, now world\'s leading dinosaur expert',
  'Emma and Sam: 25 years, one umbrella',
  'Scientists confirm: Nana\'s biscuits are the best',
  'Sam finally explains the Great Sofa Incident',
];
const tickerHtml = `<div class="ticker" aria-hidden="true"><div class="ticker-track">${[...ticker, ...ticker].map(t => `<span>${esc(t)}</span>`).join('')}</div></div>`;

// ---------- pages ----------

async function home() {
  const [b, a, n, k] = mags;
  const heroCovers = [
    [a, a.examples[0]], [b, b.examples[0]], [k, k.examples[0]],
  ].map(([m, ex], i) => `<a class="hero-cover hc-${i}" href="/${m.slug}/" aria-label="${esc(m.title)}">${coverFor(m, ex)}</a>`).join('');
  const cards = mags.map(m => `
    <a class="mag-card" href="/${m.slug}/">
      <div class="mag-card-cover">${coverFor(m, m.examples[1] || m.examples[0])}</div>
      <div class="mag-card-body">
        <p class="kicker">${esc(m.occasion)}</p>
        <h3>${esc(m.title)}</h3>
        <p>${esc(m.short)}</p>
        <p class="from">From ${fromPrice} &middot; ${designsFor(m).length} designs</p>
      </div>
    </a>`).join('');
  const wall = mags.flatMap(m => m.examples.map(ex => ({ m, ex })));
  // interleave magazines so the wall feels mixed
  wall.sort((x, y) => x.m.examples.indexOf(x.ex) - y.m.examples.indexOf(y.ex));
  const wallHtml = wall.map(({ m, ex }) => `<a class="wall-item" href="/${m.slug}/">${saveImg(pinSrc(m, ex), `${m.title} example cover`, `${m.pinTitle}: ${m.short} Made in 5 minutes. #${m.keywords[0].replace(/\s+/g, '')}`)}</a>`).join('');
  const body = `
<section class="hero">
  <div class="confetti" aria-hidden="true">${Array.from({ length: 18 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>
  <div class="hero-text">
    <p class="kicker">Personalised keepsake magazines</p>
    <h1>Make them the <span class="hl">cover story.</span></h1>
    <p class="lead">Answer a few fun questions, add your photos, and we turn them into a beautiful magazine all about the person you love. A 24 page magazine, sent to you as a PDF, ready for anyone, anywhere in the world.</p>
    <div class="hero-cta"><a class="btn btn-big" href="/make/">Make a magazine</a><a class="btn btn-ghost" href="#magazines">See the magazines</a></div>
    <p class="hero-note">Ready in 5 minutes &middot; From ${fromPrice} &middot; No design skills needed</p>
  </div>
  <div class="hero-covers">${heroCovers}</div>
</section>
${tickerHtml}
<section class="section" id="magazines">
  <div class="section-head"><p class="kicker">Pick a magazine</p><h2>Which story are you telling?</h2></div>
  <div class="mag-grid">${cards}</div>
</section>
<section class="section section-tint">
  <div class="section-head"><p class="kicker">How it works</p><h2>A gift that feels handmade, without the hours</h2></div>
  ${steps}
  <p class="center"><a class="btn btn-big" href="/make/">Start yours now</a></p>
</section>
<section class="section">
  <div class="section-head"><p class="kicker">Real magazines, made up names</p><h2>Save your favourites for later</h2><p>Hover on any cover and tap Save to keep it on your Pinterest board.</p></div>
  <div class="wall wall-short">${wallHtml}</div>
  <p class="center"><button type="button" class="btn btn-ghost wall-more" aria-expanded="false">Show ${wall.length - 8} more covers</button></p>
</section>
<section class="section section-tint" id="prices">
  <div class="section-head"><p class="kicker">Simple prices</p><h2>Choose how you give it</h2></div>
  ${tierCards()}
</section>
${realLife(b, renderFullMagazine(b, b.examples[0].values, { palette: b.examples[0].palette, portraitOpts: b.examples[0].portrait, design: baseDesign(b) }), String(Object.values(b.examples[0].values)[0] || '').split(/\s/)[0])}
${reviewsSection('', true)}
<section class="section">
  <div class="section-head"><p class="kicker">Questions</p><h2>Good to know</h2></div>
  ${faqHtml}
</section>
<section class="cta-band">
  <h2>Somebody deserves to be on the front page.</h2>
  <a class="btn btn-big btn-light" href="/make/">Make their magazine</a>
</section>`;
  await page('/', layout({
    title: site.tagline, description: site.description, path: '/', body,
    jsonld: [{ '@context': 'https://schema.org', '@type': 'Organization', name: site.name, legalName: site.company, url: site.url, email: site.email }, faqLd],
    scripts: `<script type="module" src="/assets/reviews.js"></script><script type="module">
      const more = document.querySelector('.wall-more');
      more?.addEventListener('click', () => { document.querySelector('.wall').classList.remove('wall-short'); more.remove(); });
    </script>`,
  }));
}

async function magazinePage(mag, design = baseDesign(mag)) {
  const base = isBase(mag, design);
  const designIds = designsFor(mag);
  const path = magPath(mag, design);
  const exs = designExamples(mag, design);
  const main = exs[0];
  const dLabel = DESIGNS[design].label;
  const name = base ? mag.searchTitle : `${mag.searchTitle}, ${dLabel} Design`;
  const pin = ex => pinSrc(mag, ex, design);
  const cover = ex => coverFor(mag, ex, design);
  const makeUrl = `/make/?m=${mag.slug}${base ? '' : '&amp;d=' + design}`;
  const designCards = designIds.map(d => {
    const ex = designExamples(mag, d)[0];
    return `<a class="design-card${d === design ? ' is-on' : ''}" href="${magPath(mag, d)}"${d === design ? ' aria-current="page"' : ''}>${coverFor(mag, ex, d)}<span>${esc(DESIGNS[d].label)}</span></a>`;
  }).join('');
  const lowest = Math.min(...tiers.map(t => t.gbp));
  const highest = Math.max(...tiers.map(t => t.gbp));
  const inside = renderFullMagazine(mag, main.values, { palette: main.palette, portraitOpts: main.portrait, design });
  const desc = `${name}: ${mag.short} Made in 5 minutes from your answers and photos. A 24 page magazine sent as an instant PDF, anywhere in the world.`;
  const body = `
<nav class="crumbs"><a href="/">Home</a> <span>/</span> ${base ? esc(mag.occasion) : `<a href="${magPath(mag)}">${esc(mag.occasion)}</a> <span>/</span> ${esc(dLabel)}`}</nav>
<section class="mag-hero">
  <div class="mag-gallery">
    <div class="mag-main">${saveImg(pin(main), `${mag.title} example: ${Object.values(main.values)[0]}`, `${mag.pinTitle}${base ? '' : ', ' + dLabel + ' design'}. ${mag.short} Personalise it in 5 minutes.`, 'mag-main-img')}</div>
    <div class="mag-thumbs">${exs.map((ex, i) => `<button type="button" class="mag-thumb${i ? '' : ' is-on'}" data-src="${pin(ex)}" aria-label="Show example ${i + 1}">${cover(ex)}</button>`).join('')}</div>
  </div>
  <div class="mag-info">
    <p class="kicker">${esc(mag.occasion)}</p>
    <h1>${esc(name)}</h1>
    <p class="lead">${esc(mag.description)}</p>
    <p class="mag-price">From ${fromPrice}</p>
    <a class="btn btn-big" href="${makeUrl}">Make yours in 5 minutes</a>
    <a class="pin-btn" href="https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(abs(path))}&amp;media=${encodeURIComponent(abs(pin(main)))}&amp;description=${encodeURIComponent(mag.pinTitle + '. ' + mag.short)}" data-pin-do="none" target="_blank" rel="noopener">Save to Pinterest</a>
    <h2 class="h-small">What's inside</h2>
    <ul class="ticks">${mag.inside.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
    <p class="chips">${mag.keywords.map(k => `<span>${esc(k)}</span>`).join('')}</p>
  </div>
</section>
<section class="section">
  <div class="section-head"><p class="kicker">${designIds.length} designs</p><h2>Pick the look they will love</h2><p>Same questions, same price. Every design is made from your answers and photos.</p></div>
  <div class="design-grid">${designCards}</div>
</section>
<section class="section section-tint">
  <div class="section-head"><p class="kicker">Flip through all ${inside.length} pages</p><h2>Every page is about them</h2><p>A contents page, the big interview, a pull out poster, a quiz and puzzle made from your answers, an official certificate and more. Swipe to see it all.</p></div>
  <div class="flip">${inside.map((p, i) => `<div><div class="flip-page">${p}</div><span class="flip-n">${i ? `Page ${i + 1}` : 'Cover'}</span></div>`).join('')}</div>
</section>
${realLife(mag, inside, String(Object.values(main.values)[0] || '').split(/\s/)[0])}
<section class="section">
  <div class="section-head"><p class="kicker">Prices</p><h2>Choose how you give it</h2></div>
  ${tierCards(mag.slug)}
</section>
${reviewsSection(mag.slug, true)}
<section class="section">
  <div class="section-head"><p class="kicker">How it works</p><h2>Five minutes, one very happy person</h2></div>
  ${steps}
</section>
<section class="section section-tint">${faqHtml}</section>
<section class="cta-band"><h2>Ready to make ${esc(mag.title)}?</h2><a class="btn btn-big btn-light" href="${makeUrl}">Start now</a></section>`;
  const jsonld = [{
    '@context': 'https://schema.org', '@type': 'Product',
    name, description: mag.description,
    image: exs.map(ex => abs(pin(ex))),
    brand: { '@type': 'Brand', name: site.name },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'GBP', lowPrice: lowest.toFixed(2), highPrice: highest.toFixed(2), offerCount: tiers.length, availability: 'https://schema.org/InStock', url: abs(path) },
  }, faqLd];
  await page(path, layout({
    title: name, description: desc, path, body, jsonld,
    og: {
      type: 'product', image: abs(pin(main)),
      extra: { 'product:price:amount': lowest.toFixed(2), 'product:price:currency': 'GBP', 'og:price:amount': lowest.toFixed(2), 'og:price:currency': 'GBP', 'product:availability': 'in stock', 'og:availability': 'instock', 'product:brand': site.name },
    },
    scripts: `<script type="module" src="/assets/reviews.js"></script><script type="module">
      document.querySelectorAll('.mag-thumb').forEach(b => b.addEventListener('click', () => {
        document.querySelectorAll('.mag-thumb').forEach(x => x.classList.toggle('is-on', x === b));
        const img = document.querySelector('.mag-main-img'); img.src = b.dataset.src; img.dataset.pinMedia = new URL(b.dataset.src, location.href).href;
      }));
    </script>`,
  }));
}

async function makerPage() {
  // Tiers marked "soon" are in the page but hidden; /make/?print=1 reveals them for testing.
  const tierOpts = site.tiers.map((t, i) => `
    <label class="tier-opt"${t.soon ? ` data-soon="${t.id}" hidden` : ''}><input type="radio" name="tier" value="${t.id}"${t.popular ? ' checked' : ''}><span><b>${esc(t.label)}</b> ${price(t)}<small>${esc(t.blurb)}</small></span></label>`).join('');
  const countries = ['United Kingdom', 'United States', 'Canada', 'Australia', 'Ireland', 'New Zealand', 'Germany', 'France', 'Netherlands', 'Spain', 'Italy', 'Sweden', 'South Africa', 'United Arab Emirates', 'Nigeria', 'Ghana', 'Kenya', 'India', 'Singapore', 'Other'];
  const body = `
<section class="maker">
  <div class="maker-form">
    <p class="kicker">The magazine maker</p>
    <h1>Let's make <span class="hl" id="who">their</span> magazine</h1>
    <p class="maker-label">Magazine <small>(swipe to see all ${mags.length})</small></p>
    <div class="pick" role="radiogroup" aria-label="Choose a magazine">
      ${mags.map(m => `<button type="button" class="pick-btn" data-m="${m.slug}" role="radio">${coverFor(m, m.examples[0])}<span>${esc(m.title)}</span></button>`).join('')}
    </div>
    <p class="maker-label">Design</p>
    <div class="designs" role="radiogroup" aria-label="Choose a design"></div>
    <div class="palette" aria-label="Choose a colour"></div>
    <form id="order" name="order" method="POST" action="/thanks/" data-netlify="true" netlify-honeypot="company" enctype="multipart/form-data">
      <input type="hidden" name="form-name" value="order">
      <input type="hidden" name="magazine"><input type="hidden" name="design"><input type="hidden" name="palette"><input type="hidden" name="answers"><input type="hidden" name="order-id"><input type="hidden" name="pdf"><input type="hidden" name="cards">
      <p class="hp"><label>Leave this empty <input name="company"></label></p>
      <div id="fields"></div>
      <p class="photo-note">Your photos stay on your device while you design. They are only sent when you place your order.</p>
      <fieldset class="checkout">
        <legend>Love it? Choose your edition</legend>
        ${tierOpts}
        <div class="finish" hidden><p class="maker-label">Cover finish</p><label class="finish-opt"><input type="radio" name="finish" value="glossy" checked><span><b>Glossy</b><small>Shiny, bright, like a newsstand magazine</small></span></label><label class="finish-opt"><input type="radio" name="finish" value="matte"><span><b>Matte</b><small>Soft touch and elegant</small></span></label></div>
        <label class="field"><span>Your email (we send the magazine here)</span><input type="email" name="email" required autocomplete="email" placeholder="you@example.com"></label>
        <fieldset class="gift">
          <label class="gift-toggle"><input type="checkbox" name="gift" value="yes"> <span><b>It's a gift, send it to them for me</b><small>We email the finished magazine straight to them, with your name on it, on the day you choose.</small></span></label>
          <div class="gift-fields" hidden>
            <label class="field"><span>Their name</span><input type="text" name="gift_name" maxlength="60" placeholder="Mia"></label>
            <label class="field"><span>Their email</span><input type="email" name="gift_email" placeholder="mia@example.com"></label>
            <label class="field"><span>Send it on <small>(leave empty to send it right away)</small></span><input type="date" name="gift_date"></label>
            <label class="field wide"><span>From <small>(how your name appears)</small></span><input type="text" name="gift_from" maxlength="60" placeholder="Love, Chris"></label>
            <p class="small">You get your own copy too, so you can see it first.</p>
          </div>
          <p class="small gift-print" hidden>Printed gifts go straight to them: just type their address at the printer's checkout.</p>
        </fieldset>
        <label class="field"><span>Where is it going?</span><select name="country" required>${countries.map(c => `<option>${c}</option>`).join('')}</select></label>
        <label class="consent"><input type="checkbox" name="consent" required> <span>I agree to the <a href="/terms/" target="_blank">terms</a> and <a href="/privacy/" target="_blank">privacy policy</a>, and have permission to use these photos.</span></label>
        <button class="btn btn-big" type="submit">Place my order</button>
        <p class="small" id="pay-note">Next, you pay securely. Your magazine is ready to download the moment you have paid, and we email it to you too.</p>
        <p class="small order-progress" id="order-progress" hidden></p>
        ${trustStrip.replace('class="trust"', 'class="trust trust-mini"')}
      </fieldset>
    </form>
  </div>
  <a class="btn btn-small peek" href="#preview-top">See my magazine</a>
  <aside class="maker-preview" id="preview-top" aria-label="Live preview">
    <div class="preview-tabs" role="tablist"></div>
    <div class="preview-stage"><div id="preview"></div><span class="watermark" aria-hidden="true">Preview</span></div>
    <button type="button" class="btn see-all" id="see-all">Flip through all 24 pages</button>
    <p class="small center">This updates as you type. See every page of their magazine, with your answers, before you pay.</p>
  </aside>
  <dialog class="all-pages" id="all-pages" aria-label="All pages of your magazine"><div class="all-head"><h2>Their magazine, page by page</h2><button type="button" class="btn btn-small" data-close>Back to editing</button></div><div class="all-grid"></div></dialog>
</section>
<script type="application/json" id="mags">${JSON.stringify(mags).replace(/</g, '\\u003c')}</script>
<script type="application/json" id="site-checkout">${JSON.stringify(site.checkout)}</script>`;
  await page('/make/', layout({
    title: 'Make your magazine', description: 'Answer a few fun questions, add photos and watch your personalised magazine come to life.', path: '/make/', body, bodyClass: 'is-maker',
    scripts: '<script type="module" src="/assets/maker.js"></script>',
  }));
}

async function ideasPages() {
  const cards = ideas.map(i => `
    <a class="idea-card" href="/ideas/${i.slug}/"><img src="${i.image}" alt="" loading="lazy" width="1000" height="1500"><div><p class="kicker">${esc(i.kicker)}</p><h3>${esc(i.title)}</h3><p>${esc(i.description)}</p></div></a>`).join('');
  await page('/ideas/', layout({
    title: 'Gift ideas', description: 'Thoughtful, personal gift ideas for birthdays, anniversaries and family far away.', path: '/ideas/',
    body: `<section class="section"><div class="section-head"><p class="kicker">Ideas</p><h1>Little ideas for big feelings</h1></div><div class="idea-grid">${cards}</div></section>`,
  }));
  for (const i of ideas) {
    const path = `/ideas/${i.slug}/`;
    await page(path, layout({
      title: i.title, description: i.description, path,
      og: { type: 'article', image: abs(i.image) },
      jsonld: { '@context': 'https://schema.org', '@type': 'Article', headline: i.title, description: i.description, image: abs(i.image), datePublished: i.date, publisher: { '@type': 'Organization', name: site.name } },
      body: `<article class="article">
        <nav class="crumbs"><a href="/">Home</a> <span>/</span> <a href="/ideas/">Ideas</a></nav>
        <p class="kicker">${esc(i.kicker)}</p><h1>${esc(i.title)}</h1><p class="lead">${esc(i.description)}</p>
        <figure class="article-pin">${saveImg(i.image, i.title, `${i.title}. ${i.description}`)}</figure>
        ${i.body}
        <div class="article-cta"><h2>Turn it into a magazine</h2><p>Answer a few questions and we will make it look gorgeous.</p><a class="btn btn-big" href="${i.cta || '/make/'}">Make yours</a></div>
      </article>`,
    }));
  }
}

async function simplePages() {
  const wrap = (kicker, title, inner) => `<article class="article prose"><p class="kicker">${kicker}</p><h1>${title}</h1>${inner}</article>`;
  await page('/help/', layout({
    title: 'Delivery and FAQ', description: 'Delivery times, worldwide shipping, photos, reprints and everything else you might wonder about.', path: '/help/', jsonld: faqLd,
    body: wrap('Help', 'Delivery and questions', `
      <h2>Delivery</h2>
      <p>Your finished 24 page magazine is ready to download as a PDF the moment you have paid, and we email it to you too. You can send it to anyone, anywhere, by email or message, or print it at home or at any print shop.</p>
      <p>Printed magazines are printed on glossy or matte paper, and hardcover keepsake books on heavy glossy photo paper, by our print partner near the lucky person, then posted. Printing takes about 4 to 5 working days, plus a few days for the post. Shipping is worked out for their country and added at checkout.</p>
      <p>Giving it for a special day? Order at least three days before, just to be safe.</p>
      <h2>Questions</h2>${faqHtml}
      <h2>Still stuck?</h2><p>Email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> and a real person will help.</p>`),
  }));
  await page('/about/', layout({
    title: 'About us', description: `The story behind ${site.name}, and the promise we make with every magazine.`, path: '/about/',
    body: wrap('About', 'Everybody deserves a front page', `
      <p>The best gifts say <em>I really know you</em>. Not a gift card, not another candle, but something that could only ever be for them.</p>
      <p>${esc(site.name)} began with a feeling many of us know. The people we love most are often far away, busy lives get in the way, and when a birthday or an anniversary comes round we want to give something that shows how much they mean to us. The shops are full of templates you have to design yourself, late at night, hoping it looks all right.</p>
      <p>So we built the opposite. You answer a few fun questions and add your favourite photos, and we do the rest: a real, glossy magazine all about them, with their own cover, their own newspaper, their own awards night and passport, and little notes from the people who love them. It is ready in minutes and can reach them anywhere in the world.</p>
      <h2>Our promise</h2>
      <ul class="ticks">
        <li>Every magazine is made for one person only. No two are ever the same.</li>
        <li>If something is not right, we put it right, free.</li>
        <li>Your photos are used only for your magazine and are deleted after 30 days.</li>
        <li>No ads, no selling your details, ever.</li>
        <li>Real reviews only. We will never make one up.</li>
      </ul>
      <h2>Talk to us</h2>
      <p>We are a small team and we read every message. Email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> and we usually reply within a day.</p>
      <p class="small">${esc(site.name)} is a trading name of ${esc(site.company)}, a company registered in the United Kingdom (company number ${esc(site.companyNumber)}).</p>`),
  }));
  await page('/privacy/', layout({
    title: 'Privacy policy', description: 'How we look after your answers, photos and details.', path: '/privacy/',
    body: wrap('The small print', 'Privacy policy', `
      <p>This policy explains how ${esc(site.company)} (trading as ${esc(site.name)}) uses your information. We collect as little as we can, and only to make and deliver your magazine.</p>
      <h2>What we collect</h2><ul><li>Your answers and photos for the magazine</li><li>Your email address, and the delivery address for printed copies</li><li>Payment details, which are handled by our payment provider. We never see your card number.</li></ul>
      <h2>How we use it</h2><p>Only to design, print, deliver and support your order. We never sell your information or post your photos anywhere.</p>
      <h2>How long we keep it</h2><p>Photos and answers are deleted 30 days after your order, or 30 days after a gift is delivered. If you send your magazine as a gift, we use the email address you give only to deliver it. Order records are kept as long as the law requires for tax and accounting.</p>
      <h2>Who helps us</h2><p>Our website host (which receives your order form), our payment provider, and our print partner (for printed copies only). Each one only receives what it needs.</p>
      <h2>Cookies</h2><p>We do not use advertising cookies unless you say yes. If we add Pinterest measurement, you will be asked first.</p>
      <h2>Your rights</h2><p>You can ask to see, correct or delete your information at any time by emailing <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>. You can also complain to the UK Information Commissioner's Office.</p>`),
  }));
  await page('/terms/', layout({
    title: 'Terms', description: 'The terms for ordering a personalised magazine.', path: '/terms/',
    body: wrap('The small print', 'Terms of sale', `
      <p>These terms apply when you order from ${esc(site.name)}, a trading name of ${esc(site.company)}, company number ${esc(site.companyNumber)}.</p>
      <h2>Your magazine</h2><p>Each magazine is made just for you from your answers and photos, so please check spelling in your preview and proof. You confirm you have permission to use the photos you upload.</p>
      <h2>Prices and payment</h2><p>Prices are shown before you pay. For printed copies, shipping is worked out for the delivery country and shown at our print partner's checkout before you pay. You may see prices in your own currency.</p>
      <h2>Cancellations and refunds</h2><p>Because every magazine is personalised, we cannot accept returns for a change of mind once your magazine has been made. If there is a mistake we can fix, a printing fault, or your magazine arrives damaged, we will put it right free, by fixing it, reprinting it or refunding you. This does not affect your legal rights.</p>
      <h2>PDF magazines</h2><p>Your PDF is for personal use. You are welcome to print as many copies as you like for family and friends.</p>
      <h2>Contact</h2><p><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>`),
  }));
  await page('/download/', layout({
    title: 'Your magazine is ready', description: 'Download your finished magazine.', path: '/download/',
    body: `<section class="thanks download"><div class="confetti" aria-hidden="true">${Array.from({ length: 18 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div><p class="kicker">Hot off the press</p><h1 id="dl-title">Just a moment, we're fetching your magazine.</h1><p class="lead" id="dl-lead">This usually takes a few seconds after payment.</p><div class="dl-btns" id="dl-btns" hidden></div><p class="small" id="dl-note">We email your magazine to you as well, so it is always safe in your inbox.</p><a class="btn btn-ghost" href="/">Back to the front page</a></section>`,
    scripts: '<script type="module" src="/assets/download.js"></script>',
  }));
  await page('/review/', layout({
    title: 'Leave a review', description: 'Tell us how your magazine went.', path: '/review/',
    body: `<section class="section review-page"><div class="section-head"><p class="kicker">Your review</p><h1>How did it go?</h1><p class="lead" id="rev-intro">Just a moment...</p></div>
      <form id="review-form" class="review-form" hidden>
        <input type="hidden" name="rating" value="0">
        <div class="rev-stars" role="group" aria-label="Your rating">${[1, 2, 3, 4, 5].map(n => `<button type="button" class="rev-star" aria-label="${n} star${n > 1 ? 's' : ''}" aria-pressed="false">&#9733;</button>`).join('')}</div>
        <p class="rev-star-label" id="rev-star-label">Tap the stars</p>
        <label class="field"><span>Tell us about it</span><textarea name="text" rows="5" maxlength="600" required placeholder="Her face when she saw herself on the cover! She read every page twice."></textarea></label>
        <div class="rev-row"><label class="field"><span>Your first name</span><input name="name" maxlength="40" required autocomplete="given-name" placeholder="Emma"></label>
        <label class="field"><span>Where you are <small>(optional)</small></span><input name="place" maxlength="40" placeholder="Leeds, UK"></label></div>
        <label class="field rev-photo"><span>Add a photo <small>(optional: the magazine, or the moment they opened it)</small></span><input type="file" name="photo" accept="image/*"></label>
        <img id="rev-preview" class="rev-preview" alt="" hidden>
        <p class="small">Your review, first name and photo will be shown on our website. Please only share photos of people who are happy to appear.</p>
        <p class="rev-msg" id="rev-msg" hidden></p>
        <button class="btn btn-big" type="submit">Share my review</button>
      </form>
      <div id="rev-done" class="thanks" hidden><p class="kicker">Thank you</p><h2>You have made our day.</h2><p class="lead">Your review is now on our website, helping someone else find the perfect gift.</p><a class="btn" href="/">Back to the front page</a></div>
    </section>`,
    scripts: '<script type="module" src="/assets/review.js"></script>',
  }));
  await page('/thanks/', layout({
    title: 'Thank you', description: 'Your magazine is on its way.', path: '/thanks/',
    body: `<section class="thanks"><div class="confetti" aria-hidden="true">${Array.from({ length: 18 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div><p class="kicker">Order received</p><h1>Stop the press! Your magazine is in the works.</h1><p class="lead" id="thanks-lead">Digital magazines are ready to download straight after payment, and we email them to you too. Printed copies are printed near the lucky person and posted, and our print partner emails you when it ships.</p><a class="btn" href="/">Back to the front page</a></section>`,
  }));
  await page('/404.html', layout({
    title: 'Page not found', description: 'This page has gone to print somewhere else.', path: '/404.html',
    body: `<section class="thanks"><p class="kicker">Error 404</p><h1>This page has gone missing, sources say.</h1><a class="btn" href="/">Back to the front page</a></section>`,
  }));
}

async function feeds() {
  const urls = ['/', ...mags.flatMap(m => designsFor(m).map(d => magPath(m, d))), '/make/', '/ideas/', ...ideas.map(i => `/ideas/${i.slug}/`), '/help/', '/about/', '/privacy/', '/terms/'];
  await page('/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${abs(u)}</loc></url>`).join('\n')}\n</urlset>\n`);
  await page('/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${abs('/sitemap.xml')}\n`);
  // Pinterest catalog feed: one row per magazine and edition, so each shows up as a shoppable product.
  const csvCell = s => `"${String(s).replace(/"/g, '""')}"`;
  const rows = [['id', 'title', 'description', 'link', 'image_link', 'additional_image_link', 'price', 'availability', 'condition', 'brand', 'item_group_id', 'google_product_category', 'product_type']];
  for (const m of mags) for (const d of designsFor(m)) for (const t of tiers) {
    const exs = designExamples(m, d);
    const sig = isBase(m, d);
    rows.push([sig ? `${m.slug}-${t.id}` : `${m.slug}-${d}-${t.id}`, `${m.searchTitle}${sig ? '' : `, ${DESIGNS[d].label} Design`} (${t.label})`, `${m.description} ${t.blurb}.`, abs(magPath(m, d)), abs(pinSrc(m, exs[0], d)), exs.slice(1).map(ex => abs(pinSrc(m, ex, d))).join(','), `${t.gbp.toFixed(2)} GBP`, 'in stock', 'new', site.name, m.slug, 'Media > Magazines & Newspapers', `Personalised gifts > ${m.occasion}`]);
  }
  await page('/feed/pinterest-catalog.csv', rows.map(r => r.map(csvCell).join(',')).join('\n') + '\n');
}

// ---------- run ----------

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(new URL('assets/', root), new URL('assets/', dist), { recursive: true });
await cp(new URL('pins/', root), new URL('pins/', dist), { recursive: true });
await cp(new URL('src/covers.js', root), new URL('assets/covers.js', dist));
await home();
for (const m of mags) for (const d of designsFor(m)) await magazinePage(m, d);
await makerPage();
await ideasPages();
await simplePages();
await feeds();
console.log(`Built ${site.name} into dist/`);
