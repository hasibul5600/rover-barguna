# বরগুনা পলিটেকনিক ইন্সটিটিউট রোভার স্কাউট গ্রুপ

Official website for the Rover Scout Group of Barguna Polytechnic Institute — public pages in
Bengali, plus a password-protected admin panel for managing all content.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, React 19, TypeScript strict) |
| Styling | Tailwind CSS v4 (`@theme` tokens in `app/globals.css`) |
| Database | MongoDB Atlas via Mongoose |
| Images | Cloudinary (gallery uploads) |
| Hosting | Vercel |

## Project layout

```
app/(public)/        Public pages: home, about, activities, events, notices,
                     gallery, leadership, join, contact
app/admin/           Admin panel (protected by middleware.ts)
app/api/             Public read-only APIs + admin CRUD + auth
components/          ui/ · layout/ · home/ · forms/ · admin/
lib/                 db, auth, validators, api helpers, site config, utils
models/              Mongoose schemas
```

All content lives in one `ContentItem` collection, discriminated by a `collection`
field (`notices`, `events`, `activities`, `members`, `gallery`, `requests`, `messages`).
`lib/publicApi.ts` and `lib/adminApi.ts` hold the shared plumbing so every route
returns the same shape.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

Open http://localhost:3000. The admin panel is at `/admin` and will redirect to
`/admin/login`.

Useful scripts:

```bash
npm run typecheck   # tsc --noEmit
npm run build       # production build
```

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `ADMIN_EMAIL` | yes | Admin login email |
| `ADMIN_PASSWORD` | yes | Admin login password — use a long, unique one |
| `ADMIN_SESSION_SECRET` | yes | Signs the session cookie. **32+ characters.** |
| `MONGODB_URI` | yes | MongoDB Atlas connection string |
| `CLOUDINARY_CLOUD_NAME` | yes | Gallery uploads |
| `CLOUDINARY_API_KEY` | yes | Gallery uploads |
| `CLOUDINARY_API_SECRET` | yes | Gallery uploads |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical origin for OG tags, `sitemap.xml`, `robots.txt`. Falls back to the Vercel deployment URL, then `http://localhost:3000`. |

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`.env.local` is gitignored and must never be committed — it holds live credentials.

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel: **Add New → Project**, import the repo. Next.js is detected
   automatically — no build settings to change.
3. Add every required variable from the table above under
   **Settings → Environment Variables**, for the Production **and** Preview
   environments.
4. Deploy.

### Two things that will otherwise break production

**Use the `mongodb+srv://` connection string on Vercel.**
`.env.local` on the development machine currently uses the direct-host
`mongodb://host1,host2,host3/...` form. That is a **local-only workaround**: this machine's
DNS cannot resolve SRV records, so `mongodb+srv://` fails there with `ECONNREFUSED`.
Vercel resolves SRV fine, so use the normal `mongodb+srv://` string from the Atlas
dashboard — it is also less brittle, since it survives replica-set host changes.

**Allow `0.0.0.0/0` in MongoDB Atlas → Network Access.**
Vercel's serverless functions have dynamic egress IPs, so an IP-pinned allowlist
causes connection timeouts in production. Access is still protected by the
database username and password.

### After the first deploy

- Log in at `/admin` and add real content — the site ships with an empty database and
  every page renders a Bengali empty state until content exists.
- Submit `/robots.txt` and `/sitemap.xml` to
  [Google Search Console](https://search.google.com/search-console) so the site
  becomes findable.
- Once a custom domain is attached, set `NEXT_PUBLIC_SITE_URL` to it and redeploy.
  Nothing else needs to change.

## Custom domain

Add it under **Vercel → Settings → Domains**, point the registrar's nameservers or
`CNAME` at Vercel, then set `NEXT_PUBLIC_SITE_URL=https://your-domain.com` and redeploy.

## Security notes

- `middleware.ts` guards every `/admin/*` route; the admin APIs independently
  return `401` without a valid session, so the panel is not protected by the
  redirect alone.
- `robots.ts` disallows `/admin/` and `/api/` — join requests and contact messages
  contain applicants' phone numbers and emails and must not be indexed.
- `lib/publicApi.ts` filters by publish status; `listAll` and `getAny` are
  admin-only and bypass that filter deliberately.
