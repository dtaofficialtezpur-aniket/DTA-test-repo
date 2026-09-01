const express = require('express');
const db = require('../db');

const router = express.Router();

function getOrderWithItems(id) {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  if (!order) return null;
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(id);
  return { ...order, items };
}

router.get('/', (req, res) => {
  const { status } = req.query;
  const orders = status
    ? db.prepare('SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC').all(status)
    : db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  res.json(orders);
});

router.get('/:id', (req, res) => {
  const order = getOrderWithItems(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// Create an order with line items in one transaction.
// body: { customer_id, order_type, table_number, notes, items: [{ menu_item_id, quantity }] }
router.post('/', (req, res) => {
  const { customer_id, order_type, table_number, notes, items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items array is required' });
  }

  const createOrder = db.transaction(() => {
    const menuItemStmt = db.prepare('SELECT * FROM menu_items WHERE id = ?');
    let total = 0;
    const resolvedItems = items.map((it) => {
      const menuItem = menuItemStmt.get(it.menu_item_id);
      if (!menuItem) throw new Error(`Menu item ${it.menu_item_id} not found`);
      const quantity = it.quantity || 1;
      const subtotal = menuItem.price * quantity;
      total += subtotal;
      return { menu_item_id: menuItem.id, item_name: menuItem.name, unit_price: menuItem.price, quantity, subtotal };
    });

    const orderInfo = db
      .prepare(`
        INSERT INTO orders (customer_id, order_type, table_number, total_amount, notes)
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(customer_id || null, order_type || 'dine-in', table_number || null, total, notes || null);

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, menu_item_id, item_name, unit_price, quantity, subtotal)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    resolvedItems.forEach((it) =>
      insertItem.run(orderInfo.lastInsertRowid, it.menu_item_id, it.item_name, it.unit_price, it.quantity, it.subtotal)
    );

    if (customer_id) {
      db.prepare(`
        UPDATE customers SET
          visit_count = visit_count + 1,
          total_spent = total_spent + ?,
          last_visit_at = datetime('now')
        WHERE id = ?
      `).run(total, customer_id);
    }

    return orderInfo.lastInsertRowid;
  });

  try {
    const id = createOrder();
    res.status(201).json(getOrderWithItems(id));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
  if (!valid.includes(status)) {
    return res.status(400).json({ error: `status must be one of ${valid.join(', ')}` });
  }
  const info = db
    .prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?")
    .run(status, req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Order not found' });
  res.json(getOrderWithItems(req.params.id));
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM orders WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Order not found' });
  res.status(204).end();
});

module.exports = router;
