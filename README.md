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
- A PostgreSQL database

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
# Database — use the direct connection URL (not the pooler) for Prisma
DATABASE_URL=postgresql://postgres:your-password@db.your-project.example.com:5432/postgres?sslmode=require

# Auth.js — generate with: openssl rand -base64 32
AUTH_SECRET=your-secret-here
AUTH_URL=https://your-domain.com

# Cron endpoint protection
CRON_SECRET=a-long-random-secret-string
```

> If your database password contains special characters like `@`, URL-encode them (`@` → `%40`) before putting them in `DATABASE_URL`.

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
| `productTags` | `Record<string, { label, color }>` | Product taxonomy — keys are stored in the DB, labels and Tailwind colors are display-only |
| `seed.*` | `string` | Credentials and company name for the seeded accounts |

### Customising product tags

```ts
productTags: {
  BACKEND:  { label: "Backend",  color: "bg-blue-600 text-blue-100"     },
  FRONTEND: { label: "Frontend", color: "bg-violet-600 text-violet-100" },
  MOBILE:   { label: "Mobile",   color: "bg-orange-600 text-orange-100" },
},
```

Tag keys are stored in the database — keep them stable. Labels and colors can change freely at any time. After adding or renaming keys, run `npx prisma db push`.

### Theme colors

Edit the CSS custom properties in `app/globals.css`. No rebuild needed — restart the dev server or redeploy.

---

## Troubleshooting

**Can't connect to the database (`P1001`)**
Make sure `DATABASE_URL` uses the direct connection URL (port `5432`, not the pooler) and ends with `?sslmode=require`.

**Product tag added to config but not showing in the dropdown**
The dropdown is driven entirely by `config/whitelabel.ts` — restart the dev server. If you also renamed an existing key, update any rows in the database that still have the old value.

---

## Credits

Built by **Aaryan Mehta** — [github.com/itsgeagle](https://github.com/itsgeagle)
