// Tiny local server for dist/ (run `npm run build` first). Accepts the order
// form POST so the maker can be tested end to end without Netlify.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, normalize } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml', '.csv': 'text/csv', '.txt': 'text/plain' };
const port = +process.env.PORT || 8080;

createServer(async (req, res) => {
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
