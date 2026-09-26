// Builds the whole shop into dist/ as plain HTML. No dependencies: run `npm run build`.
// Every page is real HTML so Pinterest can read titles, prices and images (rich pins).
import { readFile, writeFile, mkdir, rm, cp, readdir } from 'node:fs/promises';
import { renderCover, renderPages, esc } from './covers.js';

const root = new URL('..', import.meta.url);
const dist = new URL('dist/', root);
const read = async p => readFile(new URL(p, root), 'utf8');
const site = JSON.parse(await read('data/site.json'));
const mags = JSON.parse(await read('data/magazines.json'));
const ideas = await loadIdeas();
const abs = p => site.url.replace(/\/$/, '') + p;
const pinSrc = (mag, ex) => `/pins/${mag.slug}-${ex.id}.jpg`;
const tiers = site.tiers;
const from = tiers[0];

// ---------- helpers ----------

const price = t => `<span class="price" data-gbp="£${t.gbp}" data-usd="$${t.usd}">£${t.gbp}</span>`;
const fromPrice = `<span class="price" data-gbp="£${from.gbp}" data-usd="$${from.usd}">£${from.gbp}</span>`;

function saveImg(src, alt, desc, cls = '') {
  return `<img class="${cls}" src="${src}" alt="${esc(alt)}" loading="lazy" width="1000" height="1500" data-pin-description="${esc(desc)}" data-pin-media="${abs(src)}">`;
}

function coverFor(mag, ex) {
  return renderCover(mag, ex.values, { palette: ex.palette, portraitOpts: ex.portrait });
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
  const nav = mags.map(m => `<a href="/${m.slug}/">${esc(m.occasion.split(' ')[0])}</a>`).join('');
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
  </div>`;

const steps = `
  <ol class="steps">
    <li><span class="step-ico" aria-hidden="true">&#9998;</span><h3>Answer a few fun questions</h3><p>Their nickname, their secret talent, the moment you will never forget. Every question comes with an example, so nobody gets stuck.</p></li>
    <li><span class="step-ico" aria-hidden="true">&#128247;</span><h3>Add your favourite photos</h3><p>Three photos is all it takes. Watch the cover come alive as you type.</p></li>
    <li><span class="step-ico" aria-hidden="true">&#127873;</span><h3>Give the best gift of the year</h3><p>Download it instantly, or we print a glossy copy near them and post it to their door, anywhere in the world.</p></li>
  </ol>`;

const faq = [
  ['How long does it take?', 'About five minutes to fill in. A PDF is sent to your inbox, and printed magazines are usually made within 4 to 6 days, then posted.'],
  ['Where do you deliver?', 'Worldwide. Printed copies are made in the UK, Europe, the USA or Australia, whichever is closest, so they arrive faster and without surprise customs fees in most countries.'],
  ['Can I see it before I pay?', 'Yes. You see a live preview of the cover and pages while you fill in the form.'],
  ['What happens to my photos?', 'They are used only to make your magazine and are deleted 30 days after your order. We never share or post them anywhere.'],
  ['What if something is wrong?', 'If there is a printing mistake or it arrives damaged, we reprint it for free. Just email us a photo.'],
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
        <p class="from">From ${fromPrice}</p>
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
    <p class="lead">Answer a few fun questions, add your photos, and we turn them into a beautiful magazine all about the person you love. Instant PDF, or printed and posted anywhere in the world.</p>
    <div class="hero-cta"><a class="btn btn-big" href="/make/">Make a magazine</a><a class="btn btn-ghost" href="#magazines">See the magazines</a></div>
    <p class="hero-note">Ready in 5 minutes &middot; From ${fromPrice} &middot; No design skills needed</p>
  </div>
  <div class="hero-covers">${heroCovers}</div>
</section>
${tickerHtml}
<section class="section" id="magazines">
  <div class="section-head"><p class="kicker">Pick a magazine</p><h2>Which story are you telling?</h2></div>
  <div class="mag-grid">${cards}</div>
  <div class="soon"><span class="soon-badge">Coming for Christmas</span><p><b>Our Year in Review:</b> the whole family's year as a glossy magazine. Perfect for stockings and far away relatives.</p></div>
</section>
<section class="section section-tint">
  <div class="section-head"><p class="kicker">How it works</p><h2>A gift that feels handmade, without the hours</h2></div>
  ${steps}
  <p class="center"><a class="btn btn-big" href="/make/">Start yours now</a></p>
</section>
<section class="section">
  <div class="section-head"><p class="kicker">Real magazines, made up names</p><h2>Save your favourites for later</h2><p>Hover on any cover and tap Save to keep it on your Pinterest board.</p></div>
  <div class="wall">${wallHtml}</div>
</section>
<section class="section section-tint" id="prices">
  <div class="section-head"><p class="kicker">Simple prices</p><h2>Choose how you give it</h2></div>
  ${tierCards()}
</section>
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
  }));
}

async function magazinePage(mag) {
  const path = `/${mag.slug}/`;
  const main = mag.examples[0];
  const lowest = Math.min(...tiers.map(t => t.gbp));
  const highest = Math.max(...tiers.map(t => t.gbp));
  const inside = renderPages(mag, main.values, { palette: main.palette, portraitOpts: main.portrait });
  const desc = `${mag.searchTitle}: ${mag.short} Made in 5 minutes from your answers and photos. Instant PDF or printed and posted worldwide.`;
  const body = `
<nav class="crumbs"><a href="/">Home</a> <span>/</span> ${esc(mag.occasion)}</nav>
<section class="mag-hero">
  <div class="mag-gallery">
    <div class="mag-main">${saveImg(pinSrc(mag, main), `${mag.title} example: ${Object.values(main.values)[0]}`, `${mag.pinTitle}. ${mag.short} Personalise it in 5 minutes.`, 'mag-main-img')}</div>
    <div class="mag-thumbs">${mag.examples.map((ex, i) => `<button type="button" class="mag-thumb${i ? '' : ' is-on'}" data-src="${pinSrc(mag, ex)}" aria-label="Show example ${i + 1}">${coverFor(mag, ex)}</button>`).join('')}</div>
  </div>
  <div class="mag-info">
    <p class="kicker">${esc(mag.occasion)}</p>
    <h1>${esc(mag.searchTitle)}</h1>
    <p class="lead">${esc(mag.description)}</p>
    <p class="mag-price">From ${fromPrice}</p>
    <a class="btn btn-big" href="/make/?m=${mag.slug}">Make yours in 5 minutes</a>
    <a class="pin-btn" href="https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(abs(path))}&amp;media=${encodeURIComponent(abs(pinSrc(mag, main)))}&amp;description=${encodeURIComponent(mag.pinTitle + '. ' + mag.short)}" data-pin-do="none" target="_blank" rel="noopener">Save to Pinterest</a>
    <h2 class="h-small">What's inside</h2>
    <ul class="ticks">${mag.inside.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
    <p class="chips">${mag.keywords.map(k => `<span>${esc(k)}</span>`).join('')}</p>
  </div>
</section>
<section class="section section-tint">
  <div class="section-head"><p class="kicker">Peek inside</p><h2>Every page is about them</h2></div>
  <div class="spread">
    <div class="spread-page">${coverFor(mag, main)}</div>
    ${inside.map(p => `<div class="spread-page">${p}</div>`).join('')}
  </div>
</section>
<section class="section">
  <div class="section-head"><p class="kicker">Prices</p><h2>Choose how you give it</h2></div>
  ${tierCards(mag.slug)}
</section>
<section class="section section-tint">
  <div class="section-head"><p class="kicker">How it works</p><h2>Five minutes, one very happy person</h2></div>
  ${steps}
</section>
<section class="section">${faqHtml}</section>
<section class="cta-band"><h2>Ready to make ${esc(mag.title)}?</h2><a class="btn btn-big btn-light" href="/make/?m=${mag.slug}">Start now</a></section>`;
  const jsonld = [{
    '@context': 'https://schema.org', '@type': 'Product',
    name: mag.searchTitle, description: mag.description,
    image: mag.examples.map(ex => abs(pinSrc(mag, ex))),
    brand: { '@type': 'Brand', name: site.name },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'GBP', lowPrice: lowest.toFixed(2), highPrice: highest.toFixed(2), offerCount: tiers.length, availability: 'https://schema.org/InStock', url: abs(path) },
  }, faqLd];
  await page(path, layout({
    title: mag.searchTitle, description: desc, path, body, jsonld,
    og: {
      type: 'product', image: abs(pinSrc(mag, main)),
      extra: { 'product:price:amount': lowest.toFixed(2), 'product:price:currency': 'GBP', 'og:price:amount': lowest.toFixed(2), 'og:price:currency': 'GBP', 'product:availability': 'in stock', 'og:availability': 'instock', 'product:brand': site.name },
    },
    scripts: `<script type="module">
      document.querySelectorAll('.mag-thumb').forEach(b => b.addEventListener('click', () => {
        document.querySelectorAll('.mag-thumb').forEach(x => x.classList.toggle('is-on', x === b));
        const img = document.querySelector('.mag-main-img'); img.src = b.dataset.src; img.dataset.pinMedia = new URL(b.dataset.src, location.href).href;
      }));
    </script>`,
  }));
}

async function makerPage() {
  const tierOpts = tiers.map((t, i) => `
    <label class="tier-opt"><input type="radio" name="tier" value="${t.id}"${t.popular ? ' checked' : ''}><span><b>${esc(t.label)}</b> ${price(t)}<small>${esc(t.blurb)}</small></span></label>`).join('');
  const countries = ['United Kingdom', 'United States', 'Canada', 'Australia', 'Ireland', 'New Zealand', 'Germany', 'France', 'Netherlands', 'Spain', 'Italy', 'Sweden', 'South Africa', 'United Arab Emirates', 'Nigeria', 'Ghana', 'Kenya', 'India', 'Singapore', 'Other'];
  const body = `
<section class="maker">
  <div class="maker-form">
    <p class="kicker">The magazine maker</p>
    <h1>Let's make <span class="hl" id="who">their</span> magazine</h1>
    <div class="pick" role="radiogroup" aria-label="Choose a magazine">
      ${mags.map(m => `<button type="button" class="pick-btn" data-m="${m.slug}" role="radio">${coverFor(m, m.examples[0])}<span>${esc(m.title)}</span></button>`).join('')}
    </div>
    <div class="palette" aria-label="Choose a colour"></div>
    <form id="order" name="order" method="POST" action="/thanks/" data-netlify="true" netlify-honeypot="company" enctype="multipart/form-data">
      <input type="hidden" name="form-name" value="order">
      <input type="hidden" name="magazine"><input type="hidden" name="palette"><input type="hidden" name="answers">
      <p class="hp"><label>Leave this empty <input name="company"></label></p>
      <div id="fields"></div>
      <p class="photo-note">Your photos stay on your device while you design. They are only sent when you place your order.</p>
      <fieldset class="checkout">
        <legend>Love it? Choose your edition</legend>
        ${tierOpts}
        <label class="field"><span>Your email (we send the magazine here)</span><input type="email" name="email" required autocomplete="email" placeholder="you@example.com"></label>
        <label class="field"><span>Where is it going?</span><select name="country" required>${countries.map(c => `<option>${c}</option>`).join('')}</select></label>
        <label class="consent"><input type="checkbox" name="consent" required> I agree to the <a href="/terms/" target="_blank">terms</a> and <a href="/privacy/" target="_blank">privacy policy</a>, and have permission to use these photos.</label>
        <button class="btn btn-big" type="submit">Place my order</button>
        <p class="small">We check every magazine by hand before it goes out, and email you a secure payment link with your final proof.</p>
      </fieldset>
    </form>
  </div>
  <a class="btn btn-small peek" href="#preview-top">See my magazine</a>
  <aside class="maker-preview" id="preview-top" aria-label="Live preview">
    <div class="preview-tabs" role="tablist"></div>
    <div class="preview-stage"><div id="preview"></div><span class="watermark" aria-hidden="true">Preview</span></div>
    <p class="small center">This updates as you type. Tap the pages above to flip through.</p>
  </aside>
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
      <p>PDF magazines are emailed to you as soon as your proof is approved. Printed magazines are made in the UK, Europe, the USA or Australia, whichever is closest to the person receiving it, usually within 4 to 6 days, and then posted by local mail. Delivery times after that are usually:</p>
      <ul><li>UK, Europe, USA and Australia: 2 to 7 working days</li><li>Everywhere else: 7 to 15 working days</li></ul>
      <p>Giving it for a special day? Order at least two weeks before, and before our Christmas last order dates each December.</p>
      <h2>Questions</h2>${faqHtml}
      <h2>Still stuck?</h2><p>Email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> and a real person will help.</p>`),
  }));
  await page('/about/', layout({
    title: 'About us', description: `The story behind ${site.name}.`, path: '/about/',
    body: wrap('About', 'Everybody deserves a front page', `
      <p>The best gifts say <em>I really know you</em>. Not a gift card, not another candle, but something that could only ever be for them.</p>
      <p>${esc(site.name)} started with a simple idea: the people we love deserve to be the cover story. Their silly habits, their secret talents, the moment that still makes everyone laugh. We turn those memories into a real magazine, beautifully designed, in the time it takes to drink a cup of tea.</p>
      <p>No design skills, no hours of cutting and gluing. You bring the love and the stories, we bring the glossy pages.</p>
      <p>${esc(site.name)} is a trading name of ${esc(site.company)}, registered in the United Kingdom (company number ${esc(site.companyNumber)}).</p>`),
  }));
  await page('/privacy/', layout({
    title: 'Privacy policy', description: 'How we look after your answers, photos and details.', path: '/privacy/',
    body: wrap('The small print', 'Privacy policy', `
      <p>This policy explains how ${esc(site.company)} (trading as ${esc(site.name)}) uses your information. We collect as little as we can, and only to make and deliver your magazine.</p>
      <h2>What we collect</h2><ul><li>Your answers and photos for the magazine</li><li>Your email address, and the delivery address for printed copies</li><li>Payment details, which are handled by our payment provider. We never see your card number.</li></ul>
      <h2>How we use it</h2><p>Only to design, print, deliver and support your order. We never sell your information or post your photos anywhere.</p>
      <h2>How long we keep it</h2><p>Photos and answers are deleted 30 days after your order. Order records are kept as long as the law requires for tax and accounting.</p>
      <h2>Who helps us</h2><p>Our website host (which receives your order form), our payment provider, and our print partner (for printed copies only). Each one only receives what it needs.</p>
      <h2>Cookies</h2><p>We do not use advertising cookies unless you say yes. If we add Pinterest measurement, you will be asked first.</p>
      <h2>Your rights</h2><p>You can ask to see, correct or delete your information at any time by emailing <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>. You can also complain to the UK Information Commissioner's Office.</p>`),
  }));
  await page('/terms/', layout({
    title: 'Terms', description: 'The terms for ordering a personalised magazine.', path: '/terms/',
    body: wrap('The small print', 'Terms of sale', `
      <p>These terms apply when you order from ${esc(site.name)}, a trading name of ${esc(site.company)}, company number ${esc(site.companyNumber)}.</p>
      <h2>Your magazine</h2><p>Each magazine is made just for you from your answers and photos, so please check spelling in your preview and proof. You confirm you have permission to use the photos you upload.</p>
      <h2>Prices and payment</h2><p>Prices are shown before you pay and include delivery for printed copies unless stated. You may see prices in your own currency.</p>
      <h2>Cancellations and refunds</h2><p>Because every magazine is personalised, we cannot accept returns for a change of mind once your proof is approved. If there is a printing fault or your magazine arrives damaged, we will reprint it free or refund you. This does not affect your legal rights.</p>
      <h2>PDF magazines</h2><p>Your PDF is for personal use. You are welcome to print as many copies as you like for family and friends.</p>
      <h2>Contact</h2><p><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>`),
  }));
  await page('/thanks/', layout({
    title: 'Thank you', description: 'Your magazine is on its way.', path: '/thanks/',
    body: `<section class="thanks"><div class="confetti" aria-hidden="true">${Array.from({ length: 18 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div><p class="kicker">Order received</p><h1>Stop the press! Your magazine is in the works.</h1><p class="lead">We are checking every page by hand. Look out for an email with your final proof and a secure payment link, usually within 24 hours.</p><a class="btn" href="/">Back to the front page</a></section>`,
  }));
  await page('/404.html', layout({
    title: 'Page not found', description: 'This page has gone to print somewhere else.', path: '/404.html',
    body: `<section class="thanks"><p class="kicker">Error 404</p><h1>This page has gone missing, sources say.</h1><a class="btn" href="/">Back to the front page</a></section>`,
  }));
}

async function feeds() {
  const urls = ['/', ...mags.map(m => `/${m.slug}/`), '/make/', '/ideas/', ...ideas.map(i => `/ideas/${i.slug}/`), '/help/', '/about/', '/privacy/', '/terms/'];
  await page('/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${abs(u)}</loc></url>`).join('\n')}\n</urlset>\n`);
  await page('/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${abs('/sitemap.xml')}\n`);
  // Pinterest catalog feed: one row per magazine and edition, so each shows up as a shoppable product.
  const csvCell = s => `"${String(s).replace(/"/g, '""')}"`;
  const rows = [['id', 'title', 'description', 'link', 'image_link', 'additional_image_link', 'price', 'availability', 'condition', 'brand', 'item_group_id', 'google_product_category', 'product_type']];
  for (const m of mags) for (const t of tiers) {
    rows.push([`${m.slug}-${t.id}`, `${m.searchTitle} (${t.label})`, `${m.description} ${t.blurb}.`, abs(`/${m.slug}/`), abs(pinSrc(m, m.examples[0])), m.examples.slice(1).map(ex => abs(pinSrc(m, ex))).join(','), `${t.gbp.toFixed(2)} GBP`, 'in stock', 'new', site.name, m.slug, 'Media > Magazines & Newspapers', `Personalised gifts > ${m.occasion}`]);
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
for (const m of mags) await magazinePage(m);
await makerPage();
await ideasPages();
await simplePages();
await feeds();
console.log(`Built ${site.name} into dist/`);
