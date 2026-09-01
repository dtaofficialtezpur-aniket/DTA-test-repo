const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM reservations ORDER BY reservation_time DESC').all());
});

router.post('/', (req, res) => {
  const { customer_id, party_size, reservation_time, notes } = req.body;
  if (!reservation_time) return res.status(400).json({ error: 'reservation_time is required' });

  const info = db
    .prepare(`
      INSERT INTO reservations (customer_id, party_size, reservation_time, notes)
      VALUES (?, ?, ?, ?)
    `)
    .run(customer_id || null, party_size || 1, reservation_time, notes || null);

  res.status(201).json(db.prepare('SELECT * FROM reservations WHERE id = ?').get(info.lastInsertRowid));
});

router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const valid = ['confirmed', 'seated', 'cancelled', 'completed', 'no-show'];
  if (!valid.includes(status)) {
    return res.status(400).json({ error: `status must be one of ${valid.join(', ')}` });
  }
  const info = db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Reservation not found' });
  res.json(db.prepare('SELECT * FROM reservations WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM reservations WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Reservation not found' });
  res.status(204).end();
});

module.exports = router;
