// Makes a clickable preview copy of dist/ that works from any folder (relative
// links, no order posting, no outside scripts). Used to share the shop before
// it has a real web address. Run `npm run build` first, then `npm run preview`.
import { readFile, writeFile, rm, cp, readdir } from 'node:fs/promises';

const root = new URL('..', import.meta.url);
const dist = new URL('dist/', root);
const out = new URL('preview/', root);
await rm(out, { recursive: true, force: true });
await cp(dist, out, { recursive: true });

async function* htmlFiles(dir, rel = '') {
  for (const e of await readdir(new URL(rel, dir), { withFileTypes: true })) {
    if (e.isDirectory()) yield* htmlFiles(dir, rel + e.name + '/');
    else if (e.name.endsWith('.html')) yield rel + e.name;
  }
}

for await (const file of htmlFiles(out)) {
  const up = '../'.repeat(file.split('/').length - 1);
  let html = await readFile(new URL(file, out), 'utf8');
  html = html.replace(/(href|src|data-src|action)="\/([^"]*)"/g, (_, attr, path) => {
    const [p, q = ''] = path.split(/(?=[?#])/);
    const target = p === '' || p.endsWith('/') ? `${p}index.html` : p;
    return `${attr}="${up}${target}${q}"`;
  });
  html = html.replace(/<script async defer src="https:\/\/assets\.pinterest\.com[^>]*><\/script>/, '');
  html = html.replace('</body>', '<script>window.PREVIEW = true</script>\n</body>');
  await writeFile(new URL(file, out), html);
}
console.log('Preview ready in preview/');
