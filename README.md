# Facet

**Feature governance for product teams.** Users spend a monthly allowance of funding units to crowdfund feature development — the team votes with their budget, not just their opinions. When a feature reaches its funding goal it becomes committed; admins then move it through development and ship it.

---

## How it works

| Role | What they can do |
|------|-----------------|
| **User** | Submit feature requests, browse open features, contribute funding units to features they want built |
| **Admin** | Approve or reject pending submissions, set funding goals, advance features through the pipeline, manage users and allowances |

**Feature lifecycle:** `Pending` → `Open` → `Committed` → `In Progress` → `Shipped` (or `Rejected` from Pending)

A feature automatically moves from Open to Committed the moment crowdfunding reaches its goal.

---

## Tech stack

- **Framework** — Next.js 16 (App Router, TypeScript)
- **UI** — Tailwind CSS v4, shadcn/ui, Lucide icons
- **Database** — PostgreSQL via Prisma ORM
- **Auth** — Auth.js v5 with JWT sessions (email/password, invite-only)
- **Rich text** — Tiptap editor

---

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (see [Local database setup](#local-database-setup) below)

---

## Installation

### 1. Clone and install

```bash
git clone https://github.com/itsgeagle/facet.git
cd facet
npm install
```

### 2. Set up environment variables

The project uses two env files (see `.env.example` for reference):

**`.env`** — read by Prisma CLI:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/facet
```

**`.env.local`** — read by Next.js at runtime:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/facet

# Auth.js — generate with: openssl rand -base64 32
AUTH_SECRET=your-secret-here
AUTH_URL=http://localhost:3000

# Cron endpoint protection — any long random string
CRON_SECRET=a-long-random-secret-string

# Stripe (required only when store.enabled = true in whitelabel.ts)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Configure your whitelabel

```bash
cp config/whitelabel.example.ts config/whitelabel.ts
```

Edit `config/whitelabel.ts` to set your app name, currency unit, brand icon, and product tags. See [Whitelabeling](#whitelabeling) for the full field reference.

### 4. Push the database schema

```bash
npx prisma db push
```

### 5. Seed the database

```bash
npx prisma db seed
```

This creates the admin and test user accounts defined in your whitelabel config's `seed` fields, plus sample feature requests.

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with the admin credentials from your whitelabel config.

---

## Deploying

### Build

```bash
npm run build
npm run start
```

Or deploy to any platform that supports Node.js — Vercel, Railway, Fly.io, etc. Set the same environment variables from `.env.local` in your platform's dashboard.

### Making a user an admin

There is no public sign-up. The seed script creates the first admin automatically. To promote a user to admin after that, run this SQL against your database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'their@email.com';
```

### Stripe webhooks

The credit store uses a Stripe webhook to credit users after a successful payment.

**Production setup:**

1. Go to [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks) and click **Add endpoint**
2. Set the endpoint URL to `https://your-domain.com/api/stripe/webhook`
3. Under **Select events**, add: `checkout.session.completed`
4. Click **Add endpoint**, then reveal the **Signing secret** — that's your `STRIPE_WEBHOOK_SECRET`

**Local development:**

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli), then run:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

It prints a `whsec_...` secret — use that as `STRIPE_WEBHOOK_SECRET` in `.env.local`. Test a payment flow with:

```bash
stripe trigger checkout.session.completed
```

> The local CLI secret is different from your production dashboard secret — use separate values for each environment.

### Monthly balance reset

User balances reset to their monthly allowance on the first of each month. Call this endpoint from your scheduler:

```
GET /api/cron/reset-balances
Authorization: Bearer <CRON_SECRET>
```

Example Vercel cron config (`vercel.json`):

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

## Whitelabeling

All brand-specific values live in `config/whitelabel.ts`. The file is gitignored — `config/whitelabel.example.ts` is what gets committed to version control.

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
| `seed.*` | `string` | Credentials and company name for the seeded accounts |
| `store.enabled` | `boolean` | Show/hide the Buy Credits button (requires Stripe env vars) |
| `store.packages` | `array` | Credit packages — each has `id`, `label`, `credits`, `priceUsd`, and optional `description` |

### Product tags

Product tags are managed live from the admin panel — no config file or deploy needed. Go to **Admin → Product Tags** to create, rename, recolor, reorder, and deactivate tags at any time.

### Theme colors

Edit the CSS custom properties in `app/globals.css`. No rebuild needed — restart the dev server or redeploy.

---

## Local database setup

Two options — pick whichever suits your setup.

### Docker (recommended)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
docker run --name facet-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=facet \
  -p 5432:5432 \
  -d postgres
```

To stop/start later:
```bash
docker stop facet-postgres
docker start facet-postgres
```

To reset the database entirely:
```bash
docker rm -f facet-postgres
# then re-run the docker run command above
```

### Homebrew (macOS)

```bash
brew install postgresql@16
brew services start postgresql@16
createdb facet
```

To connect and verify:
```bash
psql -d facet
```

To reset the database:
```bash
dropdb facet && createdb facet
```

### Hosted database (Supabase, Railway, etc.)

Set `DATABASE_URL` to your provider's connection string in both `.env` and `.env.local`. If your provider uses connection pooling (e.g. Supabase pgbouncer), use the **direct** connection URL (non-pooler) in `.env` for Prisma CLI operations, and the pooler URL in `.env.local` for runtime.

---

## Troubleshooting

**Can't connect to the database (`P1001`)**
Check that PostgreSQL is running and `DATABASE_URL` in `.env` points to the correct host and port.

**`createdb: error: database "facet" already exists`**
Run `dropdb facet` first, then `createdb facet`.

---

## Credits

Built by **Aaryan Mehta** — [github.com/itsgeagle](https://github.com/itsgeagle)
