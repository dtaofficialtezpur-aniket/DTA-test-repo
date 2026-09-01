const express = require('express');
const db = require('../db');

const router = express.Router();

function parseCustomer(row) {
  if (!row) return null;
  return { ...row, tags: row.tags ? JSON.parse(row.tags) : [] };
}

router.get('/', (req, res) => {
  const { q } = req.query;
  let rows;
  if (q) {
    const like = `%${q}%`;
    rows = db
      .prepare('SELECT * FROM customers WHERE name LIKE ? OR phone LIKE ? OR email LIKE ? ORDER BY created_at DESC')
      .all(like, like, like);
  } else {
    rows = db.prepare('SELECT * FROM customers ORDER BY created_at DESC').all();
  }
  res.json(rows.map(parseCustomer));
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Customer not found' });
  const orders = db
    .prepare('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC')
    .all(req.params.id);
  res.json({ ...parseCustomer(row), orders });
});

router.post('/', (req, res) => {
  const { name, phone, email, address, tags, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  try {
    const info = db
      .prepare(`
        INSERT INTO customers (name, phone, email, address, tags, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run(name, phone || null, email || null, address || null, tags ? JSON.stringify(tags) : null, notes || null);

    const row = db.prepare('SELECT * FROM customers WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(parseCustomer(row));
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'A customer with this phone already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Customer not found' });

  const { name, phone, email, address, tags, notes } = req.body;
  db.prepare(`
    UPDATE customers SET
      name = COALESCE(?, name),
      phone = COALESCE(?, phone),
      email = COALESCE(?, email),
      address = COALESCE(?, address),
      tags = COALESCE(?, tags),
      notes = COALESCE(?, notes)
    WHERE id = ?
  `).run(
    name ?? null,
    phone ?? null,
    email ?? null,
    address ?? null,
    tags ? JSON.stringify(tags) : null,
    notes ?? null,
    req.params.id
  );

  const row = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  res.json(parseCustomer(row));
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM customers WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Customer not found' });
  res.status(204).end();
});

module.exports = router;
