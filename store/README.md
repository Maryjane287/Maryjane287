# Cover Story

Personalised keepsake magazines, sold worldwide and built for Pinterest. Someone picks a magazine, answers a few fun questions, adds photos and watches the cover come alive. They order an instant PDF or a printed copy.

The full business plan lives in the project files (`plans/store-website-plan.md`).

## Run it

```
cd store
npm run build      # builds the site into dist/ (no installs needed)
npm run serve      # http://localhost:8080
```

After changing covers, colours or examples, regenerate the Pinterest images (needs Chromium):

```
npm install
npm run pins       # writes 1000 x 1500 images into pins/
```

## What is where

| Path | What it is |
|---|---|
| `data/site.json` | Shop name, web address, email, company details, prices, checkout links, Pinterest IDs |
| `data/magazines.json` | The four magazines: questions, examples, keywords, what's inside |
| `ideas/` | Blog posts for Pinterest traffic (plain HTML with a small header) |
| `src/covers.js` | Draws every cover and inside page. Used by the build and by the maker in the browser |
| `src/build.mjs` | Builds every page, the sitemap and the Pinterest catalog feed |
| `assets/maker.js` | The magazine maker: live preview, photo shrinking, order form |
| `pins/` | Pinterest images, one per example cover |

## Pinterest features

- 16 tall 2:3 Pin images with keyword titles
- Rich pin tags (Open Graph product price and availability) and schema.org Product data on every magazine page
- Pinterest Save button on hover over every Pin image, with ready written descriptions
- Product catalog feed at `/feed/pinterest-catalog.csv` (one row per magazine and edition)
- Domain verification and the Pinterest tag switch on by filling `pinterestDomainVerify` and `pinterestTagId` in `site.json` (the tag waits for cookie consent)

## Before going live

1. Set the real domain and email in `data/site.json`.
2. Deploy on Netlify (the root `netlify.toml` is ready). Orders arrive in Netlify Forms, photos included.
3. Create checkout links (Lemon Squeezy for PDFs, Stripe for printed copies) and paste them into `checkout` in `site.json`. Until then, orders are collected and a payment link is emailed by hand.
4. Claim the domain in a Pinterest business account and upload the catalog feed.
