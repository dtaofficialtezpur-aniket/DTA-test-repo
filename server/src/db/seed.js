require('dotenv').config();
const { pool, init } = require('./index');

const profile = {
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
  notes: 'Seeded from Google Maps listing. Hours are an approximation (closes 9 pm) — verify and update exact opening times per day in Settings.',
};

const categories = ['Starters', 'Assamese Thali', 'Rice & Curry', 'Beverages', 'Desserts'];

const items = [
  ['Starters', 'Veg Pakora', 'Assorted vegetable fritters', 80, true],
  ['Starters', 'Chicken Pakora', 'Spiced fried chicken bites', 130, false],
  ['Assamese Thali', 'Assamese Veg Thali', 'Rice, dal, seasonal vegetables, pickle', 150, true],
  ['Assamese Thali', 'Assamese Fish Thali', 'Rice, dal, fish curry, pickle', 190, false],
  ['Rice & Curry', 'Duck Curry with Rice', 'Traditional duck curry, steamed rice', 180, false],
  ['Rice & Curry', 'Egg Curry with Rice', 'Egg curry, steamed rice', 110, false],
  ['Beverages', 'Red Tea (Xah)', 'Traditional Assamese red tea', 20, true],
  ['Beverages', 'Lemon Soda', 'Fresh lemon soda', 40, true],
  ['Desserts', 'Payas', 'Assamese rice pudding', 60, true],
];

async function seed() {
  await init();

  await pool.query(
    `INSERT INTO restaurant_profile (
      id, name, name_local, cuisine, category, address, phone, website,
      price_range, rating, rating_count, service_options, opening_hours,
      latitude, longitude, notes
    ) VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name, name_local = EXCLUDED.name_local, cuisine = EXCLUDED.cuisine,
      category = EXCLUDED.category, address = EXCLUDED.address, phone = EXCLUDED.phone,
      website = EXCLUDED.website, price_range = EXCLUDED.price_range, rating = EXCLUDED.rating,
      rating_count = EXCLUDED.rating_count, service_options = EXCLUDED.service_options,
      opening_hours = EXCLUDED.opening_hours, latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude, notes = EXCLUDED.notes, updated_at = now()`,
    [
      profile.name, profile.name_local, profile.cuisine, profile.category, profile.address,
      profile.phone, profile.website, profile.price_range, profile.rating, profile.rating_count,
      profile.service_options, profile.opening_hours, profile.latitude, profile.longitude, profile.notes,
    ]
  );

  for (let i = 0; i < categories.length; i++) {
    await pool.query(
      'INSERT INTO menu_categories (name, sort_order) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
      [categories[i], i]
    );
  }

  const categoryRows = (await pool.query('SELECT id, name FROM menu_categories')).rows;
  const catId = (name) => categoryRows.find((c) => c.name === name)?.id;

  for (const [cat, name, description, price, isVeg] of items) {
    const exists = await pool.query('SELECT 1 FROM menu_items WHERE name = $1', [name]);
    if (exists.rowCount === 0) {
      await pool.query(
        'INSERT INTO menu_items (category_id, name, description, price, is_veg) VALUES ($1, $2, $3, $4, $5)',
        [catId(cat), name, description, price, isVeg]
      );
    }
  }

  console.log('Seed complete: restaurant profile, menu categories and items created.');
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
