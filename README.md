# Spring Valley CRM

A CRM for **Spring Valley** (স্প্রিং ভ্যালী), an Assamese restaurant in Tezpur, Assam.
This is the first, basic version — customers, menu, orders, reservations, and a
dashboard — built to be extended step by step.

## Structure

- `server/` — Express + **PostgreSQL** REST API
- `client/` — React (Vite) frontend (uses the same API)
- `single-file/spring-valley-crm.html` — a standalone, no-install, no-database
  version of the same CRM. It stores data in the browser's local storage and
  lets you **download the current data as a PDF** any time — no server, no
  signup, works fully offline. It is independent of `server/`/`client/`.

## Restaurant details (seeded from the Google Maps listing)

- Address: JQFX+V95, NC Rd, Mahabhairab, Tezpur, Assam 784001
- Phone: 03712 220 643
- Website: lahkar.com
- Price range: ₹1–200 per person
- Rating: 4.0 (1,922 reviews)
- Service options: Order online, Dine-in, Takeaway, Delivery

Opening hours were seeded as an approximation ("Open, closes 9 pm" was all that
was visible) — update the exact per-day hours in the app's **Restaurant Profile**
page once confirmed.

## Getting started

### 1. Database

You need a PostgreSQL database. Either:

- **Local**: install PostgreSQL and create a database, e.g.
  ```bash
  createuser springvalley -P    # set a password when prompted
  createdb springvalley -O springvalley
  ```
- **Hosted (free)**: create a project on [Neon](https://neon.tech) or
  [Supabase](https://supabase.com) and copy the connection string they give you.

### 2. Backend

```bash
cd server
npm install
cp .env.example .env   # then edit .env and set DATABASE_URL to your connection string
npm run seed            # creates the tables and loads the restaurant profile + sample menu
npm run dev              # http://localhost:4000
```

For a **local** Postgres with no SSL, also set `DATABASE_SSL=false` in `.env`.
Hosted providers (Neon, Supabase, Render Postgres, ...) need `DATABASE_SSL=true`
(the default).

### 3. Frontend (React app)

```bash
cd client
npm install
npm run dev    # http://localhost:5173 (proxies /api to the backend)
```

Open http://localhost:5173.

### 3b. Or: the single HTML file (no database, no setup)

Open `single-file/spring-valley-crm.html` directly in a browser (double-click
it) — nothing to install, no backend or database needed. Data is kept in that
browser's local storage. Whenever you add/edit a customer, order, menu item,
reservation, or the restaurant profile, the **Download CRM Data (PDF)** button
at the top updates — click it any time to download a PDF snapshot of
everything (profile, customers, menu, orders, reservations) to store wherever
you like.

Trade-off: since there's no shared database, this version's data lives only in
that one browser/device and isn't synced with the `server`/`client` version.

## Features in this first version

- **Dashboard** — today's orders/revenue, totals, top-selling items, recent orders
- **Customers** — add, search, delete; tracks visit count and total spend automatically
- **Menu** — categories and items, price, veg/non-veg, availability toggle
- **Orders** — build an order from the menu, dine-in/takeaway/delivery, status tracking
- **Reservations** — book a table, track status (confirmed/seated/completed/no-show)
- **Restaurant Profile** — edit the business details and opening hours used across the app

## Data

- **React app (`client/` + `server/`)**: data lives in the PostgreSQL database
  configured via `DATABASE_URL`. To reset to a clean state, drop and recreate
  the database and re-run `npm run seed`.
- **Single HTML file**: data lives in that browser's local storage. Use the
  **Download CRM Data (PDF)** button to keep a portable copy; clearing the
  browser's site data resets it.

## Deploying so it's reachable from any browser

1. Host the database (e.g. a free [Neon](https://neon.tech) project).
2. Deploy `server/` as a web service (e.g. [Render](https://render.com) — build
   command `npm install`, start command `npm run seed && npm start`, with
   `DATABASE_URL` and `DATABASE_SSL=true` set as environment variables).
3. Either deploy `client/` as a static site pointed at that API, or just open
   `single-file/spring-valley-crm.html` and paste in the deployed API URL.

## Roadmap ideas (not built yet)

- Authentication / staff roles
- Printable/exportable bills and receipts
- WhatsApp/SMS notifications for reservations and order status
- Reporting (daily/weekly sales, customer retention)
- Inventory tracking
