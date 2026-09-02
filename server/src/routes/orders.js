const express = require('express');
const { pool } = require('../db');

const router = express.Router();

async function getOrderWithItems(id) {
  const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
  const order = rows[0];
  if (!order) return null;
  const items = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [id]);
  return { ...order, items: items.rows };
}

router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    const result = status
      ? await pool.query('SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC', [status])
      : await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const order = await getOrderWithItems(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) { next(err); }
});

// Create an order with line items in one transaction.
// body: { customer_id, order_type, table_number, notes, items: [{ menu_item_id, quantity }] }
router.post('/', async (req, res, next) => {
  const { customer_id, order_type, table_number, notes, items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items array is required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let total = 0;
    const resolvedItems = [];
    for (const it of items) {
      const { rows } = await client.query('SELECT * FROM menu_items WHERE id = $1', [it.menu_item_id]);
      const menuItem = rows[0];
      if (!menuItem) throw new Error(`Menu item ${it.menu_item_id} not found`);
      const quantity = it.quantity || 1;
      const subtotal = menuItem.price * quantity;
      total += subtotal;
      resolvedItems.push({ menu_item_id: menuItem.id, item_name: menuItem.name, unit_price: menuItem.price, quantity, subtotal });
    }

    const orderResult = await client.query(
      `INSERT INTO orders (customer_id, order_type, table_number, total_amount, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [customer_id || null, order_type || 'dine-in', table_number || null, total, notes || null]
    );
    const orderId = orderResult.rows[0].id;

    for (const it of resolvedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, item_name, unit_price, quantity, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, it.menu_item_id, it.item_name, it.unit_price, it.quantity, it.subtotal]
      );
    }

    if (customer_id) {
      await client.query(
        `UPDATE customers SET
          visit_count = visit_count + 1,
          total_spent = total_spent + $1,
          last_visit_at = now()
        WHERE id = $2`,
        [total, customer_id]
      );
    }

    await client.query('COMMIT');
    res.status(201).json(await getOrderWithItems(orderId));
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

router.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: `status must be one of ${valid.join(', ')}` });
    }
    const { rowCount } = await pool.query(
      'UPDATE orders SET status = $1, updated_at = now() WHERE id = $2',
      [status, req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(await getOrderWithItems(req.params.id));
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM orders WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Order not found' });
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;
