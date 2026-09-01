const express = require('express');
const db = require('../db');

const router = express.Router();

function parseProfile(row) {
  if (!row) return null;
  return {
    ...row,
    service_options: row.service_options ? JSON.parse(row.service_options) : [],
    opening_hours: row.opening_hours ? JSON.parse(row.opening_hours) : {},
  };
}

router.get('/', (req, res) => {
  const row = db.prepare('SELECT * FROM restaurant_profile WHERE id = 1').get();
  res.json(parseProfile(row));
});

router.put('/', (req, res) => {
  const {
    name, name_local, cuisine, category, address, phone, website,
    price_range, rating, rating_count, service_options, opening_hours,
    latitude, longitude, notes,
  } = req.body;

  db.prepare(`
    UPDATE restaurant_profile SET
      name = COALESCE(@name, name),
      name_local = COALESCE(@name_local, name_local),
      cuisine = COALESCE(@cuisine, cuisine),
      category = COALESCE(@category, category),
      address = COALESCE(@address, address),
      phone = COALESCE(@phone, phone),
      website = COALESCE(@website, website),
      price_range = COALESCE(@price_range, price_range),
      rating = COALESCE(@rating, rating),
      rating_count = COALESCE(@rating_count, rating_count),
      service_options = COALESCE(@service_options, service_options),
      opening_hours = COALESCE(@opening_hours, opening_hours),
      latitude = COALESCE(@latitude, latitude),
      longitude = COALESCE(@longitude, longitude),
      notes = COALESCE(@notes, notes),
      updated_at = datetime('now')
    WHERE id = 1
  `).run({
    name: name ?? null,
    name_local: name_local ?? null,
    cuisine: cuisine ?? null,
    category: category ?? null,
    address: address ?? null,
    phone: phone ?? null,
    website: website ?? null,
    price_range: price_range ?? null,
    rating: rating ?? null,
    rating_count: rating_count ?? null,
    service_options: service_options ? JSON.stringify(service_options) : null,
    opening_hours: opening_hours ? JSON.stringify(opening_hours) : null,
    latitude: latitude ?? null,
    longitude: longitude ?? null,
    notes: notes ?? null,
  });

  const row = db.prepare('SELECT * FROM restaurant_profile WHERE id = 1').get();
  res.json(parseProfile(row));
});

module.exports = router;
