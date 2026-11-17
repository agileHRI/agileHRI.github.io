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
3. In the sidebar:
   - **Home page**: each part of the Home is a form section (Header, Cycle,
     Figures, Coming soon, Quote). Lists (steps, figures, cards) can be added,
     removed and reordered.
   - **Menu and footer**: menu links, footer texts, and the **Discord invite
     link** used by every Discord section.
   - **Pages**: every other page (see below).
4. **Save**. Pages CMS commits the change to `main`; the site updates in about
   two minutes (see the **Actions** tab of the repo).

Every save of a published page goes straight to the public site: there is no
preview step yet (see "Open items"). Use **Draft** while a page isn't ready.

**Safety net**: before publishing, GitHub checks every content file (an empty
required field, a value outside its list, a module using a category that
doesn't exist…). If something is wrong, **nothing is published** and the live
site stays as it was: the **Actions** tab shows a red cross and, under
"Check content", which file and field to fix.

### Pages

- **New page**: **Pages → Add**. The **file name is the page's address**:
  `events` creates `content/pages/events.yml`, shown at `/events`. It is
  filled in from the title and can be changed before saving.
- **Sections**: a page is a list of sections, added from a menu, removed and
  reordered:

  | Section | What it is |
  |---|---|
  | Header (teal band) | Small label, large title, text, optional button. A page that starts with it doesn't repeat its title |
  | Text | Optional heading and **rich text** (bold, italic, links, lists, subheadings), saved as Markdown |
  | Cards | Optional heading and white cards; a card with a link is clickable as a whole |
  | Quote (orange box) | A sentence and its source |
  | Image and text | Image from the media library (with its description, required), heading and rich text; image left or right |
  | Discord invitation | Heading, text and the purple button (link from "Menu and footer") |

  **Example of every section** (`ejemplo-secciones`, a draft) shows how each
  one is filled in.
- **Draft**: a ticked page is kept in the repo but **not published**: not
  generated, its text not in the site's files, its address shows "not found".
  The repository is **public**: anyone can read a draft on GitHub. Don't put
  confidential material here, not even as a draft.
- **Menu**: a new page isn't in the menu until it is added in **Menu and
  footer**.

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
| `app/pages/[...slug].vue` | Every other page: reads `content/pages/<route>.yml`, one component per section |
| `app/components/section/` | The section types (Hero, Text, Cards, Quote, ImageText, Discord) |
| `app/app.vue`, `app/components/` | Layout: top bar (`SiteHeader`) and footer (`SiteFooter`), from `content/site.yml` |
| `app/assets/css/main.css` | The whole look (colours, sizes, breakpoints), ported from the WordPress theme |
| `schemas.ts` | The fields of every content file, in one place |
| `scripts/validate-content.ts` | The content check (`npm run validate`): runs before every build and stops the publication if a file is wrong |
| `content.config.ts` | How the site reads the content (uses `schemas.ts`) |
| `.pages.yml` | The editing forms in Pages CMS |
| `.github/workflows/deploy.yml` | Build and publish on every push to `main` |

**Adding or renaming a field**: change it in three places, in the same commit:
the content file (`content/*.yml`), `schemas.ts` and `.pages.yml`; then use it
in the Vue component. Run `npm run validate`.

**A new section type**: four places, in the same commit: its fields in
`schemas.ts` (the `sections` union), its form in `.pages.yml` (under
`blocks`), its component in `app/components/section/`, and its entry in the
`components` map of `app/pages/[...slug].vue`. Add it to the example page.

**Drafts** are handled in two places that must agree: `nuxt.config.ts` (routes
not generated, and skipped when a published page links to them) and
`content.config.ts` (left out of the content, so their text isn't published).
The page template also refuses a draft. Test a change with a draft that a
published page links to.

## Open items

- **Licence**: the repo had the Jekyll template's licence (copyright of its
  author), which was removed; the project's licence is to be decided.
- **Review before publishing**: today every save is public. Options: edit on
  a branch in Pages CMS and merge by pull request, or a hosting with a
  preview per pull request (Netlify, Cloudflare Pages, Vercel).
- **Pages CMS fields**: the forms were written from the Pages CMS docs and
  should be checked the first time someone edits (in particular, that each
  section type shows its label in the "add section" menu).
- **Drafts are readable on GitHub** while the repository is public (GitHub
  Pages on the organisation's free plan needs a public repository).
- **Dependency advisories** (2026-11-17, GitHub Dependabot): `zod` (memory use
  validating oversized data) and `minimatch` (slow crafted glob patterns), both
  pulled in by Nuxt / Nuxt Content and used only at build time on our own
  content; the published site is static files and doesn't run them.
  `npm audit fix` can't update them without going back to Nuxt Content 2;
  update when Nuxt releases fixed versions (`npm update`, then test a build).
