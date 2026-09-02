const express = require('express');
const { pool } = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM reservations ORDER BY reservation_time DESC');
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { customer_id, party_size, reservation_time, notes } = req.body;
    if (!reservation_time) return res.status(400).json({ error: 'reservation_time is required' });

    const { rows } = await pool.query(
      `INSERT INTO reservations (customer_id, party_size, reservation_time, notes)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [customer_id || null, party_size || 1, reservation_time, notes || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

router.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = ['confirmed', 'seated', 'cancelled', 'completed', 'no-show'];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: `status must be one of ${valid.join(', ')}` });
    }
    const { rows } = await pool.query(
      'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Reservation not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM reservations WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Reservation not found' });
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;
