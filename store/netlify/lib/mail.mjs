// Emails sent by the shop itself: the buyer's "your magazine is ready" email
// and the gift email to the person the magazine is for. They go out through
// the shop's own Gmail account (GMAIL_USER + GMAIL_APP_PASSWORD in Netlify).
import { idOk, orderStatus } from './orders.mjs';

const DAY = 24 * 60 * 60 * 1000;
const REVIEW_AFTER = 5 * DAY;
const MAX_ATTACH = 15 * 1024 * 1024; // Gmail allows 25MB once encoded
const emailOk = e => /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(String(e || '')) && String(e).length <= 120;
const clean = (s, n) => String(s || '').replace(/[\r\n<>]/g, ' ').trim().slice(0, n);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const mailReady = env => !!(env.GMAIL_USER && env.GMAIL_APP_PASSWORD);

export async function gmailSender(env) {
  const { default: nodemailer } = await import('nodemailer');
  const t = nodemailer.createTransport({ service: 'gmail', auth: { user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD } });
  return msg => t.sendMail({ from: { name: 'Cover Story', address: env.GMAIL_USER }, ...msg });
}

// Saved when the order is finished. The gift is sent at 8am in the buyer's own
// time zone on the chosen day, or straight away when no day is picked.
export async function saveOrderInfo(store, id, { kind, email, title, who, gift, tz, mag } = {}, now = Date.now()) {
  if (!idOk(id) || await store.get(`${id}/order.json`, { type: 'text' })) return;
  const info = { kind: kind === 'print' ? 'print' : 'digital', email: emailOk(email) ? email : '', title: clean(title, 140), who: clean(who, 60), mag: /^[a-z0-9-]{2,60}$/.test(mag || '') ? mag : '' };
  if (info.kind === 'digital' && gift && emailOk(gift.email)) {
    let sendAt = now;
    const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(gift.date || '');
    if (d) {
      const offset = Math.max(-840, Math.min(840, Number(tz) || 0)); // minutes, as getTimezoneOffset gives
      sendAt = Math.min(Math.max(Date.UTC(+d[1], +d[2] - 1, +d[3], 8) + offset * 60000, now), now + 31 * DAY);
    }
    info.gift = { name: clean(gift.name, 60), email: gift.email, from: clean(gift.from, 60), sendAt };
  }
  await store.set(`${id}/order.json`, JSON.stringify(info), { metadata: { created: now } });
  if (info.kind === 'digital') await store.set(`pending/${id}`, '1', { metadata: { created: now } });
}

const button = (href, label) => `<a href="${esc(href)}" style="display:inline-block;background:#ff6f59;color:#fff;text-decoration:none;font-weight:700;padding:14px 26px;border-radius:999px;font-size:17px">${esc(label)}</a>`;
const wrap = inner => `<div style="background:#fff4ec;padding:28px 14px;font-family:Helvetica,Arial,sans-serif;color:#1d1a2f"><div style="max-width:560px;margin:0 auto;background:#fff;border-radius:22px;padding:30px 26px;text-align:center">${inner}<p style="margin:30px 0 0;font-size:13px;color:#8a8499">Made with love by Cover Story</p></div></div>`;

function buyerEmail(info, links, origin, now) {
  const who = info.who || 'them';
  const cards = links.cards ? `<p style="margin:14px 0 0">${button(links.cards, 'Download the card set')}</p>` : '';
  const gift = info.gift ? `<p style="font-size:15px;line-height:1.5;margin:22px 0 0">We will send ${esc(info.gift.name || who)} their copy ${info.gift.sendAt <= now ? 'right now' : 'on the morning of the day you picked'}, with your name on it.</p>` : '';
  return {
    subject: `Your magazine for ${who} is ready`,
    html: wrap(`<h1 style="font-family:Georgia,serif;font-weight:400;font-size:30px;margin:0 0 12px">It's ready!</h1><p style="font-size:16px;line-height:1.55;margin:0 0 22px">Thank you for your order. Your magazine for ${esc(who)} is finished and waiting for you.</p>${button(links.pdf, 'Download my magazine')}${cards}${gift}<p style="font-size:15px;line-height:1.5;margin:26px 0 8px">Once you have given it, we would love to hear how it went.</p><a href="${esc(links.review)}" style="color:#ff6f59;font-weight:700">Leave a review and a photo</a><p style="font-size:13px;line-height:1.5;color:#8a8499;margin:22px 0 0">Please save it to your phone or computer. For your privacy the download link is removed after 30 days. Questions? Just reply to this email.</p>`),
    text: `Your magazine for ${who} is ready.\n\nDownload it: ${links.pdf}\n${links.cards ? `Card set: ${links.cards}\n` : ''}\nPlease save it, the link is removed after 30 days for your privacy.\n\nCover Story\n${origin}`,
  };
}

function reviewEmail(info, links) {
  const who = info.who || 'them';
  return {
    subject: `Did ${who} love it?`,
    html: wrap(`<h1 style="font-family:Georgia,serif;font-weight:400;font-size:28px;margin:0 0 12px">Did ${esc(who)} love it?</h1><p style="font-size:16px;line-height:1.55;margin:0 0 22px">We hope your magazine made someone smile. Would you tell us how it went? A few words and, if you like, a photo of the moment help other people find the perfect gift too.</p>${button(links.review, 'Leave a review')}<p style="font-size:13px;line-height:1.5;color:#8a8499;margin:22px 0 0">It takes a minute. Thank you for choosing us.</p>`),
    text: `Did ${who} love it? Tell us how it went: ${links.review}\n\nThank you for choosing Cover Story.`,
  };
}

function giftEmail(info, links, hasCover) {
  const name = info.gift.name || 'you';
  const from = info.gift.from || 'Someone who loves you';
  return {
    subject: `${name}, you're on the cover!`,
    html: wrap(`<p style="font-size:15px;letter-spacing:.12em;text-transform:uppercase;color:#ff6f59;font-weight:700;margin:0 0 10px">A gift for you</p><h1 style="font-family:Georgia,serif;font-weight:400;font-size:30px;line-height:1.2;margin:0 0 16px">Hello ${esc(name)}, somebody made you your very own magazine</h1>${hasCover ? '<img src="cid:cover" alt="Your magazine cover" width="260" style="width:260px;max-width:80%;border-radius:6px;box-shadow:0 14px 30px -14px rgba(29,26,47,.5);margin:0 0 22px">' : ''}<p style="font-size:16px;line-height:1.55;margin:0 0 22px">Every page is about you: your story, your photos and the little things that make you, you.</p>${button(links.pdf, 'Open my magazine')}<p style="font-family:Georgia,serif;font-size:20px;margin:26px 0 0">${esc(from)}</p><p style="font-size:13px;line-height:1.5;color:#8a8499;margin:22px 0 0">Your magazine is attached too. Save it somewhere safe, the download link is removed after 30 days.</p>`),
    text: `Hello ${name}, somebody made you your very own magazine.\n\nOpen it here: ${links.pdf}\n\n${from}\n\nSave it somewhere safe, the link is removed after 30 days.`,
  };
}

// Sends whatever is due for one order and remembers what went, so running it
// twice never sends twice. Returns true once nothing is left to send.
export async function deliverOrder(store, id, { origin, send, now = Date.now() }) {
  const info = JSON.parse((await store.get(`${id}/order.json`, { type: 'text' })) || 'null');
  if (!info || info.kind !== 'digital') return true;
  const status = await orderStatus(store, id, origin);
  if (!status.paid) return false;
  const links = { pdf: `${status.pdf}&dl=1`, cards: status.cards && `${status.cards}&dl=1`, review: `${origin}/review/?id=${id}` };
  let changed = false;
  if (!info.buyerSentAt && info.email) {
    await send({ to: info.email, ...buyerEmail(info, links, origin, now) });
    info.buyerSentAt = now; changed = true;
  }
  if (info.gift && !info.gift.sentAt && info.gift.sendAt <= now) {
    const attachments = [];
    const cover = await store.get(`${id}/cover.jpg`, { type: 'arrayBuffer' });
    if (cover) attachments.push({ filename: 'cover.jpg', content: Buffer.from(cover), cid: 'cover' });
    const pdf = await store.get(`${id}/magazine.pdf`, { type: 'arrayBuffer' });
    if (pdf && pdf.byteLength <= MAX_ATTACH) attachments.push({ filename: 'Your magazine.pdf', content: Buffer.from(pdf) });
    await send({ to: info.gift.email, ...(info.email ? { replyTo: info.email } : {}), ...giftEmail(info, links, !!cover), attachments });
    info.gift.sentAt = now; changed = true;
  }
  // A friendly nudge for a review, 5 days after the magazine arrived.
  if (info.buyerSentAt && !info.reviewAskedAt && info.email && now - info.buyerSentAt >= REVIEW_AFTER) {
    await send({ to: info.email, ...reviewEmail(info, links) });
    info.reviewAskedAt = now; changed = true;
  }
  if (changed) await store.set(`${id}/order.json`, JSON.stringify(info), { metadata: { created: (await store.getMetadata(`${id}/order.json`))?.metadata?.created || now } });
  return (!info.email || !!info.reviewAskedAt) && (!info.gift || !!info.gift.sentAt);
}

// Goes through every order still waiting for an email.
export async function deliverPending(store, opts) {
  const { blobs } = await store.list({ prefix: 'pending/' });
  let done = 0;
  for (const { key } of blobs) {
    const id = key.slice('pending/'.length);
    try {
      if (await deliverOrder(store, id, opts)) { await store.delete(key); done++; }
    } catch (e) { console.error(`Could not email order ${id}:`, e.message); }
  }
  return done;
}
