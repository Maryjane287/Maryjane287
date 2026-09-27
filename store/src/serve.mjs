// Tiny local server for dist/ (run `npm run build` first). Accepts the order
// form POST so the maker can be tested end to end without Netlify.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, normalize } from 'node:path';
import { savePage, buildPdf, getFile, createCheckout } from '../netlify/lib/orders.mjs';

// In-memory stand-in for Netlify Blobs, so /api/order/* works locally too.
const mem = new Map();
const store = {
  async get(k) { return mem.has(k) ? mem.get(k).slice().buffer : null; },
  async set(k, v) { mem.set(k, Buffer.from(v instanceof ArrayBuffer ? new Uint8Array(v) : v)); },
  async delete(k) { mem.delete(k); },
};
const site = JSON.parse(await readFile(new URL('../data/site.json', import.meta.url), 'utf8'));
const body = req => new Promise(ok => { const c = []; req.on('data', d => c.push(d)); req.on('end', () => ok(Buffer.concat(c))); });
const send = (res, status, data, type = 'application/json') => { res.writeHead(status, { 'content-type': type }); res.end(type === 'application/json' ? JSON.stringify(data) : data); };

async function api(req, res, url) {
  try {
    if (url.pathname === '/api/order/page') { await savePage(store, url.searchParams.get('id'), Number(url.searchParams.get('n')), new Uint8Array(await body(req))); return send(res, 200, { ok: true }); }
    if (url.pathname === '/api/order/finish') {
      const { id, kind, finish, title } = JSON.parse(await body(req));
      await buildPdf(store, id, title);
      const origin = `http://${req.headers.host}`;
      const out = { pdf: `${origin}/api/order/file?id=${id}&f=pdf` };
      // Without Peecho keys locally, pretend the checkout is our thank you page.
      if (kind === 'print') out.checkout = process.env.PEECHO_API_KEY ? await createCheckout({ env: process.env, origin, id, title, finish, offerings: site.peecho?.offerings }) : `${origin}/thanks/?printed=1&test=1`;
      return send(res, 200, out);
    }
    if (url.pathname === '/api/order/file') {
      const f = await getFile(store, url.searchParams.get('id'), url.searchParams.get('f'));
      return f ? send(res, 200, Buffer.from(f.buf), f.type) : send(res, 404, { error: 'Not found' });
    }
    send(res, 404, { error: 'Not found' });
  } catch (e) { send(res, e.status || 500, { error: e.message }); }
}

const dist = new URL('../dist/', import.meta.url).pathname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml', '.csv': 'text/csv', '.txt': 'text/plain' };
const port = +process.env.PORT || 8080;

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname.startsWith('/api/')) return api(req, res, url);
  if (req.method === 'POST') { req.resume(); req.on('end', () => { res.writeHead(200); res.end('ok'); }); return; }
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  if (path.endsWith('/')) path += 'index.html';
  try {
    const body = await readFile(dist + path);
    res.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': types['.html'] });
    res.end(await readFile(dist + '404.html').catch(() => 'Not found'));
  }
}).listen(port, () => console.log(`Cover Story running at http://localhost:${port}`));
