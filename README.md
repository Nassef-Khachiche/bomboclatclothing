# Bomboclat Clothing

Modern full-stack clothing e-commerce platform with a minimalist luxury storefront and a protected admin dashboard.

## Tech Stack

- Frontend: React + Vite + TailwindCSS + Zustand + Lucide
- Backend: Node.js + Express + Prisma ORM + MySQL
- Auth: JWT (admin protected routes)
- API: REST
- Uploads: Local storage via Multer

## Project Structure

- `frontend/` React storefront + admin UI
- `backend/` Express API + Prisma schema + seed + migrations
- `docker-compose.yml` MySQL + app services

## Features

- Premium responsive storefront UI (mobile-first)
- Flash sale banner, centered brand logo, cart/search/filter/hamburger UX
- Cookie consent popup (Accept / Decline / Manage)
- Home, New, Products, Product Details, Outfits, Limited, Track Order, Checkout
- Product details with:
  - Multiple images
  - Size and color selection
  - Complete the Look
  - Buy Complete Outfit
- Fully working cart drawer:
  - Add/remove items
  - Update quantity
  - Subtotal, taxes, shipping, total
- Checkout flow with order creation and unique order number
- Order tracking by order number + email with timeline statuses
- Admin dashboard:
  - Admin login
  - Product create/delete
  - Order status updates
  - Dashboard totals, customers, collections, inventory snapshots
- Prisma schema with all requested core entities
- Seed data:
  - 30+ products
  - 10 outfits
  - 5 limited products
  - 10 orders

## Quick Start (Local)

1. Install dependencies:

```bash
npm install
npm install -w frontend
npm install -w backend
```

2. Configure env files:

- Copy `backend/.env.example` to `backend/.env`
- Copy `frontend/.env.example` to `frontend/.env`

3. Start MySQL (choose one):

- Local MySQL instance
- Or Docker:

```bash
docker compose up -d mysql
```

4. Run Prisma migrations + seed:

```bash
cd backend
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

5. Run both apps:

```bash
cd ..
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Admin Login (Seed)

- Email: `admin@bomboclat.com`
- Password: `admin12345`

## API Endpoints

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

### Outfits

- `GET /api/outfits`
- `GET /api/outfits/:id`
- `POST /api/outfits` (admin)
- `PUT /api/outfits/:id` (admin)
- `DELETE /api/outfits/:id` (admin)

### Cart

- `GET /api/cart?sessionId=...`
- `POST /api/cart`
- `PUT /api/cart/item/:itemId`
- `DELETE /api/cart/item/:itemId`
- `DELETE /api/cart/clear/:sessionId`

### Orders / Checkout

- `POST /api/orders/checkout`
- `GET /api/orders/:orderNumber`
- `PUT /api/orders/:orderNumber/status` (admin)

### Track Order

- `GET /api/track/:orderNumber?email=...`

### Search

- `GET /api/search?q=...`

### Auth

- `POST /api/auth/admin/login`

## Security Implemented

- Helmet
- Rate limiting
- Password hashing (bcrypt)
- JWT admin auth
- Protected admin routes
- Input validation with Zod

## Docker (Optional)

```bash
docker compose up --build
```

Then run Prisma commands inside backend container or locally.

## Notes

- Image uploads are stored locally in `backend/uploads`.
- SEO basics can be extended with route-level metadata and Open Graph tags.
- Current admin panel focuses on core management workflows and can be extended with richer edit modals and analytics.
