# Mela — E-commerce

Production-ready Next.js 15 e-commerce storefront with SEO-optimized product pages, admin panel, MongoDB, Supabase image storage, and Nodemailer order emails.

## Tech Stack

- **Next.js 15** (App Router, Server Components, ISR)
- **TypeScript** + **Tailwind CSS**
- **MongoDB Atlas** + **Mongoose**
- **Supabase** (product image storage)
- **Nodemailer** (order confirmation emails)
- **JWT** + **httpOnly session cookies** (admin auth)
- **localStorage** cart (Zustand persist)

## Getting Started

### 1. Install dependencies

```bash
cd /home/frostbite/Documents/web_projects/mela
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

### 3. MongoDB

Create a cluster on [MongoDB Atlas](https://www.mongodb.com/atlas) and set `MONGODB_URI`.

### 4. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Create a **public** storage bucket (e.g. `product-images`)
3. Set `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`

### 5. Seed admin user

```bash
npm run seed:admin
```

Uses `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` from `.env.local`.

### 6. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin).

## Project Structure

```
src/
├── app/
│   ├── (shop)/          # Storefront (header + footer)
│   │   ├── page.tsx     # Homepage — all products, search, load more
│   │   ├── product/[slug]/
│   │   ├── cart/
│   │   └── checkout/
│   ├── admin/           # Admin panel (JWT protected)
│   ├── api/             # REST API routes
│   ├── sitemap.ts
│   └── robots.ts
├── components/
├── lib/                 # DB, auth, SEO, email, Supabase
├── models/              # Mongoose schemas
└── store/               # Cart (localStorage)
```

## SEO

- No category pages — homepage lists all products
- Each product: `/product/[slug]` with `generateMetadata()`, OpenGraph, Twitter Cards, canonical URLs, JSON-LD Product schema, breadcrumbs
- Dynamic `sitemap.xml` and `robots.txt`
- ISR on product pages (`revalidate: 3600`)

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.example`
4. Deploy

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run seed:admin` | Create initial admin user |

## License

Private — Mela Shop
