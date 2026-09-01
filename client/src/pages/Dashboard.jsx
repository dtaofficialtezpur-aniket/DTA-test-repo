import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard/summary').then(setSummary).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!summary) return <p>Loading...</p>;

  const cards = [
    { label: 'Orders Today', value: summary.ordersToday },
    { label: 'Revenue Today', value: `₹${summary.revenueToday}` },
    { label: 'Total Customers', value: summary.totalCustomers },
    { label: 'Total Orders', value: summary.totalOrders },
    { label: 'Total Revenue', value: `₹${summary.revenue}` },
    { label: 'Pending Orders', value: summary.pendingOrders },
    { label: 'Upcoming Reservations', value: summary.upcomingReservations },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="card-grid">
        {cards.map((c) => (
          <div className="card" key={c.label}>
            <div className="card-value">{c.value}</div>
            <div className="card-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <section>
          <h2>Top Selling Items</h2>
          <table>
            <thead>
              <tr><th>Item</th><th>Qty Sold</th><th>Revenue</th></tr>
            </thead>
            <tbody>
              {summary.topItems.length === 0 && (
                <tr><td colSpan={3}>No orders yet</td></tr>
              )}
              {summary.topItems.map((i) => (
                <tr key={i.item_name}>
                  <td>{i.item_name}</td>
                  <td>{i.total_qty}</td>
                  <td>₹{i.total_revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2>Recent Orders</h2>
          <table>
            <thead>
              <tr><th>#</th><th>Type</th><th>Status</th><th>Total</th></tr>
            </thead>
            <tbody>
              {summary.recentOrders.length === 0 && (
                <tr><td colSpan={4}>No orders yet</td></tr>
              )}
              {summary.recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.order_type}</td>
                  <td><span className={`badge status-${o.status}`}>{o.status}</span></td>
                  <td>₹{o.total_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
