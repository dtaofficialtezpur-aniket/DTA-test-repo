const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/summary', (req, res) => {
  const totalCustomers = db.prepare('SELECT COUNT(*) AS c FROM customers').get().c;
  const totalOrders = db.prepare('SELECT COUNT(*) AS c FROM orders').get().c;
  const revenue = db
    .prepare("SELECT COALESCE(SUM(total_amount), 0) AS s FROM orders WHERE status != 'cancelled'")
    .get().s;
  const ordersToday = db
    .prepare("SELECT COUNT(*) AS c FROM orders WHERE date(created_at) = date('now')")
    .get().c;
  const revenueToday = db
    .prepare(`
      SELECT COALESCE(SUM(total_amount), 0) AS s FROM orders
      WHERE date(created_at) = date('now') AND status != 'cancelled'
    `)
    .get().s;
  const pendingOrders = db.prepare("SELECT COUNT(*) AS c FROM orders WHERE status IN ('pending','preparing')").get().c;
  const upcomingReservations = db
    .prepare("SELECT COUNT(*) AS c FROM reservations WHERE status = 'confirmed' AND reservation_time >= datetime('now')")
    .get().c;
  const topItems = db
    .prepare(`
      SELECT item_name, SUM(quantity) AS total_qty, SUM(subtotal) AS total_revenue
      FROM order_items GROUP BY item_name ORDER BY total_qty DESC LIMIT 5
    `)
    .all();
  const recentOrders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5').all();

  res.json({
    totalCustomers,
    totalOrders,
    revenue,
    ordersToday,
    revenueToday,
    pendingOrders,
    upcomingReservations,
    topItems,
    recentOrders,
  });
});

module.exports = router;
