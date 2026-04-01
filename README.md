# Facet

**Feature governance for product teams.** Users spend a monthly allowance of funding units to crowdfund feature development — the team votes with their budget, not just their opinions. When a feature reaches its funding goal it becomes committed; admins then move it through development and ship it.

Fully white-labelable: swap the app name, currency name, brand icon, and product taxonomy by editing a single config file.

---

## How it works

| Role | What they can do |
|------|-----------------|
| **User** | Submit feature requests, browse open features, contribute funding units to features they want built |
| **Admin** | Approve or reject pending submissions (with optional rejection reason), set funding goals, advance features through the pipeline, manage users and allowances |

**Feature lifecycle:** `Pending` → `Open` → `Committed` → `In Progress` → `Shipped` (or `Rejected` from Pending)

A feature automatically moves from Open to Committed the moment crowdfunding reaches its goal — no admin action needed.

---

## Tech stack

- **Framework** — Next.js 16 (App Router, TypeScript strict)
- **UI** — Tailwind CSS v4, shadcn/ui (base-nova), Lucide icons
- **Database** — PostgreSQL via Prisma ORM
- **Auth** — Supabase Auth (email/password, invite-only — no public sign-up)
- **Rich text** — Tiptap editor
- **Validation** — Zod v4

---

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- A PostgreSQL database (Supabase provides one)

---

## Installation

### 1. Clone and install

```bash
git clone https://github.com/itsgeagle/facet.git
cd facet
npm install
```

### 2. Set up environment variables

Create `.env.local` in the project root:

```env
# Supabase — found in your project's API settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database — use the direct connection URL (not the pooler) for Prisma
DATABASE_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres?sslmode=require

# Cron endpoint protection
CRON_SECRET=a-long-random-secret-string
```

> **Tip:** If your database password contains `@`, URL-encode it as `%40`. Other special characters should be encoded similarly.

### 3. Configure your whitelabel

```bash
cp config/whitelabel.example.ts config/whitelabel.ts
```

Edit `config/whitelabel.ts` to set your app name, currency unit name, brand icon, and product tags. See the [Whitelabeling](#whitelabeling) section for the full field reference.

### 4. Push the database schema

```bash
npx prisma db push
```

### 5. Seed the database

```bash
npx prisma db seed
```

This creates the admin and test user accounts defined in your whitelabel config's `seed` fields, plus six sample feature requests.

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to the login page — sign in with the admin credentials from your whitelabel config.

---

## Whitelabeling

All brand-specific values live in a single file: `config/whitelabel.ts`. Copy the example, edit it, and the entire app updates on the next build or dev restart. The file is gitignored so private deployments don't accidentally commit credentials or brand config.

```bash
cp config/whitelabel.example.ts config/whitelabel.ts
```

### Config reference

| Field | Type | Description |
|-------|------|-------------|
| `brand.name` | `string` | App name in the navbar, login page, and browser tab |
| `brand.tagline` | `string` | Short tagline shown beneath the app name on login |
| `brand.icon` | `LucideIcon` | Logo icon — import any icon from `lucide-react` |
| `meta.title` | `string` | Full browser tab title |
| `meta.description` | `string` | Meta description for search engines and link previews |
| `company.domain` | `string` | Domain used for email placeholders (e.g. `"acme.com"`) |
| `currency.singular` | `string` | Funding unit name, singular (e.g. `"Credit"`) |
| `currency.plural` | `string` | Funding unit name, plural (e.g. `"Credits"`) |
| `productTags` | `Record<string, { label, color }>` | Product taxonomy — keys are stored in the DB, labels and Tailwind colors are display-only |
| `seed.adminEmail` | `string` | Admin account email for seeding |
| `seed.adminPassword` | `string` | Admin account password for seeding |
| `seed.userEmail` | `string` | Test user email for seeding |
| `seed.userPassword` | `string` | Test user password for seeding |
| `seed.userCompany` | `string` | Company name shown for the test user |

### Customising product tags

Product tags are plain strings stored in the database — define as many as you need:

```ts
productTags: {
  BACKEND:   { label: "Backend",   color: "bg-blue-600 text-blue-100"   },
  FRONTEND:  { label: "Frontend",  color: "bg-violet-600 text-violet-100" },
  MOBILE:    { label: "Mobile",    color: "bg-orange-600 text-orange-100" },
  DATA:      { label: "Data",      color: "bg-emerald-600 text-emerald-100" },
},
```

After changing tag **keys**, run `npx prisma db push` to sync the schema, then reseed or update existing records.

### Theme colours

Colours are CSS custom properties in `app/globals.css` using the oklch colour space. Edit them directly — no config file or rebuild needed beyond a dev server restart.

---

## Monthly balance reset

User balances reset to their monthly allowance on the first of each month. Wire this up by calling the cron endpoint from your scheduler (Vercel Cron, GitHub Actions, etc.):

```
GET /api/cron/reset-balances
Authorization: Bearer <CRON_SECRET>
```

Example Vercel cron config in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/reset-balances",
      "schedule": "0 0 1 * *"
    }
  ]
}
```

---

## Creating users

There is no public sign-up. Admins create accounts from the **User Management** tab in the admin panel — this provisions both a Supabase auth account and a database record in one step. Users receive a temporary password and should be prompted to change it on first login.

You can also send a password reset email at any time from the user management table.

---

## Troubleshooting

### `P1001` — Can't reach the database

Supabase requires SSL. Make sure your `DATABASE_URL` ends with `?sslmode=require`. Also use the **direct connection** URL (port `5432`), not the pooler URL, for Prisma CLI commands.

### `@` or special characters in the database password

URL-encode them before putting them in `DATABASE_URL`:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `!` | `%21` |
| `#` | `%23` |
| `$` | `%24` |

### Prisma client not found after schema changes

The generated client lives at `app/generated/prisma` (gitignored). Regenerate it:

```bash
npx prisma generate
```

### Product tag added to config but not appearing in the dropdown

The dropdown is driven entirely by `config/whitelabel.ts` — no schema change needed to add a tag. If you also changed a tag **key** that already has data, run `npx prisma db push` and update any existing rows manually (or reseed).

### Tiptap editor not loading

The editor is lazy-loaded with `next/dynamic` and `ssr: false` to avoid server-side module errors with Turbopack. If it fails to load, check the browser console for import errors and ensure `@tiptap/starter-kit` is installed.

### `gpg: signing failed` on commit

```bash
git -c commit.gpgsign=false commit -m "your message"
```

Or disable GPG signing globally for this repo:

```bash
git config commit.gpgsign false
```

---

## Credits

Built by **Aaryan Mehta** — [github.com/itsgeagle](https://github.com/itsgeagle)
