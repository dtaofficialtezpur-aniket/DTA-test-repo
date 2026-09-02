const express = require('express');
const { pool } = require('../db');

const router = express.Router();

router.get('/categories', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM menu_categories ORDER BY sort_order, name');
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/categories', async (req, res, next) => {
  try {
    const { name, sort_order } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const { rows } = await pool.query(
      'INSERT INTO menu_categories (name, sort_order) VALUES ($1, $2) RETURNING *',
      [name, sort_order || 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

router.get('/items', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT mi.*, mc.name AS category_name
      FROM menu_items mi
      LEFT JOIN menu_categories mc ON mc.id = mi.category_id
      ORDER BY mc.sort_order, mi.name
    `);
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/items', async (req, res, next) => {
  try {
    const { category_id, name, description, price, is_veg, is_available } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'name and price are required' });
    }
    const { rows } = await pool.query(
      `INSERT INTO menu_items (category_id, name, description, price, is_veg, is_available)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [category_id || null, name, description || null, price, is_veg ?? true, is_available ?? true]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

router.put('/items/:id', async (req, res, next) => {
  try {
    const { category_id, name, description, price, is_veg, is_available } = req.body;
    const { rows } = await pool.query(
      `UPDATE menu_items SET
        category_id = COALESCE($1, category_id),
        name = COALESCE($2, name),
        description = COALESCE($3, description),
        price = COALESCE($4, price),
        is_veg = COALESCE($5, is_veg),
        is_available = COALESCE($6, is_available)
      WHERE id = $7
      RETURNING *`,
      [category_id ?? null, name ?? null, description ?? null, price ?? null, is_veg ?? null, is_available ?? null, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Menu item not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete('/items/:id', async (req, res, next) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM menu_items WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Menu item not found' });
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;
