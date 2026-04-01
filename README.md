This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Whitelabeling

Facet is designed to be fully white-labeled. A single config file controls every brand-specific string, icon, color, and product taxonomy — no source code changes required.

### Setup

1. Copy the example config:
   ```bash
   cp config/whitelabel.example.ts config/whitelabel.ts
   ```
2. Edit `config/whitelabel.ts` to match your brand.
3. Restart the dev server or rebuild — the app reflects your config immediately.

`config/whitelabel.ts` is listed in `.gitignore` so private deployments don't accidentally commit their brand config. The example file (`config/whitelabel.example.ts`) is what gets committed to version control.

### Config Fields

| Field | Type | Description |
|-------|------|-------------|
| `brand.name` | `string` | App name shown in the navbar, login page, and browser tab |
| `brand.tagline` | `string` | Short tagline shown on the login screen |
| `brand.icon` | `LucideIcon` | Icon component rendered as the brand logo (import any Lucide icon) |
| `meta.title` | `string` | Full browser tab title |
| `meta.description` | `string` | Meta description for search engines and link previews |
| `company.domain` | `string` | Domain used for placeholder email addresses (e.g. `"acme.com"`) |
| `currency.singular` | `string` | Singular unit name (e.g. `"Credit"`) |
| `currency.plural` | `string` | Plural unit name (e.g. `"Credits"`) |
| `productTags` | `Record<string, { label, color }>` | Product taxonomy — define as many tags as you need. Keys are stored in the database; labels and Tailwind color classes are display-only |
| `seed.adminEmail` | `string` | Email for the seeded admin account |
| `seed.adminPassword` | `string` | Password for the seeded admin account |
| `seed.userEmail` | `string` | Email for the seeded regular user account |
| `seed.userPassword` | `string` | Password for the seeded regular user account |
| `seed.userCompany` | `string` | Company name shown for the seeded regular user |

### Changing Product Tags

Product tags are fully configurable — add, rename, or remove them freely:

```ts
productTags: {
  BACKEND: { label: "Backend", color: "bg-blue-600 text-blue-100" },
  FRONTEND: { label: "Frontend", color: "bg-violet-600 text-violet-100" },
  MOBILE: { label: "Mobile", color: "bg-orange-600 text-orange-100" },
},
```

After changing tag keys, run `npx prisma db push` to ensure the schema is in sync, then re-seed if needed.

### Theme Colors

Colors are defined as CSS custom properties in `app/globals.css` using the oklch color space. Edit those variables directly to change the visual theme — no rebuild step required beyond a dev server restart.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
