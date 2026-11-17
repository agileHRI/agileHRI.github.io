# agilehri.github.io

The AgileHRI website (ARISE WP7, Horizon Europe GA 101135784) as a static
site: **Nuxt** + **Nuxt Content**, edited with **Pages CMS**, published on
**GitHub Pages** at https://agilehri.github.io.

It is a trial of a WordPress-free setup: it reproduces the Home page of
agilehri.org (WordPress, repo `agileHRI/agilehri-site`) so the team can
compare the editing experience.

## How it works

```
content/home.yml, content/site.yml   the texts (YAML), edited in Pages CMS
public/images/                       images uploaded from Pages CMS
app/                                 the design: Vue components + CSS
        │  every push to main
        ▼
GitHub Actions (.github/workflows/deploy.yml): npm ci → nuxt generate
        │
        ▼
GitHub Pages: https://agilehri.github.io
```

Content and design are separate: editors change `content/` (through forms),
developers change `app/`. Everything lives in git, so there is a single
source of truth, full history, and any change can be undone with a revert.

| Role | Does | Where |
|---|---|---|
| **Content editor** | Changes texts, links, figures, images | https://app.pagescms.org → sign in with GitHub → this repo |
| **Maintainer** | Changes the design, adds sections or fields | This repo (`app/`, `content.config.ts`, `.pages.yml`) |

## Editing content (content editor)

1. Go to https://app.pagescms.org and **sign in with GitHub** (you need write
   access to this repo).
2. Open **agileHRI/agileHRI.github.io**.
3. In the sidebar: **Home page** or **Menu and footer**. Each part of the page
   is a form section (Header, Cycle, Figures, Coming soon, Quote). Lists
   (steps, figures, cards, menu links) can be added, removed and reordered.
4. **Save**. Pages CMS commits the change to `main`; the site updates in about
   two minutes (see the **Actions** tab of the repo).

Every save goes straight to the public site: there is no staging step yet
(see "Open items").

## Working on the design (maintainer)

Needs Node.js **22.5 or newer** (Nuxt Content uses Node's built-in SQLite).
Without it locally, use Docker:

```bash
npm install          # or: docker run --rm -it -v "$PWD":/app -w /app -p 3000:3000 node:22 npm install
npm run dev          # http://localhost:3000, reloads on every change
npm run generate     # the static site in .output/public (what GitHub Pages serves)
```

| Path | What |
|---|---|
| `app/pages/index.vue` | The Home page: reads `content/home.yml` |
| `app/app.vue`, `app/components/` | Layout: top bar (`SiteHeader`) and footer (`SiteFooter`), from `content/site.yml` |
| `app/assets/css/main.css` | The whole look (colours, sizes, breakpoints), ported from the WordPress theme |
| `content.config.ts` | The fields each content file must have (checked at build time) |
| `.pages.yml` | The editing forms in Pages CMS |
| `.github/workflows/deploy.yml` | Build and publish on every push to `main` |

**Adding or renaming a field**: change it in three places, in the same commit:
the content file (`content/*.yml`), `content.config.ts` and `.pages.yml`; then
use it in the Vue component.

**A new page**: add `app/pages/<name>.vue`, its content file and collection,
and its form in `.pages.yml`.

## Open items

- **Licence**: the repo had the Jekyll template's licence (copyright of its
  author), which was removed; the project's licence is to be decided.
- **Review before publishing**: today every save is public. Options: edit on
  a branch in Pages CMS and merge by pull request, or a hosting with a
  preview per pull request (Netlify, Cloudflare Pages, Vercel).
- **Pages CMS fields**: the forms were written from the Pages CMS docs and
  should be checked the first time someone edits.
