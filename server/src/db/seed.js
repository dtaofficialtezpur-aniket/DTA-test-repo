require('dotenv').config();
const db = require('./index');

const profile = {
  id: 1,
  name: 'Spring Valley',
  name_local: 'স্প্রিং ভ্যালী',
  cuisine: 'Assamese',
  category: 'Assamese restaurant',
  address: 'JQFX+V95, NC Rd, Mahabhairab, Tezpur, Assam 784001',
  phone: '03712 220 643',
  website: 'lahkar.com',
  price_range: '₹1–200',
  rating: 4.0,
  rating_count: 1922,
  service_options: JSON.stringify(['Order online', 'Dine-in', 'Takeaway', 'Delivery']),
  opening_hours: JSON.stringify({
    monday: '09:00-21:00',
    tuesday: '09:00-21:00',
    wednesday: '09:00-21:00',
    thursday: '09:00-21:00',
    friday: '09:00-21:00',
    saturday: '09:00-21:00',
    sunday: '09:00-21:00',
  }),
  latitude: 26.624646,
  longitude: 92.7984868,
  notes: 'Seeded from Google Maps listing on 2026-09-01. Hours are an approximation (closes 9 pm) — verify and update exact opening times per day in Settings.',
};

const upsertProfile = db.prepare(`
  INSERT INTO restaurant_profile (
    id, name, name_local, cuisine, category, address, phone, website,
    price_range, rating, rating_count, service_options, opening_hours,
    latitude, longitude, notes
  ) VALUES (
    @id, @name, @name_local, @cuisine, @category, @address, @phone, @website,
    @price_range, @rating, @rating_count, @service_options, @opening_hours,
    @latitude, @longitude, @notes
  )
  ON CONFLICT(id) DO UPDATE SET
    name=excluded.name, name_local=excluded.name_local, cuisine=excluded.cuisine,
    category=excluded.category, address=excluded.address, phone=excluded.phone,
    website=excluded.website, price_range=excluded.price_range, rating=excluded.rating,
    rating_count=excluded.rating_count, service_options=excluded.service_options,
    opening_hours=excluded.opening_hours, latitude=excluded.latitude,
    longitude=excluded.longitude, notes=excluded.notes, updated_at=datetime('now')
`);
upsertProfile.run(profile);

const categories = ['Starters', 'Assamese Thali', 'Rice & Curry', 'Beverages', 'Desserts'];
const insertCategory = db.prepare(
  'INSERT OR IGNORE INTO menu_categories (name, sort_order) VALUES (?, ?)'
);
categories.forEach((name, i) => insertCategory.run(name, i));

const categoryRows = db.prepare('SELECT id, name FROM menu_categories').all();
const catId = (name) => categoryRows.find((c) => c.name === name)?.id;

const items = [
  ['Starters', 'Veg Pakora', 'Assorted vegetable fritters', 80, 1],
  ['Starters', 'Chicken Pakora', 'Spiced fried chicken bites', 130, 0],
  ['Assamese Thali', 'Assamese Veg Thali', 'Rice, dal, seasonal vegetables, pickle', 150, 1],
  ['Assamese Thali', 'Assamese Fish Thali', 'Rice, dal, fish curry, pickle', 190, 0],
  ['Rice & Curry', 'Duck Curry with Rice', 'Traditional duck curry, steamed rice', 180, 0],
  ['Rice & Curry', 'Egg Curry with Rice', 'Egg curry, steamed rice', 110, 0],
  ['Beverages', 'Red Tea (Xah)', 'Traditional Assamese red tea', 20, 1],
  ['Beverages', 'Lemon Soda', 'Fresh lemon soda', 40, 1],
  ['Desserts', 'Payas', 'Assamese rice pudding', 60, 1],
];
const insertItem = db.prepare(`
  INSERT INTO menu_items (category_id, name, description, price, is_veg)
  VALUES (@category_id, @name, @description, @price, @is_veg)
`);
const itemExists = db.prepare('SELECT 1 FROM menu_items WHERE name = ?');
items.forEach(([cat, name, description, price, is_veg]) => {
  if (!itemExists.get(name)) {
    insertItem.run({ category_id: catId(cat), name, description, price, is_veg });
  }
});

console.log('Seed complete: restaurant profile, menu categories and items created.');
