# Plesk VPS Deployment Guide

This project can be deployed on a Plesk-managed VPS with Docker containers for:

- `frontend`: Nginx serving the built Vite app
- `backend`: Node.js + Express + Prisma API
- `mysql`: MySQL 8.4 database

## 1. Prerequisites

Make sure your VPS has:

- Plesk with the Docker extension installed
- SSH access to the server
- A domain for the storefront, for example `shop.example.com`
- A subdomain for the API, for example `api.shop.example.com`

## 2. DNS Setup

Create these DNS records and point them to your VPS IP:

- `shop.example.com`
- `api.shop.example.com`

In Plesk, add both the main domain and the API subdomain.

## 3. Upload the Project

Use one of these options:

- Plesk Git extension to pull the repository
- SFTP upload into a domain directory such as `/var/www/vhosts/shop.example.com/httpdocs/app`
- `git clone` over SSH

Example over SSH:

```bash
cd /var/www/vhosts/shop.example.com/httpdocs
git clone <your-repository-url> app
cd app
```

## 4. Production Environment Files

Create or update `backend/.env`:

```env
DATABASE_URL="mysql://bomboclat_user:strong-password@mysql:3306/bomboclat"
PORT=5000
JWT_SECRET="use-a-long-random-secret"
CORS_ORIGIN="https://shop.example.com"
API_BASE_URL="https://api.shop.example.com"
```

Copy the root env template, then update it:

```bash
cp .env.example .env
```

Create or update the root-level `.env` file for Docker Compose:

```env
VITE_API_URL=https://api.shop.example.com/api
```

Notes:

- Use `mysql` as the database host because the backend connects to the MySQL container over the Docker network.
- Keep `backend/.env` out of version control.
- The root `.env` drives the Docker Compose values used during image build and container startup.

## 5. Start the Containers

From the project root:

```bash
docker compose up -d --build
```

This will start:

- MySQL internally on the Docker network
- Backend on host port `5000`
- Frontend on host port `8080`

## 6. Run Prisma Migrations

After the containers are up:

```bash
docker compose exec backend npx prisma migrate deploy
```

Optional seed step:

```bash
docker compose exec backend npm run prisma:seed
```

## 7. Wire Domains in Plesk

You have two clean options.

### Option A: Plesk Reverse Proxy Rules

Recommended for most VPS setups.

1. For `shop.example.com`, open Apache and nginx Settings in Plesk.
2. Add a reverse proxy rule to `http://127.0.0.1:8080`.
3. For `api.shop.example.com`, add a reverse proxy rule to `http://127.0.0.1:5000`.
4. Enable SSL for both domains with Let's Encrypt.

### Option B: Plesk Docker Proxy UI

If you prefer routing directly from the Docker extension.

1. Open the Docker extension in Plesk.
2. Locate the running `frontend` container and expose it through port `8080`.
3. Locate the running `backend` container and expose it through port `5000`.
4. Point the Plesk domains or proxy rules at those container ports.

## 8. Verify the Deployment

Check these URLs:

- `https://shop.example.com`
- `https://api.shop.example.com/api/health`

Expected backend response:

```json
{ "status": "ok" }
```

## 9. Updating the App

When you deploy a new version:

```bash
cd /var/www/vhosts/shop.example.com/httpdocs/app
git pull
docker compose up -d --build
docker compose exec backend npx prisma migrate deploy
```

## 10. Persistent Data

This setup keeps data in:

- MySQL data: Docker volume `mysql_data`
- Uploaded files: `backend/uploads`

Back up both before major upgrades.

## 11. Common Issues

### Frontend calls the wrong API URL

Cause: `VITE_API_URL` was not set before the frontend image was built.

Fix:

```bash
docker compose down
docker compose up -d --build frontend
```

### Backend cannot connect to MySQL

Check that `DATABASE_URL` uses `mysql` as the host, not `localhost`.

### CORS errors in the browser

Check that `CORS_ORIGIN` exactly matches the storefront domain, including `https://`.

### Prisma schema changes are not applied

Run:

```bash
docker compose exec backend npx prisma migrate deploy
```

### Prisma libssl.so.1.1 engine error

Error example:

`Unable to require ... libquery_engine-linux-musl.so.node` with `libssl.so.1.1: No such file or directory`.

Cause:

- Alpine/musl image and Prisma engine/OpenSSL mismatch.

Fix:

- Use the Debian-based backend image (`node:20-bookworm-slim`) in [backend/Dockerfile](backend/Dockerfile).
- Ensure Prisma generator includes OpenSSL 3 target in [backend/prisma/schema.prisma](backend/prisma/schema.prisma): `binaryTargets = ["native", "debian-openssl-3.0.x"]`.
- Rebuild and recreate the backend container:

```bash
docker compose build --no-cache backend
docker compose up -d --force-recreate backend
```

Optional verification:

```bash
docker compose run --rm backend sh -lc "ls -1 /app/node_modules/.prisma/client/libquery_engine*"
```

Expected output includes:

`libquery_engine-debian-openssl-3.0.x.so.node`