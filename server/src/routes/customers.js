const express = require('express');
const { pool } = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { q } = req.query;
    let result;
    if (q) {
      const like = `%${q}%`;
      result = await pool.query(
        'SELECT * FROM customers WHERE name ILIKE $1 OR phone ILIKE $1 OR email ILIKE $1 ORDER BY created_at DESC',
        [like]
      );
    } else {
      result = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    }
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM customers WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Customer not found' });
    const orders = await pool.query('SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC', [req.params.id]);
    res.json({ ...rows[0], orders: orders.rows });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, phone, email, address, tags, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });

    const { rows } = await pool.query(
      `INSERT INTO customers (name, phone, email, address, tags, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, phone || null, email || null, address || null, tags ? JSON.stringify(tags) : null, notes || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A customer with this phone already exists' });
    }
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, phone, email, address, tags, notes } = req.body;
    const { rows } = await pool.query(
      `UPDATE customers SET
        name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        email = COALESCE($3, email),
        address = COALESCE($4, address),
        tags = COALESCE($5, tags),
        notes = COALESCE($6, notes)
      WHERE id = $7
      RETURNING *`,
      [name ?? null, phone ?? null, email ?? null, address ?? null, tags ? JSON.stringify(tags) : null, notes ?? null, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Customer not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM customers WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Customer not found' });
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;
