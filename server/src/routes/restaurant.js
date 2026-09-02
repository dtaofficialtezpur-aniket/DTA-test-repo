const express = require('express');
const { pool } = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM restaurant_profile WHERE id = 1');
    res.json(rows[0] || null);
  } catch (err) { next(err); }
});

router.put('/', async (req, res, next) => {
  try {
    const {
      name, name_local, cuisine, category, address, phone, website,
      price_range, rating, rating_count, service_options, opening_hours,
      latitude, longitude, notes,
    } = req.body;

    const { rows } = await pool.query(
      `UPDATE restaurant_profile SET
        name = COALESCE($1, name),
        name_local = COALESCE($2, name_local),
        cuisine = COALESCE($3, cuisine),
        category = COALESCE($4, category),
        address = COALESCE($5, address),
        phone = COALESCE($6, phone),
        website = COALESCE($7, website),
        price_range = COALESCE($8, price_range),
        rating = COALESCE($9, rating),
        rating_count = COALESCE($10, rating_count),
        service_options = COALESCE($11, service_options),
        opening_hours = COALESCE($12, opening_hours),
        latitude = COALESCE($13, latitude),
        longitude = COALESCE($14, longitude),
        notes = COALESCE($15, notes),
        updated_at = now()
      WHERE id = 1
      RETURNING *`,
      [
        name ?? null, name_local ?? null, cuisine ?? null, category ?? null, address ?? null,
        phone ?? null, website ?? null, price_range ?? null, rating ?? null, rating_count ?? null,
        service_options ? JSON.stringify(service_options) : null,
        opening_hours ? JSON.stringify(opening_hours) : null,
        latitude ?? null, longitude ?? null, notes ?? null,
      ]
    );
    res.json(rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;
