const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/categories', (req, res) => {
  res.json(db.prepare('SELECT * FROM menu_categories ORDER BY sort_order, name').all());
});

router.post('/categories', (req, res) => {
  const { name, sort_order } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const info = db
    .prepare('INSERT INTO menu_categories (name, sort_order) VALUES (?, ?)')
    .run(name, sort_order || 0);
  res.status(201).json(db.prepare('SELECT * FROM menu_categories WHERE id = ?').get(info.lastInsertRowid));
});

router.get('/items', (req, res) => {
  const rows = db
    .prepare(`
      SELECT mi.*, mc.name AS category_name
      FROM menu_items mi
      LEFT JOIN menu_categories mc ON mc.id = mi.category_id
      ORDER BY mc.sort_order, mi.name
    `)
    .all();
  res.json(rows);
});

router.post('/items', (req, res) => {
  const { category_id, name, description, price, is_veg, is_available } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'name and price are required' });
  }
  const info = db
    .prepare(`
      INSERT INTO menu_items (category_id, name, description, price, is_veg, is_available)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .run(category_id || null, name, description || null, price, is_veg ?? 1, is_available ?? 1);
  res.status(201).json(db.prepare('SELECT * FROM menu_items WHERE id = ?').get(info.lastInsertRowid));
});

router.put('/items/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Menu item not found' });

  const { category_id, name, description, price, is_veg, is_available } = req.body;
  db.prepare(`
    UPDATE menu_items SET
      category_id = COALESCE(?, category_id),
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      price = COALESCE(?, price),
      is_veg = COALESCE(?, is_veg),
      is_available = COALESCE(?, is_available)
    WHERE id = ?
  `).run(
    category_id ?? null,
    name ?? null,
    description ?? null,
    price ?? null,
    is_veg ?? null,
    is_available ?? null,
    req.params.id
  );
  res.json(db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id));
});

router.delete('/items/:id', (req, res) => {
  const info = db.prepare('DELETE FROM menu_items WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Menu item not found' });
  res.status(204).end();
});

module.exports = router;
