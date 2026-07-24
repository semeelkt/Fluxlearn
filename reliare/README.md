# Reliare — Premium Editorial Knowledge Platform

A publishing platform for articles, research papers, and educational writing, built with Next.js 15,
React 19, TypeScript, Tailwind, MongoDB (via Prisma), and TipTap. Editorial design in the spirit of
JSTOR, Yaqeen Institute, Muslim Skeptic, and The Atlantic — no SaaS-dashboard look, no icon cards.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS + custom editorial design tokens (see `tailwind.config.ts`, `app/globals.css`)
- MongoDB + Prisma ORM (`prisma/schema.prisma`)
- TipTap rich text editor (headings, images, tables, quotes, code, links, Arabic text)
- Single-password admin auth via signed JWT cookie (no user accounts, no public registration)
- Framer Motion for restrained, deliberate motion

## 1. Install

```bash
npm install
```

## 2. Configure environment

Copy the example file and fill in real values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | MongoDB connection string. **Must be a replica set** (Prisma requires this for MongoDB) — MongoDB Atlas free tier already runs as a replica set, so it works out of the box. |
| `ADMIN_PASSWORD` | The single administrator password for `/admin`. Choose something long and random. |
| `ADMIN_SESSION_SECRET` | Random signing secret for the session cookie. Generate one with `openssl rand -base64 32`. |

## 3. Generate the Prisma client and push the schema

```bash
npx prisma generate
npx prisma db push
```

`db push` creates the MongoDB collections that match `prisma/schema.prisma` (Article, Category, Author,
ResearchPaper, MediaItem, Settings, SearchLog).

## 4. (Optional) Seed sample content

```bash
npm run seed
```

This populates categories, authors, articles, and research papers from `lib/mock-data.ts` so the site
isn't empty on first run. Safe to skip if you'd rather start from a blank slate and write everything
through `/admin`.

## 5. Run it

```bash
npm run dev
```

- Public site: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin/login` — sign in with `ADMIN_PASSWORD`

## Project structure

```
app/
  (public pages)          → /, /articles, /articles/[slug], /categories, /categories/[slug],
                            /research, /authors, /authors/[slug], /search, /about, /contact,
                            /privacy, /terms
  admin/
    login/                → password-only sign-in, not behind the admin layout
    (app)/                → route group: everything below gets the sidebar + auth check
      page.tsx            → dashboard
      articles/           → list, /new, /[id] (edit) — all backed by TipTap + Prisma
      categories/         → create/edit/hide/reorder/delete
      research/           → research paper CRUD
      media/              → upload (local /public/uploads by default — swap for S3/R2 in prod)
      authors/            → author CRUD
      analytics/          → views, top articles, top categories, popular searches
      settings/           → site name, tagline, logo, SEO, social links, newsletter copy
api/
  admin/                  → every route here requires the admin session cookie (see middleware.ts)
    login, logout, articles, categories, research, media, authors, analytics, settings
components/
  site/                   → navbar, footer, hero, article-row, popular-sidebar, category-list,
                            research-card, newsletter, reading-progress, share-buttons, TOC
  admin/                  → admin-sidebar, article-form, tiptap-editor
lib/
  prisma.ts               → Prisma client singleton
  auth.ts                 → password verification, session creation/destruction, rate limiting
  mock-data.ts            → sample content used for design preview and for `npm run seed`
  article-content.ts      → sample rich article body (footnotes, references, quotes, Arabic text)
prisma/
  schema.prisma           → MongoDB data model
  seed.ts                 → seed script (npm run seed)
middleware.ts             → protects /admin/* and /api/admin/* except /admin/login and /api/admin/login
```

## Design system

- **Palette**: paper `#FBFAF7` / ink `#191817` / oxblood accent `#6E1F24` / hairline `#DDD8CC` — a
  library-catalog register rather than a SaaS or dark-mode-neon look. Full dark mode variant included.
- **Type**: display serif **Fraunces** for headlines (used with restraint, occasional italic), body
  serif **Source Serif 4** for article copy, utility sans **IBM Plex Sans** for nav/meta/labels.
- **Signature element**: the masthead "issue line" under the nav (`Vol. I — No. 42 · Month Year`),
  echoed as thin hairline rules throughout — a nod to academic journal mastheads instead of numbered
  step markers or icon-in-a-box cards.
- Categories are rendered as plain typographic rows with article counts, not icon tiles.
- Article typography (`.article-body` in `globals.css`) supports headings, block quotes, footnotes,
  tables, code blocks, inline Arabic (`dir="rtl"`, Naskh-style serif, larger line-height).

## Admin panel notes

- **No public registration or user login** — a single administrator, gated by one password stored in
  `ADMIN_PASSWORD`. The session is a signed JWT in an httpOnly cookie (`lib/auth.ts`), verified on every
  request to `/admin/*` and `/api/admin/*` by `middleware.ts`.
- Login attempts are rate-limited (5 per 5 minutes per IP, in-memory — swap for Redis if you run
  multiple server instances).
- Article actions: create, edit (TipTap), delete, save as draft, publish, duplicate, archive, and
  preview (opens the live article in a new tab). Scheduling is modeled in the schema
  (`status: SCHEDULED`, `scheduledFor`) — wire a cron job or a Vercel Cron function to flip scheduled
  articles to `PUBLISHED` when their time arrives.
- Media library uploads go to `public/uploads/<folder>/` by default. For production, swap the upload
  handler in `app/api/admin/media/route.ts` for S3, Cloudflare R2, or Vercel Blob — the local filesystem
  approach won't persist across deployments on most serverless hosts.

## Security

- CSRF: cookies are set with `sameSite: "lax"`, and all mutating admin routes require the session
  cookie, which isn't readable cross-origin.
- Rate limiting on the login route (see above).
- Input validation on every API route via `zod`.
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`) set in `next.config.mjs`.
- Constant-time-ish password comparison in `lib/auth.ts` to reduce timing side-channels.

## Known limitations / next steps

- The public-facing pages currently render from `lib/mock-data.ts` rather than querying MongoDB
  directly, so the design can be reviewed without a database connection. Swap the `import` in
  `app/page.tsx`, `app/articles/page.tsx`, etc. for `prisma.article.findMany({ where: { status:
  "PUBLISHED" } , ... })` once you've seeded real content — the admin panel is already fully wired to
  Prisma, so this is a small, mechanical change per page.
- Search is currently client-side over the same mock array; for a production dataset, add a
  `/api/search` route that queries Prisma (and logs to `SearchLog` for the "Popular Searches" analytics
  panel, which is already wired to read from it).
- Article scheduling needs a cron trigger (see above) to actually flip status at the scheduled time.
- View counts increment nowhere yet — add a `prisma.article.update({ data: { views: { increment: 1 } } })`
  call in the article page's data-fetching path once it reads from Prisma instead of mock data.
