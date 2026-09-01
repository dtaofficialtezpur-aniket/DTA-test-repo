# Spring Valley CRM

A CRM for **Spring Valley** (স্প্রিং ভ্যালী), an Assamese restaurant in Tezpur, Assam.
This is the first, basic version — customers, menu, orders, reservations, and a
dashboard — built to be extended step by step.

## Structure

- `server/` — Express + SQLite REST API
- `client/` — React (Vite) frontend

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

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
npm run seed   # creates the DB and loads the restaurant profile + sample menu
npm run dev    # http://localhost:4000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev    # http://localhost:5173 (proxies /api to the backend)
```

Open http://localhost:5173.

## Features in this first version

- **Dashboard** — today's orders/revenue, totals, top-selling items, recent orders
- **Customers** — add, search, delete; tracks visit count and total spend automatically
- **Menu** — categories and items, price, veg/non-veg, availability toggle
- **Orders** — build an order from the menu, dine-in/takeaway/delivery, status tracking
- **Reservations** — book a table, track status (confirmed/seated/completed/no-show)
- **Restaurant Profile** — edit the business details and opening hours used across the app

## Data

SQLite database file lives at `server/data/spring-valley.db` (git-ignored). Delete it
and re-run `npm run seed` to reset to a clean state.

## Roadmap ideas (not built yet)

- Authentication / staff roles
- Printable/exportable bills and receipts
- WhatsApp/SMS notifications for reservations and order status
- Reporting (daily/weekly sales, customer retention)
- Inventory tracking
