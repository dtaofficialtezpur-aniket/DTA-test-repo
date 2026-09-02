const express = require('express');
const { pool } = require('../db');

const router = express.Router();

router.get('/summary', async (req, res, next) => {
  try {
    const totalCustomers = (await pool.query('SELECT COUNT(*) AS c FROM customers')).rows[0].c;
    const totalOrders = (await pool.query('SELECT COUNT(*) AS c FROM orders')).rows[0].c;
    const revenue = (await pool.query(
      "SELECT COALESCE(SUM(total_amount), 0) AS s FROM orders WHERE status != 'cancelled'"
    )).rows[0].s;
    const ordersToday = (await pool.query(
      "SELECT COUNT(*) AS c FROM orders WHERE created_at::date = current_date"
    )).rows[0].c;
    const revenueToday = (await pool.query(
      `SELECT COALESCE(SUM(total_amount), 0) AS s FROM orders
       WHERE created_at::date = current_date AND status != 'cancelled'`
    )).rows[0].s;
    const pendingOrders = (await pool.query(
      "SELECT COUNT(*) AS c FROM orders WHERE status IN ('pending','preparing')"
    )).rows[0].c;
    const upcomingReservations = (await pool.query(
      "SELECT COUNT(*) AS c FROM reservations WHERE status = 'confirmed' AND reservation_time >= now()"
    )).rows[0].c;
    const topItems = (await pool.query(`
      SELECT item_name, SUM(quantity) AS total_qty, SUM(subtotal) AS total_revenue
      FROM order_items GROUP BY item_name ORDER BY total_qty DESC LIMIT 5
    `)).rows;
    const recentOrders = (await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT 5'
    )).rows;

    res.json({
      totalCustomers: Number(totalCustomers),
      totalOrders: Number(totalOrders),
      revenue: Number(revenue),
      ordersToday: Number(ordersToday),
      revenueToday: Number(revenueToday),
      pendingOrders: Number(pendingOrders),
      upcomingReservations: Number(upcomingReservations),
      topItems,
      recentOrders,
    });
  } catch (err) { next(err); }
});

module.exports = router;
